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
  Platform,
} from 'react-native';
import { useFocusEffect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Snackbar } from 'react-native-paper';
import { StoryCard } from '../components/StoryCard';
import { LoadingIndicator } from '../components/LoadingIndicator';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '../utils/constants';
import { fetchStories, deleteStory } from '../services/api';
import { getFavorites, toggleFavorite as toggleLocalFavorite } from '../utils/favorites';
import { Story } from '../types/api';

type ViewMode = 'all' | 'favorites';

export default function LibraryScreen() {
  const [stories, setStories] = useState<Story[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('all');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const loadFavorites = async () => {
    const favs = await getFavorites();
    setFavoriteIds(favs);
  };

  const loadStories = async (showLoader = true) => {
    try {
      if (showLoader) setLoading(true);
      setError(null);
      const data = await fetchStories(1, 50);
      setStories(data.stories);
      await loadFavorites();
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
    }, [])
  );

  const handleRefresh = () => {
    setRefreshing(true);
    loadStories(false);
  };

  const handleToggleFavorite = async (storyId: string) => {
    const isNowFavorite = await toggleLocalFavorite(storyId);
    setFavoriteIds((prev) =>
      isNowFavorite ? [...prev, storyId] : prev.filter((id) => id !== storyId)
    );
    showSnackbar(isNowFavorite ? 'Added to favorites! 💖' : 'Removed from favorites');
  };

  const handleDeleteStory = async (storyId: string) => {
    if (Platform.OS === 'web') {
      const confirmed = window.confirm(
        'Are you sure you want to delete this story? This action cannot be undone.'
      );
      if (!confirmed) return;
      try {
        await deleteStory(storyId);
        setStories((prev) => prev.filter((story) => story.id !== storyId));
        setSelectedStory(null);
        showSnackbar('Story deleted 🗑️');
      } catch (err) {
        window.alert('Failed to delete story');
      }
    } else {
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
                showSnackbar('Story deleted 🗑️');
              } catch (err) {
                Alert.alert('Error', 'Failed to delete story', [{ text: 'OK' }]);
              }
            },
          },
        ]
      );
    }
  };

  const showSnackbar = (message: string) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  };

  const displayedStories =
    viewMode === 'favorites'
      ? stories.filter((s) => favoriteIds.includes(s.id))
      : stories;

  const renderStoryCard = ({ item }: { item: Story }) => (
    <StoryCard
      story={item}
      isFavorite={favoriteIds.includes(item.id)}
      onPress={() => setSelectedStory(item)}
      onFavoritePress={() => handleToggleFavorite(item.id)}
      onDeletePress={() => handleDeleteStory(item.id)}
    />
  );

  const EmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyEmoji}>{viewMode === 'all' ? '📖' : '💔'}</Text>
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
    return <LoadingIndicator />;
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorEmoji}>😢</Text>
          <Text style={styles.errorText}>{error}</Text>
          <Pressable style={styles.retryButton} onPress={() => loadStories()}>
            <Text style={styles.retryButtonText}>Try Again</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
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
        data={displayedStories}
        renderItem={renderStoryCard}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={EmptyState}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        contentContainerStyle={displayedStories.length === 0 ? styles.emptyList : styles.list}
      />

      {/* Story Detail Modal */}
      <Modal visible={!!selectedStory} animationType="slide" onRequestClose={() => setSelectedStory(null)}>
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Pressable onPress={() => setSelectedStory(null)} style={styles.closeButton} accessibilityRole="button" accessibilityLabel="Close">
              <MaterialCommunityIcons name="arrow-left" size={28} color={COLORS.text} />
            </Pressable>
            <View style={styles.modalHeaderRight}>
              <Pressable
                onPress={() => selectedStory && handleToggleFavorite(selectedStory.id)}
                style={styles.headerButton}
                accessibilityRole="button"
                accessibilityLabel="Toggle favorite"
              >
                <MaterialCommunityIcons
                  name={selectedStory && favoriteIds.includes(selectedStory.id) ? 'heart' : 'heart-outline'}
                  size={26}
                  color={selectedStory && favoriteIds.includes(selectedStory.id) ? COLORS.error : COLORS.textLight}
                />
              </Pressable>
              <Pressable
                onPress={() => selectedStory && handleDeleteStory(selectedStory.id)}
                style={styles.headerButton}
                accessibilityRole="button"
                accessibilityLabel="Delete story"
              >
                <MaterialCommunityIcons name="trash-can-outline" size={26} color={COLORS.textLight} />
              </Pressable>
            </View>
          </View>
          <ScrollView style={styles.modalContent}>
            {selectedStory && (
              <>
                <View style={styles.storyHeader}>
                  <Text style={styles.storyTitle}>{selectedStory.title}</Text>
                  {selectedStory.childName && (
                    <Text style={styles.storyDedication}>For {selectedStory.childName}</Text>
                  )}
                </View>
                <View style={styles.storyContent}>
                  {selectedStory.story.split('\n\n').map((paragraph, index) => (
                    <Text key={index} style={styles.storyParagraph}>{paragraph}</Text>
                  ))}
                </View>
              </>
            )}
          </ScrollView>
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
  modalHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  closeButton: {
    padding: SPACING.xs,
  },
  headerButton: {
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
