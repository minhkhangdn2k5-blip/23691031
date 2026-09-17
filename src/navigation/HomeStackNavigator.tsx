import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '@screens/HomeScreen';
import ProductDetailScreen from '@screens/ProductDetailScreen';
import { COLORS } from '@constants/theme';
import { useTheme } from '@hooks/useTheme';

export type HomeStackParamList = {
  Home: undefined;
  ProductDetail: { productId: string };
};

const Stack = createNativeStackNavigator<HomeStackParamList>();

/**
 * HomeStackNavigator: Quản lý luồng Stack giữa Trang chủ và Chi tiết sản phẩm
 * Đặt lồng bên trong Tab "Trang chủ" của MainTabNavigator (Chương 6 - Bước 5: Xóa Prop Drilling)
 */
export const HomeStackNavigator: React.FC = () => {
  const { colors } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.text,
        headerTitleStyle: { fontWeight: '700' },
      }}
    >
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="ProductDetail"
        component={ProductDetailScreen}
        options={{
          title: 'Chi tiết sản phẩm',
          headerBackTitle: 'Quay lại',
        }}
      />
    </Stack.Navigator>
  );
};

export default HomeStackNavigator;
