import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, Edit, Trash2, AlertTriangle, CheckCircle, X, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';
import api from '../../services/api';
import socketService from '../../services/socketService';

interface ScheduledPost {
  _id: string;
  title: string;
  slug: string;
  publishDate: string;
  author: {
    _id: string;
    name: string;
    avatar?: string;
  };
  category: string;
  createdAt: string;
}

const ScheduledPostsPage: React.FC = () => {
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Function to fetch scheduled posts
  const fetchScheduledPosts = async () => {
    setIsRefreshing(true);
    try {
      const response = await api.get('/api/posts', {
        params: {
          published: false,
          hasPublishDate: true,
          sort: 'publishDate',
          order: 'asc'
        }
      });
      
      setScheduledPosts(response.data.data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch scheduled posts');
      console.error('Error fetching scheduled posts:', err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  // Function to publish a post immediately
  const publishNow = async (postId: string) => {
    try {
      await api.put(`/api/posts/${postId}`, {
        published: true,
        publishDate: new Date().toISOString()
      });
      
      // Update the local state
      setScheduledPosts(prev => prev.filter(post => post._id !== postId));
      
      // Show success message
      setSuccessMessage('Post published successfully!');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to publish post');
      console.error('Error publishing post:', err);
    }
  };

  // Function to delete a scheduled post
  const deleteScheduledPost = async (postId: string) => {
    if (!window.confirm('Are you sure you want to delete this scheduled post?')) {
      return;
    }
    
    try {
      await api.delete(`/api/posts/${postId}`);
      
      // Update the local state
      setScheduledPosts(prev => prev.filter(post => post._id !== postId));
      
      // Show success message
      setSuccessMessage('Post deleted successfully!');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to delete post');
      console.error('Error deleting post:', err);
    }
  };

  // Fetch scheduled posts on mount
  useEffect(() => {
    fetchScheduledPosts();
    
    // Connect to socket for real-time updates
    socketService.connect();
    
    // Listen for post-published events
    const publishListener = socketService.on('dashboard-update', (update) => {
      if (update.type === 'post-published') {
        // Remove the published post from the list
        setScheduledPosts(prev => 
          prev.filter(post => post._id !== update.data._id)
        );
        
        // Show success message
        setSuccessMessage(`Post "${update.data.title}" was published automatically!`);
        setTimeout(() => setSuccessMessage(null), 3000);
      }
    });
    
    return () => {
      publishListener();
    };
  }, []);

  // Format the date for display
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy h:mm a');
    } catch (err) {
      return dateString;
    }
  };

  // Check if a post is scheduled to be published soon (within the next hour)
  const isPublishingSoon = (dateString: string) => {
    const publishDate = new Date(dateString);
    const now = new Date();
    const oneHour = 60 * 60 * 1000; // 1 hour in milliseconds
    return publishDate.getTime() - now.getTime() < oneHour;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Scheduled Posts</h1>
        <div className="flex space-x-2">
          <button
            onClick={fetchScheduledPosts}
            className="flex items-center px-4 py-2 text-sm font-medium rounded-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            disabled={isRefreshing}
          >
            <RefreshCw size={16} className={`mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <Link
            to="/admin/posts/new"
            className="flex items-center px-4 py-2 text-sm font-medium rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
          >
            Create New Post
          </Link>
        </div>
      </div>
      
      {/* Success Message */}
      {successMessage && (
        <div className="mb-4 p-4 bg-green-100 border border-green-300 text-green-700 rounded-md flex items-center justify-between">
          <div className="flex items-center">
            <CheckCircle size={20} className="mr-2" />
            <span>{successMessage}</span>
          </div>
          <button 
            onClick={() => setSuccessMessage(null)}
            className="text-green-700 hover:text-green-900"
          >
            <X size={16} />
          </button>
        </div>
      )}
      
      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-300 text-red-700 rounded-md flex items-center justify-between">
          <div className="flex items-center">
            <AlertTriangle size={20} className="mr-2" />
            <span>{error}</span>
          </div>
          <button 
            onClick={() => setError(null)}
            className="text-red-700 hover:text-red-900"
          >
            <X size={16} />
          </button>
        </div>
      )}
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : scheduledPosts.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <Calendar className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">No scheduled posts</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            You don't have any posts scheduled for publication.
          </p>
          <div className="mt-6">
            <Link
              to="/admin/posts/new"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Create new post
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 shadow overflow-hidden rounded-md">
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {scheduledPosts.map((post) => (
              <li key={post._id} className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/30">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <Link 
                      to={`/admin/posts/edit/${post._id}`}
                      className="block focus:outline-none"
                    >
                      <p className="text-lg font-medium text-indigo-600 dark:text-indigo-400 truncate">
                        {post.title}
                      </p>
                      <div className="mt-1 flex items-center">
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300">
                          {post.category}
                        </span>
                        <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                          by {post.author?.name || 'Unknown'}
                        </span>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <Calendar size={16} className="mr-1" />
                        <span className="mr-4">Created: {formatDate(post.createdAt)}</span>
                        <Clock size={16} className="mr-1" />
                        <span className={isPublishingSoon(post.publishDate) ? 'text-orange-500 dark:text-orange-400 font-medium' : ''}>
                          Publishes: {formatDate(post.publishDate)}
                          {isPublishingSoon(post.publishDate) && ' (soon)'}
                        </span>
                      </div>
                    </Link>
                  </div>
                  <div className="flex shrink-0 ml-4 space-x-2">
                    <Link
                      to={`/admin/posts/edit/${post._id}`}
                      className="p-2 rounded-md text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                    >
                      <Edit size={18} />
                    </Link>
                    <button
                      onClick={() => publishNow(post._id)}
                      className="p-2 rounded-md text-gray-400 hover:text-green-600 dark:hover:text-green-400"
                      title="Publish now"
                    >
                      <CheckCircle size={18} />
                    </button>
                    <button
                      onClick={() => deleteScheduledPost(post._id)}
                      className="p-2 rounded-md text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ScheduledPostsPage; 