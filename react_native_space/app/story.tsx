import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Speech from 'expo-speech';  // Works on web too

export default function StoryViewer() {
  const { id } = useLocalSearchParams();
  const [story, setStory] = useState<any>(null);
  const [speaking, setSpeaking] = useState(false);

  useEffect(() => {
    const load = async () => {
      const data = await AsyncStorage.getItem(`story_${id}`);
      setStory(JSON.parse(data!));
    };
    load();
  }, [id]);

  const readAloud = () => {
    if (speaking) {
      Speech.stop();
      setSpeaking(false);
    } else {
      Speech.speak(story.story, { rate: 0.9 });
      setSpeaking(true);
    }
  };

  if (!story) return <Text>Loading...</Text>;

  return (
    <ScrollView className="flex-1 bg-[#f8f4ff] p-6">
      <TouchableOpacity onPress={() => router.back()} className="mb-6">
        <Text className="text-purple text-xl">← Back</Text>
      </TouchableOpacity>
      <Text className="text-4xl font-bold text-purple">{story.title}</Text>
      <Text className="text-gray-500 mt-2">For {story.childName} • {story.length}</Text>
      
      <View className="bg-white p-8 rounded-3xl mt-8 mb-12">
        <Text className="text-xl leading-relaxed text-gray-800">{story.story}</Text>
      </View>

      <TouchableOpacity onPress={readAloud} className="bg-mint py-6 rounded-3xl">
        <Text className="text-white text-3xl text-center">{speaking ? 'Stop Reading' : 'Read Aloud 📖'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
