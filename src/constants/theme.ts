/**
 * Hệ thống Theme Tokens cho ứng dụng ShopAI
 * Chuẩn hóa màu sắc Light/Dark, khoảng cách Spacing và kiểu chữ Typography
 */

// Bảng màu giao diện Sáng (Light Mode)
export const LIGHT_COLORS = {
  primary: '#FF4D4F',          // Đỏ cam chủ đạo ShopAI
  primaryDark: '#D9363E',      // Đỏ đậm khi nhấn nút
  primaryLight: '#FFECEC',     // Đỏ nhạt nền mờ
  background: '#F5F5F5',       // Nền tổng thể màn hình
  surface: '#FFFFFF',          // Nền thẻ card, header
  card: '#FFFFFF',             // Nền thẻ sản phẩm
  text: '#2C3E50',             // Màu chữ chính
  textSecondary: '#7F8C8D',    // Màu chữ phụ / mô tả
  textMuted: '#95A5A6',        // Màu placeholder / gợi ý
  border: '#E8E8E8',           // Màu đường viền / phân cách
  inputBackground: '#FFFFFF',  // Nền ô nhập liệu
  error: '#FF4D4F',            // Màu báo lỗi
  success: '#52C41A',          // Màu thành công
  warning: '#FAAD14',          // Màu cảnh báo
};

// Bảng màu giao diện Tối (Dark Mode)
export const DARK_COLORS = {
  primary: '#FF4D4F',          // Đỏ cam chủ đạo ShopAI
  primaryDark: '#D9363E',      // Đỏ đậm khi nhấn nút
  primaryLight: '#3A1E1E',     // Đỏ tối nền mờ
  background: '#121212',       // Nền tổng thể tối sâu
  surface: '#1E1E1E',          // Nền thẻ card, header tối
  card: '#1E1E1E',             // Nền thẻ sản phẩm tối
  text: '#F5F5F5',             // Màu chữ chính sáng
  textSecondary: '#A0A0A0',    // Màu chữ phụ sáng vừa
  textMuted: '#666666',        // Màu placeholder / gợi ý tối
  border: '#2C2C2C',           // Màu đường viền tối
  inputBackground: '#1E1E1E',  // Nền ô nhập liệu tối
  error: '#FF4D4F',            // Màu báo lỗi
  success: '#49AA19',          // Màu thành công
  warning: '#D89614',          // Màu cảnh báo
};

// Kiểu dữ liệu màu sắc đồng nhất
export type ThemeColors = typeof LIGHT_COLORS;

// Quy chuẩn khoảng cách Spacing (đơn vị: dp/pt)
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
};

// Quy chuẩn bo góc viền (Border Radius)
export const BORDER_RADIUS = {
  sm: 6,
  md: 10,
  lg: 14,
  xl: 20,
  full: 9999,
};

// Quy chuẩn kích thước chữ và độ đậm (Typography)
export const TYPOGRAPHY = {
  h1: {
    fontSize: 28,
    fontWeight: '800' as const,
    lineHeight: 34,
  },
  h2: {
    fontSize: 22,
    fontWeight: '700' as const,
    lineHeight: 28,
  },
  h3: {
    fontSize: 18,
    fontWeight: '700' as const,
    lineHeight: 24,
  },
  body: {
    fontSize: 15,
    fontWeight: '400' as const,
    lineHeight: 22,
  },
  bodyBold: {
    fontSize: 15,
    fontWeight: '700' as const,
    lineHeight: 22,
  },
  caption: {
    fontSize: 13,
    fontWeight: '400' as const,
    lineHeight: 18,
  },
  price: {
    fontSize: 16,
    fontWeight: '800' as const,
    lineHeight: 22,
  },
};
