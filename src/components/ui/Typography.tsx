import React, { memo } from 'react';
import { Text, TextStyle, StyleProp, StyleSheet } from 'react-native';
import { COLORS, FONTS, TypographyVariant } from '@constants/theme';
import { useTheme } from '@hooks/useTheme';

export interface TypographyProps {
  children: React.ReactNode;
  variant?: TypographyVariant;
  color?: string;
  style?: StyleProp<TextStyle>;
  numberOfLines?: number;
  center?: boolean;
}

/**
 * Atom Component: Typography (Chương 3 - Sprint 3)
 * Hiển thị chữ chuẩn mực theo hệ thống Design System FONTS
 */
export const Typography: React.FC<TypographyProps> = memo(({
  children,
  variant = 'body1',
  color,
  style,
  numberOfLines,
  center = false,
}) => {
  const { colors } = useTheme();
  const fontStyle = FONTS[variant] || FONTS.body1;
  const textColor = color || colors.text || COLORS.text;

  return (
    <Text
      numberOfLines={numberOfLines}
      style={[
        fontStyle,
        { color: textColor },
        center && styles.center,
        style,
      ]}
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
