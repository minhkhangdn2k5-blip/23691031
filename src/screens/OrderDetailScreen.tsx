import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RouteProp, useRoute } from '@react-navigation/native';
import ShopButton from '@components/ShopButton';
import Typography from '@components/ui/Typography';
import { useOrderStore } from '@store/useOrderStore';
import { SIZES } from '@constants/theme';
import { useTheme } from '@hooks/useTheme';

type OrderDetailRouteProp = RouteProp<{ OrderDetail: { orderId: string } }, 'OrderDetail'>;

const formatCurrency = (v: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(v);

/**
 * Màn hình Chi tiết Hóa đơn (Chương 6 - Bước 9.6)
 * Hỗ trợ chuyển đổi trạng thái giả lập từ PENDING -> PAID
 */
export const OrderDetailScreen: React.FC = () => {
  const { colors } = useTheme();
  const route = useRoute<OrderDetailRouteProp>();
  const { orderId } = route.params;

  const order = useOrderStore((s) => s.getById(orderId));
  const markPaid = useOrderStore((s) => s.markPaid);

  if (!order) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
        <View style={styles.centerContainer}>
          <Typography variant="h2" color={colors.error}>
            Không tìm thấy đơn hàng {orderId}
          </Typography>
        </View>
      </SafeAreaView>
    );
  }

  const isPaid = order.status === 'PAID';

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Thông tin hóa đơn */}
        <Typography variant="h1" color={colors.text} style={styles.heading}>
          Chi tiết Hóa đơn
        </Typography>

        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.infoRow}>
            <Typography variant="body1" color={colors.textLight}>
              Mã hóa đơn:
            </Typography>
            <Typography variant="body1" color={colors.text} style={{ fontWeight: '700' }}>
              {order.id}
            </Typography>
          </View>

          <View style={styles.infoRow}>
            <Typography variant="body1" color={colors.textLight}>
              Ngày tạo:
            </Typography>
            <Typography variant="body2" color={colors.text}>
              {new Date(order.createdAt).toLocaleString('vi-VN')}
            </Typography>
          </View>

          <View style={styles.infoRow}>
            <Typography variant="body1" color={colors.textLight}>
              Trạng thái:
            </Typography>
            <View
              style={[
                styles.badge,
                { backgroundColor: isPaid ? '#E8F8EE' : '#FFF3E0' },
              ]}
            >
              <Typography
                variant="small"
                color={isPaid ? '#2E7D32' : '#E65100'}
                style={{ fontWeight: '800' }}
              >
                {order.status}
              </Typography>
            </View>
          </View>
        </View>

        {/* Danh sách mặt hàng */}
        <Typography variant="h2" color={colors.text} style={styles.sectionTitle}>
          Danh sách mặt hàng
        </Typography>

        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          {order.items.map((it) => (
            <View key={it.id} style={styles.itemRow}>
              <Typography variant="body1" color={colors.text} style={{ flex: 1, fontWeight: '500' }}>
                {it.name} × {it.quantity}
              </Typography>
              <Typography variant="body1" color={colors.primary} style={{ fontWeight: '700' }}>
                {formatCurrency(it.price * it.quantity)}
              </Typography>
            </View>
          ))}

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <View style={styles.totalRow}>
            <Typography variant="h2" color={colors.text}>
              Tổng tiền:
            </Typography>
            <Typography variant="h1" color={colors.primary} style={{ fontWeight: '900' }}>
              {formatCurrency(order.total)}
            </Typography>
          </View>
        </View>

        {/* Nút hành động thanh toán */}
        {order.status === 'PENDING' ? (
          <ShopButton
            title="Thanh toán giả lập (→ Chuyển sang PAID)"
            onPress={() => markPaid(order.id)}
            style={styles.payBtn}
          />
        ) : (
          <View style={styles.paidContainer}>
            <Typography variant="h2" style={{ color: '#2E7D32', textAlign: 'center', fontWeight: '800' }}>
              ✓ Đã thanh toán thành công
            </Typography>
          </View>
        )}
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
  heading: {
    fontWeight: '800',
    marginBottom: 16,
  },
  sectionTitle: {
    fontWeight: '700',
    marginTop: 20,
    marginBottom: 12,
  },
  card: {
    padding: 16,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  divider: {
    height: 1,
    marginVertical: 10,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
  },
  payBtn: {
    marginTop: 28,
    height: 50,
  },
  paidContainer: {
    marginTop: 28,
    padding: 16,
    backgroundColor: '#E8F8EE',
    borderRadius: SIZES.radius,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.padding,
  },
});

export default OrderDetailScreen;
