import React from 'react';
import { StyleSheet, Pressable, View, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, SPACING, BORDER_RADIUS, FONT_SIZES } from '../utils/constants';
import { Story } from '../types/api';

interface StoryCardProps {
  story: Story;
  isFavorite: boolean;
  onPress: () => void;
  onFavoritePress: () => void;
  onDeletePress: () => void;
}

export const StoryCard: React.FC<StoryCardProps> = ({
  story,
  isFavorite,
  onPress,
  onFavoritePress,
  onDeletePress,
}) => {
  const previewText = story.story.substring(0, 100) + (story.story.length > 100 ? '...' : '');
  const date = new Date(story.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
      accessibilityRole="button"
      accessibilityLabel={`Story: ${story.title}`}
      accessibilityHint="Tap to read the full story"
    >
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{story.title}</Text>
          <Text style={styles.date}>{date}</Text>
        </View>
        <View style={styles.actions}>
          <Pressable
            onPress={(e) => {
              e.stopPropagation();
              onFavoritePress();
            }}
            style={styles.actionButton}
            accessibilityRole="button"
            accessibilityLabel={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <MaterialCommunityIcons
              name={isFavorite ? 'heart' : 'heart-outline'}
              size={24}
              color={isFavorite ? COLORS.error : COLORS.textLight}
            />
          </Pressable>
          <Pressable
            onPress={(e) => {
              e.stopPropagation();
              onDeletePress();
            }}
            style={styles.actionButton}
            accessibilityRole="button"
            accessibilityLabel="Delete story"
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <MaterialCommunityIcons
              name="trash-can-outline"
              size={22}
              color={COLORS.textLight}
            />
          </Pressable>
        </View>
      </View>

      <Text style={styles.preview}>{previewText}</Text>

      <View style={styles.footer}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{story.length}</Text>
        </View>
        {story.childName && (
          <Text style={styles.childName}>For {story.childName}</Text>
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
    marginVertical: SPACING.sm,
    marginHorizontal: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  pressed: {
    opacity: 0.8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.sm,
  },
  titleContainer: {
    flex: 1,
    marginRight: SPACING.sm,
  },
  title: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  date: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textLight,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  actionButton: {
    padding: SPACING.xs,
  },
  preview: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textLight,
    lineHeight: 22,
    marginBottom: SPACING.sm,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  badge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
  },
  badgeText: {
    color: '#fff',
    fontSize: FONT_SIZES.xs,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  childName: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textLight,
    fontStyle: 'italic',
  },
});
