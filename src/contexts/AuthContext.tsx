import React, { createContext, useContext, useState, useEffect } from 'react';
import { userAPI } from '../services/api';

interface User {
  id?: string;
  _id?: string;
  name: string;
  email: string;
  role: string;
  createdAt?: string;
  updatedAt?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<any>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => Promise<void>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if the user is authenticated on initial load
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        await loadUser();
      } else {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  // Extract user data from API response format
  const extractUserData = (responseData: any): User | null => {
    try {
      // Handle different API response formats
      if (responseData?.data && typeof responseData.data === 'object') {
        // Format: { success: true, data: { user properties } }
        return responseData.data;
      } else if (responseData?.user && typeof responseData.user === 'object') {
        // Format: { success: true, user: { user properties } }
        return responseData.user;
      } else if (responseData && typeof responseData === 'object' && responseData.role) {
        // Format: { user properties directly }
        return responseData;
      }
      
      console.error('Unexpected user data format:', responseData);
      return null;
    } catch (error) {
      console.error('Error extracting user data:', error);
      return null;
    }
  };

  // Load user data from the token
  const loadUser = async () => {
    try {
      setIsLoading(true);
      const response = await userAPI.getProfile();
      const userData = extractUserData(response.data);
      
      if (userData) {
        setUser(userData);
      } else {
        // If we couldn't extract valid user data, clear token and user
        localStorage.removeItem('token');
        setUser(null);
      }
    } catch (error) {
      console.error('Failed to load user:', error);
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Login user
  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await userAPI.login({ email, password });
      const responseData = response.data;
      
      if (responseData.success && responseData.token) {
        localStorage.setItem('token', responseData.token);
        const userData = extractUserData(responseData);
        if (userData) {
          setUser(userData);
        } else {
          throw new Error('Invalid user data received');
        }
        return responseData;
      } else {
        throw new Error(responseData.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error in context:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Register user
  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await userAPI.register({ name, email, password });
      const responseData = response.data;
      
      if (responseData.token) {
        localStorage.setItem('token', responseData.token);
        const userData = extractUserData(responseData);
        if (userData) {
          setUser(userData);
        } else {
          throw new Error('Invalid user data received');
        }
      } else {
        throw new Error(responseData.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  // Update user profile
  const updateProfile = async (userData: Partial<User>) => {
    setIsLoading(true);
    try {
      const response = await userAPI.updateProfile(userData);
      const updatedUserData = extractUserData(response.data);
      if (updatedUserData) {
        setUser(updatedUserData);
      } else {
        throw new Error('Failed to update profile: Invalid data received');
      }
    } catch (error) {
      console.error('Update profile failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        updateProfile,
        isAdmin: user?.role === 'admin',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
