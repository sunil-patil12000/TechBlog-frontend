import React, { useState, useEffect, useRef } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

interface ResponsiveImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  sizes?: string;
  priority?: boolean;
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  eager?: boolean;
  onLoad?: () => void;
  placeholderSrc?: string;
  blur?: boolean;
}

/**
 * ResponsiveImage Component
 * Renders optimized, responsive images with lazy loading,
 * modern formats (WebP/AVIF), and proper aspect ratio to prevent layout shifts
 */
const ResponsiveImage: React.FC<ResponsiveImageProps> = ({
  src,
  alt,
  width,
  height,
  className = '',
  sizes = '100vw',
  priority = false,
  objectFit = 'cover',
  eager = false,
  onLoad,
  placeholderSrc,
  blur = true,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef<HTMLDivElement>(null);
  
  // Calculate aspect ratio to prevent layout shifts (CLS)
  const aspectRatio = width && height ? `${(height / width) * 100}%` : undefined;
  
  // Handle IntersectionObserver for lazy loading
  useEffect(() => {
    if (priority || eager) {
      setIsInView(true);
      return;
    }
    
    // Skip if already in view
    if (isInView) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '200px', // Start loading when within 200px of viewport
        threshold: 0.01,     // Trigger when 1% visible
      }
    );
    
    if (imgRef.current) {
      observer.observe(imgRef.current);
    }
    
    return () => {
      observer.disconnect();
    };
  }, [isInView, priority, eager]);
  
  // Generate <source> elements for different image formats
  const generateSources = () => {
    // Extract file extension from src
    const fileExtension = src.split('.').pop()?.toLowerCase() || '';
    
    // Base URL without extension
    const baseUrl = src.substring(0, src.lastIndexOf('.'));
    
    // Don't generate sources for SVG or GIF images
    if (['svg', 'gif'].includes(fileExtension)) {
      return null;
    }
    
    // Handle images that don't have file extensions
    if (!['jpg', 'jpeg', 'png', 'webp', 'avif'].includes(fileExtension)) {
      return null;
    }
    
    return (
      <>
        {/* AVIF format - best compression and quality */}
        <source
          type="image/avif"
          srcSet={`${baseUrl}.avif`}
          sizes={sizes}
        />
        {/* WebP format - wide browser support */}
        <source
          type="image/webp"
          srcSet={`${baseUrl}.webp`}
          sizes={sizes}
        />
      </>
    );
  };
  
  // Handle image load complete
  const handleImageLoaded = () => {
    setIsLoaded(true);
    if (onLoad) onLoad();
  };
  
  // Set default placeholder
  const defaultPlaceholder = placeholderSrc || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"%3E%3C/svg%3E';
  
  // Decide whether to use regular img or LazyLoadImage
  const shouldLazyLoad = !priority && !eager;
  
  return (
    <div 
      ref={imgRef}
      className={`responsive-image-container ${className}`}
      style={{
        position: 'relative',
        width: '100%',
        paddingBottom: aspectRatio,
        overflow: 'hidden',
      }}
    >
      {isInView && (
        shouldLazyLoad ? (
          <LazyLoadImage
            src={src}
            alt={alt}
            effect={blur ? 'blur' : undefined}
            placeholder={
              <div 
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  backgroundColor: '#f0f0f0',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                }}
              />
            }
            width={width || '100%'}
            height={height || '100%'}
            wrapperProps={{
              style: {
                display: 'block',
                width: '100%',
                height: '100%',
                position: 'absolute',
                top: 0,
                left: 0,
              },
            }}
            style={{
              objectFit,
              width: '100%',
              height: '100%',
            }}
            afterLoad={handleImageLoaded}
          />
        ) : (
          <picture>
            {generateSources()}
            <img
              src={src}
              alt={alt}
              width={width}
              height={height}
              loading={priority ? 'eager' : 'lazy'}
              onLoad={handleImageLoaded}
              style={{
                objectFit,
                width: '100%',
                height: '100%',
                position: 'absolute',
                top: 0,
                left: 0,
              }}
              fetchPriority={priority ? 'high' : 'auto'}
            />
          </picture>
        )
      )}
    </div>
  );
};

export default ResponsiveImage; 