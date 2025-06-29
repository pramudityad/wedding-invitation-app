import api from './axiosConfig';

export const login = async () => {
  try {
    const response = await api.post('/login', {});
    return response.data.token;
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