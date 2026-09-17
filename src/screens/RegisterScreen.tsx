import React, { useState } from 'react';
import { StyleSheet, Pressable, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ShopButton from '@components/ShopButton';
import ShopInput from '@components/ui/ShopInput';
import Typography from '@components/ui/Typography';
import { SIZES } from '@constants/theme';
import { useTheme } from '@hooks/useTheme';
import { useAuthStore } from '@store/useAuthStore';

interface RegisterScreenProps {
  onRegistered?: (token: string) => void;
  onGoLogin?: () => void;
}

/**
 * Màn hình Đăng ký (Chương 5 & Chương 6 - Bước 6)
 * Kết nối trực tiếp với useAuthStore, xóa bỏ hoàn toàn Prop Drilling
 */
export const RegisterScreen: React.FC<RegisterScreenProps> = ({ onRegistered, onGoLogin }) => {
  const navigation = useNavigation<any>();
  const storeLogin = useAuthStore((state) => state.login);
  const handleSuccess = onRegistered || storeLogin;
  const goToLogin = onGoLogin || (() => navigation.navigate('Login'));

  const { colors } = useTheme();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirm?: string;
  }>({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const next: typeof errors = {};
    if (name.trim().length < 2) {
      next.name = 'Họ tên phải có tối thiểu 2 ký tự';
    }
    if (!email.includes('@')) {
      next.email = 'Email không hợp lệ (phải chứa @)';
    }
    if (password.length < 6) {
      next.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }
    if (confirm !== password) {
      next.confirm = 'Xác nhận mật khẩu không khớp';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleRegister = () => {
    if (!validate()) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      handleSuccess('shopai_token_' + Date.now());
    }, 800);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={[styles.safe, { backgroundColor: colors.background }]}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Typography variant="h1" color={colors.primary} style={styles.title}>
          Tạo tài khoản
        </Typography>
        <Typography variant="body1" color={colors.textLight} style={styles.subtitle}>
          Đăng ký để khám phá công nghệ tại ShopAI
        </Typography>

        <ShopInput
          label="Họ và tên"
          placeholder="Nguyễn Minh Khang"
          value={name}
          onChangeText={setName}
          error={errors.name}
        />

        <ShopInput
          label="Email"
          placeholder="khang@shopai.vn"
          value={email}
          onChangeText={setEmail}
          error={errors.email}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <ShopInput
          label="Mật khẩu"
          placeholder="Tối thiểu 6 ký tự"
          value={password}
          onChangeText={setPassword}
          error={errors.password}
          secureTextEntry
        />

        <ShopInput
          label="Xác nhận mật khẩu"
          placeholder="Nhập lại mật khẩu vừa tạo"
          value={confirm}
          onChangeText={setConfirm}
          error={errors.confirm}
          secureTextEntry
        />

        <ShopButton
          title={loading ? 'Đang tạo tài khoản...' : 'Đăng ký ngay'}
          onPress={handleRegister}
          style={styles.submitBtn}
        />

        {/* Chuyển hướng về lại màn Đăng nhập */}
        <Pressable onPress={onGoLogin} style={styles.loginLink}>
          <Typography variant="body2" color={colors.textLight}>
            Đã có tài khoản?{' '}
            <Typography variant="body2" color={colors.primary} style={{ fontWeight: '700' }}>
              Đăng nhập
            </Typography>
          </Typography>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: SIZES.padding,
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 28,
  },
  submitBtn: {
    marginTop: 12,
  },
  loginLink: {
    marginTop: 20,
    alignItems: 'center',
  },
});

export default RegisterScreen;
