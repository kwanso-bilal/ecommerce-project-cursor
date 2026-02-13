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
import { ROUTES } from "../constants/routes";
import { Buttons, Auth, Messages, VALIDATION } from "../constants";

const schema = z.object({
  email: z.string().min(1, VALIDATION.MESSAGES.EMAIL_REQUIRED).email(VALIDATION.MESSAGES.EMAIL_INVALID),
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
      showSuccess(data.message ?? Messages.RESET_INSTRUCTIONS_SENT);
    }
  };

  return (
    <Box sx={(theme) => theme.custom.authForm.container}>
      <Typography variant="authTitle" display="block">
        {Auth.FORGOT_PASSWORD_TITLE}
      </Typography>
      <Typography variant="authSubtitle">
        {Auth.FORGOT_PASSWORD_SUBTITLE}
      </Typography>
      {success ? (
        <Typography variant="body2">
          {Messages.RESET_EMAIL_SENT}
        </Typography>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <TextField
            {...register("email")}
            label={Auth.EMAIL_ADDRESS}
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
            sx={(theme) => theme.custom.authForm.actions}
          >
            {loading ? Buttons.SEND_RESET_LINK_LOADING : Buttons.SEND_RESET_LINK}
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
