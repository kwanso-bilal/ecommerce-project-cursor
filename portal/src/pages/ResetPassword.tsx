import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { Link as RouterLink, useSearchParams } from 'react-router-dom';
import { useMutation } from '@apollo/client/react';
import { RESET_PASSWORD } from '../graphql/mutations/auth';
import type { MessagePayload } from '../types/auth';

const schema = z
  .object({
    newPassword: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type FormData = z.infer<typeof schema>;

export function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') ?? '';

  const [resetPassword, { loading, data, error }] = useMutation<{
    resetPassword: MessagePayload;
  }>(RESET_PASSWORD);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { newPassword: '', confirmPassword: '' },
  });

  const onSubmit = (input: FormData) => {
    resetPassword({
      variables: { input: { token, newPassword: input.newPassword } },
    });
  };

  if (!token) {
    return (
      <Box sx={{ maxWidth: 400, mx: 'auto', mt: 4 }}>
        <Typography color="error">Missing or invalid reset token.</Typography>
        <Link component={RouterLink} to="/forgot-password" sx={{ mt: 2, display: 'block' }}>
          Request a new reset link
        </Link>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Reset password
      </Typography>
      {data?.resetPassword?.success ? (
        <Typography color="text.secondary">
          Your password has been reset. You can now log in.
        </Typography>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <TextField
            {...register('newPassword')}
            label="New password"
            type="password"
            fullWidth
            margin="normal"
            error={!!errors.newPassword}
            helperText={errors.newPassword?.message}
            autoComplete="new-password"
          />
          <TextField
            {...register('confirmPassword')}
            label="Confirm password"
            type="password"
            fullWidth
            margin="normal"
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword?.message}
            autoComplete="new-password"
          />
          {error && (
            <Typography color="error" sx={{ mt: 1 }}>
              {error.message}
            </Typography>
          )}
          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={loading}
            sx={{ mt: 2 }}
          >
            {loading ? 'Resetting...' : 'Reset password'}
          </Button>
        </form>
      )}
      <Typography sx={{ mt: 2 }}>
        <Link component={RouterLink} to="/login">
          Back to login
        </Link>
      </Typography>
    </Box>
  );
}
