import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuthStatus = () => {
      const currentUser = authService.getCurrentUser();
      setUser(currentUser);
      setIsAuthenticated(!!currentUser);
      setLoading(false);
    };

    checkAuthStatus();
  }, []);

  const login = async (email, password) => {
    const userData = await authService.login(email, password);
    setUser(userData.data.user);
    setIsAuthenticated(true);
    return userData;
  };

  const register = async (userData) => {
    const response = await authService.register(userData);
    setUser(response.data.user);
    setIsAuthenticated(true);
    return response;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isAuthenticated, 
        loading, 
        login, 
        register, 
        logout 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};