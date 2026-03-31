import { Stack } from 'expo-router';
import Head from 'expo-router/head';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StoryProvider } from '../context/StoryContext';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { COLORS } from '../utils/constants';

export default function RootLayout() {
  return (
    <ErrorBoundary>
      <Head>
        <link rel="apple-touch-icon" href="/icon-180.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/icon-152.png" />
        <link rel="apple-touch-icon" sizes="120x120" href="/icon-120.png" />
      </Head>
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
