import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useBlog } from '../contexts/BlogContext';
import { useTheme } from '../contexts/ThemeContext';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Clock, BookOpen, BookmarkIcon, History, User, Mail, Calendar } from 'lucide-react';
import { formatDistance } from 'date-fns';
import { postAPI } from '../services/api';

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const { state: blogState } = useBlog();
  const { isDark } = useTheme();
  const [activeTab, setActiveTab] = useState<'profile' | 'reading' | 'bookmarks'>('profile');
  const [historyPosts, setHistoryPosts] = useState<any[]>([]);
  const [bookmarkedPosts, setBookmarkedPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Fetch detailed post data for history and bookmarks
  useEffect(() => {
    const fetchPostDetails = async () => {
      if (activeTab !== 'profile' && (blogState.viewHistory.length > 0 || blogState.bookmarks.length > 0)) {
        setLoading(true);
        try {
          if (activeTab === 'reading' && blogState.viewHistory.length > 0) {
            // Get the last 5 viewed posts
            const recentHistoryIds = blogState.viewHistory.slice(0, 5);
            const postsData = await Promise.all(
              recentHistoryIds.map(id => postAPI.getPostById(id).catch(() => null))
            );
            // Filter out any failed requests
            setHistoryPosts(postsData.filter(Boolean).map(response => response.data.data));
          } else if (activeTab === 'bookmarks' && blogState.bookmarks.length > 0) {
            // Get all bookmarked posts
            const postsData = await Promise.all(
              blogState.bookmarks.map(id => postAPI.getPostById(id).catch(() => null))
            );
            // Filter out any failed requests
            setBookmarkedPosts(postsData.filter(Boolean).map(response => response.data.data));
          }
        } catch (error) {
          console.error('Error fetching post details:', error);
        } finally {
          setLoading(false);
        }
      }
    };
    
    fetchPostDetails();
  }, [activeTab, blogState.viewHistory, blogState.bookmarks]);

  // Format reading time from seconds to a human-readable format
  const formatReadingTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  return (
    <>
      <Helmet>
        <title>My Profile | BlogFolio</title>
        <meta name="description" content="View and manage your profile" />
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Your Profile</h1>
        
        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
          <button
            className={`py-3 px-6 font-medium ${
              activeTab === 'profile'
                ? 'border-b-2 border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400'
                : 'text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400'
            }`}
            onClick={() => setActiveTab('profile')}
          >
            Profile
          </button>
          <button
            className={`py-3 px-6 font-medium ${
              activeTab === 'reading'
                ? 'border-b-2 border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400'
                : 'text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400'
            }`}
            onClick={() => setActiveTab('reading')}
          >
            Reading History
          </button>
          <button
            className={`py-3 px-6 font-medium ${
              activeTab === 'bookmarks'
                ? 'border-b-2 border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400'
                : 'text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400'
            }`}
            onClick={() => setActiveTab('bookmarks')}
          >
            Bookmarks
          </button>
        </div>
        
        {/* Tab Content */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          {user ? (
            <>
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    {user.avatar ? (
                      <img 
                        src={user.avatar} 
                        alt={user.name} 
                        className="w-24 h-24 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-24 h-24 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
                        <User size={32} className="text-indigo-600 dark:text-indigo-400" />
                      </div>
                    )}
                    
                    <div>
                      <h2 className="text-2xl font-bold">{user.name}</h2>
                      <p className="text-gray-600 dark:text-gray-400">{user.role || 'Reader'}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Mail className="text-gray-600 dark:text-gray-400" size={18} />
                        <span className="font-medium">Email:</span>
                        <span>{user.email}</span>
                      </div>
                      
                      {user.joinDate && (
                        <div className="flex items-center gap-2">
                          <Calendar className="text-gray-600 dark:text-gray-400" size={18} />
                          <span className="font-medium">Joined:</span>
                          <span>{new Date(user.joinDate).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <BookOpen className="text-gray-600 dark:text-gray-400" size={18} />
                        <span className="font-medium">Articles Read:</span>
                        <span>{blogState.readingStats.articlesRead}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Clock className="text-gray-600 dark:text-gray-400" size={18} />
                        <span className="font-medium">Reading Time:</span>
                        <span>{formatReadingTime(blogState.readingStats.totalTimeSpent)}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <BookmarkIcon className="text-gray-600 dark:text-gray-400" size={18} />
                        <span className="font-medium">Bookmarks:</span>
                        <span>{blogState.bookmarks.length}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <h3 className="text-lg font-medium mb-2">Bio</h3>
                    <p className="text-gray-700 dark:text-gray-300">
                      {user.bio || "No bio available. Tell us a bit about yourself!"}
                    </p>
                  </div>
                </div>
              )}
              
              {activeTab === 'reading' && (
                <div>
                  <h2 className="text-xl font-bold mb-4">Your Reading History</h2>
                  
                  {loading ? (
                    <div className="space-y-4">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="animate-pulse p-4 border rounded">
                          <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                        </div>
                      ))}
                    </div>
                  ) : blogState.viewHistory.length === 0 ? (
                    <div className="p-4 border rounded text-center">
                      <History size={32} className="mx-auto mb-2 text-gray-400" />
                      <p>You haven't read any articles yet.</p>
                      <Link to="/blog" className="text-indigo-600 dark:text-indigo-400 hover:underline mt-2 inline-block">
                        Explore our blog
                      </Link>
                    </div>
                  ) : historyPosts.length === 0 ? (
                    <div className="p-4 border rounded">
                      <p>Unable to load your reading history.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {historyPosts.map(post => (
                        <Link 
                          key={post._id} 
                          to={`/blog/${post.slug || post._id}`}
                          className="block p-4 border rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                        >
                          <h3 className="font-medium">{post.title}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {post.author?.name} • {new Date(post.createdAt).toLocaleDateString()}
                          </p>
                        </Link>
                      ))}
                      
                      {blogState.viewHistory.length > 5 && (
                        <div className="text-center mt-4">
                          <button 
                            className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
                            onClick={() => setActiveTab('reading')}
                          >
                            View more
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {blogState.readingStats.lastRead && (
                    <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                      Last read: {formatDistance(new Date(blogState.readingStats.lastRead), new Date(), { addSuffix: true })}
                    </div>
                  )}
                </div>
              )}
              
              {activeTab === 'bookmarks' && (
                <div>
                  <h2 className="text-xl font-bold mb-4">Your Bookmarks</h2>
                  
                  {loading ? (
                    <div className="space-y-4">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="animate-pulse p-4 border rounded">
                          <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                        </div>
                      ))}
                    </div>
                  ) : blogState.bookmarks.length === 0 ? (
                    <div className="p-4 border rounded text-center">
                      <BookmarkIcon size={32} className="mx-auto mb-2 text-gray-400" />
                      <p>You haven't bookmarked any articles yet.</p>
                      <Link to="/blog" className="text-indigo-600 dark:text-indigo-400 hover:underline mt-2 inline-block">
                        Explore our blog
                      </Link>
                    </div>
                  ) : bookmarkedPosts.length === 0 ? (
                    <div className="p-4 border rounded">
                      <p>Unable to load your bookmarks.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {bookmarkedPosts.map(post => (
                        <Link 
                          key={post._id} 
                          to={`/blog/${post.slug || post._id}`}
                          className="block p-4 border rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                        >
                          <h3 className="font-medium">{post.title}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {post.author?.name} • {new Date(post.createdAt).toLocaleDateString()}
                          </p>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-8">
              <p className="mb-4">Please log in to view your profile.</p>
              <Link to="/login" className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition">
                Log In
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
