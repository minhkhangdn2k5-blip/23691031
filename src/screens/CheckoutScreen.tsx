import React from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import ShopButton from '@components/ShopButton';
import Typography from '@components/ui/Typography';
import { useCartStore, CartItem } from '@store/useCartStore';
import { useOrderStore } from '@store/useOrderStore';
import { SIZES } from '@constants/theme';
import { useTheme } from '@hooks/useTheme';

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);

interface CreateOrderPayload {
  items: CartItem[];
  totalPrice: number;
}

interface CreateOrderResponse {
  orderId: string;
  status: 'PENDING';
}

/**
 * Hàm gọi API tạo đơn hàng (Chương 6 - Bước 9.5 & 9.6)
 * Giả lập độ trễ mạng tạo đơn và trả về mã hóa đơn ORD-xxx
 */
const createOrderLocal = async (_payload: CreateOrderPayload): Promise<CreateOrderResponse> => {
  await new Promise((resolve) => setTimeout(() => resolve(null), 1000));
  return {
    orderId: `ORD-${Date.now().toString().slice(-6)}`,
    status: 'PENDING',
  };
};

/**
 * Màn hình Xác nhận đơn hàng & Thanh toán (Modal Stack)
 * Dùng useMutation từ TanStack Query để quản lý vòng đời ghi dữ liệu
 */
export const CheckoutScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const queryClient = useQueryClient();
  const { colors } = useTheme();

  const items = useCartStore((state) => state.items);
  const totalQuantity = useCartStore((state) => state.totalQuantity());
  const totalPrice = useCartStore((state) => state.totalPrice());
  const clearCart = useCartStore((state) => state.clearCart);
  const addOrder = useOrderStore((state) => state.addOrder);

  // useMutation: Hành động GHI dữ liệu POST /orders
  const { mutate, isPending, isError, isSuccess, data } = useMutation({
    mutationFn: createOrderLocal,
    onSuccess: (res) => {
      // 1. Thêm hóa đơn mới vào useOrderStore với trạng thái PENDING
      addOrder({
        id: res.orderId,
        items: [...items],
        total: totalPrice,
        status: 'PENDING',
        createdAt: new Date().toISOString(),
      });

      // 2. Xóa sạch giỏ hàng
      clearCart();

      // 3. Đánh dấu Cache sản phẩm là Stale để tự động đồng bộ lại tồn kho
      queryClient.invalidateQueries({ queryKey: ['productsInfinite'] });

      // 4. Đóng Modal sau 1.5 giây
      setTimeout(() => {
        navigation.goBack();
      }, 1500);
    },
    onError: (err) => {
      console.error('❌ Đặt hàng thất bại:', err);
    },
  });

  const handleConfirm = () => {
    mutate({ items, totalPrice });
  };

  // Trạng thái thành công
  if (isSuccess) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
        <View style={styles.centerContainer}>
          <Typography variant="h1" style={styles.successIcon}>
            ✅
          </Typography>
          <Typography variant="h1" color={colors.primary} style={styles.successTitle}>
            Đặt hàng thành công!
          </Typography>
          <Typography variant="body1" color={colors.text} style={styles.orderIdText}>
            Mã đơn: {data?.orderId}
          </Typography>
          <Typography variant="body2" color={colors.textLight} style={styles.statusText}>
            Trạng thái: PENDING (Chờ thanh toán)
          </Typography>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <View style={styles.container}>
        <Typography variant="h1" color={colors.text} style={styles.title}>
          Xác nhận đơn hàng
        </Typography>

        {/* Thông tin tóm tắt */}
        <View style={[styles.summaryCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.summaryRow}>
            <Typography variant="body1" color={colors.textLight}>
              Số lượng sản phẩm:
            </Typography>
            <Typography variant="body1" color={colors.text} style={{ fontWeight: '700' }}>
              {totalQuantity} món
            </Typography>
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <View style={styles.summaryRow}>
            <Typography variant="body1" color={colors.textLight}>
              Phí vận chuyển:
            </Typography>
            <Typography variant="body1" color={colors.primary} style={{ fontWeight: '700' }}>
              Miễn phí
            </Typography>
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <View style={styles.summaryRow}>
            <Typography variant="h2" color={colors.text}>
              Tổng thanh toán:
            </Typography>
            <Typography variant="h2" color={colors.primary} style={{ fontWeight: '900' }}>
              {formatCurrency(totalPrice)}
            </Typography>
          </View>
        </View>

        {/* Thông báo lỗi nếu có */}
        {isError && (
          <Typography variant="body2" color={colors.error} style={styles.errorText}>
            Đặt hàng thất bại. Vui lòng kiểm tra lại mạng và thử lại!
          </Typography>
        )}

        {/* Nút gửi đơn hàng */}
        {isPending ? (
          <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 32 }} />
        ) : (
          <ShopButton
            title="Xác nhận & Tạo hóa đơn"
            onPress={handleConfirm}
            disabled={totalQuantity === 0}
            style={styles.confirmBtn}
          />
        )}
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
    padding: SIZES.padding,
  },
  title: {
    fontWeight: '800',
    marginBottom: 24,
  },
  summaryCard: {
    padding: SIZES.padding,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  divider: {
    height: 1,
    width: '100%',
  },
  confirmBtn: {
    marginTop: 32,
    height: 50,
  },
  errorText: {
    textAlign: 'center',
    marginTop: 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.padding,
  },
  successIcon: {
    fontSize: 72,
    marginBottom: 16,
  },
  successTitle: {
    fontWeight: '800',
    marginBottom: 12,
  },
  orderIdText: {
    fontWeight: '700',
    marginBottom: 6,
  },
  statusText: {
    fontStyle: 'italic',
  },
});

export default CheckoutScreen;
