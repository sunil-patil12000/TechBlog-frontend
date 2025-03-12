import React, { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';
import useScrollPosition from '../../hooks/useScrollPosition';

interface BackToTopProps {
  threshold?: number;
  className?: string;
}

const BackToTop: React.FC<BackToTopProps> = ({ 
  threshold = 300,
  className = ''
}) => {
  const { scrollY } = useScrollPosition();
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    setIsVisible(scrollY > threshold);
  }, [scrollY, threshold]);
  
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  
  return (
    <button
      className={`fixed bottom-6 right-6 p-3 rounded-full bg-indigo-600 text-white shadow-lg transition-opacity duration-300 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
        isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      } ${className}`}
      onClick={scrollToTop}
      aria-label="Back to top"
    >
      <ChevronUp className="w-5 h-5" />
    </button>
  );
};

export default BackToTop; 