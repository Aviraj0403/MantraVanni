import Axios from '../utils/Axios';
export const getAddress = () => Axios.get('/users/getaddresses');
export const addAddress = (data) => Axios.post('/users/address', data);
export const updateAddress = (id, data) => Axios.patch(`/users/address/${id}`, data);
export const deleteAddress = (id) => Axios.delete(`/users/address/${id}`);
export const setDefaultAddress = (id) =>
  Axios.patch(`/users/address/${id}/set-default`);
