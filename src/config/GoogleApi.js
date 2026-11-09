// API configuration
const API_URL = 'https://api.the9to9restaurant.com'; // Replace with your actual API URL if needed
export const API_ENDPOINTS = {
  googleSignIn: `${API_URL}/v1/api/auth/register/google`,
  googleLogin: `${API_URL}/v1/api/auth/googleSignIn`,
  phoneSignIn: `${API_URL}/v1/api/auth/signin`,
  customSignIn: `${API_URL}/v1/api/auth/customSignIn`, // For custom email/password sign-in
  authMe: `${API_URL}/v1/api/auth/me`, // To get the current user's session data
  logout: `${API_URL}/v1/api/auth/user/logout`, // Logout endpoint
  refreshToken: `${API_URL}/v1/api/auth/refresh-token`, // For refreshing the token
};
