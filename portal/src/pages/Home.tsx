import Typography from '@mui/material/Typography';
import { Link, Navigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { useAuth } from '../hooks/useAuth';

export function Home() {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated()) {
    return <Navigate to="/dashboard" replace />;
  }
  return (
    <Box>
      <Typography variant="h1">Home</Typography>
      <Box sx={{ mt: 2 }}>
        <Button component={Link} to="/login" variant="outlined" sx={{ mr: 1 }}>
          Login
        </Button>
        <Button component={Link} to="/signup" variant="outlined">
          Sign up
        </Button>
      </Box>
    </Box>
  );
}
