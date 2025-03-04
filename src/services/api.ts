import axios from 'axios';

// Get base URL from environment variables, with a fallback
const API_URL =  'https://techblog-backend-0zpy.onrender.com/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true // Add this line to handle cookies
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle unauthorized errors
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Define API endpoints
export const postAPI = {
  getPosts: () => api.get('/posts'),
  getPostById: (id: string) => api.get(`/posts/${id}`),
  getPostBySlug: (slug: string) => api.get(`/posts/slug/${slug}`),
  getPostsByCategory: (category: string) => api.get(`/posts/category/${category}`),
  getPostsByTag: (tag: string) => api.get(`/posts/tag/${tag}`),
  searchPosts: (query: string) => api.get(`/posts/search?q=${query}`),
  createPost: (postData: any) => 
    api.post('/posts', postData, {
      headers: {
        'Content-Type': 'application/json',
      }
    }),
  updatePost: (id: string, postData: any) => api.put(`/posts/${id}`, postData),
  deletePost: (id: string) => api.delete(`/posts/${id}`),
};

export const authAPI = {
  login: (credentials: { email: string; password: string }) => 
    api.post('/users/login', credentials),
  register: (userData: { name: string; email: string; password: string }) => 
    api.post('/users/register', userData),
  getCurrentUser: () => api.get('/users/me'),
  updateProfile: (userData: any) => api.put('/users/profile', userData),
};

export const commentAPI = {
  getCommentsByPost: (postId: string) => api.get(`/comments/post/${postId}`),
  addComment: (postId: string, content: string) => 
    api.post(`/comments/post/${postId}`, { content }),
  deleteComment: (commentId: string) => api.delete(`/comments/${commentId}`),
};

export default api;
