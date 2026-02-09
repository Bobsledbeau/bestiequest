import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, Pressable, Share, Alert, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useStory } from '../context/StoryContext';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '../utils/constants';
import { Snackbar } from 'react-native-paper';

export default function StoryScreen() {
  const router = useRouter();
  const { currentStory, resetSelections } = useStory();
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  if (!currentStory) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorEmoji}>😕</Text>
        <Text style={styles.errorText}>No story found</Text>
        <Pressable
          style={styles.homeButton}
          onPress={() => router.replace('/')}
        >
          <Text style={styles.homeButtonText}>Go Home</Text>
        </Pressable>
      </View>
    );
  }

  const handleShare = async () => {
    try {
      const result = await Share.share({
        message: `${currentStory.title}\n\n${currentStory.story}\n\nCreated with BestieQuest`,
        title: currentStory.title,
      });

      if (result.action === Share.sharedAction) {
        showSnackbar('Story shared successfully!');
      }
    } catch (error) {
      Alert.alert('Share Failed', 'Unable to share the story.', [{ text: 'OK' }]);
    }
  };

  const handleCreateAnother = () => {
    resetSelections();
    router.replace('/');
  };

  const showSnackbar = (message: string) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Story Title */}
        <View style={styles.titleContainer}>
          <Text style={styles.titleEmoji}>📖</Text>
          <Text style={styles.title}>{currentStory.title}</Text>
          {currentStory.childName && (
            <Text style={styles.dedication}>For {currentStory.childName}</Text>
          )}
        </View>

        {/* Story Content */}
        <View style={styles.storyContainer}>
          {currentStory.story.split('\n\n').map((paragraph, index) => (
            <Text key={index} style={styles.paragraph}>
              {paragraph}
            </Text>
          ))}
        </View>

        {/* The End */}
        <View style={styles.endContainer}>
          <Text style={styles.endEmoji}>✨🌟✨</Text>
          <Text style={styles.endText}>The End</Text>
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.footer}>
        <View style={styles.actionRow}>
          <Pressable
            style={({ pressed }) => [
              styles.actionButton,
              styles.shareButton,
              pressed && styles.buttonPressed,
            ]}
            onPress={handleShare}
            accessibilityRole="button"
            accessibilityLabel="Share story"
          >
            <MaterialCommunityIcons name="share-variant" size={24} color="#fff" />
            <Text style={styles.actionButtonText}>Share</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.actionButton,
              styles.anotherButton,
              pressed && styles.buttonPressed,
            ]}
            onPress={handleCreateAnother}
            accessibilityRole="button"
            accessibilityLabel="Create another story"
          >
            <MaterialCommunityIcons name="book-plus" size={24} color="#fff" />
            <Text style={styles.actionButtonText}>Create Another</Text>
          </Pressable>
        </View>
      </View>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        style={styles.snackbar}
      >
        {snackbarMessage}
      </Snackbar>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: SPACING.lg,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
  },
  titleEmoji: {
    fontSize: 60,
    marginBottom: SPACING.sm,
  },
  title: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: 'bold',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SPACING.xs,
  },
  dedication: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textLight,
    fontStyle: 'italic',
  },
  storyContainer: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  paragraph: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    lineHeight: 26,
    marginBottom: SPACING.md,
  },
  endContainer: {
    alignItems: 'center',
    marginVertical: SPACING.xl,
  },
  endEmoji: {
    fontSize: 48,
    marginBottom: SPACING.sm,
  },
  endText: {
    fontSize: FONT_SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.primary,
    fontStyle: 'italic',
  },
  footer: {
    padding: SPACING.md,
    backgroundColor: COLORS.card,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  actionRow: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    gap: SPACING.xs,
  },
  shareButton: {
    backgroundColor: COLORS.secondary,
  },
  anotherButton: {
    backgroundColor: COLORS.success,
  },
  buttonPressed: {
    opacity: 0.8,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
    backgroundColor: COLORS.background,
  },
  errorEmoji: {
    fontSize: 80,
    marginBottom: SPACING.lg,
  },
  errorText: {
    fontSize: FONT_SIZES.xl,
    color: COLORS.text,
    marginBottom: SPACING.xl,
  },
  homeButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
  },
  homeButtonText: {
    color: '#fff',
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
  },
  snackbar: {
    backgroundColor: COLORS.success,
  },
});
