import React, { memo } from 'react';
import {
  Pressable,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useTheme } from '@hooks/useTheme';
import { SPACING, BORDER_RADIUS } from '@constants/theme';
import Typography from './Typography';

export interface ShopButtonProps {
  title: string;
  onPress: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'outline';
  style?: ViewStyle;
  textStyle?: TextStyle;
}

/**
 * Atom Component: ShopButton
 * Nút bấm tiêu chuẩn hỗ trợ variant primary/outline, trạng thái loading xoay và khóa nút
 */
export const ShopButton: React.FC<ShopButtonProps> = memo(({
  title,
  onPress,
  isLoading = false,
  disabled = false,
  variant = 'primary',
  style,
  textStyle,
}) => {
  const { colors } = useTheme();

  const isPrimary = variant === 'primary';
  const isButtonDisabled = disabled || isLoading;

  const backgroundColor = isPrimary
    ? isButtonDisabled
      ? '#9CA3AF'
      : colors.primary
    : 'transparent';

  const borderColor = isPrimary
    ? isButtonDisabled
      ? '#9CA3AF'
      : colors.primary
    : colors.primary;

  const textColor = isPrimary
    ? '#FFFFFF'
    : isButtonDisabled
    ? '#9CA3AF'
    : colors.primary;

  return (
    <Pressable
      onPress={onPress}
      disabled={isButtonDisabled}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor,
          borderColor,
          borderWidth: 1.5,
          opacity: pressed ? 0.8 : 1,
        },
        style,
      ]}
    >
      {isLoading ? (
        <ActivityIndicator
          size="small"
          color={isPrimary ? '#FFFFFF' : colors.primary}
        />
      ) : (
        <Typography
          variant="bodyBold"
          color={textColor}
          style={textStyle}
        >
          {title}
        </Typography>
      )}
    </Pressable>
  );
});

const styles = StyleSheet.create({
  button: {
    height: 40,
    borderRadius: BORDER_RADIUS.full,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
  },
});

export default ShopButton;
