import { useCallback } from 'react';

const AUTH_TOKEN_KEY = 'auth_token';
const AUTH_USER_KEY = 'auth_user';

export interface StoredAuthUser {
  id: string;
  email: string;
  name: string;
  role?: string;
}

export function useAuth() {
  const getToken = useCallback(() => localStorage.getItem(AUTH_TOKEN_KEY), []);
  const setToken = useCallback((token: string | null) => {
    if (token) {
      localStorage.setItem(AUTH_TOKEN_KEY, token);
    } else {
      localStorage.removeItem(AUTH_TOKEN_KEY);
    }
  }, []);
  const getUser = useCallback((): StoredAuthUser | null => {
    try {
      const raw = localStorage.getItem(AUTH_USER_KEY);
      if (!raw) return null;
      return JSON.parse(raw) as StoredAuthUser;
    } catch {
      return null;
    }
  }, []);
  const setUser = useCallback((user: StoredAuthUser | null) => {
    if (user) {
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_USER_KEY);
    }
  }, []);
  const isAuthenticated = useCallback(() => !!getToken(), [getToken]);
  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
  }, [setToken, setUser]);

  return { getToken, setToken, getUser, setUser, isAuthenticated, logout };
}
