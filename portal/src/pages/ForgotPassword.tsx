import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { Link as RouterLink } from 'react-router-dom';
import { useMutation } from '@apollo/client/react';
import { FORGOT_PASSWORD } from '../graphql/mutations/auth';
import type { MessagePayload } from '../types/auth';

const schema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email'),
});

type FormData = z.infer<typeof schema>;

export function ForgotPassword() {
  const [forgotPassword, { loading, data, error }] = useMutation<{
    forgotPassword: MessagePayload;
  }>(FORGOT_PASSWORD);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { email: '' },
  });

  const onSubmit = (input: FormData) => {
    forgotPassword({ variables: { input } });
  };

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Forgot password
      </Typography>
      {data?.forgotPassword?.success ? (
        <Typography color="text.secondary">
          If an account exists for that email, we&apos;ve sent instructions to reset your
          password. Check your inbox.
        </Typography>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <TextField
            {...register('email')}
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            error={!!errors.email}
            helperText={errors.email?.message}
            autoComplete="email"
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
            {loading ? 'Sending...' : 'Send reset link'}
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
