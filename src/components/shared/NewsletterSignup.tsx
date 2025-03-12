import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface NewsletterSignupProps {
  buttonText?: string;
  placeholder?: string;
  className?: string;
}

const NewsletterSignup: React.FC<NewsletterSignupProps> = ({
  buttonText = 'Subscribe',
  placeholder = 'Your email address',
  className = ''
}) => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setStatus('error');
      setMessage('Please enter your email address');
      return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setStatus('error');
      setMessage('Please enter a valid email address');
      return;
    }
    
    setStatus('loading');
    
    // Simulate API call
    setTimeout(() => {
      setStatus('success');
      setMessage('Thanks for subscribing! Check your email to confirm.');
      setEmail('');
    }, 1000);
    
    // Actual API implementation would be something like:
    // try {
    //   const response = await fetch('/api/newsletter/subscribe', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ email }),
    //   });
    //   const data = await response.json();
    //   
    //   if (!response.ok) throw new Error(data.message || 'Subscription failed');
    //   
    //   setStatus('success');
    //   setMessage(data.message || 'Thanks for subscribing!');
    //   setEmail('');
    // } catch (err) {
    //   setStatus('error');
    //   setMessage(err.message || 'Something went wrong. Please try again.');
    // }
  };

  return (
    <div className={className}>
      <form onSubmit={handleSubmit} className="relative">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={placeholder}
          className="w-full px-4 py-3 rounded-lg text-gray-900 bg-white border-2 border-white focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent"
          disabled={status === 'loading'}
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="absolute right-1.5 top-1.5 px-4 py-1.5 bg-indigo-700 hover:bg-indigo-800 text-white font-medium rounded-md transition-colors disabled:opacity-70"
        >
          {status === 'loading' ? 'Subscribing...' : buttonText}
        </button>
      </form>
      
      {status !== 'idle' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mt-3 text-sm ${
            status === 'error' 
              ? 'text-red-200' 
              : status === 'success'
                ? 'text-green-200'
                : 'text-white'
          }`}
        >
          {message}
        </motion.div>
      )}
    </div>
  );
};

export default NewsletterSignup; 