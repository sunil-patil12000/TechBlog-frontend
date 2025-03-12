import React from 'react';
import { normalizeImageUrl } from '../../utils/contentProcessor';

interface NormalizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  fallback?: string;
  onImageError?: () => void;
}

/**
 * A component that renders an image with normalized URL paths
 * This ensures images load correctly regardless of the format of the source URL
 */
const NormalizedImage: React.FC<NormalizedImageProps> = ({
  src,
  alt,
  fallback = '/uploads/default-image.jpg',
  onImageError,
  ...props
}) => {
  const normalizedSrc = normalizeImageUrl(src);
  
  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.error(`Failed to load image: ${normalizedSrc} (original: ${src})`);
    
    // Try to use fallback if the main image fails
    if (fallback && normalizedSrc !== normalizeImageUrl(fallback)) {
      (e.target as HTMLImageElement).src = normalizeImageUrl(fallback);
    }
    
    if (onImageError) {
      onImageError();
    }
  };

  return (
    <img
      src={normalizedSrc}
      alt={alt || 'Image'}
      onError={handleError}
      {...props}
    />
  );
};

export default NormalizedImage; 