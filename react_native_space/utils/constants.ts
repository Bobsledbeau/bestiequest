// Centralized app constants (web + native safe)

const getApiBaseUrl = () => {
  // Web (Render): same-origin API
  if (typeof window !== 'undefined' && window.location) {
    return '/api';
  }
  // Local dev / native tooling fallback
  return 'http://localhost:3000/api';
};

export const API_BASE_URL = getApiBaseUrl();

export const COLORS = {
  primary: '#9b59b6',
  secondary: '#3498db',
  accent: '#e74c3c',
  success: '#2ecc71',
  warning: '#f39c12',
  pink: '#e91e63',
  yellow: '#f1c40f',
  background: '#f8f9fa',
  card: '#ffffff',
  text: '#2c3e50',
  textLight: '#7f8c8d',
  border: '#ecf0f1',
  error: '#e74c3c',
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const FONT_SIZES = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 24,
  xxl: 32,
  xxxl: 40,
};

export const BORDER_RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  round: 9999,
};

export const STORY_LENGTH_DESCRIPTIONS = {
  short: '800 words - Perfect for a quick bedtime story',
  medium: '1000 words - A nice bedtime adventure',
  long: '2000 words - An epic tale for story time',
};

export const MIN_ITEMS_SELECTION = 1;
export const MAX_ITEMS_SELECTION = 10;