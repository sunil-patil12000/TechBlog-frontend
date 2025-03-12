import React from 'react';
import { Link } from 'react-router-dom';
import { formatDate } from '../utils/dateUtils';
import { useBlog } from '../contexts/BlogContext';

interface Post {
  _id: string;
  title: string;
  slug: string;
  content?: string;
  excerpt?: string;
  createdAt: string;
  author?: {
    name: string;
    avatar?: string;
  };
  images?: {
    url: string;
    alt?: string;
    _id: string;
  }[];
  category?: any;
  tags?: string[];
}

interface PostListProps {
  posts: Post[];
  view?: 'grid' | 'list';
}

const PostList: React.FC<PostListProps> = ({ posts, view = 'grid' }) => {
  const { addToHistory } = useBlog();

  if (!posts || posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No posts found</p>
      </div>
    );
  }

  if (view === 'list') {
    return (
      <div className="space-y-6">
        {posts.map((post) => {
          const postSlug = post.slug || post._id;
          
          return (
            <div key={post._id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <Link 
                  to={`/blog/${postSlug}`} 
                  className="block"
                  onClick={() => addToHistory(post._id)}
                >
                  <h2 className="text-xl font-bold hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    {post.title}
                  </h2>
                </Link>
                
                <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm mt-2">
                  {post.author && <span className="mr-3">{post.author.name}</span>}
                  <time dateTime={post.createdAt}>{formatDate(post.createdAt)}</time>
                  
                  {post.category && (
                    <>
                      <span className="mx-2">•</span>
                      <span className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-2 py-0.5 rounded text-xs">
                        {typeof post.category === 'object' ? post.category.name : post.category}
                      </span>
                    </>
                  )}
                </div>
                
                {post.excerpt && (
                  <p className="mt-2 text-gray-600 dark:text-gray-300 line-clamp-2">
                    {post.excerpt}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // Default grid view
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((post) => {
        // Ensure we have a valid slug
        const postSlug = post.slug || post._id;
        
        return (
          <div key={post._id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden flex flex-col h-full">
            <Link 
              to={`/blog/${postSlug}`} 
              className="block hover:opacity-90 transition-opacity"
              onClick={() => addToHistory(post._id)}
            >
              {post.images && post.images.length > 0 && post.images[0]?.url ? (
                <div className="h-48 overflow-hidden">
                  <img 
                    src={post.images[0].url} 
                    alt={post.images[0].alt || post.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="h-48 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  <span className="text-gray-500 dark:text-gray-400">No image</span>
                </div>
              )}
            </Link>
            
            <div className="p-6 flex-grow flex flex-col">
              <Link 
                to={`/blog/${postSlug}`} 
                className="block"
                onClick={() => addToHistory(post._id)}
              >
                <h2 className="text-xl font-bold hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  {post.title}
                </h2>
              </Link>
              
              <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm mt-2">
                {post.author && <span className="mr-3">{post.author.name}</span>}
                <time dateTime={post.createdAt}>{formatDate(post.createdAt)}</time>
                
                {post.category && (
                  <>
                    <span className="mx-2">•</span>
                    <span className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-2 py-0.5 rounded text-xs">
                      {typeof post.category === 'object' ? post.category.name : post.category}
                    </span>
                  </>
                )}
              </div>
              
              {post.excerpt && (
                <p className="mt-4 text-gray-600 dark:text-gray-300 line-clamp-3">
                  {post.excerpt}
                </p>
              )}
              
              <Link 
                to={`/blog/${postSlug}`}
                className="inline-block mt-auto pt-4 text-blue-600 dark:text-blue-400 hover:underline"
                onClick={() => addToHistory(post._id)}
              >
                Read more →
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PostList;
