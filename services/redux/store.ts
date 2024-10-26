import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slice/userSlice';
import { appApi } from './query/appQuery';
import { countryApi } from './query/countryQuery';
export const store = configureStore({
  reducer: {
    user: userReducer,
    [appApi.reducerPath]: appApi.reducer,
    [countryApi.reducerPath]: countryApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(
      appApi.middleware,
      countryApi.middleware
    ),
});

export type AppDispatch = typeof store.dispatch;

export type RootState = ReturnType<typeof store.getState>;
