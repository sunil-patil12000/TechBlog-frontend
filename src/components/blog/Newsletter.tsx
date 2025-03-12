import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, ArrowRight } from 'lucide-react';

const Newsletter: React.FC = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    
    // Simulate API call
    setTimeout(() => {
      setStatus('success');
      setEmail('');
    }, 1000);
  };

  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="relative px-6 py-8 rounded-2xl overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600" />
      <div className="absolute inset-0 bg-grid-white/10 mask-gradient" />

      <div className="relative">
        <div className="flex items-center gap-2 mb-4">
          <Mail className="w-5 h-5 text-indigo-200" />
          <h3 className="text-xl font-semibold text-white">
            Stay Updated
          </h3>
        </div>

        <p className="text-indigo-100 mb-6 max-w-md">
          Get the latest articles, tutorials, and updates delivered straight to your inbox.
        </p>

        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="flex-1 px-4 py-2 rounded-lg bg-white/10 border border-white/20
              text-white placeholder-white/60 focus:outline-none focus:ring-2
              focus:ring-white/30"
            required
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="px-4 py-2 rounded-lg bg-white text-indigo-600 font-medium
              hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-white/30
              disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {status === 'loading' ? (
              'Subscribing...'
            ) : (
              <>
                Subscribe
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {status === 'success' && (
          <p className="mt-4 text-sm text-indigo-200">
            Thanks for subscribing! Please check your email to confirm.
          </p>
        )}
      </div>
    </motion.section>
  );
};

export default Newsletter;
