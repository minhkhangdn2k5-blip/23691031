import React, { memo, useEffect } from 'react';
import {
  View,
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
import { Product } from '@data/mockProducts';
import { useTheme } from '@hooks/useTheme';
import { SPACING, BORDER_RADIUS } from '@constants/theme';
import { AppText, AppButton } from '@components/ui';

// Tính toán kích thước thẻ phù hợp với lưới 2 cột
const { width } = Dimensions.get('window');
const HORIZONTAL_PADDING = SPACING.md;
const ITEM_GAP = SPACING.sm;
const CARD_WIDTH = (width - HORIZONTAL_PADDING * 2 - ITEM_GAP) / 2;

export interface ProductCardProps {
  product: Product;
  onPress?: (product: Product) => void;
  onBuy?: (product: Product) => void;
}

/**
 * Linh kiện Thẻ sản phẩm (ProductCard)
 * - Tối ưu hiển thị theo Lưới 2 cột
 * - Hiệu ứng Reanimated Fade-in chạy trực tiếp trên Native UI Thread
 * - Hỗ trợ Dark/Light Mode tự động
 * - Tái sử dụng AppText và AppButton từ Design System
 */
const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onPress,
  onBuy,
}) => {
  const { colors, isDark } = useTheme();

  // 1. REANIMATED: Shared Value lưu độ mờ opacity trên UI Thread
  const opacity = useSharedValue(0);

  useEffect(() => {
    // Kích hoạt hiệu ứng Fade-in trong 350ms (không gây re-render React)
    opacity.value = withTiming(1, { duration: 350 });
  }, [opacity]);

  // 2. Animated Style ánh xạ độ mờ vào khung nhìn
  const animatedCardStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  // Hàm định dạng tiền tệ VND
  const formattedPrice = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(product.price);

  return (
    <Animated.View
      style={[
        styles.cardContainer,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          borderWidth: isDark ? 1 : 0,
        },
        animatedCardStyle,
      ]}
    >
      <Pressable
        onPress={() => onPress && onPress(product)}
        style={({ pressed }) => [pressed && styles.cardPressed]}
      >
        {/* 1. Ảnh sản phẩm */}
        <View style={styles.imageWrapper}>
          <Image
            source={{ uri: product.image }}
            style={styles.image}
            resizeMode="cover"
          />
          {product.category && (
            <View style={[styles.categoryBadge, { backgroundColor: colors.surface }]}>
              <AppText variant="caption" style={styles.categoryText}>
                {product.category}
              </AppText>
            </View>
          )}
        </View>

        {/* 2. Phần thông tin chi tiết */}
        <View style={styles.infoContainer}>
          {/* Tên sản phẩm cố định 2 dòng */}
          <AppText
            variant="body"
            numberOfLines={2}
            style={styles.productName}
          >
            {product.name}
          </AppText>

          {/* Đánh giá & đã bán */}
          <View style={styles.ratingRow}>
            <AppText variant="caption" style={styles.ratingText}>
              ⭐ {product.rating || '4.8'}
            </AppText>
            <AppText variant="caption" color={colors.textSecondary}>
              Đã bán {product.soldCount || 100}+
            </AppText>
          </View>

          {/* Giá tiền */}
          <AppText variant="price" color={colors.primary} style={styles.price}>
            {formattedPrice}
          </AppText>

          {/* Nút bấm mua ngay */}
          <AppButton
            title="Mua ngay"
            size="sm"
            variant="primary"
            onPress={() => onBuy ? onBuy(product) : (onPress && onPress(product))}
            style={styles.buyButton}
          />
        </View>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    width: CARD_WIDTH,
    borderRadius: BORDER_RADIUS.md,
    overflow: 'hidden',
    marginBottom: ITEM_GAP + SPACING.xs,
    // Đổ bóng nhẹ
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  cardPressed: {
    opacity: 0.9,
  },
  imageWrapper: {
    width: '100%',
    height: CARD_WIDTH,
    backgroundColor: '#EAEAEA',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  categoryBadge: {
    position: 'absolute',
    top: 6,
    left: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    opacity: 0.9,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: '600',
  },
  infoContainer: {
    padding: SPACING.sm,
  },
  productName: {
    fontSize: 13,
    fontWeight: '600',
    height: 36,
    lineHeight: 18,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
    marginBottom: 4,
  },
  ratingText: {
    fontSize: 11,
    fontWeight: '700',
  },
  price: {
    fontSize: 15,
    marginBottom: 8,
  },
  buyButton: {
    height: 34,
    paddingVertical: 6,
  },
});

export default memo(ProductCard);
