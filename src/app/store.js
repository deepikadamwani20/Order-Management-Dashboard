import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../Components/features/auth/authSlice';
import ordersReducer from '../Components/features/orders/orderSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    orders: ordersReducer,
  },
});