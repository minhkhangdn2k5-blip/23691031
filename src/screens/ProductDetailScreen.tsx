import React from 'react';
import { View, StyleSheet, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RouteProp, useRoute } from '@react-navigation/native';
import { useQueryClient } from '@tanstack/react-query';
import ShopButton from '@components/ShopButton';
import Typography from '@components/ui/Typography';
import { MOCK_PRODUCTS } from '@data/mockProducts';
import { COLORS, SIZES } from '@constants/theme';
import { useTheme } from '@hooks/useTheme';
import { useCartStore } from '@store/useCartStore';
import type { HomeStackParamList } from '@navigation/HomeStackNavigator';
import type { ProductPage } from './HomeScreen';

type ProductDetailRouteProp = RouteProp<HomeStackParamList, 'ProductDetail'>;

/**
 * Màn hình Chi tiết sản phẩm (Chương 6 - Bước 8.5)
 * Tận dụng Bộ nhớ đệm (Cache) TanStack Query — Mở tức thì 0ms không cần gọi lại mạng!
 */
export const ProductDetailScreen: React.FC = () => {
  const { colors } = useTheme();
  const route = useRoute<ProductDetailRouteProp>();
  const { productId } = route.params;
  const addItem = useCartStore((state) => state.addItem);

  // Móc dữ liệu tức thì từ Cache của TanStack Query
  const queryClient = useQueryClient();
  const cachedData = queryClient.getQueryData<{ pages: ProductPage[] }>(['productsInfinite']);
  const cachedProducts = cachedData?.pages.flatMap((page) => page.items) ?? [];

  // Ưu tiên tìm trong Cache trước, nếu người dùng vào thẳng bằng Deep Link thì fallback sang Mock
  const product = cachedProducts.find((p) => p.id === productId) || MOCK_PRODUCTS.find((p) => p.id === productId);

  if (!product) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
        <View style={styles.centerContainer}>
          <Typography variant="h2" color={colors.error} style={{ textAlign: 'center', marginBottom: 8 }}>
            Không tìm thấy sản phẩm!
          </Typography>
          <Typography variant="body2" color={colors.textLight}>
            Mã sản phẩm: {productId}
          </Typography>
        </View>
      </SafeAreaView>
    );
  }

  const formattedPrice = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(product.price);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['bottom', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Ảnh lớn của sản phẩm */}
        <Image
          source={{ uri: product.image }}
          style={styles.image}
          resizeMode="cover"
        />

        {/* Thông tin tên và danh mục */}
        <View style={styles.badgeRow}>
          <View style={[styles.categoryBadge, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Typography variant="small" color={colors.primary} style={{ fontWeight: '700' }}>
              {product.category || 'Công nghệ'}
            </Typography>
          </View>
          <Typography variant="small" color={colors.textLight}>
            Mã SP: {product.id}
          </Typography>
        </View>

        <Typography variant="h1" color={colors.text} style={styles.name}>
          {product.name}
        </Typography>

        <Typography variant="h2" color={colors.primary} style={styles.price}>
          {formattedPrice}
        </Typography>

        {/* Mô tả sản phẩm */}
        <Typography variant="body1" color={colors.text} style={styles.descTitle}>
          Mô tả sản phẩm
        </Typography>
        <Typography variant="body2" color={colors.textLight} style={styles.description}>
          {product.description || 'Sản phẩm công nghệ chính hãng ShopAI Store, bảo hành 12 tháng 1 đổi 1.'}
        </Typography>

        {/* Nút hành động */}
        <ShopButton
          title="Thêm vào giỏ hàng"
          onPress={() => addItem(product)}
          style={styles.buyBtn}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    padding: SIZES.padding,
    paddingBottom: 40,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.padding,
  },
  image: {
    width: '100%',
    height: 320,
    borderRadius: SIZES.radius,
    marginBottom: SIZES.padding,
    backgroundColor: '#EEEEEE',
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  name: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 8,
  },
  price: {
    fontSize: 22,
    fontWeight: '900',
    marginBottom: 16,
  },
  descTitle: {
    fontWeight: '700',
    marginBottom: 6,
    marginTop: 8,
  },
  description: {
    lineHeight: 22,
    marginBottom: 28,
  },
  buyBtn: {
    height: 50,
  },
});

export default ProductDetailScreen;
