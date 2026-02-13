import type { ComponentType } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { Link as RouterLink, useNavigate, Outlet, useLocation, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import BusinessIcon from '@mui/icons-material/Business';
import PaymentIcon from '@mui/icons-material/Payment';
import LockIcon from '@mui/icons-material/Lock';
import LogoutIcon from '@mui/icons-material/Logout';
import InventoryIcon from '@mui/icons-material/Inventory';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import RateReviewIcon from '@mui/icons-material/RateReview';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useAuth } from '../hooks/useAuth';
import { useNotification } from '../contexts/NotificationContext';
import { getSidebarMenu, type SidebarSection } from '../services/dashboardApi';
import { dashboardPalette } from '../theme/theme';
import { ROUTES } from '../constants/routes';
import { CONFIG } from '../constants/config';
import { Buttons, Messages, Labels } from '../constants';

const SIDEBAR_WIDTH = 260;

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

interface SidebarContentProps {
  menu: SidebarSection[];
  displayName: string;
  initials: string;
  locationPathname: string;
  onLogout: () => void;
}

function SidebarContent({ menu, displayName, initials, locationPathname, onLogout }: SidebarContentProps) {
  return (
    <>
      <Typography
        component={RouterLink}
        to={ROUTES.DASHBOARD}
        variant="sidebarLogo"
        sx={(theme) => ({ ...theme.custom.sidebar.logo, '&:hover': { color: 'text.primary' } })}
      >
        {CONFIG.DASHBOARD_BRAND}
      </Typography>

      <Box sx={(theme) => theme.custom.sidebar.userBlock}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 1, px: 1.5, borderRadius: 1 }}>
          <Box
            sx={(theme) => ({
              ...theme.custom.sidebar.userAvatar,
              backgroundColor: dashboardPalette.sidebarBorder,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'text.primary',
            })}
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
          <Box key={section.title} sx={(theme) => ({ mb: theme.custom.sidebar.navSection.mb })}>
            <Typography variant="sidebarSection" sx={{ px: 1.5, py: 0.5 }}>
              {section.title}
            </Typography>
            {section.items.map((item) => {
              const isActive = locationPathname === item.path;
              const Icon = iconMap[item.icon] ?? DashboardIcon;
              return (
                <Box
                  key={item.path}
                  component={RouterLink}
                  to={item.path}
                  sx={(theme) => ({
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    ...theme.custom.sidebar.navItem,
                    textDecoration: 'none',
                    color: isActive ? 'text.primary' : 'text.secondary',
                    backgroundColor: isActive ? dashboardPalette.navActiveBg : 'transparent',
                    fontWeight: isActive ? 500 : 400,
                    '&:hover': {
                      backgroundColor: isActive ? dashboardPalette.navActiveBg : dashboardPalette.navHoverBg,
                      color: 'text.primary',
                    },
                  })}
                >
                  <Icon sx={{ fontSize: 20, color: isActive ? 'primary.main' : 'text.secondary' }} />
                  {item.label}
                </Box>
              );
            })}
          </Box>
        ))}
      </Box>

      <Box sx={(theme) => theme.custom.sidebar.logoutBlock}>
        <Button
          fullWidth
          startIcon={<LogoutIcon />}
          onClick={onLogout}
          sx={(theme) => ({
            ...theme.custom.sidebar.logoutButton,
            color: dashboardPalette.logoutButtonText,
            backgroundColor: dashboardPalette.logoutButtonBg,
            '& .MuiSvgIcon-root': {
              color: dashboardPalette.logoutButtonText,
            },
            '&:hover': {
              backgroundColor: dashboardPalette.logoutButtonBg,
            },
          })}
        >
          {Buttons.LOG_OUT}
        </Button>
      </Box>
    </>
  );
}

export function DashboardLayout() {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const navigate = useNavigate();
  const location = useLocation();
  const { getUser, logout, isAuthenticated } = useAuth();
  const { showSuccess } = useNotification();
  const [menu, setMenu] = useState<SidebarSection[]>([]);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    getSidebarMenu().then((res) => {
      if (res.data) setMenu(res.data);
    });
  }, []);

  const user = getUser();
  const displayName = user?.role ?? user?.name ?? Labels.USER;
  const initials = user?.name ? getInitials(user.name) : 'U';

  const handleLogout = () => {
    logout();
    showSuccess(Messages.SIGNED_OUT_SUCCESS);
    navigate(ROUTES.LOGIN, { replace: true });
  };

  const sidebarContent = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        backgroundColor: dashboardPalette.sidebarBg,
        py: 2,
      }}
    >
      <SidebarContent
        menu={menu}
        displayName={displayName}
        initials={initials}
        locationPathname={location.pathname}
        onLogout={handleLogout}
      />
    </Box>
  );

  if (!isAuthenticated()) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: dashboardPalette.mainBg }}>
      <Drawer
        variant={isDesktop ? 'permanent' : 'temporary'}
        open={isDesktop || mobileOpen}
        onClose={() => setMobileOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{
          width: isDesktop ? SIDEBAR_WIDTH : 'auto',
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: SIDEBAR_WIDTH,
            top: 0,
            borderRight: `1px solid ${dashboardPalette.sidebarBorder}`,
          },
        }}
      >
        {sidebarContent}
      </Drawer>

      <Box
        component="main"
        sx={(theme) => ({
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
          overflow: 'auto',
          p: { xs: 2, sm: theme.custom.dashboardContent.padding },
        })}
      >
        <IconButton
          aria-label={Labels.MENU}
          onClick={() => setMobileOpen(true)}
          sx={(theme) => ({
            display: { xs: 'flex', md: 'none' },
            position: 'absolute',
            top: 16,
            left: 16,
            zIndex: theme.zIndex.appBar - 1,
            color: theme.palette.text.primary,
            backgroundColor: dashboardPalette.sidebarBg,
            border: `1px solid ${dashboardPalette.sidebarBorder}`,
            '&:hover': {
              backgroundColor: dashboardPalette.navHoverBg,
            },
          })}
        >
          <MenuIcon />
        </IconButton>
        <Box sx={{ flex: 1, pt: { xs: 7, md: 0 } }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
