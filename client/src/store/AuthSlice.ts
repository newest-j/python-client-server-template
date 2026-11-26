import { createSlice } from "@reduxjs/toolkit";

interface User {
  id?: string;
  name?: string;
  email: string;
}

interface AuthState {
  user: User | null;
}

const initialState: AuthState = {
  user: null,
};

const authslice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    signup: (state, action: { payload: User }) => {
      state.user = action.payload;
    },
    login: (state, action: { payload: User }) => {
      state.user = action.payload;
    },
    logout: (state) => {
      state.user = null;
    },
  },
});

export const { signup, login, logout } = authslice.actions;
export default authslice.reducer;
