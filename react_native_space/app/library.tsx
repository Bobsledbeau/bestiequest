import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Trash2 } from 'lucide-react-native';
import { router } from 'expo-router';
export default function Library() {
  const [stories, setStories] = useState([]);
  useEffect(() => { loadStories(); }, []);
  const loadStories = async () => {
    const keys = await AsyncStorage.getAllKeys();
    const storyKeys = keys.filter(k => k.startsWith('story_'));
    const loaded = await Promise.all(storyKeys.map(async k => JSON.parse(await AsyncStorage.getItem(k))));
    setStories(loaded.sort((a,b) => b.date.localeCompare(a.date)));
  };
  const deleteStory = async (id) => { await AsyncStorage.removeItem(`story_${id}`); loadStories(); };
  return (
    <ScrollView className="flex-1 bg-[#f8f4ff] p-6">
      <Text className="text-4xl font-bold text-purple mb-8">My Library ❤️</Text>
      {stories.map(s => (
        <TouchableOpacity key={s.id} onPress={() => router.push({ pathname: '/story', params: { id: s.id } })} className="bg-white p-6 rounded-3xl mb-4">
          <Text className="text-2xl font-semibold">{s.title}</Text>
          <Text className="text-gray-500">For {s.childName} • {s.length}</Text>
          <TouchableOpacity onPress={(e) => { e.stopPropagation(); deleteStory(s.id); }} className="absolute top-6 right-6">
            <Trash2 size={24} color="#f00" />
          </TouchableOpacity>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}
