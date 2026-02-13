import { createTheme } from '@mui/material/styles';

const primaryMain = '#16a34a';
const primaryDark = '#15803d';
const grey100 = '#f3f4f6';
const grey200 = '#e5e7eb';
const grey500 = '#6b7280';
const grey600 = '#374151';
const grey700 = '#111827';
const grey400 = '#9ca3af';
const grey300 = '#d1d5db';
const errorMain = '#dc2626';
const successLight = '#dcfce7';
const blueLight = '#dbeafe';
const blueMain = '#2563eb';
const yellowLight = '#fef9c3';
const yellowMain = '#ca8a04';
const chartYellow = '#eab308';

declare module '@mui/material/styles' {
  interface Theme {
    custom: {
      layout: {
        root: { display: string; flexDirection: string; minHeight: string };
        main: { flex: number; py: number };
        footer: { py: number; px: number; mt: string };
        authRoot: { minHeight: string; display: string; flexDirection: string; bgcolor: string };
        authHeader: { p: number };
        authBody: { flex: number; display: string; alignItems: string; justifyContent: string; px: number; py: number };
      };
      authForm: {
        container: { width: string; maxWidth: number };
        actions: { marginTop: number };
        subtitle: { marginTop: number };
      };
      authFormNarrow: { maxWidth: number };
      verifyBox: { width: string; maxWidth: number; textAlign: string };
      verifyTitle: { marginBottom: number; fontWeight: number };
      homeActions: { marginTop: number };
      homeButton: { marginRight: number };
      sidebar: {
        width: number;
        flexShrink: number;
        py: number;
        px: number;
        logo: { px: number; mb: number };
        userBlock: { px: number; mb: number };
        userAvatar: { width: number; height: number; borderRadius: string; fontWeight: number; fontSize: string };
        navSection: { mb: number };
        navItem: { py: number; px: number; borderRadius: number; fontSize: string };
        logoutBlock: { px: number; pt: number };
        logoutButton: Record<string, unknown>;
      };
      dashboardContent: { padding: number };
    };
  }
  interface ThemeOptions {
    custom?: Partial<Theme['custom']>;
  }
  interface TypographyVariants {
    authTitle: React.CSSProperties;
    authSubtitle: React.CSSProperties;
    formLabel: React.CSSProperties;
    sectionTitle: React.CSSProperties;
    cardValue: React.CSSProperties;
    sidebarLogo: React.CSSProperties;
    sidebarSection: React.CSSProperties;
    sidebarNav: React.CSSProperties;
  }
  interface TypographyVariantsOptions {
    authTitle?: React.CSSProperties;
    authSubtitle?: React.CSSProperties;
    formLabel?: React.CSSProperties;
    sectionTitle?: React.CSSProperties;
    cardValue?: React.CSSProperties;
    sidebarLogo?: React.CSSProperties;
    sidebarSection?: React.CSSProperties;
    sidebarNav?: React.CSSProperties;
  }
}

declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    authTitle: true;
    authSubtitle: true;
    formLabel: true;
    sectionTitle: true;
    cardValue: true;
    sidebarLogo: true;
    sidebarSection: true;
    sidebarNav: true;
  }
}

export const theme = createTheme({
  palette: {
    primary: {
      main: primaryMain,
      light: '#22c55e',
      dark: primaryDark,
    },
    secondary: {
      main: '#dc004e',
    },
    error: { main: errorMain },
    success: { main: primaryMain },
    warning: { main: yellowMain },
    background: {
      default: '#ffffff',
      paper: '#ffffff',
    },
    text: {
      primary: grey700,
      secondary: grey500,
    },
  },
  typography: {
    fontFamily: [
      '"Poppins"',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: { fontSize: '2.5rem', fontWeight: 600 },
    h2: { fontSize: '2rem', fontWeight: 600 },
    h3: { fontSize: '1.75rem', fontWeight: 600 },
    h4: { fontSize: '1.75rem', fontWeight: 700, color: grey700 },
    h6: { fontWeight: 700 },
    authTitle: { fontWeight: 700, color: grey700, fontSize: '1.75rem', marginBottom: 4 },
    authSubtitle: { color: grey500, fontSize: '0.9375rem', marginBottom: 24 },
    formLabel: { color: grey500, fontSize: '0.875rem' },
    sectionTitle: { fontWeight: 600, color: grey700, fontSize: '0.875rem' },
    cardValue: { fontWeight: 700, color: grey700, fontSize: '1.5rem' },
    body2: { color: grey500, fontSize: '0.875rem' },
    caption: { fontSize: '0.75rem', color: grey500 },
    sidebarLogo: { fontWeight: 700, letterSpacing: '0.05em', color: grey700, textDecoration: 'none' },
    sidebarSection: { fontSize: '0.6875rem', fontWeight: 600, letterSpacing: '0.08em', color: grey400 },
    sidebarNav: { fontSize: '0.9375rem', color: grey500 },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
        InputLabelProps: { shrink: true },
      },
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            backgroundColor: '#fff',
            '& fieldset': { borderColor: grey300 },
            '&:hover fieldset': { borderColor: grey400 },
            '&.Mui-focused fieldset': { borderColor: primaryMain, borderWidth: '1px' },
            '& input:-webkit-autofill': {
              WebkitBoxShadow: '0 0 0 30px #fff inset',
              boxShadow: '0 0 0 30px #fff inset',
              WebkitTextFillColor: grey700,
              color: grey700,
            },
          },
          '& .MuiInputLabel-root.Mui-focused': { color: primaryMain },
          '& .MuiInputLabel-root': { color: grey500, fontSize: '0.875rem' },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          fontWeight: 600,
        },
        contained: {
          '&.MuiButton-containedPrimary': {
            paddingTop: 12,
            paddingBottom: 12,
            fontSize: '1rem',
            '&:hover': { backgroundColor: primaryDark },
          },
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          fontWeight: 500,
          fontSize: '0.875rem',
          textDecoration: 'none',
          '&:hover': { textDecoration: 'underline' },
        },
      },
      defaultProps: {
        color: 'primary',
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          color: grey400,
          '&.Mui-checked': { color: primaryMain },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: grey500,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
          overflow: 'hidden',
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          '&:last-child': { paddingBottom: 16 },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          fontSize: '0.875rem',
        },
        head: {
          fontWeight: 600,
          fontSize: '0.75rem',
          color: grey500,
        },
        body: {
          color: grey600,
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:last-child td': { border: 0 },
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          width: '100%',
        },
        action: {
          '& .MuiIconButton-root': {
            color: 'inherit',
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.04)',
            },
          },
        },
        filled: {
          '& .MuiAlert-action .MuiIconButton-root': {
            color: '#ffffff',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
            },
          },
        },
      },
    },
    MuiSnackbar: {
      defaultProps: {
        anchorOrigin: { vertical: 'top', horizontal: 'right' },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: primaryMain,
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          '&.MuiLink-root': {
            color: primaryMain,
          },
        },
      },
    },
  },
  breakpoints: {
    values: { xs: 0, sm: 600, md: 900, lg: 1200, xl: 1536 },
  },
  custom: {
    layout: {
      root: { display: 'flex', flexDirection: 'column', minHeight: '100vh' },
      main: { flex: 1, py: 3 },
      footer: { py: 2, px: 2, mt: 'auto' },
      authRoot: { minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'background.paper' },
      authHeader: { p: 3 },
      authBody: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', px: 2, py: 4 },
    },
    authForm: {
      container: { width: '100%', maxWidth: 400 },
      actions: { marginTop: 2 },
      subtitle: { marginTop: 2.5 },
    },
    authFormNarrow: { maxWidth: 500 },
    verifyBox: { width: '100%', maxWidth: 400, textAlign: 'center' as const },
    verifyTitle: { marginBottom: 2, fontWeight: 500 },
    homeActions: { marginTop: 2 },
    homeButton: { marginRight: 1 },
    sidebar: {
      width: 260,
      flexShrink: 0,
      py: 2,
      px: 2,
      logo: { px: 3, mb: 2 },
      userBlock: { px: 2, mb: 2 },
      userAvatar: { width: 40, height: 40, borderRadius: '50%', fontWeight: 600, fontSize: '0.875rem' },
      navSection: { mb: 2 },
      navItem: { py: 1.25, px: 1.5, borderRadius: 1, fontSize: '0.9375rem' },
      logoutBlock: { px: 2, pt: 2 },
      logoutButton: {
        justifyContent: 'center',
        textTransform: 'none',
        py: 1.25,
        borderRadius: 2,
        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
        fontWeight: 500,
        '&:hover': { boxShadow: '0 2px 4px rgba(0, 0, 0, 0.15)' },
      },
    },
    dashboardContent: { padding: 3 },
  },
});

export const dashboardPalette = {
  cardGreen: successLight,
  cardGreenIcon: 'rgba(22, 163, 74, 0.2)',
  cardBlue: blueLight,
  cardBlueIcon: 'rgba(59, 130, 246, 0.2)',
  cardBlueIconColor: blueMain,
  cardYellow: yellowLight,
  cardYellowIcon: 'rgba(202, 138, 4, 0.2)',
  sidebarBg: '#ffffff',
  sidebarBorder: grey200,
  mainBg: '#f9fafb',
  navActiveBg: successLight,
  navHoverBg: grey100,
  logoutButtonBg: '#e6e6e6',
  logoutButtonText: '#282828',
  chartLastYear: chartYellow,
  chartThisYear: primaryMain,
  incomeColor: primaryMain,
  expenseColor: errorMain,
  tableHeaderBg: '#f9fafb',
  cardBorder: grey200,
  chartAxisTick: grey500,
} as const;
