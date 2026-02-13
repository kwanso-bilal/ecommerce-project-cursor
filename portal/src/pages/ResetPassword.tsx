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
import { ROUTES } from '../constants/routes';
import { Buttons, Auth, Messages, Errors, VALIDATION } from '../constants';

const schema = z
  .object({
    newPassword: z.string().min(8, VALIDATION.MESSAGES.PASSWORD_MIN_LENGTH),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: VALIDATION.MESSAGES.PASSWORDS_DO_NOT_MATCH,
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
      showSuccess(data.message ?? Messages.PASSWORD_RESET_SUCCESS);
    }
  };

  if (!token) {
    return (
      <Box sx={(theme) => theme.custom.authForm.container}>
        <Typography color="error" sx={{ mb: 2 }}>
          {Errors.MISSING_RESET_TOKEN}
        </Typography>
        <Link component={RouterLink} to={ROUTES.FORGOT_PASSWORD}>
          {Buttons.REQUEST_NEW_RESET_LINK}
        </Link>
      </Box>
    );
  }

  return (
    <Box sx={(theme) => theme.custom.authForm.container}>
      <Typography variant="authTitle" sx={{ mb: 0.5 }}>
        {Auth.RESET_PASSWORD_TITLE}
      </Typography>
      <Typography variant="authSubtitle">
        {Auth.RESET_PASSWORD_SUBTITLE}
      </Typography>
      {success ? (
        <Typography variant="body2">
          {Messages.PASSWORD_RESET_SUCCESS}
        </Typography>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <TextField
            {...register('newPassword')}
            label={Auth.NEW_PASSWORD}
            type={showPassword ? 'text' : 'password'}
            fullWidth
            error={!!errors.newPassword}
            helperText={errors.newPassword?.message}
            autoComplete="new-password"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label={showPassword ? Auth.HIDE_PASSWORD : Auth.SHOW_PASSWORD}
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
            label={Auth.CONFIRM_PASSWORD}
            type={showConfirm ? 'text' : 'password'}
            fullWidth
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword?.message}
            autoComplete="new-password"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label={showConfirm ? Auth.HIDE_PASSWORD : Auth.SHOW_PASSWORD}
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
          <Button type="submit" variant="contained" color="primary" fullWidth disabled={loading} sx={(theme) => theme.custom.authForm.actions}>
            {loading ? Buttons.RESET_PASSWORD_LOADING : Buttons.RESET_PASSWORD}
          </Button>
        </form>
      )}
      <Typography sx={(theme) => theme.custom.authForm.subtitle}>
        <Link component={RouterLink} to={ROUTES.LOGIN}>
          {Buttons.BACK_TO_LOGIN}
        </Link>
      </Typography>
    </Box>
  );
}
