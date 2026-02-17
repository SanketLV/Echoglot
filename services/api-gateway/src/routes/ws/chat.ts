import type { FastifyInstance } from 'fastify';
import { supabaseAdmin } from '../../config/supabase.js';
import { createMessage, createTranslation } from '../../db/messages.js';
import { translateText } from '../../services/translation/index.js';
import { createPubSub } from '../../services/pubsub.js';

export default async function chatWsRoute(fastify: FastifyInstance): Promise<void> {
  fastify.get('/ws/chat', { websocket: true }, async (socket, request) => {
    // Auth via query param
    const url = new URL(request.url, `http://${request.headers.host}`);
    const token = url.searchParams.get('token');

    if (!token) {
      socket.close(4001, 'Missing auth token');
      return;
    }

    const { data, error } = await supabaseAdmin.auth.getUser(token);
    if (error || !data.user) {
      socket.close(4001, 'Invalid auth token');
      return;
    }

    const userId = data.user.id;
    const pubsub = createPubSub();

    // Subscribe to user's channel
    await pubsub.subscribe(userId, (message) => {
      if (socket.readyState === socket.OPEN) {
        socket.send(message);
      }
    });

    // Ping/pong heartbeat
    const pingInterval = setInterval(() => {
      if (socket.readyState === socket.OPEN) {
        socket.ping();
      }
    }, 30000);

    // Handle messages from client
    socket.on('message', async (raw: Buffer | string) => {
      try {
        const event = JSON.parse(raw.toString());

        switch (event.type) {
          case 'message.send': {
            const { conversationId, content } = event;

            if (!content || typeof content !== 'string' || content.length > 5000) {
              socket.send(JSON.stringify({
                type: 'error',
                code: 'INVALID_MESSAGE',
                message: 'Message must be 1-5000 characters.',
              }));
              return;
            }

            // Store original message
            const message = await createMessage(conversationId, userId, content);

            // Send ack to sender
            socket.send(JSON.stringify({
              type: 'message.ack',
              messageId: message.id,
              conversationId,
            }));

            // Get conversation members to translate and deliver
            const { data: members } = await supabaseAdmin
              .from('conversation_members')
              .select('user_id, user:users(preferred_lang, native_lang)')
              .eq('conversation_id', conversationId);

            if (!members) return;

            // Get sender's language
            const sender = members.find((m: any) => m.user_id === userId);
            const senderLang = (sender?.user as any)?.native_lang ?? 'en';

            // Translate and deliver to each other member
            for (const member of members) {
              if (member.user_id === userId) continue;

              const targetLang = (member.user as any)?.preferred_lang ?? 'en';

              let translatedContent = content;
              let engine = 'none';

              if (targetLang !== senderLang) {
                try {
                  const result = await translateText(content, senderLang, targetLang);
                  translatedContent = result.translatedText;
                  engine = result.engine;

                  // Store translation
                  await createTranslation(message.id, targetLang, translatedContent, engine);
                } catch {
                  // If translation fails, send original
                  translatedContent = content;
                  engine = 'failed';
                }
              }

              // Publish to recipient via PubSub
              await pubsub.publish(member.user_id, {
                type: 'message.receive',
                conversationId,
                message: {
                  id: message.id,
                  conversationId: message.conversation_id,
                  senderId: message.sender_id,
                  content: translatedContent,
                  createdAt: message.created_at,
                  translation: targetLang !== senderLang
                    ? {
                        targetLang,
                        translatedContent,
                        engine,
                      }
                    : null,
                },
              });
            }
            break;
          }

          case 'typing.start':
          case 'typing.stop': {
            const { conversationId } = event;

            // Get other members and notify them
            const { data: members } = await supabaseAdmin
              .from('conversation_members')
              .select('user_id')
              .eq('conversation_id', conversationId)
              .neq('user_id', userId);

            if (members) {
              for (const member of members) {
                await pubsub.publish(member.user_id, {
                  type: event.type,
                  conversationId,
                  userId,
                });
              }
            }
            break;
          }

          case 'read.receipt': {
            const { conversationId } = event;

            // Update last_read_at
            await supabaseAdmin
              .from('conversation_members')
              .update({ last_read_at: new Date().toISOString() })
              .eq('conversation_id', conversationId)
              .eq('user_id', userId);

            // Notify other members
            const { data: members } = await supabaseAdmin
              .from('conversation_members')
              .select('user_id')
              .eq('conversation_id', conversationId)
              .neq('user_id', userId);

            if (members) {
              for (const member of members) {
                await pubsub.publish(member.user_id, {
                  type: 'read.receipt',
                  conversationId,
                  userId,
                });
              }
            }
            break;
          }

          case 'ping': {
            socket.send(JSON.stringify({ type: 'pong' }));
            break;
          }
        }
      } catch {
        socket.send(JSON.stringify({
          type: 'error',
          code: 'INTERNAL_ERROR',
          message: 'Failed to process message.',
        }));
      }
    });

    // Cleanup on disconnect
    socket.on('close', async () => {
      clearInterval(pingInterval);
      await pubsub.unsubscribe(userId);
      await pubsub.cleanup();
    });
  });
}
