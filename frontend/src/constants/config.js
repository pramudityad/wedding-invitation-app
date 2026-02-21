export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
};

export const STORAGE_KEYS = {
  TOKEN: 'weddingToken',
};

export const COMMENTS = {
  MAX_LENGTH: 500,
  PER_PAGE: 10,
};

export const PAGINATION = {
  THRESHOLD: 0.1,
  ROOT_MARGIN: '50px',
};
