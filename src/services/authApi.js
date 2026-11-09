import Axios from '../utils/Axios';
export const login = (data) => Axios.post('/auth/signIn', data);

export const customRegister = async (userData) => {
  const res = await Axios.post('/auth/customRegister', userData);
  return res.data;
};

export const registerViaGoogle = async (googleToken) => {
  const res = await Axios.post('/auth/register/google', { token: googleToken });
  return res.data;
};
export const registerViaPhone = async (phoneData) => {
  const res = await Axios.post('/auth/register/phone', phoneData);
  return res.data;
};
export const signIn = async (credentials) => {
  const res = await Axios.post('/auth/signIn', credentials);
  return res.data;
};
export const logout = async () => {
  const res = await Axios.post('/auth/user/logout');
  return res.data;
};
export const forgotPassword = async (emailOrPhone) => {
  const res = await Axios.post('/auth/user/forgotPassword', emailOrPhone);
  return res.data;
};
export const resetPassword = async (data) => {
  const res = await Axios.post('/auth/user/resetPassword', data);
  return res.data;
};

export const changePassword = async (data) => {
  const res = await Axios.post('/auth/changePassword', data);
  return res.data;
}
export const verifyOtp = async (otpData) => {
  const res = await Axios.post('/auth/user/verifyOtp', otpData);
  return res.data;
};
export const getProfile = async () => {
  const res = await Axios.get('/auth/user/profile');
  return res.data.user;
};
export const updateProfile = async (updateData) => {
  const res = await Axios.patch('/auth/user/updateProfile', updateData);
  return res.data;
};
export const uploadAvatar = async (file) => {
  const formData = new FormData();
  formData.append('avatar', file);

  const res = await Axios.post('/auth/user/uploadAvatar', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return res.data;
};
export const authMe = async () => {
  const res = await Axios.get('/auth/me');
  return res.data;
};
export const refreshToken = async () => {
  const res = await Axios.post('/auth/refresh-token');
  return res.data;
};

// phoneAuth
export const sendPhoneOtp = async (phoneData) => {
  const res = await Axios.post('/auth/phone/send-otp', phoneData);
  return res.data;
};
export const verifyPhoneOtp = async (otpData) => {
  const res = await Axios.post('/auth/phone/verify-otp', otpData);
  return res.data;
}


