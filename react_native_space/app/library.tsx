import React, { useState, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  Pressable,
  RefreshControl,
  Alert,
  Modal,
  ScrollView,
} from 'react-native';
import { useFocusEffect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Snackbar } from 'react-native-paper';
import { StoryCard } from '../components/StoryCard';
import { LoadingIndicator } from '../components/LoadingIndicator';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '../utils/constants';
import { fetchStories, fetchFavorites, toggleFavorite, deleteStory } from '../services/api';
import { Story } from '../types/api';

type ViewMode = 'all' | 'favorites';

export default function LibraryScreen() {
  const [stories, setStories] = useState<Story[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('all');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const loadStories = async (showLoader = true) => {
    try {
      if (showLoader) setLoading(true);
      setError(null);

      const data = viewMode === 'all' ? await fetchStories(1, 50) : { stories: await fetchFavorites() };
      setStories(data.stories);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load stories');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadStories();
    }, [viewMode])
  );

  const handleRefresh = () => {
    setRefreshing(true);
    loadStories(false);
  };

  const handleToggleFavorite = async (storyId: string) => {
    try {
      const result = await toggleFavorite(storyId);
      
      // Update local state
      setStories((prev) =>
        prev.map((story) =>
          story.id === storyId ? { ...story, isFavorite: result.isFavorite } : story
        )
      );

      if (selectedStory?.id === storyId) {
        setSelectedStory((prev) => prev ? { ...prev, isFavorite: result.isFavorite } : null);
      }

      showSnackbar(result.isFavorite ? 'Added to favorites!' : 'Removed from favorites');

      // Refresh if we're in favorites view and item was unfavorited
      if (viewMode === 'favorites' && !result.isFavorite) {
        loadStories(false);
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to update favorite status', [{ text: 'OK' }]);
    }
  };

  const handleDeleteStory = async (storyId: string) => {
    Alert.alert(
      'Delete Story',
      'Are you sure you want to delete this story? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteStory(storyId);
              setStories((prev) => prev.filter((story) => story.id !== storyId));
              setSelectedStory(null);
              showSnackbar('Story deleted');
            } catch (err) {
              Alert.alert('Error', 'Failed to delete story', [{ text: 'OK' }]);
            }
          },
        },
      ]
    );
  };

  const showSnackbar = (message: string) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  };

  const renderStoryCard = ({ item }: { item: Story }) => (
    <StoryCard
      story={item}
      onPress={() => setSelectedStory(item)}
      onFavoritePress={() => handleToggleFavorite(item.id)}
    />
  );

  const EmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyEmoji}>
        {viewMode === 'all' ? '📖' : '💔'}
      </Text>
      <Text style={styles.emptyTitle}>
        {viewMode === 'all' ? 'No Stories Yet!' : 'No Favorites Yet!'}
      </Text>
      <Text style={styles.emptyText}>
        {viewMode === 'all'
          ? 'Create your first bedtime story to get started!'
          : 'Tap the heart icon on stories to add them to your favorites.'}
      </Text>
    </View>
  );

  if (loading) {
    return <LoadingIndicator message="Loading your stories..." />;
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorEmoji}>😢</Text>
        <Text style={styles.errorText}>{error}</Text>
        <Pressable style={styles.retryButton} onPress={() => loadStories()}>
          <Text style={styles.retryButtonText}>Try Again</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      {/* View Mode Tabs */}
      <View style={styles.tabs}>
        <Pressable
          style={({ pressed }) => [
            styles.tab,
            viewMode === 'all' && styles.tabActive,
            pressed && styles.tabPressed,
          ]}
          onPress={() => setViewMode('all')}
          accessibilityRole="tab"
          accessibilityState={{ selected: viewMode === 'all' }}
        >
          <Text style={[styles.tabText, viewMode === 'all' && styles.tabTextActive]}>
            All Stories
          </Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [
            styles.tab,
            viewMode === 'favorites' && styles.tabActive,
            pressed && styles.tabPressed,
          ]}
          onPress={() => setViewMode('favorites')}
          accessibilityRole="tab"
          accessibilityState={{ selected: viewMode === 'favorites' }}
        >
          <Text style={[styles.tabText, viewMode === 'favorites' && styles.tabTextActive]}>
            Favorites ❤️
          </Text>
        </Pressable>
      </View>

      {/* Stories List */}
      <FlatList
        data={stories}
        renderItem={renderStoryCard}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={EmptyState}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
        contentContainerStyle={stories.length === 0 ? styles.emptyList : styles.list}
      />

      {/* Story Detail Modal */}
      <Modal
        visible={selectedStory !== null}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setSelectedStory(null)}
      >
        <SafeAreaView style={styles.modalContainer} edges={['top', 'bottom']}>
          <View style={styles.modalHeader}>
            <Pressable
              style={styles.closeButton}
              onPress={() => setSelectedStory(null)}
              accessibilityRole="button"
              accessibilityLabel="Close"
            >
              <MaterialCommunityIcons name="close" size={28} color={COLORS.text} />
            </Pressable>
            <Pressable
              style={styles.deleteButton}
              onPress={() => selectedStory && handleDeleteStory(selectedStory.id)}
              accessibilityRole="button"
              accessibilityLabel="Delete story"
            >
              <MaterialCommunityIcons name="delete" size={28} color={COLORS.error} />
            </Pressable>
          </View>

          {selectedStory && (
            <ScrollView
              contentContainerStyle={styles.modalContent}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.storyHeader}>
                <Text style={styles.storyTitle}>{selectedStory.title}</Text>
                {selectedStory.childName && (
                  <Text style={styles.storyDedication}>For {selectedStory.childName}</Text>
                )}
                <Pressable
                  style={styles.favoriteButton}
                  onPress={() => handleToggleFavorite(selectedStory.id)}
                >
                  <MaterialCommunityIcons
                    name={selectedStory.isFavorite ? 'heart' : 'heart-outline'}
                    size={32}
                    color={selectedStory.isFavorite ? COLORS.accent : COLORS.textLight}
                  />
                </Pressable>
              </View>

              <View style={styles.storyContent}>
                {selectedStory.story.split('\n\n').map((paragraph, index) => (
                  <Text key={index} style={styles.storyParagraph}>
                    {paragraph}
                  </Text>
                ))}
              </View>
            </ScrollView>
          )}
        </SafeAreaView>
      </Modal>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={2000}
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
  tabs: {
    flexDirection: 'row',
    backgroundColor: COLORS.card,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  tab: {
    flex: 1,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: COLORS.primary,
  },
  tabPressed: {
    backgroundColor: COLORS.background,
  },
  tabText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textLight,
    fontWeight: '600',
  },
  tabTextActive: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  list: {
    paddingVertical: SPACING.sm,
  },
  emptyList: {
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  emptyEmoji: {
    fontSize: 80,
    marginBottom: SPACING.lg,
  },
  emptyTitle: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  emptyText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textLight,
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  errorEmoji: {
    fontSize: 80,
    marginBottom: SPACING.lg,
  },
  errorText: {
    fontSize: FONT_SIZES.lg,
    color: COLORS.error,
    textAlign: 'center',
    marginBottom: SPACING.xl,
  },
  retryButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.md,
    backgroundColor: COLORS.card,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  closeButton: {
    padding: SPACING.xs,
  },
  deleteButton: {
    padding: SPACING.xs,
  },
  modalContent: {
    padding: SPACING.lg,
  },
  storyHeader: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    position: 'relative',
  },
  storyTitle: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: 'bold',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SPACING.xs,
  },
  storyDedication: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textLight,
    fontStyle: 'italic',
  },
  favoriteButton: {
    position: 'absolute',
    top: SPACING.md,
    right: SPACING.md,
  },
  storyContent: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.lg,
  },
  storyParagraph: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    lineHeight: 26,
    marginBottom: SPACING.md,
  },
  snackbar: {
    backgroundColor: COLORS.success,
  },
});
