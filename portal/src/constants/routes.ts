/**
 * Centralized route paths. Use for <Route path={...}>, <Link to={...}>, navigate(...).
 */
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  VERIFY_EMAIL: '/verify-email',
  DASHBOARD: '/dashboard',
  DASHBOARD_PRODUCTS: '/dashboard/products',
  DASHBOARD_ORGANIZATIONS: '/dashboard/organizations',
  DASHBOARD_ORDERS: '/dashboard/orders',
  DASHBOARD_PAYMENTS: '/dashboard/payments',
  DASHBOARD_REVIEWS: '/dashboard/reviews',
  DASHBOARD_CHANGE_PASSWORD: '/dashboard/change-password',
} as const;
