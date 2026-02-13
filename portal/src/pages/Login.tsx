import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
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
import { login } from "../services/api";
import { ROUTES } from "../constants/routes";
import { Buttons, Auth, Messages, VALIDATION } from "../constants";

const schema = z.object({
  email: z.string().min(1, VALIDATION.MESSAGES.EMAIL_REQUIRED).email(VALIDATION.MESSAGES.EMAIL_INVALID),
  password: z.string().min(1, VALIDATION.MESSAGES.PASSWORD_REQUIRED),
});

type FormData = z.infer<typeof schema>;

export function Login() {
  const navigate = useNavigate();
  const { setToken, setUser } = useAuth();
  const { showSuccess, showError } = useNotification();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (input: FormData) => {
    setLoading(true);
    const { data, error } = await login(input.email, input.password);
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
      showSuccess(Messages.SIGNED_IN_SUCCESS);
      navigate(ROUTES.DASHBOARD, { replace: true });
    }
  };

  return (
    <Box sx={(theme) => theme.custom.authForm.container}>
      <Typography variant="authTitle" display="block">
        {Auth.SIGN_IN_TITLE}
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
          {...register("password")}
          label={Auth.PASSWORD}
          type={showPassword ? "text" : "password"}
          fullWidth
          error={!!errors.password}
          helperText={errors.password?.message}
          autoComplete="current-password"
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
        <Box sx={(theme) => ({ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1, ...theme.custom.authForm.actions, mb: 2 })}>
          <FormControlLabel
            control={<Checkbox defaultChecked />}
            label={
              <Typography variant="body2" color="text.primary">
                {Auth.REMEMBER_ME}
              </Typography>
            }
          />
          <Link component={RouterLink} to={ROUTES.FORGOT_PASSWORD}>
            {Auth.FORGOT_PASSWORD_LINK}
          </Link>
        </Box>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={loading}
        >
          {loading ? Buttons.LOGIN_LOADING : Buttons.LOGIN}
        </Button>
      </form>
      <Typography variant="body2" sx={(theme) => theme.custom.authForm.subtitle}>
        {Auth.DONT_HAVE_ACCOUNT}{" "}
        <Link component={RouterLink} to={ROUTES.SIGNUP}>
          {Buttons.SIGN_UP}
        </Link>
      </Typography>
    </Box>
  );
}
