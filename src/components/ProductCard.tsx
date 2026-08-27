import React, { memo } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { ProductItem } from '@services/productApi';
import { useTheme } from '@hooks/useTheme';
import { SPACING, BORDER_RADIUS } from '@constants/theme';
import { Typography, ShopButton } from '@components/ui';

export interface ProductCardProps {
  item: ProductItem;
  onOrder: (item: ProductItem) => void;
  disabled?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = memo(({
  item,
  onOrder,
  disabled = false,
}) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <Image
        source={{ uri: item.image }}
        style={styles.image}
        resizeMode="contain"
      />

      <View style={styles.info}>
        <Typography variant="bodyBold" numberOfLines={1} style={styles.name}>
          {item.name}
        </Typography>
        <Typography variant="price" color={colors.primary} style={styles.price}>
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
        style={styles.button}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.sm,
    padding: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
  },
  image: {
    width: 64,
    height: 64,
    borderRadius: BORDER_RADIUS.sm,
    backgroundColor: '#FFFFFF',
  },
  info: {
    flex: 1,
    marginLeft: SPACING.sm,
    marginRight: SPACING.xs,
  },
  name: {
    fontSize: 14,
    marginBottom: 2,
  },
  price: {
    fontSize: 15,
    marginBottom: 2,
  },
  button: {
    height: 36,
    paddingHorizontal: 16,
  },
});

export default ProductCard;
