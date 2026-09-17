import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeStackNavigator from '@navigation/HomeStackNavigator';
import CartScreen from '@screens/CartScreen';
import OrdersScreen from '@screens/OrdersScreen';
import Typography from '@components/ui/Typography';
import { useTheme } from '@hooks/useTheme';
import { useCartStore } from '@store/useCartStore';

export type MainTabParamList = {
  HomeTab: undefined;
  Cart: undefined;
  Orders: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

/**
 * MainTabNavigator: Điều hướng thanh Tab dưới đáy (Chương 6 - Bước 9.7)
 * Gồm 3 Tab: Trang chủ 🏠, Giỏ hàng 🛒 (có Badge), Đơn hàng 📋
 */
export const MainTabNavigator: React.FC = () => {
  const { colors } = useTheme();

  // Đọc trực tiếp tổng số lượng hàng trong giỏ từ Zustand Store
  const cartBadgeCount = useCartStore((state) => state.totalQuantity());

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textLight,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          height: 60,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarLabelStyle: {
          fontWeight: '600',
          fontSize: 12,
        },
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeStackNavigator}
        options={{
          title: 'Trang chủ',
          tabBarIcon: ({ focused }) => (
            <Typography variant="body1" style={{ fontSize: 20 }}>
              {focused ? '🏠' : '🏚️'}
            </Typography>
          ),
        }}
      />

      <Tab.Screen
        name="Cart"
        component={CartScreen}
        options={{
          title: 'Giỏ hàng',
          tabBarIcon: () => (
            <Typography variant="body1" style={{ fontSize: 20 }}>
              🛒
            </Typography>
          ),
          tabBarBadge: cartBadgeCount > 0 ? cartBadgeCount : undefined,
        }}
      />

      <Tab.Screen
        name="Orders"
        component={OrdersScreen}
        options={{
          title: 'Đơn hàng',
          tabBarIcon: () => (
            <Typography variant="body1" style={{ fontSize: 20 }}>
              📋
            </Typography>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;
