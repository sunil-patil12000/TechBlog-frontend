import { useState, useEffect } from 'react';
import axios from 'axios';

// Define the Tag interface
export interface Tag {
  id: string;
  name: string;
  slug: string;
  postCount?: number;
}

interface UseTagsResult {
  tags: Tag[];
  isLoading: boolean;
  error: Error | null;
}

// API base URL from environment variables
const API_URL = import.meta.env.VITE_API_URL || '/api';

/**
 * Hook to fetch blog tags from the API
 */
export const useTags = (): UseTagsResult => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${API_URL}/tags`);
        
        if (response.data && response.data.data) {
          // Map the tag data to the expected format
          const mappedTags = response.data.data.map((tag: any) => ({
            id: tag._id,
            name: tag.name,
            slug: tag.slug,
            postCount: tag.postCount
          }));
          
          setTags(mappedTags);
        } else {
          // Fallback to empty array if no data
          setTags([]);
        }
        
        setError(null);
      } catch (err) {
        console.error('Error fetching tags:', err);
        setError(err instanceof Error ? err : new Error('An error occurred while fetching tags'));
        
        // Provide some default tags as fallback in case of error
        setTags([
          {
            id: 'javascript',
            name: 'JavaScript',
            slug: 'javascript',
            postCount: 12
          },
          {
            id: 'react',
            name: 'React',
            slug: 'react',
            postCount: 8
          },
          {
            id: 'node',
            name: 'Node.js',
            slug: 'node',
            postCount: 6
          },
          {
            id: 'typescript',
            name: 'TypeScript',
            slug: 'typescript',
            postCount: 10
          }
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTags();
  }, []);

  return { tags, isLoading, error };
}; 