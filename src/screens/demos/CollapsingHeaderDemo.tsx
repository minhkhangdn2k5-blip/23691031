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
import { SIZES } from '@constants/theme';
import { useTheme } from '@hooks/useTheme';

const AnimatedFlashList = Animated.createAnimatedComponent(
  FlashList,
) as React.ComponentType<any>;

const HEADER_MAX_HEIGHT = 160;
const HEADER_MIN_HEIGHT = 60;
const SCROLL_RANGE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

/**
 * CollapsingHeaderDemo (Chương 4 - Mục 4.4)
 * Minh họa hiệu ứng cuộn Reanimated 3 Worklet kết hợp FlashList
 */
export default function CollapsingHeaderDemo() {
  const { colors } = useTheme();
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
      [26, 18],
      Extrapolation.CLAMP,
    );
    const opacity = interpolate(
      scrollY.value,
      [0, SCROLL_RANGE * 0.8],
      [1, 0.7],
      Extrapolation.CLAMP,
    );
    return { fontSize, opacity };
  });

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Animated.View
        style={[
          styles.header,
          { backgroundColor: colors.surface, borderBottomColor: colors.border },
          headerAnimatedStyle,
        ]}
      >
        <Animated.Text
          style={[
            styles.headerTitle,
            { color: colors.text },
            titleAnimatedStyle,
          ]}
        >
          Khám phá ShopAI
        </Animated.Text>
        <Animated.Text
          style={[
            styles.headerSubtitle,
            { color: colors.textLight },
            {
              opacity: interpolate(
                scrollY.value,
                [0, SCROLL_RANGE * 0.5],
                [1, 0],
                Extrapolation.CLAMP,
              ),
            },
          ]}
        >
          Cuộn lên để xem thanh Header co giãn tự động
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
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SIZES.padding,
    overflow: 'hidden',
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontWeight: '800',
  },
  headerSubtitle: {
    fontSize: 12,
    marginTop: 4,
  },
});
