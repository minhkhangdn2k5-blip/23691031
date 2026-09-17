import React from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector, useDispatch } from 'react-redux';
import { addItem, removeItem, clearCart } from '@store/redux/cartSlice';
import type { ReduxRootState } from '@store/redux/store';
import ShopButton from '@components/ShopButton';
import Typography from '@components/ui/Typography';
import { SIZES } from '@constants/theme';
import { useTheme } from '@hooks/useTheme';

/**
 * Màn hình Demo Redux Toolkit (Chương 6 - Bước 10)
 * Bắt buộc theo Đề cương 5.1.2 & 5.2.1-5.2.4 phục vụ chấm điểm và so sánh trực quan với Zustand
 */
export const ReduxCartDemoScreen: React.FC = () => {
  const { colors } = useTheme();
  const items = useSelector((state: ReduxRootState) => state.cartRedux.items);
  const dispatch = useDispatch();

  const handleAddDemoProduct = () => {
    dispatch(
      addItem({
        id: `DEMO-${Date.now()}`,
        name: 'Sản phẩm Test Redux Toolkit',
        price: 1500000,
        image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02560?w=500',
        category: 'Demo RTK',
      })
    );
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['bottom']}>
      <View style={styles.container}>
        <Typography variant="h1" color={colors.text} style={styles.title}>
          Redux Toolkit Demo
        </Typography>
        <Typography variant="body2" color={colors.textLight} style={styles.subtitle}>
          (Mô-đun học tập độc lập theo đề cương 5.1.2 & 5.2.1-5.2.4)
        </Typography>

        <View style={styles.actionRow}>
          <ShopButton
            title="+ Thêm mẫu (Dispatch RTK)"
            onPress={handleAddDemoProduct}
            style={styles.addBtn}
          />
          {items.length > 0 && (
            <TouchableOpacity
              onPress={() => dispatch(clearCart())}
              style={[styles.clearBtn, { borderColor: colors.error }]}
            >
              <Typography variant="small" color={colors.error} style={{ fontWeight: '700' }}>
                Xóa hết
              </Typography>
            </TouchableOpacity>
          )}
        </View>

        <Typography variant="h2" color={colors.text} style={styles.listHeading}>
          Danh sách trong Redux Store ({items.length}):
        </Typography>

        {items.length === 0 ? (
          <View style={styles.emptyBox}>
            <Typography variant="body1" color={colors.textLight}>
              Redux Store hiện đang trống. Hãy bấm nút Thêm mẫu ở trên!
            </Typography>
          </View>
        ) : (
          <FlatList
            data={items}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View
                style={[
                  styles.itemCard,
                  { backgroundColor: colors.surface, borderColor: colors.border },
                ]}
              >
                <View style={{ flex: 1 }}>
                  <Typography variant="body1" color={colors.text} style={{ fontWeight: '600' }}>
                    {item.name}
                  </Typography>
                  <Typography variant="body2" color={colors.primary}>
                    {item.price.toLocaleString('vi-VN')} đ × {item.quantity}
                  </Typography>
                </View>
                <TouchableOpacity
                  onPress={() => dispatch(removeItem(item.id))}
                  style={styles.removeBtn}
                >
                  <Typography variant="small" color={colors.error} style={{ fontWeight: '700' }}>
                    Xóa
                  </Typography>
                </TouchableOpacity>
              </View>
            )}
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
    marginBottom: 4,
  },
  subtitle: {
    marginBottom: 16,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 12,
  },
  addBtn: {
    flex: 1,
    height: 44,
  },
  clearBtn: {
    paddingHorizontal: 16,
    height: 44,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listHeading: {
    fontWeight: '700',
    marginBottom: 12,
  },
  emptyBox: {
    padding: 24,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#CCC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    marginBottom: 8,
  },
  removeBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
});

export default ReduxCartDemoScreen;
