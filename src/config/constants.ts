/**
 * Application-wide constants
 */

// API URLs
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
export const API_URL = API_BASE_URL; // Alias for API_BASE_URL for backward compatibility

// Media URLs
export const UPLOADS_BASE_URL = import.meta.env.VITE_UPLOADS_URL || 'http://localhost:5001/uploads';

// Timeouts
export const API_TIMEOUT = 30000; // 30 seconds

// Image settings
export const DEFAULT_IMAGE = '/images/default-image.jpg';
export const DEFAULT_AVATAR = '/images/default-avatar.jpg';

/**
 * Helper function to build a complete uploads URL
 * @param path The relative path to the uploaded file
 * @returns The complete URL to the uploaded file
 */
export function getUploadUrl(path: string | null | undefined | any): string {
  // Handle null, undefined, or empty values
  if (!path) return DEFAULT_IMAGE;
  
  // Handle objects (like {url: '...'})
  if (typeof path === 'object' && path !== null) {
    // If it has a url property, use that
    if (path.url) return getUploadUrl(path.url);
    
    // If it's some other object, log a warning and return the default image
    console.warn('Invalid image path (object without url property):', path);
    return DEFAULT_IMAGE;
  }
  
  // Convert to string in case it's a number or other type
  const pathStr = String(path);
  
  // If it's already an absolute URL, return it
  if (pathStr.startsWith('http')) return pathStr;
  
  // If it begins with /uploads/, remove the leading slash
  const cleanPath = pathStr.startsWith('/uploads/') 
    ? pathStr.substring('/uploads/'.length) 
    : pathStr.startsWith('uploads/') 
      ? pathStr.substring('uploads/'.length)
      : pathStr;
      
  // Handle relative paths with parent directories
  const normalizedPath = cleanPath.replace(/(\.\.\/)+uploads\//, '');
  
  // Combine with base uploads URL
  return `${UPLOADS_BASE_URL}/${normalizedPath}`;
} 