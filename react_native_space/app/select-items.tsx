import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, Pressable, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ItemCard } from '../components/ItemCard';
import { useStory } from '../context/StoryContext';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS, MIN_ITEMS_SELECTION, MAX_ITEMS_SELECTION } from '../utils/constants';
import { Item } from '../types/api';

export default function SelectItemsScreen() {
  const router = useRouter();
  const { items, selectedItems, setSelectedItems } = useStory();
  const [localSelection, setLocalSelection] = useState<string[]>(selectedItems);

  useEffect(() => {
    setLocalSelection(selectedItems);
  }, [selectedItems]);

  const toggleItem = (itemId: string) => {
    setLocalSelection((prev) => {
      if (prev.includes(itemId)) {
        return prev.filter((id) => id !== itemId);
      } else {
        if (prev.length >= MAX_ITEMS_SELECTION) {
          Alert.alert(
            'Maximum Reached',
            `You can select up to ${MAX_ITEMS_SELECTION} items.`,
            [{ text: 'OK' }]
          );
          return prev;
        }
        return [...prev, itemId];
      }
    });
  };

  const handleNext = () => {
    if (localSelection.length === 0) {
      Alert.alert(
        'No Items Selected',
        'Please select at least one character or item.',
        [{ text: 'OK' }]
      );
      return;
    }
    setSelectedItems(localSelection);
    router.push('/select-theme');
  };

  const renderItem = ({ item }: { item: Item }) => (
    <View style={styles.itemWrapper}>
      <ItemCard
        item={item}
        selected={localSelection.includes(item.id)}
        onPress={() => toggleItem(item.id)}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.header}>
        <Text style={styles.instruction}>
          Choose characters and items for your story
        </Text>
        <View style={styles.counter}>
          <Text style={[styles.counterText, localSelection.length > 0 && styles.counterTextActive]}>
            {localSelection.length} of {MAX_ITEMS_SELECTION} selected
          </Text>
        </View>
      </View>

      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={3}
        contentContainerStyle={styles.list}
        columnWrapperStyle={styles.row}
        showsVerticalScrollIndicator={false}
      />

      <View style={styles.footer}>
        <Pressable
          style={({ pressed }) => [
            styles.nextButton,
            localSelection.length === 0 && styles.buttonDisabled,
            pressed && localSelection.length > 0 && styles.buttonPressed,
          ]}
          onPress={handleNext}
          disabled={localSelection.length === 0}
          accessibilityRole="button"
          accessibilityLabel="Next step"
          accessibilityState={{ disabled: localSelection.length === 0 }}
        >
          <Text style={styles.nextButtonText}>Next: Pick Theme →</Text>
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
  header: {
    padding: SPACING.md,
    backgroundColor: COLORS.card,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  instruction: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  counter: {
    alignItems: 'center',
  },
  counterText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textLight,
    fontWeight: '600',
  },
  counterTextActive: {
    color: COLORS.success,
  },
  list: {
    padding: SPACING.sm,
  },
  row: {
    justifyContent: 'space-between',
  },
  itemWrapper: {
    flex: 1,
    maxWidth: '33%',
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
