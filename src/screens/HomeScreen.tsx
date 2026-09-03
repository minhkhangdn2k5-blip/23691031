import React, { useState, useMemo, useCallback, useReducer } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TouchableOpacity,
  Modal,
  Alert,
  Image,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlashList } from '@shopify/flash-list';
import { SIZES } from '@constants/theme';
import { useTheme } from '@hooks/useTheme';
import { useDebounce } from '@hooks/useDebounce';
import { MOCK_PRODUCTS, Product } from '@data/mockProducts';
import ProductCard from '@components/ProductCard';
import ShopButton from '@components/ShopButton';
import ShopInput from '@components/ui/ShopInput';
import Typography from '@components/ui/Typography';

// Reducer cho bộ đếm số lượng đặt món (Chương 3 - Mục 3.3)
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

const CATEGORIES = ['Tất cả', 'Âm thanh', 'Gaming', 'Phụ kiện', 'Gia dụng', 'Mạng'];

interface HomeScreenProps {
  navigation?: {
    navigate: (screen: string, params?: any) => void;
  };
}

/**
 * HomeScreen (Chương 4 - Sprint 4)
 * - FlashList 2 cột với virtualization mượt mà
 * - Reanimated 3 Fade-in trên từng thẻ sản phẩm ProductCard
 * - Pull-to-refresh cập nhật danh sách
 * - Tìm kiếm Debounce & Bộ lọc danh mục
 * - Dark Mode chuyển đổi tức thì qua ThemeContext
 * - useReducer quản lý số lượng đặt hàng
 */
export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { colors, isDark, toggleTheme } = useTheme();

  // States danh sách sản phẩm & kéo làm mới
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  // States tìm kiếm & danh mục
  const [keyword, setKeyword] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Tất cả');
  const debouncedKeyword = useDebounce(keyword, 300);

  // Modal đặt hàng nhanh (sử dụng useReducer)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, dispatchQuantity] = useReducer(quantityReducer, 1);

  // Giả lập Pull-to-refresh (Chương 4 - Mục 4.5)
  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      // Đảo ngẫu nhiên danh sách để người dùng thấy rõ dữ liệu được làm mới
      const shuffled = [...MOCK_PRODUCTS].sort(() => Math.random() - 0.5);
      setProducts(shuffled);
      setRefreshing(false);
    }, 1200);
  }, []);

  // Lọc sản phẩm theo từ khóa (debounced) và danh mục
  const filteredProducts = useMemo(() => {
    return products.filter(item => {
      const matchKeyword =
        !debouncedKeyword.trim() ||
        item.name.toLowerCase().includes(debouncedKeyword.trim().toLowerCase());
      const matchCat =
        selectedCategory === 'Tất cả' || item.category === selectedCategory;
      return matchKeyword && matchCat;
    });
  }, [products, debouncedKeyword, selectedCategory]);

  // Điều hướng đến chi tiết sản phẩm
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

  // Mở modal đặt hàng
  const handleOpenOrder = useCallback((product: Product) => {
    setSelectedProduct(product);
    dispatchQuantity({ type: 'RESET' });
  }, []);

  // Xác nhận đặt hàng trong modal
  const handleConfirmOrder = () => {
    if (!selectedProduct) return;
    const total = new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(selectedProduct.price * quantity);

    Alert.alert(
      'Đặt hàng thành công!',
      `Đơn hàng: ${selectedProduct.name}\nSố lượng: ${quantity}\nTổng tiền: ${total}`,
      [{ text: 'Hoàn tất', onPress: () => setSelectedProduct(null) }],
    );
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['top', 'left', 'right']}>
      {/* Main Top Header */}
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <View>
          <View style={styles.brandRow}>
            <Typography variant="h1" color={colors.primary} style={styles.brandText}>
              ShopAI
            </Typography>
            <View style={[styles.badgePill, { backgroundColor: colors.primary }]}>
              <Text style={styles.badgePillText}>Chương 1-4</Text>
            </View>
          </View>
          <Typography variant="small" color={colors.textLight}>
            Thế giới công nghệ & phụ kiện thông minh
          </Typography>
        </View>

        {/* Nút chuyển Sáng / Tối (ThemeContext - Chương 3) */}
        <TouchableOpacity
          onPress={toggleTheme}
          style={[styles.themeBtn, { backgroundColor: colors.background, borderColor: colors.border }]}
          accessibilityLabel="Chuyển chế độ sáng tối"
          accessibilityRole="button"
        >
          <Text style={{ fontSize: 16 }}>{isDark ? '☀️' : '🌙'}</Text>
          <Typography variant="small" style={{ fontWeight: '700', marginLeft: 4 }}>
            {isDark ? 'Sáng' : 'Tối'}
          </Typography>
        </TouchableOpacity>
      </View>

      {/* Search Input Bar (useDebounce - Chương 4 Mục 4.6) */}
      <View style={styles.searchContainer}>
        <ShopInput
          placeholder="Tìm theo tên sản phẩm (VD: Tai nghe, Bàn phím...)"
          value={keyword}
          onChangeText={setKeyword}
          containerStyle={{ marginBottom: 0 }}
        />
      </View>

      {/* Category Chips Bar */}
      <View style={styles.categoryBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScroll}>
          {CATEGORIES.map(cat => {
            const isSelected = selectedCategory === cat;
            return (
              <TouchableOpacity
                key={cat}
                onPress={() => setSelectedCategory(cat)}
                style={[
                  styles.categoryChip,
                  {
                    backgroundColor: isSelected ? colors.primary : colors.surface,
                    borderColor: isSelected ? colors.primary : colors.border,
                  },
                ]}
                activeOpacity={0.7}
              >
                <Typography
                  variant="small"
                  color={isSelected ? '#FFFFFF' : colors.text}
                  style={{ fontWeight: isSelected ? '700' : '500' }}
                >
                  {cat}
                </Typography>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Product Grid Header */}
      <View style={styles.listHeaderRow}>
        <Typography variant="h3" style={{ fontWeight: '800' }}>
          {selectedCategory === 'Tất cả' ? 'Tất cả sản phẩm' : `Danh mục: ${selectedCategory}`}
        </Typography>
        <Typography variant="small" color={colors.textLight}>
          {filteredProducts.length} sản phẩm
        </Typography>
      </View>

      {/* FlashList 2-Column Grid (Chương 4 Sprint 4) */}
      <View style={styles.listWrapper}>
        <FlashList
          data={filteredProducts}
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
          contentContainerStyle={{ padding: SIZES.padding / 2, paddingBottom: 32 }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={{ fontSize: 36, marginBottom: 8 }}>🔍</Text>
              <Typography variant="h3" style={{ textAlign: 'center', marginBottom: 4 }}>
                Không tìm thấy sản phẩm
              </Typography>
              <Typography variant="small" color={colors.textLight} style={{ textAlign: 'center' }}>
                Thử thay đổi từ khóa hoặc chọn danh mục "Tất cả"
              </Typography>
            </View>
          }
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
                  <Typography variant="h3" style={{ fontWeight: '700' }}>
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
                    <Typography variant="price" color={colors.primary} style={{ marginTop: 6 }}>
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
                        selectedProduct.price,
                      )}
                    </Typography>
                  </View>
                </View>

                {/* Counter with useReducer */}
                <View style={[styles.modalCounterSection, { borderTopColor: colors.border, borderBottomColor: colors.border }]}>
                  <Typography variant="body2" style={{ fontWeight: '600' }}>
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

                {/* Total */}
                <View style={styles.modalTotalRow}>
                  <Typography variant="body2" color={colors.textLight}>
                    Tổng thanh toán:
                  </Typography>
                  <Typography variant="h2" color={colors.primary} style={{ fontWeight: '800' }}>
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
                      selectedProduct.price * quantity,
                    )}
                  </Typography>
                </View>

                <View style={styles.modalActionRow}>
                  <ShopButton
                    title="Huỷ"
                    variant="outline"
                    onPress={() => setSelectedProduct(null)}
                    style={{ flex: 1, marginRight: 8 }}
                  />
                  <ShopButton
                    title="Xác nhận"
                    variant="primary"
                    onPress={handleConfirmOrder}
                    style={{ flex: 1.5 }}
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SIZES.padding,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandText: {
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  badgePill: {
    marginLeft: 8,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  badgePillText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
  themeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  searchContainer: {
    paddingHorizontal: SIZES.padding,
    paddingTop: 12,
    paddingBottom: 4,
  },
  categoryBar: {
    marginBottom: 8,
  },
  categoryScroll: {
    paddingHorizontal: SIZES.padding,
    paddingVertical: 6,
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
  },
  listHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SIZES.padding,
    paddingVertical: 6,
  },
  listWrapper: {
    flex: 1,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
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
  modalActionRow: {
    flexDirection: 'row',
  },
});

export default HomeScreen;
