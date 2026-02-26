import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function StoryViewer() {
  const { id } = useLocalSearchParams();
  const [storyData, setStoryData] = useState(null);
  const [speaking, setSpeaking] = useState(false);

  useEffect(() => {
    const load = async () => {
      const data = await AsyncStorage.getItem(`story_${id}`);
      setStoryData(JSON.parse(data));
    };
    load();
  }, [id]);

  const readAloud = () => {
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
    } else if (storyData) {
      const utterance = new SpeechSynthesisUtterance(storyData.story);
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      utterance.onend = () => setSpeaking(false);
      window.speechSynthesis.speak(utterance);
      setSpeaking(true);
    }
  };

  if (!storyData) return <Text className="text-center mt-20 text-xl">Loading story...</Text>;

  return (
    <ScrollView className="flex-1 bg-[#f8f4ff] p-6">
      <TouchableOpacity onPress={() => router.back()} className="mb-6">
        <Text className="text-purple text-xl">← Back</Text>
      </TouchableOpacity>
      <Text className="text-4xl font-bold text-purple">{storyData.title}</Text>
      <Text className="text-gray-500 mt-2">For {storyData.childName} • {storyData.length}</Text>
      
      <View className="bg-white p-8 rounded-3xl mt-8 mb-12">
        <Text className="text-xl leading-relaxed text-gray-800 whitespace-pre-wrap">{storyData.story}</Text>
      </View>

      <TouchableOpacity onPress={readAloud} className="bg-mint py-6 rounded-3xl">
        <Text className="text-white text-3xl text-center">{speaking ? 'Stop Reading' : 'Read Aloud 📖'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
