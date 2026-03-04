import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const DEVICE_ID_KEY = '@bestiequest_device_id';

function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export async function getDeviceId(): Promise<string> {
  try {
    const existing = await AsyncStorage.getItem(DEVICE_ID_KEY);
    if (existing) return existing;

    const newId = generateUUID();
    await AsyncStorage.setItem(DEVICE_ID_KEY, newId);
    return newId;
  } catch {
    // Fallback for SSR/web issues
    if (Platform.OS === 'web') {
      const stored = localStorage.getItem(DEVICE_ID_KEY);
      if (stored) return stored;
      const newId = generateUUID();
      localStorage.setItem(DEVICE_ID_KEY, newId);
      return newId;
    }
    return generateUUID();
  }
}
