import { Tabs } from 'expo-router';
import { Home, PlusCircle, Heart } from 'lucide-react-native';

export default function Layout() {
  return (
    <Tabs screenOptions={{ headerShown: false, tabBarActiveTintColor: '#D4A5FF' }}>
      <Tabs.Screen name="index" options={{ title: 'Home', tabBarIcon: ({ color }) => <Home color={color} size={28} /> }} />
      <Tabs.Screen name="create" options={{ title: 'Create Story', tabBarIcon: ({ color }) => <PlusCircle color={color} size={28} /> }} />
      <Tabs.Screen name="library" options={{ title: 'Library', tabBarIcon: ({ color }) => <Heart color={color} size={28} /> }} />
    </Tabs>
  );
}
