import { useState, useEffect } from 'react';
import axios from 'axios';
import { postAPI } from '../services/api';

// Types for post data
export interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content?: string;
  thumbnail?: string;
  featuredImage?: string;
  publishedAt: string;
  readingTime: number;
  category?: {
    id: string;
    name: string;
    slug: string;
  };
  tags?: Array<{
    id: string;
    name: string;
    slug: string;
  }>;
  author: {
    id: string;
    name: string;
    avatar?: string;
    bio?: string;
  };
  commentCount?: number;
  likeCount?: number;
  viewCount?: number;
  isBookmarked?: boolean;
}

interface UsePostsResult {
  data: Post[] | null;
  isLoading: boolean;
  error: Error | null;
}

// Convert backend post data to frontend format
const mapPostData = (post: any): Post => {
  return {
    id: post._id,
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt || post.content?.substring(0, 150) + '...',
    content: post.content,
    thumbnail: post.coverImage || post.thumbnail,
    publishedAt: post.publishDate || post.createdAt,
    readingTime: post.readingTime || Math.ceil(post.content?.length / 1000) || 5,
    category: post.category ? {
      id: post.category._id,
      name: post.category.name,
      slug: post.category.slug
    } : undefined,
    tags: post.tags?.map((tag: any) => ({
      id: tag._id,
      name: tag.name, 
      slug: tag.slug
    })),
    author: {
      id: post.author?._id || 'unknown',
      name: post.author?.name || 'Unknown Author',
      avatar: post.author?.avatar,
      bio: post.author?.bio
    },
    commentCount: post.comments?.length || 0,
    likeCount: post.likes || 0,
    viewCount: post.views || 0,
    isBookmarked: false // To be implemented with user's bookmarks
  };
};

// Hook for featured posts
export const useFeaturedPosts = (limit = 3): UsePostsResult => {
  const [data, setData] = useState<Post[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Get featured posts from API
        const response = await postAPI.getPosts({
          limit,
          page: 1,
          featured: 'true',
          sortBy: 'publishDate',
          order: 'desc'
        });
        
        if (response.data && response.data.data) {
          const posts = response.data.data.map(mapPostData);
          setData(posts);
        } else {
          setData([]);
        }
        
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An error occurred'));
        console.error('Error fetching featured posts:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [limit]);

  return { data, isLoading, error };
};

// Hook for latest posts
export const useLatestPosts = (limit = 6): UsePostsResult => {
  const [data, setData] = useState<Post[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Get latest posts from API
        const response = await postAPI.getPosts({
          limit,
          page: 1,
          sortBy: 'publishDate',
          order: 'desc'
        });
        
        if (response.data && response.data.data) {
          const posts = response.data.data.map(mapPostData);
          setData(posts);
        } else {
          setData([]);
        }
        
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An error occurred'));
        console.error('Error fetching latest posts:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [limit]);

  return { data, isLoading, error };
};

// Hook for popular posts
export const usePopularPosts = (limit = 4): UsePostsResult => {
  const [data, setData] = useState<Post[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Get popular posts from API
        const response = await postAPI.getPosts({
          limit,
          page: 1,
          sortBy: 'views',
          order: 'desc'
        });
        
        if (response.data && response.data.data) {
          const posts = response.data.data.map(mapPostData);
          setData(posts);
        } else {
          setData([]);
        }
        
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An error occurred'));
        console.error('Error fetching popular posts:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [limit]);

  return { data, isLoading, error };
}; 