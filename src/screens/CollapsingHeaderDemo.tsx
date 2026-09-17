// src/screens/CollapsingHeaderDemo.tsx
import React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import { FlashList } from '@shopify/flash-list';
import ProductCard from '@components/ProductCard';
import { MOCK_PRODUCTS, Product } from '@data/mockProducts';
import { COLORS, SIZES } from '@constants/theme';

// FlashList không có sẵn bản "Animated" như FlatList.
// Bọc bằng createAnimatedComponent để useAnimatedScrollHandler gắn được vào sự kiện cuộn.
const AnimatedFlashList = Animated.createAnimatedComponent<any>(FlashList);

const HEADER_MAX_HEIGHT = 180; // Chiều cao Header lúc đầu (chưa cuộn)
const HEADER_MIN_HEIGHT = 64;  // Chiều cao Header nhỏ nhất khi đã cuộn đủ xa
const SCROLL_RANGE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT; // Cuộn 116px là co xong hoàn toàn

/**
 * Màn hình minh họa Collapsing Header dùng useAnimatedScrollHandler + interpolate
 * (Lý thuyết Chương 4 - Phần 4.4 Mục 2)
 */
export const CollapsingHeaderDemo: React.FC = () => {
  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: event => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const headerAnimatedStyle = useAnimatedStyle(() => {
    const height = interpolate(
      scrollY.value,
      [0, SCROLL_RANGE],
      [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
      Extrapolation.CLAMP,
    );
    return { height };
  });

  const titleAnimatedStyle = useAnimatedStyle(() => {
    const fontSize = interpolate(
      scrollY.value,
      [0, SCROLL_RANGE],
      [28, 18],
      Extrapolation.CLAMP,
    );
    const opacity = interpolate(
      scrollY.value,
      [0, SCROLL_RANGE * 0.8],
      [1, 0.5],
      Extrapolation.CLAMP,
    );
    return { fontSize, opacity };
  });

  return (
    <View style={styles.container}>
      {/* Header co giãn — chiều cao và cỡ chữ đều bám theo scrollY qua interpolate */}
      <Animated.View style={[styles.header, headerAnimatedStyle]}>
        <Animated.Text style={[styles.headerTitle, titleAnimatedStyle]}>
          Khám phá ShopAI
        </Animated.Text>
      </Animated.View>

      <AnimatedFlashList
        data={MOCK_PRODUCTS}
        keyExtractor={(item: Product) => item.id}
        renderItem={({ item }: { item: Product }) => <ProductCard product={item} />}
        numColumns={2}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        contentContainerStyle={{ padding: SIZES.padding / 2 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    justifyContent: 'flex-end',
    paddingHorizontal: SIZES.padding,
    paddingBottom: 16,
    backgroundColor: COLORS.surface,
  },
  headerTitle: {
    fontWeight: '700',
    color: COLORS.text,
  },
});

export default CollapsingHeaderDemo;
