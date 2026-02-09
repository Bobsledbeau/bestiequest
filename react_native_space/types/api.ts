// API Types matching backend exactly

export interface Item {
  id: string;
  name: string;
  category: 'creature' | 'person' | 'place' | 'object' | 'vehicle' | 'food' | 'nature';
  emoji: string;
}

export interface SubTheme {
  id: string;
  name: string;
  description: string;
}

export interface Theme {
  id: string;
  name: string;
  description: string;
  hasSubCategories: boolean;
  subCategories: SubTheme[];
}

export interface Story {
  id: string;
  title: string;
  story: string;
  selectedItems: string[];
  theme: string;
  subTheme: string | null;
  length: 'short' | 'medium' | 'long';
  childName?: string;
  isFavorite: boolean;
  createdAt: string;
}

export interface GenerateStoryRequest {
  selectedItems: string[];
  theme: string;
  subTheme?: string;
  length: 'short' | 'medium' | 'long';
  childName?: string;
  childGender?: 'boy' | 'girl';
}

export interface ItemsResponse {
  items: Item[];
}

export interface ThemesResponse {
  themes: Theme[];
}

export interface StoriesResponse {
  stories: Story[];
  total: number;
  page: number;
  totalPages: number;
}

export interface FavoritesResponse {
  stories: Story[];
}

export interface ToggleFavoriteResponse {
  id: string;
  isFavorite: boolean;
}
