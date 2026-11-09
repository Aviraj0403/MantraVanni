import React, { createContext, useContext, useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { clearCart } from "../features/cart/cartSlice";
import { fetchBackendCart, syncCartOnLogin } from "../features/cart/cartThunk";
import Axios, { storeToken, clearStoredToken } from "../utils/Axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const cached = localStorage.getItem('user_data');
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);
  const [cartSyncing, setCartSyncing] = useState(false);

  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const handleSetUser = (userData) => {
    setUser(userData);
    if (userData) {
      localStorage.setItem('user_data', JSON.stringify(userData));
    } else {
      localStorage.removeItem('user_data');
    }
  };

  const syncCart = async () => {
    try {
      setCartSyncing(true);
      await dispatch(syncCartOnLogin()).unwrap();
      await dispatch(fetchBackendCart()).unwrap();
    } catch (cartErr) {
      console.warn("Cart sync skipped:", cartErr?.message || cartErr);
    } finally {
      setCartSyncing(false);
    }
  };

  useEffect(() => {
    const validateSession = async () => {
      try {
        const res = await Axios.get("/auth/me");
        if (res.data?.data) {
          handleSetUser(res.data.data);
          dispatch(fetchBackendCart()).catch(() => {});
        }
      } catch (error) {
        if (error.response?.status === 401 || error.response?.status === 403) {
          handleSetUser(null);
          clearStoredToken();
        } else {
          console.error("Session validation error:", error);
        }
      } finally {
        setLoading(false);
      }
    };
    validateSession();
  }, [dispatch]);

  const login = async (credentials) => {
    const signInRes = await Axios.post("/auth/signIn", credentials);
    const token = signInRes.data?.token || signInRes.data?.accessToken;
    if (token) storeToken(token);
    const res = await Axios.get("/auth/me");
    const uData = res.data?.data || signInRes.data?.userData;
    handleSetUser(uData);
    await syncCart();
    return uData;
  };

  const register = async (userData) => {
    const res = await Axios.post("/auth/customRegister", userData);
    const token = res.data?.token || res.data?.accessToken;
    if (token) storeToken(token);
    const meRes = await Axios.get("/auth/me");
    const uData = meRes.data?.data || res.data?.userData || res.data?.user;
    handleSetUser(uData);
    await syncCart();
    return uData;
  };

  const loginPhoneV1 = async (phoneNumber) => {
    const response = await Axios.post("/auth/phoneV1/login", { phoneNumber });
    const token = response.data?.token || response.data?.accessToken;
    if (token) storeToken(token);
    let uData = response.data?.userData || response.data?.user;
    if (!uData) {
      const userRes = await Axios.get("/auth/me");
      uData = userRes.data?.data;
    }
    handleSetUser(uData);
    await syncCart();
    return response.data;
  };

  const sendPhoneOTP = async (phoneNumber, sessionId = null) => {
    const response = await Axios.post("/auth/phoneV2/send-otp", { phoneNumber, sessionId });
    return response.data;
  };

  const verifyPhoneOTP = async (sessionId, otp) => {
    const response = await Axios.post("/auth/phoneV2/verify-otp", { sessionId, otp });
    const token = response.data?.token || response.data?.accessToken;
    if (token) storeToken(token);
    const userRes = await Axios.get("/auth/me");
    const uData = userRes.data?.data || response.data?.userData;
    handleSetUser(uData);
    await syncCart();
    return response.data;
  };

  const googleLogin = async () => {
    const { auth, googleProvider, signInWithPopup } =
      await import("../pages/firebase/firebase");
    const { getIdToken } = await import("firebase/auth");
    const result = await signInWithPopup(auth, googleProvider);
    const idToken = await getIdToken(result.user);
    const response = await Axios.post("/auth/googleSignIn", { idToken });
    const token = response.data?.token || response.data?.accessToken;
    if (token) storeToken(token);
    const userRes = await Axios.get("/auth/me");
    const uData = userRes.data?.data || response.data?.userData;
    handleSetUser(uData);
    await syncCart();
    return uData;
  };

  const logout = async () => {
    try {
      await Axios.post("/auth/user/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      clearStoredToken();
      handleSetUser(null);
      dispatch(clearCart());
      queryClient.clear();
      localStorage.clear();
      sessionStorage.clear();
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        cartSyncing,
        login,
        register,
        logout,
        googleLogin,
        loginPhoneV1,
        sendPhoneOTP,
        verifyPhoneOTP,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
