import React, { useState, useEffect, useMemo, useCallback, memo } from 'react';
import {
  View,
  Image,
  FlatList,
  Pressable,
  ActivityIndicator,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { STUDENT, BANNER_IMAGE_ID, FLASH_SECONDS, VARIANT, examStamp } from '@constants/student';
import { useTheme } from '@hooks/useTheme';
import { useCountdown } from '@hooks/useCountdown';
import { fetchProducts, ProductItem, CategoryId } from '@services/productApi';
import { SPACING, BORDER_RADIUS } from '@constants/theme';
import { Typography, ShopInput, ShopButton } from '@components/ui';

// Danh sách danh mục chuẩn theo đề thi
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
    <View style={[styles.watermarkBar, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <Typography variant="caption" color={colors.textLight} style={styles.watermarkText}>
        TH1 · {STUDENT.mssv} · {STUDENT.hoTen} · #{examStamp()}
      </Typography>
    </View>
  );
});

// Component Thẻ món ăn 1 cột dọc (ProductCard)
interface ProductCardProps {
  item: ProductItem;
  onOrder: (item: ProductItem) => void;
  disabled?: boolean;
}

const ProductCard = memo(({ item, onOrder, disabled }: ProductCardProps) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <Image
        source={{ uri: item.image }}
        style={styles.cardImage}
        resizeMode="contain"
      />

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
    </View>
  );
});

const HomeScreen: React.FC = () => {
  const { colors, isDark, toggleTheme } = useTheme();
  const { formattedTime, isExpired } = useCountdown(FLASH_SECONDS);

  // States quản lý dữ liệu và mạng (Câu 2b)
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // States tìm kiếm và lọc danh mục
  const [keyword, setKeyword] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>(
    VARIANT.chipsReversed ? 'study' : 'all'
  );

  // Danh sách chip theo biến thể số cuối MSSV
  const chipList = useMemo(() => {
    return VARIANT.chipsReversed ? CHIPS_REVERSED : CHIPS_DEFAULT;
  }, []);

  // Hàm tải dữ liệu API có cờ alive (Câu 2b)
  const loadData = useCallback(() => {
    let isAlive = true;
    setLoading(true);
    setError(null);

    fetchProducts()
      .then(data => {
        if (isAlive) {
          setProducts(data);
          setLoading(false);
        }
      })
      .catch(err => {
        if (isAlive) {
          setError(err.message || 'Không tải được dữ liệu món.');
          setLoading(false);
        }
      });

    return () => {
      isAlive = false;
    };
  }, []);

  useEffect(() => {
    const cleanup = loadData();
    return cleanup;
  }, [loadData]);

  // Lọc sản phẩm theo từ khóa và danh mục (useMemo)
  const filteredProducts = useMemo(() => {
    return products.filter(item => {
      const matchKeyword = item.name.toLowerCase().includes(keyword.trim().toLowerCase());
      const matchCat = selectedCategory === 'all' || item.category === selectedCategory;
      return matchKeyword && matchCat;
    });
  }, [products, keyword, selectedCategory]);

  const handleOrder = useCallback((item: ProductItem) => {
    // Sẽ kết nối Modal ở Câu 3
    console.log('Đặt món:', item.name);
  }, []);

  // Header của danh sách (gồm Banner, Tìm kiếm, Chips)
  const renderListHeader = useCallback(() => {
    return (
      <View>
        {/* Khối (B): Ô tìm kiếm Controlled có chứa MSSV trong placeholder */}
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
            <Typography variant="caption" color="#E6FFFA">
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
                    borderColor: isSelected ? colors.primary : colors.border,
                  },
                ]}
              >
                <Typography
                  variant="caption"
                  color={isSelected ? '#FFFFFF' : colors.text}
                  style={{ fontWeight: isSelected ? '700' : '500' }}
                >
                  {chip.label}
                </Typography>
              </Pressable>
            );
          })}
        </View>
      </View>
    );
  }, [keyword, chipList, selectedCategory, colors]);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['top', 'left', 'right', 'bottom']}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      {/* (0) Watermark ở trên ĐẦU nếu số cuối chẵn */}
      {VARIANT.watermarkAtTop && <StudentWatermark />}

      {/* Khối (A): Header ứng dụng CAMPUSMART + Nút Sáng/Tối + Slogan + Flash Sale */}
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <View style={styles.headerTop}>
          <View>
            <Typography variant="h1" color={colors.primary}>
              CAMPUSMART
            </Typography>
            <Typography variant="caption" color={colors.textLight}>
              Tiện lợi KTX 24/7
            </Typography>
          </View>

          <View style={styles.headerRight}>
            {/* Nút Sáng/Tối theo biến thể Pressable */}
            <Pressable
              onPress={toggleTheme}
              style={({ pressed }) => [
                styles.themeBtn,
                { backgroundColor: colors.background, borderColor: colors.border },
                pressed && { opacity: 0.7 },
              ]}
            >
              <Typography variant="caption" style={{ fontWeight: '700' }}>
                {isDark ? '☀️ Sáng' : '🌙 Tối'}
              </Typography>
            </Pressable>

            {/* Đồng hồ Flash Sale */}
            <View style={styles.flashBadge}>
              <Typography variant="caption" color={colors.secondary} style={styles.flashText}>
                ⚡ Flash {formattedTime}
              </Typography>
            </View>
          </View>
        </View>
      </View>

      {/* 3 CẢNH MẠNG (Câu 2b): Loading / List / Error */}
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
            onPress={loadData}
            style={styles.retryBtn}
          />
        </View>
      ) : (
        /* Khối (E): FlatList món 1 cột dọc chuẩn */
        <FlatList
          data={filteredProducts}
          keyExtractor={item => `${STUDENT.mssv}-${item.id}`}
          renderItem={({ item }) => (
            <ProductCard
              item={item}
              onOrder={handleOrder}
              disabled={isExpired}
            />
          )}
          ListHeaderComponent={renderListHeader}
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

      {/* (0) Watermark ở DƯỚI CHÂN màn hình nếu số cuối lẻ (Số cuối = 1) */}
      {!VARIANT.watermarkAtTop && <StudentWatermark />}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  watermarkBar: {
    paddingVertical: 6,
    paddingHorizontal: SPACING.md,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  watermarkText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  header: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerRight: {
    alignItems: 'flex-end',
    gap: 4,
  },
  themeBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.full,
    borderWidth: 1,
  },
  flashBadge: {
    marginTop: 2,
  },
  flashText: {
    fontWeight: '800',
    fontSize: 12,
  },
  searchContainer: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.sm,
  },
  bannerContainer: {
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.sm,
    height: 110,
    borderRadius: BORDER_RADIUS.md,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#0F766E',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    opacity: 0.55,
  },
  bannerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    paddingHorizontal: SPACING.md,
  },
  bannerTitle: {
    fontWeight: '800',
    marginBottom: 2,
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
    padding: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
  },
  cardImage: {
    width: 64,
    height: 64,
    borderRadius: BORDER_RADIUS.sm,
    backgroundColor: '#FFFFFF',
  },
  cardInfo: {
    flex: 1,
    marginLeft: SPACING.sm,
    marginRight: SPACING.xs,
  },
  cardName: {
    fontSize: 14,
    marginBottom: 2,
  },
  cardPrice: {
    fontSize: 15,
    marginBottom: 2,
  },
  orderBtn: {
    height: 36,
    paddingHorizontal: 16,
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
});

export default HomeScreen;
