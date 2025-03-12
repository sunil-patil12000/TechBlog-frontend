// Export all contexts for easier imports
// This helps maintain consistency and prevents import path errors

// Re-export ThemeContext from the correct location
export { useTheme, ThemeProvider } from './ThemeContext';

// Re-export other contexts
export { useAuth, AuthProvider } from './AuthContext';
export { useBlog, BlogProvider } from './BlogContext';
export { useFilter, FilterProvider } from './FilterContext';
export { useNotification, NotificationProvider } from './NotificationContext';

// This file helps standardize imports across the application
// Now you can import all contexts from this single file:
// import { useTheme, useAuth, useBlog } from '../contexts';
