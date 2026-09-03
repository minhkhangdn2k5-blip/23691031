import React, { memo } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TextInputProps,
  ViewStyle,
} from 'react-native';
import Typography from './Typography';
import { COLORS, SIZES } from '@constants/theme';
import { useTheme } from '@hooks/useTheme';

export interface ShopInputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
}

/**
 * Atom Component: ShopInput (Chương 3 - Sprint 3)
 * Ô nhập văn bản kế thừa TextInput, hỗ trợ label, báo lỗi và tương thích Dark Mode
 */
export const ShopInput: React.FC<ShopInputProps> = memo(({
  label,
  error,
  containerStyle,
  style,
  ...rest
}) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.wrap, containerStyle]}>
      {label ? (
        <Typography
          variant="body2"
          color={error ? colors.error : colors.textLight}
          style={styles.label}
        >
          {label}
        </Typography>
      ) : null}

      <TextInput
        placeholderTextColor={colors.textLight || COLORS.textLight}
        style={[
          styles.input,
          {
            backgroundColor: colors.surface || COLORS.surface,
            borderColor: error ? colors.error : colors.border || COLORS.border,
            color: colors.text || COLORS.text,
          },
          error ? styles.inputError : null,
          style,
        ]}
        {...rest}
      />

      {error ? (
        <Typography variant="small" color={colors.error || COLORS.error} style={styles.error}>
          {error}
        </Typography>
      ) : null}
    </View>
  );
});

const styles = StyleSheet.create({
  wrap: {
    marginBottom: SIZES.padding,
  },
  label: {
    marginBottom: 6,
    fontWeight: '500',
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderRadius: SIZES.radius,
    paddingHorizontal: SIZES.padding,
    fontSize: SIZES.body1,
  },
  inputError: {
    borderColor: COLORS.error,
  },
  error: {
    marginTop: 4,
  },
});

export default ShopInput;
