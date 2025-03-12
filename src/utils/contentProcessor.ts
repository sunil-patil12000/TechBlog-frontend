/**
 * This utility processes content from TinyMCE to ensure consistent image paths
 */

import DOMPurify from 'dompurify';
import { getUploadUrl, UPLOADS_BASE_URL } from '../config/constants';

/**
 * Sanitizes HTML content to prevent XSS attacks
 * @param content HTML content to sanitize
 * @returns Sanitized HTML
 */
export const sanitizeHtml = (content: string): string => {
  return DOMPurify.sanitize(content);
};

/**
 * Processes HTML content to normalize image URLs
 * @param content HTML content containing images
 * @returns HTML content with normalized image URLs
 */
export const processContent = (content: string): string => {
  if (!content) return '';
  
  try {
    // First normalize image paths
    let processedContent = normalizeContentImagePaths(content);
    
    // Create a temporary DOM element to parse the HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = processedContent;
    
    // Add responsive classes to tables
    const tables = tempDiv.querySelectorAll('table');
    tables.forEach(table => {
      table.classList.add('w-full', 'overflow-x-auto', 'my-4');
      
      // Wrap table in a div for better mobile handling if not already wrapped
      if (table.parentElement?.tagName !== 'DIV' || !table.parentElement.classList.contains('table-responsive')) {
        const wrapper = document.createElement('div');
        wrapper.classList.add('table-responsive', 'overflow-x-auto', 'w-full', 'my-4');
        table.parentNode?.insertBefore(wrapper, table);
        wrapper.appendChild(table);
      }
    });
    
    // Add responsive classes to images not already in figure elements
    const images = tempDiv.querySelectorAll('img:not(figure img)');
    images.forEach(img => {
      // Add responsive classes
      img.classList.add('max-w-full', 'h-auto', 'my-4', 'mx-auto');
      
      // Add lazy loading if not already set
      if (!img.hasAttribute('loading')) {
        img.setAttribute('loading', 'lazy');
      }
      
      // Add alt text if missing
      if (!img.hasAttribute('alt') || img.getAttribute('alt') === '') {
        img.setAttribute('alt', 'Blog post image');
      }
    });
    
    // Process code blocks
    const codeBlocks = tempDiv.querySelectorAll('pre code');
    codeBlocks.forEach(code => {
      const pre = code.parentElement;
      if (pre) {
        pre.classList.add('bg-gray-100', 'dark:bg-gray-800', 'p-4', 'rounded', 'overflow-x-auto', 'my-4');
      }
      code.classList.add('text-sm');
    });
    
    // Process blockquotes
    const blockquotes = tempDiv.querySelectorAll('blockquote');
    blockquotes.forEach(quote => {
      quote.classList.add('border-l-4', 'border-gray-300', 'dark:border-gray-600', 'pl-4', 'italic', 'my-4', 'py-2');
    });
    
    // Return the processed HTML
    return tempDiv.innerHTML;
  } catch (error) {
    console.error('Error processing content:', error);
    return content;
  }
};

/**
 * Extracts the first image URL from HTML content
 * @param content HTML content to extract from
 * @returns The first image URL or null if none found
 */
export const extractFirstImage = (content: string): string | null => {
  if (!content) return null;
  
  const parser = new DOMParser();
  const doc = parser.parseFromString(content, 'text/html');
  const firstImg = doc.querySelector('img');
  
  if (firstImg && firstImg.src) {
    return firstImg.src;
  }
  
  return null;
};

/**
 * Process image URLs individually (for attributes, etc.)
 * @param url The image URL to normalize
 * @returns Normalized URL
 */
export function normalizeImageUrl(url: string | null | undefined): string {
  if (!url) return '';
  
  // If it's already an absolute URL with http or https, return as is
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  // Handle relative paths
  if (url.includes('../uploads/') || url.includes('../../uploads/')) {
    const normalizedPath = url.replace(/(\.\.\/)+uploads\//, '/uploads/');
    return `${UPLOADS_BASE_URL.replace(/\/uploads$/, '')}${normalizedPath}`;
  }
  
  // Handle API paths
  if (url.startsWith('/api/uploads/')) {
    const normalizedPath = url.replace('/api/uploads/', '/uploads/');
    return `${UPLOADS_BASE_URL.replace(/\/uploads$/, '')}${normalizedPath}`;
  }
  
  // Handle localhost URLs
  if (url.includes('localhost') && url.includes('/uploads/')) {
    const path = url.substring(url.indexOf('/uploads/'));
    return `${UPLOADS_BASE_URL.replace(/\/uploads$/, '')}${path}`;
  }
  
  // Handle paths that don't start with '/uploads/' but contain 'uploads/'
  if (!url.startsWith('/uploads/') && url.includes('uploads/')) {
    const path = '/uploads/' + url.substring(url.indexOf('uploads/') + 8);
    return `${UPLOADS_BASE_URL.replace(/\/uploads$/, '')}${path}`;
  }
  
  // Ensure the path always starts with the URL prefix for local uploads
  if (!url.startsWith('/') && !url.startsWith('http')) {
    return `${UPLOADS_BASE_URL}/${url}`;
  }
  
  // If it's already a path starting with /uploads/, prepend the server URL
  if (url.startsWith('/uploads/')) {
    return `${UPLOADS_BASE_URL.replace(/\/uploads$/, '')}${url}`;
  }
  
  return url;
}

/**
 * Utility functions for processing content, especially handling image paths in HTML content
 */

/**
 * Normalizes image paths in HTML content
 * This is particularly useful for content from rich text editors like TinyMCE
 * 
 * @param content HTML content string
 * @returns HTML content with normalized image paths
 */
export const normalizeContentImagePaths = (content: string): string => {
  if (!content) return '';
  
  try {
    // Create a temporary DOM element to parse the HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = content;
    
    // Find all images in the content
    const images = tempDiv.querySelectorAll('img');
    
    // Process each image
    images.forEach(img => {
      const originalSrc = img.getAttribute('src');
      if (!originalSrc) return;
      
      // Apply the normalized URL function
      const normalizedSrc = normalizeImageUrl(originalSrc);
      
      // Update the src attribute if it changed
      if (normalizedSrc !== originalSrc) {
        img.setAttribute('src', normalizedSrc);
      }
      
      // Add loading="lazy" for better performance
      if (!img.hasAttribute('loading')) {
        img.setAttribute('loading', 'lazy');
      }
    });
    
    // Return the processed HTML
    return tempDiv.innerHTML;
  } catch (error) {
    console.error('Error normalizing content image paths:', error);
    return content;
  }
};

/**
 * Extracts the first image URL from HTML content
 * Useful for generating thumbnails from content
 * 
 * @param content HTML content string
 * @returns The first image URL found, or null if none
 */
export const extractFirstImageFromContent = (content: string): string | null => {
  if (!content) return null;
  
  try {
    // Create a temporary DOM element to parse the HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = content;
    
    // Find the first image
    const firstImage = tempDiv.querySelector('img');
    if (!firstImage) return null;
    
    // Get and normalize the src
    const src = firstImage.getAttribute('src');
    if (!src) return null;
    
    return src;
  } catch (error) {
    console.error('Error extracting first image from content:', error);
    return null;
  }
};

/**
 * Creates a plain text excerpt from HTML content
 * 
 * @param content HTML content string
 * @param maxLength Maximum length of the excerpt
 * @returns Plain text excerpt
 */
export const createExcerpt = (content: string, maxLength: number = 150): string => {
  if (!content) return '';
  
  try {
    // Create a temporary DOM element to parse the HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = content;
    
    // Get the text content
    let text = tempDiv.textContent || tempDiv.innerText || '';
    
    // Trim and limit length
    text = text.trim();
    if (text.length <= maxLength) return text;
    
    // Cut at the last space before maxLength to avoid cutting words
    const truncated = text.substring(0, maxLength);
    const lastSpace = truncated.lastIndexOf(' ');
    
    if (lastSpace > 0) {
      return truncated.substring(0, lastSpace) + '...';
    }
    
    return truncated + '...';
  } catch (error) {
    console.error('Error creating excerpt:', error);
    return content.substring(0, maxLength) + '...';
  }
};

export default {
  normalizeContentImagePaths,
  extractFirstImageFromContent,
  createExcerpt,
  processContent
}; 