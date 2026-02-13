import { useCallback } from 'react';
import { STORAGE_KEYS } from '../constants';

export interface StoredAuthUser {
  id: string;
  email: string;
  name: string;
  role?: string;
}

export function useAuth() {
  const getToken = useCallback(() => localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN), []);
  const setToken = useCallback((token: string | null) => {
    if (token) {
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
    } else {
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    }
  }, []);
  const getUser = useCallback((): StoredAuthUser | null => {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.AUTH_USER);
      if (!raw) return null;
      return JSON.parse(raw) as StoredAuthUser;
    } catch {
      return null;
    }
  }, []);
  const setUser = useCallback((user: StoredAuthUser | null) => {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
    }
  }, []);
  const isAuthenticated = useCallback(() => !!getToken(), [getToken]);
  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
  }, [setToken, setUser]);

  return { getToken, setToken, getUser, setUser, isAuthenticated, logout };
}
