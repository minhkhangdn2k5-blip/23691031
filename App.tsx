import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from '@contexts/ThemeContext';
import AppNavigator from '@navigation/AppNavigator';

/**
 * Ứng dụng ShopAI (Chương 1 đến Chương 4)
 * - Cây Provider chuẩn: SafeAreaProvider -> ThemeProvider -> AppNavigator
 * - Điều hướng Bottom Tabs + Stack Navigator
 * - Lưới FlashList 2 cột + Reanimated Worklets
 */
function App(): React.JSX.Element {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AppNavigator />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

export default App;