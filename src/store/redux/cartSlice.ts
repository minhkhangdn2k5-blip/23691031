import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Product } from '../../types/product.schema';

export interface CartItemRedux extends Product {
  quantity: number;
}

interface CartReduxState {
  items: CartItemRedux[];
}

const initialState: CartReduxState = {
  items: [],
};

/**
 * Redux Toolkit Cart Slice (Chương 6 - Bước 10: Yêu cầu bắt buộc đề cương 5.1.2 & 5.2.1-5.2.4)
 * Xây dựng song song phục vụ học tập và nghiệm thu Redux Toolkit
 */
export const cartSlice = createSlice({
  name: 'cartRedux',
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<Product>) => {
      const existing = state.items.find((item) => item.id === action.payload.id);
      if (existing) {
        existing.quantity += 1; // Immer cho phép mutate trực tiếp an toàn
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
    },
    removeItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const { addItem, removeItem, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
