import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Pressable,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { FlashList } from '@shopify/flash-list';
import { useInfiniteQuery } from '@tanstack/react-query';
import ProductCard from '@components/ProductCard';
import ShopInput, { TextInputRef } from '@components/ui/ShopInput';
import ShopButton from '@components/ShopButton';
import Typography from '@components/ui/Typography';
import LottieView from 'lottie-react-native';
import { MOCK_PRODUCTS } from '@data/mockProducts';
import { Product, ProductListSchema } from '../types/product.schema';
import { SIZES } from '@constants/theme';
import { useTheme } from '@hooks/useTheme';
import FilterModal, { PRICE_RANGES } from '@components/FilterModal';
import HeaderMenuModal from '@components/HeaderMenuModal';
import { useAuthStore } from '@store/useAuthStore';
import type { HomeStackParamList } from '@navigation/HomeStackNavigator';

type HomeNavProp = NativeStackNavigationProp<HomeStackParamList, 'Home'>;

interface HomeScreenProps {
  onLogout?: () => void;
}

const PAGE_SIZE = 10;
const TOTAL_MOCK_PRODUCTS = MOCK_PRODUCTS.length;

export interface ProductPage {
  items: Product[];
  nextPage: number | null;
}

export class ZodValidationError extends Error {}
export class NetworkError extends Error {}

/**
 * Hàm giả lập gọi API PHÂN TRANG (Chương 6 - Bước 8)
 * Tải từng trang 10 sản phẩm, cho dữ liệu đi qua trạm kiểm soát Zod Schema
 */
export const fetchProductsPage = async ({ pageParam }: { pageParam: number }): Promise<ProductPage> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const start = (pageParam - 1) * PAGE_SIZE;
      const rawItems = MOCK_PRODUCTS.slice(start, start + PAGE_SIZE);

      // TRẠM KIỂM SOÁT ZOD: Kiểm tra tính hợp lệ của từng trang trước khi cho phép vào UI
      const result = ProductListSchema.safeParse(rawItems);
      if (!result.success) {
        console.error('❌ Zod chặn dữ liệu bẩn từ API:', result.error.format());
        reject(new ZodValidationError('Dữ liệu sản phẩm không hợp lệ (Zod validation failed)!'));
        return;
      }

      const hasMore = start + PAGE_SIZE < TOTAL_MOCK_PRODUCTS;
      resolve({ items: result.data, nextPage: hasMore ? pageParam + 1 : null });
    }, 500);
  });
};

export const HomeScreen: React.FC<HomeScreenProps> = ({ onLogout }) => {
  const navigation = useNavigation<HomeNavProp>();
  const { colors, isDark, toggleTheme } = useTheme();
  const authLogout = useAuthStore((state) => state.logout);
  const handleLogout = onLogout || authLogout;

  // Menu tiện ích 3 sọc (Gom Sáng/Tối, Ngôn ngữ, Đăng xuất)
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  // Đa ngôn ngữ i18next (Chương 3 - Mục 3.6)
  const { t, i18n } = useTranslation();
  const isEn = i18n.language === 'en';

  const toggleLanguage = useCallback(() => {
    i18n.changeLanguage(isEn ? 'vi' : 'en');
  }, [isEn, i18n]);

  // 1. Vũ khí hạng nặng TanStack Query: Caching 5 phút + Phân trang tự động (Chương 6 - Bước 8)
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['productsInfinite'],
    queryFn: fetchProductsPage,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });

  // data.pages là mảng các trang -> "làm phẳng" thành 1 mảng duy nhất cho FlashList
  const allProducts = useMemo(() => {
    return data?.pages.flatMap((page) => page.items) ?? [];
  }, [data]);

  // 2. Ô tìm kiếm Uncontrolled TextInput:
  // KHÔNG truyền prop `value={searchQuery}` để hệ thống Android EditText tự do xử lý bộ đệm Telex của Unikey/EVKey,
  // triệt tiêu 100% hiện tượng chớp nháy hoặc nhảy ngược chữ khi gõ dấu ("dd" -> "đ").
  const searchInputRef = useRef<TextInputRef>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [debouncedQuery, setDebouncedQuery] = useState<string>('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 250);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // 3. Quản lý Bộ lọc nâng cao (Chương 4 - Sprint 4 Tiêu chí 8)
  // Hỗ trợ ĐA CHỌN danh mục (ví dụ: vừa chọn Điện thoại + Gaming)
  const [isFilterModalOpen, setIsFilterModalOpen] = useState<boolean>(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>('all');

  const handleToggleCategory = useCallback((category: string) => {
    if (category === 'Tất cả') {
      setSelectedCategories([]);
      return;
    }
    setSelectedCategories(prev => {
      const withoutAll = prev.filter(c => c !== 'Tất cả');
      if (withoutAll.includes(category)) {
        return withoutAll.filter(c => c !== category);
      } else {
        return [...withoutAll, category];
      }
    });
  }, []);

  const handleResetFilter = useCallback(() => {
    searchInputRef.current?.clear();
    setSearchQuery('');
    setDebouncedQuery('');
    setSelectedCategories([]);
    setSelectedPriceRange('all');
  }, []);

  const hasActiveFilter = selectedCategories.length > 0 || selectedPriceRange !== 'all';

  // Lọc sản phẩm kết hợp: Từ khóa tìm kiếm + Nhiều danh mục cùng lúc + Khoảng giá (Sprint 4)
  const filteredProducts = useMemo(() => {
    return allProducts.filter(item => {
      // 1. Lọc theo từ khóa tìm kiếm (đã debounce mượt mà cho tiếng Việt)
      if (debouncedQuery.trim()) {
        const query = debouncedQuery.toLowerCase().trim();
        if (!item.name.toLowerCase().includes(query)) {
          return false;
        }
      }

      // 2. Lọc theo Danh mục (Đa chọn: ví dụ Điện thoại + Gaming)
      if (selectedCategories.length > 0) {
        if (!item.category || !selectedCategories.includes(item.category)) {
          return false;
        }
      }

      // 3. Lọc theo Khoảng giá
      if (selectedPriceRange !== 'all') {
        const range = PRICE_RANGES.find(r => r.id === selectedPriceRange);
        if (range && (item.price < range.min || item.price > range.max)) {
          return false;
        }
      }

      return true;
    });
  }, [allProducts, debouncedQuery, selectedCategories, selectedPriceRange]);

  // Trạng thái 1: Đang tải dữ liệu — Micro-animations Lottie (Chương 3 - Mục 3.7)
  if (isLoading && !isRefetching) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
        <View style={styles.centerContainer}>
          <LottieView
            source={require('@assets/lottie/loading.json')}
            autoPlay
            loop
            style={styles.lottieLoading}
          />
          <Typography variant="body1" color={colors.textLight} style={styles.loadingText}>
            {t('common.loading')}
          </Typography>
        </View>
      </SafeAreaView>
    );
  }

  // Trạng thái 2: Lỗi mạng hoặc lỗi Zod (Error + Nút Thử lại)
  if (isError && allProducts.length === 0) {
    const errorMessage =
      error instanceof ZodValidationError
        ? '⚠️ Dữ liệu sản phẩm không hợp lệ (lỗi kiểm tra Zod)!'
        : '📡 Không thể kết nối đến máy chủ. Vui lòng kiểm tra lại mạng!';

    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
        <View style={styles.centerContainer}>
          <Typography variant="h2" color={colors.error} style={{ marginBottom: 8 }}>
            {t('common.errorOccurred')}
          </Typography>
          <Typography variant="body2" color={colors.textLight} style={styles.errorText}>
            {errorMessage}
          </Typography>
          <ShopButton
            title={t('common.retry')}
            onPress={() => refetch()}
            style={styles.retryButton}
          />
        </View>
      </SafeAreaView>
    );
  }

  // Trạng thái 3: Hiển thị danh sách thành công
  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.background }]}
      edges={['top', 'left', 'right']}
    >
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {/* Header AppBar */}
        <View
          style={[
            styles.header,
            { backgroundColor: colors.surface, borderBottomColor: colors.border },
          ]}
        >
          <TouchableOpacity style={styles.backButton} activeOpacity={0.7}>
            <Typography variant="h2" color={colors.text}>‹</Typography>
          </TouchableOpacity>

          <Typography variant="h3" color={colors.text} style={styles.headerTitle}>
            {t('common.appName')}
          </Typography>

          <View style={styles.headerRightGroup}>
            {/* Nút Menu 3 sọc sang trọng (Gom Sáng/Tối, Ngôn ngữ, Đăng xuất) */}
            <TouchableOpacity
              style={[
                styles.hamburgerBtn,
                { borderColor: colors.border, backgroundColor: colors.background },
              ]}
              onPress={() => setIsMenuOpen(true)}
              activeOpacity={0.7}
              accessibilityLabel="Mở menu tiện ích"
            >
              <Typography variant="body1" color={colors.text} style={styles.hamburgerText}>
                ☰
              </Typography>
            </TouchableOpacity>
          </View>
        </View>

        {/* Thanh tìm kiếm sản phẩm & Nút mở Bộ lọc nâng cao (Chương 2 & Chương 4) */}
        <View style={[styles.searchSection, { backgroundColor: colors.surface }]}>
          <View style={styles.searchRow}>
            <View style={styles.searchInputWrapper}>
              <ShopInput
                ref={searchInputRef}
                placeholder={t('home.searchPlaceholder')}
                onChangeText={setSearchQuery}
                containerStyle={styles.searchInputContainer}
                style={searchQuery ? { paddingRight: 36 } : undefined}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity
                  style={styles.clearSearchBtn}
                  onPress={() => {
                    searchInputRef.current?.clear();
                    setSearchQuery('');
                    setDebouncedQuery('');
                  }}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Typography variant="body2" color={colors.textLight} style={{ fontWeight: '700' }}>
                    ✕
                  </Typography>
                </TouchableOpacity>
              )}
            </View>

            <TouchableOpacity
              style={[
                styles.filterButton,
                {
                  backgroundColor: hasActiveFilter ? colors.primary : colors.background,
                  borderColor: hasActiveFilter ? colors.primary : colors.border,
                },
              ]}
              onPress={() => setIsFilterModalOpen(true)}
              activeOpacity={0.7}
              accessibilityLabel="Mở bộ lọc nâng cao"
            >
              <Typography
                variant="body1"
                color={hasActiveFilter ? '#FFFFFF' : colors.text}
              >
                🔍
              </Typography>
            </TouchableOpacity>
          </View>

          {/* Dòng trạng thái bộ lọc đang kích hoạt */}
          {hasActiveFilter && (
            <View style={styles.activeFilterRow}>
              <Typography variant="small" color={colors.primary} style={{ fontWeight: '600', flex: 1 }} numberOfLines={1}>
                Đang lọc: {selectedCategories.length > 0 ? `[${selectedCategories.join(', ')}] ` : ''}
                {selectedPriceRange !== 'all' ? `[${PRICE_RANGES.find(r => r.id === selectedPriceRange)?.label}]` : ''}
              </Typography>
              <TouchableOpacity onPress={handleResetFilter} activeOpacity={0.6}>
                <Typography variant="small" color={colors.error} style={{ marginLeft: 8, textDecorationLine: 'underline' }}>
                  Xóa lọc
                </Typography>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Lưới 2 cột FlashList (Chương 6 - Bước 8) - Phân trang thật với useInfiniteQuery */}
        <FlashList
          data={filteredProducts}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}
              style={{ flex: 1 }}
            >
              <ProductCard product={item} />
            </Pressable>
          )}
          numColumns={2}
          refreshing={isRefetching}
          onRefresh={refetch}
          onEndReached={() => {
            if (hasNextPage && !isFetchingNextPage) {
              fetchNextPage();
            }
          }}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            isFetchingNextPage ? (
              <ActivityIndicator
                size="small"
                color={colors.primary}
                style={{ marginVertical: 16 }}
              />
            ) : null
          }
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={true}
          nestedScrollEnabled={true}
          keyboardShouldPersistTaps="handled"
          scrollEventThrottle={16}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Typography variant="body1" color={colors.textLight}>
                {`${t('home.notFound')} "${searchQuery}"`}
              </Typography>
            </View>
          }
        />

        {/* Modal Bộ lọc sản phẩm nâng cao (Chương 4 - Tiêu chí 8) */}
        <FilterModal
          visible={isFilterModalOpen}
          onClose={() => setIsFilterModalOpen(false)}
          selectedCategories={selectedCategories}
          onToggleCategory={handleToggleCategory}
          selectedPriceRange={selectedPriceRange}
          onSelectPriceRange={setSelectedPriceRange}
          onReset={handleResetFilter}
        />

        {/* Menu 3 sọc sang trọng (Giao diện Sáng/Tối, Ngôn ngữ, Đăng xuất) */}
        <HeaderMenuModal
          visible={isMenuOpen}
          onClose={() => setIsMenuOpen(false)}
          isDark={isDark}
          onToggleTheme={toggleTheme}
          isEn={isEn}
          onToggleLanguage={toggleLanguage}
          onOpenReduxDemo={() => navigation.navigate('ReduxCartDemo' as any)}
          onLogout={handleLogout}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.padding,
  },
  lottieLoading: {
    width: 90,
    height: 90,
    marginBottom: 8,
  },
  loadingText: {
    marginTop: 8,
  },
  errorText: {
    textAlign: 'center',
    marginBottom: 16,
    paddingHorizontal: 24,
  },
  retryButton: {
    width: 140,
  },
  header: {
    height: 54,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  backButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  headerTitle: {
    textAlign: 'center',
    flex: 1,
  },
  headerRightGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  hamburgerBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  hamburgerText: {
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 22,
  },
  searchSection: {
    paddingHorizontal: SIZES.padding,
    paddingTop: 10,
    paddingBottom: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E0E0E0',
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInputWrapper: {
    flex: 1,
    position: 'relative',
    justifyContent: 'center',
  },
  searchInputContainer: {
    marginBottom: 0,
  },
  clearSearchBtn: {
    position: 'absolute',
    right: 12,
    top: 14,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(150, 150, 150, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    marginLeft: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeFilterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingHorizontal: 4,
  },
  listContent: {
    padding: SIZES.padding / 2,
    paddingBottom: 24,
  },
  emptyContainer: {
    padding: 32,
    alignItems: 'center',
  },
});

export default HomeScreen;

