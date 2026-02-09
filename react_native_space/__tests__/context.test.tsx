import React from 'react';
import { renderHook, act } from '@testing-library/react-native';
import { StoryProvider, useStory } from '../context/StoryContext';

describe('StoryContext', () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <StoryProvider>{children}</StoryProvider>
  );

  it('should provide initial state', () => {
    const { result } = renderHook(() => useStory(), { wrapper });

    expect(result.current.selectedItems).toEqual([]);
    expect(result.current.selectedTheme).toBeNull();
    expect(result.current.selectedSubTheme).toBeNull();
    expect(result.current.selectedLength).toBeNull();
    expect(result.current.childName).toBe('');
  });

  it('should update selected items', () => {
    const { result } = renderHook(() => useStory(), { wrapper });

    act(() => {
      result.current.setSelectedItems(['dragon', 'knight']);
    });

    expect(result.current.selectedItems).toEqual(['dragon', 'knight']);
  });

  it('should update selected theme', () => {
    const { result } = renderHook(() => useStory(), { wrapper });

    act(() => {
      result.current.setSelectedTheme('funny');
    });

    expect(result.current.selectedTheme).toBe('funny');
  });

  it('should reset selections', () => {
    const { result } = renderHook(() => useStory(), { wrapper });

    // Set some values
    act(() => {
      result.current.setSelectedItems(['dragon']);
      result.current.setSelectedTheme('funny');
      result.current.setSelectedLength('medium');
    });

    // Reset
    act(() => {
      result.current.resetSelections();
    });

    expect(result.current.selectedItems).toEqual([]);
    expect(result.current.selectedTheme).toBeNull();
    expect(result.current.selectedLength).toBeNull();
    expect(result.current.currentStory).toBeNull();
  });
});
