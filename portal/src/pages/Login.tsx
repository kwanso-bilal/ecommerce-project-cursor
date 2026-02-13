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

const schema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email"),
  password: z.string().min(1, "Password is required"),
});

type FormData = z.infer<typeof schema>;

export function Login() {
  const navigate = useNavigate();
  const { setUser } = useAuth();
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
      localStorage.setItem("auth_token", data.accessToken);
      setUser({
        id: data.user.id,
        email: data.user.email,
        name: data.user.name,
        role: "Super Admin",
      });
      showSuccess("Signed in successfully.");
      navigate("/dashboard", { replace: true });
    }
  };

  return (
    <Box sx={{ width: "100%", maxWidth: 400 }}>
      <Typography variant="authTitle" display="block">
        Sign in to Refinery
      </Typography>
      <Typography variant="authSubtitle">Enter your details below</Typography>
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
        <TextField
          {...register("password")}
          label="Password"
          type={showPassword ? "text" : "password"}
          fullWidth
          error={!!errors.password}
          helperText={errors.password?.message}
          autoComplete="current-password"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label={showPassword ? "Hide password" : "Show password"}
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
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 1,
            mt: 2,
            mb: 2,
          }}
        >
          <FormControlLabel
            control={<Checkbox defaultChecked />}
            label={
              <Typography variant="body2" color="text.primary">
                Remember me
              </Typography>
            }
          />
          <Link component={RouterLink} to="/forgot-password">
            Forgot password?
          </Link>
        </Box>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={loading}
        >
          {loading ? "Signing in..." : "Login"}
        </Button>
      </form>
      <Typography variant="body2" sx={{ mt: 2.5 }}>
        Don&apos;t have an account?{" "}
        <Link component={RouterLink} to="/signup">
          Sign up
        </Link>
      </Typography>
    </Box>
  );
}
