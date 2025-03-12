import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  placeholderSrc?: string;
  placeholderStyle?: 'blur' | 'pulse' | 'skeleton';
  aspectRatio?: string;
  width?: number | string;
  height?: number | string;
  fadeIn?: boolean;
  threshold?: number;
  rootMargin?: string;
  loadingStrategy?: 'lazy' | 'eager' | 'auto';
  onLoad?: () => void;
  onError?: () => void;
  photoInfo?: {
    userName: string;
    userLink: string;
  };
}

const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  placeholderSrc,
  placeholderStyle = 'blur',
  aspectRatio = '16/9',
  width,
  height,
  fadeIn = true,
  threshold = 0.1,
  rootMargin = '200px 0px',
  loadingStrategy = 'lazy',
  className = '',
  onLoad,
  onError,
  photoInfo,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [error, setError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const imageRef = useRef<HTMLImageElement>(null);
  
  // Generate a tiny placeholder if not provided
  const defaultPlaceholder = src ? `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${width || 1} ${height || 1}'%3E%3C/svg%3E` : '';
  const placeholder = placeholderSrc || defaultPlaceholder;
  
  // Set up intersection observer to detect when image is in viewport
  useEffect(() => {
    // Skip for SSR or if loading strategy is eager
    if (typeof window === 'undefined' || loadingStrategy === 'eager') {
      setIsInView(true);
      return;
    }
    
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsInView(true);
          // Once in view, disconnect the observer
          if (imageRef.current) observer.unobserve(imageRef.current);
        }
      },
      { threshold, rootMargin }
    );
    
    if (imageRef.current) {
      observer.observe(imageRef.current);
    }
    
    return () => {
      if (imageRef.current) observer.unobserve(imageRef.current);
    };
  }, [loadingStrategy, rootMargin, threshold]);
  
  // Proper order of declarations
  const shouldLoad = loadingStrategy === 'eager' || isInView;
  
  // Then define effects that use shouldLoad
  useEffect(() => {
    if (shouldLoad && retryCount > 0) {
      // Force re-render to retry loading
      const img = imageRef.current;
      if (img) {
        img.src = '';
        img.src = src;
      }
    }
  }, [retryCount, shouldLoad, src]);
  
  // Handle image load and error events
  const handleLoad = () => {
    setIsLoaded(true);
    if (onLoad) onLoad();
  };
  
  const handleError = () => {
    if (retryCount < 3) {
      setTimeout(() => {
        setRetryCount(prev => prev + 1);
      }, 1000 * retryCount);
      return;
    }
    setError(true);
    setIsLoaded(true);
    if (onError) onError();
  };
  
  // Create the proper CSS classes for the wrapper
  const wrapperClasses = [
    'relative overflow-hidden',
    typeof aspectRatio === 'string' && aspectRatio !== 'auto' ? 'aspect-w-[' + aspectRatio.split('/')[0] + '] aspect-h-[' + aspectRatio.split('/')[1] + ']' : '',
    className
  ].filter(Boolean).join(' ');
  
  // Generate a unique blur data URL for the skeleton effect
  const getSkeletonStyle = () => {
    if (placeholderStyle === 'skeleton') {
      return {
        backgroundColor: '#f3f4f6', // Light gray for light mode
        backgroundImage: 'linear-gradient(90deg, #f3f4f6 0px, #e5e7eb 50%, #f3f4f6 100%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.5s infinite',
      };
    }
    return {};
  };
  
  return (
    <div 
      className={wrapperClasses}
      style={{
        width: width !== undefined ? (typeof width === 'number' ? `${width}px` : width) : undefined,
        height: height !== undefined ? (typeof height === 'number' ? `${height}px` : height) : undefined,
      }}
      ref={imageRef}
    >
      {/* Placeholder element that shows until image is loaded */}
      {!isLoaded && (
        <div
          className="absolute inset-0 w-full h-full"
          style={getSkeletonStyle()}
        >
          {placeholderStyle === 'blur' && placeholder && (
            <img 
              src={placeholder}
              alt=""
              className="w-full h-full object-cover filter blur-sm"
              aria-hidden="true"
            />
          )}
          
          {placeholderStyle === 'pulse' && (
            <div className="w-full h-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
          )}
        </div>
      )}
      
      {/* Actual image */}
      {shouldLoad && (
        <motion.img
          src={src}
          alt={alt}
          loading={loadingStrategy === 'auto' ? undefined : loadingStrategy}
          onLoad={handleLoad}
          onError={handleError}
          initial={fadeIn ? { opacity: 0 } : { opacity: 1 }}
          animate={isLoaded ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.3 }}
          className={`w-full h-full object-cover ${error ? 'hidden' : ''}`}
          {...props}
        />
      )}
      
      {/* Error fallback */}
      {error && (
        <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-sm">
          <span>Failed to load image</span>
        </div>
      )}
      
      {/* Add attribution component near images */}
      {photoInfo && (
        <div className="absolute bottom-2 right-2 text-xs text-white bg-black/50 px-2 py-1 rounded">
          Photo by <a href={photoInfo.userLink} className="underline">{photoInfo.userName}</a> on Unsplash
        </div>
      )}
    </div>
  );
};

export default LazyImage;

// Add global styles for skeleton loading animation
if (typeof document !== 'undefined') {
  // Check if the style already exists to prevent duplicates
  if (!document.getElementById('lazy-image-styles')) {
    const style = document.createElement('style');
    style.id = 'lazy-image-styles';
    style.innerHTML = `
      @keyframes shimmer {
        0% { background-position: 200% 0; }
        100% { background-position: -200% 0; }
      }
    `;
    document.head.appendChild(style);
  }
} 