import React from 'react';
import { Link } from 'react-router-dom';
import { formatDate } from '../../utils/dateUtils';

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

interface PostCardProps {
  post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  // Ensure we have a valid slug for the link
  const postSlug = post.slug || post._id;
  
  // Handle missing date
  const formattedDate = post.createdAt ? formatDate(post.createdAt) : 'Unknown date';
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden h-full flex flex-col">
      <Link to={`/blog/${postSlug}`} className="block overflow-hidden h-48">
        {post.images && post.images.length > 0 && post.images[0]?.url ? (
          <img 
            src={post.images[0].url} 
            alt={post.images[0].alt || post.title} 
            className="w-full h-full object-cover transition-transform hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center">
            <span className="text-gray-500 dark:text-gray-400">No image</span>
          </div>
        )}
      </Link>
      
      <div className="p-5 flex-1 flex flex-col">
        <div className="mb-2 flex-grow">
          <Link to={`/blog/${postSlug}`} className="block">
            <h3 className="text-xl font-bold hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              {post.title}
            </h3>
          </Link>
          
          <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm mt-2">
            <time dateTime={post.createdAt}>{formattedDate}</time>
            
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
            <p className="mt-3 text-gray-600 dark:text-gray-300 line-clamp-3">
              {post.excerpt}
            </p>
          )}
        </div>
        
        <Link 
          to={`/blog/${postSlug}`}
          className="inline-block mt-4 text-blue-600 dark:text-blue-400 hover:underline"
        >
          Read more →
        </Link>
      </div>
    </div>
  );
};

export default PostCard;
