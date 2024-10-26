import { User } from '@/types/types';
import { createSlice } from '@reduxjs/toolkit';

type InitialState = {
  user: User | null;
  token: string | null;
};

const initialState: InitialState = {
  user: null,
  token: null,
};

export const userSlice = createSlice({
  name: 'userSlice',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setToken: (state, action) => {
      state.token = action.payload;
    },
  },
});
export const userState = (state: { user: InitialState }) => state.user.user;
export const { setUser, setToken } = userSlice.actions;
export default userSlice.reducer;
