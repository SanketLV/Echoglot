export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  createdAt: string;
}

export interface MessageTranslation {
  id: string;
  messageId: string;
  targetLang: string;
  translatedContent: string;
  engine: string;
  createdAt: string;
}

export interface MessageWithTranslation extends Message {
  translation?: MessageTranslation;
}

// WebSocket event types

export interface ChatMessageSend {
  type: 'message.send';
  conversationId: string;
  content: string;
}

export interface ChatMessageReceive {
  type: 'message.receive';
  message: MessageWithTranslation;
  conversationId: string;
}

export interface ChatMessageAck {
  type: 'message.ack';
  messageId: string;
  conversationId: string;
}

export interface TypingEvent {
  type: 'typing.start' | 'typing.stop';
  conversationId: string;
  userId: string;
}

export interface ReadReceiptEvent {
  type: 'read.receipt';
  conversationId: string;
  userId: string;
}

export interface WsErrorEvent {
  type: 'error';
  code: string;
  message: string;
}

export type WsChatEvent =
  | ChatMessageSend
  | ChatMessageReceive
  | ChatMessageAck
  | TypingEvent
  | ReadReceiptEvent
  | WsErrorEvent;
