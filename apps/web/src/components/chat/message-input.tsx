'use client';

import { useCallback, useRef, useState } from 'react';
import { Send } from 'lucide-react';
import { Button } from '@echoglot/ui';

interface MessageInputProps {
  onSend: (content: string) => void;
  onTypingStart: () => void;
  onTypingStop: () => void;
}

const MAX_LENGTH = 5000;

export function MessageInput({ onSend, onTypingStart, onTypingStop }: MessageInputProps) {
  const [value, setValue] = useState('');
  const typingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isTyping = useRef(false);

  const handleTyping = useCallback(() => {
    if (!isTyping.current) {
      isTyping.current = true;
      onTypingStart();
    }

    if (typingTimer.current) clearTimeout(typingTimer.current);
    typingTimer.current = setTimeout(() => {
      isTyping.current = false;
      onTypingStop();
    }, 3000);
  }, [onTypingStart, onTypingStop]);

  const handleSend = () => {
    const trimmed = value.trim();
    if (!trimmed) return;

    onSend(trimmed);
    setValue('');

    if (isTyping.current) {
      isTyping.current = false;
      onTypingStop();
      if (typingTimer.current) clearTimeout(typingTimer.current);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t border-border-default p-4">
      <div className="flex items-end gap-2">
        <div className="relative flex-1">
          <textarea
            value={value}
            onChange={(e) => {
              if (e.target.value.length <= MAX_LENGTH) {
                setValue(e.target.value);
                handleTyping();
              }
            }}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            rows={1}
            className="w-full resize-none rounded-xl border border-border-default bg-subtle px-4 py-2.5 text-body-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-1 focus:ring-accent-500"
            style={{ minHeight: '40px', maxHeight: '120px' }}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = 'auto';
              target.style.height = Math.min(target.scrollHeight, 120) + 'px';
            }}
          />
          {value.length > MAX_LENGTH * 0.9 && (
            <span className="absolute right-3 bottom-2 text-[10px] text-text-tertiary">
              {value.length}/{MAX_LENGTH}
            </span>
          )}
        </div>
        <Button
          onClick={handleSend}
          disabled={!value.trim()}
          size="icon"
          className="h-10 w-10 shrink-0 rounded-xl bg-accent-500 text-white hover:bg-accent-500/90 disabled:opacity-40"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
