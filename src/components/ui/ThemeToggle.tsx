import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Moon, Sun, Monitor } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
  iconSize?: number;
  variant?: 'icon' | 'button' | 'menu';
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({
  className = '',
  showLabel = false,
  iconSize = 20,
  variant = 'icon',
}) => {
  const { theme, isDark, setTheme, toggleTheme } = useTheme();
  const [isClient, setIsClient] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  // Handle hydration mismatch by only rendering the component client-side
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // Don't render anything during SSR
  if (!isClient) return null;

  // Get theme icon and label
  const getThemeIcon = () => {
    if (theme === 'system') return <Monitor size={iconSize} />;
    return isDark ? <Moon size={iconSize} /> : <Sun size={iconSize} />;
  };
  
  const getThemeLabel = () => {
    if (theme === 'system') return 'System';
    return isDark ? 'Dark' : 'Light';
  };
  
  // For menu variant - handles direct mode switching
  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme);
  };
  
  if (variant === 'menu') {
    return (
      <div className={`relative ${className}`}>
        <button
          onClick={() => setIsHovered(!isHovered)}
          onBlur={() => setTimeout(() => setIsHovered(false), 100)}
          className="flex items-center gap-2 p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          aria-label="Change theme"
        >
          {getThemeIcon()}
          {showLabel && <span>{getThemeLabel()}</span>}
        </button>
        
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-0 mt-1 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 p-1 min-w-[120px] z-10"
          >
            <button
              onClick={() => handleThemeChange('light')}
              className={`flex items-center gap-2 w-full px-3 py-1.5 text-left text-sm rounded ${
                theme === 'light' 
                  ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400' 
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <Sun size={16} />
              <span>Light</span>
            </button>
            <button
              onClick={() => handleThemeChange('dark')}
              className={`flex items-center gap-2 w-full px-3 py-1.5 text-left text-sm rounded ${
                theme === 'dark' 
                  ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400' 
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <Moon size={16} />
              <span>Dark</span>
            </button>
            <button
              onClick={() => handleThemeChange('system')}
              className={`flex items-center gap-2 w-full px-3 py-1.5 text-left text-sm rounded ${
                theme === 'system' 
                  ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400' 
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <Monitor size={16} />
              <span>System</span>
            </button>
          </motion.div>
        )}
      </div>
    );
  }
  
  if (variant === 'button') {
    return (
      <button
        onClick={toggleTheme}
        className={`flex items-center gap-2 px-3 py-2 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${className}`}
        aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      >
        <motion.div
          key={theme}
          initial={{ scale: 0.5, opacity: 0, rotate: -30 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          exit={{ scale: 0.5, opacity: 0, rotate: 30 }}
          transition={{ duration: 0.2 }}
        >
          {getThemeIcon()}
        </motion.div>
        {showLabel && <span>{getThemeLabel()}</span>}
      </button>
    );
  }
  
  // Default icon variant
  return (
    <button
      onClick={toggleTheme}
      className={`p-2 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${className}`}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      <motion.div
        key={theme}
        animate={{
          rotate: [0, 15, 0],
          scale: [1, 1.15, 1],
        }}
        transition={{ duration: 0.5 }}
      >
        {getThemeIcon()}
      </motion.div>
    </button>
  );
};

export default ThemeToggle;
