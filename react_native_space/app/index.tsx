import { View, Text, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Sparkles } from 'lucide-react-native';

export default function Home() {
  return (
    <View className="flex-1 bg-[#f8f4ff] items-center justify-center p-6">
      <Sparkles size={80} color="#D4A5FF" />
      <Text className="text-5xl font-bold text-purple mt-6">BestieQuest</Text>
      <Text className="text-xl text-center text-gray-600 mt-3">Magical bedtime stories in 60 seconds</Text>
      <TouchableOpacity onPress={() => router.push('/create')} className="bg-purple px-12 py-5 rounded-3xl mt-12">
        <Text className="text-white text-2xl font-semibold">Create New Story ✨</Text>
      </TouchableOpacity>
    </View>
  );
}
