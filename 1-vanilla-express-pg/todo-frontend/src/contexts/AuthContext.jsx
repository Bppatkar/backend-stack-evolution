import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import toast from 'react-hot-toast';
import { authAPI, clearAuth, setAuthToken } from '../utils/api.js';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setAuthToken(token);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      loadUser();
    } else {
      setLoading(false);
    }
  }, []);

  const loadUser = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await authAPI.getProfile();
      setUser(response.data.user);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    } catch (error) {
      console.error('Failed to load user: ', error);
      toast.error('Failed To Load user');
      setError(error.response?.data?.error || 'Failed to load user');
      logout();
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    try {
      setError(null);
      const response = await authAPI.login({ email, password });
      const { token, user } = response.data;

      setAuthToken(token);
      setUser(user);
      localStorage.setItem('user', JSON.stringify(user));

      toast.success('Login successful!');
      return { success: true, user };
    } catch (error) {
      const message = error.response?.data?.error || 'Login failed';
      setError(message);
      toast.error(message);
      return { success: false, message };
    }
  };
  const signup = async (name, email, password) => {
    try {
      setError(null);
      const response = await authAPI.signup({ name, email, password });
      const { token, user } = response.data;

      setAuthToken(token);
      setUser(user);
      localStorage.setItem('user', JSON.stringify(user));

      toast.success('Account created successfully!');
      return { success: true, user };
    } catch (error) {
      const message = error.response?.data?.error || 'Signup failed';
      setError(message);
      toast.error(message);
      return { success: false, message };
    }
  };

  const logout = useCallback(() => {
    clearAuth();
    setUser(null);
    setError(null);
    toast.success('Logged out successfully');
  }, []);

  const value = {
    user,
    loading,
    error,
    login,
    signup,
    logout,
    isAuthenticated: !!user && !!localStorage.getItem('token'),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthProvider;
