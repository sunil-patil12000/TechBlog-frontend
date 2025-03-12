import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { HelmetProvider } from 'react-helmet-async';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import MainNavigation from '../navigation/MainNavigation';
import Footer from '../navigation/Footer';
import ScrollToTop from '../utils/ScrollToTop';
import { useTheme } from '../../contexts/ThemeContext';
import useAnalytics from '../../hooks/useAnalytics';

const Layout: React.FC = () => {
  const location = useLocation();
  const { theme } = useTheme();
  
  // Add class to body element based on theme
  useEffect(() => {
    document.body.className = theme === 'dark' ? 'dark' : '';
    
    // Set the background and text color based on theme
    if (theme === 'dark') {
      document.body.style.backgroundColor = '#111827'; // gray-900
      document.body.style.color = '#f3f4f6'; // gray-100
    } else {
      document.body.style.backgroundColor = '#ffffff'; // white
      document.body.style.color = '#1f2937'; // gray-800
    }
    
    // Improve font rendering
    document.body.style.textRendering = 'optimizeLegibility';
    document.body.style.WebkitFontSmoothing = 'antialiased';
    document.body.style.MozOsxFontSmoothing = 'grayscale';
  }, [theme]);
  
  // Page transition variants
  const pageVariants = {
    initial: {
      opacity: 0,
      y: 10,
    },
    in: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: 'easeInOut',
      },
    },
    out: {
      opacity: 0,
      y: -10,
      transition: {
        duration: 0.2,
        ease: 'easeInOut',
      },
    },
  };

  // Initialize analytics tracking with automatic page view tracking
  useAnalytics({
    trackPageView: true,
    trackTimeOnPage: true
  });

  return (
    <HelmetProvider>
      <ScrollToTop />
      
      <div className="flex flex-col min-h-screen">
        <MainNavigation />
        
        <main className="flex-grow mt-2 sm:mt-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
        
        <Footer />
      </div>
      
      {/* Global toast notifications */}
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={theme === 'dark' ? 'dark' : 'light'}
      />
    </HelmetProvider>
  );
};

export default Layout;
