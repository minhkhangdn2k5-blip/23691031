import React, { memo } from 'react';
import { Text, TextProps, TextStyle, StyleSheet } from 'react-native';
import { FONTS, TypographyVariant } from '@constants/theme';
import { useTheme } from '@hooks/useTheme';

export interface TypographyProps extends TextProps {
  variant?: TypographyVariant;
  color?: string;
  children: React.ReactNode;
  style?: TextStyle | TextStyle[];
  center?: boolean;
}

/**
 * Atom Component: Typography
 * Bọc Text chuẩn của React Native, lấy kiểu chữ từ FONTS, hỗ trợ màu sắc và Dark Mode
 */
export const Typography: React.FC<TypographyProps> = memo(({
  variant = 'body',
  color,
  children,
  style,
  center = false,
  ...rest
}) => {
  const { colors } = useTheme();

  const fontStyle = FONTS[variant] || FONTS.body;
  const textColor = color || colors.text;

  return (
    <Text
      style={[
        fontStyle,
        { color: textColor },
        center && styles.center,
        style,
      ]}
      {...rest}
    >
      {children}
    </Text>
  );
});

const styles = StyleSheet.create({
  center: {
    textAlign: 'center',
  },
});

export default Typography;
