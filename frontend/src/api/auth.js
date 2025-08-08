import api from './axiosConfig';

export const login = async (name) => {
  try {
    const encodedName = encodeURIComponent(name);
    const response = await api.get(`/login/${encodedName}`);
    return response.data;
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
};

export const verifyToken = async (token) => {
  try {
    const response = await api.get('/protected');
    return response.data;
  } catch (error) {
    console.error('Token verification failed:', error);
    throw error;
  }
};