import React, { useState, useCallback, useReducer } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  Modal,
  Alert,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlashList } from '@shopify/flash-list';
import { SIZES } from '@constants/theme';
import { useTheme } from '@hooks/useTheme';
import { MOCK_PRODUCTS, Product } from '@data/mockProducts';
import ProductCard from '@components/ProductCard';
import ShopButton from '@components/ShopButton';
import Typography from '@components/ui/Typography';

// Reducer cho bộ đếm số lượng đặt hàng (Chương 3 - Mục 3.3)
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

interface HomeScreenProps {
  navigation?: {
    goBack?: () => void;
    navigate: (screen: string, params?: any) => void;
  };
}

/**
 * HomeScreen (Chương 4 - Sprint 4)
 * - Header chuẩn mực: `< Khám phá`
 * - Lưới 2 cột FlashList siêu tốc
 * - Reanimated 3 Fade-in trên từng thẻ sản phẩm
 * - Kéo vuốt (Pull-to-refresh) mượt mà
 * - Đổi Dark/Light Mode tức thời
 */
export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { colors, isDark, toggleTheme } = useTheme();

  // Danh sách sản phẩm công nghệ thực tế
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  // Modal đặt hàng nhanh (sử dụng useReducer)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, dispatchQuantity] = useReducer(quantityReducer, 1);

  // Pull-to-refresh: mô phỏng làm mới dữ liệu
  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setProducts([...MOCK_PRODUCTS].sort(() => Math.random() - 0.5));
      setRefreshing(false);
    }, 1200);
  }, []);

  // Chuyển sang màn hình Chi tiết sản phẩm
  const handleOpenDetail = useCallback(
    (product: Product) => {
      if (navigation && navigation.navigate) {
        navigation.navigate('ProductDetail', { productId: product.id });
      } else {
        setSelectedProduct(product);
      }
    },
    [navigation],
  );

  // Mở modal đặt mua nhanh
  const handleOpenOrder = useCallback((product: Product) => {
    setSelectedProduct(product);
    dispatchQuantity({ type: 'RESET' });
  }, []);

  // Xác nhận đặt hàng
  const handleConfirmOrder = () => {
    if (!selectedProduct) return;
    const total = `${(selectedProduct.price * quantity).toLocaleString('vi-VN')} đ`;

    Alert.alert(
      'Đặt hàng thành công!',
      `Đơn hàng: ${selectedProduct.name}\nSố lượng: ${quantity}\nTổng tiền: ${total}`,
      [{ text: 'Hoàn tất', onPress: () => setSelectedProduct(null) }],
    );
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['top', 'left', 'right']}>
      {/* Header AppBar chuẩn phong cách Khám phá */}
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <TouchableOpacity
          onPress={() => {
            if (navigation && navigation.goBack) {
              navigation.goBack();
            }
          }}
          style={styles.backButton}
          accessibilityLabel="Quay lại"
        >
          <Text style={[styles.backIcon, { color: colors.text }]}>‹</Text>
        </TouchableOpacity>

        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Khám phá
        </Text>

        {/* Nút chuyển Dark/Light Mode */}
        <TouchableOpacity
          onPress={toggleTheme}
          style={[styles.themeBtn, { backgroundColor: colors.background }]}
          accessibilityLabel="Chuyển chế độ giao diện"
        >
          <Text style={styles.themeIcon}>{isDark ? '☀️' : '🌙'}</Text>
        </TouchableOpacity>
      </View>

      {/* Lưới 2 cột FlashList */}
      <View style={styles.listContainer}>
        <FlashList
          data={products}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <ProductCard
              product={item}
              onPress={handleOpenDetail}
              onOrder={handleOpenOrder}
            />
          )}
          numColumns={2}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      </View>

      {/* Quick Order Modal with useReducer */}
      <Modal
        visible={!!selectedProduct}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedProduct(null)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setSelectedProduct(null)}
        >
          <Pressable
            style={[styles.modalCard, { backgroundColor: colors.surface }]}
            onPress={e => e.stopPropagation()}
          >
            {selectedProduct ? (
              <>
                <View style={styles.modalHeader}>
                  <Typography variant="h3" style={styles.boldText}>
                    Xác nhận đặt mua
                  </Typography>
                  <TouchableOpacity onPress={() => setSelectedProduct(null)}>
                    <Typography variant="body1" color={colors.textLight}>
                      ✕
                    </Typography>
                  </TouchableOpacity>
                </View>

                <View style={styles.modalProductInfo}>
                  <Image
                    source={{ uri: selectedProduct.image }}
                    style={styles.modalImage}
                    resizeMode="cover"
                  />
                  <View style={styles.modalInfoText}>
                    <Typography variant="bodyBold" numberOfLines={2}>
                      {selectedProduct.name}
                    </Typography>
                    <Typography variant="price" color={colors.primary} style={styles.modalPrice}>
                      {`${selectedProduct.price.toLocaleString('vi-VN')} đ`}
                    </Typography>
                  </View>
                </View>

                {/* Bộ đếm số lượng useReducer */}
                <View style={[styles.modalCounterSection, { borderTopColor: colors.border, borderBottomColor: colors.border }]}>
                  <Typography variant="body2" style={styles.semiboldText}>
                    Chọn số lượng:
                  </Typography>
                  <View style={styles.counterRow}>
                    <TouchableOpacity
                      onPress={() => dispatchQuantity({ type: 'REMOVE' })}
                      style={[styles.counterBtn, { backgroundColor: colors.background }]}
                    >
                      <Typography variant="h3">−</Typography>
                    </TouchableOpacity>
                    <Typography variant="bodyBold" style={styles.counterNumber}>
                      {quantity}
                    </Typography>
                    <TouchableOpacity
                      onPress={() => dispatchQuantity({ type: 'ADD' })}
                      style={[styles.counterBtn, { backgroundColor: colors.background }]}
                    >
                      <Typography variant="h3">+</Typography>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Tổng thanh toán */}
                <View style={styles.modalTotalRow}>
                  <Typography variant="body2" color={colors.textLight}>
                    Tổng thanh toán:
                  </Typography>
                  <Typography variant="h2" color={colors.primary} style={styles.totalPriceText}>
                    {`${(selectedProduct.price * quantity).toLocaleString('vi-VN')} đ`}
                  </Typography>
                </View>

                <View style={styles.modalActionRow}>
                  <ShopButton
                    title="Huỷ"
                    variant="outline"
                    onPress={() => setSelectedProduct(null)}
                    style={styles.cancelButton}
                  />
                  <ShopButton
                    title="Xác nhận"
                    variant="primary"
                    onPress={handleConfirmOrder}
                    style={styles.confirmButton}
                  />
                </View>
              </>
            ) : null}
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  backButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  backIcon: {
    fontSize: 28,
    fontWeight: '300',
    lineHeight: 30,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  themeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  themeIcon: {
    fontSize: 16,
  },
  listContainer: {
    flex: 1,
  },
  listContent: {
    padding: 10,
    paddingBottom: 32,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.padding,
  },
  modalCard: {
    width: '100%',
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 6,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  boldText: {
    fontWeight: '700',
  },
  semiboldText: {
    fontWeight: '600',
  },
  modalProductInfo: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  modalImage: {
    width: 70,
    height: 70,
    borderRadius: 8,
    backgroundColor: '#EAEAEA',
  },
  modalInfoText: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  modalPrice: {
    marginTop: 6,
  },
  modalCounterSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    marginBottom: 14,
  },
  counterRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  counterBtn: {
    width: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  counterNumber: {
    marginHorizontal: 14,
    fontSize: 16,
  },
  modalTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  totalPriceText: {
    fontWeight: '800',
  },
  modalActionRow: {
    flexDirection: 'row',
  },
  cancelButton: {
    flex: 1,
    marginRight: 8,
  },
  confirmButton: {
    flex: 1.5,
  },
});

export default HomeScreen;
