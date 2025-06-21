import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  authUser: null,
  isCheckingAuth: true,
  onlineUsers: [],
  socket: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthUser: (state, action) => {
      state.authUser = action.payload;
    },
    setIsCheckingAuth: (state, action) => {
      state.isCheckingAuth = action.payload;
    },

    setOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload;
    },
  },
});

export const { setOnlineUsers, setAuthUser, setIsCheckingAuth } =
  authSlice.actions;
export default authSlice.reducer;
