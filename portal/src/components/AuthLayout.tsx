import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Link as RouterLink, Outlet } from 'react-router-dom';
import { ROUTES } from '../constants/routes';
import { CONFIG } from '../constants/config';

export function AuthLayout() {
  return (
    <Box sx={(theme) => theme.custom.layout.authRoot}>
      <Box sx={(theme) => theme.custom.layout.authHeader}>
        <Typography
          component={RouterLink}
          to={ROUTES.HOME}
          variant="h6"
          sx={{
            fontWeight: 700,
            letterSpacing: '0.05em',
            color: 'text.primary',
            textDecoration: 'none',
            '&:hover': { color: 'text.primary' },
          }}
        >
          {CONFIG.DASHBOARD_BRAND}
        </Typography>
      </Box>
      <Box sx={(theme) => theme.custom.layout.authBody}>
        <Outlet />
      </Box>
    </Box>
  );
}
