/**
 * Static configuration values: API base URLs, app name, etc.
 */
export const CONFIG = {
  /** Public REST API base (e.g. DummyJSON). */
  API_BASE: 'https://dummyjson.com',
  /** App / brand name used in headers and footers. */
  APP_NAME: 'eCommerce',
  /** Dashboard / auth brand name when different from APP_NAME. */
  DASHBOARD_BRAND: 'REFINERY',
} as const;
