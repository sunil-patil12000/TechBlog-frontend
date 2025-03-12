import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Github, Twitter, Linkedin, Mail, ArrowRight } from 'lucide-react';
import { useTheme } from '../../contexts';

const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [subscribeSuccess, setSubscribeSuccess] = useState(false);
  const [subscribeError, setSubscribeError] = useState('');
  const { isDark } = useTheme();
  
  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim() || !email.includes('@')) {
      setSubscribeError('Please enter a valid email address');
      return;
    }
    
    setIsSubscribing(true);
    setSubscribeError('');
    
    try {
      // Simulate API call - replace with actual newsletter subscription API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSubscribeSuccess(true);
      setEmail('');
    } catch (error) {
      setSubscribeError('Failed to subscribe. Please try again later.');
    } finally {
      setIsSubscribing(false);
    }
  };
  
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and info */}
          <div className="md:col-span-1">
            <div className="flex flex-col space-y-4">
              <Link to="/" className="flex items-center">
                <img src={isDark ? '/logo-white.svg' : '/logo.svg'} alt="TechPulse Logo" className="h-8 w-auto mr-2" />
                <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">TechPulse</span>
              </Link>
              <p className="text-gray-600 dark:text-gray-400 max-w-xs">
                Your source for the latest tech news, events, and innovations from around the globe.
              </p>
              <div className="flex space-x-4">
                <a 
                  href="https://github.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 transition-colors"
                  aria-label="GitHub"
                >
                  <Github size={20} />
                </a>
                <a 
                  href="https://twitter.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 transition-colors"
                  aria-label="Twitter"
                >
                  <Twitter size={20} />
                </a>
                <a 
                  href="https://linkedin.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin size={20} />
                </a>
                <a 
                  href="mailto:info@techblog.com" 
                  className="text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 transition-colors"
                  aria-label="Email"
                >
                  <Mail size={20} />
                </a>
              </div>
            </div>
          </div>
          
          {/* Quick links sections */}
          <div className="md:col-span-2 grid grid-cols-2 gap-8">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">
                Content
              </h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <Link 
                    to="/blog" 
                    className="text-sm text-gray-600 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 transition-colors"
                  >
                    All Articles
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/blog/categories" 
                    className="text-sm text-gray-600 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 transition-colors"
                  >
                    Categories
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/blog/tags" 
                    className="text-sm text-gray-600 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 transition-colors"
                  >
                    Tags
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/archives" 
                    className="text-sm text-gray-600 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 transition-colors"
                  >
                    Archives
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">
                Company
              </h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <Link 
                    to="/about" 
                    className="text-sm text-gray-600 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 transition-colors"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/projects" 
                    className="text-sm text-gray-600 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 transition-colors"
                  >
                    Projects
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/contact" 
                    className="text-sm text-gray-600 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 transition-colors"
                  >
                    Contact
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/privacy" 
                    className="text-sm text-gray-600 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          
          {/* Newsletter */}
          <div className="md:col-span-1">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">
              Subscribe to Newsletter
            </h3>
            <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
              Get the latest articles and resources sent straight to your inbox.
            </p>
            
            {subscribeSuccess ? (
              <div className="mt-3 p-3 bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300 text-sm rounded">
                Thanks for subscribing! Please check your email to confirm.
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="mt-4">
                <div className="flex">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="min-w-0 flex-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-l-md py-2 px-4 text-sm text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                  <button
                    type="submit"
                    disabled={isSubscribing}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-r-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isSubscribing ? 'Subscribing...' : <ArrowRight size={16} />}
                  </button>
                </div>
                {subscribeError && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-400">{subscribeError}</p>
                )}
              </form>
            )}
          </div>
        </div>
        
        <div className="border-t border-gray-200 dark:border-gray-800 pt-8 mt-8">
          <div className="container mx-auto px-4">
            <div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                &copy; {new Date().getFullYear()} TechPulse. All rights reserved.
              </p>
              {/* ... rest of the section ... */}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
