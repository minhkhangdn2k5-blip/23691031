import React, { memo, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  Pressable,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { COLORS, SIZES } from '@constants/theme';
import ShopButton from '@components/ShopButton';
import { Product } from '@data/mockProducts';
import { useTheme } from '@hooks/useTheme';

const { width } = Dimensions.get('window');
const GAP = SIZES.padding;
const CARD_WIDTH = (width - GAP * 3) / 2;

export interface ProductCardProps {
  product: Product;
  onPress?: (product: Product) => void;
  onOrder?: (product: Product) => void;
}

/**
 * Thẻ Sản phẩm ProductCard (Chương 4 - Sprint 4)
 * - Grid 2 cột chuẩn Flexbox
 * - Hiệu ứng Fade-in trên UI Thread bằng Reanimated 3 Worklet
 * - Tái sử dụng ShopButton từ Sprint 3
 * - Tương thích mượt mà Dark Mode
 */
export const ProductCard: React.FC<ProductCardProps> = memo(({
  product,
  onPress,
  onOrder,
}) => {
  const { colors } = useTheme();

  // Reanimated 3: Shared Value trên UI Thread
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 400 });
  }, [opacity]);

  const fadeInStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const formattedPrice = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(product.price);

  return (
    <Animated.View
      style={[
        styles.card,
        {
          backgroundColor: colors.surface || COLORS.surface,
          borderColor: colors.border || COLORS.border,
        },
        fadeInStyle,
      ]}
    >
      <Pressable
        onPress={() => onPress && onPress(product)}
        style={({ pressed }) => [{ opacity: pressed ? 0.9 : 1 }]}
      >
        <Image
          source={{ uri: product.image }}
          style={styles.image}
          resizeMode="cover"
        />

        {product.category ? (
          <View style={[styles.categoryBadge, { backgroundColor: colors.background }]}>
            <Text style={[styles.categoryText, { color: colors.textLight }]}>
              {product.category}
            </Text>
          </View>
        ) : null}

        <View style={styles.infoContainer}>
          <Text
            style={[styles.name, { color: colors.text || COLORS.text }]}
            numberOfLines={2}
          >
            {product.name}
          </Text>

          <Text style={[styles.price, { color: colors.primary || COLORS.primary }]}>
            {formattedPrice}
          </Text>

          <View style={styles.metaRow}>
            {product.rating ? (
              <Text style={styles.ratingText}>★ {product.rating}</Text>
            ) : null}
            {product.soldCount ? (
              <Text style={[styles.soldText, { color: colors.textLight }]}>
                Đã bán {product.soldCount}
              </Text>
            ) : null}
          </View>

          {/* Tái sử dụng ShopButton từ Sprint 3 */}
          <ShopButton
            title="Mua ngay"
            onPress={() => {
              if (onOrder) {
                onOrder(product);
              } else if (onPress) {
                onPress(product);
              }
            }}
            style={styles.button}
            textStyle={{ fontSize: 13, fontWeight: '700' }}
          />
        </View>
      </Pressable>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    marginHorizontal: GAP / 2,
    marginBottom: GAP,
    borderRadius: SIZES.radius,
    overflow: 'hidden',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: CARD_WIDTH,
    backgroundColor: '#EAEAEA',
  },
  categoryBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    opacity: 0.9,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: '600',
  },
  infoContainer: {
    padding: 10,
  },
  name: {
    fontSize: SIZES.body2,
    fontWeight: '600',
    height: 38,
    lineHeight: 19,
  },
  price: {
    fontSize: SIZES.body1,
    fontWeight: '800',
    marginTop: 6,
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  ratingText: {
    fontSize: 11,
    color: '#FA8C16',
    fontWeight: '600',
  },
  soldText: {
    fontSize: 11,
  },
  button: {
    height: 36,
    borderRadius: 8,
  },
});

export default memo(ProductCard);
