import React, { useEffect } from 'react';
import { StyleSheet, View, Text, Pressable, ScrollView, Platform, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '../utils/constants';
import { LoadingIndicator } from '../components/LoadingIndicator';
import { useLoadData } from '../hooks/useLoadData';

export default function HomeScreen() {
  const router = useRouter();
  const { loading, error } = useLoadData();

  if (loading) {
    return <LoadingIndicator message="Loading magical characters and themes... This may take a moment on first visit." />;
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorEmoji}>😢</Text>
        <Text style={styles.errorText}>{error}</Text>
        <Pressable
          style={({ pressed }) => [styles.retryButton, pressed && styles.buttonPressed]}
          onPress={() => {
            // Reload the app
            if (Platform.OS === 'web') {
              window.location.reload();
            }
          }}
        >
          <Text style={styles.retryButtonText}>Try Again</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <LinearGradient
        colors={[COLORS.primary, COLORS.secondary]}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Hero Section */}
          <View style={styles.heroSection}>
            <Image 
              source={require('../assets/hero-image.png')}
              style={styles.heroImage}
              resizeMode="contain"
              accessibilityLabel="Bear, bunny, cat, and penguin reading a storybook together"
            />
            <Text style={styles.title}>BestieQuest</Text>
            <Text style={styles.subtitle}>
              Create magical bedtime stories with your favorite characters!
            </Text>
          </View>

          {/* Main Actions */}
          <View style={styles.actionsContainer}>
            <Pressable
              style={({ pressed }) => [
                styles.primaryButton,
                pressed && styles.buttonPressed,
              ]}
              onPress={() => router.push('/select-items')}
              accessibilityRole="button"
              accessibilityLabel="Create a new story"
              accessibilityHint="Tap to start creating your bedtime story"
            >
              <View style={styles.buttonContent}>
                <MaterialCommunityIcons
                  name="book-plus"
                  size={32}
                  color="#fff"
                  style={styles.buttonIcon}
                />
                <Text style={styles.primaryButtonText}>Create New Story</Text>
              </View>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.secondaryButton,
                pressed && styles.buttonPressed,
              ]}
              onPress={() => router.push('/library')}
              accessibilityRole="button"
              accessibilityLabel="View my story library"
            >
              <View style={styles.buttonContent}>
                <MaterialCommunityIcons
                  name="bookshelf"
                  size={28}
                  color={COLORS.primary}
                  style={styles.buttonIcon}
                />
                <Text style={styles.secondaryButtonText}>My Story Library</Text>
              </View>
            </Pressable>
          </View>

          {/* Features */}
          <View style={styles.featuresContainer}>
            <View style={styles.featureItem}>
              <Text style={styles.featureEmoji}>🎭</Text>
              <Text style={styles.featureText}>Choose from 50 characters & items</Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.featureEmoji}>🎨</Text>
              <Text style={styles.featureText}>Pick fun themes & lessons</Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.featureEmoji}>👶</Text>
              <Text style={styles.featureText}>Personalize with your child's name</Text>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: SPACING.lg,
  },
  heroSection: {
    alignItems: 'center',
    marginTop: SPACING.xl,
    marginBottom: SPACING.xxl,
  },
  heroImage: {
    width: 200,
    height: 200,
    marginBottom: SPACING.lg,
    borderRadius: BORDER_RADIUS.xl,
  },
  title: {
    fontSize: FONT_SIZES.xxxl,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: SPACING.md,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: FONT_SIZES.lg,
    color: '#fff',
    textAlign: 'center',
    opacity: 0.9,
    paddingHorizontal: SPACING.lg,
  },
  actionsContainer: {
    marginBottom: SPACING.xl,
  },
  primaryButton: {
    backgroundColor: '#fff',
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  secondaryButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    borderWidth: 2,
    borderColor: '#fff',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonIcon: {
    marginRight: SPACING.sm,
  },
  primaryButtonText: {
    fontSize: FONT_SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  secondaryButtonText: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: '#fff',
  },
  buttonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  featuresContainer: {
    marginTop: SPACING.lg,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
  },
  featureEmoji: {
    fontSize: 28,
    marginRight: SPACING.md,
  },
  featureText: {
    fontSize: FONT_SIZES.md,
    color: '#fff',
    flex: 1,
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
});
