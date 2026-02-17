'use client';

import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage, Dialog, DialogContent, DialogHeader, DialogTitle } from '@echoglot/ui';
import { useContacts } from '@/hooks/use-contacts';
import { useCreateConversation } from '@/hooks/use-conversations';

interface NewChatDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NewChatDialog({ open, onOpenChange }: NewChatDialogProps) {
  const router = useRouter();
  const { data: contacts } = useContacts();
  const createConversation = useCreateConversation();

  const handleSelect = async (contactUserId: string) => {
    const conversation = await createConversation.mutateAsync(contactUserId);
    onOpenChange(false);
    router.push(`/chat/${conversation.id}`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-elevated border-border-default sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-text-primary">New Conversation</DialogTitle>
        </DialogHeader>
        <div className="max-h-[400px] overflow-y-auto space-y-1 mt-4">
          {(contacts ?? []).map((contact: any) => {
            const contactUser = contact.contact ?? contact.contactUser;
            const name = contactUser?.display_name ?? contactUser?.displayName ?? 'Unknown';
            const avatar = contactUser?.avatar_url ?? contactUser?.avatarUrl;
            const initials = name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);

            return (
              <button
                key={contact.id}
                onClick={() => handleSelect(contactUser?.id ?? contact.contact_user_id)}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-subtle"
                disabled={createConversation.isPending}
              >
                <Avatar className="h-9 w-9">
                  <AvatarImage src={avatar} alt={name} />
                  <AvatarFallback className="text-xs">{initials}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-body-sm font-medium text-text-primary">{name}</p>
                  <p className="text-body-xs text-text-tertiary">{contactUser?.email ?? ''}</p>
                </div>
              </button>
            );
          })}
          {(!contacts || contacts.length === 0) && (
            <p className="py-8 text-center text-body-sm text-text-tertiary">
              No contacts yet. Add a contact first.
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
