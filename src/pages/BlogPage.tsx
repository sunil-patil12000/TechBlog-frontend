import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { 
  Filter as FilterIcon, 
  Grid as GridIcon, 
  List as ListIcon, 
  LayoutGrid as GridLayoutIcon,
  Search,
  X,
  Sliders,
  Clock,
  TrendingUp,
  Star,
  LayoutList
} from 'lucide-react';
import { cn } from '@/lib/utils';

import SEO from '../components/utils/SEO';
import BlogCard from '../components/blog/BlogCard';
import Spinner from '../components/ui/Spinner';
import { useTheme } from '../contexts/ThemeContext';
import { withErrorBoundary } from '../components/utils/ErrorBoundary';
import { postAPI } from '../services/api';
import { Post } from '../hooks/usePosts';
import { useCategories } from '../hooks/useCategories';
import { useTags } from '../hooks/useTags';

// Layout options
type LayoutType = 'standard' | 'grid' | 'magazine';

interface BlogPageProps {
  category?: string;
}

const BlogPage: React.FC<BlogPageProps> = ({ category }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { isDark } = useTheme();
  const [layout, setLayout] = useState<LayoutType>('grid');
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    category: category || searchParams.get('category') || '',
    tag: searchParams.get('tag') || '',
    search: searchParams.get('search') || '',
    sort: searchParams.get('sort') || 'newest',
    page: parseInt(searchParams.get('page') || '1'),
    limit: parseInt(searchParams.get('limit') || '12')
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchValue, setSearchValue] = useState(filters.search);
  
  // Get categories and tags for filters
  const { categories, isLoading: categoriesLoading } = useCategories();
  const { tags, isLoading: tagsLoading } = useTags();

  // Fetch posts when filters change
  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const response = await postAPI.getPosts(filters);
        setPosts(response.data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch posts');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
    
    // Update search params
    const newSearchParams = new URLSearchParams();
    if (filters.category) newSearchParams.set('category', filters.category);
    if (filters.tag) newSearchParams.set('tag', filters.tag);
    if (filters.search) newSearchParams.set('search', filters.search);
    if (filters.sort) newSearchParams.set('sort', filters.sort);
    if (filters.page > 1) newSearchParams.set('page', filters.page.toString());
    if (filters.limit !== 12) newSearchParams.set('limit', filters.limit.toString());
    
    setSearchParams(newSearchParams);
  }, [filters, setSearchParams]);

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      category: '',
      tag: '',
      search: '',
      sort: 'newest',
      page: 1,
      limit: 12
    });
    setSearchValue('');
  };
  
  // Handle sort change
  const handleSortChange = (sort: string) => {
    setFilters({ ...filters, sort, page: 1 });
  };
  
  // Handle category filter
  const handleCategoryFilter = (categorySlug: string) => {
    setFilters({ 
      ...filters, 
      category: filters.category === categorySlug ? '' : categorySlug,
      page: 1 
    });
  };
  
  // Handle tag filter
  const handleTagFilter = (tagSlug: string) => {
    setFilters({ 
      ...filters, 
      tag: filters.tag === tagSlug ? '' : tagSlug,
      page: 1 
    });
  };
  
  // Handle search submit
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters({ ...filters, search: searchValue, page: 1 });
    setIsFilterOpen(false);
  };

  // Render skeleton loaders
  const renderSkeletons = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array(6).fill(0).map((_, index) => (
        <div key={index} className="bg-gray-100 dark:bg-gray-800 rounded-xl h-[380px] overflow-hidden animate-pulse">
          <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-t-xl"></div>
          <div className="p-4 space-y-4">
            <div className="flex justify-between">
              <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
            <div className="h-6 w-3/4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-4 w-2/3 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="flex gap-2 pt-2">
              <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
              <div className="h-8 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  // Render posts based on layout
  const renderPosts = () => {
    if (isLoading) {
      return renderSkeletons();
    }

    if (error) {
      return (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12 mx-auto max-w-lg bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8"
        >
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Error Loading Posts
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {error}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-colors"
          >
            Try Again
          </button>
        </motion.div>
      );
    }
    
    if (posts.length === 0) {
      return (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12 mx-auto max-w-lg bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8"
        >
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No posts found
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Try adjusting your filters or come back later for new content.
          </p>
          <button
            onClick={clearFilters}
            className="px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
          >
            Clear filters
          </button>
        </motion.div>
      );
    }

    if (layout === 'magazine') {
      const featuredPost = posts.find(post => post.isFeatured) || posts[0];
      const otherPosts = posts.filter(post => post.id !== featuredPost.id);
      
      return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          {/* Main featured post */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
            <div className="lg:col-span-2">
              <motion.div 
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <BlogCard 
                  {...featuredPost}
                  variant="featured"
                />
              </motion.div>
            </div>
            
            {/* Side featured posts */}
            <div className="lg:col-span-1 space-y-6">
              {otherPosts.slice(0, 2).map((post, index) => (
                <motion.div 
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index, duration: 0.3 }}
                  whileHover={{ y: -5 }}
                >
                  <BlogCard 
                    {...post} 
                    variant="compact" 
                  />
                </motion.div>
              ))}
            </div>
          </div>
          
          {/* More posts grid */}
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 mt-12">
            Latest Articles
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherPosts.slice(2).map((post, index) => (
              <motion.div 
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index, duration: 0.3 }}
                whileHover={{ y: -5 }}
              >
                <BlogCard 
                  {...post}
                  variant="default"
                />
              </motion.div>
            ))}
          </div>
        </motion.div>
      );
    }
    
    if (layout === 'grid') {
      return (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          {posts.map((post, index) => (
            <motion.div 
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * index, duration: 0.3 }}
              whileHover={{ y: -5 }}
              className="h-full"
            >
              <BlogCard 
                {...post}
                variant="default"
              />
            </motion.div>
          ))}
        </motion.div>
      );
    }
    
    // Standard layout
    return (
      <motion.div 
        className="space-y-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        {posts.map((post, index) => (
          <motion.div 
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index, duration: 0.3 }}
            whileHover={{ y: -5 }}
          >
            <BlogCard 
              {...post}
              variant="default"
            />
          </motion.div>
        ))}
      </motion.div>
    );
  };

  return (
    <>
      <SEO 
        title={category ? `${category} - Blog` : "Blog"}
        description="Browse our latest articles, tutorials, and insights."
        keywords="blog, articles, tech news, tutorials"
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
              {category ? `${category} Articles` : 'Explore Blog'}
            </h1>
            <p className="mt-1 text-gray-600 dark:text-gray-400">
              {category 
                ? `Browse articles in ${category}`
                : 'Discover our latest articles, tutorials, and insights'
              }
            </p>
          </div>
          
          {/* Layout and Filter Controls */}
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            {/* Layout switcher */}
            <div className="flex items-center p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
              <button
                className={`p-2 rounded-md ${
                  layout === 'standard' 
                    ? 'bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 shadow-sm' 
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                }`}
                onClick={() => setLayout('standard')}
                aria-label="Standard layout"
              >
                <LayoutList className="w-5 h-5" />
              </button>
              <button
                className={`p-2 rounded-md ${
                  layout === 'grid' 
                    ? 'bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 shadow-sm' 
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                }`}
                onClick={() => setLayout('grid')}
                aria-label="Grid layout"
              >
                <GridIcon className="w-5 h-5" />
              </button>
              <button
                className={`p-2 rounded-md ${
                  layout === 'magazine' 
                    ? 'bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 shadow-sm' 
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                }`}
                onClick={() => setLayout('magazine')}
                aria-label="Magazine layout"
              >
                <GridLayoutIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Filter button */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setIsFilterOpen(true)}
              className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-sm text-sm font-medium transition-colors"
            >
              <FilterIcon className="w-4 h-4 mr-2" />
              Filters
            </motion.button>
          </div>
        </motion.div>

        {/* Active filters display */}
        {(filters.category || filters.tag || filters.search) && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 flex flex-wrap items-center gap-2"
          >
            <span className="text-sm text-gray-500 dark:text-gray-400">Active filters:</span>
            
            {filters.category && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300">
                {categories?.find(c => c.slug === filters.category)?.name || filters.category}
                <button 
                  onClick={() => setFilters({...filters, category: '', page: 1})}
                  className="ml-1 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </span>
            )}
            
            {filters.tag && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300">
                {tags?.find(t => t.slug === filters.tag)?.name || filters.tag}
                <button 
                  onClick={() => setFilters({...filters, tag: '', page: 1})}
                  className="ml-1 text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </span>
            )}
            
            {filters.search && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
                "{filters.search}"
                <button 
                  onClick={() => {
                    setFilters({...filters, search: '', page: 1});
                    setSearchValue('');
                  }}
                  className="ml-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </span>
            )}
            
            <button 
              onClick={clearFilters}
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 ml-2"
            >
              Clear all
            </button>
          </motion.div>
        )}
        
        {/* Sort options */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-center mb-8 overflow-x-auto pb-2 gap-2"
        >
          <span className="text-sm text-gray-500 dark:text-gray-400 mr-2">Sort by:</span>
          
          <button
            className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap ${
              filters.sort === 'newest' 
                ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300' 
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
            onClick={() => handleSortChange('newest')}
          >
            <Clock className="w-3.5 h-3.5 inline-block mr-1.5" />
            Newest
          </button>
          
          <button
            className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap ${
              filters.sort === 'popular' 
                ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300' 
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
            onClick={() => handleSortChange('popular')}
          >
            <TrendingUp className="w-3.5 h-3.5 inline-block mr-1.5" />
            Popular
          </button>
          
          <button
            className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap ${
              filters.sort === 'featured' 
                ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300' 
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
            onClick={() => handleSortChange('featured')}
          >
            <Star className="w-3.5 h-3.5 inline-block mr-1.5" />
            Featured
          </button>
        </motion.div>

        {/* Posts grid */}
        {renderPosts()}
        
        {/* Pagination (simplified) */}
        {posts.length > 0 && (
          <div className="mt-12 flex justify-center">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setFilters({...filters, page: Math.max(1, filters.page - 1)})}
                disabled={filters.page === 1}
                className={`px-4 py-2 rounded-lg ${
                  filters.page === 1
                    ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
                }`}
              >
                Previous
              </button>
              
              <span className="px-4 py-2 bg-indigo-600 text-white rounded-lg">
                {filters.page}
              </span>
              
              <button
                onClick={() => setFilters({...filters, page: filters.page + 1})}
                className="px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-700"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Filter Sidebar/Modal */}
      <AnimatePresence>
        {isFilterOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
              onClick={() => setIsFilterOpen(false)}
            />
            
            <motion.div
              initial={{ opacity: 0, x: 300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 300 }}
              transition={{ type: "spring", damping: 25 }}
              className="fixed right-0 top-0 h-full w-full max-w-md bg-white dark:bg-gray-900 shadow-xl z-50 overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                    <Sliders className="w-5 h-5 mr-2" />
                    Filters
                  </h2>
                  <button
                    onClick={() => setIsFilterOpen(false)}
                    className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                {/* Search */}
                <div className="mb-8">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Search
                  </label>
                  <form onSubmit={handleSearchSubmit} className="flex">
                    <input
                      type="text"
                      value={searchValue}
                      onChange={(e) => setSearchValue(e.target.value)}
                      placeholder="Search articles..."
                      className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-l-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-600 focus:outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-r-lg"
                    >
                      <Search className="w-5 h-5" />
                    </button>
                  </form>
                </div>
                
                {/* Categories */}
                <div className="mb-8">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    Categories
                  </h3>
                  {categoriesLoading ? (
                    <div className="space-y-2">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"/>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                      {categories?.map((category) => (
                        <button
                          key={category.id}
                          onClick={() => handleCategoryFilter(category.slug)}
                          className={`flex items-center justify-between w-full px-3 py-2 rounded-lg text-left ${
                            filters.category === category.slug
                              ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300'
                              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                          }`}
                        >
                          <span>{category.name}</span>
                          {category.postCount && (
                            <span className="text-xs px-2 py-1 rounded-full bg-white dark:bg-gray-700">
                              {category.postCount}
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                
                {/* Tags */}
                <div className="mb-8">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    Tags
                  </h3>
                  {tagsLoading ? (
                    <div className="flex flex-wrap gap-2">
                      {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="h-8 w-20 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"/>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto">
                      {tags?.map((tag) => (
                        <button
                          key={tag.id}
                          onClick={() => handleTagFilter(tag.slug)}
                          className={`px-3 py-1 rounded-full text-sm ${
                            filters.tag === tag.slug
                              ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300'
                              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                          }`}
                        >
                          {tag.name}
                          {tag.postCount && (
                            <span className="ml-1 text-xs">({tag.postCount})</span>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                
                {/* Action buttons */}
                <div className="flex gap-4 mt-8">
                  <button
                    onClick={clearFilters}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    Clear All
                  </button>
                  <button
                    onClick={() => setIsFilterOpen(false)}
                    className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default withErrorBoundary(BlogPage);
