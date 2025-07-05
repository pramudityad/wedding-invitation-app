import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const { login: authLogin, validateToken } = useAuth();

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('weddingToken');
      if (storedToken && await validateToken(storedToken)) {
        setToken(storedToken);
      } else {
        localStorage.removeItem('weddingToken');
      }
    };
    initAuth();
  }, []);

  const login = async (name) => {
    const newToken = await authLogin(name);
    setToken(newToken);
    localStorage.setItem('weddingToken', newToken);
    return true;
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
