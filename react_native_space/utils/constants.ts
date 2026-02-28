const getApiBaseUrl = () => {
  if (typeof window !== 'undefined' && window.location) {
    return '/api';
  }
  return 'http://localhost:3000/api';
};

export const API_BASE_URL = getApiBaseUrl();
