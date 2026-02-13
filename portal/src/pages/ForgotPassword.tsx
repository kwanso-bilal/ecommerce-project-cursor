import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { Link as RouterLink } from "react-router-dom";
import { useState } from "react";
import { useNotification } from "../contexts/NotificationContext";
import { forgotPassword } from "../services/api";

const schema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email"),
});

type FormData = z.infer<typeof schema>;

export function ForgotPassword() {
  const { showSuccess, showError } = useNotification();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (input: FormData) => {
    setLoading(true);
    const { data, error } = await forgotPassword(input.email);
    setLoading(false);
    if (error) {
      showError(error.message);
      return;
    }
    if (data?.success) {
      setSuccess(true);
      showSuccess(data.message ?? "Reset instructions sent.");
    }
  };

  return (
    <Box sx={{ width: "100%", maxWidth: 400 }}>
      <Typography variant="authTitle" display="block">
        Forgot password
      </Typography>
      <Typography variant="authSubtitle">
        Enter your email and we&apos;ll send you a reset link
      </Typography>
      {success ? (
        <Typography variant="body2">
          If an account exists for that email, we&apos;ve sent instructions to
          reset your password. Check your inbox.
        </Typography>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <TextField
            {...register("email")}
            label="Email address"
            type="email"
            fullWidth
            error={!!errors.email}
            helperText={errors.email?.message}
            autoComplete="email"
            margin="normal"
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={loading}
            sx={{ mt: 2 }}
          >
            {loading ? "Sending..." : "Send reset link"}
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
