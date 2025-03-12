import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, ArrowRight, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';

interface NewsletterFormProps {
  title?: string;
  description?: string;
  className?: string;
}

const NewsletterForm: React.FC<NewsletterFormProps> = ({
  title = 'Stay Updated',
  description = 'Subscribe to our newsletter for the latest articles and updates.',
  className = '',
}) => {
  const [email, setEmail] = useState('');
  const [state, setState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic email validation
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setState('error');
      setErrorMessage('Please enter a valid email address');
      return;
    }

    setState('loading');
    
    try {
      // In a real application, you would make an API call here
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate successful subscription
      setState('success');
      setEmail('');
    } catch (error) {
      setState('error');
      setErrorMessage('Something went wrong. Please try again.');
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={`bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/30 
        rounded-2xl p-8 shadow-lg border border-indigo-100 dark:border-indigo-800/30 ${className}`}
    >
      <div className="flex items-center gap-2 mb-3">
        <div className="bg-indigo-500 rounded-full p-2 text-white">
          <Mail size={18} strokeWidth={2} />
        </div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h3>
      </div>
      
      <p className="text-gray-600 dark:text-gray-300 mb-6">
        {description}
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (state === 'error') setState('idle');
            }}
            placeholder="Your email address"
            disabled={state === 'loading' || state === 'success'}
            className={`w-full px-4 py-3 rounded-lg bg-white dark:bg-gray-800 
              border ${state === 'error' 
                ? 'border-red-300 dark:border-red-700 focus:ring-red-500' 
                : 'border-gray-300 dark:border-gray-700 focus:ring-indigo-500'
              }
              text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400
              focus:outline-none focus:ring-2 disabled:opacity-60 disabled:cursor-not-allowed
              transition-all duration-200`}
            aria-label="Email address"
            aria-invalid={state === 'error'}
            aria-describedby={state === 'error' ? "newsletter-error" : undefined}
          />

          {state === 'error' && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              id="newsletter-error"
              className="absolute -bottom-6 left-0 text-sm text-red-500 dark:text-red-400 flex items-center gap-1"
            >
              <AlertCircle size={14} />
              <span>{errorMessage}</span>
            </motion.div>
          )}
        </div>

        <motion.button
          type="submit"
          disabled={!email || state === 'loading' || state === 'success'}
          className={`w-full flex items-center justify-center py-3 px-6 rounded-lg font-medium text-white
            ${state === 'success' 
              ? 'bg-green-500 hover:bg-green-600 cursor-default' 
              : 'bg-indigo-600 hover:bg-indigo-700'
            }
            disabled:opacity-70 disabled:cursor-not-allowed transition duration-200
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
          whileTap={{ scale: 0.98 }}
        >
          {state === 'loading' ? (
            <>
              <Loader2 size={18} className="animate-spin mr-2" />
              <span>Subscribing...</span>
            </>
          ) : state === 'success' ? (
            <>
              <CheckCircle2 size={18} className="mr-2" />
              <span>Subscribed!</span>
            </>
          ) : (
            <>
              <span>Subscribe</span>
              <ArrowRight size={18} className="ml-2" />
            </>
          )}
        </motion.button>
      </form>

      {state === 'success' && (
        <motion.p
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-4 text-sm text-green-600 dark:text-green-400"
        >
          Thanks for subscribing! Check your inbox to confirm your email.
        </motion.p>
      )}
      
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
        We respect your privacy. Unsubscribe at any time.
      </p>
    </motion.div>
  );
};

export default NewsletterForm;