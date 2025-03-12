/**
 * Format a date string in a human-readable format
 * @param dateString - ISO date string or any valid date format
 * @param options - Intl.DateTimeFormat options
 * @returns Formatted date string
 */
export const formatDate = (dateString: string, options?: Intl.DateTimeFormatOptions): string => {
  try {
    const date = new Date(dateString);
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return 'Invalid date';
    }
    
    // Default formatting options
    const defaultOptions: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    
    // Use provided options or default ones
    const formatOptions = options || defaultOptions;
    
    return new Intl.DateTimeFormat('en-US', formatOptions).format(date);
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString || 'Unknown date';
  }
};

/**
 * Format a date as a relative time (e.g., "2 days ago")
 * @param dateString - ISO date string or any valid date format
 * @returns Relative time string
 */
export const getRelativeTimeFromNow = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return 'Invalid date';
    }
    
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    // Define time intervals in seconds
    const intervals = {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60,
    };
    
    // Calculate the appropriate time unit
    if (diffInSeconds < 60) {
      return 'just now';
    } else if (diffInSeconds < intervals.hour) {
      const minutes = Math.floor(diffInSeconds / intervals.minute);
      return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
    } else if (diffInSeconds < intervals.day) {
      const hours = Math.floor(diffInSeconds / intervals.hour);
      return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
    } else if (diffInSeconds < intervals.week) {
      const days = Math.floor(diffInSeconds / intervals.day);
      return `${days} ${days === 1 ? 'day' : 'days'} ago`;
    } else if (diffInSeconds < intervals.month) {
      const weeks = Math.floor(diffInSeconds / intervals.week);
      return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
    } else if (diffInSeconds < intervals.year) {
      const months = Math.floor(diffInSeconds / intervals.month);
      return `${months} ${months === 1 ? 'month' : 'months'} ago`;
    } else {
      const years = Math.floor(diffInSeconds / intervals.year);
      return `${years} ${years === 1 ? 'year' : 'years'} ago`;
    }
  } catch (error) {
    console.error('Error calculating relative time:', error);
    return 'Unknown time';
  }
};
