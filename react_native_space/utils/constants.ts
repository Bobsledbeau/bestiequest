// App constants

// API Base URL: Use same origin when hosted together (web), or explicit URL for mobile
const getApiBaseUrl = () => {
  const envUrl = process.env.EXPO_PUBLIC_API_URL;
  
  // If explicitly set, use it
  if (envUrl) {
    return envUrl;
  }
  
  // For web platform, use same origin (frontend and backend hosted together)
  if (typeof window !== 'undefined' && window.location) {
    const origin = window.location.origin;
    
    // Force HTTPS in production (any non-localhost domain)
    if (!origin.includes('localhost') && origin.startsWith('http://')) {
      return origin.replace('http://', 'https://') + '/';
    }
    
    return origin + '/';
  }
  
  // Fallback for development
  return 'http://localhost:3000/';
};

export const API_BASE_URL = getApiBaseUrl();

export const COLORS = {
  primary: '#9b59b6',      // Purple
  secondary: '#3498db',    // Blue
  accent: '#e74c3c',       // Red
  success: '#2ecc71',      // Green
  warning: '#f39c12',      // Orange
  pink: '#e91e63',         // Pink
  yellow: '#f1c40f',       // Yellow
  background: '#f8f9fa',   // Light gray
  card: '#ffffff',         // White
  text: '#2c3e50',         // Dark gray
  textLight: '#7f8c8d',    // Medium gray
  border: '#ecf0f1',       // Very light gray
  error: '#e74c3c',        // Red
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
  medium: '1200 words - A nice bedtime adventure',
  long: '2000 words - An epic tale for story time',
};

export const MIN_ITEMS_SELECTION = 1;
export const MAX_ITEMS_SELECTION = 10;
