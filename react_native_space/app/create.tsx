import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://localhost:3001';   // ← Local backend (change to Render URL later)

const characters = ['Fluffy Bunny', 'Brave Lion', 'Magic Owl', 'Sparkle Unicorn', 'Dancing Fox', 'Cozy Bear', 'Rainbow Parrot', 'Gentle Elephant'];
const items = ['Magic Lantern', 'Enchanted Map', 'Star Wand', 'Friendship Bracelet', 'Storybook', 'Treasure Chest', 'Moon Cake', 'Wish Feather'];
const themes = [
  { name: 'Funny', subs: [] },
  { name: 'Magical', subs: [] },
  { name: 'Life Lessons', subs: ['Honesty', 'Friendship', 'Kindness', 'Courage'] },
  { name: 'Learning', subs: ['Animals', 'Space', 'Nature', 'Science', 'Numbers'] }
];

export default function Create() {
  const [step, setStep] = useState(1);
  const [selectedChars, setSelectedChars] = useState<string[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [themeName, setThemeName] = useState('');
  const [subTheme, setSubTheme] = useState('');
  const [childName, setChildName] = useState('');
  const [childGender, setChildGender] = useState<'boy' | 'girl' | ''>('');
  const [length, setLength] = useState<'Short' | 'Medium' | 'Long'>('Short');
  const [loading, setLoading] = useState(false);

  const toggleChar = (item: string) => {
    if (selectedChars.includes(item)) setSelectedChars(selectedChars.filter(i => i !== item));
    else if (selectedChars.length < 10) setSelectedChars([...selectedChars, item]);
  };

  const toggleItem = (item: string) => {
    if (selectedItems.includes(item)) setSelectedItems(selectedItems.filter(i => i !== item));
    else if (selectedItems.length < 10) setSelectedItems([...selectedItems, item]);
  };

  const generate = async () => {
    if (selectedChars.length + selectedItems.length === 0) return Alert.alert('Please pick at least one character or item');
    if (!themeName) return Alert.alert('Please pick a theme');
    if (!childGender) return Alert.alert('Please choose boy or girl');

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/generate-story`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: [...selectedChars, ...selectedItems],
          themeName,
          subThemeName: subTheme || null,
          length,
          childName: childName.trim(),
          childGender: childGender || undefined
        })
      });
      const data = await res.json();

      const storyId = Date.now().toString();
      await AsyncStorage.setItem(`story_${storyId}`, JSON.stringify({
        id: storyId, title: data.title, story: data.story,
        date: new Date().toISOString(), length, childName: childName || 'Bestie', theme: themeName
      }));
      router.push({ pathname: '/library', params: { newStoryId: storyId } });
    } catch (e) {
      Alert.alert('Error — backend not responding? Check Terminal Tab 1');
    }
    setLoading(false);
  };

  return (
    <ScrollView className="flex-1 bg-[#f8f4ff] p-6">
      <Text className="text-4xl font-bold text-purple mb-8 text-center">Create Magic ✨</Text>

      {step === 1 && (
        <>
          <Text className="text-2xl font-semibold mb-4">1. Choose Characters & Items (max 10)</Text>
          <View className="flex-row flex-wrap gap-3">
            {[...characters, ...items].map(item => (
              <TouchableOpacity 
                key={item} 
                onPress={() => (characters.includes(item) ? toggleChar : toggleItem)(item)}
                className={`px-6 py-4 rounded-3xl border-2 ${[...selectedChars, ...selectedItems].includes(item) ? 'bg-purple border-purple' : 'bg-white border-gray-200'}`}
              >
                <Text className={[...selectedChars, ...selectedItems].includes(item) ? 'text-white' : 'text-gray-700'}>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity onPress={() => setStep(2)} className="bg-purple py-5 rounded-3xl mt-10">
            <Text className="text-white text-2xl text-center">Next →</Text>
          </TouchableOpacity>
        </>
      )}

      {step === 2 && (
        <>
          <Text className="text-2xl font-semibold mb-6">2. Pick a Theme</Text>
          {themes.map(t => (
            <TouchableOpacity key={t.name} onPress={() => { setThemeName(t.name); setSubTheme(''); setStep(3); }} className="bg-white p-6 rounded-3xl mb-4">
              <Text className="text-2xl font-bold">{t.name}</Text>
            </TouchableOpacity>
          ))}
        </>
      )}

      {step === 3 && (
        <>
          <Text className="text-2xl font-semibold mb-6">3. Personalisation</Text>
          <TextInput 
            className="bg-white p-6 rounded-3xl text-2xl mb-6" 
            placeholder="Child's name (optional)" 
            value={childName} 
            onChangeText={setChildName} 
          />
          <View className="flex-row gap-4 mb-10">
            <TouchableOpacity onPress={() => setChildGender('boy')} className={`flex-1 py-6 rounded-3xl ${childGender === 'boy' ? 'bg-purple' : 'bg-white'}`}>
              <Text className={`text-center text-2xl ${childGender === 'boy' ? 'text-white' : 'text-gray-700'}`}>Boy 👦</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setChildGender('girl')} className={`flex-1 py-6 rounded-3xl ${childGender === 'girl' ? 'bg-purple' : 'bg-white'}`}>
              <Text className={`text-center text-2xl ${childGender === 'girl' ? 'text-white' : 'text-gray-700'}`}>Girl 👧</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={() => setStep(4)} className="bg-purple py-5 rounded-3xl">
            <Text className="text-white text-2xl text-center">Next →</Text>
          </TouchableOpacity>
        </>
      )}

      {step === 4 && (
        <>
          <Text className="text-2xl font-semibold mb-6">4. Story Length</Text>
          {['Short (~800 words)', 'Medium (~1200 words)', 'Long (~2000 words)'].map((l, i) => (
            <TouchableOpacity key={i} onPress={() => setLength(['Short','Medium','Long'][i] as any)} className={`p-8 rounded-3xl mb-4 ${length === ['Short','Medium','Long'][i] ? 'bg-purple' : 'bg-white'}`}>
              <Text className={`text-2xl text-center ${length === ['Short','Medium','Long'][i] ? 'text-white' : ''}`}>{l}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity onPress={generate} disabled={loading} className="bg-mint py-6 rounded-3xl mt-8">
            <Text className="text-white text-3xl font-bold text-center">{loading ? '✨ Generating...' : 'Generate Story 🌙'}</Text>
          </TouchableOpacity>
        </>
      )}
    </ScrollView>
  );
}
