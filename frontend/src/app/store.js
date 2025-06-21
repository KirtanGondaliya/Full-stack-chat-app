import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "../features/api/authApi";
import authReducer from "../features/slice/authSlice";
import chatReducer from "../features/slice/chatSlice";
import { chatApi } from "../features/api/chatApi";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    chat: chatReducer,
    [authApi.reducerPath]: authApi.reducer,
    [chatApi.reducerPath]: chatApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware, chatApi.middleware),
});
