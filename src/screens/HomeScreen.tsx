// 1. IMPORT ĐỒ NGHỀ TỪ BÊN NGOÀI
import React, { useCallback, useMemo, useState } from 'react';
import {
  View,
  ScrollView,
  Pressable,
  StyleSheet,
  StatusBar,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlashList } from '@shopify/flash-list';
import { MOCK_PRODUCTS, Product } from '@data/mockProducts';
import ProductCard from '@components/ProductCard';
import { useTheme } from '@hooks/useTheme';
import { SPACING, BORDER_RADIUS } from '@constants/theme';
import { AppText, AppInput } from '@components/ui';

const CATEGORIES = ['Tất cả', 'Âm thanh', 'Gaming', 'Phụ kiện', 'Gia dụng thông minh', 'Mạng'];

// 2. TẠO COMPONENT HOMESCREEN CHUẨN SPRINT 4
const HomeScreen = () => {
  const { colors, isDark, toggleTheme } = useTheme();

  // STATE: Quản lý danh sách sản phẩm, từ khóa và bộ lọc
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [keyword, setKeyword] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');
  const [refreshing, setRefreshing] = useState(false);

  // HÀM: Kéo để làm mới (Pull-to-refresh)
  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    // Giả lập làm mới dữ liệu sau 1 giây
    setTimeout(() => {
      // Xáo ngẫu nhiên để thấy danh sách đã được nạp lại
      setProducts([...MOCK_PRODUCTS].sort(() => Math.random() - 0.5));
      setRefreshing(false);
    }, 1200);
  }, []);

  // HÀM: Xử lý khi nhấn Mua ngay
  const handleBuy = useCallback((product: Product) => {
    Alert.alert(
      '🛒 Đã thêm vào giỏ',
      `Bạn vừa chọn mua: ${product.name}\nGiá: ${new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
      }).format(product.price)}`,
    );
  }, []);

  // LOGIC LỌC SẢN PHẨM: Theo từ khóa và danh mục
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchKeyword = p.name.toLowerCase().includes(keyword.toLowerCase());
      const matchCategory =
        selectedCategory === 'Tất cả' || p.category === selectedCategory;
      return matchKeyword && matchCategory;
    });
  }, [products, keyword, selectedCategory]);

  // 3. GIAO DIỆN CHÍNH (JSX)
  return (
    <SafeAreaView
      style={[styles.safe, { backgroundColor: colors.background }]}
      edges={['top', 'left', 'right']}
    >
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      {/* Header AppBar */}
      <View
        style={[
          styles.header,
          { backgroundColor: colors.surface, borderBottomColor: colors.border },
        ]}
      >
        <View style={styles.headerRow}>
          <View>
            <AppText variant="h1" color={colors.primary}>
              ShopAI
            </AppText>
            <AppText variant="caption">
              Sprint 4 — Lưới FlashList 2 Cột & Reanimated
            </AppText>
          </View>

          {/* Nút bấm chuyển Theme */}
          <Pressable
            onPress={toggleTheme}
            style={({ pressed }) => [
              styles.themeBtn,
              {
                backgroundColor: isDark ? '#2C2C2C' : '#F0F0F0',
                borderColor: colors.border,
              },
              pressed && { opacity: 0.7 },
            ]}
          >
            <AppText variant="caption" style={{ fontWeight: '700' }}>
              {isDark ? '☀️ Sáng' : '🌙 Tối'}
            </AppText>
          </Pressable>
        </View>
      </View>

      {/* Thanh tìm kiếm */}
      <View style={styles.searchSection}>
        <AppInput
          placeholder="Tìm kiếm sản phẩm công nghệ..."
          value={keyword}
          onChangeText={setKeyword}
          autoCapitalize="none"
          containerStyle={{ marginBottom: 0 }}
        />
      </View>

      {/* Danh mục lọc sản phẩm cuộn ngang */}
      <View style={styles.categorySection}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScroll}
        >
          {CATEGORIES.map(cat => {
            const isSelected = selectedCategory === cat;
            return (
              <Pressable
                key={cat}
                onPress={() => setSelectedCategory(cat)}
                style={[
                  styles.categoryChip,
                  {
                    backgroundColor: isSelected
                      ? colors.primary
                      : isDark
                      ? '#2A2A2A'
                      : '#FFFFFF',
                    borderColor: isSelected ? colors.primary : colors.border,
                  },
                ]}
              >
                <AppText
                  variant="caption"
                  color={isSelected ? '#FFFFFF' : colors.text}
                  style={{ fontWeight: isSelected ? '700' : '500' }}
                >
                  {cat}
                </AppText>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {/* FLASHLIST: Lưới sản phẩm 2 cột siêu tốc độ */}
      <View style={styles.listContainer}>
        <FlashList
          data={filteredProducts}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <ProductCard product={item} onBuy={handleBuy} />
          )}
          numColumns={2}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: SPACING.md,
            paddingBottom: SPACING.xl,
          }}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <AppText variant="body" color={colors.textMuted}>
                Không tìm thấy sản phẩm nào phù hợp
              </AppText>
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
};

// 4. STYLESHEET
const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  header: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  themeBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: BORDER_RADIUS.full,
    borderWidth: 1,
  },
  searchSection: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.sm,
  },
  categorySection: {
    marginBottom: SPACING.sm,
  },
  categoryScroll: {
    paddingHorizontal: SPACING.md,
    gap: SPACING.xs,
  },
  categoryChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: BORDER_RADIUS.full,
    borderWidth: 1,
  },
  listContainer: {
    flex: 1,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.xxl,
  },
});

export default HomeScreen;



