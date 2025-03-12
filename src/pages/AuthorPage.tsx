import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AuthorBio from '../components/blog/AuthorBio';
import BlogCard from '../components/blog/BlogCard';
import { mockAuthor } from '../data/mockAuthors';
import { mockPosts } from '../data/mockPosts';
import { authorsAPI, postAPI } from '../services/api';
import { Helmet } from 'react-helmet-async';

// Define TS interfaces
interface Author {
  id: string;
  name: string;
  avatar?: string;
  bio?: string;
  role?: string;
  socialLinks?: {
    twitter?: string;
    github?: string;
    linkedin?: string;
    website?: string;
  };
  joinedAt?: string;
}

interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  thumbnail?: string;
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
  };
  commentCount?: number;
  likeCount?: number;
  viewCount?: number;
  isBookmarked?: boolean;
}

const AuthorPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [author, setAuthor] = useState<Author | null>(null);
  const [authorPosts, setAuthorPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAuthorData = async () => {
      if (!id) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        // Fetch author data
        const authorResponse = await authorsAPI.getAuthorById(id);
        setAuthor(authorResponse.data);
        
        // Fetch author's posts
        const postsResponse = await postAPI.getPosts({ search: `author:${id}` });
        setAuthorPosts(postsResponse.data.data || []);
      } catch (err) {
        console.error('Error fetching author data:', err);
        setError('Failed to load author information. Please try again later.');
        
        // Fallback to mock data if in development
        if (process.env.NODE_ENV === 'development') {
          setAuthor(mockAuthor);
          const filteredPosts = mockPosts.filter(post => post.author.id === id);
          setAuthorPosts(filteredPosts);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchAuthorData();
  }, [id]);
  
  // Handle a case where author doesn't exist
  useEffect(() => {
    if (!isLoading && !author && !error) {
      navigate('/404');
    }
  }, [isLoading, author, error, navigate]);

  return (
    <>
      <Helmet>
        <title>{author?.name || 'Author'} | Blog</title>
        <meta name="description" content={`Articles written by ${author?.name || 'author'}`} />
      </Helmet>
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : error ? (
          <div className="text-center py-12 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <p className="text-red-600 dark:text-red-400">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : author ? (
          <>
            <AuthorBio author={author} articleCount={authorPosts.length} />
            
            <div className="mt-12">
              <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
                Articles by {author.name}
              </h2>
              
              {authorPosts.length === 0 ? (
                <div className="text-center py-10 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p className="text-gray-600 dark:text-gray-400">No articles found</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {authorPosts.map(post => (
                    <BlogCard 
                      key={post.id}
                      {...post}
                      variant="compact"
                    />
                  ))}
                </div>
              )}
            </div>
          </>
        ) : null}
      </div>
    </>
  );
};

export default AuthorPage; 