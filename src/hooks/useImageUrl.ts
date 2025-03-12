import { useMemo } from 'react';
import { API_BASE_URL } from '../config/constants';

/**
 * Custom hook to normalize image URLs
 * This ensures consistent image path handling throughout the application
 */
export const useImageUrl = (imagePath: string | null | undefined, fallbackImage?: string): string => {
  return useMemo(() => {
    // Return fallback if no image path provided
    if (!imagePath) {
      return fallbackImage || '';
    }

    try {
      let normalizedPath = imagePath.trim();
      
      // Handle Windows backslashes if present
      normalizedPath = normalizedPath.replace(/\\/g, '/');
      
      // Handle relative paths (e.g., '../uploads/image.jpg')
      if (normalizedPath.includes('../uploads/')) {
        normalizedPath = normalizedPath.replace(/(\.\.\/)+uploads\//, '/uploads/');
      }
      
      // Handle API paths (e.g., '/api/uploads/image.jpg')
      if (normalizedPath.startsWith('/api/uploads/')) {
        normalizedPath = normalizedPath.replace('/api/uploads/', '/uploads/');
      }
      
      // Handle localhost URLs
      if (normalizedPath.includes('localhost') && normalizedPath.includes('/uploads/')) {
        normalizedPath = normalizedPath.substring(normalizedPath.indexOf('/uploads/'));
      }
      
      // Handle full URLs (e.g., http://example.com/uploads/image.jpg)
      if (normalizedPath.match(/^https?:\/\//)) {
        try {
          const urlParts = new URL(normalizedPath);
          if (urlParts.pathname.includes('/uploads/')) {
            normalizedPath = urlParts.pathname;
          }
        } catch (e) {
          console.warn('Failed to parse URL:', normalizedPath);
        }
      }
      
      // Handle paths that don't start with '/uploads/' but contain 'uploads/'
      if (!normalizedPath.startsWith('/uploads/') && normalizedPath.includes('uploads/')) {
        normalizedPath = '/uploads/' + normalizedPath.substring(normalizedPath.indexOf('uploads/') + 8);
      }
      
      // Ensure the path always starts with the URL prefix (unless it's an external URL)
      if (!normalizedPath.startsWith('/uploads/') && !normalizedPath.startsWith('http')) {
        // Remove any leading slashes before adding the prefix
        normalizedPath = normalizedPath.replace(/^\/+/, '');
        normalizedPath = '/uploads/' + normalizedPath;
      }
      
      // If the path starts with /uploads/ and we're in development, prepend the API server URL
      if (normalizedPath.startsWith('/uploads/') && process.env.NODE_ENV === 'development') {
        // Only add API server URL if it's not already a full URL
        if (!normalizedPath.startsWith('http')) {
          // Extract the API server URL (without the /api part)
          const apiServerUrl = API_BASE_URL.replace(/\/api$/, '');
          
          // Remove API server URL if it's already there to avoid duplication
          const apiServerWithoutProtocol = apiServerUrl.replace(/^https?:\/\//, '');
          if (!normalizedPath.includes(apiServerWithoutProtocol)) {
            // Check if API server URL ends with a slash
            if (apiServerUrl.endsWith('/')) {
              normalizedPath = apiServerUrl + normalizedPath.substring(1);
            } else {
              normalizedPath = apiServerUrl + normalizedPath;
            }
          }
        }
      }
      
      return normalizedPath;
    } catch (error) {
      console.error('Error normalizing image path:', error, imagePath);
      return fallbackImage || imagePath || '';
    }
  }, [imagePath, fallbackImage]);
};

/**
 * Get a normalized URL for a user avatar
 */
export const useAvatarUrl = (avatarPath: string | null | undefined): string => {
  const defaultAvatar = '/assets/default-avatar.png';
  return useImageUrl(avatarPath, defaultAvatar);
};

export default useImageUrl; 