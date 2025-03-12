import React from 'react';
import { Link } from 'react-router-dom';
import { Post } from '../../types/blog';
import { formatDate } from '../../utils/dateFormatter';
import NormalizedImage from '../common/NormalizedImage';
import { createExcerpt, normalizeImageUrl } from '../../utils/contentProcessor';
import Avatar from '../shared/Avatar';

interface BlogPostCardProps {
  post: Post;
  compact?: boolean;
}

const BlogPostCard: React.FC<BlogPostCardProps> = ({ post, compact = false }) => {
  const {
    _id,
    slug,
    title,
    content,
    author,
    publishDate,
    thumbnail,
    category,
    tags = []
  } = post;

  // Generate excerpt from content using our utility
  const excerpt = React.useMemo(() => {
    return createExcerpt(content || '', 150);
  }, [content]);

  // Process thumbnail for proper rendering using our hook
  const thumbnailSrc = React.useMemo(() => {
    if (!thumbnail) return '';
    
    // If thumbnail is a string, use it directly
    if (typeof thumbnail === 'string') {
      return thumbnail;
    }
    
    // If thumbnail is an object with url property
    if (typeof thumbnail === 'object' && thumbnail.url) {
      return thumbnail.url;
    }

    // If thumbnail is an object with different structure
    if (typeof thumbnail === 'object') {
      // Common property names for thumbnails
      const possibleProps = ['src', 'path', 'image', 'imageUrl', 'coverImage'];
      for (const prop of possibleProps) {
        if (thumbnail[prop]) {
          return thumbnail[prop];
        }
      }
    }
    
    return '';
  }, [thumbnail]);

  // Use our custom hook for avatar URL
  const avatarUrl = author && author.avatar ? normalizeImageUrl(author.avatar) : '';

  return (
    <div className="relative group bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200/50 dark:border-gray-700/50 w-full">
      <Link to={`/blog/${slug}`} className="flex flex-row">
        <div className="w-1/3 relative overflow-hidden">
          <NormalizedImage
            src={thumbnailSrc}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900/20" />
        </div>
        
        <div className="w-2/3 p-4 flex flex-col">
          <div className="flex items-center justify-between mb-2">
            {category && (
              <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400">
                {typeof category === 'string' ? category : category.name}
              </span>
            )}
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {formatDate(publishDate || '')}
            </span>
          </div>
          
          <h2 className="text-base font-semibold text-gray-900 dark:text-white line-clamp-2 mb-2">
            {title}
          </h2>
          
          <div className="flex items-center space-x-2">
            <Avatar
              src={avatarUrl}
              alt={author?.name || 'Author'}
              size="xs"
              className="flex-shrink-0"
              fallbackClassName="bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400"
            />
            <span className="text-xs text-gray-600 dark:text-gray-300">
              {author?.name || 'Unknown Author'}
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default BlogPostCard; 