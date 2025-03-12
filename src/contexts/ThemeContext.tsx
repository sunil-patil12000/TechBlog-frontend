import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { ThemeContextType, ThemeMode, AnimationPreference } from '@/types/theme';
import themeConfig from '@/config/theme.config';

// Create the context with a default undefined value
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Custom hook to use the theme context
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: ThemeMode;
  storageKey?: string;
}

/**
 * Provider component for managing theme mode with system preference detection
 */
export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  defaultTheme = 'system',
  storageKey = 'theme-preference',
}) => {
  // Initialize theme from localStorage or default to system preference
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    // Check if theme preference is stored
    const storedTheme = localStorage.getItem(storageKey);
    if (storedTheme && (storedTheme === 'light' || storedTheme === 'dark' || storedTheme === 'system')) {
      return storedTheme as ThemeMode;
    }
    return defaultTheme;
  });
  
  // Determine if the current theme is dark based on theme setting and system preference
  const [isDark, setIsDark] = useState<boolean>(() => {
    const storedTheme = localStorage.getItem(storageKey) as ThemeMode | null;
    if (storedTheme === 'dark') return true;
    if (storedTheme === 'light') return false;
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Initialize animation preference from localStorage or system preference
  const [animationPreference, setAnimationPreference] = useState<AnimationPreference>(() => {
    if (typeof window === 'undefined') return 'full';
    
    const savedPref = localStorage.getItem('animation-preference');
    if (savedPref && ['full', 'reduced', 'none'].includes(savedPref)) {
      return savedPref as AnimationPreference;
    }
    
    // Check for prefers-reduced-motion
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'reduced' : 'full';
  });

  // Listen for system preference changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Initial setup
    const handleChange = () => {
      if (theme === 'system') {
        setIsDark(mediaQuery.matches);
      }
    };
    
    // Set up the listener
    mediaQuery.addEventListener('change', handleChange);
    
    // Clean up
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  // Apply theme when it changes (both user choice and system preference)
  useEffect(() => {
    // Determine if we should use dark mode
    let newIsDark: boolean;
    
    if (theme === 'system') {
      // Use system preference
      newIsDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    } else {
      // Use user preference
      newIsDark = theme === 'dark';
    }
    
    // Update state
    setIsDark(newIsDark);
    
    // Apply to document
    document.documentElement.classList.toggle('dark', newIsDark);
    
    // Optional: Add meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', newIsDark ? '#111827' : '#ffffff');
    }
  }, [theme]);

  // Update animation preference in localStorage and apply to document
  useEffect(() => {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('animation-preference', animationPreference);
    }
    
    // Apply animation preference to document
    if (typeof document !== 'undefined') {
      if (animationPreference === 'none') {
        document.documentElement.classList.add('no-animation');
        document.documentElement.classList.remove('reduced-motion');
      } else if (animationPreference === 'reduced') {
        document.documentElement.classList.remove('no-animation');
        document.documentElement.classList.add('reduced-motion');
      } else {
        document.documentElement.classList.remove('no-animation', 'reduced-motion');
      }
    }
  }, [animationPreference]);

  // Update theme in localStorage and state
  const setTheme = (newTheme: ThemeMode) => {
    localStorage.setItem(storageKey, newTheme);
    setThemeState(newTheme);
  };

  // For compatibility with components that expect setThemeMode
  const setThemeMode = setTheme;

  // Toggle between light and dark theme (for user-triggered changes)
  const toggleTheme = () => {
    if (theme === 'system') {
      // If currently on system preference, switch to explicit mode based on current appearance
      setTheme(isDark ? 'dark' : 'light');
    } else {
      // Otherwise toggle between light and dark
      setTheme(theme === 'dark' ? 'light' : 'dark');
    }
  };

  // Dynamic accent colors based on theme
  const accentColor = isDark ? themeConfig.darkTheme.text.primary : themeConfig.lightTheme.text.primary;
  const secondaryAccentColor = isDark ? '#9D00FF' : '#6D00FF'; // Custom accent colors

  return (
    <ThemeContext.Provider
      value={{
        theme,
        themeMode: theme, // For compatibility
        isDark,
        setTheme,
        setThemeMode, // Alias for setTheme
        toggleTheme,
        animationPreference,
        setAnimationPreference,
        accentColor,
        secondaryAccentColor,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

// Export the context as default
export default ThemeContext;
