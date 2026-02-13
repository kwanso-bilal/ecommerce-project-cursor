import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import type { ReactNode } from 'react';
import { createContext, useCallback, useContext, useMemo, useState } from 'react';

export type Severity = 'success' | 'error' | 'info' | 'warning';

interface NotificationState {
  open: boolean;
  message: string;
  severity: Severity;
}

interface NotificationContextValue {
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
  showInfo: (message: string) => void;
  showWarning: (message: string) => void;
}

const NotificationContext = createContext<NotificationContextValue | null>(null);

const AUTO_HIDE_MS = 5000;

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<NotificationState>({
    open: false,
    message: '',
    severity: 'info',
  });

  const show = useCallback((message: string, severity: Severity) => {
    setState({ open: true, message, severity });
  }, []);

  const showSuccess = useCallback((message: string) => show(message, 'success'), [show]);
  const showError = useCallback((message: string) => show(message, 'error'), [show]);
  const showInfo = useCallback((message: string) => show(message, 'info'), [show]);
  const showWarning = useCallback((message: string) => show(message, 'warning'), [show]);

  const handleClose = useCallback(
    (_?: unknown, reason?: string) => {
      if (reason === 'clickaway') return;
      setState((prev) => ({ ...prev, open: false }));
    },
    []
  );

  const value = useMemo(
    () => ({ showSuccess, showError, showInfo, showWarning }),
    [showSuccess, showError, showInfo, showWarning]
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <Snackbar
        open={state.open}
        autoHideDuration={AUTO_HIDE_MS}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity={state.severity} variant="filled">
          {state.message}
        </Alert>
      </Snackbar>
    </NotificationContext.Provider>
  );
}

export function useNotification(): NotificationContextValue {
  const ctx = useContext(NotificationContext);
  if (!ctx) {
    throw new Error('useNotification must be used within NotificationProvider');
  }
  return ctx;
}
