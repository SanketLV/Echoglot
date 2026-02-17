'use client';

import { useState } from 'react';
import type { MessageWithTranslation } from '@echoglot/shared-types';
import { cn } from '@echoglot/ui/lib/utils';
import { Button } from '@echoglot/ui';
import { Languages } from 'lucide-react';
import { useOriginalMessage } from '@/hooks/use-messages';

interface MessageBubbleProps {
  message: MessageWithTranslation;
  isSent: boolean;
  conversationId: string;
}

export function MessageBubble({ message, isSent, conversationId }: MessageBubbleProps) {
  const [showOriginal, setShowOriginal] = useState(false);
  const translation = message.translation;
  const hasTranslation = !!translation;

  const { data: original } = useOriginalMessage(
    conversationId,
    message.id,
    showOriginal && hasTranslation,
  );

  const displayText = showOriginal && original
    ? original.content
    : translation?.translatedContent ?? message.content;

  const time = new Date(message.createdAt).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className={cn('flex', isSent ? 'justify-end' : 'justify-start')}>
      <div
        className={cn(
          'max-w-[70%] rounded-2xl px-4 py-2.5',
          isSent
            ? 'bg-accent-500 text-white'
            : 'glass-panel text-text-primary',
        )}
      >
        <p className="text-body-sm whitespace-pre-wrap break-words">{displayText}</p>
        <div className={cn(
          'flex items-center gap-2 mt-1',
          isSent ? 'justify-end' : 'justify-start',
        )}>
          {hasTranslation && !isSent && (
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                'h-5 px-1.5 text-[10px]',
                isSent ? 'text-white/70 hover:text-white' : 'text-text-tertiary hover:text-text-secondary',
              )}
              onClick={() => setShowOriginal(!showOriginal)}
            >
              <Languages className="h-3 w-3 mr-1" />
              {showOriginal ? 'Translated' : 'Original'}
            </Button>
          )}
          <span className={cn(
            'text-[10px]',
            isSent ? 'text-white/60' : 'text-text-tertiary',
          )}>
            {time}
          </span>
        </div>
      </div>
    </div>
  );
}
