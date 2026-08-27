import { useContext } from 'react';
import { ThemeContext, ThemeContextType } from '@contexts/ThemeContext';

/**
 * Custom Hook useTheme
 * Giúp mọi Component trong ứng dụng lấy bảng màu colors, isDark và hàm toggleTheme()
 * một cách nhanh chóng mà không cần gọi useContext(ThemeContext) lặp lại.
 */
export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('Lỗi: useTheme phải được sử dụng bên trong <ThemeProvider>');
  }
  return context;
}

export default useTheme;
