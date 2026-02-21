import api from './axiosConfig';

export const login = async (name) => {
  const encodedName = encodeURIComponent(name);
  const response = await api.get(`/login/${encodedName}`);
  return response.data;
};

export const verifyToken = async (token) => {
  const response = await api.get('/protected');
  return response.data;
};