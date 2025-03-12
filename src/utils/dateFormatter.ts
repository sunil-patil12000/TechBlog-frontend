/**
 * Format a date string into a human-readable format
 * @param dateString The date string to format
 * @param options Optional formatting options
 * @returns Formatted date string
 */
export const formatDate = (
  dateString: string, 
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }
): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', options);
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
};

/**
 * Format a date as a relative time (e.g., "2 days ago")
 * @param dateString The date string to format
 * @returns Relative time string
 */
export const formatRelativeTime = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return diffInSeconds <= 1 ? 'just now' : `${diffInSeconds} seconds ago`;
    }
    
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return diffInMinutes === 1 ? '1 minute ago' : `${diffInMinutes} minutes ago`;
    }
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return diffInHours === 1 ? '1 hour ago' : `${diffInHours} hours ago`;
    }
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) {
      return diffInDays === 1 ? '1 day ago' : `${diffInDays} days ago`;
    }
    
    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) {
      return diffInMonths === 1 ? '1 month ago' : `${diffInMonths} months ago`;
    }
    
    const diffInYears = Math.floor(diffInMonths / 12);
    return diffInYears === 1 ? '1 year ago' : `${diffInYears} years ago`;
  } catch (error) {
    console.error('Error formatting relative time:', error);
    return dateString;
  }
};

/**
 * Format a date into ISO format (YYYY-MM-DD)
 * @param date The date to format
 * @returns ISO formatted date string
 */
export const formatISODate = (date: Date): string => {
  try {
    return date.toISOString().split('T')[0];
  } catch (error) {
    console.error('Error formatting ISO date:', error);
    return '';
  }
};

/**
 * Calculate reading time based on content length
 * @param content The content to calculate reading time for
 * @param wordsPerMinute The average reading speed in words per minute
 * @returns Reading time in minutes
 */
export const calculateReadingTime = (content: string, wordsPerMinute = 200): number => {
  try {
    const words = content.trim().split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
  } catch (error) {
    console.error('Error calculating reading time:', error);
    return 1; // Default to 1 minute
  }
}; 