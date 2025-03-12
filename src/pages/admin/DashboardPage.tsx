import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  BarChart, 
  Calendar, 
  FileText, 
  Users, 
  ArrowUp, 
  ArrowDown,
  Clock,
  Zap,
  TrendingUp,
  LayoutGrid,
  Image,
  Tag,
  Bell,
  Settings,
  MessageSquare,
  ExternalLink,
  ChevronRight,
  Filter,
  RefreshCw,
  Search
} from 'lucide-react';
import api from '../../services/api';
import { formatDistanceToNow, format } from 'date-fns';
import socketService from '../../services/socketService';

interface DashboardStat {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend: number;
  color: string;
}

interface Activity {
  id: string;
  title: string;
  category: string;
  time: string;
  url?: string;
  user: {
    name: string;
    avatar: string;
  }
}

interface PopularPost {
  _id: string;
  title: string;
  slug: string;
  views: number;
  category: string;
  createdAt: string;
  author: {
    name: string;
    avatar: string;
  }
}

// Add interface for ScheduledPost
interface ScheduledPost {
  _id: string;
  title: string;
  slug: string;
  publishDate: string;
  author: {
    name: string;
    avatar: string;
  };
}

const DashboardPage: React.FC = () => {
  const [timeFilter, setTimeFilter] = useState<'today' | 'week' | 'month'>('week');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [stats, setStats] = useState<DashboardStat[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [popularPosts, setPopularPosts] = useState<PopularPost[]>([]);
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const iconMap = {
    'FileText': <FileText className="w-6 h-6" />,
    'Users': <Users className="w-6 h-6" />,
    'Calendar': <Calendar className="w-6 h-6" />,
    'Clock': <Clock className="w-6 h-6" />,
    'MessageSquare': <MessageSquare className="w-6 h-6" />
  };

  const colorMap: Record<string, string> = {
    'Total Posts': "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400",
    'Active Users': "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400",
    'Scheduled Posts': "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400",
    'Avg. Read Time': "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400",
    'Comments': "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
  };

  // Function to fetch dashboard data
  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    setIsRefreshing(true);
    
    try {
      // Fetch stats
      const statsResponse = await api.getDashboardStats(timeFilter);
      
      // Map the stats and add color based on title
      const formattedStats = statsResponse.stats.map((stat: any) => ({
        ...stat,
        icon: iconMap[stat.icon as keyof typeof iconMap] || <FileText className="w-6 h-6" />,
        color: colorMap[stat.title] || "bg-gray-100 dark:bg-gray-900/30 text-gray-600 dark:text-gray-400"
      }));
      
      setStats(formattedStats);
      
      // Fetch activities
      const activitiesResponse = await api.getDashboardActivities(10);
      
      // Format activities
      const formattedActivities = activitiesResponse.data.map((activity: any) => ({
        ...activity,
        // Format the time as a relative time string
        time: formatDistanceToNow(new Date(activity.time), { addSuffix: true })
      }));
      
      setActivities(formattedActivities);
      
      // Fetch popular posts
      const popularPostsResponse = await api.getDashboardPopularPosts(5);
      setPopularPosts(popularPostsResponse.data);
      
      // Fetch scheduled posts
      const scheduledPostsResponse = await api.getScheduledPosts();
      // Get only the next 5 scheduled posts
      setScheduledPosts(scheduledPostsResponse.data.slice(0, 5));
      
    } catch (err: any) {
      console.error('Error fetching dashboard data:', err);
      setError(err.message || 'Failed to fetch dashboard data');
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  // Fetch data on component mount and when timeFilter changes
  useEffect(() => {
    fetchDashboardData();
  }, [timeFilter]);
  
  // Set up real-time updates
  useEffect(() => {
    // Connect to socket
    socketService.connect();
    
    // Listen for dashboard updates
    const dashboardUpdateListener = socketService.on('dashboard-update', (update: any) => {
      if (!update || !update.type) return;
      
      switch (update.type) {
        case 'new-post':
          // Add to activities immediately
          setActivities(prev => {
            const newActivity: Activity = {
              id: Date.now().toString(),
              title: `New post published: "${update.data.title}"`,
              category: update.data.category || 'Uncategorized',
              time: 'Just now',
              url: `/blog/${update.data.slug}`,
              user: {
                name: update.data.author?.name || 'Unknown Author',
                avatar: update.data.author?.avatar || ''
              }
            };
            return [newActivity, ...prev].slice(0, 10);
          });
          
          // Update stats
          setStats(prev => 
            prev.map(stat => 
              stat.title === 'Total Posts' 
                ? { 
                    ...stat, 
                    value: typeof stat.value === 'number' ? stat.value + 1 : stat.value,
                    trend: stat.trend + 0.5 // Small bump for real-time
                  } 
                : stat
            )
          );
          break;
          
        case 'new-comment':
          // Add to activities immediately
          setActivities(prev => {
            const newActivity: Activity = {
              id: Date.now().toString(),
              title: `New comment on "${update.data.postTitle}"`,
              category: 'Comments',
              time: 'Just now',
              url: `/blog/${update.data.postSlug}`,
              user: {
                name: update.data.user || 'Anonymous',
                avatar: ''
              }
            };
            return [newActivity, ...prev].slice(0, 10);
          });
          
          // Update stats
          setStats(prev => 
            prev.map(stat => 
              stat.title === 'Comments' 
                ? { 
                    ...stat, 
                    value: typeof stat.value === 'number' ? stat.value + 1 : stat.value,
                    trend: stat.trend + 0.5 // Small bump for real-time
                  } 
                : stat
            )
          );
          break;
          
        case 'new-user':
          // Add to activities immediately
          setActivities(prev => {
            const newActivity: Activity = {
              id: Date.now().toString(),
              title: `New user registered: ${update.data.name}`,
              category: 'Accounts',
              time: 'Just now',
              url: `/admin/users`,
              user: {
                name: update.data.name,
                avatar: update.data.avatar || ''
              }
            };
            return [newActivity, ...prev].slice(0, 10);
          });
          
          // Update stats
          setStats(prev => 
            prev.map(stat => 
              stat.title === 'Active Users' 
                ? { 
                    ...stat, 
                    value: typeof stat.value === 'number' ? stat.value + 1 : stat.value,
                    trend: stat.trend + 0.5 // Small bump for real-time
                  } 
                : stat
            )
          );
          break;
          
        default:
          break;
      }
    });
    
    return () => {
      dashboardUpdateListener();
    };
  }, []);

  const handleRefresh = () => {
    fetchDashboardData();
  };

  // Format date for scheduled posts
  const formatScheduledDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy h:mm a');
    } catch (error) {
      return dateString;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">Dashboard</h1>
        <div className="flex items-center space-x-4">
          <div className="flex items-center bg-white dark:bg-gray-800 rounded-lg shadow-sm p-1">
            <button
              onClick={() => setTimeFilter('today')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md ${
                timeFilter === 'today'
                  ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-600/30 dark:text-indigo-400'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              Today
            </button>
            <button
              onClick={() => setTimeFilter('week')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md ${
                timeFilter === 'week'
                  ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-600/30 dark:text-indigo-400'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setTimeFilter('month')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md ${
                timeFilter === 'month'
                  ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-600/30 dark:text-indigo-400'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              Month
            </button>
          </div>
          <button
            onClick={handleRefresh}
            className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-sm transition-all hover:shadow-md"
            disabled={isRefreshing}
          >
            <RefreshCw 
              className={`w-5 h-5 text-gray-500 dark:text-gray-400 ${isRefreshing ? 'animate-spin' : ''}`} 
            />
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6" role="alert">
          <p>{error}</p>
        </div>
      )}

      {loading && !isRefreshing ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : (
        <>
          {/* Stats cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.title}</p>
                    <p className="text-2xl font-semibold mt-1 text-gray-900 dark:text-white">{stat.value}</p>
                  </div>
                  <div className={`p-2 rounded-lg ${stat.color}`}>
                    {stat.icon}
                  </div>
                </div>
                <div className="mt-4 flex items-center">
                  {stat.trend > 0 ? (
                    <ArrowUp className="w-4 h-4 text-green-500" />
                  ) : stat.trend < 0 ? (
                    <ArrowDown className="w-4 h-4 text-red-500" />
                  ) : (
                    <div className="w-4 h-4" /> // Empty div for spacing when trend is 0
                  )}
                  <span className={`ml-1 text-sm font-medium ${
                    stat.trend > 0 ? 'text-green-500' : 
                    stat.trend < 0 ? 'text-red-500' : 
                    'text-gray-500 dark:text-gray-400'
                  }`}>
                    {Math.abs(stat.trend)}%
                  </span>
                  <span className="ml-1.5 text-sm text-gray-500 dark:text-gray-400">vs previous {timeFilter}</span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Activity, Popular Posts, and Scheduled Posts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Activity */}
            <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Activity</h2>
                <Link to="/admin/activity" className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 flex items-center">
                  View all <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
              
              <div className="space-y-4">
                {activities.length === 0 && !loading ? (
                  <p className="text-gray-500 dark:text-gray-400 text-center py-6">No recent activities found</p>
                ) : (
                  activities.map((activity, idx) => (
                    <motion.div 
                      key={activity.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: idx * 0.05 }}
                      className="flex items-start space-x-4 p-3 hover:bg-gray-50 dark:hover:bg-gray-700/30 rounded-lg transition-colors"
                    >
                      <div className="flex-shrink-0">
                        <img 
                          src={activity.user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(activity.user.name)}&background=random`} 
                          alt={activity.user.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {activity.title}
                        </p>
                        <div className="flex items-center mt-1">
                          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                            {activity.category}
                          </span>
                          <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                            {activity.time}
                          </span>
                        </div>
                      </div>
                      {activity.url && (
                        <a 
                          href={activity.url} 
                          className="flex-shrink-0 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </motion.div>
                  ))
                )}
              </div>
            </div>
            
            {/* Right Sidebar - Cards */}
            <div className="space-y-6">
              {/* Popular Posts */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Popular Posts</h2>
                  <Link to="/admin/posts" className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 flex items-center">
                    View all <ChevronRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>
                
                <div className="space-y-4">
                  {popularPosts.length === 0 && !loading ? (
                    <p className="text-gray-500 dark:text-gray-400 text-center py-6">No popular posts found</p>
                  ) : (
                    popularPosts.map((post, idx) => (
                      <motion.div 
                        key={post._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2, delay: idx * 0.05 }}
                        className="p-3 hover:bg-gray-50 dark:hover:bg-gray-700/30 rounded-lg transition-colors"
                      >
                        <Link to={`/blog/${post.slug}`} className="block">
                          <p className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2">
                            {post.title}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
                              {post.category || 'Uncategorized'}
                            </span>
                            <span className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                              <Zap className="w-3 h-3 mr-1" /> {post.views} views
                            </span>
                          </div>
                        </Link>
                      </motion.div>
                    ))
                  )}
                </div>
              </div>
              
              {/* Scheduled Posts */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Upcoming Posts</h2>
                  <Link to="/admin/scheduled-posts" className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 flex items-center">
                    View all <ChevronRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>
                
                <div className="space-y-4">
                  {scheduledPosts.length === 0 && !loading ? (
                    <p className="text-gray-500 dark:text-gray-400 text-center py-6">No scheduled posts found</p>
                  ) : (
                    scheduledPosts.map((post, idx) => (
                      <motion.div 
                        key={post._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2, delay: idx * 0.05 }}
                        className="p-3 hover:bg-gray-50 dark:hover:bg-gray-700/30 rounded-lg transition-colors"
                      >
                        <Link to={`/admin/posts/edit/${post._id}`} className="block">
                          <p className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2">
                            {post.title}
                          </p>
                          <div className="flex items-center mt-2 justify-between">
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              by {post.author?.name || 'Unknown'}
                            </span>
                            <span className="flex items-center text-xs font-medium px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400">
                              <Calendar className="w-3 h-3 mr-1" /> {formatScheduledDate(post.publishDate)}
                            </span>
                          </div>
                        </Link>
                      </motion.div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DashboardPage;
