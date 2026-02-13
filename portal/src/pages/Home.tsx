import Typography from '@mui/material/Typography';
import { Link, Navigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { useAuth } from '../hooks/useAuth';
import { ROUTES } from '../constants/routes';
import { Buttons, General } from '../constants';

export function Home() {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated()) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }
  return (
    <Box>
      <Typography variant="h1" sx={{ fontSize: { xs: '1.75rem', sm: '2.5rem' } }}>
        {General.HOME}
      </Typography>
      <Box sx={(theme) => theme.custom.homeActions}>
        <Button component={Link} to={ROUTES.LOGIN} variant="outlined" sx={(theme) => theme.custom.homeButton}>
          {Buttons.LOGIN}
        </Button>
        <Button component={Link} to={ROUTES.SIGNUP} variant="outlined">
          {Buttons.SIGN_UP}
        </Button>
      </Box>
    </Box>
  );
}
