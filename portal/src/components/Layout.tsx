import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { Link as RouterLink, useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useNotification } from '../contexts/NotificationContext';

export function Layout() {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();
  const { showSuccess } = useNotification();

  const handleLogout = () => {
    logout();
    showSuccess('Signed out successfully.');
    navigate('/', { replace: true });
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton color="inherit" edge="start" aria-label="menu" sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
          <Typography component={RouterLink} to="/" variant="h6" sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}>
            eCommerce
          </Typography>
          {isAuthenticated() ? (
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          ) : (
            <Button component={RouterLink} to="/login" color="inherit">
              Login
            </Button>
          )}
          <IconButton color="inherit" aria-label="search">
            <SearchIcon />
          </IconButton>
          <IconButton color="inherit" aria-label="cart">
            <ShoppingCartIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Container component="main" sx={{ flex: 1, py: 3 }}>
        <Outlet />
      </Container>
      <Box
        component="footer"
        sx={{
          py: 2,
          px: 2,
          mt: 'auto',
          backgroundColor: (theme) =>
            theme.palette.mode === 'light' ? theme.palette.grey[200] : theme.palette.grey[800],
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="body2" color="text.secondary" align="center">
            © eCommerce
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}
