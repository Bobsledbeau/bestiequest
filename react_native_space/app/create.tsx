import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { motion } from 'framer-motion';
import { Rabbit, Lion, Owl, Sparkles, Fox, Bear, Bird, Elephant, Lamp, Map, Wand2, Handshake, BookOpen, Box, Cake, Feather } from 'lucide-react-native';

const API_URL = 'http://localhost:3001'; // Change to your Render backend URL later

const characterData = [
  { name: 'Fluffy Bunny', icon: Rabbit },
  { name: 'Brave Lion', icon: Lion },
  { name: 'Magic Owl', icon: Owl },
  { name: 'Sparkle Unicorn', icon: Sparkles },
  { name: 'Dancing Fox', icon: Fox },
  { name: 'Cozy Bear', icon: Bear },
  { name: 'Rainbow Parrot', icon: Bird },
  { name: 'Gentle Elephant', icon: Elephant },
];

const itemData = [
  { name: 'Magic Lantern', icon: Lamp },
  { name: 'Enchanted Map', icon: Map },
  { name: 'Star Wand', icon: Wand2 },
  { name: 'Friendship Bracelet', icon: Handshake },
  { name: 'Storybook', icon: BookOpen },
  { name: 'Treasure Chest', icon: Box },
  { name: 'Moon Cake', icon: Cake },
  { name: 'Wish Feather', icon: Feather },
];

const themes = [
  { name: 'Funny', subs: [] },
  { name: 'Magical', subs: [] },
  { name: 'Life Lessons', subs: ['Honesty', 'Friendship', 'Kindness', 'Courage'] },
  { name: 'Learning', subs: ['Animals', 'Space', 'Nature', 'Science', 'Numbers'] },
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

  const toggle = (itemName: string, isCharacter: boolean) => {
    const setSelected = isCharacter ? setSelectedChars : setSelectedItems;
    const selected = isCharacter ? selectedChars : selectedItems;

    if (selected.includes(itemName)) {
      setSelected(selected.filter(i => i !== itemName));
    } else if (selectedChars.length + selectedItems.length < 10) {
      setSelected([...selected, itemName]);
    }
  };

  const generate = async () => {
    if (selectedChars.length + selectedItems.length === 0) return Alert.alert('Please pick at least one');
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
    <ScrollView className="flex-1 bg-lavender p-6">
      <Text className="text-4xl font-bold text-purple mb-8 text-center">Create Magic ✨</Text>

      {step === 1 && (
        <>
          <Text className="text-2xl font-semibold mb-4 text-sky">1. Choose Characters & Items (max 10)</Text>
          <View className="flex-row flex-wrap gap-4">
            {characterData.map(({ name, icon: Icon }) => (
              <motion.div
                key={name}
                initial={{ scale: 0.9 }}
                animate={{ scale: selectedChars.includes(name) ? 1.1 : 1 }}
                transition={{ duration: 0.2 }}
              >
                <TouchableOpacity
                  onPress={() => toggle(name, true)}
                  className={`p-4 rounded-3xl shadow-md flex-row items-center gap-2 w-40 ${selectedChars.includes(name) ? 'bg-mint' : 'bg-white'}`}
                >
                  <Icon color={selectedChars.includes(name) ? '#fff' : '#D4A5FF'} size=24 />
                  <Text className={`${selectedChars.includes(name) ? 'text-white' : 'text-purple'} font-semibold`}>{name}</Text>
                </TouchableOpacity>
              </motion.div>
            ))}
            {itemData.map(({ name, icon: Icon }) => (
              <motion.div
                key={name}
                initial={{ scale: 0.9 }}
                animate={{ scale: selectedItems.includes(name) ? 1.1 : 1 }}
                transition={{ duration: 0.2 }}
              >
                <TouchableOpacity
                  onPress={() => toggle(name, false)}
                  className={`p-4 rounded-3xl shadow-md flex-row items-center gap-2 w-40 ${selectedItems.includes(name) ? 'bg-peach' : 'bg-white'}`}
                >
                  <Icon color={selectedItems.includes(name) ? '#fff' : '#D4A5FF'} size=24 />
                  <Text className={`${selectedItems.includes(name) ? 'text-white' : 'text-purple'} font-semibold`}>{name}</Text>
                </TouchableOpacity>
              </motion.div>
            ))}
          </View>
          <TouchableOpacity onPress={() => setStep(2)} className="bg-purple py-5 rounded-3xl mt-10">
            <Text className="text-white text-2xl text-center">Next →</Text>
          </TouchableOpacity>
        </>
      )}

      {step === 2 && (
        <>
          <Text className="text-2xl font-semibold mb-6 text-mint">2. Pick a Theme</Text>
          <View className="gap-4">
            {themes.map(t => (
              <TouchableOpacity key={t.name} onPress={() => { setThemeName(t.name); setSubTheme(''); setStep(3); }} className="bg-white p-6 rounded-3xl shadow-md">
                <Text className="text-2xl font-bold text-purple">{t.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </>
      )}

      {step === 3 && (
        <>
          <Text className="text-2xl font-semibold mb-6 text-peach">3. Personalisation</Text>
          <TextInput className="bg-white p-6 rounded-3xl text-2xl mb-6 shadow-md" placeholder="Child's name (optional)" value={childName} onChangeText={setChildName} />
          <View className="flex-row gap-4 mb-10">
            <TouchableOpacity onPress={() => setChildGender('boy')} className={`flex-1 py-6 rounded-3xl shadow-md ${childGender === 'boy' ? 'bg-purple' : 'bg-white'}`}>
              <Text className={`text-center text-2xl ${childGender === 'boy' ? 'text-white' : 'text-gray-700'}`}>Boy 👦</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setChildGender('girl')} className={`flex-1 py-6 rounded-3xl shadow-md ${childGender === 'girl' ? 'bg-purple' : 'bg-white'}`}>
              <Text className={`text-center text-2xl ${childGender === 'girl' ? 'text-white' : 'text-gray-700'}`}>Girl 👧</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={() => setStep(4)} className="bg-purple py-5 rounded-3xl shadow-md">
            <Text className="text-white text-2xl text-center">Next →</Text>
          </TouchableOpacity>
        </>
      )}

      {step === 4 && (
        <>
          <Text className="text-2xl font-semibold mb-6 text-butter">4. Story Length</Text>
          {['Short (~500 words)', 'Medium (~1000 words)', 'Long (~2000 words)'].map((l, i) => (
            <TouchableOpacity key={i} onPress={() => setLength(['Short','Medium','Long'][i] as any)} className={`p-8 rounded-3xl mb-4 shadow-md ${length === ['Short','Medium','Long'][i] ? 'bg-purple' : 'bg-white'}`}>
              <Text className={`text-2xl text-center ${length === ['Short','Medium','Long'][i] ? 'text-white' : 'text-purple'}`}>{l}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity onPress={generate} disabled={loading} className="bg-mint py-6 rounded-3xl mt-8 shadow-md">
            <Text className="text-white text-3xl font-bold text-center">{loading ? '✨ Generating...' : 'Generate Story 🌙'}</Text>
          </TouchableOpacity>
        </>
      )}
    </ScrollView>
  );
}
