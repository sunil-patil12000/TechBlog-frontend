import React from 'react';
import { useAuth, useTheme } from '../../contexts';

const AdminHeader: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between px-6 py-3">
        <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
          Admin Portal
        </h1>
        
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? '🌞' : '🌙'}
          </button>
          
          <div className="relative group">
            <button className="flex items-center space-x-2">
              <img 
                src={currentUser?.profileImage || "https://via.placeholder.com/40"} 
                alt="Admin avatar" 
                className="w-8 h-8 rounded-full object-cover"
              />
              <span className="text-gray-800 dark:text-gray-200">{currentUser?.name || 'Admin'}</span>
            </button>
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg hidden group-hover:block z-10">
              <div className="py-1">
                <button
                  onClick={logout}
                  className="w-full text-left block px-4 py-2 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
