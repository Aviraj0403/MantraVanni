import axios from "axios";

// const baseURL =  'http://localhost:2016/v1/api';
const baseURL = 'https://apicrm.jdinfotechsolutions.in/v1/api';

const Axios = axios.create({
  baseURL,
  withCredentials: true,
  timeout: 30000, // 30 second timeout
});

// ✅ Here you specify the exact tenant ID so the master backend knows whose data to show
const TENANT_ID = "00001"; // <--- Demo will now pull data for project 00001

// Track if we're currently refreshing to prevent multiple refresh calls
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// 🔑 Token storage helpers — fallback when cross-subdomain cookies are blocked by browser
// Using localStorage so token persists across page refreshes and new tabs
// (sessionStorage is cleared when tab is closed)
const TOKEN_KEY = 'auth_token';
export const storeToken = (token) => {
  if (token) localStorage.setItem(TOKEN_KEY, token);
};
export const getStoredToken = () => localStorage.getItem(TOKEN_KEY);
export const clearStoredToken = () => localStorage.removeItem(TOKEN_KEY);

// Request interceptor
Axios.interceptors.request.use(
  (config) => {
    // Inject tenant ID so the master backend knows which database to query
    if (TENANT_ID && TENANT_ID !== "YOUR_TENANT_PROJECT_ID") {
      config.headers['x-tenant-id'] = TENANT_ID;
    }

    // 🛡️ Fallback: If cookie is blocked by browser tracking prevention,
    // inject the token from sessionStorage as Authorization header.
    // This handles Edge/Safari ITP blocking cross-subdomain cookies.
    const storedToken = getStoredToken();
    if (storedToken && !config.headers['Authorization']) {
      config.headers['Authorization'] = `Bearer ${storedToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
Axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Don't retry on these endpoints to avoid infinite loops
    const skipRefreshRoutes = [
      '/auth/phoneV1/login',
      '/auth/phoneV2/send-otp',
      '/auth/phoneV2/verify-otp',
      '/auth/phoneV2/refresh-token',
      '/auth/refresh-token',
      '/auth/user/logout',
      '/auth/signIn',
      '/auth/customRegister',
    ];

    const shouldSkipRefresh = skipRefreshRoutes.some(route =>
      originalRequest.url?.includes(route)
    );

    // Handle 401 errors — try token refresh
    if (error.response?.status === 401 && !originalRequest._retry && !shouldSkipRefresh) {
      
      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => Axios(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const storedToken = getStoredToken();
        // ✅ Use correct refresh endpoint with tenant headers & token fallback
        const refreshRes = await axios.post(
          `${baseURL}/auth/refresh-token`,
          { refreshToken: storedToken },
          {
            withCredentials: true,
            headers: {
              'x-tenant-id': TENANT_ID,
              ...(storedToken ? { 'Authorization': `Bearer ${storedToken}` } : {})
            }
          }
        );

        // 🔑 Store refreshed token as Bearer fallback (cookie may still be blocked)
        const newToken = refreshRes?.data?.token;
        if (newToken) storeToken(newToken);

        processQueue(null);
        isRefreshing = false;
        
        return Axios(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        isRefreshing = false;

        // Clear all auth-related storage
        clearStoredToken();
        localStorage.removeItem("user");
        localStorage.removeItem("user_data");
        sessionStorage.clear();
        
        // Redirect to login with return URL
        const currentPath = window.location.pathname;
        if (currentPath !== '/signin' && currentPath !== '/signup') {
          window.location.href = `/signin?redirect=${encodeURIComponent(currentPath)}`;
        }
        
        return Promise.reject(refreshError);
      }
    }

    // Handle network errors
    if (!error.response) {
      console.error("Network error:", error.message);
      return Promise.reject({
        message: "Network error. Please check your connection.",
        isNetworkError: true
      });
    }

    return Promise.reject(error);
  }
);

export default Axios;
