/**
 * Hệ thống Theme Tokens cho ứng dụng CampusMart
 * Tuân thủ chính xác 100% bảng màu và quy định phòng thi
 */

export const COLORS = {
  // Light mode colors
  primary: '#0F766E',        // Nút chính, chữ CAMPUSMART, chip đang chọn, giá
  secondary: '#F59E0B',      // Chữ Flash
  background: '#F0FDFA',     // Nền màn sáng
  surface: '#FFFFFF',        // Card, ô tìm, Modal
  card: '#FFFFFF',           // Card item
  text: '#134E4A',           // Chữ thường
  textLight: '#5F7A77',      // Chữ phụ, placeholder
  border: '#CCFBF1',         // Viền
  error: '#DC2626',          // Báo lỗi
  success: '#16A34A',        // Thành công

  // Dark mode colors
  dark: {
    primary: '#0F766E',      // Không đổi primary
    secondary: '#F59E0B',
    background: '#042F2E',   // Nền màn tối
    surface: '#0B4F4A',      // Card, ô tìm, Modal tối
    card: '#0B4F4A',
    text: '#F0FDFA',         // Chữ sáng
    textLight: '#A7F3D0',    // Chữ phụ tối
    border: '#115E59',       // Viền tối
    error: '#DC2626',
    success: '#16A34A',
  },
};

export const LIGHT_COLORS = {
  primary: '#0F766E',
  secondary: '#F59E0B',
  background: '#F0FDFA',
  surface: '#FFFFFF',
  card: '#FFFFFF',
  text: '#134E4A',
  textLight: '#5F7A77',
  border: '#CCFBF1',
  error: '#DC2626',
  success: '#16A34A',
};

export const DARK_COLORS = {
  primary: '#0F766E',
  secondary: '#F59E0B',
  background: '#042F2E',
  surface: '#0B4F4A',
  card: '#0B4F4A',
  text: '#F0FDFA',
  textLight: '#A7F3D0',
  border: '#115E59',
  error: '#DC2626',
  success: '#16A34A',
};

export type ThemeColors = typeof LIGHT_COLORS;

export const SIZES = {
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
  lg: 14,
  xl: 20,
  full: 9999,
};

export const FONTS = {
  h1: {
    fontSize: 24,
    fontWeight: '800' as const,
    lineHeight: 30,
  },
  h2: {
    fontSize: 20,
    fontWeight: '700' as const,
    lineHeight: 26,
  },
  h3: {
    fontSize: 17,
    fontWeight: '700' as const,
    lineHeight: 22,
  },
  body: {
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 20,
  },
  bodyBold: {
    fontSize: 14,
    fontWeight: '700' as const,
    lineHeight: 20,
  },
  caption: {
    fontSize: 12,
    fontWeight: '400' as const,
    lineHeight: 16,
  },
  price: {
    fontSize: 16,
    fontWeight: '800' as const,
    lineHeight: 22,
  },
};

export const TYPOGRAPHY = FONTS;
export type TypographyVariant = keyof typeof FONTS;
