import axios from "axios";

// const baseURL =  'http://localhost:2016/v1/api';
const baseURL = import.meta.env.VITE_API_BASE_URL || 'https://apicrm.jdinfotechsolutions.in/v1/api';

const Axios = axios.create({
  baseURL,
  withCredentials: true,
  timeout: 30000, // 30 second timeout
});

// The backend resolves the tenant from the request Origin, so no tenant header is sent in production.
// DEV-ONLY override (never applied in production builds): set VITE_TENANT_ID in .env.local.
const DEV_TENANT_ID = import.meta.env.DEV ? import.meta.env.VITE_TENANT_ID : undefined;

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

// Token storage helpers: Bearer fallback when third-party cookies are blocked (Safari ITP / Edge).
// Kept in sessionStorage (cleared when the tab closes, survives page refreshes). The httpOnly
// cookie remains the primary credential; this is only a fallback.
const TOKEN_KEY = 'auth_token';
const safeStorage = (fn) => { try { return fn(); } catch { return null; } };
// One-time cleanup of the token a previous version kept in localStorage.
safeStorage(() => localStorage.removeItem(TOKEN_KEY));
export const storeToken = (token) => {
  if (token) safeStorage(() => sessionStorage.setItem(TOKEN_KEY, token));
};
export const getStoredToken = () => safeStorage(() => sessionStorage.getItem(TOKEN_KEY));
export const clearStoredToken = () => safeStorage(() => sessionStorage.removeItem(TOKEN_KEY));

/** Only same-site relative paths ("/x", not "//host" or a slash followed by a backslash) are valid redirect targets. */
export const safeRedirect = (value, fallback = '/') => {
  if (typeof value !== 'string') return fallback;
  if (!value.startsWith('/') || value.startsWith('//') || value.startsWith('/' + String.fromCharCode(92))) return fallback;
  return value;
};

// 🛡️ Account / store security codes from the API. None of them can be fixed by a token refresh.
const SESSION_CODES = ['TENANT_SUSPENDED', 'ACCOUNT_BLOCKED', 'ACCOUNT_LOCKED', 'SESSION_REVOKED'];
const AUTH_FORM_ROUTES = ['/auth/signIn', '/auth/googleSignIn', '/auth/customRegister', '/auth/register', '/auth/phone', '/auth/user/forgotPassword', '/auth/user/resetPassword', '/auth/user/verifyOtp'];
let sessionRedirecting = false;

export const clearLocalSession = () => {
  try {
    clearStoredToken();
    localStorage.removeItem("user");
    localStorage.removeItem("user_data");
    sessionStorage.removeItem("user_data");
    sessionStorage.removeItem("pendingPaymentData");
    sessionStorage.removeItem("pendingCartData");
  } catch { /* storage unavailable */ }
};

/** Returns true when the error carries a security code (caller must not refresh/retry). */
const handleSessionCode = (error) => {
  const code = error?.response?.data?.code;
  if (!SESSION_CODES.includes(code)) return false;

  const url = error?.config?.url || '';
  const here = window.location.pathname;

  if (code === 'TENANT_SUSPENDED') {
    try { window.dispatchEvent(new CustomEvent('store:suspended')); } catch { /* old browsers */ }
    if (here !== '/store-unavailable' && !sessionRedirecting) {
      sessionRedirecting = true;
      window.location.replace('/store-unavailable');
    }
    return true;
  }

  // Sign-in / OTP forms render the server message themselves (e.g. "account locked").
  if (!url.includes('refresh') && AUTH_FORM_ROUTES.some((r) => url.includes(r))) return true;

  // ACCOUNT_BLOCKED / SESSION_REVOKED (/ ACCOUNT_LOCKED outside a form): drop the session, ask to sign in.
  clearLocalSession();
  if (here !== '/signin' && here !== '/signup' && !sessionRedirecting) {
    sessionRedirecting = true;
    const reason = code === 'ACCOUNT_BLOCKED' ? 'account_blocked' : code === 'ACCOUNT_LOCKED' ? 'account_locked' : 'session_revoked';
    window.location.replace(`/signin?reason=${reason}&redirect=${encodeURIComponent(here)}`);
  }
  return true;
};

// Request interceptor
Axios.interceptors.request.use(
  (config) => {
    // The backend only honours x-tenant-id for signed-in platform superadmins (403 otherwise), so it is
    // never sent on guest or /auth requests. Local dev should use a hostname registered in Tenant.domains.
    if (DEV_TENANT_ID && getStoredToken() && !String(config.url || '').includes('/auth/')) {
      config.headers['x-tenant-id'] = DEV_TENANT_ID;
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
    const originalRequest = error.config || {};

    // Suspended store / blocked / locked / revoked session → never refresh.
    if (handleSessionCode(error)) return Promise.reject(error);

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
        // Refresh relies on the httpOnly refresh cookie only. The access token must never be
        // sent as a refresh token (the backend rejects it). If the cookie is blocked
        // (Bearer-only session) the refresh fails and the user simply signs in again.
        const refreshRes = await axios.post(
          `${baseURL}/auth/refresh-token`,
          {},
          {
            withCredentials: true,
          }
        );

        // Keep the Bearer fallback current when the API returns a fresh access token.
        const newToken = refreshRes?.data?.token || refreshRes?.data?.accessToken;
        if (newToken) {
          storeToken(newToken);
          originalRequest.headers = { ...(originalRequest.headers || {}), Authorization: `Bearer ${newToken}` };
        }

        processQueue(null);
        isRefreshing = false;

        return Axios(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        isRefreshing = false;

        if (handleSessionCode(refreshError)) return Promise.reject(refreshError);

        // Clear auth-related storage only (keep guest wishlist / search history etc.)
        clearLocalSession();

        // Redirect to login with return URL
        const currentPath = window.location.pathname;
        if (currentPath !== '/signin' && currentPath !== '/signup') {
          window.location.href = `/signin?redirect=${encodeURIComponent(currentPath + window.location.search)}`;
        }

        return Promise.reject(refreshError);
      }
    }

    // Handle network errors
    if (!error.response) {
      return Promise.reject({
        message: "Network error. Please check your connection.",
        isNetworkError: true
      });
    }

    return Promise.reject(error);
  }
);

export default Axios;
