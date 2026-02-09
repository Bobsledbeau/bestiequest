import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const STORAGE_KEYS = {
  SELECTED_ITEMS: '@bedtime_story/selected_items',
  SELECTED_THEME: '@bedtime_story/selected_theme',
  SELECTED_SUB_THEME: '@bedtime_story/selected_sub_theme',
  SELECTED_LENGTH: '@bedtime_story/selected_length',
  CHILD_NAME: '@bedtime_story/child_name',
  CHILD_GENDER: '@bedtime_story/child_gender',
};

// Use localStorage for web, AsyncStorage for mobile
const getStorage = () => {
  if (Platform.OS === 'web') {
    return {
      getItem: async (key: string) => {
        try {
          return localStorage.getItem(key);
        } catch {
          return null;
        }
      },
      setItem: async (key: string, value: string) => {
        try {
          localStorage.setItem(key, value);
        } catch {
          // Ignore errors
        }
      },
      removeItem: async (key: string) => {
        try {
          localStorage.removeItem(key);
        } catch {
          // Ignore errors
        }
      },
    };
  }
  return AsyncStorage;
};

const storage = getStorage();

export const saveSelectedItems = async (items: string[]) => {
  try {
    await storage.setItem(STORAGE_KEYS.SELECTED_ITEMS, JSON.stringify(items));
  } catch (error) {
    console.error('Error saving selected items:', error);
  }
};

export const getSelectedItems = async (): Promise<string[]> => {
  try {
    const value = await storage.getItem(STORAGE_KEYS.SELECTED_ITEMS);
    return value ? JSON.parse(value) : [];
  } catch (error) {
    console.error('Error getting selected items:', error);
    return [];
  }
};

export const saveSelectedTheme = async (theme: string) => {
  try {
    await storage.setItem(STORAGE_KEYS.SELECTED_THEME, theme);
  } catch (error) {
    console.error('Error saving selected theme:', error);
  }
};

export const getSelectedTheme = async (): Promise<string | null> => {
  try {
    return await storage.getItem(STORAGE_KEYS.SELECTED_THEME);
  } catch (error) {
    console.error('Error getting selected theme:', error);
    return null;
  }
};

export const saveSelectedSubTheme = async (subTheme: string | null) => {
  try {
    if (subTheme) {
      await storage.setItem(STORAGE_KEYS.SELECTED_SUB_THEME, subTheme);
    } else {
      await storage.removeItem(STORAGE_KEYS.SELECTED_SUB_THEME);
    }
  } catch (error) {
    console.error('Error saving selected sub-theme:', error);
  }
};

export const getSelectedSubTheme = async (): Promise<string | null> => {
  try {
    return await storage.getItem(STORAGE_KEYS.SELECTED_SUB_THEME);
  } catch (error) {
    console.error('Error getting selected sub-theme:', error);
    return null;
  }
};

export const saveSelectedLength = async (length: 'short' | 'medium' | 'long') => {
  try {
    await storage.setItem(STORAGE_KEYS.SELECTED_LENGTH, length);
  } catch (error) {
    console.error('Error saving selected length:', error);
  }
};

export const getSelectedLength = async (): Promise<'short' | 'medium' | 'long' | null> => {
  try {
    const value = await storage.getItem(STORAGE_KEYS.SELECTED_LENGTH);
    return value as 'short' | 'medium' | 'long' | null;
  } catch (error) {
    console.error('Error getting selected length:', error);
    return null;
  }
};

export const saveChildName = async (name: string) => {
  try {
    await storage.setItem(STORAGE_KEYS.CHILD_NAME, name);
  } catch (error) {
    console.error('Error saving child name:', error);
  }
};

export const getChildName = async (): Promise<string | null> => {
  try {
    return await storage.getItem(STORAGE_KEYS.CHILD_NAME);
  } catch (error) {
    console.error('Error getting child name:', error);
    return null;
  }
};

export const saveChildGender = async (gender: 'boy' | 'girl' | null) => {
  try {
    if (gender) {
      await storage.setItem(STORAGE_KEYS.CHILD_GENDER, gender);
    } else {
      await storage.removeItem(STORAGE_KEYS.CHILD_GENDER);
    }
  } catch (error) {
    console.error('Error saving child gender:', error);
  }
};

export const getChildGender = async (): Promise<'boy' | 'girl' | null> => {
  try {
    const value = await storage.getItem(STORAGE_KEYS.CHILD_GENDER);
    return value as 'boy' | 'girl' | null;
  } catch (error) {
    console.error('Error getting child gender:', error);
    return null;
  }
};

export const clearAllSelections = async () => {
  try {
    await Promise.all([
      storage.removeItem(STORAGE_KEYS.SELECTED_ITEMS),
      storage.removeItem(STORAGE_KEYS.SELECTED_THEME),
      storage.removeItem(STORAGE_KEYS.SELECTED_SUB_THEME),
      storage.removeItem(STORAGE_KEYS.SELECTED_LENGTH),
      storage.removeItem(STORAGE_KEYS.CHILD_GENDER),
    ]);
  } catch (error) {
    console.error('Error clearing selections:', error);
  }
};
