import { User } from '@/types/types';
import { createSlice } from '@reduxjs/toolkit';

type InitialState = {
  user: User | null;
  isLoggedIn: boolean;
};

const initialState: InitialState = {
  user: null,
  isLoggedIn: false,
};

export const userSlice = createSlice({
  name: 'userSlice',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setIsLoggedIn: (state, action) => {
      state.isLoggedIn = action.payload;
    },
  },
});
export const userState = (state: { user: InitialState }) => state.user.user;
export const { setUser, setIsLoggedIn } = userSlice.actions;
export default userSlice.reducer;
