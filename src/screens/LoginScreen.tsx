import React, { useState } from 'react';
import { View, StyleSheet, Pressable, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ShopButton from '@components/ShopButton';
import ShopInput from '@components/ui/ShopInput';
import Typography from '@components/ui/Typography';
import { SIZES } from '@constants/theme';
import { useTheme } from '@hooks/useTheme';
import { useAuthStore } from '@store/useAuthStore';

interface LoginScreenProps {
  onLogin?: (token: string) => void;
  onGoRegister?: () => void;
}

/**
 * Màn hình Đăng nhập (Chương 5 & Chương 6 - Bước 6)
 * Kết nối trực tiếp với useAuthStore, xóa bỏ hoàn toàn Prop Drilling
 */
export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, onGoRegister }) => {
  const navigation = useNavigation<any>();
  const storeLogin = useAuthStore((state) => state.login);
  const handleSuccess = onLogin || storeLogin;
  const goToRegister = onGoRegister || (() => navigation.navigate('Register'));

  const { colors } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [loading, setLoading] = useState(false);

  // Kiểm tra tính hợp lệ của thông tin đăng nhập
  const validate = () => {
    const next: { email?: string; password?: string } = {};
    if (!email.includes('@')) {
      next.email = 'Email không hợp lệ (phải chứa ký tự @)';
    }
    if (password.length < 6) {
      next.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleLogin = () => {
    if (!validate()) return;
    setLoading(true);
    // Giả lập độ trễ mạng xác thực người dùng
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
          ShopAI
        </Typography>
        <Typography variant="body1" color={colors.textLight} style={styles.subtitle}>
          Vui lòng đăng nhập để tiếp tục
        </Typography>

        <ShopInput
          label="Email"
          placeholder="admin@shopai.vn"
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

        <ShopButton
          title={loading ? 'Đang xác thực...' : 'Đăng nhập ngay'}
          onPress={handleLogin}
          style={styles.loginBtn}
        />

        {/* Chuyển hướng sang màn Đăng ký */}
        <Pressable onPress={onGoRegister} style={styles.registerLink}>
          <Typography variant="body2" color={colors.textLight}>
            Chưa có tài khoản?{' '}
            <Typography variant="body2" color={colors.primary} style={{ fontWeight: '700' }}>
              Đăng ký ngay
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
    fontSize: 38,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 32,
  },
  loginBtn: {
    marginTop: 12,
  },
  registerLink: {
    marginTop: 24,
    alignItems: 'center',
  },
});

export default LoginScreen;
