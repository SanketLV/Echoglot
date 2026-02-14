import { ContactStatus } from './enums';
import { UserProfile } from './user';

export interface Contact {
  id: string;
  userId: string;
  contactUserId: string;
  nickname: string | null;
  status: ContactStatus;
  createdAt: string;
}

export interface ContactWithUser extends Contact {
  contactUser: UserProfile;
}
