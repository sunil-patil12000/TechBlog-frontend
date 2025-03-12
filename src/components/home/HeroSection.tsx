import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

interface HeroProps {
  title?: string;
  subtitle?: string;
  imageUrl?: string;
}

const HeroSection: React.FC<HeroProps> = ({
  title = "Discover Insights & Ideas",
  subtitle = "Explore in-depth articles on technology, programming, and modern web development techniques from industry experts.",
  imageUrl = "https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80"
}) => {
  return (
    <div className="relative bg-gray-900 overflow-hidden">
      {/* Background image with improved overlay */}
      <div className="absolute inset-0">
        <img
          className="w-full h-full object-cover"
          src={imageUrl}
          alt="Blog hero background"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/80 to-gray-900/50" />
      </div>
      
      {/* Hero content with animations */}
      <div className="relative px-4 py-32 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="max-w-2xl">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight"
          >
            {title}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 text-xl text-gray-300 max-w-prose"
          >
            {subtitle}
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-10 flex flex-col sm:flex-row gap-4"
          >
            <Link
              to="/blog"
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md transition-all duration-300 inline-flex items-center justify-center shadow-lg hover:shadow-indigo-600/30"
            >
              Explore Articles
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </Link>
            <Link
              to="/categories"
              className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-medium rounded-md border border-white/20 backdrop-blur-sm transition-all duration-300 inline-flex items-center justify-center"
            >
              Browse Categories
            </Link>
          </motion.div>
          
          {/* Added feature highlights */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-16 grid grid-cols-2 md:grid-cols-3 gap-4"
          >
            {[
              { label: "Curated Content", value: "200+ Articles" },
              { label: "Expert Authors", value: "50+ Contributors" },
              { label: "Topic Categories", value: "12 Categories" }
            ].map((stat, index) => (
              <div key={index} className="bg-white/5 backdrop-blur-sm px-4 py-3 rounded-lg">
                <p className="text-white text-lg font-bold">{stat.value}</p>
                <p className="text-gray-400 text-sm">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
