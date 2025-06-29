import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const { login: authLogin, validateToken } = useAuth();

  useEffect(() => {
    const storedToken = localStorage.getItem('weddingToken');
    if (storedToken) {
      validateToken(storedToken)
        .then(isValid => {
          if (isValid) setToken(storedToken);
          else localStorage.removeItem('weddingToken');
        });
    }
  }, []);

  const login = async () => {
    try {
      const newToken = await authLogin();
      setToken(newToken);
      localStorage.setItem('weddingToken', newToken);
      return true;
    } catch (error) {
      return false;
    }
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem('weddingToken');
  };

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};