import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { postAPI, categoryAPI } from '../../services/api';
import PostForm from '../../components/admin/PostForm';
import { Helmet } from 'react-helmet-async';
import { Calendar } from 'lucide-react';
import { format } from 'date-fns';

// Define initial form state with new fields
const initialPostData = {
  title: '',
  content: '',
  category: '',
  tags: [],
  images: [],
  published: false
};

const CreatePostPage: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string>('');
  const [categories, setCategories] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [publishDate, setPublishDate] = useState<string>('');
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  // Fetch categories when component mounts
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoryAPI.getCategories();
        console.log('Category API response:', response);

        // Validate that the response contains categories with _id properties
        if (response?.data?.data && Array.isArray(response.data.data) && response.data.data.length > 0) {
          // Make sure each category has an _id
          const validCategories = response.data.data.filter(cat => cat && cat._id);
          
          if (validCategories.length > 0) {
            console.log('Found valid categories:', validCategories);
            setCategories(validCategories);
          } else {
            console.warn('No valid categories found in API response');
            // Use hardcoded categories with proper _id values (formatted as MongoDB ObjectIds)
            setCategories([
              { _id: '60d21b4667d0d8992e610c85', name: 'Technology' },
              { _id: '60d21b4667d0d8992e610c86', name: 'Programming' },
              { _id: '60d21b4667d0d8992e610c87', name: 'Web Development' }
            ]);
          }
        } else if (response?.data?.categories && Array.isArray(response.data.categories)) {
          // Alternative API response format
          const validCategories = response.data.categories.filter(cat => cat && cat._id);
          if (validCategories.length > 0) {
            console.log('Found valid categories (alternative format):', validCategories);
            setCategories(validCategories);
          } else {
            throw new Error('No valid categories found in API response');
          }
        } else {
          throw new Error('Invalid API response format');
        }
      } catch (err) {
        console.error('Failed to fetch categories:', err);
        // No fallback categories - we'll display an error in the form
        setCategories([]);
        setError('Failed to load categories. Please create categories before creating posts.');
      }
    };
    
    fetchCategories();
  }, []);

  // Handle post submission
  const handleSubmit = async (postData: any) => {
    try {
      setIsSubmitting(true);
      setError('');
      
      console.log("Submitting post data:", postData);
      
      // Validate category exists and is valid
      if (!postData.get('category')) {
        throw new Error('Please select a category');
      }
      
      // Additional validation for categories if needed
      const categoryValue = postData.get('category');
      if (categories.length > 0 && !categories.some(cat => cat._id === categoryValue)) {
        throw new Error('Please select a valid category');
      }
      
      // Debug: Log FormData entries
      console.log("FormData entries:");
      for (const pair of postData.entries()) {
        console.log(pair[0], pair[1] instanceof File ? 
          `File: ${(pair[1] as File).name}, ${(pair[1] as File).size} bytes` : pair[1]);
      }
      
      const response = await postAPI.createPost(postData);
      
      console.log('API Response:', response);
      
      if (response.data.success) {
        console.log('Post created successfully');
        console.log('Response data:', response.data);
        // Redirect to post list
        navigate('/admin/posts');
      } else {
        throw new Error(response.data.message || 'Failed to create post');
      }
    } catch (err: any) {
      console.error('Error creating post:', err);
      // Extract error message
      let errorMessage = 'Failed to create post';
      
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      // Special handling for category errors
      if (errorMessage.includes('category')) {
        errorMessage = 'Please select a valid category. If no categories exist, create one first.';
      }
      
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Function to handle scheduling a post
  const handleSchedulePost = () => {
    setIsSubmitting(false);
    setShowScheduleModal(true);
  };
  
  // Function to confirm scheduling
  const confirmSchedule = () => {
    if (!publishDate) {
      alert('Please select a valid date');
      return;
    }
    
    setShowScheduleModal(false);
    // Submit the form automatically when scheduling
    handleSubmit(new FormData());
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Helmet>
        <title>Create New Post | Admin Dashboard</title>
      </Helmet>
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Create New Post</h1>
      </div>
      
      {/* Display error message */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Category warning when no categories exist */}
      {categories.length === 0 && (
        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                <strong>Warning:</strong> No categories available. Please create categories in the admin panel before creating posts.
                <a href="/admin/categories" className="font-medium underline ml-2">Create Categories</a>
              </p>
            </div>
          </div>
        </div>
      )}
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <PostForm 
          onSubmit={handleSubmit} 
          initialData={initialPostData}
          categories={categories}
          isSubmitting={isSubmitting}
        />
        
        <div className="flex justify-between mt-6">
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={() => navigate('/admin/posts')}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            
            <button
              type="button"
              onClick={() => {
                setIsSubmitting(false);
                handleSubmit(new FormData());
              }}
              className="px-4 py-2 border border-indigo-300 dark:border-indigo-600 rounded-md shadow-sm text-sm font-medium text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-900/20 hover:bg-indigo-100 dark:hover:bg-indigo-900/30"
            >
              Save as Draft
            </button>
          </div>
          
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={handleSchedulePost}
              className="px-4 py-2 border border-purple-300 dark:border-purple-600 rounded-md shadow-sm text-sm font-medium text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/30 flex items-center"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Schedule
            </button>
            
            <button
              type="submit"
              onClick={() => {
                setIsSubmitting(true);
                handleSubmit(new FormData());
              }}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Publish Now
            </button>
          </div>
        </div>
        
        {/* Schedule Modal */}
        {showScheduleModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Schedule Post</h2>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Publish Date and Time
                </label>
                <input 
                  type="datetime-local"
                  value={publishDate}
                  onChange={(e) => setPublishDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-gray-900 dark:text-white bg-white dark:bg-gray-800 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowScheduleModal(false)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                
                <button
                  type="button"
                  onClick={confirmSchedule}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Schedule
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreatePostPage;
