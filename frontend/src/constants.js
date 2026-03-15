/**
 * Application-wide constants
 * Centralized for maintainability and self-documenting code
 */

// Comment limits - matches DB schema constraints
export const COMMENT_MAX_LENGTH = 500;
export const COMMENTS_PER_PAGE = 10;
export const MAX_COMMENTS_PER_GUEST = 2;

// UI sizing constants
export const BORDER_RADIUS = {
  button: '8px',
  card: '12px',
  dialog: '16px',
};

export const BUTTON_MIN_WIDTH = '140px';

// Snackbar/auto-dismiss timing
export const SNACKBAR_DURATION_MS = 3000;
export const RSVP_SNACKBAR_DURATION_MS = 6000;

// Color palette (primary theme colors)
export const COLORS = {
  navy: '#2C3E6B',
  navyLight: '#4A5E8B',
  gold: '#C9A96E',
  goldLight: '#E8D5A8',
  background: '#FBF7F0',
  white: '#FFFFFF',
  grey: '#5A5A5A',
};
