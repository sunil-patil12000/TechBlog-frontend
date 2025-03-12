import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp } from 'lucide-react';

interface ScrollProgressProps {
  showScrollTopButton?: boolean;
  color?: string;
  height?: number;
  zIndex?: number;
  alwaysVisible?: boolean;
  position?: 'top' | 'bottom';
  scrollTopThreshold?: number;
}

/**
 * ScrollProgress component that shows reading progress on long content
 */
const ScrollProgress: React.FC<ScrollProgressProps> = ({
  showScrollTopButton = true,
  color = '#4f46e5', // indigo-600
  height = 4,
  zIndex = 50,
  alwaysVisible = false,
  position = 'top',
  scrollTopThreshold = 500,
}) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const calculateScrollProgress = () => {
      // Calculate scroll progress
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const maxScroll = documentHeight - windowHeight;
      const progress = maxScroll <= 0 ? 0 : Math.min(100, Math.max(0, (scrollTop / maxScroll) * 100));
      
      // Update scroll progress state
      setScrollProgress(progress);
      
      // Toggle scroll-to-top button visibility
      setShowScrollTop(scrollTop > scrollTopThreshold);
    };

    // Initial calculation
    calculateScrollProgress();
    
    // Add scroll event listener
    window.addEventListener('scroll', calculateScrollProgress, { passive: true });
    
    // Cleanup
    return () => window.removeEventListener('scroll', calculateScrollProgress);
  }, [scrollTopThreshold]);

  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <>
      {/* Progress bar */}
      <motion.div
        className={`fixed ${position === 'top' ? 'top-0' : 'bottom-0'} left-0 right-0`}
        style={{
          height: height,
          backgroundColor: color,
          transformOrigin: 'left',
          zIndex: zIndex,
          opacity: alwaysVisible || scrollProgress > 0 ? 1 : 0,
        }}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: scrollProgress / 100 }}
        transition={{ ease: 'easeOut', duration: 0.2 }}
      />

      {/* Scroll to top button */}
      {showScrollTopButton && (
        <AnimatePresence>
          {showScrollTop && (
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
              className="fixed bottom-6 right-6 p-3 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-full shadow-lg hover:shadow-xl z-50 border border-gray-200 dark:border-gray-700 focus:outline-none"
              onClick={handleScrollToTop}
              aria-label="Scroll to top"
              title="Scroll to top"
            >
              <ArrowUp size={24} />
            </motion.button>
          )}
        </AnimatePresence>
      )}
      
      {/* Optional: Progress percentage */}
      {showScrollTop && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="fixed bottom-6 left-6 p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg text-xs font-medium z-50 border border-gray-200 dark:border-gray-700"
            style={{ minWidth: '40px', textAlign: 'center' }}
          >
            {Math.round(scrollProgress)}%
          </motion.div>
        </AnimatePresence>
      )}
    </>
  );
};

// Component that activates only on long content
export const ConditionalScrollProgress: React.FC<ScrollProgressProps & { minHeight?: number }> = ({
  minHeight = 1000,
  ...props
}) => {
  const [showProgress, setShowProgress] = useState(false);
  
  useEffect(() => {
    const checkContentHeight = () => {
      const bodyHeight = document.body.scrollHeight;
      const windowHeight = window.innerHeight;
      
      setShowProgress(bodyHeight > windowHeight + minHeight);
    };
    
    checkContentHeight();
    window.addEventListener('resize', checkContentHeight);
    
    return () => window.removeEventListener('resize', checkContentHeight);
  }, [minHeight]);
  
  if (!showProgress) return null;
  
  return <ScrollProgress {...props} />;
};

export default ScrollProgress; 