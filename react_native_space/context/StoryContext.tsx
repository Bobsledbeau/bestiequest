import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Item, Theme, Story } from '../types/api';
import {
  saveSelectedItems,
  saveSelectedTheme,
  saveSelectedSubTheme,
  saveSelectedLength,
  saveChildName,
  saveChildGender,
  clearAllSelections,
} from '../utils/storage';

interface StoryContextType {
  // Selection state
  selectedItems: string[];
  selectedTheme: string | null;
  selectedSubTheme: string | null;
  selectedLength: 'short' | 'medium' | 'long' | null;
  childName: string;
  childGender: 'boy' | 'girl' | null;
  
  // Data state
  items: Item[];
  themes: Theme[];
  currentStory: Story | null;
  
  // Actions
  setSelectedItems: (items: string[]) => void;
  setSelectedTheme: (theme: string | null) => void;
  setSelectedSubTheme: (subTheme: string | null) => void;
  setSelectedLength: (length: 'short' | 'medium' | 'long' | null) => void;
  setChildName: (name: string) => void;
  setChildGender: (gender: 'boy' | 'girl' | null) => void;
  setItems: (items: Item[]) => void;
  setThemes: (themes: Theme[]) => void;
  setCurrentStory: (story: Story | null) => void;
  resetSelections: () => void;
}

const StoryContext = createContext<StoryContextType | undefined>(undefined);

export const StoryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedItems, setSelectedItemsState] = useState<string[]>([]);
  const [selectedTheme, setSelectedThemeState] = useState<string | null>(null);
  const [selectedSubTheme, setSelectedSubThemeState] = useState<string | null>(null);
  const [selectedLength, setSelectedLengthState] = useState<'short' | 'medium' | 'long' | null>(null);
  const [childName, setChildNameState] = useState<string>('');
  const [childGender, setChildGenderState] = useState<'boy' | 'girl' | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [themes, setThemes] = useState<Theme[]>([]);
  const [currentStory, setCurrentStory] = useState<Story | null>(null);

  const setSelectedItems = useCallback((items: string[]) => {
    setSelectedItemsState(items);
    saveSelectedItems(items);
  }, []);

  const setSelectedTheme = useCallback((theme: string | null) => {
    setSelectedThemeState(theme);
    if (theme) {
      saveSelectedTheme(theme);
    }
  }, []);

  const setSelectedSubTheme = useCallback((subTheme: string | null) => {
    setSelectedSubThemeState(subTheme);
    saveSelectedSubTheme(subTheme);
  }, []);

  const setSelectedLength = useCallback((length: 'short' | 'medium' | 'long' | null) => {
    setSelectedLengthState(length);
    if (length) {
      saveSelectedLength(length);
    }
  }, []);

  const setChildName = useCallback((name: string) => {
    setChildNameState(name);
    saveChildName(name);
  }, []);

  const setChildGender = useCallback((gender: 'boy' | 'girl' | null) => {
    setChildGenderState(gender);
    saveChildGender(gender);
  }, []);

  const resetSelections = useCallback(() => {
    setSelectedItemsState([]);
    setSelectedThemeState(null);
    setSelectedSubThemeState(null);
    setSelectedLengthState(null);
    setChildGenderState(null);
    setCurrentStory(null);
    clearAllSelections();
  }, []);

  const value: StoryContextType = {
    selectedItems,
    selectedTheme,
    selectedSubTheme,
    selectedLength,
    childName,
    childGender,
    items,
    themes,
    currentStory,
    setSelectedItems,
    setSelectedTheme,
    setSelectedSubTheme,
    setSelectedLength,
    setChildName,
    setChildGender,
    setItems,
    setThemes,
    setCurrentStory,
    resetSelections,
  };

  return <StoryContext.Provider value={value}>{children}</StoryContext.Provider>;
};

export const useStory = () => {
  const context = useContext(StoryContext);
  if (context === undefined) {
    throw new Error('useStory must be used within a StoryProvider');
  }
  return context;
};
