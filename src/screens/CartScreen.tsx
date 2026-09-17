import React from 'react';
import { View, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useCartStore } from '@store/useCartStore';
import ShopButton from '@components/ShopButton';
import Typography from '@components/ui/Typography';
import { SIZES } from '@constants/theme';
import { useTheme } from '@hooks/useTheme';

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);

/**
 * Màn hình Giỏ hàng hoàn thiện (Chương 6 - Bước 9)
 * Kết nối với Đám mây Zustand useCartStore (Persist tự lưu AsyncStorage)
 */
export const CartScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { colors } = useTheme();

  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const totalPrice = useCartStore((state) => state.totalPrice());
  const totalQuantity = useCartStore((state) => state.totalQuantity());

  // TRẠNG THÁI TRỐNG (Empty State)
  if (items.length === 0) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
        <View style={styles.emptyContainer}>
          <Typography variant="h1" style={styles.emptyIcon}>
            🛒
          </Typography>
          <Typography variant="h2" color={colors.text} style={styles.emptyTitle}>
            Giỏ hàng của bạn đang trống!
          </Typography>
          <Typography variant="body1" color={colors.textLight} style={styles.emptySubtitle}>
            Hãy khám phá các sản phẩm công nghệ tuyệt vời và thêm vào giỏ.
          </Typography>
          <ShopButton
            title="Khám phá ngay"
            onPress={() => navigation.navigate('HomeTab')}
            style={styles.exploreBtn}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      {/* Header Giỏ hàng */}
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <Typography variant="h2" color={colors.text} style={styles.headerTitle}>
          Giỏ hàng ({totalQuantity})
        </Typography>
      </View>

      {/* Danh sách sản phẩm trong giỏ */}
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View
            style={[
              styles.cartItem,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
          >
            {item.image ? (
              <Image source={{ uri: item.image }} style={styles.itemImage} resizeMode="cover" />
            ) : null}

            <View style={styles.itemInfo}>
              <Typography variant="body1" color={colors.text} style={styles.itemName} numberOfLines={2}>
                {item.name}
              </Typography>
              <Typography variant="body2" color={colors.primary} style={styles.itemPrice}>
                {formatCurrency(item.price)}
              </Typography>

              {/* Bộ điều khiển số lượng [-] Qty [+] */}
              <View style={styles.stepperRow}>
                <TouchableOpacity
                  style={[styles.stepperBtn, { borderColor: colors.border }]}
                  onPress={() => updateQuantity(item.id, -1)}
                  activeOpacity={0.7}
                >
                  <Typography variant="body1" color={colors.text} style={styles.stepperTxt}>
                    -
                  </Typography>
                </TouchableOpacity>

                <Typography variant="body1" color={colors.text} style={styles.stepperValue}>
                  {item.quantity}
                </Typography>

                <TouchableOpacity
                  style={[styles.stepperBtn, { borderColor: colors.border }]}
                  onPress={() => updateQuantity(item.id, 1)}
                  activeOpacity={0.7}
                >
                  <Typography variant="body1" color={colors.text} style={styles.stepperTxt}>
                    +
                  </Typography>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.deleteBtn}
                  onPress={() => removeItem(item.id)}
                  activeOpacity={0.7}
                >
                  <Typography variant="small" color={colors.error} style={{ fontWeight: '600' }}>
                    Xóa
                  </Typography>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      />

      {/* Thanh tổng tiền & Nút Đặt hàng */}
      <View style={[styles.footer, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
        <View style={styles.totalRow}>
          <Typography variant="body1" color={colors.textLight}>
            Tổng thanh toán:
          </Typography>
          <Typography variant="h2" color={colors.primary} style={styles.totalPrice}>
            {formatCurrency(totalPrice)}
          </Typography>
        </View>

        <ShopButton
          title="Tiến hành Thanh toán"
          onPress={() => navigation.navigate('Checkout')}
          style={styles.checkoutBtn}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    paddingHorizontal: SIZES.padding,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontWeight: '800',
  },
  listContent: {
    padding: SIZES.padding,
    paddingBottom: 24,
  },
  cartItem: {
    flexDirection: 'row',
    borderRadius: SIZES.radius,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: '#F0F0F0',
  },
  itemInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  itemName: {
    fontWeight: '600',
    marginBottom: 4,
  },
  itemPrice: {
    fontWeight: '700',
    marginBottom: 8,
  },
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepperBtn: {
    width: 28,
    height: 28,
    borderRadius: 6,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepperTxt: {
    fontWeight: '700',
    lineHeight: 18,
  },
  stepperValue: {
    marginHorizontal: 12,
    fontWeight: '700',
    minWidth: 20,
    textAlign: 'center',
  },
  deleteBtn: {
    marginLeft: 'auto',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  footer: {
    padding: SIZES.padding,
    borderTopWidth: 1,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  totalPrice: {
    fontWeight: '900',
  },
  checkoutBtn: {
    height: 48,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.padding * 1.5,
  },
  emptyIcon: {
    fontSize: 68,
    marginBottom: 16,
  },
  emptyTitle: {
    fontWeight: '800',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    textAlign: 'center',
    marginBottom: 24,
  },
  exploreBtn: {
    width: 220,
  },
});

export default CartScreen;
