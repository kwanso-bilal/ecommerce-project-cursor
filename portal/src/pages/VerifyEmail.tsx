import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { Link as RouterLink, useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useNotification } from '../contexts/NotificationContext';
import { verifyEmail } from '../services/api';
import { ROUTES } from '../constants/routes';
import { Buttons, Messages, Errors } from '../constants';

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
        setMessage(data.message ?? Messages.EMAIL_VERIFIED_SUCCESS);
        showSuccess(data.message ?? Messages.EMAIL_VERIFIED_SUCCESS);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [token, showSuccess, showError]);

  if (!token) {
    return (
      <Box sx={(theme) => theme.custom.verifyBox}>
        <Typography color="error" sx={{ mb: 2 }}>
          {Errors.MISSING_VERIFICATION_TOKEN}
        </Typography>
        <Button component={RouterLink} to={ROUTES.LOGIN} variant="contained" color="primary">
          {Buttons.GO_TO_LOGIN}
        </Button>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box sx={(theme) => theme.custom.verifyBox}>
        <Typography color="text.secondary">{Messages.VERIFYING_EMAIL}</Typography>
      </Box>
    );
  }

  if (verified === true) {
    return (
      <Box sx={(theme) => theme.custom.verifyBox}>
        <Typography color="success.main" sx={(theme) => theme.custom.verifyTitle}>
          {message ?? Messages.EMAIL_VERIFIED_SUCCESS}
        </Typography>
        <Button component={RouterLink} to={ROUTES.LOGIN} variant="contained" color="primary">
          {Buttons.GO_TO_LOGIN}
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={(theme) => theme.custom.verifyBox}>
      <Typography color="error" sx={{ mb: 2 }}>
        {Errors.INVALID_VERIFICATION_LINK}
      </Typography>
      <Link component={RouterLink} to={ROUTES.LOGIN}>
        {Buttons.BACK_TO_LOGIN}
      </Link>
    </Box>
  );
}
