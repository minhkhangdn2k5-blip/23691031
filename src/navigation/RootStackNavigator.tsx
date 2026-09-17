import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainTabNavigator from '@navigation/MainTabNavigator';
import CheckoutScreen from '@screens/CheckoutScreen';
import OrderDetailScreen from '@screens/OrderDetailScreen';
import ReduxCartDemoScreen from '@screens/ReduxCartDemoScreen';
import { useTheme } from '@hooks/useTheme';

export type RootStackParamList = {
  MainTabs: undefined;
  Checkout: undefined;
  OrderDetail: { orderId: string };
  ReduxCartDemo: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

/**
 * Tầng điều hướng cao nhất RootStackNavigator (Chương 6 - Bước 9.5 & 10)
 * Bọc ngoài MainTabs, quản lý Modal Checkout, Chi tiết hóa đơn và Demo Redux Toolkit
 */
export const RootStackNavigator: React.FC = () => {
  const { colors } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.text,
        headerTitleStyle: { fontWeight: '700' },
      }}
    >
      {/* 1. Thanh Tab chính của toàn bộ App */}
      <Stack.Screen name="MainTabs" component={MainTabNavigator} />

      {/* 2. Modal Thanh toán (Trượt từ dưới lên, che toàn bộ Tab bar) */}
      <Stack.Screen
        name="Checkout"
        component={CheckoutScreen}
        options={{
          presentation: 'modal',
          headerShown: true,
          title: 'Thanh toán',
          headerBackTitle: 'Đóng',
        }}
      />

      {/* 3. Chi tiết Hóa đơn */}
      <Stack.Screen
        name="OrderDetail"
        component={OrderDetailScreen}
        options={{
          headerShown: true,
          title: 'Chi tiết Đơn hàng',
          headerBackTitle: 'Quay lại',
        }}
      />

      {/* 4. Màn hình Demo Redux Toolkit (Phục vụ chấm điểm & nghiệm thu đề cương) */}
      <Stack.Screen
        name="ReduxCartDemo"
        component={ReduxCartDemoScreen}
        options={{
          headerShown: true,
          title: 'Demo Redux Toolkit',
          headerBackTitle: 'Quay lại',
        }}
      />
    </Stack.Navigator>
  );
};

export default RootStackNavigator;
