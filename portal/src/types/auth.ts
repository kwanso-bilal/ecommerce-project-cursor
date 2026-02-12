export interface AuthUser {
  id: string;
  email: string;
  name: string;
  emailVerified: boolean;
}

export interface AuthPayload {
  accessToken: string;
  user: AuthUser;
}

export interface MessagePayload {
  success: boolean;
  message: string;
}
