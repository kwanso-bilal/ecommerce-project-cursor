import { useCallback } from 'react';

const AUTH_TOKEN_KEY = 'auth_token';

export function useAuth() {
  const getToken = useCallback(() => localStorage.getItem(AUTH_TOKEN_KEY), []);
  const setToken = useCallback((token: string | null) => {
    if (token) {
      localStorage.setItem(AUTH_TOKEN_KEY, token);
    } else {
      localStorage.removeItem(AUTH_TOKEN_KEY);
    }
  }, []);
  const isAuthenticated = useCallback(() => !!getToken(), [getToken]);
  const logout = useCallback(() => setToken(null), [setToken]);

  return { getToken, setToken, isAuthenticated, logout };
}
