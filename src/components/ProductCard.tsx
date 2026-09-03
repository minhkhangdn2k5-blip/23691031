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
const GAP = 12;
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
    opacity.value = withTiming(1, { duration: 350 });
  }, [opacity]);

  const fadeInStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  // Định dạng số tiền chuẩn: 850.000 đ
  const formattedPrice = `${product.price.toLocaleString('vi-VN')} đ`;

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
        style={({ pressed }) => [{ opacity: pressed ? 0.92 : 1 }]}
      >
        <Image
          source={{ uri: product.image }}
          style={styles.image}
          resizeMode="cover"
        />

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

          {/* Nút Mua ngay tái sử dụng từ Sprint 3 */}
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
            textStyle={styles.buttonText}
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
    shadowRadius: 4,
    elevation: 2,
  },
  image: {
    width: '100%',
    height: CARD_WIDTH,
    backgroundColor: '#F0F0F0',
  },
  infoContainer: {
    padding: 10,
  },
  name: {
    fontSize: 13,
    fontWeight: '700',
    height: 36,
    lineHeight: 18,
  },
  price: {
    fontSize: 14,
    fontWeight: '800',
    marginTop: 6,
    marginBottom: 8,
  },
  button: {
    height: 34,
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 12,
    fontWeight: '700',
  },
});

export default memo(ProductCard);
