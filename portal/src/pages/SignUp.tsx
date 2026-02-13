import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import InputAdornment from "@mui/material/InputAdornment";
import Link from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import IconButton from "@mui/material/IconButton";
import { useNotification } from "../contexts/NotificationContext";
import { useAuth } from "../hooks/useAuth";
import { signUp } from "../services/api";
import { ROUTES } from "../constants/routes";
import { Buttons, Auth, Messages, VALIDATION } from "../constants";

const schema = z
  .object({
    email: z.string().min(1, VALIDATION.MESSAGES.EMAIL_REQUIRED).email(VALIDATION.MESSAGES.EMAIL_INVALID),
    name: z.string().min(2, VALIDATION.MESSAGES.NAME_MIN_LENGTH),
    password: z.string().min(8, VALIDATION.MESSAGES.PASSWORD_MIN_LENGTH),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: VALIDATION.MESSAGES.PASSWORDS_DO_NOT_MATCH,
    path: ["confirmPassword"],
  });

type FormData = z.infer<typeof schema>;

export function SignUp() {
  const navigate = useNavigate();
  const { setToken, setUser } = useAuth();
  const { showSuccess, showError } = useNotification();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", name: "", password: "", confirmPassword: "" },
  });

  const onSubmit = async (input: Omit<FormData, "confirmPassword">) => {
    setLoading(true);
    const { data, error } = await signUp({
      email: input.email,
      name: input.name,
      password: input.password,
    });
    setLoading(false);
    if (error) {
      showError(error.message);
      return;
    }
    if (data?.accessToken) {
      setToken(data.accessToken);
      setUser({
        id: data.user.id,
        email: data.user.email,
        name: data.user.name,
        role: "Super Admin",
      });
      showSuccess(Messages.ACCOUNT_CREATED_SUCCESS);
      navigate(ROUTES.DASHBOARD, { replace: true });
    }
  };

  return (
    <Box sx={(theme) => theme.custom.authForm.container}>
      <Typography variant="authTitle" display="block">
        {Auth.CREATE_ACCOUNT_TITLE}
      </Typography>
      <Typography variant="authSubtitle">{Auth.ENTER_DETAILS_BELOW}</Typography>
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
        <TextField
          {...register("name")}
          label={Auth.FULL_NAME}
          fullWidth
          error={!!errors.name}
          helperText={errors.name?.message}
          autoComplete="name"
          margin="normal"
        />
        <TextField
          {...register("password")}
          label={Auth.PASSWORD}
          type={showPassword ? "text" : "password"}
          fullWidth
          error={!!errors.password}
          helperText={errors.password?.message}
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
          {...register("confirmPassword")}
          label={Auth.CONFIRM_PASSWORD}
          type={showConfirmPassword ? "text" : "password"}
          fullWidth
          error={!!errors.confirmPassword}
          helperText={errors.confirmPassword?.message}
          autoComplete="new-password"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label={
                    showConfirmPassword ? Auth.HIDE_PASSWORD : Auth.SHOW_PASSWORD
                  }
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
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={loading}
          sx={(theme) => theme.custom.authForm.actions}
        >
          {loading ? Buttons.CREATE_ACCOUNT_LOADING : Buttons.CREATE_ACCOUNT}
        </Button>
      </form>
      <Typography variant="body2" sx={(theme) => theme.custom.authForm.subtitle}>
        {Auth.ALREADY_HAVE_ACCOUNT}{" "}
        <Link component={RouterLink} to={ROUTES.LOGIN}>
          {Buttons.LOGIN}
        </Link>
      </Typography>
    </Box>
  );
}
