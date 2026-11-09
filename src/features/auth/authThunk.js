// cartThunk.js// src/features/auth/authThunks.js
import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  login,
  customRegister,
  registerViaGoogle,
  registerViaPhone,
  logout,
  authMe,
  getProfile,
} from '../../services/authApi'; // tumhara Axios file

import { storeToken, clearStoredToken } from '../../utils/Axios';
import { setUser, clearUser, setAuthChecked } from './authSlice';
import { loadCartFromBackend, syncCartOnLogin } from '../cart/cartThunks';
import { clearCart } from '../cart/cartSlice';

// Check session on app load
export const checkAuth = createAsyncThunk(
  'auth/checkAuth',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const res = await authMe(); // /auth/me
      dispatch(setUser(res.data)); // { data: user }
      dispatch(loadCartFromBackend()); // cart bhi load kar lo
      return res.data;
    } catch (err) {
      dispatch(clearUser());
      dispatch(setAuthChecked());
      return rejectWithValue(err.response?.data || 'Not authenticated');
    }
  }
);

// Email/ Login (Email/Password)
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { dispatch, rejectWithValue }) => {
    try {
      const loginRes = await login(credentials); // backend login
      // 🔑 Store token as fallback for browsers that block cross-subdomain cookies (Edge ITP, Safari)
      const token = loginRes?.data?.token;
      if (token) storeToken(token);

      const res = await authMe();
      dispatch(setUser(res.data));
      await dispatch(syncCartOnLogin()).unwrap(); // guest cart → user cart merge
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Login failed');
    }
  }
);

// Google Login
export const googleSignIn = createAsyncThunk(
  'auth/googleSignIn',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      // Frontend Firebase se idToken milega → yeh thunk component se call hoga
      const { idToken } = arguments[1].getState().temp || {}; // ya props se pass karo
      if (!idToken) throw new Error('No token');

      await registerViaGoogle(idToken);
      const res = await authMe();
      dispatch(setUser(res.data));
      await dispatch(syncCartOnLogin()).unwrap();
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Google login failed');
    }
  }
);

// Phone OTP Login (after verifyOtp)
export const phoneSignIn = createAsyncThunk(
  'auth/phoneSignIn',
  async (idToken, { dispatch, rejectWithValue }) => {
    try {
      await registerViaPhone({ token: idToken });
      const res = await authMe();
      dispatch(setUser(res.data));
      await dispatch(syncCartOnLogin()).unwrap();
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Phone login failed');
    }
  }
);

// Logout
export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      await logout();
      clearStoredToken(); // 🗑️ Clear fallback token from sessionStorage
      dispatch(clearUser());
      dispatch(clearCart()); // local + backend clear
      return true;
    } catch (err) {
      return rejectWithValue('Logout failed');
    }
  }
);
