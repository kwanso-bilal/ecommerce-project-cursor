import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Link as RouterLink, Outlet } from 'react-router-dom';

export function AuthLayout() {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'background.paper' }}>
      <Box sx={{ p: 3 }}>
        <Typography component={RouterLink} to="/" variant="h6" sx={{ fontWeight: 700, letterSpacing: '0.05em', color: 'text.primary', textDecoration: 'none', '&:hover': { color: 'text.primary' } }}>
          REFINERY
        </Typography>
      </Box>
      <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', px: 2, py: 4 }}>
        <Outlet />
      </Box>
    </Box>
  );
}
