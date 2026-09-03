import React, { useReducer } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SIZES } from '@constants/theme';
import { useTheme } from '@hooks/useTheme';
import { MOCK_PRODUCTS } from '@data/mockProducts';
import ShopButton from '@components/ShopButton';
import Typography from '@components/ui/Typography';

const { width } = Dimensions.get('window');

type QuantityAction = { type: 'ADD' } | { type: 'REMOVE' } | { type: 'RESET' };

function quantityReducer(state: number, action: QuantityAction): number {
  switch (action.type) {
    case 'ADD':
      return state + 1;
    case 'REMOVE':
      return Math.max(1, state - 1);
    case 'RESET':
      return 1;
    default:
      return state;
  }
}

interface ProductDetailScreenProps {
  route: {
    params: {
      productId: string;
    };
  };
  navigation: {
    goBack: () => void;
    navigate: (name: string, params?: any) => void;
  };
}

export const ProductDetailScreen: React.FC<ProductDetailScreenProps> = ({
  route,
  navigation,
}) => {
  const { colors } = useTheme();
  const { productId } = route.params || { productId: 'prod_1' };

  const product =
    MOCK_PRODUCTS.find(p => p.id === productId) || MOCK_PRODUCTS[0];

  const [quantity, dispatchQuantity] = useReducer(quantityReducer, 1);

  const formattedPrice = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(product.price);

  const totalPrice = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(product.price * quantity);

  const handleAddToCart = () => {
    Alert.alert(
      'Thành công',
      `Đã thêm ${quantity} sản phẩm "${product.name}" vào giỏ hàng!`,
      [{ text: 'OK' }],
    );
  };

  const handleBuyNow = () => {
    Alert.alert(
      'Xác nhận mua hàng',
      `Tổng tiền (${quantity} sản phẩm): ${totalPrice}\nBạn có muốn thanh toán ngay không?`,
      [
        { text: 'Để sau', style: 'cancel' },
        { text: 'Thanh toán', onPress: () => Alert.alert('Thông báo', 'Đơn hàng đã được tạo thành công!') },
      ],
    );
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['top', 'left', 'right']}>
      {/* Top Header */}
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={[styles.backBtn, { backgroundColor: colors.background }]}
          accessibilityLabel="Quay lại"
        >
          <Typography variant="body1" style={{ fontWeight: '700' }}>
            ←
          </Typography>
        </TouchableOpacity>
        <Typography variant="h3" numberOfLines={1} style={styles.headerTitle}>
          Chi tiết sản phẩm
        </Typography>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Large Product Image */}
        <Image source={{ uri: product.image }} style={styles.image} resizeMode="cover" />

        <View style={[styles.contentCard, { backgroundColor: colors.surface }]}>
          {product.category ? (
            <View style={[styles.categoryTag, { backgroundColor: colors.background }]}>
              <Text style={[styles.categoryText, { color: colors.primary }]}>{product.category}</Text>
            </View>
          ) : null}

          <Typography variant="h2" style={styles.productName}>
            {product.name}
          </Typography>

          <View style={styles.priceRow}>
            <Typography variant="h1" color={colors.primary} style={styles.priceText}>
              {formattedPrice}
            </Typography>
            {product.rating ? (
              <View style={styles.ratingBadge}>
                <Text style={styles.ratingText}>★ {product.rating} / 5.0</Text>
              </View>
            ) : null}
          </View>

          {/* Quantity Selector using useReducer */}
          <View style={[styles.quantitySection, { borderTopColor: colors.border, borderBottomColor: colors.border }]}>
            <Typography variant="body2" style={{ fontWeight: '600' }}>
              Số lượng:
            </Typography>
            <View style={styles.qtyControls}>
              <TouchableOpacity
                onPress={() => dispatchQuantity({ type: 'REMOVE' })}
                style={[styles.qtyBtn, { backgroundColor: colors.background }]}
              >
                <Typography variant="h3">−</Typography>
              </TouchableOpacity>
              <Typography variant="bodyBold" style={styles.qtyText}>
                {quantity}
              </Typography>
              <TouchableOpacity
                onPress={() => dispatchQuantity({ type: 'ADD' })}
                style={[styles.qtyBtn, { backgroundColor: colors.background }]}
              >
                <Typography variant="h3">+</Typography>
              </TouchableOpacity>
            </View>
          </View>

          {/* Description */}
          <View style={styles.descSection}>
            <Typography variant="h3" style={styles.descTitle}>
              Mô tả sản phẩm
            </Typography>
            <Typography variant="body1" color={colors.textLight} style={styles.descText}>
              {product.description || 'Sản phẩm công nghệ chính hãng ShopAI. Đổi mới trong 30 ngày nếu phát sinh lỗi.'}
            </Typography>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={[styles.bottomBar, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
        <View style={styles.totalBox}>
          <Typography variant="small" color={colors.textLight}>
            Tổng thanh toán:
          </Typography>
          <Typography variant="h3" color={colors.primary} style={{ fontWeight: '800' }}>
            {totalPrice}
          </Typography>
        </View>
        <View style={styles.actionButtons}>
          <ShopButton
            title="Thêm vào giỏ"
            variant="outline"
            onPress={handleAddToCart}
            style={styles.cartBtn}
            textStyle={{ fontSize: 13 }}
          />
          <ShopButton
            title="Mua ngay"
            variant="primary"
            onPress={handleBuyNow}
            style={styles.buyBtn}
            textStyle={{ fontSize: 13 }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SIZES.padding,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontWeight: '700',
  },
  scrollContent: {
    paddingBottom: 24,
  },
  image: {
    width: width,
    height: width * 0.8,
    backgroundColor: '#EAEAEA',
  },
  contentCard: {
    margin: SIZES.padding,
    padding: SIZES.padding,
    borderRadius: SIZES.radius,
  },
  categoryTag: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '700',
  },
  productName: {
    marginBottom: 10,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  priceText: {
    fontWeight: '800',
  },
  ratingBadge: {
    backgroundColor: '#FFF7E6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  ratingText: {
    color: '#D46B08',
    fontSize: 12,
    fontWeight: '700',
  },
  quantitySection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    marginBottom: 16,
  },
  qtyControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  qtyBtn: {
    width: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyText: {
    marginHorizontal: 16,
    fontSize: 16,
  },
  descSection: {
    marginTop: 4,
  },
  descTitle: {
    marginBottom: 8,
  },
  descText: {
    lineHeight: 22,
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SIZES.padding,
    paddingVertical: 12,
    borderTopWidth: 1,
  },
  totalBox: {
    flex: 1,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  cartBtn: {
    width: 110,
    height: 42,
  },
  buyBtn: {
    width: 110,
    height: 42,
  },
});

export default ProductDetailScreen;
