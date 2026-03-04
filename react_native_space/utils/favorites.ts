import AsyncStorage from '@react-native-async-storage/async-storage';

const FAVORITES_KEY = '@bestiequest_favorites';

export async function getFavorites(): Promise<string[]> {
  try {
    const data = await AsyncStorage.getItem(FAVORITES_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export async function toggleFavorite(storyId: string): Promise<boolean> {
  const favorites = await getFavorites();
  const index = favorites.indexOf(storyId);
  if (index >= 0) {
    favorites.splice(index, 1);
  } else {
    favorites.push(storyId);
  }
  await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  return index < 0; // true if added, false if removed
}

export async function isFavorite(storyId: string): Promise<boolean> {
  const favorites = await getFavorites();
  return favorites.includes(storyId);
}
