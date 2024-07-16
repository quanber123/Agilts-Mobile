import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slice/userSlice';
import { appApi } from './query/appQuery';
export const store = configureStore({
  reducer: {
    user: userReducer,
    [appApi.reducerPath]: appApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(appApi.middleware),
});

export type AppDispatch = typeof store.dispatch;

export type RootState = ReturnType<typeof store.getState>;
