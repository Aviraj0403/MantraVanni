// src/features/auth/authSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: true,      
  authChecked: false,  
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
      state.loading = false;
      state.authChecked = true;
    },
    clearUser(state) {
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.authChecked = true;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setAuthChecked(state) {
      state.authChecked = true;
      state.loading = false;
    },
  },
});

export const { setUser, clearUser, setLoading, setAuthChecked } = authSlice.actions;
export default authSlice.reducer;
