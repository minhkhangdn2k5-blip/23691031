import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Product } from '../types/product.schema';

/**
 * Một dòng trong Giỏ hàng = Sản phẩm gốc + số lượng đang chọn (Chương 6 - Bước 3)
 */
export interface CartItem extends Product {
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, delta: number) => void;
  totalQuantity: () => number;
  totalPrice: () => number;
  clearCart: () => void;
}

/**
 * Đám mây Zustand cho Giỏ hàng (Cart Store) có Persist (Chương 6 - Bước 3)
 * Lưu bền vững xuống AsyncStorage — Tắt app hoặc reset máy giỏ hàng vẫn còn nguyên!
 */
export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      // Nếu sản phẩm đã có trong giỏ -> Chỉ tăng quantity. Chưa có -> Thêm dòng mới.
      addItem: (product: Product) => {
        set((state) => {
          const existing = state.items.find((item) => item.id === product.id);
          if (existing) {
            return {
              items: state.items.map((item) =>
                item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
              ),
            };
          }
          return { items: [...state.items, { ...product, quantity: 1 }] };
        });
      },

      // Xóa sản phẩm khỏi giỏ hàng theo ID
      removeItem: (productId: string) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== productId),
        }));
      },

      // Tăng / giảm số lượng linh hoạt
      updateQuantity: (productId: string, delta: number) => {
        set((state) => ({
          items: state.items
            .map((item) => {
              if (item.id === productId) {
                const newQty = item.quantity + delta;
                return newQty > 0 ? { ...item, quantity: newQty } : null;
              }
              return item;
            })
            .filter((item): item is CartItem => item !== null),
        }));
      },

      // Dùng get() để tính toán On-demand — Không bao giờ bị lệch dữ liệu
      totalQuantity: () => get().items.reduce((sum, item) => sum + item.quantity, 0),
      totalPrice: () => get().items.reduce((sum, item) => sum + item.price * item.quantity, 0),

      // Xóa sạch toàn bộ giỏ hàng (khi đặt hàng thành công)
      clearCart: () => set({ items: [] }),
    }),
    {
      name: 'shopai-cart-storage', // Chìa khóa lưu trữ trong AsyncStorage
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ items: state.items }) as CartState,
    }
  )
);

export default useCartStore;
