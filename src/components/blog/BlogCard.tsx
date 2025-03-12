import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { format, isValid, parseISO } from 'date-fns';
import { Clock, Eye, Heart, MessageSquare, Bookmark, BookmarkCheck, Calendar, MapPin, ArrowRight } from 'lucide-react';
import LazyImage from '../ui/LazyImage';
import Tag from '../ui/Tag';
import { useAuth } from '../../contexts/AuthContext';
import { getUnsplashImage, getRandomUnsplashImage } from '../../utils/unsplash';
import { cn } from '@/lib/utils';

// API base URL for images
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';

// Helper function to normalize image URLs
const normalizeImageUrl = (url: string): string => {
  if (!url) return '';
  
  // If it's already an absolute URL (starts with http:// or https://)
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  // If it's a relative URL starting with /uploads
  if (url.startsWith('/uploads') || url.startsWith('uploads')) {
    const normalizedPath = url.startsWith('/') ? url : `/${url}`;
    return `${API_BASE_URL}${normalizedPath}`;
  }
  
  // For other relative URLs
  return `${API_BASE_URL}/${url}`;
};

interface Author {
  id: string;
  name: string;
  avatar?: string;
}

interface BlogCardProps {
  id: string;
  slug: string;
  title: string;
  excerpt?: string;
  thumbnail?: {
    url: string;
    alt?: string;
  } | string;
  images?: {
    url: string;
    alt?: string;
  }[];
  publishedAt?: string;
  readingTime?: number;
  category?: {
    name: string;
    slug: string;
  };
  tags?: string[];
  author?: Author;
  commentCount?: number;
  likeCount?: number;
  viewCount?: number;
  isBookmarked?: boolean;
  isFeatured?: boolean;
  variant?: 'default' | 'compact' | 'featured';
  onClick?: () => void;
  isBreakingNews?: boolean;
  eventDate?: string;
  eventLocation?: string;
}

const BlogCard: React.FC<BlogCardProps> = ({
  id,
  slug,
  title,
  excerpt,
  thumbnail,
  images,
  publishedAt,
  readingTime,
  category,
  tags = [],
  author,
  commentCount = 0,
  likeCount = 0,
  viewCount = 0,
  isBookmarked = false,
  isFeatured = false,
  variant = 'default',
  onClick,
  isBreakingNews,
  eventDate,
  eventLocation,
}) => {
  const { isAuthenticated } = useAuth();
  const [imageData, setImageData] = useState<{
    url: string;
    photographer: {
      name: string;
      username: string;
      profileUrl: string;
    };
  } | null>(null);
  const [isLoadingImage, setIsLoadingImage] = useState(false);
  
  // Format date safely
  const getFormattedDate = (dateString?: string): string => {
    if (!dateString) {
      return 'No date';
    }
    
    try {
      const date = parseISO(dateString);
      if (!isValid(date)) {
        return 'Invalid date';
      }
      return format(date, 'MMM dd, yyyy');
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  };
  
  // Fetch image on component mount
  useEffect(() => {
    const fetchImage = async () => {
      if (!thumbnail) return;
      
      setIsLoadingImage(true);
      try {
        const query = category?.name || 'tech news';
        
        // Skip the failing API call and use the fallback directly
        const fallbackUrl = getUnsplashImage(query, { 
          width: 800, 
          height: 450,
          slug 
        });
        setImageData({
          url: fallbackUrl,
          photographer: {
            name: 'Unsplash',
            username: 'unsplash',
            profileUrl: 'https://unsplash.com'
          }
        });
      } catch (error) {
        console.error('Error fetching image:', error);
      } finally {
        setIsLoadingImage(false);
      }
    };
    
    fetchImage();
  }, [thumbnail, category?.name, slug]);

  // Get the image URL from thumbnail or first image
  const getImageUrl = () => {
    let imgUrl;
    
    if (thumbnail) {
      if (typeof thumbnail === 'string') {
        imgUrl = thumbnail;
      } else {
        imgUrl = thumbnail.url;
      }
    } else if (images && images.length > 0) {
      imgUrl = images[0].url;
    } else {
      return '/images/placeholder-post.jpg'; // Use the existing placeholder image
    }
    
    // Normalize the URL to ensure it uses the correct base URL
    return normalizeImageUrl(imgUrl);
  };

  // Get image alt text
  const getImageAlt = () => {
    if (thumbnail && typeof thumbnail === 'object' && thumbnail.alt) {
      return thumbnail.alt;
    }
    if (images && images.length > 0 && images[0].alt) {
      return images[0].alt;
    }
    return title;
  };

  // Format date
  const formattedDate = getFormattedDate(publishedAt);
  const cardUrl = `/blog/${slug}`;
  
  // Toggle bookmark state (placeholder for actual implementation)
  const handleToggleBookmark = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // In a real implementation, this would call an API
    console.log('Toggle bookmark for post:', id);
  };

  // Animation variants
  const cardVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    hover: { 
      y: -5, 
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      transition: { duration: 0.2 }
    }
  };
  
  // Different card layouts based on variant
  if (variant === 'compact') {
    return (
      <motion.article
        className="group relative bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200/50 dark:border-gray-700/50 w-full"
        initial="initial"
        animate="animate"
        whileHover={{ y: -2 }}
      >
        <Link to={cardUrl} className="flex flex-row h-full">
          <div className="w-1/3 relative overflow-hidden">
            <LazyImage
              src={getImageUrl()}
              alt={getImageAlt()}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              fallback={
                <div className="h-full w-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  <span className="text-gray-400">No image</span>
                </div>
              }
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900/20" />
          </div>
          
          <div className="w-2/3 p-4 flex flex-col justify-between">
            <div>
              {category && (
                <Link 
                  to={`/category/${category.slug}`}
                  className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
                >
                  {category.name}
                </Link>
              )}
              <h2 className="mt-2 text-lg font-semibold text-gray-900 dark:text-white line-clamp-2">
                {title}
              </h2>
              {excerpt && (
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                  {excerpt}
                </p>
              )}
            </div>
            
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <Clock className="w-4 h-4 mr-1" />
                  {readingTime || '5'} min read
                </span>
                <span className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <Calendar className="w-4 h-4 mr-1" />
                  {formattedDate}
                </span>
              </div>
            </div>
          </div>
        </Link>
      </motion.article>
    );
  }
  
  if (variant === 'featured') {
    return (
      <motion.article
        className="relative bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg"
        initial="initial"
        animate="animate"
        whileHover="hover"
        variants={cardVariants}
      >
        <Link to={cardUrl} className="block">
          <div className="relative">
            <div className="aspect-w-16 aspect-h-9">
              <LazyImage
                src={getImageUrl()}
                alt={getImageAlt()}
                className="w-full h-full object-cover"
                fallback={
                  <div className="h-full w-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    <span className="text-gray-400">No image</span>
                  </div>
                }
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </div>
          
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <div className="flex flex-wrap gap-2 mb-3">
              {isFeatured && (
                  <span className="bg-indigo-600 text-white text-xs font-semibold px-2 py-1 rounded-full">
                  Featured
                </span>
              )}
              {category && (
                <Link 
                    to={`/category/${category.slug}`}
                    className="bg-white/90 dark:bg-gray-800/90 text-indigo-600 dark:text-indigo-400 text-xs font-semibold px-2 py-1 rounded-full hover:bg-white dark:hover:bg-gray-700"
                  onClick={(e) => e.stopPropagation()}
                >
                  {category.name}
                </Link>
              )}
            </div>
            
              <h2 className="text-2xl font-bold text-white mb-2">
                {title}
              </h2>

              {excerpt && (
                <p className="text-gray-200 line-clamp-2 mb-4">
                  {excerpt}
                </p>
              )}

              <div className="flex items-center justify-between text-white/80">
                <div className="flex items-center space-x-4">
                  {author && (
                <div className="flex items-center">
                      {author.avatar ? (
                        <img
                          src={author.avatar}
                          alt={author.name}
                          className="w-6 h-6 rounded-full mr-2"
                        />
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-gray-300 mr-2" />
                      )}
                      <span className="text-sm">{author.name}</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center space-x-4 text-sm">
                  <span className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {readingTime || '5'} min
                  </span>
                  <span className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {formattedDate}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Link>
      </motion.article>
    );
  }
  
  // Default card layout
  return (
    <motion.article
      className="bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
      initial="initial"
      animate="animate"
      whileHover="hover"
      variants={cardVariants}
    >
      <Link to={cardUrl} className="block">
        <div className="relative">
          <LazyImage
            src={getImageUrl()}
            alt={getImageAlt()}
            className="w-full h-48 object-cover"
            fallback={
              <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                <span className="text-gray-400">No image</span>
              </div>
            }
          />
          {isBreakingNews && (
            <div className="absolute top-4 left-4 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse">
              Breaking News
        </div>
          )}
        </div>

        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            {category && (
              <Link 
                to={`/category/${category.slug}`}
                className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
                onClick={(e) => e.stopPropagation()}
              >
                {category.name}
              </Link>
            )}
            <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
              <span className="flex items-center text-sm">
                <Eye className="w-4 h-4 mr-1" />
                {viewCount}
              </span>
              <span className="flex items-center text-sm">
                <MessageSquare className="w-4 h-4 mr-1" />
                {commentCount}
              </span>
            </div>
          </div>

          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            {title}
          </h2>

          {excerpt && (
            <p className="text-gray-600 dark:text-gray-300 line-clamp-2 mb-4">
              {excerpt}
            </p>
          )}

          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center space-x-4">
              {author && (
                <div className="flex items-center">
                  {author.avatar ? (
                    <img
                      src={author.avatar}
                      alt={author.name}
                      className="w-6 h-6 rounded-full mr-2"
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-gray-300 mr-2" />
                  )}
                  <span className="text-sm text-gray-600 dark:text-gray-300">{author.name}</span>
                </div>
              )}
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
              <span className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                {readingTime || '5'} min
              </span>
              <span className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                {formattedDate}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  );
};

export default BlogCard;