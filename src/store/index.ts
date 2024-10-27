
import { configureStore } from '@reduxjs/toolkit';
import userReducer from '@/features/user/userSlice';

export const index = configureStore({
  reducer: {
    user: userReducer,
  },
});

export type RootState = ReturnType<typeof index.getState>;
export type AppDispatch = typeof index.dispatch;
