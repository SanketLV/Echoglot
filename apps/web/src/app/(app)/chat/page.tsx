import { MessageSquare } from 'lucide-react';

export default function ChatPage() {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="text-center space-y-4">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-accent-500/10">
          <MessageSquare className="h-8 w-8 text-accent-500" />
        </div>
        <h2 className="text-heading-md text-text-primary">Your messages</h2>
        <p className="text-body-md text-text-secondary max-w-sm">
          Select a conversation or start a new one to begin chatting across languages.
        </p>
      </div>
    </div>
  );
}
