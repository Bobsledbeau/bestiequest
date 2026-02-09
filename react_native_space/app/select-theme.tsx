import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, Pressable, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemeCard } from '../components/ThemeCard';
import { SubThemeCard } from '../components/SubThemeCard';
import { useStory } from '../context/StoryContext';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '../utils/constants';
import { Theme } from '../types/api';

export default function SelectThemeScreen() {
  const router = useRouter();
  const { themes, selectedTheme, selectedSubTheme, setSelectedTheme, setSelectedSubTheme } = useStory();
  const [localTheme, setLocalTheme] = useState<string | null>(selectedTheme);
  const [localSubTheme, setLocalSubTheme] = useState<string | null>(selectedSubTheme);

  useEffect(() => {
    setLocalTheme(selectedTheme);
    setLocalSubTheme(selectedSubTheme);
  }, [selectedTheme, selectedSubTheme]);

  const currentThemeData = themes.find((t) => t.id === localTheme);
  const needsSubTheme = currentThemeData?.hasSubCategories;

  const handleThemeSelect = (themeId: string) => {
    setLocalTheme(themeId);
    // Reset sub-theme when changing main theme
    setLocalSubTheme(null);
  };

  const handleSubThemeSelect = (subThemeId: string) => {
    setLocalSubTheme(subThemeId);
  };

  const handleNext = () => {
    if (!localTheme) {
      Alert.alert('No Theme Selected', 'Please select a theme for your story.', [
        { text: 'OK' },
      ]);
      return;
    }

    if (needsSubTheme && !localSubTheme) {
      Alert.alert(
        'Select a Sub-Theme',
        `Please choose a ${currentThemeData?.name} sub-theme.`,
        [{ text: 'OK' }]
      );
      return;
    }

    setSelectedTheme(localTheme);
    setSelectedSubTheme(localSubTheme);
    router.push('/select-length');
  };

  const canProceed = localTheme && (!needsSubTheme || localSubTheme);

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Choose Your Story Theme</Text>
          {themes.map((theme) => (
            <ThemeCard
              key={theme.id}
              theme={theme}
              selected={localTheme === theme.id}
              onPress={() => handleThemeSelect(theme.id)}
            />
          ))}
        </View>

        {needsSubTheme && currentThemeData && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Pick a {currentThemeData.name} Topic
            </Text>
            <View style={styles.subThemeGrid}>
              {currentThemeData.subCategories.map((subTheme) => (
                <View key={subTheme.id} style={styles.subThemeWrapper}>
                  <SubThemeCard
                    subTheme={subTheme}
                    selected={localSubTheme === subTheme.id}
                    onPress={() => handleSubThemeSelect(subTheme.id)}
                  />
                </View>
              ))}
            </View>
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <Pressable
          style={({ pressed }) => [
            styles.nextButton,
            !canProceed && styles.buttonDisabled,
            pressed && canProceed && styles.buttonPressed,
          ]}
          onPress={handleNext}
          disabled={!canProceed}
          accessibilityRole="button"
          accessibilityLabel="Next step"
          accessibilityState={{ disabled: !canProceed }}
        >
          <Text style={styles.nextButtonText}>Next: Story Length →</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: SPACING.md,
  },
  section: {
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
  subThemeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -SPACING.xs,
  },
  subThemeWrapper: {
    width: '50%',
  },
  footer: {
    padding: SPACING.md,
    backgroundColor: COLORS.card,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  nextButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: COLORS.border,
  },
  buttonPressed: {
    opacity: 0.8,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
  },
});
