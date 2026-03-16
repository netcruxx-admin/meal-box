import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import Toast from 'react-native-toast-message';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { store } from '@/store';
import { Provider } from 'react-redux';

// export const unstable_settings = {
//   anchor: '(tabs)',
// };

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Provider store={store}>
        <Stack
          screenOptions={{ headerShown: false }}
          initialRouteName="index"
        >
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
        </Stack>
        <StatusBar style="dark" />
        <Toast />
      </Provider>
    </ThemeProvider>
  );
}
