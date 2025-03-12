import React, { useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, useScroll, useSpring } from 'framer-motion';
import { format } from 'date-fns';
import readingTime from 'reading-time';
import { Share2, Twitter, Facebook, LinkedIn, Clock, Calendar, ChevronRight, Eye } from 'lucide-react';
import LazyImage from '../ui/LazyImage';

interface AuthorProps {
  id: string;
  name: string;
  bio?: string;
  avatar?: string;
}

interface ArticleHeaderProps {
  title: string;
  subtitle?: string;
  coverImage?: string;
  publishedAt: string;
  updatedAt?: string;
  author: AuthorProps;
  content: string;
  category?: {
    name: string;
    slug: string;
  };
  postViewCount: number;
  socialLinks: { platform: string; url: string }[];
}

const ArticleHeader: React.FC<ArticleHeaderProps> = ({
  title,
  subtitle,
  coverImage,
  publishedAt,
  updatedAt,
  author,
  content,
  category,
  postViewCount,
  socialLinks
}) => {
  const location = useLocation();
  const { text: readTimeText, minutes: readTimeMinutes } = useMemo(() => readingTime(content), [content]);
  
  // Current page for breadcrumbs
  const currentPage = useMemo(() => {
    const parts = location.pathname.split('/').filter(Boolean);
    return parts[parts.length - 1];
  }, [location]);
  
  // Capitalize and format the current page
  const formattedCurrentPage = useMemo(() => {
    return currentPage.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }, [currentPage]);

  // Format dates
  const formattedPublishDate = useMemo(() => 
    format(new Date(publishedAt), 'MMM dd, yyyy'), 
    [publishedAt]
  );
  
  const formattedUpdateDate = useMemo(() => 
    updatedAt ? format(new Date(updatedAt), 'MMM dd, yyyy') : null, 
    [updatedAt]
  );

  // Share URLs
  const shareUrl = useMemo(() => `${window.location.origin}${location.pathname}`, [location]);
  const twitterShareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(title)}`;
  const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
  const linkedinShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <header className="relative">
      {/* Reading Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-indigo-500 origin-left z-50"
        style={{ scaleX }}
      />

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 lg:px-0 py-16">
        {/* Breadcrumbs */}
        <nav className="mb-8">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li className="inline-flex items-center">
              <Link to="/" className="inline-flex items-center hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                Home
              </Link>
            </li>
            <li>
              <div className="flex items-center">
                <ChevronRight size={16} />
                <Link
                  to="/blog"
                  className="ml-1 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Blog
                </Link>
              </div>
            </li>
            {category && (
              <li>
                <div className="flex items-center">
                  <ChevronRight size={16} />
                  <Link
                    to={`/blog/category/${category.slug}`}
                    className="ml-1 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                  >
                    {category.name}
                  </Link>
                </div>
              </li>
            )}
            <li aria-current="page">
              <div className="flex items-center">
                <ChevronRight size={16} />
                <span className="ml-1 truncate max-w-[150px] md:max-w-xs">
                  {formattedCurrentPage}
                </span>
              </div>
            </li>
          </ol>
        </nav>

        {/* Title Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
            {title}
          </h1>
          
          <div className="flex items-center justify-center gap-4 text-gray-500 dark:text-gray-400">
            <span>{formattedPublishDate}</span>
            <span>•</span>
            <span>{readTimeText}</span>
            <span>•</span>
            <div className="flex items-center">
              <Eye className="w-4 h-4 mr-1" />
              {postViewCount}
            </div>
          </div>
        </motion.div>

        {/* Cover Image */}
        {coverImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-12 rounded-2xl overflow-hidden shadow-xl"
          >
            <LazyImage
              src={coverImage}
              alt={title}
              className="w-full h-full object-cover"
            />
          </motion.div>
        )}

        {/* Author Info */}
        <motion.div 
          className="flex items-center gap-6 p-6 bg-indigo-50 dark:bg-gray-800 rounded-2xl mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <img
            src={author.avatar}
            alt={author.name}
            className="w-16 h-16 rounded-full border-2 border-indigo-100 dark:border-gray-700"
          />
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">{author.name}</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">{author.bio}</p>
            <div className="flex gap-3 mt-2">
              {socialLinks.map((link) => (
                <a
                  key={link.platform}
                  href={link.url}
                  className="text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400"
                >
                  {getSocialIcon(link.platform)}
                </a>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Meta Info Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 border-b border-gray-200 dark:border-gray-700 pb-6">
          {/* Date & Read Time */}
          <div className="flex items-center mr-6 mb-4 sm:mb-0">
            <div className="flex items-center mr-4">
              <Calendar size={18} className="mr-1 text-gray-500 dark:text-gray-400" />
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {formattedPublishDate}
              </span>
            </div>
            
            <div className="flex items-center">
              <Clock size={18} className="mr-1 text-gray-500 dark:text-gray-400" />
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {readTimeText}
              </span>
            </div>
          </div>

          {/* Social Sharing */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500 dark:text-gray-400 hidden sm:inline-block mr-1">
              <Share2 size={18} className="inline-block" />
            </span>
            <a 
              href={twitterShareUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-blue-400 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
              aria-label="Share on Twitter"
            >
              <Twitter size={20} />
            </a>
            <a 
              href={facebookShareUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-600 transition-colors"
              aria-label="Share on Facebook"
            >
              <Facebook size={20} />
            </a>
            <a 
              href={linkedinShareUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-blue-700 dark:text-gray-400 dark:hover:text-blue-700 transition-colors"
              aria-label="Share on LinkedIn"
            >
              <LinkedIn size={20} />
            </a>
          </div>
        </div>

        {/* Last Updated Notice */}
        {formattedUpdateDate && formattedUpdateDate !== formattedPublishDate && (
          <div className="text-sm text-gray-500 dark:text-gray-400 italic mb-6">
            Last updated on {formattedUpdateDate}
          </div>
        )}

        {/* Progress Read Time Indicator */}
        <div className="sticky top-[72px] z-10 bg-white dark:bg-gray-900 w-full py-1 transition-all duration-300">
          <div className="flex justify-between items-center text-xs font-medium">
            <span className="text-gray-500 dark:text-gray-400">
              {Math.ceil(readTimeMinutes)} min read
            </span>
            <div className="w-full mx-2 bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
              <div 
                id="reading-progress-bar"
                className="bg-indigo-600 h-1.5 rounded-full transition-all duration-300"
                style={{ width: '0%' }}
              />
            </div>
            <span className="text-gray-500 dark:text-gray-400">0%</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default ArticleHeader;

// Add scroll listener for progress bar
if (typeof window !== 'undefined') {
  window.addEventListener('scroll', () => {
    const progressBar = document.getElementById('reading-progress-bar');
    const percentLabel = document.querySelector('div.sticky span:last-child');
    
    if (progressBar && percentLabel) {
      const windowHeight = window.innerHeight;
      const fullHeight = document.body.clientHeight;
      const scrolled = window.scrollY;
      
      // Calculate how far down the page the user has scrolled
      const scrollPercent = (scrolled / (fullHeight - windowHeight)) * 100;
      const roundedPercent = Math.min(100, Math.max(0, Math.round(scrollPercent)));
      
      progressBar.style.width = `${roundedPercent}%`;
      percentLabel.textContent = `${roundedPercent}%`;
    }
  });
} 