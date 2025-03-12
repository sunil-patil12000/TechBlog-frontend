import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useHotkeys } from 'react-hotkeys-hook';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Search, Sun, Moon, ChevronDown, User, Shield, LogOut } from 'lucide-react';
import { useAuth, useTheme } from '../../contexts';
import IntelligentSearch from '../ui/IntelligentSearch';
import useScrollPosition from '../../hooks/useScrollPosition';
import { cn } from '@/lib/utils';
import { cva } from 'class-variance-authority';
import Avatar from '../shared/Avatar';
import { normalizeImageUrl } from '../../utils/contentProcessor';
import { DEFAULT_AVATAR } from '../../config/constants';

interface NavigationItem {
  label: string;
  path: string;
  children?: Array<{
    label: string;
    path: string;
    description?: string;
  }>;
}

const navigationItems: NavigationItem[] = [
  { label: 'Home', path: '/' },
  { 
    label: 'Tech News', 
    path: '/blog',
    children: [
      { 
        label: 'Latest News', 
        path: '/blog',
        description: 'Browse the latest tech news'
      },
      { 
        label: 'Categories', 
        path: '/blog/categories',
        description: 'Browse by news category'
      },
      { 
        label: 'Topics', 
        path: '/blog/tags',
        description: 'Browse by tech topics'
      },
    ]
  },
  { 
    label: 'Events', 
    path: '/events',
    children: [
      { 
        label: 'Upcoming Events', 
        path: '/events',
        description: 'Tech conferences and meetups'
      },
      { 
        label: 'Past Events', 
        path: '/events/past',
        description: 'Event coverage and recaps'
      }
    ]
  },
  { label: 'About', path: '/about' },
  { label: 'Contact', path: '/contact' }
];

const linkVariants = cva(
  'text-sm font-medium transition-colors focus:outline-none',
  {
    variants: {
      variant: {
        default: 'text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400',
        active: 'text-indigo-600 dark:text-indigo-400',
        highlight: 'bg-indigo-600 text-white hover:bg-indigo-700'
      }
    },
    defaultVariants: {
      variant: 'default'
    }
  }
);

const MainNavigation: React.FC = () => {
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuth();
  const { theme, toggleTheme, isDark, setThemeMode } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const navbarRef = useRef<HTMLDivElement>(null);
  
  // Use our custom scroll position hook
  const { 
    scrollDirection, 
    isVisible, 
    isAtTop,
    hasScrolled
  } = useScrollPosition({
    scrollDownThreshold: 100, // Only hide navigation after scrolling down 100px
    thresholdUp: 30,         // Show navigation after scrolling up at least 30px
    thresholdDown: 60        // Hide navigation after scrolling down at least 60px
  });
  
  // Handle keyboard shortcuts
  useHotkeys('meta+k', (event) => {
    event.preventDefault();
    setIsSearchOpen(true);
  });
  
  useHotkeys('escape', () => {
    if (isSearchOpen) setIsSearchOpen(false);
    if (activeDropdown) setActiveDropdown(null);
  });

  // Close the mobile menu when the route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  // Click outside to close dropdowns
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (navbarRef.current && !navbarRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDropdown = (label: string) => {
    setActiveDropdown(prev => prev === label ? null : label);
  };
  
  const renderDesktopNavItems = () => (
    navigationItems.map(item => {
      if (item.children) {
        return (
          <div 
            key={item.label} 
            className="relative group"
            onMouseEnter={() => setActiveDropdown(item.label)}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button
              className={cn(
                linkVariants({ variant: activeDropdown === item.label ? 'active' : 'default' }),
                'px-3 py-2 flex items-center gap-1 rounded-lg'
              )}
              onClick={() => toggleDropdown(item.label)}
            >
              {item.label}
              {item.children && (
                <ChevronDown 
                  size={16} 
                  className={cn(
                    'transition-transform',
                    activeDropdown === item.label && 'rotate-180'
                  )} 
                />
              )}
            </button>
            
            {item.children && (
              <AnimatePresence>
                {activeDropdown === item.label && (
                  <motion.div
                    className="absolute left-0 z-10 w-48 mt-2 origin-top"
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  >
                    <div className="p-2 bg-white/95 dark:bg-gray-800/95 rounded-lg shadow-xl ring-1 ring-gray-900/5 dark:ring-gray-100/5 backdrop-blur-lg">
                      {item.children.map(child => (
                        <Link
                          key={child.path}
                          to={child.path}
                          className="flex items-start p-3 space-x-2 rounded-md transition-colors hover:bg-gray-100/50 dark:hover:bg-gray-700/50"
                        >
                          <div className="flex-1">
                            <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                              {child.label}
                            </div>
                            {child.description && (
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                {child.description}
                              </p>
                            )}
                          </div>
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </div>
        );
      }
      
      return (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) => 
            cn(
              linkVariants({ variant: isActive ? 'active' : 'default' }),
              'px-3 py-2 rounded-lg'
            )
          }
        >
          {item.label}
        </NavLink>
      );
    })
  );

  const renderMobileNavItems = () => (
    <div className="px-2 pt-2 pb-3 space-y-1">
      {navigationItems.map(item => {
        if (item.children) {
          return (
            <div key={item.label} className="space-y-2">
              <button
                className={`w-full flex justify-between items-center px-3 py-2 text-left rounded-md ${
                  activeDropdown === item.label
                    ? 'bg-indigo-50 dark:bg-gray-700 text-indigo-600 dark:text-indigo-400'
                    : 'text-gray-700 dark:text-gray-300'
                }`}
                onClick={() => toggleDropdown(item.label)}
              >
                {item.label}
                <ChevronDown 
                  size={16} 
                  className={`transition-transform ${activeDropdown === item.label ? 'rotate-180' : ''}`} 
                />
              </button>
              
              <AnimatePresence>
                {activeDropdown === item.label && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="pl-4 space-y-1">
                      {item.children.map(child => (
                        <NavLink
                          key={child.path}
                          to={child.path}
                          onClick={() => setIsMenuOpen(false)}
                          className={({ isActive }) => 
                            `block px-3 py-2 rounded-md text-sm ${
                              isActive 
                                ? 'bg-indigo-50 dark:bg-gray-700 text-indigo-600 dark:text-indigo-400' 
                                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                            }`
                          }
                        >
                          {child.label}
                        </NavLink>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        }
        
        return (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={() => setIsMenuOpen(false)}
            className={({ isActive }) => 
              `block px-3 py-2 rounded-md text-sm font-medium ${
                isActive 
                  ? 'bg-indigo-50 dark:bg-gray-700 text-indigo-600 dark:text-indigo-400' 
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`
            }
          >
            {item.label}
          </NavLink>
        );
      })}

      {/* Mobile Auth Links */}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
        {isAuthenticated ? (
          <>
            <div className="px-3 py-2 text-sm font-medium text-gray-500 dark:text-gray-400">
              Signed in as {user?.name}
            </div>
            <Link
              to="/profile"
              className="block px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => setIsMenuOpen(false)}
            >
              Profile
            </Link>
            {user?.isAdmin && (
              <Link
                to="/admin"
                className="block px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => setIsMenuOpen(false)}
              >
                Admin Dashboard
              </Link>
            )}
            <button
              onClick={() => {
                logout();
                setIsMenuOpen(false);
              }}
              className="block w-full text-left px-3 py-2 rounded-md text-sm font-medium text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Sign out
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="block px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => setIsMenuOpen(false)}
            >
              Sign in
            </Link>
            <Link
              to="/register"
              className="block px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => setIsMenuOpen(false)}
            >
              Register
            </Link>
          </>
        )}
      </div>
    </div>
  );

  // Implement a reusable theme toggle button component
  const ThemeToggleButton = ({ className, ariaLabel }: { className: string, ariaLabel?: string }) => (
    <button
      onClick={() => {
        if (theme === 'light') setThemeMode('dark');
        else if (theme === 'dark') setThemeMode('system');
        else setThemeMode('light');
      }}
      className={className}
      aria-label={ariaLabel || "Theme Toggle"}
    >
      {theme === 'light' && <Sun size={20} />}
      {theme === 'dark' && <Moon size={20} />}
      {theme === 'system' && (isDark ? <Moon size={20} /> : <Sun size={20} />)}
    </button>
  );

  const navbarShadowClass = hasScrolled && !isAtTop ? 'shadow-md' : 'shadow-sm';
  const navbarBgOpacity = isAtTop ? 'bg-opacity-95' : 'bg-opacity-100';

  return (
    <header className={cn(
      'fixed top-0 left-0 w-full z-50 transition-all duration-300',
      'bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-800/50',
      isVisible ? 'translate-y-0' : '-translate-y-full'
    )}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <motion.div whileHover={{ scale: 1.05 }} className="flex items-center">
            <Link to="/" className="flex items-center" aria-label="Home">
              <img 
                src="/images/logo.svg" 
                alt="TechPulse Logo" 
                className="h-7 w-auto dark:filter dark:invert"
              />
              <span className="ml-2 text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                TechPulse
              </span>
            </Link>
          </motion.div>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center space-x-2">
            {renderDesktopNavItems()}
          </nav>

          {/* Right Controls */}
          <div className="flex items-center gap-2">
            {/* Enhanced Search Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsSearchOpen(true)}
              className="p-2 rounded-lg bg-gray-100/50 dark:bg-gray-800/50 hover:bg-gray-200/50 dark:hover:bg-gray-700/50 transition-colors"
              aria-label="Search"
            >
              <Search size={20} className="text-gray-600 dark:text-gray-300" />
            </motion.button>

            {/* Modern Theme Toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100/50 dark:bg-gray-800/50 hover:bg-gray-200/50 dark:hover:bg-gray-700/50 transition-colors"
            >
              {theme === 'light' ? (
                <Sun size={20} className="text-amber-500" />
              ) : (
                <Moon size={20} className="text-indigo-400" />
              )}
            </motion.button>

            {/* Auth Section */}
            {isAuthenticated ? (
              <div className="relative ml-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center gap-2 p-1.5 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600"
                  onClick={() => toggleDropdown('profile')}
                >
                  <Avatar
                    src={user?.avatar ? normalizeImageUrl(user.avatar) : ''}
                    alt={user?.name || 'User'}
                    size="sm"
                    className="border-2 border-white/20"
                    fallbackClassName="text-white bg-indigo-900/50"
                  />
                </motion.button>

                <AnimatePresence>
                  {activeDropdown === 'profile' && (
                    <motion.div
                      className="absolute right-0 mt-2 w-64 origin-top"
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    >
                      <div className="p-2 bg-white/95 dark:bg-gray-800/95 rounded-xl shadow-xl ring-1 ring-gray-900/5 dark:ring-gray-100/5 backdrop-blur-lg">
                        <div className="p-3">
                          <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {user?.name}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {user?.email}
                          </div>
                        </div>
                        <div className="border-t border-gray-200/50 dark:border-gray-700/50" />
                        <div className="p-2 space-y-1">
                          <Link
                            to="/profile"
                            className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100/50 dark:hover:bg-gray-700/50"
                          >
                            <User size={16} className="text-gray-600 dark:text-gray-300" />
                            <span className="text-sm">Profile</span>
                          </Link>
                          {user?.isAdmin && (
                            <Link
                              to="/admin"
                              className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100/50 dark:hover:bg-gray-700/50"
                            >
                              <Shield size={16} className="text-gray-600 dark:text-gray-300" />
                              <span className="text-sm">Admin Dashboard</span>
                            </Link>
                          )}
                          <button
                            onClick={logout}
                            className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-red-50/50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400"
                          >
                            <LogOut size={16} />
                            <span className="text-sm">Sign out</span>
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={cn(
                    linkVariants({ variant: 'default' }),
                    'px-4 py-2 rounded-lg bg-gray-100/50 dark:bg-gray-800/50'
                  )}
                >
                  <Link to="/login">Sign in</Link>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={cn(
                    linkVariants({ variant: 'highlight' }),
                    'px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-shadow'
                  )}
                >
                  <Link to="/register">Get Started</Link>
                </motion.button>
              </div>
            )}
          </div>
          
          {/* Mobile Menu Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg bg-gray-100/50 dark:bg-gray-800/50 hover:bg-gray-200/50 dark:hover:bg-gray-700/50 transition-colors"
          >
            {isMenuOpen ? (
              <X size={24} className="text-gray-600 dark:text-gray-300" />
            ) : (
              <Menu size={24} className="text-gray-600 dark:text-gray-300" />
            )}
          </motion.button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="md:hidden"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <div className="px-4 pt-2 pb-4 space-y-2">
              {navigationItems.map((item) => (
                <div key={item.label} className="space-y-1">
                  <button
                    onClick={() => toggleDropdown(item.label)}
                    className="flex items-center justify-between w-full p-3 rounded-xl bg-gray-100/50 dark:bg-gray-800/50"
                  >
                    <span className="text-gray-900 dark:text-gray-100">{item.label}</span>
                    {item.children && (
                      <ChevronDown
                        size={16}
                        className={cn(
                          'transition-transform',
                          activeDropdown === item.label && 'rotate-180'
                        )}
                      />
                    )}
                  </button>
                  
                  {item.children && (
                    <AnimatePresence>
                      {activeDropdown === item.label && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden pl-4"
                        >
                          <div className="space-y-1">
                            {item.children.map(child => (
                              <Link
                                key={child.path}
                                to={child.path}
                                className="block p-3 text-sm rounded-lg hover:bg-gray-100/50 dark:hover:bg-gray-700/50"
                              >
                                {child.label}
                              </Link>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Search Modal */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative top-24 max-w-2xl mx-auto bg-white/95 dark:bg-gray-800/95 rounded-xl shadow-2xl backdrop-blur-lg border border-gray-200/50 dark:border-gray-700/50"
            >
              <IntelligentSearch onClose={() => setIsSearchOpen(false)} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default MainNavigation; 