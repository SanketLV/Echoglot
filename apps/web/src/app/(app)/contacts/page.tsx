'use client';

import { useState } from 'react';
import { UserPlus, Trash2, Mail, Loader2 } from 'lucide-react';

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Input,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@echoglot/ui';

import { useContacts, useAddContact, useDeleteContact } from '@/hooks/use-contacts';

export default function ContactsPage() {
  const { data: contacts, isLoading } = useContacts();
  const addContact = useAddContact();
  const deleteContact = useDeleteContact();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleAdd = async () => {
    setError('');
    const trimmed = email.trim();
    if (!trimmed) return;

    try {
      await addContact.mutateAsync(trimmed);
      setEmail('');
      setDialogOpen(false);
    } catch (err: any) {
      const msg =
        err?.error?.message ?? err?.message ?? 'Failed to add contact.';
      setError(msg);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteContact.mutateAsync(id);
    } catch {
      // silently handle — toast could be added later
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-app-title text-text-primary">Contacts</h1>
          <p className="mt-1 text-body-md text-text-secondary">
            Manage people you can chat with
          </p>
        </div>
        <Button onClick={() => setDialogOpen(true)} className="gap-2">
          <UserPlus className="h-4 w-4" />
          Add Contact
        </Button>
      </div>

      {/* Contact list */}
      {isLoading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-text-tertiary" />
        </div>
      ) : !contacts || contacts.length === 0 ? (
        <div className="glass-panel py-16 text-center space-y-3">
          <Mail className="mx-auto h-10 w-10 text-text-tertiary" />
          <p className="text-body-md text-text-secondary">No contacts yet</p>
          <p className="text-body-sm text-text-tertiary">
            Add a contact by their email to start chatting
          </p>
          <Button
            variant="outline"
            onClick={() => setDialogOpen(true)}
            className="mt-2 gap-2"
          >
            <UserPlus className="h-4 w-4" />
            Add your first contact
          </Button>
        </div>
      ) : (
        <div className="space-y-2">
          {contacts.map((contact: any) => {
            const user = contact.contact ?? contact.contactUser;
            const name =
              user?.display_name ?? user?.displayName ?? 'Unknown';
            const avatarUrl = user?.avatar_url ?? user?.avatarUrl;
            const initials = name
              .split(' ')
              .map((n: string) => n[0])
              .join('')
              .toUpperCase()
              .slice(0, 2);

            return (
              <div
                key={contact.id}
                className="glass-panel flex items-center gap-4 px-4 py-3"
              >
                <Avatar className="h-10 w-10">
                  <AvatarImage src={avatarUrl} alt={name} />
                  <AvatarFallback className="text-sm">{initials}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-body-sm font-medium text-text-primary">
                    {name}
                  </p>
                  <p className="truncate text-body-xs text-text-tertiary">
                    {user?.email ?? ''}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 shrink-0 text-text-tertiary hover:text-red-400"
                  onClick={() => handleDelete(contact.id)}
                  disabled={deleteContact.isPending}
                  aria-label={`Remove ${name}`}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            );
          })}
        </div>
      )}

      {/* Add contact dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="glass-elevated border-border-default sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-text-primary">Add Contact</DialogTitle>
            <DialogDescription className="text-text-secondary">
              Enter the email of a registered Echoglot user.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <Input
              placeholder="user@example.com"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError('');
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAdd();
              }}
              autoFocus
            />
            {error && (
              <p className="text-body-xs text-red-400">{error}</p>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setDialogOpen(false);
                setEmail('');
                setError('');
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAdd}
              disabled={!email.trim() || addContact.isPending}
              className="gap-2"
            >
              {addContact.isPending && (
                <Loader2 className="h-4 w-4 animate-spin" />
              )}
              Add
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
