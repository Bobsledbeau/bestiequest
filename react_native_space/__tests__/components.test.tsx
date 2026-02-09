import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ItemCard } from '../components/ItemCard';
import { ThemeCard } from '../components/ThemeCard';
import { LoadingIndicator } from '../components/LoadingIndicator';

describe('Components', () => {
  describe('ItemCard', () => {
    const mockItem = {
      id: 'dragon',
      name: 'Dragon',
      category: 'creature' as const,
      emoji: '🐉',
    };

    it('should render item card with emoji and name', () => {
      const { getByText } = render(
        <ItemCard item={mockItem} selected={false} onPress={() => {}} />
      );

      expect(getByText('🐉')).toBeTruthy();
      expect(getByText('Dragon')).toBeTruthy();
    });

    it('should call onPress when tapped', () => {
      const onPressMock = jest.fn();
      const { getByRole } = render(
        <ItemCard item={mockItem} selected={false} onPress={onPressMock} />
      );

      const button = getByRole('button');
      fireEvent.press(button);

      expect(onPressMock).toHaveBeenCalledTimes(1);
    });

    it('should show checkmark when selected', () => {
      const { getByLabelText } = render(
        <ItemCard item={mockItem} selected={true} onPress={() => {}} />
      );

      expect(getByLabelText('Dragon, selected')).toBeTruthy();
    });
  });

  describe('ThemeCard', () => {
    const mockTheme = {
      id: 'funny',
      name: 'Funny',
      description: 'Humorous stories',
      hasSubCategories: false,
      subCategories: [],
    };

    it('should render theme card with name and description', () => {
      const { getByText } = render(
        <ThemeCard theme={mockTheme} selected={false} onPress={() => {}} />
      );

      expect(getByText('Funny')).toBeTruthy();
      expect(getByText('Humorous stories')).toBeTruthy();
    });

    it('should call onPress when tapped', () => {
      const onPressMock = jest.fn();
      const { getByRole } = render(
        <ThemeCard theme={mockTheme} selected={false} onPress={onPressMock} />
      );

      const button = getByRole('button');
      fireEvent.press(button);

      expect(onPressMock).toHaveBeenCalledTimes(1);
    });
  });

  describe('LoadingIndicator', () => {
    it('should render with default message', () => {
      const { getByText } = render(<LoadingIndicator />);

      expect(getByText('Loading...')).toBeTruthy();
    });

    it('should render with custom message', () => {
      const { getByText } = render(<LoadingIndicator message="Creating story..." />);

      expect(getByText('Creating story...')).toBeTruthy();
    });
  });
});
