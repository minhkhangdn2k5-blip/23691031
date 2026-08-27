import React from 'react';
import { Text, TextProps, StyleSheet, StyleProp, TextStyle } from 'react-native';
import { TYPOGRAPHY } from '@constants/theme';
import { useTheme } from '@hooks/useTheme';

export type TextVariant =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'body'
  | 'bodyBold'
  | 'caption'
  | 'price';

export interface AppTextProps extends TextProps {
  variant?: TextVariant;
  color?: string;
  style?: StyleProp<TextStyle>;
  children?: React.ReactNode;
}

/**
 * Linh kiện Typography chuẩn hóa cho ShopAI
 * Tự động tính toán kích thước font và chuyển đổi màu sắc theo Dark/Light Mode
 */
export const AppText: React.FC<AppTextProps> = ({
  variant = 'body',
  color,
  style,
  children,
  ...rest
}) => {
  const { colors } = useTheme();

  // Xác định màu mặc định theo từng loại chữ
  const getDefaultColor = () => {
    if (color) return color;
    switch (variant) {
      case 'price':
        return colors.primary;
      case 'caption':
        return colors.textSecondary;
      default:
        return colors.text;
    }
  };

  return (
    <Text
      style={[
        TYPOGRAPHY[variant],
        { color: getDefaultColor() },
        style,
      ]}
      {...rest}
    >
      {children}
    </Text>
  );
};

export default AppText;
