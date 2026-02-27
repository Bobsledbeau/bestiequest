import { Tabs } from 'expo-router';
import { useRootNavigationState } from 'expo-router';
import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { Home, PlusCircle, Heart } from 'lucide-react-native';

export const unstable_settings = {
  initialRouteName: 'index',
};

export default function Layout() {
  const navigationState = useRootNavigationState();
  const [isNavigationReady, setNavigationReady] = useState(false);

  if (!navigationState?.key && !isNavigationReady) {
    setNavigationReady(true);
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8f4ff' }}>
        <Text style={{ fontSize: 20, color: '#D4A5FF' }}>Loading BestieQuest...</Text>
      </View>
    );
  }

  return (
    <Tabs screenOptions={{ headerShown: false, tabBarActiveTintColor: '#D4A5FF', tabBarStyle: { backgroundColor: '#f8f4ff' } }}>
      <Tabs.Screen 
        name="index" 
        options={{ 
          title: 'Home', 
          tabBarIcon: ({ color }) => <Home color={color} size={28} /> 
        }} 
      />
      <Tabs.Screen 
        name="create" 
        options={{ 
          title: 'Create', 
          tabBarIcon: ({ color }) => <PlusCircle color={color} size={28} /> 
        }} 
      />
      <Tabs.Screen 
        name="library" 
        options={{ 
          title: 'Library', 
          tabBarIcon: ({ color }) => <Heart color={color} size={28} /> 
        }} 
      />
    </Tabs>
  );
}
