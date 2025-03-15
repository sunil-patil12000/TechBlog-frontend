import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Share, 
  MessageCircle, 
  Heart, 
  Bookmark, 
  Clock, 
  Calendar, 
  ChevronLeft, 
  ChevronRight,
  Facebook,
  Twitter,
  Linkedin,
  User,
  Share2 as Share2Icon,
  BookmarkCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { useQuery } from 'react-query';

// Components
import SEO from '../components/utils/SEO';
import Spinner from '../components/ui/Spinner';
import ErrorDisplay from '../components/ui/ErrorDisplay';
import AuthorCard from '../components/blog/AuthorCard';
import CommentSection from '../components/blog/CommentSection';
import NewsletterSignup from '../components/shared/NewsletterSignup';
import RelatedPostsSection from '../components/blog/RelatedPostsSection';
import BackToTop from '../components/ui/BackToTop';
import SocialShareButtons from '../components/shared/SocialShareButtons';
import TableOfContents from '../components/blog/TableOfContents';
import LikeButton from '../components/blog/LikeButton';
import Tag from '../components/ui/Tag';
import NormalizedImage from '../components/common/NormalizedImage';
import Avatar from '../components/shared/Avatar';
import OptimizedImage from '../components/ui/OptimizedImage';
import BreadcrumbNav from '../components/ui/BreadcrumbNav';

// Hooks and Context
import { useTheme } from '../contexts/ThemeContext';
import useScrollPosition from '../hooks/useScrollPosition';
import useAnalytics from '../hooks/useAnalytics';

// API
import { postAPI } from '../services/api';
import { Post } from '../hooks/usePosts';

// Utilities
import { formatDate } from '../utils/dateFormatter';
import DOMPurify from 'dompurify';
import { marked } from 'marked';
import { processContent, normalizeImageUrl } from '../utils/contentProcessor';
import { DEFAULT_IMAGE, UPLOADS_BASE_URL, DEFAULT_AVATAR } from '../config/constants';

interface Comment {
  id: string;
  author: {
    id: string;
    name: string;
    avatar: string;
  };
  content: string;
  createdAt: string;
  likes: number;
}

const mockComments: Comment[] = [
  {
    id: '1',
    author: {
      id: 'jane_cooper',
      name: 'Jane Cooper',
      avatar: 'https://randomuser.me/api/portraits/women/10.jpg'
    },
    content: 'Great article! I especially agree with the points about JAMstack and its growing importance in modern web development.',
    createdAt: '2023-05-16T14:22:00Z',
    likes: 5
  },
  {
    id: '2',
    author: {
      id: 'robert_johnson',
      name: 'Robert Johnson',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
    },
    content: 'WebAssembly is definitely a game-changer. I\'ve been experimenting with it recently and the performance gains are substantial.',
    createdAt: '2023-05-16T15:45:00Z',
    likes: 3
  },
  {
    id: '3',
    author: {
      id: 'emma_watson',
      name: 'Emma Watson',
      avatar: 'https://randomuser.me/api/portraits/women/45.jpg'
    },
    content: 'I\'d love to see a follow-up article that dives deeper into AI-powered development tools. Any recommendations for developers looking to get started with these tools?',
    createdAt: '2023-05-17T09:12:00Z',
    likes: 7
  },
];

const mockRelatedPosts = [
  {
    id: '2',
    title: 'How to Optimize Your React Application for Performance',
    excerpt: 'Learn practical techniques to make your React apps faster and more efficient.',
    featuredImage: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    author: 'Chris Lee',
    publishedAt: '2023-04-28T10:30:00Z',
    slug: 'optimize-react-performance',
  },
  {
    id: '3',
    title: 'CSS Architecture for Large-Scale Web Applications',
    excerpt: 'Building maintainable CSS systems that scale with your application.',
    featuredImage: 'https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    author: 'Sarah Smith',
    publishedAt: '2023-05-03T14:15:00Z',
    slug: 'css-architecture-large-apps',
  },
];

const BlogPostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const { trackEvent } = useAnalytics();
  
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [liked, setLiked] = useState<boolean>(false);
  const [bookmarked, setBookmarked] = useState<boolean>(false);
  const [likeCount, setLikeCount] = useState<number>(0);
  const [commentsExpanded, setCommentsExpanded] = useState<boolean>(false);
  
  // Add a mock current user
  const [currentUser, setCurrentUser] = useState<{
    id?: string;
    name?: string;
    avatar?: string;
  } | null>(null);
  
  const contentRef = useRef<HTMLDivElement>(null);
  const { scrollPosition } = useScrollPosition();
  
  // Add breadcrumb state
  const [breadcrumbs, setBreadcrumbs] = useState<Array<{name: string, url: string}>>([]);
  
  // Fetch post data on component mount
  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) {
        navigate('/404');
        return;
      }
      
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await postAPI.getPostBySlug(slug);
        
        if (response?.data?.data) {
          // Map backend data to our format
          const backendPost = response.data.data;
          
          const mappedPost: Post = {
            id: backendPost._id,
            slug: backendPost.slug,
            title: backendPost.title,
            excerpt: backendPost.excerpt || backendPost.content.substring(0, 150) + '...',
            content: backendPost.content,
            thumbnail: backendPost.coverImage || backendPost.thumbnail,
            featuredImage: backendPost.coverImage || backendPost.featuredImage || backendPost.thumbnail,
            publishedAt: backendPost.publishDate || backendPost.createdAt,
            readingTime: backendPost.readingTime || Math.ceil(backendPost.content.length / 1000) || 5,
            category: backendPost.category ? {
              id: backendPost.category._id,
              name: backendPost.category.name,
              slug: backendPost.category.slug
            } : undefined,
            tags: backendPost.tags?.map((tag: any) => ({
              id: tag._id,
              name: tag.name, 
              slug: tag.slug
            })) || [],
            author: {
              id: backendPost.author?._id || 'unknown',
              name: backendPost.author?.name || 'Unknown Author',
              avatar: backendPost.author?.avatar || 'https://via.placeholder.com/150',
              bio: backendPost.author?.bio || 'No author bio available'
            },
            commentCount: backendPost.comments?.length || 0,
            likeCount: backendPost.likes || 0,
            viewCount: backendPost.views || 0,
            isBookmarked: false
          };
          
          setPost(mappedPost);
          setLikeCount(mappedPost.likeCount || 0);
          
          // Track page view
          trackEvent('post_view', {
            post_id: mappedPost.id,
            post_title: mappedPost.title,
            post_slug: mappedPost.slug
          });
          
          // Store post data in window for analytics
          (window as any).postData = {
            _id: mappedPost.id,
            title: mappedPost.title,
            type: 'blog-post'
          };
        } else {
          throw new Error('Post data not found');
        }
      } catch (err) {
        console.error('Error fetching post:', err);
        setError('Failed to load blog post');
        trackEvent('error', { 
          type: 'api', 
          message: 'Failed to load blog post',
          path: window.location.pathname
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPost();
  }, [slug, navigate, trackEvent]);

  // Attempt to load current user
  useEffect(() => {
    // You would typically get this from an auth context or service
    // This is a simplified example
    const loadCurrentUser = async () => {
      try {
        // Simulate checking if the user is logged in
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        
        if (isLoggedIn) {
          // In a real app, you'd fetch this from your API or auth context
          setCurrentUser({
            id: 'user123',
            name: 'Demo User',
            avatar: '/images/avatars/default-avatar.png'
          });
        } else {
          // Set null or a guest user
          setCurrentUser(null);
        }
      } catch (error) {
        console.error('Error loading user data:', error);
        // Fallback to null/guest if there's an error
        setCurrentUser(null);
      }
    };
    
    loadCurrentUser();
  }, []);

  // Track scroll depth
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercentage = (scrollPosition / documentHeight) * 100;
      
      // Track when user reaches 25%, 50%, 75%, and 100% of the article
      if (scrollPercentage >= 25 && scrollPercentage < 50 && !sessionStorage.getItem('scroll-25')) {
        trackEvent({
          type: 'scroll',
          category: 'engagement',
          action: 'scroll-depth',
          label: 'reached-25-percent',
          page: post?.title || 'Blog Post',
          path: window.location.pathname
        });
        sessionStorage.setItem('scroll-25', 'true');
      } else if (scrollPercentage >= 50 && scrollPercentage < 75 && !sessionStorage.getItem('scroll-50')) {
        trackEvent({
          type: 'scroll',
          category: 'engagement',
          action: 'scroll-depth',
          label: 'reached-50-percent',
          page: post?.title || 'Blog Post',
          path: window.location.pathname
        });
        sessionStorage.setItem('scroll-50', 'true');
      } else if (scrollPercentage >= 75 && scrollPercentage < 100 && !sessionStorage.getItem('scroll-75')) {
        trackEvent({
          type: 'scroll',
          category: 'engagement',
          action: 'scroll-depth',
          label: 'reached-75-percent',
          page: post?.title || 'Blog Post',
          path: window.location.pathname
        });
        sessionStorage.setItem('scroll-75', 'true');
      } else if (scrollPercentage >= 99 && !sessionStorage.getItem('scroll-100')) {
        trackEvent({
          type: 'scroll',
          category: 'engagement',
          action: 'scroll-depth',
          label: 'reached-100-percent',
          page: post?.title || 'Blog Post',
          path: window.location.pathname
        });
        sessionStorage.setItem('scroll-100', 'true');
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      // Clear session storage on unmount
      sessionStorage.removeItem('scroll-25');
      sessionStorage.removeItem('scroll-50');
      sessionStorage.removeItem('scroll-75');
      sessionStorage.removeItem('scroll-100');
    };
  }, [trackEvent, post?.title]);
  
  // Track social sharing
  const handleShareClick = (platform: string) => {
    trackEvent({
      type: 'click',
      category: 'social',
      action: 'share',
      label: platform,
      page: post?.title || 'Blog Post',
      path: window.location.pathname
    });
    
    // Original share handling logic...
  };
  
  // Track comment submission
  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    trackEvent({
      type: 'engagement',
      category: 'comment',
      action: 'submit',
      page: post?.title || 'Blog Post',
      path: window.location.pathname
    });
    
    // Original comment submission logic...
  };

  // Generate breadcrumbs after post is loaded
  useEffect(() => {
    if (post) {
      const crumbs = [
        { name: 'Blog', url: '/blog' }
      ];
      
      // Add category if available
      if (post.category) {
        crumbs.push({
          name: post.category.name,
          url: `/category/${post.category.slug}`
        });
      }
      
      // Add current post
      crumbs.push({
        name: post.title,
        url: `/blog/${post.slug}`
      });
      
      setBreadcrumbs(crumbs);
    }
  }, [post]);

  // Helper to get the appropriate thumbnail for a post
  function getPostThumbnail(post: Post | null): string {
    if (!post) return '';
    
    if (post.thumbnail) {
      if (typeof post.thumbnail === 'string') {
        return normalizeImageUrl(post.thumbnail);
      } else if (typeof post.thumbnail === 'object' && post.thumbnail.url) {
        return normalizeImageUrl(post.thumbnail.url);
      }
    }
    
    // Check for images array
    if (post.images && post.images.length > 0) {
      const firstImage = post.images[0];
      if (typeof firstImage === 'string') {
        return normalizeImageUrl(firstImage);
      } else if (typeof firstImage === 'object' && firstImage.url) {
        return normalizeImageUrl(firstImage.url);
      }
    }
    
    // If no thumbnail or images, use default
    return '/images/placeholder-post.jpg'; // Use the existing placeholder image
  }

  // Helper function to get image alt text
  const getImageAlt = () => {
    if (!post) return '';
    
    if (post.thumbnail && typeof post.thumbnail === 'object' && post.thumbnail.alt) {
      return post.thumbnail.alt;
    }
    
    if (post.images && post.images.length > 0 && post.images[0].alt) {
      return post.images[0].alt;
    }
    
    return post.title;
  };

  // Generate structured data for the article
  const generateStructuredData = () => {
    if (!post) return null;
    
    // Format the date to ISO format if needed
    const publishDate = post.publishedAt ? new Date(post.publishedAt).toISOString() : new Date().toISOString();
    
    return {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: post.title,
      description: post.excerpt,
      image: post.featuredImage ? normalizeImageUrl(post.featuredImage) : normalizeImageUrl(DEFAULT_IMAGE),
      datePublished: publishDate,
      dateModified: publishDate,
      author: {
        '@type': 'Person',
        name: post.author?.name || 'Unknown',
        url: post.author?.id ? `/author/${post.author.id}` : null
      },
      publisher: {
        '@type': 'Organization',
        name: 'Tech Blog',
        logo: {
          '@type': 'ImageObject',
          url: '/images/logo.png'
        }
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': `${window.location.origin}/blog/${post.slug}`
      }
    };
  };

  return (
    <>
      <SEO
        title={post?.title || 'Blog Post'}
        description={post?.excerpt || 'Loading blog post...'}
        ogImage={post?.featuredImage || post?.thumbnail}
        ogType="article"
        breadcrumbs={breadcrumbs}
        canonical={post ? `/blog/${post.slug}` : undefined}
        article={{
          publishedTime: post?.publishedAt,
          modifiedTime: post?.updatedAt || post?.publishedAt,
          authors: post?.author ? [{ 
            name: post.author.name,
            website: post.author.id ? `${window.location.origin}/author/${post.author.id}` : undefined
          }] : undefined,
          tags: post?.tags?.map(tag => tag.name) || [],
          section: post?.category?.name
        }}
        structuredData={generateStructuredData()}
      />
      
      {isLoading ? (
        <div className="container mx-auto px-4 py-16">
          <Spinner size="lg" fullPage={false} label="Loading article..." />
        </div>
      ) : error ? (
        <div className="container mx-auto px-4 py-16">
          <ErrorDisplay
            message="Failed to load the article"
            details={error}
            onRetry={() => window.location.reload()}
          />
        </div>
      ) : post ? (
        <div className="bg-gray-50 dark:bg-gray-900 min-h-screen pb-12">
          {/* Hero Section - Improved for better visual impact */}
          <div className="relative h-[40vh] sm:h-[50vh] md:h-[60vh] overflow-hidden">
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${getPostThumbnail(post)})` }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30">
                <div className="container mx-auto px-4 h-full flex flex-col justify-end pb-8 md:pb-12">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="max-w-4xl"
                  >
                    {/* Add breadcrumb at the top */}
                    <BreadcrumbNav 
                      items={breadcrumbs}
                      className="mb-6 justify-center text-gray-200"
                      itemClassName="text-gray-300 hover:text-white transition-colors"
                      separatorClassName="mx-2 text-gray-400"
                    />
                  
                    {post.category && (
                      <Link 
                        to={`/category/${post.category.slug}`}
                        className="text-indigo-400 hover:text-indigo-300 text-sm font-medium mb-2 inline-block"
                      >
                        {post.category.name}
                      </Link>
                    )}
                    <h1 className="text-white text-3xl sm:text-4xl md:text-5xl font-bold mb-4 leading-tight">{post.title}</h1>
                    <div className="flex flex-wrap items-center gap-4 text-gray-300 text-sm">
                      {post.author && (
                        <div className="flex items-center">
                          {post.author.avatar ? (
                            <Avatar
                              src={normalizeImageUrl(post.author.avatar)}
                              alt={post.author.name}
                              size="sm"
                              className="mr-2 border-2 border-white/20"
                              fallbackClassName="text-white bg-indigo-600"
                            />
                          ) : (
                            <Avatar
                              src=""
                              alt={post.author.name}
                              size="sm"
                              className="mr-2 border-2 border-white/20"
                              fallbackClassName="text-white bg-indigo-600"
                            />
                          )}
                          <span>{post.author.name}</span>
                        </div>
                      )}
                      <span className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {formatDate(post.publishedAt)}
                      </span>
                      <span className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {post.readingTime || '5'} min read
                      </span>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>

          {/* Breadcrumb nav - New addition for better navigation */}
          <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <div className="container mx-auto px-4 py-3">
              <nav className="flex text-sm text-gray-500 dark:text-gray-400">
                <Link to="/" className="hover:text-indigo-600 dark:hover:text-indigo-400">Home</Link>
                <span className="mx-2">/</span>
                <Link to="/blog" className="hover:text-indigo-600 dark:hover:text-indigo-400">Blog</Link>
                {post.category && (
                  <>
                    <span className="mx-2">/</span>
                    <Link 
                      to={`/category/${post.category.slug}`}
                      className="hover:text-indigo-600 dark:hover:text-indigo-400"
                    >
                      {post.category.name}
                    </Link>
                  </>
                )}
                <span className="mx-2">/</span>
                <span className="text-gray-700 dark:text-gray-300 truncate max-w-[150px]">{post.title}</span>
              </nav>
            </div>
          </div>

          {/* Main content area - Improved layout and spacing */}
          <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Main content */}
              <div className="w-full lg:w-2/3">
                <motion.article
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 md:p-8 mb-8"
                >
                  {/* Reading progress bar - New addition for better UX */}
                  <div className="w-full h-1 bg-gray-100 dark:bg-gray-700 sticky top-0 -mt-6 -mx-6 md:-mx-8 mb-6 z-10">
                    <motion.div 
                      className="h-full bg-indigo-500"
                      style={{ 
                        width: `${Math.min(scrollPosition / (document.body.scrollHeight - window.innerHeight) * 100, 100)}%`,
                        transition: 'width 0.1s' 
                      }}
                    />
                  </div>

                  {post.images && post.images.length > 0 && (
                    <div className="mb-8 relative">
                      <OptimizedImage
                        src={post.images[0].url}
                        alt={post.images[0].alt || post.title}
                        className="w-full rounded-lg shadow-md"
                        objectFit="cover"
                        priority={true} // Priority load for featured image
                      />
                    </div>
                  )}
                  
                  {/* Article content - Improved typography */}
                  <div 
                    className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-a:text-indigo-600 dark:prose-a:text-indigo-400 prose-img:rounded-lg prose-img:shadow-md"
                    dangerouslySetInnerHTML={{ __html: processContent(post.content) }}
                    ref={contentRef}
                  />

                  {/* Tags */}
                  {post.tags && post.tags.length > 0 && (
                    <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex flex-wrap gap-2">
                        {post.tags.map(tag => (
                          <Link 
                            key={tag.id}
                            to={`/tag/${tag.slug}`}
                            className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm text-gray-600 dark:text-gray-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                          >
                            #{tag.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Interactive action bar - New addition for better engagement */}
                  <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <button 
                        onClick={() => setLiked(!liked)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-full ${
                          liked 
                            ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' 
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                        }`}
                      >
                        <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
                        <span>{likeCount}</span>
                      </button>
                      
                      <button 
                        onClick={() => setCommentsExpanded(!commentsExpanded)}
                        className="flex items-center gap-2 px-3 py-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>{post.commentCount || 0}</span>
                      </button>
                      
                      <button
                        onClick={() => setBookmarked(!bookmarked)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-full ${
                          bookmarked 
                            ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400' 
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                        }`}
                      >
                        {bookmarked ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                        <span>{bookmarked ? 'Saved' : 'Save'}</span>
                      </button>
                    </div>
                    
                    <div>
                      <button
                        className="flex items-center gap-2 px-3 py-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                        onClick={() => {
                          const dropdown = document.getElementById('share-dropdown');
                          if (dropdown) {
                            dropdown.classList.toggle('hidden');
                          }
                        }}
                      >
                        <Share2Icon className="w-4 h-4" />
                        <span>Share</span>
                      </button>
                      
                      <div id="share-dropdown" className="hidden absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 shadow-lg rounded-lg z-10">
                        <SocialShareButtons 
                          url={window.location.href}
                          title={post.title}
                          description={post.excerpt || ''}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Author bio - Enhanced styling */}
                  {post.author && (
                    <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                      <AuthorCard author={post.author} />
                    </div>
                  )}

                  {/* Comments section */}
                  <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <CommentSection postId={post.id} />
                  </div>
                </motion.article>
              </div>

              {/* Sidebar - Enhanced with sticky positioning and better styling */}
              <div className="w-full lg:w-1/3 space-y-6">
                <div className="lg:sticky lg:top-6">
                  {/* Table of Contents - Styled for better readability */}
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
                    <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Table of Contents</h3>
                    <TableOfContents content={post.content} />
                  </div>

                  {/* Newsletter signup - Enhanced styling */}
                  <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg shadow-sm p-6 mb-6">
                    <NewsletterSignup />
                  </div>

                  {/* Related posts - Enhanced with better card design */}
                  {mockRelatedPosts && mockRelatedPosts.length > 0 && (
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                      <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Related Articles</h3>
                      <RelatedPostsSection posts={mockRelatedPosts} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Back to top button - Enhanced design */}
          <BackToTop />
        </div>
      ) : (
        <div className="container mx-auto px-4 py-16">
          <ErrorDisplay 
            message="Article not found" 
            details="The article you're looking for might have been removed or is temporarily unavailable."
          />
        </div>
      )}
    </>
  );
};

export default BlogPostPage;