import type { ComponentType } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Link as RouterLink, useNavigate, Outlet, useLocation, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import DashboardIcon from '@mui/icons-material/Dashboard';
import BusinessIcon from '@mui/icons-material/Business';
import PaymentIcon from '@mui/icons-material/Payment';
import LockIcon from '@mui/icons-material/Lock';
import LogoutIcon from '@mui/icons-material/Logout';
import InventoryIcon from '@mui/icons-material/Inventory';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import RateReviewIcon from '@mui/icons-material/RateReview';
import { useAuth } from '../hooks/useAuth';
import { useNotification } from '../contexts/NotificationContext';
import { getSidebarMenu, type SidebarSection } from '../services/dashboardApi';
import { dashboardPalette } from '../theme/theme';

const iconMap: Record<string, ComponentType<{ sx?: object }>> = {
  dashboard: DashboardIcon,
  inventory: InventoryIcon,
  business: BusinessIcon,
  shopping_cart: ShoppingCartIcon,
  payment: PaymentIcon,
  rate_review: RateReviewIcon,
  lock: LockIcon,
};

function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .map((s) => s[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'U';
}

export function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { getUser, logout, isAuthenticated } = useAuth();
  const { showSuccess } = useNotification();
  const [menu, setMenu] = useState<SidebarSection[]>([]);

  useEffect(() => {
    getSidebarMenu().then((res) => {
      if (res.data) setMenu(res.data);
    });
  }, []);

  const user = getUser();
  const displayName = user?.role ?? user?.name ?? 'User';
  const initials = user?.name ? getInitials(user.name) : 'U';

  const handleLogout = () => {
    logout();
    showSuccess('Signed out successfully.');
    navigate('/login', { replace: true });
  };

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: dashboardPalette.mainBg }}>
      <Box
        sx={{
          width: 260,
          flexShrink: 0,
          backgroundColor: dashboardPalette.sidebarBg,
          borderRight: `1px solid ${dashboardPalette.sidebarBorder}`,
          display: 'flex',
          flexDirection: 'column',
          py: 2,
        }}
      >
        <Typography
          component={RouterLink}
          to="/dashboard"
          variant="sidebarLogo"
          sx={{ px: 3, mb: 2, '&:hover': { color: 'text.primary' } }}
        >
          REFINERY
        </Typography>

        <Box sx={{ px: 2, mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 1, px: 1.5, borderRadius: 1 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                backgroundColor: dashboardPalette.sidebarBorder,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'text.primary',
                fontWeight: 600,
                fontSize: '0.875rem',
              }}
            >
              {initials}
            </Box>
            <Typography variant="sidebarNav" sx={{ color: 'text.primary', fontWeight: 500 }}>
              {displayName}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ flex: 1, px: 1.5 }}>
          {menu.map((section) => (
            <Box key={section.title} sx={{ mb: 2 }}>
              <Typography variant="sidebarSection" sx={{ px: 1.5, py: 0.5 }}>
                {section.title}
              </Typography>
              {section.items.map((item) => {
                const isActive = location.pathname === item.path;
                const Icon = iconMap[item.icon] ?? DashboardIcon;
                return (
                  <Box
                    key={item.path}
                    component={RouterLink}
                    to={item.path}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.5,
                      py: 1.25,
                      px: 1.5,
                      borderRadius: 1,
                      textDecoration: 'none',
                      color: isActive ? 'text.primary' : 'text.secondary',
                      backgroundColor: isActive ? dashboardPalette.navActiveBg : 'transparent',
                      fontWeight: isActive ? 500 : 400,
                      fontSize: '0.9375rem',
                      '&:hover': {
                        backgroundColor: isActive ? dashboardPalette.navActiveBg : dashboardPalette.navHoverBg,
                        color: 'text.primary',
                      },
                    }}
                  >
                    <Icon sx={{ fontSize: 20, color: isActive ? 'primary.main' : 'text.secondary' }} />
                    {item.label}
                  </Box>
                );
              })}
            </Box>
          ))}
        </Box>

        <Box sx={{ px: 2, pt: 2 }}>
          <Button
            fullWidth
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
            sx={{
              justifyContent: 'center',
              textTransform: 'none',
              color: dashboardPalette.logoutButtonText,
              backgroundColor: dashboardPalette.logoutButtonBg,
              py: 1.25,
              borderRadius: 2,
              boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
              fontWeight: 500,
              '& .MuiSvgIcon-root': {
                color: dashboardPalette.logoutButtonText,
              },
              '&:hover': {
                backgroundColor: dashboardPalette.logoutButtonBg,
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.15)',
              },
            }}
          >
            Log Out
          </Button>
        </Box>
      </Box>

      <Box component="main" sx={{ flex: 1, overflow: 'auto', p: 3 }}>
        <Outlet />
      </Box>
    </Box>
  );
}
