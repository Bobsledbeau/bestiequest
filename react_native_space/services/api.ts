import axios, { AxiosError } from 'axios';
import {
  Item,
  Theme,
  Story,
  GenerateStoryRequest,
  ItemsResponse,
  ThemesResponse,
  StoriesResponse,
  FavoritesResponse,
  ToggleFavoriteResponse,
} from '../types/api';
import { API_BASE_URL } from '../utils/constants';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000, // 60 seconds for story generation
  headers: {
    'Content-Type': 'application/json',
  },
});

// Automatic retry for cold start handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error?.config;
    
    // Retry logic for network errors (likely cold start)
    if (!config || config.__retryCount >= 2) {
      return Promise.reject(error);
    }
    
    config.__retryCount = config.__retryCount || 0;
    
    // Check if it's a network error or timeout (cold start indicators)
    const isNetworkError = error?.message === 'Network Error' || 
                          error?.code === 'ECONNABORTED' ||
                          error?.code === 'ECONNREFUSED';
    
    if (isNetworkError) {
      config.__retryCount += 1;
      
      // Wait before retry (exponential backoff: 3s, 6s)
      const delay = config.__retryCount * 3000;
      await new Promise(resolve => setTimeout(resolve, delay));
      
      return api(config);
    }
    
    return Promise.reject(error);
  }
);

// Error handling helper
export const handleApiError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ message?: string; error?: string }>;
    if (axiosError.response?.data?.message) {
      return axiosError.response.data.message;
    }
    if (axiosError.response?.data?.error) {
      return axiosError.response.data.error;
    }
    if (axiosError.message) {
      return axiosError.message;
    }
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unexpected error occurred. Please try again.';
};

// API endpoints
export const fetchItems = async (): Promise<Item[]> => {
  try {
    const response = await api.get<ItemsResponse>('/api/items');
    return response.data.items;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

export const fetchThemes = async (): Promise<Theme[]> => {
  try {
    const response = await api.get<ThemesResponse>('/api/themes');
    return response.data.themes;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

export const generateStory = async (data: GenerateStoryRequest): Promise<Story> => {
  try {
    const response = await api.post<Story>('/api/stories/generate', data);
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

export const fetchStories = async (page: number = 1, limit: number = 20): Promise<StoriesResponse> => {
  try {
    const response = await api.get<StoriesResponse>('/api/stories', {
      params: { page, limit },
    });
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

export const fetchStory = async (id: string): Promise<Story> => {
  try {
    const response = await api.get<Story>(`/api/stories/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

export const toggleFavorite = async (id: string): Promise<ToggleFavoriteResponse> => {
  try {
    const response = await api.patch<ToggleFavoriteResponse>(`/api/stories/${id}/favorite`);
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

export const fetchFavorites = async (): Promise<Story[]> => {
  try {
    const response = await api.get<FavoritesResponse>('/api/stories/favorites/list');
    return response.data.stories;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

export const deleteStory = async (id: string): Promise<void> => {
  try {
    await api.delete(`/api/stories/${id}`);
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};
