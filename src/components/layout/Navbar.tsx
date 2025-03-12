import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Sun, Moon, ChevronDown, Menu, X, LogOut, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import SearchModal from '../search/SearchModal';
import { normalizeImageUrl } from '../../utils/contentProcessor';
import { DEFAULT_AVATAR } from '../../config/constants';

const Navbar: React.FC = () => {
  const { isDark, themeMode, setThemeMode, toggleTheme } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Tech News', path: '/tech-news', hasDropdown: true },
    { name: 'Events', path: '/events', hasDropdown: true },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' }
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (query: string) => {
    setSearchOpen(false);
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  // Helper function to get the right theme icon
  const getThemeIcon = () => {
    if (themeMode === 'light') return <Sun className="w-5 h-5" />;
    if (themeMode === 'dark') return <Moon className="w-5 h-5" />;
    // For system, show based on current appearance
    return isDark ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />;
  };

  // Handle theme toggle logic
  const handleThemeToggle = () => {
    if (themeMode === 'light') {
      setThemeMode('dark');
    } else if (themeMode === 'dark') {
      setThemeMode('system');
    } else {
      setThemeMode('light');
    }
  };

  return (
    <>
      <nav className={`sticky top-0 z-50 border-b ${
        scrolled 
          ? 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800' 
          : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800'
      }`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center gap-2">
                <img 
                  src="/images/logo.svg" 
                  alt="TechPulse Logo" 
                  className={`h-6 w-auto ${isDark ? 'filter invert' : ''}`}
                />
                <span className="text-xl font-medium text-indigo-600 dark:text-indigo-400">TechPulse</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => (
                <div 
                  key={item.path}
                  className="relative group"
                  onMouseEnter={() => item.hasDropdown ? setOpenDropdown(item.path) : undefined}
                  onMouseLeave={() => item.hasDropdown ? setOpenDropdown(null) : undefined}
                >
                  <Link 
                    to={item.path} 
                    className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                  >
                    <span>{item.name}</span>
                    {item.hasDropdown && (
                      <ChevronDown className="w-4 h-4 ml-1 opacity-70" />
                    )}
                  </Link>

                  {item.hasDropdown && (
                    <AnimatePresence>
                      {openDropdown === item.path && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute top-full left-0 w-48 mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-100 dark:border-gray-700"
                        >
                          <div className="p-2 space-y-1">
                            <Link
                              to={`${item.path}/latest`}
                              className="flex items-center px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md"
                            >
                              Latest {item.name}
                            </Link>
                            <Link
                              to={`${item.path}/featured`}
                              className="flex items-center px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md"
                            >
                              Featured {item.name}
                            </Link>
                            <Link
                              to={`${item.path}/popular`}
                              className="flex items-center px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md"
                            >
                              Popular {item.name}
                            </Link>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}
                </div>
              ))}
            </div>

            {/* Right Side Controls */}
            <div className="flex items-center space-x-1">
              <button 
                onClick={() => setSearchOpen(true)}
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>

              <button
                onClick={handleThemeToggle}
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                aria-label="Toggle theme"
              >
                {getThemeIcon()}
              </button>

              {user ? (
                <div className="relative">
                  <button 
                    className="flex items-center ml-2"
                    onClick={() => setOpenDropdown(openDropdown === 'user' ? null : 'user')}
                  >
                    <img 
                      src={user.avatar ? normalizeImageUrl(user.avatar) : DEFAULT_AVATAR}
                      alt={user.name || 'User profile'}
                      className="w-8 h-8 rounded-full border border-gray-200 dark:border-gray-700 object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = DEFAULT_AVATAR;
                      }}
                    />
                    <ChevronDown className="w-4 h-4 ml-1 text-gray-600 dark:text-gray-400" />
                  </button>

                  <AnimatePresence>
                    {openDropdown === 'user' && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-100 dark:border-gray-700"
                        onMouseLeave={() => setOpenDropdown(null)}
                      >
                        <div className="p-2 space-y-1">
                          <Link
                            to="/profile"
                            className="flex items-center px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md"
                          >
                            <User className="w-4 h-4 mr-2" />
                            Profile
                          </Link>
                          <Link
                            to="/bookmarks"
                            className="flex items-center px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md"
                          >
                            <Bookmark className="w-4 h-4 mr-2" />
                            Bookmarks
                          </Link>
                          <button className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md">
                            Log Out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="ml-2 px-4 py-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300"
                >
                  Sign In
                </Link>
              )}

              <button
                className="md:hidden p-2 text-gray-600 dark:text-gray-400 ml-1"
                onClick={() => setIsOpen(!isOpen)}
              >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="md:hidden overflow-hidden border-t border-gray-200 dark:border-gray-700 mt-2"
              >
                <div className="py-3 space-y-1">
                  {navItems.map((item) => (
                    <div key={item.path}>
                      <Link
                        to={item.path}
                        className="block px-4 py-2 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                        onClick={() => setIsOpen(false)}
                      >
                        {item.name}
                      </Link>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>

      {/* Search Modal */}
      <AnimatePresence>
        {searchOpen && (
          <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} onSearch={handleSearch} />
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar; 