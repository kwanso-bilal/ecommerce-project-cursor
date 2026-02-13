/**
 * REST API service layer using public mock APIs.
 * Auth: DummyJSON (https://dummyjson.com/docs/auth)
 * Other data: JSONPlaceholder / DummyJSON as needed.
 */

const DUMMY_JSON_BASE = 'https://dummyjson.com';

export type ApiError = { message: string; status?: number };

// --- Auth types (aligned with existing AuthUser, AuthPayload, MessagePayload) ---

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

// --- Base request helper ---

async function request<T>(
  url: string,
  options: RequestInit = {}
): Promise<{ data?: T; error?: ApiError }> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  try {
    const res = await fetch(url, { ...options, headers });
    const json = await res.json().catch(() => ({}));

    if (!res.ok) {
      return {
        error: {
          message: (json.message ?? json.error ?? 'Request failed') as string,
          status: res.status,
        },
      };
    }
    return { data: json as T };
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Network error';
    return { error: { message } };
  }
}

// --- Auth API (DummyJSON + mock for flows not provided by DummyJSON) ---

/** Resolve email to username via DummyJSON filter (auth expects username, not email) */
async function findUsernameByEmail(email: string): Promise<string | null> {
  const encoded = encodeURIComponent(email);
  const { data } = await request<{ users: Array<{ username: string }> }>(
    `${DUMMY_JSON_BASE}/users/filter?key=email&value=${encoded}`
  );
  const username = data?.users?.[0]?.username;
  return username ?? null;
}

/** POST /auth/login – uses DummyJSON; accepts email or username (resolves email → username) */
export async function login(
  emailOrUsername: string,
  password: string
): Promise<{ data?: AuthPayload; error?: ApiError }> {
  let username = emailOrUsername;
  const looksLikeEmail = emailOrUsername.includes('@');

  const { data, error } = await request<{
    id: number;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    accessToken?: string;
  }>(`${DUMMY_JSON_BASE}/auth/login`, {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });

  if (error && looksLikeEmail) {
    const resolved = await findUsernameByEmail(emailOrUsername);
    if (resolved) {
      const retry = await request<{
        id: number;
        username: string;
        email: string;
        firstName: string;
        lastName: string;
        accessToken?: string;
      }>(`${DUMMY_JSON_BASE}/auth/login`, {
        method: 'POST',
        body: JSON.stringify({ username: resolved, password }),
      });
      if (retry.error) return { error: retry.error };
      const d = retry.data;
      if (!d) return { error: { message: 'Invalid response' } };
      const name = [d.firstName, d.lastName].filter(Boolean).join(' ') || d.username;
      const payload: AuthPayload = {
        accessToken: d.accessToken ?? `mock-token-${d.id}`,
        user: {
          id: String(d.id),
          email: d.email ?? emailOrUsername,
          name,
          emailVerified: true,
        },
      };
      return { data: payload };
    }
  }

  if (error) return { error };

  if (!data) return { error: { message: 'Invalid response' } };

  const name = [data.firstName, data.lastName].filter(Boolean).join(' ') || data.username;
  const payload: AuthPayload = {
    accessToken: data.accessToken ?? `mock-token-${data.id}`,
    user: {
      id: String(data.id),
      email: data.email ?? emailOrUsername,
      name,
      emailVerified: true,
    },
  };
  return { data: payload };
}

/** POST sign up – DummyJSON users/add then return mock auth payload */
export async function signUp(input: {
  email: string;
  name: string;
  password: string;
}): Promise<{ data?: AuthPayload; error?: ApiError }> {
  const [first, ...rest] = input.name.trim().split(/\s+/);
  const firstName = first ?? '';
  const lastName = rest.join(' ') ?? '';
  const username = input.email.replace(/@.*/, '').replace(/\W/g, '') || 'user';

  const { data: userData, error: addError } = await request<{ id: number }>(
    `${DUMMY_JSON_BASE}/users/add`,
    {
      method: 'POST',
      body: JSON.stringify({
        email: input.email,
        username,
        firstName,
        lastName,
        password: input.password,
      }),
    }
  );

  if (addError) return { error: addError };
  if (!userData) return { error: { message: 'Failed to create user' } };

  const payload: AuthPayload = {
    accessToken: `mock-token-${userData.id}`,
    user: {
      id: String(userData.id),
      email: input.email,
      name: input.name,
      emailVerified: false,
    },
  };
  return { data: payload };
}

/** Forgot password – mock success (no real email) */
export async function forgotPassword(_email: string): Promise<{ data?: MessagePayload; error?: ApiError }> {
  await new Promise((r) => setTimeout(r, 600));
  return {
    data: {
      success: true,
      message: 'If an account exists for that email, we\'ve sent instructions to reset your password.',
    },
  };
}

/** Reset password – mock success */
export async function resetPassword(_input: {
  token: string;
  newPassword: string;
}): Promise<{ data?: MessagePayload; error?: ApiError }> {
  await new Promise((r) => setTimeout(r, 500));
  return {
    data: { success: true, message: 'Your password has been reset. You can now log in.' },
  };
}

/** Verify email – mock success */
export async function verifyEmail(token: string): Promise<{ data?: MessagePayload; error?: ApiError }> {
  await new Promise((r) => setTimeout(r, 500));
  if (!token) {
    return { error: { message: 'Invalid or expired verification link.' } };
  }
  return {
    data: { success: true, message: 'Email verified successfully.' },
  };
}
