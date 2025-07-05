import { useState } from 'react';
import { login, verifyToken } from '../api/auth';

export const useAuth = () => {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const authToken = await login();
      setToken(authToken);
      return authToken;
    } catch (err) {
      setError(err.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const validateToken = async () => {
    setLoading(true);
    setError(null);
    try {
      await verifyToken();
      const token = localStorage.getItem('weddingToken');
      setToken(token);
      return true;
    } catch (err) {
      setError('Invalid or expired token');
      setToken(null);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    token,
    loading,
    error,
    login: handleLogin,
    validateToken
  };
};