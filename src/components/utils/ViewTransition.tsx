import React, { useEffect, useState, useRef, ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

interface ViewTransitionProps {
  children: ReactNode;
  transitionDuration?: number;
  fallbackAnimation?: 'fade' | 'slide' | 'zoom' | 'none';
}

// Check if the View Transitions API is supported
const isViewTransitionsSupported = () => {
  return typeof document !== 'undefined' && 'startViewTransition' in document;
};

/**
 * ViewTransition component that uses the View Transitions API with fallback
 * for unsupported browsers using Framer Motion
 */
const ViewTransition: React.FC<ViewTransitionProps> = ({
  children,
  transitionDuration = 300,
  fallbackAnimation = 'fade',
}) => {
  const location = useLocation();
  const [displayLocation, setDisplayLocation] = useState(location);
  const [transitionStage, setTransitionStage] = useState('fadeIn');
  const supported = useRef(isViewTransitionsSupported());
  
  // Keep track of mounted state
  const isMounted = useRef(true);
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Handle location changes
  useEffect(() => {
    if (location !== displayLocation) {
      if (supported.current) {
        // Use the View Transitions API
        try {
          // @ts-ignore - TypeScript doesn't have types for the View Transitions API yet
          document.startViewTransition(() => {
            // Only update the state if the component is still mounted
            if (isMounted.current) {
              setDisplayLocation(location);
            }
            
            // Ensure the DOM is updated
            return new Promise<void>((resolve) => {
              // Small delay to ensure the DOM is updated
              setTimeout(resolve, 10);
            });
          });
        } catch (error) {
          console.warn('View Transitions API failed, falling back to standard transition', error);
          // Fallback if the API fails
          setTransitionStage('fadeOut');
          setTimeout(() => {
            if (isMounted.current) {
              setDisplayLocation(location);
              setTransitionStage('fadeIn');
            }
          }, transitionDuration);
        }
      } else {
        // Fallback for browsers that don't support the View Transitions API
        setTransitionStage('fadeOut');
        setTimeout(() => {
          if (isMounted.current) {
            setDisplayLocation(location);
            setTransitionStage('fadeIn');
          }
        }, transitionDuration);
      }
    }
  }, [location, displayLocation, transitionDuration]);

  // Define animation variants for the fallback
  const getFallbackVariants = () => {
    switch (fallbackAnimation) {
      case 'slide':
        return {
          initial: { opacity: 0, x: 20 },
          animate: { opacity: 1, x: 0 },
          exit: { opacity: 0, x: -20 },
        };
      case 'zoom':
        return {
          initial: { opacity: 0, scale: 0.95 },
          animate: { opacity: 1, scale: 1 },
          exit: { opacity: 0, scale: 1.05 },
        };
      case 'none':
        return {
          initial: { opacity: 1 },
          animate: { opacity: 1 },
          exit: { opacity: 1 },
        };
      case 'fade':
      default:
        return {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 },
        };
    }
  };

  // If using the View Transitions API, render without AnimatePresence
  if (supported.current) {
    return (
      <div className="view-transition-container">
        {children}
      </div>
    );
  }

  // Fallback using Framer Motion
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={getFallbackVariants()}
        transition={{ duration: transitionDuration / 1000 }}
        className={`view-transition-fallback ${transitionStage}`}
        style={{
          transitionDuration: `${transitionDuration}ms`,
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default ViewTransition; 