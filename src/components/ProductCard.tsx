import React, { useEffect } from 'react';
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { COLORS, SIZES } from '@constants/theme';
import ShopButton from '@components/ShopButton';
import { Product } from '@data/mockProducts';

const { width } = Dimensions.get('window');
const GAP = 12;
const CARD_WIDTH = (width - GAP * 3) / 2;

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 400 });
  }, [opacity]);

  const fadeInStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  return (
    <Animated.View style={[styles.card, fadeInStyle]}>
      <Image
        source={{ uri: product.image }}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.infoContainer}>
        <Text style={styles.name} numberOfLines={2}>
          {product.name}
        </Text>
        <Text style={styles.price}>
          {`${product.price.toLocaleString('vi-VN')} đ`}
        </Text>
        <ShopButton
          title="Mua ngay"
          onPress={() => {}}
          style={styles.button}
          textStyle={styles.buttonText}
        />
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    marginHorizontal: GAP / 2,
    marginBottom: GAP,
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  image: {
    width: '100%',
    height: CARD_WIDTH,
    backgroundColor: '#F0F0F0',
  },
  infoContainer: {
    padding: 10,
  },
  name: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.text,
    height: 36,
    lineHeight: 18,
  },
  price: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.primary,
    marginTop: 6,
    marginBottom: 8,
  },
  button: {
    height: 34,
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 12,
    fontWeight: '700',
  },
});

export default ProductCard;
