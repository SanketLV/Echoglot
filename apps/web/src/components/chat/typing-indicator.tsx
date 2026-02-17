'use client';

export function TypingIndicator() {
  return (
    <div className="flex items-center gap-1">
      <span className="text-body-xs text-text-tertiary">typing</span>
      <div className="flex gap-0.5">
        <div className="h-1 w-1 rounded-full bg-text-tertiary animate-bounce" style={{ animationDelay: '0ms' }} />
        <div className="h-1 w-1 rounded-full bg-text-tertiary animate-bounce" style={{ animationDelay: '150ms' }} />
        <div className="h-1 w-1 rounded-full bg-text-tertiary animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
    </div>
  );
}
