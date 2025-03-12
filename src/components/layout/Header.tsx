import React, { useState, useEffect, useCallback } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useTheme } from '@/contexts';
import { MoonIcon, SunIcon, SystemIcon, MenuIcon, SearchIcon, CloseIcon } from '@/components/icons';
import throttle from 'lodash/throttle';
import { motion, AnimatePresence } from 'framer-motion';
import { useHotkeys } from 'react-hotkeys-hook';
import SearchModal from '@/components/search/SearchModal';

const Header: React.FC = () => {
  const { isDark, themeMode, setThemeMode } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const location = useLocation();

  // Close mobile menu when location changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  // Handle scroll behavior with throttling for performance
  const handleScroll = useCallback(throttle(() => {
    const currentScrollY = window.scrollY;
    const scrollThreshold = 50;
    
    if (currentScrollY > scrollThreshold && !isScrolled) {
      setIsScrolled(true);
    } else if (currentScrollY <= scrollThreshold && isScrolled) {
      setIsScrolled(false);
    }
  }, 100), [isScrolled]);

  // Add scroll event listener
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      handleScroll.cancel();
    };
  }, [handleScroll]);

  // Hotkeys for accessibility
  useHotkeys('alt+s', () => setSearchOpen(true), { enableOnFormTags: true });
  useHotkeys('alt+m', () => setMobileMenuOpen(prev => !prev), { enableOnFormTags: true });
  useHotkeys('alt+t', () => {
    setThemeMode(prev => {
      if (prev === 'light') return 'dark';
      if (prev === 'dark') return 'system';
      return 'light';
    });
  }, { enableOnFormTags: true });

  // Theme toggle button icon renderer
  const renderThemeIcon = () => {
    if (themeMode === 'light') return <SunIcon className="h-5 w-5" />;
    if (themeMode === 'dark') return <MoonIcon className="h-5 w-5" />;
    return <SystemIcon className="h-5 w-5" />;
  };

  return (
    <>
      <header
        className={`w-full fixed top-0 left-0 right-0 z-sticky transition-all duration-300 ${
          isScrolled 
            ? 'bg-white/90 dark:bg-gray-900/95 backdrop-blur-md shadow-md py-2 border-b border-gray-200 dark:border-gray-800' 
            : 'bg-transparent py-4'
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <Link 
              to="/" 
              className="flex items-center"
              aria-label="Go to homepage"
            >
              <div className={`h-8 w-auto transition-colors duration-300 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                <img 
                  src="/images/logo.svg" 
                  alt="TechPulse Logo" 
                  className={`h-6 w-auto ${isDark ? 'filter invert' : ''}`}
                />
              </div>
              <span className="text-xl font-medium text-indigo-600 dark:text-indigo-400">TechPulse</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <NavLink 
                to="/" 
                className={({ isActive }) => 
                  `text-sm font-medium transition-colors hover:text-primary-600 dark:hover:text-primary-400 relative after:absolute after:bottom-[-4px] after:left-0 after:right-0 after:h-0.5 after:bg-primary-600 dark:after:bg-primary-400 after:scale-x-0 after:origin-left after:transition-transform hover:after:scale-x-100 ${
                    isActive 
                      ? 'text-primary-600 dark:text-primary-400 after:scale-x-100' 
                      : 'text-gray-700 dark:text-gray-300'
                  }`
                }
                end
              >
                Home
              </NavLink>
              
              <NavLink 
                to="/blog" 
                className={({ isActive }) => 
                  `text-sm font-medium transition-colors hover:text-primary-600 dark:hover:text-primary-400 ${
                    isActive 
                      ? 'text-primary-600 dark:text-primary-400' 
                      : 'text-gray-700 dark:text-gray-300'
                  }`
                }
              >
                Blog
              </NavLink>
              
              <NavLink 
                to="/projects" 
                className={({ isActive }) => 
                  `text-sm font-medium transition-colors hover:text-primary-600 dark:hover:text-primary-400 ${
                    isActive 
                      ? 'text-primary-600 dark:text-primary-400' 
                      : 'text-gray-700 dark:text-gray-300'
                  }`
                }
              >
                Projects
              </NavLink>
              
              <NavLink 
                to="/events" 
                className={({ isActive }) => 
                  `text-sm font-medium transition-colors hover:text-primary-600 dark:hover:text-primary-400 ${
                    isActive 
                      ? 'text-primary-600 dark:text-primary-400' 
                      : 'text-gray-700 dark:text-gray-300'
                  }`
                }
              >
                Events
              </NavLink>
              
              <NavLink 
                to="/about" 
                className={({ isActive }) => 
                  `text-sm font-medium transition-colors hover:text-primary-600 dark:hover:text-primary-400 ${
                    isActive 
                      ? 'text-primary-600 dark:text-primary-400' 
                      : 'text-gray-700 dark:text-gray-300'
                  }`
                }
              >
                About
              </NavLink>
            </nav>

            <div className="flex items-center space-x-4">
              {/* Search Button */}
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 rounded-full text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 transition-colors"
                aria-label="Open search (Alt+S)"
              >
                <SearchIcon className="h-5 w-5" />
              </button>
              
              {/* Theme Toggle */}
              <button
                onClick={() => {
                  setThemeMode(prev => {
                    if (prev === 'light') return 'dark';
                    if (prev === 'dark') return 'system';
                    return 'light';
                  });
                }}
                className="p-2 rounded-full text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 transition-colors"
                aria-label="Toggle theme (Alt+T)"
              >
                {renderThemeIcon()}
              </button>
              
              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-full text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 transition-colors"
                aria-label="Toggle mobile menu (Alt+M)"
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? (
                  <CloseIcon className="h-5 w-5" />
                ) : (
                  <MenuIcon className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="fixed top-[60px] left-0 right-0 bg-white dark:bg-gray-900 shadow-lg z-50 rounded-b-xl overflow-hidden md:hidden border-b border-gray-200 dark:border-gray-800"
            >
              <nav className="flex flex-col px-4 py-5 max-h-[70vh] overflow-y-auto">
                <NavLink 
                  to="/" 
                  className={({ isActive }) => 
                    `py-3 px-4 text-base font-medium transition-colors rounded-lg flex items-center ${
                      isActive 
                        ? 'bg-primary-50 text-primary-600 dark:bg-gray-800 dark:text-primary-400' 
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`
                  }
                  end
                >
                  Home
                </NavLink>
                
                <NavLink 
                  to="/blog" 
                  className={({ isActive }) => 
                    `py-3 px-4 text-base font-medium transition-colors rounded-lg flex items-center ${
                      isActive 
                        ? 'bg-primary-50 text-primary-600 dark:bg-gray-800 dark:text-primary-400' 
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`
                  }
                >
                  Blog
                </NavLink>
                
                <NavLink 
                  to="/projects" 
                  className={({ isActive }) => 
                    `py-3 px-4 text-base font-medium transition-colors rounded-lg flex items-center ${
                      isActive 
                        ? 'bg-primary-50 text-primary-600 dark:bg-gray-800 dark:text-primary-400' 
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`
                  }
                >
                  Projects
                </NavLink>
                
                <NavLink 
                  to="/events" 
                  className={({ isActive }) => 
                    `py-3 px-4 text-base font-medium transition-colors rounded-lg flex items-center ${
                      isActive 
                        ? 'bg-primary-50 text-primary-600 dark:bg-gray-800 dark:text-primary-400' 
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`
                  }
                >
                  Events
                </NavLink>
                
                <NavLink 
                  to="/about" 
                  className={({ isActive }) => 
                    `py-3 px-4 text-base font-medium transition-colors rounded-lg flex items-center ${
                      isActive 
                        ? 'bg-primary-50 text-primary-600 dark:bg-gray-800 dark:text-primary-400' 
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`
                  }
                >
                  About
                </NavLink>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Search Modal */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
};

export default Header;