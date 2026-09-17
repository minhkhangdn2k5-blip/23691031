import React, { memo } from 'react';
import {
  Modal,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Pressable,
} from 'react-native';
import Typography from '@components/ui/Typography';
import ShopButton from '@components/ShopButton';
import { COLORS, SIZES } from '@constants/theme';
import { useTheme } from '@hooks/useTheme';

export interface PriceRangeOption {
  id: string;
  label: string;
  min: number;
  max: number;
}

export const CATEGORIES = [
  'Tất cả',
  'Âm thanh',
  'Điện thoại',
  'Gaming',
  'Phụ kiện',
  'Máy tính',
  'Gia dụng',
];

export const PRICE_RANGES: PriceRangeOption[] = [
  { id: 'all', label: 'Tất cả mức giá', min: 0, max: Infinity },
  { id: 'under_2m', label: 'Dưới 2 triệu', min: 0, max: 2000000 },
  { id: '2m_to_10m', label: 'Từ 2 - 10 triệu', min: 2000000, max: 10000000 },
  { id: 'above_10m', label: 'Trên 10 triệu', min: 10000000, max: Infinity },
];

export interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  selectedCategories: string[];
  onToggleCategory: (category: string) => void;
  selectedPriceRange: string;
  onSelectPriceRange: (rangeId: string) => void;
  onReset: () => void;
}

/**
 * Component FilterModal: Bộ lọc sản phẩm nâng cao (Chương 4 - Sprint 4 Tiêu chí 8)
 * Hỗ trợ ĐA CHỌN danh mục (ví dụ: Điện thoại + Gaming) và khoảng giá
 */
export const FilterModal: React.FC<FilterModalProps> = memo(({
  visible,
  onClose,
  selectedCategories,
  onToggleCategory,
  selectedPriceRange,
  onSelectPriceRange,
  onReset,
}) => {
  const { colors } = useTheme();

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable
          style={[styles.bottomSheet, { backgroundColor: colors.surface }]}
          onPress={e => e.stopPropagation()}
        >
          {/* Thanh gạt nhỏ ở đầu Bottom Sheet */}
          <View style={styles.handleBar} />

          {/* Tiêu đề & Nút đóng */}
          <View style={styles.header}>
            <Typography variant="h3" color={colors.text} style={{ fontWeight: '700' }}>
              Bộ lọc nâng cao
            </Typography>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.7}>
              <Typography variant="h3" color={colors.textLight}>✕</Typography>
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollContent}>
            {/* 1. Lọc theo Danh mục (Hỗ trợ đa chọn) */}
            <View style={styles.sectionHeader}>
              <Typography variant="body1" color={colors.text} style={styles.sectionTitle}>
                Danh mục sản phẩm
              </Typography>
              {selectedCategories.length > 0 && !selectedCategories.includes('Tất cả') && (
                <Typography variant="small" color={colors.primary} style={{ fontWeight: '600' }}>
                  ({selectedCategories.length} đã chọn)
                </Typography>
              )}
            </View>

            <View style={styles.chipContainer}>
              {CATEGORIES.map(category => {
                const isSelected =
                  category === 'Tất cả'
                    ? selectedCategories.length === 0 || selectedCategories.includes('Tất cả')
                    : selectedCategories.includes(category);

                return (
                  <TouchableOpacity
                    key={category}
                    style={[
                      styles.chip,
                      {
                        backgroundColor: isSelected ? colors.primary : colors.background,
                        borderColor: isSelected ? colors.primary : colors.border,
                      },
                    ]}
                    onPress={() => onToggleCategory(category)}
                    activeOpacity={0.8}
                  >
                    <Typography
                      variant="body2"
                      color={isSelected ? '#FFFFFF' : colors.text}
                      style={isSelected ? { fontWeight: '700' } : undefined}
                    >
                      {isSelected && category !== 'Tất cả' ? `✓ ${category}` : category}
                    </Typography>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* 2. Lọc theo Khoảng giá */}
            <Typography variant="body1" color={colors.text} style={styles.sectionTitle}>
              Khoảng giá
            </Typography>
            <View style={styles.chipContainer}>
              {PRICE_RANGES.map(range => {
                const isSelected = selectedPriceRange === range.id;
                return (
                  <TouchableOpacity
                    key={range.id}
                    style={[
                      styles.chip,
                      {
                        backgroundColor: isSelected ? colors.primary : colors.background,
                        borderColor: isSelected ? colors.primary : colors.border,
                      },
                    ]}
                    onPress={() => onSelectPriceRange(range.id)}
                    activeOpacity={0.8}
                  >
                    <Typography
                      variant="body2"
                      color={isSelected ? '#FFFFFF' : colors.text}
                      style={isSelected ? { fontWeight: '700' } : undefined}
                    >
                      {range.label}
                    </Typography>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>

          {/* Nút hành động */}
          <View style={[styles.footer, { borderTopColor: colors.border }]}>
            <ShopButton
              title="Đặt lại"
              onPress={onReset}
              variant="outline"
              style={styles.actionBtn}
            />
            <View style={{ width: 12 }} />
            <ShopButton
              title="Áp dụng"
              onPress={onClose}
              variant="primary"
              style={styles.actionBtn}
            />
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
});

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  bottomSheet: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 12,
    paddingHorizontal: SIZES.padding,
    paddingBottom: 24,
    maxHeight: '75%',
  },
  handleBar: {
    width: 40,
    height: 4,
    backgroundColor: '#CCCCCC',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  closeBtn: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  sectionTitle: {
    fontWeight: '700',
    marginTop: 10,
    marginBottom: 10,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  footer: {
    flexDirection: 'row',
    paddingTop: 12,
    borderTopWidth: 1,
  },
  actionBtn: {
    flex: 1,
    height: 44,
  },
});

export default FilterModal;
