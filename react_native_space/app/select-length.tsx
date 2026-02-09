import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, Pressable, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useStory } from '../context/StoryContext';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS, STORY_LENGTH_DESCRIPTIONS } from '../utils/constants';
import { generateStory } from '../services/api';
import { LoadingIndicator } from '../components/LoadingIndicator';
import { Alert } from 'react-native';

type LengthOption = 'short' | 'medium' | 'long';

const LENGTH_EMOJIS: Record<LengthOption, string> = {
  short: '⏱️',
  medium: '⏰',
  long: '📖',
};

export default function SelectLengthScreen() {
  const router = useRouter();
  const {
    selectedItems,
    selectedTheme,
    selectedSubTheme,
    selectedLength,
    childName,
    childGender,
    setSelectedLength,
    setChildName,
    setChildGender,
    setCurrentStory,
  } = useStory();

  const [localLength, setLocalLength] = useState<LengthOption | null>(selectedLength);
  const [localChildName, setLocalChildName] = useState(childName);
  const [localChildGender, setLocalChildGender] = useState<'boy' | 'girl' | null>(childGender);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    setLocalLength(selectedLength);
    setLocalChildName(childName);
    setLocalChildGender(childGender);
  }, [selectedLength, childName, childGender]);

  const handleLengthSelect = (length: LengthOption) => {
    setLocalLength(length);
  };

  const handleGenerateStory = async () => {
    if (!localLength || !selectedTheme) {
      Alert.alert('Missing Information', 'Please select a story length.', [{ text: 'OK' }]);
      return;
    }

    setIsGenerating(true);
    setSelectedLength(localLength);
    setChildName(localChildName.trim());
    setChildGender(localChildGender);

    try {
      const story = await generateStory({
        selectedItems,
        theme: selectedTheme,
        subTheme: selectedSubTheme || undefined,
        length: localLength,
        childName: localChildName.trim() || undefined,
        childGender: localChildGender || undefined,
      });

      setCurrentStory(story);
      router.replace('/story');
    } catch (error) {
      Alert.alert(
        'Story Generation Failed',
        error instanceof Error ? error.message : 'Failed to generate story. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsGenerating(false);
    }
  };

  if (isGenerating) {
    return <LoadingIndicator message="Creating your magical story..." />;
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={100}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.sectionTitle}>How Long Should the Story Be?</Text>

          {(['short', 'medium', 'long'] as LengthOption[]).map((length) => (
            <Pressable
              key={length}
              style={({ pressed }) => [
                styles.lengthCard,
                localLength === length && styles.lengthCardSelected,
                pressed && styles.cardPressed,
              ]}
              onPress={() => handleLengthSelect(length)}
              accessibilityRole="button"
              accessibilityLabel={`${length} story`}
              accessibilityHint={STORY_LENGTH_DESCRIPTIONS[length]}
              accessibilityState={{ selected: localLength === length }}
            >
              <Text style={styles.lengthEmoji}>{LENGTH_EMOJIS[length]}</Text>
              <Text style={styles.lengthTitle}>
                {length.charAt(0).toUpperCase() + length.slice(1)}
              </Text>
              <Text style={styles.lengthDescription}>
                {STORY_LENGTH_DESCRIPTIONS[length]}
              </Text>
            </Pressable>
          ))}

          <View style={styles.personalizeSection}>
            <Text style={styles.personalizeTitle}>
              👶 Make it Personal! (Optional)
            </Text>
            <Text style={styles.personalizeSubtitle}>
              Enter your child's name to personalize the story
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Child's name (optional)"
              placeholderTextColor={COLORS.textLight}
              value={localChildName}
              onChangeText={setLocalChildName}
              autoCapitalize="words"
              returnKeyType="done"
              accessibilityLabel="Child's name input"
              maxLength={30}
            />
            
            <Text style={styles.genderTitle}>Select Gender (Optional)</Text>
            <View style={styles.genderButtons}>
              <Pressable
                style={({ pressed }) => [
                  styles.genderButton,
                  localChildGender === 'boy' && styles.genderButtonSelected,
                  pressed && styles.genderButtonPressed,
                ]}
                onPress={() => setLocalChildGender(localChildGender === 'boy' ? null : 'boy')}
                accessibilityRole="button"
                accessibilityLabel="Select boy"
                accessibilityState={{ selected: localChildGender === 'boy' }}
              >
                <Text style={styles.genderEmoji}>👦</Text>
                <Text style={[
                  styles.genderText,
                  localChildGender === 'boy' && styles.genderTextSelected
                ]}>
                  Boy
                </Text>
              </Pressable>

              <Pressable
                style={({ pressed }) => [
                  styles.genderButton,
                  localChildGender === 'girl' && styles.genderButtonSelected,
                  pressed && styles.genderButtonPressed,
                ]}
                onPress={() => setLocalChildGender(localChildGender === 'girl' ? null : 'girl')}
                accessibilityRole="button"
                accessibilityLabel="Select girl"
                accessibilityState={{ selected: localChildGender === 'girl' }}
              >
                <Text style={styles.genderEmoji}>👧</Text>
                <Text style={[
                  styles.genderText,
                  localChildGender === 'girl' && styles.genderTextSelected
                ]}>
                  Girl
                </Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <Pressable
            style={({ pressed }) => [
              styles.generateButton,
              !localLength && styles.buttonDisabled,
              pressed && localLength && styles.buttonPressed,
            ]}
            onPress={handleGenerateStory}
            disabled={!localLength}
            accessibilityRole="button"
            accessibilityLabel="Generate story"
            accessibilityState={{ disabled: !localLength }}
          >
            <Text style={styles.generateButtonText}>✨ Generate Story ✨</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.md,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.lg,
    textAlign: 'center',
  },
  lengthCard: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    borderWidth: 3,
    borderColor: COLORS.border,
    alignItems: 'center',
  },
  lengthCardSelected: {
    borderColor: COLORS.primary,
    backgroundColor: '#f3e5f5',
  },
  cardPressed: {
    opacity: 0.8,
  },
  lengthEmoji: {
    fontSize: 48,
    marginBottom: SPACING.sm,
  },
  lengthTitle: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  lengthDescription: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textLight,
    textAlign: 'center',
  },
  personalizeSection: {
    marginTop: SPACING.lg,
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.lg,
  },
  personalizeTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.xs,
    textAlign: 'center',
  },
  personalizeSubtitle: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textLight,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  input: {
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  genderTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.text,
    marginTop: SPACING.lg,
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  genderButtons: {
    flexDirection: 'row',
    gap: SPACING.md,
    justifyContent: 'center',
  },
  genderButton: {
    flex: 1,
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    borderWidth: 2,
    borderColor: COLORS.border,
    alignItems: 'center',
  },
  genderButtonSelected: {
    borderColor: COLORS.primary,
    backgroundColor: '#f3e5f5',
  },
  genderButtonPressed: {
    opacity: 0.7,
  },
  genderEmoji: {
    fontSize: 32,
    marginBottom: SPACING.xs,
  },
  genderText: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.textLight,
  },
  genderTextSelected: {
    color: COLORS.primary,
  },
  footer: {
    padding: SPACING.md,
    backgroundColor: COLORS.card,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  generateButton: {
    backgroundColor: COLORS.success,
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
  generateButtonText: {
    color: '#fff',
    fontSize: FONT_SIZES.xl,
    fontWeight: 'bold',
  },
});
