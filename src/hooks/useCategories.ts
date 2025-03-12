import { useState, useEffect } from 'react';
import axios from 'axios';
import * as Icons from 'lucide-react';

// Types for category data
export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  postCount?: number;
}

interface UseCategoriesResult {
  categories: Category[];
  isLoading: boolean;
  error: Error | null;
}

// API base URL from environment variables
const API_URL = import.meta.env.VITE_API_URL || '/api';

// Valid Lucide icon names for categories
const validIcons = Object.keys(Icons).filter(icon => 
  typeof Icons[icon as keyof typeof Icons] === 'function' && 
  !['default', 'createLucideIcon'].includes(icon)
);

/**
 * Hook to fetch blog categories from the API
 */
export const useCategories = (): UseCategoriesResult => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${API_URL}/categories`);
        
        if (response.data && response.data.data) {
          // Map the category data to the expected format
          const mappedCategories = response.data.data.map((category: any) => ({
            id: category._id,
            name: category.name,
            slug: category.slug,
            description: category.description,
            image: category.image,
            postCount: category.postCount
          }));
          
          setCategories(mappedCategories);
        } else {
          // Fallback to empty array if no data
          setCategories([]);
        }
        
        setError(null);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError(err instanceof Error ? err : new Error('An error occurred while fetching categories'));
        
        // Provide some default categories as fallback in case of error
        setCategories([
          {
            id: 'web-development',
            name: 'Web Development',
            slug: 'web-development',
            description: 'Articles about web development',
            postCount: 12
          },
          {
            id: 'javascript',
            name: 'JavaScript',
            slug: 'javascript',
            description: 'JavaScript tutorials and tips',
            postCount: 8
          },
          {
            id: 'react',
            name: 'React',
            slug: 'react',
            description: 'React framework and ecosystem',
            postCount: 10
          }
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, isLoading, error };
}; 