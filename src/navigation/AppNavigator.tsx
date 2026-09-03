import React from 'react';
import { Text, StyleSheet } from 'react-native';
import {
  NavigationContainer,
  NavigatorScreenParams,
  LinkingOptions,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTheme } from '@hooks/useTheme';
import { COLORS } from '@constants/theme';

import HomeScreen from '@screens/HomeScreen';
import DemosScreen from '@screens/DemosScreen';
import ProductDetailScreen from '@screens/ProductDetailScreen';
import CollapsingHeaderDemo from '@screens/demos/CollapsingHeaderDemo';

export type MainTabParamList = {
  HomeTab: undefined;
  DemosTab: undefined;
  CollapseTab: undefined;
};

export type RootStackParamList = {
  MainTabs: NavigatorScreenParams<MainTabParamList>;
  ProductDetail: { productId: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

/**
 * Deep Linking Configuration (Chương 4 Đề cương / Chương 5 Giáo trình)
 * Mở ứng dụng từ liên kết web hoặc terminal: npx uri-scheme open "shopai://product/prod_1" --android
 */
const linking: LinkingOptions<RootStackParamList> = {
  prefixes: ['shopai://', 'https://shopai.com'],
  config: {
    screens: {
      MainTabs: {
        screens: {
          HomeTab: 'home',
          DemosTab: 'demos',
          CollapseTab: 'collapse',
        },
      },
      ProductDetail: 'product/:productId',
    },
  },
};

const renderHomeIcon = ({ color }: { color: string }) => (
  <Text style={[styles.tabIcon, { color }]}>🛍️</Text>
);
const renderDemosIcon = ({ color }: { color: string }) => (
  <Text style={[styles.tabIcon, { color }]}>📚</Text>
);
const renderCollapseIcon = ({ color }: { color: string }) => (
  <Text style={[styles.tabIcon, { color }]}>🎬</Text>
);

function MainTabNavigator() {
  const { colors } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          height: 60,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textLight,
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Trang chủ',
          tabBarIcon: renderHomeIcon,
        }}
      />
      <Tab.Screen
        name="DemosTab"
        component={DemosScreen}
        options={{
          tabBarLabel: 'Demos Đề Cương',
          tabBarIcon: renderDemosIcon,
        }}
      />
      <Tab.Screen
        name="CollapseTab"
        component={CollapsingHeaderDemo}
        options={{
          tabBarLabel: 'Cuộn Header',
          tabBarIcon: renderCollapseIcon,
        }}
      />
    </Tab.Navigator>
  );
}

export function AppNavigator() {
  const { isDark } = useTheme();

  return (
    <NavigationContainer
      linking={linking}
      theme={{
        dark: isDark,
        colors: {
          primary: COLORS.primary,
          background: isDark ? COLORS.dark.background : COLORS.background,
          card: isDark ? COLORS.dark.surface : COLORS.surface,
          text: isDark ? COLORS.dark.text : COLORS.text,
          border: isDark ? COLORS.dark.border : COLORS.border,
          notification: COLORS.primary,
        },
        fonts: {
          regular: { fontFamily: 'System', fontWeight: '400' },
          medium: { fontFamily: 'System', fontWeight: '500' },
          bold: { fontFamily: 'System', fontWeight: '700' },
          heavy: { fontFamily: 'System', fontWeight: '800' },
        },
      }}
    >
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="MainTabs" component={MainTabNavigator} />
        <Stack.Screen
          name="ProductDetail"
          component={ProductDetailScreen as any}
          options={{ animation: 'slide_from_right' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  tabIcon: {
    fontSize: 18,
  },
});

export default AppNavigator;
