import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, Sun, Moon, Search, User, LogOut } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import NotificationCenter from '../admin/NotificationCenter';

interface AdminNavbarProps {
  toggleSidebar: () => void;
}

const AdminNavbar: React.FC<AdminNavbarProps> = ({ toggleSidebar }) => {
  const { isDarkMode, toggleTheme } = useTheme();
  const { logout, currentUser } = useAuth();
  
  return (
    <nav className="h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 z-30">
      <div className="h-full px-4 flex items-center justify-between">
        {/* Left Side - Logo and Mobile Menu Button */}
        <div className="flex items-center">
          <button
            onClick={toggleSidebar}
            className="md:hidden p-2 mr-2 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 focus:outline-none"
          >
            <Menu size={24} />
          </button>
          
          <Link to="/admin" className="text-lg font-bold text-indigo-600 dark:text-indigo-400 md:hidden">
            Admin
          </Link>
        </div>
        
        {/* Center - Search */}
        <div className="hidden md:flex items-center flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-800 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 dark:focus:border-indigo-400 sm:text-sm transition"
            />
          </div>
        </div>
        
        {/* Right Side - Actions and User */}
        <div className="flex items-center space-x-3">
          {/* Notification Center */}
          <NotificationCenter />
          
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white focus:outline-none"
            aria-label="Toggle theme"
          >
            {isDarkMode ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
          </button>
          
          {/* User Menu */}
          <div className="relative">
            {/* User profile dropdown button */}
            <button
              className="flex items-center space-x-2 p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 bg-gray-100 dark:bg-gray-800"
            >
              <img
                src={currentUser?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser?.name || 'User')}&background=random`}
                alt="Profile"
                className="h-8 w-8 rounded-full"
              />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
