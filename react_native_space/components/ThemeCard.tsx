import React from 'react';
import { StyleSheet, Pressable, View, Text } from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS, FONT_SIZES } from '../utils/constants';
import { Theme } from '../types/api';

interface ThemeCardProps {
  theme: Theme;
  selected: boolean;
  onPress: () => void;
  emoji?: string;
}

const THEME_EMOJIS: Record<string, string> = {
  funny: '😄',
  magical: '✨',
  life_lessons: '💡',
  learning: '📚',
};

export const ThemeCard: React.FC<ThemeCardProps> = ({ theme, selected, onPress, emoji }) => {
  const themeEmoji = emoji || THEME_EMOJIS[theme.id] || '📖';

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        selected && styles.selected,
        pressed && styles.pressed,
      ]}
      accessibilityRole="button"
      accessibilityLabel={`${theme.name}, ${theme.description}`}
      accessibilityState={{ selected }}
    >
      <View style={styles.content}>
        <Text style={styles.emoji}>{themeEmoji}</Text>
        <Text style={styles.name}>{theme.name}</Text>
        <Text style={styles.description} numberOfLines={2}>
          {theme.description}
        </Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginVertical: SPACING.sm,
    borderWidth: 3,
    borderColor: COLORS.border,
    minHeight: 120,
  },
  selected: {
    borderColor: COLORS.primary,
    backgroundColor: '#f3e5f5',
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  content: {
    alignItems: 'center',
  },
  emoji: {
    fontSize: 48,
    marginBottom: SPACING.sm,
  },
  name: {
    fontSize: FONT_SIZES.xl,
    color: COLORS.text,
    fontWeight: 'bold',
    marginBottom: SPACING.xs,
    textAlign: 'center',
  },
  description: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textLight,
    textAlign: 'center',
  },
});
