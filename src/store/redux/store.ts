import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cartSlice';

/**
 * Redux Store chuẩn Enterprise (Chương 6 - Bước 10)
 */
export const reduxStore = configureStore({
  reducer: {
    cartRedux: cartReducer,
  },
});

export type ReduxRootState = ReturnType<typeof reduxStore.getState>;
export type ReduxAppDispatch = typeof reduxStore.dispatch;

export default reduxStore;
