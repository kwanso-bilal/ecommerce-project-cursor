import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { Link as RouterLink, useSearchParams } from 'react-router-dom';
import { useMutation } from '@apollo/client/react';
import { VERIFY_EMAIL } from '../graphql/mutations/auth';
import type { MessagePayload } from '../types/auth';
import { useEffect, useState } from 'react';

export function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') ?? '';
  const [verified, setVerified] = useState<boolean | null>(null);

  const [verifyEmail, { loading, data, error }] = useMutation<{
    verifyEmail: MessagePayload;
  }>(VERIFY_EMAIL, {
    onCompleted: (d: { verifyEmail: MessagePayload } | undefined) => {
      if (d?.verifyEmail?.success) setVerified(true);
    },
    onError: () => setVerified(false),
  });

  useEffect(() => {
    if (!token) {
      setVerified(false);
      return;
    }
    verifyEmail({ variables: { input: { token } } });
  }, [token]);

  if (!token) {
    return (
      <Box sx={{ maxWidth: 400, mx: 'auto', mt: 4, textAlign: 'center' }}>
        <Typography color="error">Missing verification token.</Typography>
        <Button component={RouterLink} to="/login" variant="contained" sx={{ mt: 2 }}>
          Go to login
        </Button>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box sx={{ maxWidth: 400, mx: 'auto', mt: 4, textAlign: 'center' }}>
        <Typography>Verifying your email...</Typography>
      </Box>
    );
  }

  if (verified === true) {
    return (
      <Box sx={{ maxWidth: 400, mx: 'auto', mt: 4, textAlign: 'center' }}>
        <Typography color="success.main" gutterBottom>
          {data?.verifyEmail?.message ?? 'Email verified successfully.'}
        </Typography>
        <Button component={RouterLink} to="/login" variant="contained" sx={{ mt: 2 }}>
          Go to login
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 4, textAlign: 'center' }}>
      <Typography color="error" gutterBottom>
        {error?.message ?? 'Invalid or expired verification link.'}
      </Typography>
      <Link component={RouterLink} to="/login">
        Back to login
      </Link>
    </Box>
  );
}
