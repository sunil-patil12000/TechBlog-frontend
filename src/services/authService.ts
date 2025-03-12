import Cookies from 'js-cookie';

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

// Get token from localStorage or cookie
const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY) || Cookies.get(TOKEN_KEY) || null;
};

// Set token in both localStorage and cookie for better persistence
const setToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
  // Set cookie with secure flag in production
  Cookies.set(TOKEN_KEY, token, { 
    expires: 7, // 7 days
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  });
};

// Get user from localStorage
const getUser = (): any => {
  const userStr = localStorage.getItem(USER_KEY);
  return userStr ? JSON.parse(userStr) : null;
};

// Alias for getUser to ensure backward compatibility
const getCurrentUser = (): any => {
  return getUser();
};

// Set user in localStorage
const setUser = (user: any): void => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

// Clear auth data on logout
const logout = (): void => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  Cookies.remove(TOKEN_KEY);
};

const authService = {
  getToken,
  setToken,
  getUser,
  getCurrentUser,
  setUser,
  logout,
};

export default authService;
