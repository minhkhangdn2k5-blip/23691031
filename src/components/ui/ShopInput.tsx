import React, { memo } from 'react';
import {
  View,
  TextInput,
  TextInputProps,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { useTheme } from '@hooks/useTheme';
import { SPACING, BORDER_RADIUS } from '@constants/theme';
import Typography from './Typography';

export interface ShopInputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
}

/**
 * Atom Component: ShopInput
 * Quản lý ô nhập văn bản (controlled), hỗ trợ label và hiển thị đổi viền khi có lỗi
 */
export const ShopInput: React.FC<ShopInputProps> = memo(({
  label,
  error,
  containerStyle,
  value,
  onChangeText,
  placeholder,
  ...rest
}) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, containerStyle]}>
      {label ? (
        <Typography
          variant="caption"
          color={error ? colors.error : colors.textLight}
          style={styles.label}
        >
          {label}
        </Typography>
      ) : null}

      <View
        style={[
          styles.inputWrapper,
          {
            backgroundColor: colors.surface,
            borderColor: error ? colors.error : colors.border,
          },
        ]}
      >
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.textLight}
          style={[
            styles.input,
            {
              color: colors.text,
            },
          ]}
          {...rest}
        />
      </View>

      {error ? (
        <Typography variant="caption" color={colors.error} style={styles.errorText}>
          {error}
        </Typography>
      ) : null}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.sm,
  },
  label: {
    marginBottom: SPACING.xs,
    fontWeight: '600',
  },
  inputWrapper: {
    borderWidth: 1.5,
    borderRadius: BORDER_RADIUS.full,
    paddingHorizontal: SPACING.md,
    height: 44,
    justifyContent: 'center',
  },
  input: {
    fontSize: 14,
    paddingVertical: 0,
  },
  errorText: {
    marginTop: 4,
  },
});

export default ShopInput;
