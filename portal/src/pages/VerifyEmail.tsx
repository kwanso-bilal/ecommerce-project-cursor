import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { Link as RouterLink, useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useNotification } from '../contexts/NotificationContext';
import { verifyEmail } from '../services/api';

export function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') ?? '';
  const { showSuccess, showError } = useNotification();
  const [verified, setVerified] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(!!token);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setVerified(false);
      setLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      const { data, error } = await verifyEmail(token);
      if (cancelled) return;
      setLoading(false);
      if (error) {
        setVerified(false);
        showError(error.message);
        return;
      }
      if (data?.success) {
        setVerified(true);
        setMessage(data.message ?? 'Email verified successfully.');
        showSuccess(data.message ?? 'Email verified successfully.');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [token, showSuccess, showError]);

  if (!token) {
    return (
      <Box sx={{ width: '100%', maxWidth: 400, textAlign: 'center' }}>
        <Typography color="error" sx={{ mb: 2 }}>
          Missing verification token.
        </Typography>
        <Button component={RouterLink} to="/login" variant="contained" color="primary">
          Go to login
        </Button>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box sx={{ width: '100%', maxWidth: 400, textAlign: 'center' }}>
        <Typography color="text.secondary">Verifying your email...</Typography>
      </Box>
    );
  }

  if (verified === true) {
    return (
      <Box sx={{ width: '100%', maxWidth: 400, textAlign: 'center' }}>
        <Typography color="success.main" sx={{ fontWeight: 500, mb: 2 }}>
          {message ?? 'Email verified successfully.'}
        </Typography>
        <Button component={RouterLink} to="/login" variant="contained" color="primary">
          Go to login
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', maxWidth: 400, textAlign: 'center' }}>
      <Typography color="error" sx={{ mb: 2 }}>
        Invalid or expired verification link.
      </Typography>
      <Link component={RouterLink} to="/login">
        Back to login
      </Link>
    </Box>
  );
}
