import axios from 'axios';

interface UnsplashPhoto {
  id: string;
  urls: {
    raw: string;
    full: string;
    regular: string;
    small: string;
    thumb: string;
  };
  description: string | null;
  alt_description: string | null;
  user: {
    name: string;
    username: string;
    links: {
      html: string;
    };
  };
}

interface UnsplashImageOptions {
  width: number;
  height: number;
  quality?: number;
  fit?: 'crop' | 'clamp' | 'fill' | 'scale' | 'max';
}

const UNSPLASH_API_URL = 'https://api.unsplash.com';
// Get Unsplash API key from environment or use a fallback placeholder value
const UNSPLASH_ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;

// Check if we have a valid API key (not placeholder text or empty)
const hasValidApiKey = UNSPLASH_ACCESS_KEY && 
                      UNSPLASH_ACCESS_KEY !== 'your_unsplash_access_key_here' && 
                      UNSPLASH_ACCESS_KEY.length > 5;

// Log warning if API key is missing
if (!hasValidApiKey) {
  console.warn('Unsplash API key is missing or invalid. Using fallback method for image generation. To use the Unsplash API, add a valid API key to your .env file as VITE_UNSPLASH_ACCESS_KEY.');
}

/**
 * Get a random image from Unsplash based on query
 */
export const getRandomUnsplashImage = async (
  query: string, 
  options: UnsplashImageOptions
): Promise<{
  url: string;
  photographer: {
    name: string;
    username: string;
    profileUrl: string;
  };
  description: string;
}> => {
  // If we don't have a valid API key, use the fallback method
  if (!hasValidApiKey) {
    const fallbackUrl = getUnsplashImage(query, options);
    return {
      url: fallbackUrl,
      photographer: {
        name: 'Unsplash',
        username: 'unsplash',
        profileUrl: 'https://unsplash.com'
      },
      description: query
    };
  }
  
  try {
    const response = await axios.get(`${UNSPLASH_API_URL}/photos/random`, {
      params: {
        query,
        orientation: 'landscape',
      },
      headers: {
        Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`
      }
    });

    const photo: UnsplashPhoto = response.data;
    
    // Format the URL with the desired width and height
    const { width, height, quality = 80, fit = 'crop' } = options;
    const url = `${photo.urls.raw}&w=${width}&h=${height}&q=${quality}&fit=${fit}&auto=format`;
    
    return {
      url,
      photographer: {
        name: photo.user.name,
        username: photo.user.username,
        profileUrl: photo.user.links.html
      },
      description: photo.description || photo.alt_description || query
    };
  } catch (error) {
    // Check for specific error types
    if (axios.isAxiosError(error) && error.response) {
      if (error.response.status === 403) {
        console.error('Unsplash API returned a 403 Forbidden error. Your API key may be invalid or you have exceeded rate limits.');
      } else if (error.response.status === 401) {
        console.error('Unsplash API returned a 401 Unauthorized error. Your API key is invalid.');
      } else {
        console.error(`Unsplash API error (${error.response.status}):`, error.response.data);
      }
    } else {
      console.error('Error fetching from Unsplash API:', error);
    }
    
    // Always fall back to the non-API method
    return {
      url: getUnsplashImage(query, options),
      photographer: {
        name: 'Unsplash',
        username: 'unsplash',
        profileUrl: 'https://unsplash.com'
      },
      description: query
    };
  }
};

/**
 * Legacy method - uses Unsplash Source (no API key required)
 * This is kept for fallback purposes
 */
export const getUnsplashImage = (query: string, options: { 
  width: number,
  height: number,
  slug?: string
}) => {
  const baseUrl = 'https://source.unsplash.com/random/';
  return `${baseUrl}${options.width}x${options.height}/?${query}&sig=${options.slug || Math.random()}`;
}; 