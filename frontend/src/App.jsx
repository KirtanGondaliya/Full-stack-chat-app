import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import SignUpPage from "./pages/SignUpPage";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
import LoginPage from "./pages/LoginPage";
import Navbar from "./components/Navbar";
import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";
import { useCheckAuthQuery } from "./features/api/authApi";
import { useDispatch, useSelector } from "react-redux";
import { setAuthUser, setIsCheckingAuth } from "./features/slice/authSlice";
import { connectSocket } from "./lib/socket";

const App = () => {
  const { data, isLoading, error, isSuccess } = useCheckAuthQuery();
  const { authUser, isCheckingAuth } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    if (isSuccess && data) {
      dispatch(setAuthUser(data));
      connectSocket(data._doc_id);
    } else if (error) {
      dispatch(setIsCheckingAuth(false));
      dispatch(setAuthUser(null));
    }
  }, [dispatch, error, data]);

  if (isCheckingAuth && !authUser)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );

  return (
    <div data-theme="dark">
      <Toaster />
      <Navbar />

      <Routes>
        <Route
          path="/"
          element={authUser ? <HomePage /> : <Navigate to="/login" />}
        />
        <Route
          path="/signup"
          element={!authUser ? <SignUpPage /> : <Navigate to="/" />}
        />
        <Route
          path="/login"
          element={!authUser ? <LoginPage /> : <Navigate to="/" />}
        />
        <Route
          path="/profile"
          element={authUser ? <ProfilePage /> : <Navigate to="/login" />}
        />
      </Routes>
    </div>
  );
};

export default App;
