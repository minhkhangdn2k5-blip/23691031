import React from 'react';
import {
  Pressable,
  Text,
  ActivityIndicator,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextStyle,
  GestureResponderEvent,
} from 'react-native';
import { BORDER_RADIUS, SPACING } from '@constants/theme';
import { useTheme } from '@hooks/useTheme';

export type ButtonVariant = 'primary' | 'outline' | 'secondary' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface AppButtonProps {
  title: string;
  onPress: (event: GestureResponderEvent) => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  icon?: React.ReactNode;
  accessibilityLabel?: string;
}

/**
 * Linh kiện Nút bấm chuẩn hóa (ShopButton) cho ShopAI
 * Hỗ trợ các biến thể màu sắc, kích thước, hiệu ứng xoay khi tải và vô hiệu hóa
 */
export const AppButton: React.FC<AppButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  style,
  textStyle,
  icon,
  accessibilityLabel,
}) => {
  const { colors, isDark } = useTheme();

  // Xác định chiều cao và padding theo size
  const getSizeStyle = () => {
    switch (size) {
      case 'sm':
        return { paddingVertical: 8, paddingHorizontal: 14, height: 38 };
      case 'lg':
        return { paddingVertical: 14, paddingHorizontal: 24, height: 52 };
      default:
        return { paddingVertical: 12, paddingHorizontal: 18, height: 46 };
    }
  };

  // Xác định màu nền và màu viền theo variant
  const getVariantStyle = (): ViewStyle => {
    switch (variant) {
      case 'outline':
        return {
          backgroundColor: 'transparent',
          borderWidth: 1.5,
          borderColor: colors.primary,
        };
      case 'secondary':
        return {
          backgroundColor: isDark ? '#2C2C2C' : '#F0F0F0',
          borderWidth: 1,
          borderColor: colors.border,
        };
      case 'danger':
        return {
          backgroundColor: '#FF4D4F',
        };
      default: // primary
        return {
          backgroundColor: colors.primary,
        };
    }
  };

  // Xác định màu chữ
  const getTextColor = () => {
    if (variant === 'outline') return colors.primary;
    if (variant === 'secondary') return colors.text;
    return '#FFFFFF';
  };

  const isDisabled = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || title}
      style={({ pressed }) => [
        styles.buttonBase,
        getSizeStyle(),
        getVariantStyle(),
        isDisabled && styles.disabled,
        pressed && !isDisabled && styles.pressed,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'outline' ? colors.primary : '#FFFFFF'}
        />
      ) : (
        <>
          {icon && <>{icon}</>}
          <Text
            style={[
              styles.textBase,
              { color: getTextColor(), fontSize: size === 'sm' ? 14 : 16 },
              textStyle,
            ]}
          >
            {title}
          </Text>
        </>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  buttonBase: {
    borderRadius: BORDER_RADIUS.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
  },
  textBase: {
    fontWeight: '700',
    textAlign: 'center',
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  disabled: {
    opacity: 0.5,
  },
});

export default AppButton;
