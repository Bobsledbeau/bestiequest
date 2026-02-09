import React from 'react';
import { StyleSheet, Pressable, Text } from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS, FONT_SIZES } from '../utils/constants';
import { SubTheme } from '../types/api';

interface SubThemeCardProps {
  subTheme: SubTheme;
  selected: boolean;
  onPress: () => void;
}

const SUB_THEME_EMOJIS: Record<string, string> = {
  honesty: '🤝',
  friendship: '👫',
  loyalty: '🤗',
  kindness: '💝',
  geography: '🗺️',
  ocean_life: '🐠',
  animal_life: '🦁',
  space: '🚀',
  nature: '🌳',
};

export const SubThemeCard: React.FC<SubThemeCardProps> = ({ subTheme, selected, onPress }) => {
  const emoji = SUB_THEME_EMOJIS[subTheme.id] || '⭐';

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        selected && styles.selected,
        pressed && styles.pressed,
      ]}
      accessibilityRole="button"
      accessibilityLabel={`${subTheme.name}, ${subTheme.description}`}
      accessibilityState={{ selected }}
    >
      <Text style={styles.emoji}>{emoji}</Text>
      <Text style={styles.name}>{subTheme.name}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    margin: SPACING.xs,
    borderWidth: 2,
    borderColor: COLORS.border,
    minHeight: 80,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  selected: {
    borderColor: COLORS.secondary,
    backgroundColor: '#e3f2fd',
  },
  pressed: {
    opacity: 0.7,
  },
  emoji: {
    fontSize: 32,
    marginBottom: SPACING.xs,
  },
  name: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    fontWeight: '600',
    textAlign: 'center',
  },
});
