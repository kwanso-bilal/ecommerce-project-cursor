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

const schema = z
  .object({
    email: z.string().min(1, "Email is required").email("Invalid email"),
    name: z.string().min(2, "Name must be at least 2 characters"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type FormData = z.infer<typeof schema>;

export function SignUp() {
  const navigate = useNavigate();
  const { setUser } = useAuth();
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
      localStorage.setItem("auth_token", data.accessToken);
      setUser({
        id: data.user.id,
        email: data.user.email,
        name: data.user.name,
        role: "Super Admin",
      });
      showSuccess("Account created successfully.");
      navigate("/dashboard", { replace: true });
    }
  };

  return (
    <Box sx={{ width: "100%", maxWidth: 400 }}>
      <Typography variant="authTitle" display="block">
        Create your account
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
          {...register("name")}
          label="Full name"
          fullWidth
          error={!!errors.name}
          helperText={errors.name?.message}
          autoComplete="name"
          margin="normal"
        />
        <TextField
          {...register("password")}
          label="Password"
          type={showPassword ? "text" : "password"}
          fullWidth
          error={!!errors.password}
          helperText={errors.password?.message}
          autoComplete="new-password"
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
        <TextField
          {...register("confirmPassword")}
          label="Confirm password"
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
                    showConfirmPassword ? "Hide password" : "Show password"
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
          sx={{ mt: 2 }}
        >
          {loading ? "Creating account..." : "Create account"}
        </Button>
      </form>
      <Typography variant="body2" sx={{ mt: 2.5 }}>
        Already have an account?{" "}
        <Link component={RouterLink} to="/login">
          Login
        </Link>
      </Typography>
    </Box>
  );
}
