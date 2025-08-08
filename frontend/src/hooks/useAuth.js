import { useState } from 'react';
import { login, verifyToken } from '../api/auth';

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async (name) => {
    setLoading(true);
    setError(null);
    try {
      const response = await login(name);
      return response.token;
    } catch (err) {
      setError(err.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const validateToken = async (token) => {
    if (!token) return false;
    
    setLoading(true);
    setError(null);
    try {
      await verifyToken(token);
      return true;
    } catch (err) {
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    login: handleLogin,
    validateToken
  };
};
