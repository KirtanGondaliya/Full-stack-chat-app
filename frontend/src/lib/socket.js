// lib/socket.js
import { io } from "socket.io-client";
import { store } from "../app/store";
import { setOnlineUsers } from "../features/slice/authSlice";

const BASE_URL =import.meta.env.MODE ==="development" ?"http://localhost:5001":"/";

let socket = null;

export const connectSocket = (userId) => {
  if (!userId || socket?.connected) return;

  socket = io(BASE_URL, {
    query: { userId },
  });
  socket.connect();

  socket.on("getOnlineUsers", (userIds) => {
    store.dispatch(setOnlineUsers(userIds));
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected");
  });
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket?.connected) {
    socket.disconnect();
    socket = null;
  }
};
