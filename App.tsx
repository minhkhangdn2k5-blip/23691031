import React from 'react';
import { NavigationContainer, LinkingOptions } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from '@contexts/ThemeContext';
import LoginScreen from '@screens/LoginScreen';
import RegisterScreen from '@screens/RegisterScreen';
import RootStackNavigator from '@navigation/RootStackNavigator';
import { useAuthStore } from '@store/useAuthStore';
import { reduxStore } from '@store/redux/store';
import './src/locales/i18n';

// AuthStack: Chỉ hiển thị khi chưa đăng nhập
const AuthStack = createNativeStackNavigator();

// Cấu hình TanStack Query Client toàn cục (Chương 6 - Bước 5)
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // Dữ liệu còn "Tươi" trong 5 phút
      retry: 2,
    },
  },
});

// Cấu hình Deep Linking: shopai://product/:productId -> tự động mở ProductDetail
const linking: LinkingOptions<any> = {
  prefixes: ['shopai://'],
  config: {
    screens: {
      MainTabs: {
        screens: {
          HomeTab: {
            screens: {
              ProductDetail: 'product/:productId',
            },
          },
        },
      },
    },
  },
};

/**
 * Gốc ứng dụng ShopAI: Bọc QueryClientProvider, Redux Provider, RootStackNavigator & useAuthStore
 * Hoàn thiện đầy đủ cả 3 hệ thống State Management theo đề cương: Context API, Zustand và Redux Toolkit
 */
function App(): React.JSX.Element {
  // Đọc trực tiếp token xác thực từ Đám mây useAuthStore
  const token = useAuthStore((state) => state.token);

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <Provider store={reduxStore}>
          <ThemeProvider>
            <NavigationContainer linking={linking}>
              {token == null ? (
                // LUỒNG 1: CHƯA ĐĂNG NHẬP — AuthStack (Login ↔ Register)
                <AuthStack.Navigator screenOptions={{ headerShown: false }}>
                  <AuthStack.Screen name="Login" component={LoginScreen} />
                  <AuthStack.Screen name="Register" component={RegisterScreen} />
                </AuthStack.Navigator>
              ) : (
                // LUỒNG 2: ĐÃ ĐĂNG NHẬP — RootStackNavigator (MainTabs + Modal Checkout + OrderDetail)
                <RootStackNavigator />
              )}
            </NavigationContainer>
          </ThemeProvider>
        </Provider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}

export default App;