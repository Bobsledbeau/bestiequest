import React from 'react';
import { StyleSheet, Pressable, View, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, SPACING, BORDER_RADIUS, FONT_SIZES } from '../utils/constants';
import { Item } from '../types/api';

interface ItemCardProps {
  item: Item;
  selected: boolean;
  onPress: () => void;
}

export const ItemCard: React.FC<ItemCardProps> = ({ item, selected, onPress }) => {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        selected && styles.selected,
        pressed && styles.pressed,
      ]}
      accessibilityRole="button"
      accessibilityLabel={`${item.name}, ${selected ? 'selected' : 'not selected'}`}
      accessibilityHint="Tap to select or deselect this item"
    >
      <View style={styles.content}>
        <Text style={styles.emoji}>{item.emoji}</Text>
        <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
        {selected && (
          <View style={styles.checkmark}>
            <MaterialCommunityIcons name="check-circle" size={24} color={COLORS.success} />
          </View>
        )}
      </View>
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
    minHeight: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selected: {
    borderColor: COLORS.success,
    backgroundColor: '#f0fdf4',
  },
  pressed: {
    opacity: 0.7,
    transform: [{ scale: 0.95 }],
  },
  content: {
    alignItems: 'center',
    position: 'relative',
    width: '100%',
  },
  emoji: {
    fontSize: 40,
    marginBottom: SPACING.xs,
  },
  name: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text,
    fontWeight: '600',
    textAlign: 'center',
  },
  checkmark: {
    position: 'absolute',
    top: -8,
    right: -8,
  },
});
