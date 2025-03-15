import React, { useState, useEffect, useRef } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  loading?: 'lazy' | 'eager';
  placeholder?: 'blur' | 'none';
  sizes?: string;
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  priority?: boolean;
  blurDataURL?: string;
  onLoad?: () => void;
  onError?: () => void;
}

/**
 * Optimized image component that uses modern formats and lazy loading
 * Helps with Core Web Vitals by preventing layout shifts
 */
const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  className = '',
  loading = 'lazy',
  placeholder = 'blur',
  sizes = '100vw',
  objectFit = 'cover',
  priority = false,
  blurDataURL,
  onLoad,
  onError,
}) => {
  const [imgSrc, setImgSrc] = useState<string>(src);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);
  const imgRef = useRef<HTMLImageElement>(null);
  
  // Support for WebP and AVIF detection
  const [supportsWebp, setSupportsWebp] = useState<boolean | null>(null);
  const [supportsAvif, setSupportsAvif] = useState<boolean | null>(null);
  
  // Detect format support
  useEffect(() => {
    // Check WebP support
    const checkWebpSupport = async () => {
      try {
        const webpData = 'data:image/webp;base64,UklGRh4AAABXRUJQVlA4TBEAAAAvAAAAAAfQ//73v/+BiOh/AAA=';
        const blob = await fetch(webpData).then(r => r.blob());
        setSupportsWebp(blob.size > 0);
      } catch (e) {
        setSupportsWebp(false);
      }
    };
    
    // Check AVIF support
    const checkAvifSupport = async () => {
      try {
        const avifData = 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgANogQEAwgMg8f8D///8WfhwB8+ErK42A=';
        const blob = await fetch(avifData).then(r => r.blob());
        setSupportsAvif(blob.size > 0);
      } catch (e) {
        setSupportsAvif(false);
      }
    };
    
    checkWebpSupport();
    checkAvifSupport();
  }, []);
  
  // Generate srcSet with appropriate formats
  const generateSrcSet = () => {
    if (!src) return '';
    
    // Base paths for different formats
    const originalSrc = src.split('?')[0];
    
    // If src already has a format parameter, respect it
    if (src.includes('format=')) return '';
    
    // Determine best available format
    let format = 'original';
    if (supportsAvif) format = 'avif';
    else if (supportsWebp) format = 'webp';
    
    // Add format only if needed
    if (format === 'original') return '';
    
    // Create optimized URL
    const separator = src.includes('?') ? '&' : '?';
    return `${src}${separator}format=${format}`;
  };
  
  // Update src when format support is determined
  useEffect(() => {
    if (supportsWebp !== null || supportsAvif !== null) {
      const optimizedSrc = generateSrcSet();
      if (optimizedSrc) {
        setImgSrc(optimizedSrc);
      }
    }
  }, [supportsWebp, supportsAvif, src]);
  
  // Handle image load event
  const handleLoad = () => {
    setIsLoaded(true);
    if (onLoad) onLoad();
  };
  
  // Handle image error event
  const handleError = () => {
    // If optimized format fails, fallback to original
    if (imgSrc !== src) {
      setImgSrc(src);
    } else {
      setHasError(true);
      if (onError) onError();
    }
  };
  
  // If priority is true, load eagerly
  const loadingStrategy = priority ? 'eager' : loading;
  
  // Basic style for the image to maintain aspect ratio
  const imgStyle: React.CSSProperties = {
    objectFit,
    width: '100%',
    height: '100%',
    ...(width && { maxWidth: `${width}px` }),
  };
  
  // Container style for preventing layout shift
  const containerStyle: React.CSSProperties = {
    position: 'relative',
    overflow: 'hidden',
    ...(width && { width: `${width}px` }),
    ...(height && { height: `${height}px` }),
    // If both width and height are provided, calculate aspect ratio
    ...(width && height && { aspectRatio: `${width} / ${height}` }),
  };
  
  // Generate placeholder or blur data URL
  const placeholderSrc = blurDataURL || (placeholder === 'blur' ? `${src}?width=20&quality=10` : undefined);
  
  return (
    <div style={containerStyle} className={className}>
      <LazyLoadImage
        src={imgSrc}
        alt={alt}
        width={width}
        height={height}
        effect={placeholder === 'blur' ? 'blur' : undefined}
        placeholderSrc={placeholderSrc}
        onLoad={handleLoad}
        onError={handleError}
        style={imgStyle}
        loading={loadingStrategy}
        wrapperClassName="w-full h-full"
        threshold={100}
        visibleByDefault={priority}
      />
      
      {/* Fallback for error state */}
      {hasError && (
        <div 
          className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
          style={{ fontSize: '0.875rem' }}
        >
          Failed to load image
        </div>
      )}
    </div>
  );
};

export default OptimizedImage; 