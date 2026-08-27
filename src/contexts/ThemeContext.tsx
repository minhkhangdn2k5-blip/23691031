import React, { createContext, useState, useCallback, useMemo, ReactNode } from 'react';
import { LIGHT_COLORS, DARK_COLORS, ThemeColors } from '@constants/theme';

export type ThemeMode = 'light' | 'dark';

export type ThemeContextType = {
  theme: ThemeMode;
  isDark: boolean;
  colors: ThemeColors;
  toggleTheme: () => void;
  setTheme: (mode: ThemeMode) => void;
};

// 1. Tạo Context với giá trị mặc định là undefined
export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// 2. Component Provider bọc ngoài ứng dụng để chia sẻ Theme cho toàn bộ cây Component
export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeMode>('light');

  const isDark = theme === 'dark';
  const colors = isDark ? DARK_COLORS : LIGHT_COLORS;

  // Hàm chuyển đổi qua lại giữa Sáng và Tối
  const toggleTheme = useCallback(() => {
    setThemeState(prev => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  // Hàm đặt trực tiếp một chế độ
  const setTheme = useCallback((mode: ThemeMode) => {
    setThemeState(mode);
  }, []);

  // Tối ưu Re-render bằng useMemo: Chỉ tạo lại value object khi theme thay đổi
  const value = useMemo(
    () => ({
      theme,
      isDark,
      colors,
      toggleTheme,
      setTheme,
    }),
    [theme, isDark, colors, toggleTheme, setTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};
