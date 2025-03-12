import axios from 'axios';
import authService from './authService';

// Use the environment variable for API URL, or rely on the proxy if not set
const API_URL = import.meta.env.VITE_API_URL || '/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true // Handle cookies
});

// Use a WeakMap to store request metadata without adding custom headers that trigger CORS issues
const requestMetadata = new WeakMap();

// Performance tracking
const trackApiPerformance = (endpoint: string, method: string, startTime: number) => {
  const duration = performance.now() - startTime;
  console.debug(`API ${method} ${endpoint} completed in ${duration.toFixed(2)}ms`);
  
  const markName = `api-${method}-${endpoint}`;
  
  // You could send this to an analytics service
  if (window.performance && window.performance.mark) {
    try {
      // Create end mark
      window.performance.mark(`${markName}-end`);
      
      // Only measure if we have the start mark
      if (performance.getEntriesByName(`${markName}-start`).length) {
        window.performance.measure(
          markName,
          `${markName}-start`,
          `${markName}-end`
        );
      } else {
        // If no start mark, just log the duration we calculated
        console.debug(`No start mark found for ${markName}`);
      }
    } catch (e) {
      console.error('Performance measurement error:', e);
    }
  }
};

// Add request interceptor to include auth token when available
api.interceptors.request.use(
  (config) => {
    // Store the original method and URL to ensure we use the same format in response
    const method = (config.method || 'get').toUpperCase();
    const url = config.url || '';
    
    // Store metadata in WeakMap instead of headers to avoid CORS issues
    requestMetadata.set(config, {
      method,
      url,
      startTime: performance.now()
    });
    
    // Mark performance start time
    if (window.performance && window.performance.mark) {
      const markName = `api-${method}-${url}-start`;
      window.performance.mark(markName);
    }
    
    const token = authService.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Add timestamp to prevent caching where needed
    if (config.method === 'get' && config.params?.noCache) {
      config.params = {
        ...config.params,
        _t: Date.now()
      };
      delete config.params.noCache;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for better error handling and performance tracking
api.interceptors.response.use(
  (response) => {
    // Track API performance using the saved metadata from the WeakMap
    try {
      const metadata = requestMetadata.get(response.config);
      if (metadata) {
        trackApiPerformance(metadata.url, metadata.method, metadata.startTime);
        // Clean up
        requestMetadata.delete(response.config);
      }
    } catch (e) {
      console.error('Error tracking performance:', e);
    }
    return response;
  },
  (error) => {
    // Format error messages from the server
    if (error.response?.data) {
      error.message = error.response.data.message || error.message;
    }
    
    // Handle network errors
    if (!error.response) {
      console.error('Network Error:', error);
      error.message = 'Network error. Please check your connection.';
    }
    
    // Handle JSON parse errors in the response
    if (error.message.includes('JSON')) {
      console.error('JSON Parse Error:', error);
      error.message = 'Error processing server response. Please try again.';
    }

    // Try to track performance for the error case too
    try {
      if (error.config) {
        const metadata = requestMetadata.get(error.config);
        if (metadata) {
          trackApiPerformance(metadata.url, metadata.method, metadata.startTime);
          // Clean up
          requestMetadata.delete(error.config);
        }
      }
    } catch (perfError) {
      console.error('Performance tracking error:', perfError);
    }

    // Handle unauthorized errors
    if (error.response?.status === 401) {
      authService.logout();
      window.location.href = '/login?session=expired';
    }
    
    // Handle server errors
    if (error.response?.status >= 500) {
      console.error('Server Error:', error);
      error.message = 'Server error. Please try again later.';
    }
    
    return Promise.reject(error);
  }
);

// User API operations with improved typings
interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
}

interface UserProfile {
  name: string;
  email: string;
  bio?: string;
  avatar?: string;
  socialLinks?: {
    twitter?: string;
    github?: string;
    linkedin?: string;
    website?: string;
  };
}

export const userAPI = {
  login: (credentials: LoginCredentials) => {
    return api.post('/users/login', credentials);
  },
  register: (userData: RegisterData) => {
    return api.post('/users/register', userData);
  },
  getProfile: () => {
    return api.get('/users/me');
  },
  updateProfile: (userData: Partial<UserProfile>) => {
    return api.put('/users/me', userData);
  },
  changePassword: (data: { currentPassword: string; newPassword: string }) => {
    return api.put('/users/change-password', data);
  },
  requestPasswordReset: (email: string) => {
    return api.post('/users/request-password-reset', { email });
  },
  resetPassword: (data: { token: string; newPassword: string }) => {
    return api.post('/users/reset-password', data);
  },
  logout: () => {
    return api.post('/users/logout');
  }
};

// Blog posts API operations with improved typings and error handling
interface PostQueryParams {
  page?: number;
  limit?: number;
  category?: string;
  tag?: string;
  search?: string;
  sortBy?: string;
  order?: 'asc' | 'desc';
}

// Cache for post data to avoid redundant requests
const postCache = new Map();
const POST_CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

export const postAPI = {
  getPosts: (params: PostQueryParams = {}) => {
    const { page = 1, limit = 10, ...restParams } = params;
    const queryParams = new URLSearchParams();
    
    queryParams.append('page', page.toString());
    queryParams.append('limit', limit.toString());
    
    Object.entries(restParams).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, value.toString());
      }
    });
    
    const url = `/posts?${queryParams.toString()}`;
    return api.get(url);
  },
  
  getPostBySlug: (slug: string) => {
    console.log(`Fetching post with slug: ${slug}`);
    const cacheKey = `post_${slug}`;
    const cachedData = postCache.get(cacheKey);
    
    // If we have cached data and it's not expired, return it
    if (cachedData && Date.now() - cachedData.timestamp < POST_CACHE_DURATION) {
      console.log(`Using cached data for post: ${slug}`);
      return Promise.resolve(cachedData.data);
    }
    
    return api.get(`/posts/slug/${slug}`)
      .then(response => {
        // Cache the result with a timestamp
        postCache.set(cacheKey, {
          data: response,
          timestamp: Date.now()
        });
        return response;
      })
      .catch(error => {
        console.error(`Error fetching post with slug ${slug}:`, error);
        
        // If endpoint not found (404), try alternative endpoints
        if (error.response?.status === 404) {
          console.log('Trying alternative endpoint...');
          // Try these alternative endpoints in sequence
          return api.get(`/posts/by-slug/${slug}`)
            .then(response => {
              postCache.set(cacheKey, {
                data: response,
                timestamp: Date.now()
              });
              return response;
            })
            .catch(err => {
              if (err.response?.status === 404) {
                return api.get(`/posts?slug=${slug}`)
                  .then(response => {
                    // For list endpoint, filter to find post with matching slug
                    if (response.data?.data?.length > 0) {
                      const post = response.data.data.find((p: any) => p.slug === slug);
                      if (post) {
                        const formattedResponse = {
                          ...response,
                          data: {
                            success: true,
                            data: post
                          }
                        };
                        postCache.set(cacheKey, {
                          data: formattedResponse,
                          timestamp: Date.now()
                        });
                        return formattedResponse;
                      }
                    }
                    throw new Error('Post not found in results');
                  });
              }
              throw err;
            });
        }
        throw error;
      });
  },
  
  clearCache: () => {
    postCache.clear();
  },
  
  invalidatePost: (slug: string) => {
    postCache.delete(`post_${slug}`);
  },
  
  getPostById: (id: string) => {
    return api.get(`/posts/${id}`);
  },
  getFeaturedPosts: (limit = 3) => {
    return api.get(`/posts/featured?limit=${limit}`);
  },
  getPopularPosts: (limit = 5) => {
    return api.get(`/posts/popular?limit=${limit}`);
  },
  getTags: () => {
    return api.get('/tags').catch(error => {
      // For missing endpoint, try alternative endpoint
      if (error.response?.status === 404) {
        console.warn('Tags endpoint not found, trying alternative endpoint');
        return api.get('/posts/tags');
      }
      // If all fails, return mock data for development
      if (process.env.NODE_ENV !== 'production') {
        console.warn('Using mock tag data');
        return {
          data: {
            data: [
              { id: '1', name: 'React', slug: 'react', postCount: 8 },
              { id: '2', name: 'JavaScript', slug: 'javascript', postCount: 12 },
              { id: '3', name: 'TypeScript', slug: 'typescript', postCount: 7 },
              { id: '4', name: 'Node.js', slug: 'nodejs', postCount: 6 },
              { id: '5', name: 'CSS', slug: 'css', postCount: 5 },
              { id: '6', name: 'HTML', slug: 'html', postCount: 4 },
              { id: '7', name: 'Git', slug: 'git', postCount: 3 },
              { id: '8', name: 'Docker', slug: 'docker', postCount: 2 },
              { id: '9', name: 'AWS', slug: 'aws', postCount: 3 },
              { id: '10', name: 'UI/UX', slug: 'ui-ux', postCount: 5 },
            ]
          }
        };
      }
      throw error;
    });
  },
  createPost: (postData: FormData) => {
    // Log the FormData content prior to sending
    console.log("Sending post FormData to server...");
    
    // Log FormData contents without actually displaying file contents
    for (const pair of postData.entries()) {
      if (pair[0] === 'images' && pair[1] instanceof File) {
        console.log(`FormData: ${pair[0]} = File: ${(pair[1] as File).name} (${(pair[1] as File).size} bytes)`);
      } else {
        console.log(`FormData: ${pair[0]} = ${pair[1]}`);
      }
    }
    
    // When sending FormData, we need to make sure to let the browser set Content-Type
    return api.post('/posts', postData, {
      headers: {
        // Remove Content-Type so browser can set it with correct boundary
      },
      // Add onUploadProgress to track upload
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
        console.log(`Upload progress: ${percentCompleted}%`);
      }
    })
    .then(response => {
      console.log("Post created response:", response.data);
      return response;
    })
    .catch(error => {
      console.error("Error creating post:", error.response?.data || error.message);
      throw error;
    });
  },
  updatePost: (id: string, postData: FormData) => {
    // Log the FormData content prior to sending
    console.log(`Updating post ${id}...`);
    
    // Log FormData contents for debugging
    for (const pair of postData.entries()) {
      if (pair[0] === 'images' && pair[1] instanceof File) {
        console.log(`FormData: ${pair[0]} = File: ${(pair[1] as File).name} (${(pair[1] as File).size} bytes)`);
      } else {
        console.log(`FormData: ${pair[0]} = ${pair[1]}`);
      }
    }
    
    return api.put(`/posts/${id}`, postData, {
      headers: {
        // Let browser set the correct Content-Type with boundary
      },
      // Add onUploadProgress to track upload
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
        console.log(`Upload progress: ${percentCompleted}%`);
      }
    })
    .then(response => {
      console.log("Post updated response:", response.data);
      return response;
    })
    .catch(error => {
      console.error("Error updating post:", error.response?.data || error.message);
      throw error;
    });
  },
  deletePost: (id: string) => {
    return api.delete(`/posts/${id}`);
  },
  // Comment related operations
  getComments: (postId: string, page = 1, limit = 10) => {
    return api.get(`/comments?postId=${postId}&page=${page}&limit=${limit}`);
  },
  addComment: (postId: string, commentData: { content: string }) => {
    return api.post(`/comments`, { ...commentData, postId });
  },
  deleteComment: (commentId: string) => {
    return api.delete(`/comments/${commentId}`);
  },
  updateComment: (commentId: string, content: string) => {
    return api.put(`/comments/${commentId}`, { content });
  },
  likePost: (postId: string) => {
    return api.post(`/posts/${postId}/like`);
  },
  unlikePost: (postId: string) => {
    return api.delete(`/posts/${postId}/like`);
  },
  getRelatedPosts: (postId: string, limit = 3) => {
    return api.get(`/posts/${postId}/related?limit=${limit}`);
  },
  searchPosts: (query: string, limit = 10) => {
    return api.get(`/posts/search?q=${encodeURIComponent(query)}&limit=${limit}`);
  }
};

// Categories API operations
export const categoryAPI = {
  getCategories: () => {
    return api.get('/categories').catch(error => {
      // If the plural endpoint fails, try the singular as fallback
      if (error.response?.status === 404) {
        return api.get('/category/all'); 
      }
      throw error;
    });
  },
  getCategoryBySlug: (slug: string) => {
    return api.get(`/categories/slug/${slug}`);
  },
  createCategory: (data: { name: string; description?: string; slug?: string }) => {
    return api.post('/categories', data);
  },
  updateCategory: (id: string, data: { name?: string; description?: string; slug?: string }) => {
    return api.put(`/categories/${id}`, data);
  },
  deleteCategory: (id: string) => {
    return api.delete(`/categories/${id}`);
  },
};

// Upload API operations
export const uploadAPI = {
  uploadImage: (file: File, type = 'post') => {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('type', type);
    
    return api.post('/uploads', formData, {
      headers: {
        // Let browser set the content type with boundary
      }
    });
  },
  deleteImage: (imageId: string) => {
    return api.delete(`/uploads/${imageId}`);
  }
};

// Authors API operations
export const authorsAPI = {
  getAuthors: (page = 1, limit = 10) => {
    return api.get(`/authors?page=${page}&limit=${limit}`).catch(error => {
      // If the authors endpoint fails, try users as fallback
      if (error.response?.status === 404) {
        return api.get(`/users?page=${page}&limit=${limit}`);
      }
      throw error;
    });
  },
  getAuthorById: (id: string) => {
    return api.get(`/authors/${id}`).catch(error => {
      // If the authors endpoint fails, try users as fallback
      if (error.response?.status === 404) {
        return api.get(`/users/${id}`);
      }
      
      // For development mode, return mock data if API fails
      if (process.env.NODE_ENV !== 'production') {
        console.warn('Using mock author data');
        return {
          data: {
            id,
            name: 'John Doe',
            avatar: 'https://source.unsplash.com/random/100x100/?portrait',
            bio: 'Tech enthusiast and software developer with a passion for creating intuitive user experiences.',
            role: 'Tech Writer',
            socialLinks: {
              twitter: 'https://twitter.com',
              github: 'https://github.com',
              linkedin: 'https://linkedin.com',
              website: 'https://example.com',
            },
            joinedAt: '2023-01-01T00:00:00.000Z'
          }
        };
      }
      
      throw error;
    });
  },
  getAuthorByUsername: (username: string) => {
    return api.get(`/authors/username/${username}`).catch(error => {
      // If the authors endpoint fails, try users as fallback
      if (error.response?.status === 404) {
        return api.get(`/users/username/${username}`);
      }
      throw error;
    });
  },
  getPostsByAuthor: (authorId: string, page = 1, limit = 10) => {
    return api.get(`/posts?author=${authorId}&page=${page}&limit=${limit}`);
  }
};

// Dashboard API calls
const getDashboardStats = async (timeFilter: 'today' | 'week' | 'month' = 'week') => {
  try {
    const response = await api.get(`/api/dashboard/stats`, {
      params: { timeFilter }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    throw error;
  }
};

const getDashboardActivities = async (limit: number = 10) => {
  try {
    const response = await api.get(`/api/dashboard/activities`, {
      params: { limit }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching dashboard activities:', error);
    throw error;
  }
};

const getDashboardPopularPosts = async (limit: number = 5) => {
  try {
    const response = await api.get(`/api/dashboard/popular-posts`, {
      params: { limit }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching popular posts:', error);
    throw error;
  }
};

const getDashboardUserMetrics = async (timeFilter: 'today' | 'week' | 'month' = 'week') => {
  try {
    const response = await api.get(`/api/dashboard/user-metrics`, {
      params: { timeFilter }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching user metrics:', error);
    throw error;
  }
};

const getDashboardNotifications = async (limit: number = 10) => {
  try {
    const response = await api.get(`/api/dashboard/notifications`, {
      params: { limit }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching notifications:', error);
    throw error;
  }
};

// Scheduled Posts API calls
const getScheduledPosts = async () => {
  try {
    const response = await api.get('/api/posts', {
      params: {
        published: false,
        hasPublishDate: true,
        sort: 'publishDate',
        order: 'asc'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching scheduled posts:', error);
    throw error;
  }
};

const publishPostNow = async (postId: string) => {
  try {
    const response = await api.put(`/api/posts/${postId}`, {
      published: true,
      publishDate: new Date().toISOString()
    });
    return response.data;
  } catch (error) {
    console.error('Error publishing post:', error);
    throw error;
  }
};

const schedulePost = async (postId: string, publishDate: string) => {
  try {
    const response = await api.put(`/api/posts/${postId}`, {
      published: false,
      publishDate
    });
    return response.data;
  } catch (error) {
    console.error('Error scheduling post:', error);
    throw error;
  }
};

// Export default api instance for custom requests
export default {
  ...api,
  getDashboardStats,
  getDashboardActivities,
  getDashboardPopularPosts,
  getDashboardUserMetrics,
  getDashboardNotifications,
  getScheduledPosts,
  publishPostNow,
  schedulePost
};
