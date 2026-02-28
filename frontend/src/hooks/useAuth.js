import { login, verifyToken } from '../api/auth';

export const useAuth = () => {
  const handleLogin = async (name) => {
    const response = await login(name);
    return response.token;
  };

  const validateToken = async (token) => {
    if (!token) return false;
    
    try {
      await verifyToken(token);
      return true;
    } catch (err) {
      return false;
    }
  };

  return {
    login: handleLogin,
    validateToken
  };
};
