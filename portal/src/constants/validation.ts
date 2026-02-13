/**
 * Validation messages and regex patterns for forms (e.g. zod schemas).
 */
export const VALIDATION = {
  MESSAGES: {
    EMAIL_REQUIRED: 'Email is required',
    EMAIL_INVALID: 'Invalid email',
    PASSWORD_REQUIRED: 'Password is required',
    PASSWORD_MIN_LENGTH: 'Password must be at least 8 characters',
    NAME_MIN_LENGTH: 'Name must be at least 2 characters',
    PASSWORDS_DO_NOT_MATCH: 'Passwords do not match',
    CURRENT_PASSWORD_REQUIRED: 'Current password is required',
  },
  REGEX: {
    /** Simple email pattern; use for optional client-side hint only. */
    EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
} as const;
