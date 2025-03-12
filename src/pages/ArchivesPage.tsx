import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { postAPI, categoryAPI } from '../services/api';
import PostCard from '../components/blog/PostCard';

interface Post {
  _id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  createdAt: string;
  author: {
    name: string;
    avatar?: string;
  };
  images?: {
    url: string;
    alt?: string;
    _id: string;
  }[];
  tags?: string[];
  category?: string;
}

interface Category {
  _id: string;
  name: string;
  slug: string;
}

const ArchivesPage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedTag, setSelectedTag] = useState('');

  // Get unique tags from all posts
  const allTags = Array.from(new Set(posts.flatMap(post => post.tags || [])));
  
  useEffect(() => {
    fetchCategories();
    fetchPosts();
  }, [currentPage, selectedCategory, selectedTag]);
  
  const fetchCategories = async () => {
    try {
      // Try to fetch categories, but provide fallback if API fails
      const response = await categoryAPI.getCategories();
      if (response?.data?.data) {
        setCategories(response.data.data);
      } else {
        // Fallback if API doesn't return expected structure
        console.warn('Categories API returned unexpected data structure');
        setCategories([]);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
      // Empty array if API call fails completely
      setCategories([]);
    }
  };
  
  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(''); // Clear any previous errors
      const response = await postAPI.getPosts(
        currentPage, 
        9, 
        selectedCategory, 
        selectedTag
      );
      
      // Check if response has the expected data structure
      if (response?.data?.data) {
        setPosts(response.data.data);
        
        // Handle pagination data safely
        if (response.data.pagination && typeof response.data.pagination.totalPages === 'number') {
          setTotalPages(response.data.pagination.totalPages);
        } else if (response.data.totalPages) {
          // Alternative structure: direct totalPages property
          setTotalPages(response.data.totalPages);
        } else if (Array.isArray(response.data.data)) {
          // If no pagination info, at least ensure we have page 1
          setTotalPages(1);
        }
      } else {
        // Fallback for unexpected API response
        setPosts([]);
        setTotalPages(1);
        setError('Received invalid data from server');
      }
    } catch (err) {
      console.error('Error fetching posts:', err instanceof Error ? err.message : String(err));
      setError('Failed to fetch posts. Please try again later.');
      setPosts([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };
  
  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId === selectedCategory ? '' : categoryId);
    setCurrentPage(1); // Reset to first page when changing filters
  };
  
  const handleTagChange = (tag: string) => {
    setSelectedTag(tag === selectedTag ? '' : tag);
    setCurrentPage(1); // Reset to first page when changing filters
  };
  
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    // Scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <Helmet>
        <title>Archives | Blog</title>
      </Helmet>
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Blog Archives</h1>
        
        {/* Filters */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-4">
            {categories.length > 0 && (
              <div>
                <h3 className="font-medium mb-2">Categories:</h3>
                <div className="flex flex-wrap gap-2">
                  {categories.map(category => (
                    <button
                      key={category._id}
                      onClick={() => handleCategoryChange(category._id)}
                      className={`px-3 py-1 rounded-full text-sm ${
                        selectedCategory === category._id
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200'
                      }`}
                    >
                      {category.name}
                    </button>
                  ))}
                  {selectedCategory && (
                    <button
                      onClick={() => setSelectedCategory('')}
                      className="px-3 py-1 rounded-full text-sm bg-red-100 text-red-700"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>
            )}
            
            {allTags.length > 0 && (
              <div>
                <h3 className="font-medium mb-2">Tags:</h3>
                <div className="flex flex-wrap gap-2">
                  {allTags.map(tag => (
                    <button
                      key={tag}
                      onClick={() => handleTagChange(tag)}
                      className={`px-3 py-1 rounded-full text-sm ${
                        selectedTag === tag
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                  {selectedTag && (
                    <button
                      onClick={() => setSelectedTag('')}
                      className="px-3 py-1 rounded-full text-sm bg-red-100 text-red-700"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Posts Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 text-red-700 p-4 rounded">
            {error}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p>No posts found. Try changing your filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map(post => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        )}
        
        {/* Pagination - only show if we have confirmed totalPages > 1 */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-10">
            <div className="flex space-x-1">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md dark:bg-gray-700 dark:text-gray-300 disabled:opacity-50"
              >
                &laquo; Previous
              </button>
              
              <div className="hidden sm:flex space-x-1">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => handlePageChange(i + 1)}
                    className={`px-4 py-2 rounded-md ${
                      currentPage === i + 1
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-700 bg-gray-200 dark:bg-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              
              <div className="sm:hidden px-4 py-2 text-gray-700 bg-gray-200 rounded-md dark:bg-gray-700 dark:text-gray-300">
                {currentPage} of {totalPages}
              </div>
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md dark:bg-gray-700 dark:text-gray-300 disabled:opacity-50"
              >
                Next &raquo;
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ArchivesPage;