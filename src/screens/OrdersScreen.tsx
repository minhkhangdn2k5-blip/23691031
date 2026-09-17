import React from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useOrderStore } from '@store/useOrderStore';
import Typography from '@components/ui/Typography';
import { SIZES } from '@constants/theme';
import { useTheme } from '@hooks/useTheme';

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);

/**
 * Màn hình Lịch sử Đơn hàng (Chương 6 - Bước 9.6)
 * Hiển thị danh sách các hóa đơn từ useOrderStore
 */
export const OrdersScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { colors } = useTheme();
  const orders = useOrderStore((state) => state.orders);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <Typography variant="h2" color={colors.text} style={styles.headerTitle}>
          Đơn hàng của tôi ({orders.length})
        </Typography>
      </View>

      {orders.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Typography variant="h1" style={styles.emptyIcon}>
            📋
          </Typography>
          <Typography variant="h2" color={colors.text} style={styles.emptyTitle}>
            Bạn chưa có đơn hàng nào
          </Typography>
          <Typography variant="body1" color={colors.textLight} style={styles.emptySubtitle}>
            Các đơn hàng sau khi thanh toán sẽ được lưu tại đây.
          </Typography>
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            const isPaid = item.status === 'PAID';
            return (
              <TouchableOpacity
                style={[
                  styles.orderCard,
                  { backgroundColor: colors.surface, borderColor: colors.border },
                ]}
                onPress={() => navigation.navigate('OrderDetail', { orderId: item.id })}
                activeOpacity={0.8}
              >
                <View style={styles.cardHeader}>
                  <Typography variant="body1" color={colors.text} style={styles.orderId}>
                    {item.id}
                  </Typography>
                  <View
                    style={[
                      styles.statusBadge,
                      { backgroundColor: isPaid ? '#E8F8EE' : '#FFF3E0' },
                    ]}
                  >
                    <Typography
                      variant="small"
                      color={isPaid ? '#2E7D32' : '#E65100'}
                      style={{ fontWeight: '700' }}
                    >
                      {item.status}
                    </Typography>
                  </View>
                </View>

                <Typography variant="small" color={colors.textLight} style={styles.dateText}>
                  {new Date(item.createdAt).toLocaleString('vi-VN')}
                </Typography>

                <View style={styles.cardFooter}>
                  <Typography variant="body2" color={colors.textLight}>
                    {item.items.reduce((s, i) => s + i.quantity, 0)} sản phẩm
                  </Typography>
                  <Typography variant="h2" color={colors.primary} style={styles.totalText}>
                    {formatCurrency(item.total)}
                  </Typography>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      )}
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
  },
  orderCard: {
    padding: 16,
    borderRadius: SIZES.radius,
    marginBottom: 12,
    borderWidth: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  orderId: {
    fontWeight: '800',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  dateText: {
    marginBottom: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  totalText: {
    fontWeight: '800',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.padding * 1.5,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontWeight: '800',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    textAlign: 'center',
  },
});

export default OrdersScreen;
