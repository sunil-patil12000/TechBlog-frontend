import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Home, ArrowLeft, FileQuestion, Coffee } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const NotFoundPage: React.FC = () => {
  const location = useLocation();
  const path = location.pathname;
  
  // Suggest related pages based on the URL path
  const getSuggestions = () => {
    const pathSegments = path.split('/').filter(Boolean);
    if (pathSegments.length === 0) return [];
    
    // Handle common patterns
    const suggestions = [];
    
    if (path.includes('blog') || path.includes('post')) {
      suggestions.push({ title: 'Latest Posts', url: '/latest', icon: <Coffee size={18} /> });
      suggestions.push({ title: 'All Categories', url: '/categories', icon: <FileQuestion size={18} /> });
    }
    
    if (path.includes('author')) {
      suggestions.push({ title: 'All Posts', url: '/blog', icon: <Coffee size={18} /> });
    }
    
    // Always add these default suggestions if we don't have enough
    if (suggestions.length < 3) {
      if (!suggestions.some(s => s.url === '/')) {
        suggestions.push({ title: 'Home Page', url: '/', icon: <Home size={18} /> });
      }
      if (!suggestions.some(s => s.url === '/blog') && suggestions.length < 3) {
        suggestions.push({ title: 'Blog', url: '/blog', icon: <Coffee size={18} /> });
      }
      if (!suggestions.some(s => s.url === '/about') && suggestions.length < 3) {
        suggestions.push({ title: 'About Us', url: '/about', icon: <FileQuestion size={18} /> });
      }
    }
    
    return suggestions.slice(0, 3); // Return max 3 suggestions
  };

  const suggestions = getSuggestions();

  return (
    <>
      <Helmet>
        <title>Page Not Found | Blog</title>
        <meta name="description" content="The page you are looking for doesn't exist." />
      </Helmet>
      
      <div className="min-h-[80vh] flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center p-8 max-w-lg w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl"
        >
          <motion.h1 
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-7xl font-bold text-red-500 dark:text-red-400 mb-4"
          >
            404
          </motion.h1>
          
          <h2 className="text-3xl font-medium text-gray-700 dark:text-gray-300 mb-4">Page Not Found</h2>
          
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            The page <span className="font-mono text-red-500 dark:text-red-400 px-1 py-0.5 bg-gray-100 dark:bg-gray-700 rounded">{path}</span> could not be found.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
            <Link
              to="/"
              className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Home size={18} />
              Home
            </Link>
            
            <button
              onClick={() => window.history.back()}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              <ArrowLeft size={18} />
              Go Back
            </button>
          </div>
          
          {suggestions.length > 0 && (
            <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6">
              <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-4">
                You might be looking for:
              </h3>
              
              <div className="flex flex-col gap-3">
                {suggestions.map((suggestion, index) => (
                  <Link
                    key={index}
                    to={suggestion.url}
                    className="flex items-center gap-2 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    {suggestion.icon}
                    <span>{suggestion.title}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
          
          <div className="mt-8 text-sm text-gray-500 dark:text-gray-400">
            If you believe this is an error, please <Link to="/contact" className="text-blue-600 dark:text-blue-400 hover:underline">contact us</Link>.
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default NotFoundPage;