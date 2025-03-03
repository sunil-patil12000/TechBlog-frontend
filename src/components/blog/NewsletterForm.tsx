import React, { useState } from 'react';
import { Mail, Check } from 'lucide-react';

const NewsletterForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would send this to an API
    console.log('Subscribing email:', email);
    setSubscribed(true);
    setEmail('');
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-8 md:p-10 shadow-xl">
      {/* Background decoration */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500 opacity-20 rounded-full" />
      <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-purple-500 opacity-10 rounded-full" />
      
      <div className="relative flex flex-col md:flex-row gap-8 items-center justify-between">
        <div className="md:w-2/3">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 bg-white/20 text-white rounded-full text-sm backdrop-blur-sm">
            <Mail className="w-4 h-4" />
            <span>Subscribe to our Newsletter</span>
          </div>
          
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
            Get the latest tech insights delivered straight to your inbox
          </h3>
          <p className="text-indigo-100">
            Join our community of developers and tech enthusiasts to receive exclusive content, tutorials, and updates.
          </p>
        </div>
        
        <div className="md:w-1/3 w-full">
          {subscribed ? (
            <div className="bg-white/20 backdrop-blur-sm p-6 rounded-xl text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-500 mb-3">
                <Check className="w-6 h-6 text-white" />
              </div>
              <p className="text-white font-medium text-lg">
                Thanks for subscribing!
              </p>
              <p className="text-indigo-100 text-sm mt-2">
                We'll keep you updated with the latest news.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-indigo-300 w-5 h-5" />
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-4 pl-10 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 placeholder:text-indigo-200"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full p-3 bg-white text-indigo-700 font-medium rounded-lg hover:bg-indigo-50 transition-colors shadow-lg shadow-indigo-900/30"
              >
                Subscribe
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewsletterForm;