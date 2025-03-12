import React from 'react';
import { UPLOADS_BASE_URL } from '../../config/constants';
import { normalizeImageUrl } from '../../utils/contentProcessor';

interface NormalizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  fallbackSrc?: string;
  showPlaceholder?: boolean;
  fallback?: React.ReactNode;
  onLoad?: () => void;
  onError?: () => void;
}

/**
 * A component that displays images with normalized paths
 * Handles various image path formats and provides fallback options
 */
const NormalizedImage: React.FC<NormalizedImageProps> = ({
  src,
  alt = 'Image',
  fallbackSrc,
  fallback,
  className,
  onLoad,
  onError,
  ...props
}) => {
  // Use the imported normalizeImageUrl function
  const normalizedSrc = normalizeImageUrl(src);
  
  // Handle image error event
  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.error(`Failed to load image: ${normalizedSrc} (original: ${src})`);
    
    // Try to use fallback if the main image fails
    if (fallbackSrc) {
      (e.target as HTMLImageElement).src = normalizeImageUrl(fallbackSrc);
    }
    
    if (onError) {
      onError();
    }
  };

  // If fallback React node is provided
  if (fallback && !src) {
    return <>{fallback}</>;
  }

  return (
    <img
      src={normalizedSrc}
      alt={alt || 'Image'}
      className={className}
      onError={handleError}
      onLoad={onLoad}
      {...props}
    />
  );
};

export default NormalizedImage; 