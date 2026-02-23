import { Stack } from 'expo-router';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StoryProvider } from '../context/StoryContext';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { COLORS } from '../utils/constants';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function RootLayout() {
  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <PaperProvider>
          <StoryProvider>
            <Stack
              screenOptions={{
                headerStyle: {
                  backgroundColor: COLORS.primary,
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                  fontWeight: 'bold',
                },
                contentStyle: {
                  backgroundColor: COLORS.background,
                },
              }}
            >
              <Stack.Screen
                name="index"
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="select-items"
                options={{
                  title: 'Choose Characters',
                  headerBackTitle: 'Back',
                }}
              />
              <Stack.Screen
                name="select-theme"
                options={{
                  title: 'Pick a Theme',
                  headerBackTitle: 'Back',
                }}
              />
              <Stack.Screen
                name="select-length"
                options={{
                  title: 'Story Length',
                  headerBackTitle: 'Back',
                }}
              />
              <Stack.Screen
                name="story"
                options={{
                  title: 'Your Story',
                  headerBackTitle: 'Back',
                }}
              />
              <Stack.Screen
                name="library"
                options={{
                  title: 'My Story Library',
                  headerBackTitle: 'Home',
                }}
              />
            </Stack>
          </StoryProvider>
        </PaperProvider>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}
