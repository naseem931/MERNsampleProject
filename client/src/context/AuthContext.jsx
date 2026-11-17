import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('tasks90_user') || localStorage.getItem('tasks_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('tasks90_token') || localStorage.getItem('tasks_token'));
  const [loading, setLoading] = useState(true);

  // Verify token on initial load
  useEffect(() => {
    const verifyUser = async () => {
      const storedToken = localStorage.getItem('tasks90_token') || localStorage.getItem('tasks_token');
      if (storedToken) {
        try {
          const res = await api.get('/auth/me');
          if (res.data && res.data.data) {
            setUser(res.data.data);
            localStorage.setItem('tasks90_user', JSON.stringify(res.data.data));
          }
        } catch (err) {
          console.error('Session expired or invalid token:', err);
          logout();
        }
      }
      setLoading(false);
    };

    verifyUser();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      const { token: receivedToken, ...userData } = res.data.data;

      localStorage.setItem('tasks90_token', receivedToken);
      localStorage.setItem('tasks90_user', JSON.stringify(userData));

      setToken(receivedToken);
      setUser(userData);
      toast.success(`Welcome back, ${userData.name}!`);
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed. Please check credentials.';
      toast.error(message);
      return { success: false, message };
    }
  };

  const register = async (name, email, password, role = 'member', title) => {
    try {
      const res = await api.post('/auth/register', { name, email, password, role, title });
      const { token: receivedToken, ...userData } = res.data.data;

      localStorage.setItem('tasks90_token', receivedToken);
      localStorage.setItem('tasks90_user', JSON.stringify(userData));

      setToken(receivedToken);
      setUser(userData);
      toast.success('Account created successfully!');
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed.';
      toast.error(message);
      return { success: false, message };
    }
  };

  const logout = () => {
    localStorage.removeItem('tasks90_token');
    localStorage.removeItem('tasks90_user');
    localStorage.removeItem('tasks_token');
    localStorage.removeItem('tasks_user');
    setUser(null);
    setToken(null);
    toast.success('Logged out successfully');
  };

  const updateUser = (updatedData) => {
    setUser((prev) => {
      const updated = { ...prev, ...updatedData };
      localStorage.setItem('tasks90_user', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!token && !!user,
        login,
        register,
        logout,
        updateUser,
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
