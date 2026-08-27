import React, { useState, useEffect, useMemo, useCallback, useReducer, memo } from 'react';
import {
  View,
  Image,
  FlatList,
  Pressable,
  ActivityIndicator,
  StyleSheet,
  StatusBar,
  Modal,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { STUDENT, BANNER_IMAGE_ID, FLASH_SECONDS, VARIANT, examStamp } from '@constants/student';
import { useTheme } from '@hooks/useTheme';
import { useCountdown } from '@hooks/useCountdown';
import { fetchProducts, ProductItem, CategoryId } from '@services/productApi';
import { SPACING, BORDER_RADIUS } from '@constants/theme';
import { Typography, ShopInput, ShopButton } from '@components/ui';

// Reducer quản lý số lượng đặt món
type QuantityAction = { type: 'ADD' } | { type: 'REMOVE' } | { type: 'RESET' };

function quantityReducer(state: number, action: QuantityAction): number {
  switch (action.type) {
    case 'ADD':
      return state + 1;
    case 'REMOVE':
      return state > 1 ? state - 1 : 1;
    case 'RESET':
      return 1;
    default:
      return state;
  }
}

// Danh mục sản phẩm
const CHIPS_DEFAULT: { id: CategoryId; label: string }[] = [
  { id: 'all', label: 'Tất cả' },
  { id: 'food', label: 'Đồ ăn' },
  { id: 'drink', label: 'Nước' },
  { id: 'study', label: 'Học tập' },
];

const CHIPS_REVERSED: { id: CategoryId; label: string }[] = [
  { id: 'study', label: 'Học tập' },
  { id: 'drink', label: 'Nước' },
  { id: 'food', label: 'Đồ ăn' },
  { id: 'all', label: 'Tất cả' },
];

// Khối dòng tên thí sinh (Watermark)
const StudentWatermark = memo(() => {
  const { colors } = useTheme();
  return (
    <View style={[styles.watermarkBar, { backgroundColor: colors.background, borderTopColor: colors.border, borderBottomColor: colors.border }]}>
      <Typography variant="caption" color={colors.textLight} style={styles.watermarkText}>
        TH1 · {STUDENT.mssv} · {STUDENT.hoTen} · #{examStamp()}
      </Typography>
    </View>
  );
});

// Component Thẻ món ăn 1 cột dọc (ProductCard)
// Bấm vào nút Đặt hoặc bấm cả dòng card đều mở Modal Đặt món
interface ProductCardProps {
  item: ProductItem;
  onOrder: (item: ProductItem) => void;
  disabled?: boolean;
}

const ProductCard = memo(({ item, onOrder, disabled }: ProductCardProps) => {
  const { colors } = useTheme();

  return (
    <Pressable
      onPress={() => onOrder(item)}
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: colors.surface, borderColor: colors.border },
        pressed && { opacity: 0.9 },
      ]}
    >
      <View style={styles.cardImageContainer}>
        <Image
          source={{ uri: item.image }}
          style={styles.cardImage}
          resizeMode="contain"
        />
      </View>

      <View style={styles.cardInfo}>
        <Typography variant="bodyBold" numberOfLines={1} style={styles.cardName}>
          {item.name}
        </Typography>
        <Typography variant="price" color={colors.primary} style={styles.cardPrice}>
          {item.formattedPrice}
        </Typography>
        <Typography variant="caption" color={colors.textLight}>
          {item.categoryName}
        </Typography>
      </View>

      <ShopButton
        title="Đặt"
        variant="primary"
        disabled={disabled}
        onPress={() => onOrder(item)}
        style={styles.orderBtn}
      />
    </Pressable>
  );
});

const HomeScreen: React.FC = () => {
  const { colors, isDark, toggleTheme } = useTheme();
  const { formattedTime, isExpired } = useCountdown(FLASH_SECONDS);

  // States dữ liệu sản phẩm và trạng thái mạng
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // States tìm kiếm và lọc danh mục
  const [keyword, setKeyword] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>(
    VARIANT.chipsReversed ? 'study' : 'all'
  );

  // ==========================================
  // STATES & REDUCER CHO MODAL ĐẶT MÓN (CÂU 3a)
  // ==========================================
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);
  const [quantity, dispatchQuantity] = useReducer(quantityReducer, 1);

  // Danh sách chip theo biến thể số cuối MSSV
  const chipList = useMemo(() => {
    return VARIANT.chipsReversed ? CHIPS_REVERSED : CHIPS_DEFAULT;
  }, []);

  // Hàm tải dữ liệu API có cờ alive (Câu 2b)
  const loadData = useCallback((isPullRefresh = false) => {
    let isAlive = true;
    if (isPullRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);

    fetchProducts()
      .then(data => {
        if (isAlive) {
          setProducts(data);
          setLoading(false);
          setRefreshing(false);
        }
      })
      .catch(err => {
        if (isAlive) {
          setError(err.message || 'Không tải được dữ liệu món.');
          setLoading(false);
          setRefreshing(false);
        }
      });

    return () => {
      isAlive = false;
    };
  }, []);

  useEffect(() => {
    const cleanup = loadData(false);
    return cleanup;
  }, [loadData]);

  const handlePullRefresh = useCallback(() => {
    loadData(true);
  }, [loadData]);

  // Lọc sản phẩm theo từ khóa và danh mục (useMemo)
  const filteredProducts = useMemo(() => {
    return products.filter(item => {
      const matchKeyword = item.name.toLowerCase().includes(keyword.trim().toLowerCase());
      const matchCat = selectedCategory === 'all' || item.category === selectedCategory;
      return matchKeyword && matchCat;
    });
  }, [products, keyword, selectedCategory]);

  // Xử lý mở Modal khi bấm Đặt (Câu 3a)
  const handleOpenOrderModal = useCallback((item: ProductItem) => {
    setSelectedProduct(item);
    dispatchQuantity({ type: 'RESET' }); // Đảm bảo mở lên số lượng luôn là 1
  }, []);

  // Xử lý đóng Modal không Alert
  const handleCloseModal = useCallback(() => {
    setSelectedProduct(null);
    dispatchQuantity({ type: 'RESET' });
  }, []);

  // Xử lý Xác nhận đặt món (Bật Alert hệ thống theo đúng đề bài)
  const handleConfirmOrder = useCallback(() => {
    if (!selectedProduct) return;

    Alert.alert(
      `CampusMart · ${STUDENT.mssv}`,
      `${STUDENT.hoTen} (#${examStamp()}) đã ghi nhận: ${selectedProduct.name} × ${quantity}. Nhận tại quầy KTX.`,
      [
        {
          text: 'OK',
          onPress: () => {
            setSelectedProduct(null);
            dispatchQuantity({ type: 'RESET' });
          },
        },
      ],
    );
  }, [selectedProduct, quantity]);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['top', 'left', 'right', 'bottom']}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      {/* (0) Watermark ở trên ĐẦU nếu số cuối chẵn */}
      {VARIANT.watermarkAtTop && <StudentWatermark />}

      {/* Khối (A): Header ứng dụng CAMPUSMART chuẩn màu Teal (#0F766E) */}
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <View style={styles.headerTop}>
          <View>
            <Typography variant="h1" color="#FFFFFF" style={styles.headerTitle}>
              CAMPUSMART
            </Typography>
            <Typography variant="caption" color="#CCFBF1">
              Tiện lợi KTX
            </Typography>
          </View>

          <View style={styles.headerRight}>
            {/* Nút Sáng/Tối theo biến thể Pressable viền trắng */}
            <Pressable
              onPress={toggleTheme}
              style={({ pressed }) => [
                styles.themeBtn,
                pressed && { opacity: 0.7 },
              ]}
            >
              <Typography variant="caption" color="#FFFFFF" style={{ fontWeight: '700' }}>
                {isDark ? 'Sáng / Tối ☀️' : 'Sáng / Tối 🌙'}
              </Typography>
            </Pressable>

            {/* Đồng hồ Flash Sale màu vàng */}
            <View style={styles.flashBadge}>
              <Typography variant="caption" color={colors.secondary} style={styles.flashText}>
                ⚡ Flash {formattedTime}
              </Typography>
            </View>
          </View>
        </View>
      </View>

      {/* Khối (B): Ô tìm kiếm Controlled */}
      <View style={styles.searchContainer}>
        <ShopInput
          value={keyword}
          onChangeText={setKeyword}
          placeholder={`Tìm món, nước, đồ dùng — ${STUDENT.mssv}`}
          autoCapitalize="none"
        />
      </View>

      {/* Khối (C): Banner ảnh picsum theo BANNER_IMAGE_ID */}
      <View style={styles.bannerContainer}>
        <Image
          source={{ uri: `https://picsum.photos/id/${BANNER_IMAGE_ID}/800/320` }}
          style={styles.bannerImage}
          resizeMode="cover"
          onError={() => console.log('Lỗi tải ảnh banner')}
        />
        <View style={styles.bannerOverlay}>
          <Typography variant="h2" color="#FFFFFF" style={styles.bannerTitle}>
            Đặt nhanh · Nhận tại quầy
          </Typography>
          <Typography variant="caption" color="#CCFBF1">
            Cửa hàng tiện lợi ký túc xá 24/7
          </Typography>
        </View>
      </View>

      {/* Khối (D): 4 Chip lọc danh mục */}
      <View style={styles.chipsContainer}>
        {chipList.map(chip => {
          const isSelected = selectedCategory === chip.id;
          return (
            <Pressable
              key={chip.id}
              onPress={() => setSelectedCategory(chip.id)}
              style={[
                styles.chip,
                {
                  backgroundColor: isSelected ? colors.primary : colors.surface,
                  borderColor: colors.primary,
                },
              ]}
            >
              <Typography
                variant="caption"
                color={isSelected ? '#FFFFFF' : colors.primary}
                style={{ fontWeight: isSelected ? '700' : '600' }}
              >
                {chip.label}
              </Typography>
            </Pressable>
          );
        })}
      </View>

      {/* Trạng thái mạng: Loading / Error / Danh sách */}
      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Typography variant="body" color={colors.textLight} style={styles.loadingText}>
            Đang tải món...
          </Typography>
        </View>
      ) : error ? (
        <View style={styles.centerContainer}>
          <Typography variant="bodyBold" color={colors.error} style={styles.errorTitle}>
            {STUDENT.mssv} — Không tải được dữ liệu món.
          </Typography>
          <Typography variant="caption" color={colors.textLight} style={styles.errorSub}>
            Vui lòng kiểm tra kết nối mạng và thử lại.
          </Typography>
          <ShopButton
            title="Thử lại"
            variant="primary"
            onPress={() => loadData(false)}
            style={styles.retryBtn}
          />
        </View>
      ) : (
        /* Danh sách sản phẩm 1 cột */
        <FlatList
          data={filteredProducts}
          keyExtractor={item => `${STUDENT.mssv}-${item.id}`}
          renderItem={({ item }) => (
            <ProductCard
              item={item}
              onOrder={handleOpenOrderModal}
              disabled={isExpired}
            />
          )}
          refreshing={refreshing}
          onRefresh={handlePullRefresh}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Typography variant="body" color={colors.textLight}>
                Không có món phù hợp
              </Typography>
            </View>
          }
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Watermark ở chân màn hình */}
      {!VARIANT.watermarkAtTop && <StudentWatermark />}

      {/* Modal chi tiết đặt món */}
      <Modal
        visible={!!selectedProduct}
        transparent={true}
        animationType={VARIANT.modalAnimation}
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            
            {/* Dòng tên thí sinh trong Modal */}
            <View style={styles.modalWatermark}>
              <Typography variant="caption" color={colors.primary} style={{ fontWeight: '700' }}>
                TH1 · {STUDENT.mssv} · {STUDENT.hoTen} · #{examStamp()}
              </Typography>
            </View>

            {selectedProduct && (
              <>
                {/* Ảnh món ăn lớn trong Modal */}
                <View style={styles.modalImageContainer}>
                  <Image
                    source={{ uri: selectedProduct.image }}
                    style={styles.modalImage}
                    resizeMode="contain"
                  />
                </View>

                {/* Tên món, Giá tiền, Danh mục, Mô tả 2 dòng */}
                <Typography variant="h2" color={colors.text} style={styles.modalName} numberOfLines={2}>
                  {selectedProduct.name}
                </Typography>

                <Typography variant="price" color={colors.primary} style={styles.modalPrice}>
                  {(selectedProduct.price * quantity).toLocaleString('vi-VN')} đ
                </Typography>

                <Typography variant="caption" color={colors.textLight} style={styles.modalCategory}>
                  Danh mục: {selectedProduct.categoryName}
                </Typography>

                <Typography variant="caption" color={colors.textLight} numberOfLines={2} style={styles.modalDescription}>
                  {selectedProduct.description}
                </Typography>

                {/* BỘ ĐẾM SỐ LƯỢNG SỬ DỤNG useReducer (ADD / REMOVE) */}
                <View style={styles.counterRow}>
                  <Pressable
                    onPress={() => dispatchQuantity({ type: 'REMOVE' })}
                    style={({ pressed }) => [
                      styles.counterBtn,
                      { backgroundColor: colors.background, borderColor: colors.border },
                      pressed && { opacity: 0.7 },
                    ]}
                  >
                    <Typography variant="h2" color={colors.primary}>
                      −
                    </Typography>
                  </Pressable>

                  <View style={styles.quantityBox}>
                    <Typography variant="h3" color={colors.text}>
                      {quantity}
                    </Typography>
                  </View>

                  <Pressable
                    onPress={() => dispatchQuantity({ type: 'ADD' })}
                    style={({ pressed }) => [
                      styles.counterBtn,
                      { backgroundColor: colors.primary, borderColor: colors.primary },
                      pressed && { opacity: 0.7 },
                    ]}
                  >
                    <Typography variant="h2" color="#FFFFFF">
                      +
                    </Typography>
                  </Pressable>
                </View>

                {/* NÚT XÁC NHẬN ĐẶT HOẶC KHÓA KHI HẾT GIỜ FLASH */}
                <ShopButton
                  title={isExpired ? 'Hết giờ flash-sale' : 'Xác nhận đặt'}
                  variant="primary"
                  disabled={isExpired}
                  onPress={handleConfirmOrder}
                  style={styles.confirmBtn}
                />

                {/* NÚT ĐÓNG (Variant Outline - Không bật Alert) */}
                <ShopButton
                  title="Đóng"
                  variant="outline"
                  onPress={handleCloseModal}
                  style={styles.closeBtn}
                />
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  watermarkBar: {
    paddingVertical: 8,
    paddingHorizontal: SPACING.md,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  watermarkText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  header: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.md,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  headerRight: {
    alignItems: 'flex-end',
    gap: 6,
  },
  themeBtn: {
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: BORDER_RADIUS.full,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  flashBadge: {
    marginTop: 2,
  },
  flashText: {
    fontWeight: '800',
    fontSize: 13,
  },
  searchContainer: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.sm,
  },
  bannerContainer: {
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.sm,
    height: 120,
    borderRadius: BORDER_RADIUS.lg,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#0F766E',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    opacity: 0.45,
  },
  bannerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
  },
  bannerTitle: {
    fontWeight: '800',
    fontSize: 18,
    marginBottom: 4,
  },
  chipsContainer: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.sm,
    gap: SPACING.xs,
  },
  chip: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: BORDER_RADIUS.full,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContent: {
    paddingBottom: SPACING.xl,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.sm,
    padding: SPACING.sm + 2,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    shadowColor: '#0F766E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardImageContainer: {
    width: 68,
    height: 68,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: '#F0FDFA',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 4,
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  cardInfo: {
    flex: 1,
    marginLeft: SPACING.md,
    marginRight: SPACING.sm,
  },
  cardName: {
    fontSize: 15,
    marginBottom: 2,
  },
  cardPrice: {
    fontSize: 15,
    marginBottom: 2,
  },
  orderBtn: {
    height: 38,
    paddingHorizontal: 20,
    borderRadius: BORDER_RADIUS.full,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.lg,
  },
  loadingText: {
    marginTop: SPACING.sm,
  },
  errorTitle: {
    textAlign: 'center',
    marginBottom: SPACING.xs,
  },
  errorSub: {
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  retryBtn: {
    width: 140,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.xxl,
  },
  // Styles Modal Đặt món (Giao diện 2)
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
  },
  modalCard: {
    width: '100%',
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    borderWidth: 1,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  modalWatermark: {
    marginBottom: SPACING.sm,
    paddingBottom: SPACING.xs,
    borderBottomWidth: 1,
    borderColor: '#CCFBF1',
    width: '100%',
    alignItems: 'center',
  },
  modalImageContainer: {
    width: 110,
    height: 110,
    borderRadius: BORDER_RADIUS.lg,
    backgroundColor: '#F0FDFA',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  modalImage: {
    width: '100%',
    height: '100%',
  },
  modalName: {
    textAlign: 'center',
    marginBottom: 4,
  },
  modalPrice: {
    fontSize: 18,
    marginBottom: 4,
  },
  modalCategory: {
    marginBottom: 4,
  },
  modalDescription: {
    textAlign: 'center',
    marginBottom: SPACING.md,
    paddingHorizontal: SPACING.sm,
  },
  counterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
    gap: SPACING.md,
  },
  counterBtn: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.full,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityBox: {
    minWidth: 44,
    alignItems: 'center',
  },
  confirmBtn: {
    width: '100%',
    marginBottom: SPACING.sm,
  },
  closeBtn: {
    width: '100%',
  },
});

export default HomeScreen;
