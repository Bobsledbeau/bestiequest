import axios, { AxiosError } from 'axios';
import {
  Item,
  Theme,
  Story,
  GenerateStoryRequest,
  ItemsResponse,
  ThemesResponse,
  StoriesResponse,
} from '../types/api';
import { API_BASE_URL } from '../utils/constants';
import { getDeviceId } from '../utils/deviceId';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Automatic retry for cold start handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error?.config;
    if (!config || config.__retryCount >= 2) {
      return Promise.reject(error);
    }
    config.__retryCount = config.__retryCount || 0;
    const isNetworkError = error?.message === 'Network Error' ||
      error?.code === 'ECONNABORTED' ||
      error?.code === 'ECONNREFUSED';
    if (isNetworkError) {
      config.__retryCount += 1;
      const delay = config.__retryCount * 3000;
      await new Promise(resolve => setTimeout(resolve, delay));
      return api(config);
    }
    return Promise.reject(error);
  }
);

export const handleApiError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ message?: string; error?: string }>;
    if (axiosError.response?.data?.message) return axiosError.response.data.message;
    if (axiosError.response?.data?.error) return axiosError.response.data.error;
    if (axiosError.message) return axiosError.message;
  }
  if (error instanceof Error) return error.message;
  return 'An unexpected error occurred. Please try again.';
};

export const fetchItems = async (): Promise<Item[]> => {
  try {
    const response = await api.get<ItemsResponse>('/items');
    return response.data.items;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

export const fetchThemes = async (): Promise<Theme[]> => {
  try {
    const response = await api.get<ThemesResponse>('/themes');
    return response.data.themes;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

export const generateStory = async (data: GenerateStoryRequest): Promise<Story> => {
  try {
    const deviceId = await getDeviceId();
    const response = await api.post<Story>('/stories/generate', { ...data, deviceId });
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

export const fetchStories = async (page: number = 1, limit: number = 20): Promise<StoriesResponse> => {
  try {
    const deviceId = await getDeviceId();
    const response = await api.get<StoriesResponse>('/stories', {
      params: { page, limit, deviceId },
    });
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

export const fetchStory = async (id: string): Promise<Story> => {
  try {
    const response = await api.get<Story>(`/stories/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

export const deleteStory = async (id: string): Promise<void> => {
  try {
    const deviceId = await getDeviceId();
    await api.delete(`/stories/${id}`, {
      params: { deviceId },
    });
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};
