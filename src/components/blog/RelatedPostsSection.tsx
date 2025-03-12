import React from 'react';
import { Link } from 'react-router-dom';
import { formatDate } from '../../utils/dateFormatter';
import NormalizedImage from '../common/NormalizedImage';

interface Post {
  id: string;
  slug: string;
  title: string;
  publishedAt: string;
  thumbnail?: {
    url: string;
    alt?: string;
  } | string;
  images?: {
    url: string;
    alt?: string;
  }[];
}

interface RelatedPostsSectionProps {
  posts: Post[];
  className?: string;
}

const RelatedPostsSection: React.FC<RelatedPostsSectionProps> = ({ posts, className = '' }) => {
  if (!posts || posts.length === 0) {
    return null;
  }

  // Helper function to get image URL
  const getImageUrl = (post: Post) => {
    if (post.thumbnail) {
      if (typeof post.thumbnail === 'string') {
        return normalizeImageUrl(post.thumbnail);
      } else if (post.thumbnail.url) {
        return normalizeImageUrl(post.thumbnail.url);
      }
    }
    
    if (post.images && post.images.length > 0) {
      const firstImage = post.images[0];
      if (typeof firstImage === 'string') {
        return normalizeImageUrl(firstImage);
      } else if (firstImage.url) {
        return normalizeImageUrl(firstImage.url);
      }
    }
    
    return '/images/placeholder-post.jpg';
  };

  // Helper function to get image alt text
  const getImageAlt = (post: Post) => {
    if (post.thumbnail && typeof post.thumbnail === 'object' && post.thumbnail.alt) {
      return post.thumbnail.alt;
    }
    
    if (post.images && post.images.length > 0 && post.images[0].alt) {
      return post.images[0].alt;
    }
    
    return post.title;
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 ${className}`}>
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Related Posts</h3>
      <div className="space-y-4">
        {posts.map((post) => (
          <div key={post.id} className="flex space-x-4">
            <NormalizedImage
              src={getImageUrl(post)}
              alt={getImageAlt(post)}
              className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
              fallback={
                <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                  <span className="text-gray-400 text-xs">No image</span>
                </div>
              }
            />
            <div>
              <Link
                to={`/blog/${post.slug}`}
                className="font-medium text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 text-sm line-clamp-2"
              >
                {post.title}
              </Link>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {formatDate(post.publishedAt)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RelatedPostsSection; 