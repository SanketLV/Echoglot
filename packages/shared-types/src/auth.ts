import { User } from './user';
import { ApiResponse } from './api';

export interface RegisterInput {
  email: string;
  password: string;
  displayName: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface AuthSession {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  user: User;
}

export type AuthResponse = ApiResponse<AuthSession>;
