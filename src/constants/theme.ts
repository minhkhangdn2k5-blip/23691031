/**
 * ShopAI Design System Tokens (Chương 3 - Sprint 3)
 */

export const COLORS = {
  // Brand & Core Colors
  primary: '#FF4D4F',      // Đỏ ShopAI - nút chính, giá nổi bật, banner
  secondary: '#1890FF',    // Xanh dương - hành động phụ, liên kết
  background: '#F5F5F5',   // Nền màn sáng
  surface: '#FFFFFF',      // Nền thẻ card, modal, header
  card: '#FFFFFF',
  text: '#2C3E50',         // Màu chữ chính
  textLight: '#7F8C8D',    // Màu chữ phụ, placeholder
  border: '#E8E8E8',       // Viền thẻ, viền ô nhập
  error: '#FF0000',        // Báo lỗi đỏ
  success: '#52C41A',      // Báo thành công xanh lá
  warning: '#FAAD14',      // Cảnh báo vàng cam

  // Dark mode colors mapping
  dark: {
    primary: '#FF4D4F',    // Giữ nguyên primary nhận diện thương hiệu
    secondary: '#1890FF',
    background: '#121212', // Nền tối sâu OLED
    surface: '#1E1E1E',    // Nền card tối
    card: '#1E1E1E',
    text: '#F5F5F5',       // Chữ sáng trên nền tối
    textLight: '#9BA1A6',  // Chữ phụ tối
    border: '#2D2D2D',     // Viền tối
    error: '#FF4D4F',
    success: '#52C41A',
    warning: '#FAAD14',
  },
};

export const LIGHT_COLORS = {
  primary: COLORS.primary,
  secondary: COLORS.secondary,
  background: COLORS.background,
  surface: COLORS.surface,
  card: COLORS.surface,
  text: COLORS.text,
  textLight: COLORS.textLight,
  border: COLORS.border,
  error: COLORS.error,
  success: COLORS.success,
  warning: COLORS.warning,
};

export const DARK_COLORS = {
  primary: COLORS.dark.primary,
  secondary: COLORS.dark.secondary,
  background: COLORS.dark.background,
  surface: COLORS.dark.surface,
  card: COLORS.dark.card,
  text: COLORS.dark.text,
  textLight: COLORS.dark.textLight,
  border: COLORS.dark.border,
  error: COLORS.dark.error,
  success: COLORS.dark.success,
  warning: COLORS.dark.warning,
};

export type ThemeColors = typeof LIGHT_COLORS;

export const SIZES = {
  base: 8,
  font: 14,
  radius: 12,
  padding: 16,
  h1: 24,
  h2: 20,
  h3: 18,
  body1: 16,
  body2: 14,
  small: 12,
  // Thang đo bổ sung tương thích
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
  radiusSm: 6,
  radiusMd: 10,
  radiusLg: 14,
  radiusFull: 9999,
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
};

export const BORDER_RADIUS = {
  sm: 6,
  md: 10,
  lg: 12,
  xl: 16,
  full: 9999,
};

/**
 * Map variant chữ → fontSize / fontWeight (dùng cho Typography atom)
 */
export const FONTS = {
  h1: { fontSize: SIZES.h1, fontWeight: '700' as const, lineHeight: 30 },
  h2: { fontSize: SIZES.h2, fontWeight: '700' as const, lineHeight: 26 },
  h3: { fontSize: SIZES.h3, fontWeight: '600' as const, lineHeight: 22 },
  body1: { fontSize: SIZES.body1, fontWeight: '400' as const, lineHeight: 22 },
  body2: { fontSize: SIZES.body2, fontWeight: '400' as const, lineHeight: 20 },
  small: { fontSize: SIZES.small, fontWeight: '400' as const, lineHeight: 16 },
  // Biến thể tương thích mở rộng
  body: { fontSize: 14, fontWeight: '400' as const, lineHeight: 20 },
  bodyBold: { fontSize: 14, fontWeight: '700' as const, lineHeight: 20 },
  caption: { fontSize: 12, fontWeight: '400' as const, lineHeight: 16 },
  price: { fontSize: 16, fontWeight: '800' as const, lineHeight: 22 },
};

export const TYPOGRAPHY = FONTS;
export type TypographyVariant = keyof typeof FONTS;
