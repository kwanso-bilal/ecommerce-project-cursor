import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client/react";
import { SIGN_UP } from "../graphql/mutations/auth";
import type { AuthPayload } from "../types/auth";

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
  const [signUp, { loading, error }] = useMutation<{ signUp: AuthPayload }>(
    SIGN_UP,
    {
      onCompleted: (data: { signUp: AuthPayload } | undefined) => {
        if (data?.signUp?.accessToken) {
          localStorage.setItem("auth_token", data.signUp.accessToken);
          navigate("/", { replace: true });
        }
      },
    },
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", name: "", password: "", confirmPassword: "" },
  });

  const onSubmit = (input: Omit<FormData, "confirmPassword">) => {
    signUp({
      variables: {
        input: {
          email: input.email,
          name: input.name,
          password: input.password,
        },
      },
    });
  };

  return (
    <Box sx={{ maxWidth: 400, mx: "auto", mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Sign up
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <TextField
          {...register("email")}
          label="Email"
          type="email"
          fullWidth
          margin="normal"
          error={!!errors.email}
          helperText={errors.email?.message}
          autoComplete="email"
        />
        <TextField
          {...register("name")}
          label="Name"
          fullWidth
          margin="normal"
          error={!!errors.name}
          helperText={errors.name?.message}
          autoComplete="name"
        />
        <TextField
          {...register("password")}
          label="Password"
          type="password"
          fullWidth
          margin="normal"
          error={!!errors.password}
          helperText={errors.password?.message}
          autoComplete="new-password"
        />
        <TextField
          {...register("confirmPassword")}
          label="Confirm password"
          type="password"
          fullWidth
          margin="normal"
          error={!!errors.confirmPassword}
          helperText={errors.confirmPassword?.message}
          autoComplete="new-password"
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
          {loading ? "Creating account..." : "Create account"}
        </Button>
      </form>
      <Typography sx={{ mt: 2 }}>
        Already have an account?{" "}
        <Link component={RouterLink} to="/login">
          Login
        </Link>
      </Typography>
    </Box>
  );
}
