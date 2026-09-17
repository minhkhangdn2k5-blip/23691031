import { create } from 'zustand';

interface AuthState {
  token: string | null;
  login: (newToken: string) => void;
  logout: () => void;
}

/**
 * Đám mây Zustand quản lý trạng thái Đăng nhập (Chương 6 - Bước 2 & 3)
 * Mặc định cấp sẵn mock_token_dev để vào thẳng app theo mong muốn của bạn
 */
export const useAuthStore = create<AuthState>((set) => ({
  token: 'mock_token_dev', // Đặt sẵn mock token để vào thẳng app
  login: (newToken: string) => {
    set({ token: newToken });
  },
  logout: () => {
    set({ token: null });
  },
}));

export default useAuthStore;
