import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import InputAdornment from '@mui/material/InputAdornment';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { Link as RouterLink, useSearchParams } from 'react-router-dom';
import { useState } from 'react';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import IconButton from '@mui/material/IconButton';
import { useNotification } from '../contexts/NotificationContext';
import { resetPassword } from '../services/api';

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
  const { showSuccess, showError } = useNotification();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { newPassword: '', confirmPassword: '' },
  });

  const onSubmit = async (input: FormData) => {
    setLoading(true);
    const { data, error } = await resetPassword({ token, newPassword: input.newPassword });
    setLoading(false);
    if (error) {
      showError(error.message);
      return;
    }
    if (data?.success) {
      setSuccess(true);
      showSuccess(data.message ?? 'Password reset successfully.');
    }
  };

  if (!token) {
    return (
      <Box sx={{ width: '100%', maxWidth: 400 }}>
        <Typography color="error" sx={{ mb: 2 }}>
          Missing or invalid reset token.
        </Typography>
        <Link component={RouterLink} to="/forgot-password">
          Request a new reset link
        </Link>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', maxWidth: 400 }}>
      <Typography variant="authTitle" sx={{ mb: 0.5 }}>
        Reset password
      </Typography>
      <Typography variant="authSubtitle">
        Enter your new password below
      </Typography>
      {success ? (
        <Typography variant="body2">
          Your password has been reset. You can now log in.
        </Typography>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <TextField
            {...register('newPassword')}
            label="New password"
            type={showPassword ? 'text' : 'password'}
            fullWidth
            error={!!errors.newPassword}
            helperText={errors.newPassword?.message}
            autoComplete="new-password"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    onClick={() => setShowPassword((p) => !p)}
                    edge="end"
                    size="small"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            margin="normal"
          />
          <TextField
            {...register('confirmPassword')}
            label="Confirm password"
            type={showConfirm ? 'text' : 'password'}
            fullWidth
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword?.message}
            autoComplete="new-password"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label={showConfirm ? 'Hide password' : 'Show password'}
                    onClick={() => setShowConfirm((p) => !p)}
                    edge="end"
                    size="small"
                  >
                    {showConfirm ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            margin="normal"
          />
          <Button type="submit" variant="contained" color="primary" fullWidth disabled={loading} sx={{ mt: 2 }}>
            {loading ? 'Resetting...' : 'Reset password'}
          </Button>
        </form>
      )}
      <Typography sx={{ mt: 2.5 }}>
        <Link component={RouterLink} to="/login">
          Back to login
        </Link>
      </Typography>
    </Box>
  );
}
