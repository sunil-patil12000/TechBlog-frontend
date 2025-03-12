import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { 
  ArrowRight, 
  Zap, 
  TrendingUp, 
  Clock, 
  Search, 
  ChevronRight, 
  Code,
  Sparkles,
  BookOpen,
  ChevronDown,
  Globe,
  Rocket,
  Code2,
  Cloud,
  BarChart2
} from 'lucide-react';
import { useInView } from 'react-intersection-observer';

// Define Icons object to map icon names to components
const Icons = {
  ArrowRight,
  Zap,
  TrendingUp,
  Clock,
  Search,
  ChevronRight,
  Code,
  Sparkles,
  BookOpen,
  ChevronDown,
  Globe,
  Rocket,
  Code2,
  Cloud,
  BarChart2
};

// Components
import BlogCard from '../components/blog/BlogCard';
import LazyImage from '../components/ui/LazyImage';
import NewsletterSignup from '../components/shared/NewsletterSignup';
import FeaturedAuthor from '../components/blog/FeaturedAuthor';
import CategoryCard from '../components/blog/CategoryCard';
import Tag from '../components/ui/Tag';

// Hooks and Context
import { useFeaturedPosts, useLatestPosts, usePopularPosts } from '../hooks/usePosts';
import { useCategories } from '../hooks/useCategories';
import { useTags } from '../hooks/useTags';
import { useTheme } from '../contexts/ThemeContext';
import useAnalytics from '../hooks/useAnalytics';

const HomePage: React.FC = () => {
  const { isDark } = useTheme();
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState('latest');
  const heroRef = useRef<HTMLDivElement>(null);
  const sectionRefs = {
    featured: useRef<HTMLDivElement>(null),
    categories: useRef<HTMLDivElement>(null),
    latest: useRef<HTMLDivElement>(null),
  };
  
  // Advanced scroll animations
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.8, 0]);
  
  // Fetch data using custom hooks
  const { data: featuredPosts, isLoading: featuredLoading } = useFeaturedPosts(3);
  const { data: latestPosts, isLoading: latestLoading } = useLatestPosts(6);
  const { data: popularPosts, isLoading: popularLoading } = usePopularPosts(4);
  const { categories, isLoading: categoriesLoading } = useCategories();
  const { tags, isLoading: tagsLoading } = useTags();
  
  // Track analytics
  const { trackEvent } = useAnalytics();
  
  // Set loaded state after initial data fetch
  useEffect(() => {
    if (!featuredLoading && !latestLoading && !popularLoading) {
      setIsLoaded(true);
    }
  }, [featuredLoading, latestLoading, popularLoading]);
  
  // Track page view
  useEffect(() => {
    trackEvent('page_view', { page: 'home' });
  }, [trackEvent]);
  
  // Handle tab change
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    trackEvent('tab_change', { tab });
  };
  
  // Render featured posts section
  const renderFeaturedPosts = () => {
    if (featuredLoading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-100 dark:bg-gray-800 rounded-lg h-96 animate-pulse flex flex-col">
              <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-t-lg"></div>
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-2"></div>
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                </div>
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mt-4 w-1/3"></div>
              </div>
            </div>
          ))}
        </div>
      );
    }
    
    if (!featuredPosts || featuredPosts.length === 0) {
      return (
        <div className="text-center py-10 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 mb-4">
            <Sparkles className="w-8 h-8 text-gray-400 dark:text-gray-500" />
          </div>
          <p className="text-gray-500 dark:text-gray-400 font-medium">No featured posts available yet.</p>
          <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">Check back soon for featured content.</p>
        </div>
      );
    }
    
    // Create a featured layout with first post larger
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {featuredPosts.length > 0 && (
          <div className="lg:col-span-2">
            <motion.div
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="h-full"
            >
              <BlogCard
                key={featuredPosts[0].id}
                id={featuredPosts[0].id}
                slug={featuredPosts[0].slug}
                title={featuredPosts[0].title}
                excerpt={featuredPosts[0].excerpt}
                thumbnail={featuredPosts[0].thumbnail}
                images={featuredPosts[0].images}
                publishedAt={featuredPosts[0].publishedAt}
                readingTime={featuredPosts[0].readingTime}
                category={featuredPosts[0].category}
                tags={featuredPosts[0].tags}
                author={featuredPosts[0].author}
                commentCount={featuredPosts[0].commentCount}
                likeCount={featuredPosts[0].likeCount}
                viewCount={featuredPosts[0].viewCount}
                variant="featured"
                isFeatured={true}
              />
            </motion.div>
          </div>
        )}
        
        <div className="lg:col-span-1 flex flex-col gap-6">
          {featuredPosts.slice(1, 3).map((post) => (
            <motion.div
              key={post.id}
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <BlogCard
                id={post.id}
                slug={post.slug}
                title={post.title}
                excerpt={post.excerpt}
                thumbnail={post.thumbnail}
                images={post.images}
                publishedAt={post.publishedAt}
                readingTime={post.readingTime}
                category={post.category}
                tags={post.tags}
                author={post.author}
                commentCount={post.commentCount}
                likeCount={post.likeCount}
                viewCount={post.viewCount}
                variant="compact"
                isFeatured={true}
              />
            </motion.div>
          ))}
        </div>
      </div>
    );
  };
  
  // Render latest posts section
  const renderLatestPosts = () => {
    if (latestLoading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-gray-100 dark:bg-gray-800 rounded-lg h-96 animate-pulse flex flex-col">
              <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-t-lg"></div>
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-2"></div>
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                </div>
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mt-4 w-1/3"></div>
              </div>
            </div>
          ))}
        </div>
      );
    }
    
    if (!latestPosts || latestPosts.length === 0) {
      return (
        <div className="text-center py-10 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 mb-4">
            <Clock className="w-8 h-8 text-gray-400 dark:text-gray-500" />
          </div>
          <p className="text-gray-500 dark:text-gray-400 font-medium">No latest posts available yet.</p>
          <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">Check back soon for new content.</p>
        </div>
      );
    }
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {latestPosts.map((post, index) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ 
              opacity: 1, 
              y: 0,
              transition: { delay: index * 0.1, duration: 0.3 }
            }}
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <BlogCard
              id={post.id}
              slug={post.slug}
              title={post.title}
              excerpt={post.excerpt}
              thumbnail={post.thumbnail}
              images={post.images}
              publishedAt={post.publishedAt}
              readingTime={post.readingTime}
              category={post.category}
              tags={post.tags}
              author={post.author}
              commentCount={post.commentCount}
              likeCount={post.likeCount}
              viewCount={post.viewCount}
              variant="default"
            />
          </motion.div>
        ))}
      </div>
    );
  };
  
  // Render popular posts section
  const renderPopularPosts = () => {
    if (popularLoading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-gray-100 dark:bg-gray-800 rounded-lg h-96 animate-pulse flex flex-col">
              <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-t-lg"></div>
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-2"></div>
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                </div>
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mt-4 w-1/3"></div>
              </div>
            </div>
          ))}
        </div>
      );
    }
    
    if (!popularPosts || popularPosts.length === 0) {
      return (
        <div className="text-center py-10 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 mb-4">
            <TrendingUp className="w-8 h-8 text-gray-400 dark:text-gray-500" />
          </div>
          <p className="text-gray-500 dark:text-gray-400 font-medium">No popular posts available yet.</p>
          <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">Check back soon for trending content.</p>
        </div>
      );
    }
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {popularPosts.map((post, index) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ 
              opacity: 1, 
              y: 0,
              transition: { delay: index * 0.1, duration: 0.3 }
            }}
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <BlogCard
              id={post.id}
              slug={post.slug}
              title={post.title}
              excerpt={post.excerpt}
              thumbnail={post.thumbnail}
              images={post.images}
              publishedAt={post.publishedAt}
              readingTime={post.readingTime}
              category={post.category}
              tags={post.tags}
              author={post.author}
              commentCount={post.commentCount}
              likeCount={post.likeCount}
              viewCount={post.viewCount}
              variant="default"
            />
          </motion.div>
        ))}
      </div>
    );
  };
  
  // Render categories section
  const renderCategories = () => {
    if (categoriesLoading) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-gray-100 dark:bg-gray-800 rounded-lg h-32 animate-pulse flex flex-col items-center justify-center p-6">
              <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 mb-4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      );
    }
    
    if (!categories || categories.length === 0) {
      return (
        <div className="text-center py-10 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 mb-4">
            <BookOpen className="w-8 h-8 text-gray-400 dark:text-gray-500" />
          </div>
          <p className="text-gray-500 dark:text-gray-400 font-medium">No categories available yet.</p>
          <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">Check back soon for new content categories.</p>
        </div>
      );
    }
    
    // List of vibrant gradient backgrounds for categories
    const gradients = [
      'bg-gradient-to-r from-blue-500 to-indigo-600', 
      'bg-gradient-to-r from-purple-500 to-pink-500',
      'bg-gradient-to-r from-green-500 to-teal-500',
      'bg-gradient-to-r from-orange-500 to-pink-500',
      'bg-gradient-to-r from-blue-500 to-teal-500',
      'bg-gradient-to-r from-indigo-500 to-purple-500'
    ];
    
    // List of icons for categories if they don't have a specific one
    const defaultIcons = [
      'Code', 'Cloud', 'Rocket', 'Globe', 'Zap', 'Sparkles', 'BookOpen', 'BarChart2'
    ];
    
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.slice(0, 6).map((category, index) => (
          <motion.div
            key={category.id}
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="group relative overflow-hidden bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md border border-gray-100 dark:border-gray-700"
          >
            <Link to={`/category/${category.slug}`} className="block p-5">
              <div className="flex items-start gap-4">
                <div className={`w-16 h-16 flex items-center justify-center rounded-lg text-white ${gradients[index % gradients.length]}`}>
                  {category.icon ? (
                    <span className="text-2xl">{category.icon}</span>
                  ) : (
                    (() => {
                      const IconComponent = Icons[defaultIcons[index % defaultIcons.length] as keyof typeof Icons];
                      return <IconComponent className="w-8 h-8" />;
                    })()
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-lg text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {category.name}
                    </h3>
                    <span className="text-white dark:text-gray-800 bg-indigo-500 dark:bg-indigo-200 px-2 py-1 text-xs font-medium rounded-full">
                      {category.postCount || 0}
                    </span>
                  </div>
                  
                  {category.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                      {category.description}
                    </p>
                  )}
                  
                  <div className="mt-3 flex items-center text-indigo-600 dark:text-indigo-400 text-sm font-medium">
                    Explore
                    <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    );
  };
  
  // Render tags section
  const renderTags = () => {
    if (tagsLoading) {
      return (
        <div className="flex flex-wrap gap-2">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="bg-gray-100 dark:bg-gray-800 rounded-full h-8 w-20 animate-pulse"></div>
          ))}
        </div>
      );
    }
    
    if (!tags || tags.length === 0) {
      return (
        <div className="text-center py-4">
          <p className="text-gray-500 dark:text-gray-400">No tags available.</p>
        </div>
      );
    }
    
    return (
      <div className="flex flex-wrap gap-2">
        {tags.slice(0, 12).map((tag) => (
          <Link key={tag.id} to={`/tag/${tag.slug}`}>
            <Tag name={tag.name} count={tag.postCount} />
          </Link>
        ))}
      </div>
    );
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <Helmet>
        <title>Home | Tech Blog</title>
        <meta name="description" content="Latest tech news, tutorials, and insights for developers and tech enthusiasts." />
      </Helmet>

      {/* Hero Section */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Animated background elements */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0 -z-1"
        >
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        </motion.div>

        <div className="max-w-7xl mx-auto text-center">
          {/* Animated floating icons */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex justify-center gap-6 mb-8"
          >
            <motion.div
              animate={{ y: [-5, 5, -5] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-lg"
            >
              <Rocket className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
            </motion.div>
            <motion.div
              animate={{ y: [5, -5, 5] }}
              transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
              className="p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-lg"
            >
              <Code2 className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            </motion.div>
            <motion.div
              animate={{ y: [-5, 5, -5] }}
              transition={{ duration: 3, repeat: Infinity, delay: 1 }}
              className="p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-lg"
            >
              <Cloud className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </motion.div>
          </motion.div>

          {/* Main heading with staggered letters */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
            }}
            className="mb-8"
          >
            {Array.from("Next-Gen Tech Insights").map((char, i) => (
              <motion.span
                key={i}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 }
                }}
                className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 inline-block"
              >
                {char === " " ? "\u00A0" : char}
              </motion.span>
            ))}
          </motion.div>

          {/* Subheading with parallax effect */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed"
          >
            Explore cutting-edge technologies through in-depth articles, tutorials, and industry analysis crafted for developers and tech professionals.
          </motion.p>

          {/* Interactive search container */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 1 }}
            className="relative max-w-2xl mx-auto bg-white dark:bg-gray-800 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center px-6 py-4">
              <input
                type="text"
                placeholder="Discover AI, Web3, Cloud, DevOps..."
                className="w-full bg-transparent focus:outline-none placeholder-gray-400 dark:placeholder-gray-500 text-lg"
              />
              <button className="pl-6 pr-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:scale-[1.02] transition-transform flex items-center gap-2">
                <span>Explore</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>

          {/* Animated trending topics */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto"
          >
            {['AI Innovations', 'Web3 Trends', 'Cloud Architecture', 'DevOps 2.0'].map((topic, i) => (
              <motion.div
                key={topic}
                whileHover={{ y: -5 }}
                className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-indigo-200 dark:hover:border-indigo-800 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-100 dark:bg-indigo-900 rounded-lg">
                    <Globe className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <span className="font-medium text-gray-700 dark:text-gray-200">{topic}</span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Floating grid background */}
        <div className="absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]">
          <div className="absolute inset-0 bg-[linear-gradient(45deg,#fff_1px,transparent_1px)] dark:bg-[linear-gradient(45deg,#000_1px,transparent_1px)] [background-size:24px_24px]" />
        </div>
      </section>
      
      {/* Featured Posts Section */}
      <section ref={sectionRefs.featured} className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10">
            <div className="mb-4 sm:mb-0">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
                <Sparkles className="w-6 h-6 mr-2 text-indigo-600 dark:text-indigo-400" />
                Featured Posts
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-2">Top picks from our editors</p>
            </div>
            <Link 
              to="/blog?featured=true" 
              className="group flex items-center px-4 py-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/30 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors"
            >
              View All 
              <ChevronRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
          
          {renderFeaturedPosts()}
        </div>
      </section>
      
      {/* Categories Section */}
      <section ref={sectionRefs.categories} className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10">
            <div className="mb-4 sm:mb-0">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
                <BookOpen className="w-6 h-6 mr-2 text-indigo-600 dark:text-indigo-400" />
                Categories
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-2">Explore topics that interest you</p>
            </div>
            <Link 
              to="/categories" 
              className="group flex items-center px-4 py-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/30 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors"
            >
              View All 
              <ChevronRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
          
          {renderCategories()}
        </div>
      </section>
      
      {/* Latest & Popular Posts Section */}
      <section ref={sectionRefs.latest} className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-10">
            <div className="mb-4 md:mb-0">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                Latest Articles
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-2">{activeTab === 'latest' ? 'Fresh content just published' : 'Most read this month'}</p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex space-x-2 p-1 bg-gray-200 dark:bg-gray-800 rounded-lg">
                <button
                  onClick={() => handleTabChange('latest')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'latest' 
                      ? 'bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 shadow-sm' 
                      : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  Latest
                </button>
                <button
                  onClick={() => handleTabChange('popular')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'popular' 
                      ? 'bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 shadow-sm' 
                      : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  Popular
                </button>
              </div>
              
              <Link
                to={activeTab === 'latest' ? '/blog' : '/blog?sort=popular'}
                className="group flex items-center px-4 py-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/30 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors"
              >
                View All
                <ChevronRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div 
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === 'latest' ? renderLatestPosts() : renderPopularPosts()}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* Tags Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
            <div className="mb-4 sm:mb-0">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Popular Tags
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-2">Find content by topic</p>
            </div>
            <Link 
              to="/tags" 
              className="group flex items-center px-4 py-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/30 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors"
            >
              View All 
              <ChevronRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
          
          {renderTags()}
        </div>
      </section>

      {/* Newsletter Section */}
      <NewsletterSignup />
    </div>
  );
};

export default HomePage;