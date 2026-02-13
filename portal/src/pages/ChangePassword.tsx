import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import IconButton from '@mui/material/IconButton';
import { useNotification } from '../contexts/NotificationContext';
import { changePassword } from '../services/dashboardApi';

const schema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type FormData = z.infer<typeof schema>;

export function ChangePassword() {
  const { showSuccess, showError } = useNotification();
  const [loading, setLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' },
  });

  const onSubmit = async (input: Omit<FormData, 'confirmPassword'>) => {
    setLoading(true);
    const { data, error } = await changePassword({
      currentPassword: input.currentPassword,
      newPassword: input.newPassword,
    });
    setLoading(false);
    if (error) {
      showError(error);
      return;
    }
    if (data?.success) {
      setSuccess(true);
      showSuccess(data.message ?? 'Password changed successfully.');
      reset();
    }
  };

  if (success) {
    return (
      <Box sx={{ maxWidth: 500 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Change Password
        </Typography>
        <Typography variant="body2" color="success.main" sx={{ mb: 2 }}>
          Your password has been changed successfully.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            setSuccess(false);
            reset();
          }}
        >
          Change Password Again
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 500 }}>
      <Typography variant="h5" sx={{ mb: 3 }}>
        Change Password
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <TextField
          {...register('currentPassword')}
          label="Current password"
          type={showCurrentPassword ? 'text' : 'password'}
          fullWidth
          error={!!errors.currentPassword}
          helperText={errors.currentPassword?.message}
          autoComplete="current-password"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label={showCurrentPassword ? 'Hide password' : 'Show password'}
                  onClick={() => setShowCurrentPassword((p) => !p)}
                  edge="end"
                  size="small"
                >
                  {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
          margin="normal"
        />
        <TextField
          {...register('newPassword')}
          label="New password"
          type={showNewPassword ? 'text' : 'password'}
          fullWidth
          error={!!errors.newPassword}
          helperText={errors.newPassword?.message}
          autoComplete="new-password"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label={showNewPassword ? 'Hide password' : 'Show password'}
                  onClick={() => setShowNewPassword((p) => !p)}
                  edge="end"
                  size="small"
                >
                  {showNewPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
          margin="normal"
        />
        <TextField
          {...register('confirmPassword')}
          label="Confirm new password"
          type={showConfirmPassword ? 'text' : 'password'}
          fullWidth
          error={!!errors.confirmPassword}
          helperText={errors.confirmPassword?.message}
          autoComplete="new-password"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  onClick={() => setShowConfirmPassword((p) => !p)}
                  edge="end"
                  size="small"
                >
                  {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
          margin="normal"
        />
        <Button type="submit" variant="contained" color="primary" fullWidth disabled={loading} sx={{ mt: 2 }}>
          {loading ? 'Changing password...' : 'Change Password'}
        </Button>
      </form>
    </Box>
  );
}
