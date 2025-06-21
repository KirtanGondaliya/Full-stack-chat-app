import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  users: [],
  messages: [],
  selectedUser: null,
};

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setUsersList: (state, action) => {
      state.users = action.payload;
    },
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
    },
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
  },
});

export const { addMessage, setSelectedUser, setMessages, setUsersList } =
  chatSlice.actions;
export default chatSlice.reducer;
