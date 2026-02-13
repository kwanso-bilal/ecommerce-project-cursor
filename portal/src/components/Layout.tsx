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
import { ROUTES } from '../constants/routes';
import { CONFIG } from '../constants/config';
import { Buttons, Messages, Labels } from '../constants';

export function Layout() {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();
  const { showSuccess } = useNotification();

  const handleLogout = () => {
    logout();
    showSuccess(Messages.SIGNED_OUT_SUCCESS);
    navigate(ROUTES.HOME, { replace: true });
  };

  return (
    <Box sx={(theme) => theme.custom.layout.root}>
      <AppBar position="static">
        <Toolbar>
          <IconButton color="inherit" edge="start" aria-label={Labels.MENU} sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
          <Typography component={RouterLink} to={ROUTES.HOME} variant="h6" sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}>
            {CONFIG.APP_NAME}
          </Typography>
          {isAuthenticated() ? (
            <Button color="inherit" onClick={handleLogout}>
              {Buttons.LOGOUT}
            </Button>
          ) : (
            <Button component={RouterLink} to={ROUTES.LOGIN} color="inherit">
              {Buttons.LOGIN}
            </Button>
          )}
          <IconButton color="inherit" aria-label={Labels.SEARCH}>
            <SearchIcon />
          </IconButton>
          <IconButton color="inherit" aria-label={Labels.CART}>
            <ShoppingCartIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Container component="main" sx={(theme) => theme.custom.layout.main}>
        <Outlet />
      </Container>
      <Box
        component="footer"
        sx={(theme) => ({
          ...theme.custom.layout.footer,
          backgroundColor:
            theme.palette.mode === 'light' ? theme.palette.grey[200] : theme.palette.grey[800],
        })}
      >
        <Container maxWidth="lg">
          <Typography variant="body2" color="text.secondary" align="center">
            © {CONFIG.APP_NAME}
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}
