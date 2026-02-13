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
import { Dashboard, Buttons, Auth, Messages, VALIDATION } from '../constants';

const schema = z
  .object({
    currentPassword: z.string().min(1, VALIDATION.MESSAGES.CURRENT_PASSWORD_REQUIRED),
    newPassword: z.string().min(8, VALIDATION.MESSAGES.PASSWORD_MIN_LENGTH),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: VALIDATION.MESSAGES.PASSWORDS_DO_NOT_MATCH,
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
      showSuccess(data.message ?? Messages.PASSWORD_CHANGED_SUCCESS);
      reset();
    }
  };

  if (success) {
    return (
      <Box sx={(theme) => ({ ...theme.custom.authFormNarrow, width: '100%' })}>
        <Typography variant="pageTitle" component="h1" sx={(theme) => ({ mb: theme.custom.verifyTitle.marginBottom })}>
          {Dashboard.CHANGE_PASSWORD_TITLE}
        </Typography>
        <Typography variant="body2" color="success.main" sx={(theme) => ({ mb: theme.custom.verifyTitle.marginBottom })}>
          {Dashboard.PASSWORD_CHANGED_SUCCESS}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            setSuccess(false);
            reset();
          }}
        >
          {Buttons.CHANGE_PASSWORD_AGAIN}
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={(theme) => ({ ...theme.custom.authFormNarrow, width: '100%' })}>
      <Typography variant="pageTitle" component="h1">
        {Dashboard.CHANGE_PASSWORD_TITLE}
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <TextField
          {...register('currentPassword')}
          label={Auth.CURRENT_PASSWORD}
          type={showCurrentPassword ? 'text' : 'password'}
          fullWidth
          error={!!errors.currentPassword}
          helperText={errors.currentPassword?.message}
          autoComplete="current-password"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label={showCurrentPassword ? Auth.HIDE_PASSWORD : Auth.SHOW_PASSWORD}
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
          label={Auth.NEW_PASSWORD}
          type={showNewPassword ? 'text' : 'password'}
          fullWidth
          error={!!errors.newPassword}
          helperText={errors.newPassword?.message}
          autoComplete="new-password"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label={showNewPassword ? Auth.HIDE_PASSWORD : Auth.SHOW_PASSWORD}
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
          label={Dashboard.CONFIRM_NEW_PASSWORD}
          type={showConfirmPassword ? 'text' : 'password'}
          fullWidth
          error={!!errors.confirmPassword}
          helperText={errors.confirmPassword?.message}
          autoComplete="new-password"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label={showConfirmPassword ? Auth.HIDE_PASSWORD : Auth.SHOW_PASSWORD}
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
        <Button type="submit" variant="contained" color="primary" fullWidth disabled={loading} sx={(theme) => theme.custom.authForm.actions}>
          {loading ? Buttons.CHANGING_PASSWORD : Buttons.CHANGE_PASSWORD}
        </Button>
      </form>
    </Box>
  );
}
