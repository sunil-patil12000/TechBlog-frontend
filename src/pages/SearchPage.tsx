import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Filter, X } from 'lucide-react';
import BlogCard from '../components/blog/BlogCard';
import { useCategories } from '../hooks/useCategories';
import { useTags } from '../hooks/useTags';
import { postAPI } from '../services/api';
import { Post } from '../hooks/usePosts';
import Spinner from '../components/ui/Spinner';
import { Helmet } from 'react-helmet-async';

const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const category = searchParams.get('category') || '';
  const tag = searchParams.get('tag') || '';
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<Post[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // Fetch categories and tags from API
  const { categories: categoryList, isLoading: categoriesLoading } = useCategories();
  const { tags: tagList, isLoading: tagsLoading } = useTags();

  // Map backend post data to frontend format
  const mapPostData = (post: any): Post => {
    return {
      id: post._id,
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt || post.content?.substring(0, 150) + '...',
      content: post.content,
      thumbnail: post.coverImage || post.thumbnail,
      publishedAt: post.publishDate || post.createdAt,
      readingTime: post.readingTime || Math.ceil(post.content?.length / 1000) || 5,
      category: post.category ? {
        id: post.category._id,
        name: post.category.name,
        slug: post.category.slug
      } : undefined,
      tags: post.tags?.map((tag: any) => ({
        id: tag._id,
        name: tag.name, 
        slug: tag.slug
      })),
      author: {
        id: post.author?._id || 'unknown',
        name: post.author?.name || 'Unknown Author',
        avatar: post.author?.avatar
      },
      commentCount: post.comments?.length || 0,
      likeCount: post.likes || 0,
      viewCount: post.views || 0,
      isBookmarked: false
    };
  };

  useEffect(() => {
    // Reset page when search params change
    setCurrentPage(1);
  }, [query, category, tag]);

  useEffect(() => {
    const searchPosts = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Prepare API request parameters
        const params: Record<string, any> = {
          page: currentPage,
          limit: 10
        };
        
        // Add search parameters if they exist
        if (query) params.search = query;
        if (category) params.category = category;
        if (tag) params.tag = tag;
        
        // Call the API
        const response = await postAPI.getPosts(params);
        
        if (response.data && response.data.data) {
          // Map the data to our format
          const mappedPosts = response.data.data.map(mapPostData);
          setResults(mappedPosts);
          
          // Update pagination data
          if (response.data.pagination) {
            setTotalPages(response.data.pagination.totalPages);
          }
        } else {
          setResults([]);
          setTotalPages(1);
        }
      } catch (err) {
        console.error('Error searching posts:', err);
        setError('Failed to load search results. Please try again.');
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    searchPosts();
  }, [query, category, tag, currentPage]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newParams = new URLSearchParams(searchParams);
    const value = e.target.value;
    
    if (value) {
      newParams.set('q', value);
    } else {
      newParams.delete('q');
    }
    
    setSearchParams(newParams);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newParams = new URLSearchParams(searchParams);
    const value = e.target.value;
    
    if (value) {
      newParams.set('category', value);
    } else {
      newParams.delete('category');
    }
    
    setSearchParams(newParams);
  };

  const handleTagChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newParams = new URLSearchParams(searchParams);
    const value = e.target.value;
    
    if (value) {
      newParams.set('tag', value);
    } else {
      newParams.delete('tag');
    }
    
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    const newParams = new URLSearchParams();
    if (query) newParams.set('q', query);
    setSearchParams(newParams);
  };

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Helmet>
        <title>{query ? `Search: ${query}` : 'Search'} | Tech Blog</title>
        <meta name="description" content="Search for articles, tutorials, and insights on our tech blog." />
      </Helmet>
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">
          {query ? `Search results for "${query}"` : 'Search'}
        </h1>
        
        <div className="relative">
          <input
            type="text"
            placeholder="Search for articles, topics, or authors..."
            className="w-full p-4 pr-12 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            value={query}
            onChange={handleSearchChange}
          />
          <Search className="absolute right-4 top-4 text-gray-400" />
        </div>
        
        <div className="mt-4 flex justify-between items-center">
          <button 
            className="flex items-center text-indigo-600 dark:text-indigo-400"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="w-4 h-4 mr-1" />
            {showFilters ? 'Hide filters' : 'Show filters'}
          </button>
          
          {(category || tag) && (
            <button 
              className="flex items-center text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400"
              onClick={clearFilters}
            >
              <X className="w-4 h-4 mr-1" />
              Clear filters
            </button>
          )}
        </div>
        
        {showFilters && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Category
              </label>
              <select
                className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                value={category}
                onChange={handleCategoryChange}
              >
                <option value="">All Categories</option>
                {!categoriesLoading && categoryList.map((cat) => (
                  <option key={cat.id} value={cat.slug}>{cat.name}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Tag
              </label>
              <select
                className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                value={tag}
                onChange={handleTagChange}
              >
                <option value="">All Tags</option>
                {!tagsLoading && tagList.map((t) => (
                  <option key={t.id} value={t.slug}>{t.name}</option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      ) : error ? (
        <div className="py-8 text-center">
          <p className="text-red-500 dark:text-red-400">{error}</p>
          <button 
            className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      ) : results.length === 0 ? (
        <div className="py-8 text-center">
          <p className="text-gray-500 dark:text-gray-400">No results found. Try different search terms or filters.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex justify-center">
              <nav className="flex items-center space-x-2">
                <button
                  className="px-3 py-1 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 disabled:opacity-50"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(page => page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1)
                  .reduce((acc, page, i, filtered) => {
                    if (i > 0 && filtered[i - 1] !== page - 1) {
                      acc.push(<span key={`ellipsis-${page}`} className="px-3 py-1">...</span>);
                    }
                    
                    acc.push(
                      <button
                        key={page}
                        className={`px-3 py-1 rounded-md ${
                          currentPage === page 
                            ? 'bg-indigo-600 text-white' 
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                        }`}
                        onClick={() => handlePageChange(page)}
                      >
                        {page}
                      </button>
                    );
                    
                    return acc;
                  }, [] as React.ReactNode[])
                }
                
                <button
                  className="px-3 py-1 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 disabled:opacity-50"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </nav>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SearchPage; 