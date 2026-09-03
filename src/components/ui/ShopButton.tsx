import React, { memo } from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import Typography from './Typography';
import { COLORS, SIZES } from '@constants/theme';
import { useTheme } from '@hooks/useTheme';

export interface ShopButtonProps {
  title: string;
  onPress: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'outline';
  style?: ViewStyle;
  textStyle?: TextStyle;
  accessibilityLabel?: string;
}

/**
 * Atom Component: ShopButton (Chương 3 - Sprint 3)
 * Nút bấm chuẩn mực hỗ trợ các biến thể primary, secondary, outline, loading và khóa nút
 */
export const ShopButton: React.FC<ShopButtonProps> = memo(({
  title,
  onPress,
  isLoading = false,
  disabled = false,
  variant = 'primary',
  style,
  textStyle,
  accessibilityLabel,
}) => {
  const { colors } = useTheme();

  const variantStyles = {
    primary: {
      backgroundColor: colors.primary || COLORS.primary,
      borderColor: colors.primary || COLORS.primary,
    },
    secondary: {
      backgroundColor: colors.secondary || COLORS.secondary,
      borderColor: colors.secondary || COLORS.secondary,
    },
    outline: {
      backgroundColor: 'transparent',
      borderWidth: 1.5,
      borderColor: colors.primary || COLORS.primary,
    },
  };

  const currentVariantStyle = variantStyles[variant] || variantStyles.primary;

  const textColor =
    variant === 'outline'
      ? colors.primary || COLORS.primary
      : '#FFFFFF';

  return (
    <TouchableOpacity
      style={[
        styles.button,
        currentVariantStyle,
        disabled && styles.disabledButton,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || isLoading}
      activeOpacity={0.8}
      accessibilityLabel={accessibilityLabel ?? title}
      accessibilityRole="button"
    >
      {isLoading ? (
        <ActivityIndicator
          size="small"
          color={textColor}
        />
      ) : (
        <Typography
          variant="body1"
          color={textColor}
          style={[{ fontWeight: '600' }, textStyle]}
        >
          {title}
        </Typography>
      )}
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  button: {
    height: 48,
    borderRadius: SIZES.radius,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SIZES.padding,
    width: '100%',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  disabledButton: {
    backgroundColor: '#D1D5DB',
    borderColor: '#D1D5DB',
    shadowOpacity: 0,
    elevation: 0,
  },
});

export default ShopButton;
