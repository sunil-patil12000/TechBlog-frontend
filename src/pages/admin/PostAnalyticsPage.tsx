import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronDown, Calendar, RefreshCw, ArrowLeft, Clock, Users } from 'lucide-react';
import AnalyticsService, { PostAnalyticsResponse } from '../../services/analytics';

const PostAnalyticsPage: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeFilter, setTimeFilter] = useState('month');
  const [analyticsData, setAnalyticsData] = useState<PostAnalyticsResponse | null>(null);
  const [currentTimeFilterLabel, setCurrentTimeFilterLabel] = useState('This month');

  // Load post analytics data on mount and when time filter changes
  useEffect(() => {
    if (!postId) {
      setError('Post ID is required');
      setLoading(false);
      return;
    }

    const fetchPostAnalytics = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await AnalyticsService.getPostAnalytics(postId, timeFilter);
        setAnalyticsData(data);
      } catch (err) {
        console.error('Error fetching post analytics:', err);
        setError('Failed to load post analytics data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPostAnalytics();
  }, [postId, timeFilter]);

  // Handle time filter change
  const handleTimeFilterChange = (value: string, label: string) => {
    setTimeFilter(value);
    setCurrentTimeFilterLabel(label);
  };

  // Format time on page for display
  const formatTimeOnPage = (seconds: number | null): string => {
    if (seconds === null) return 'Not available';
    
    if (seconds < 60) return `${seconds} seconds`;
    
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    return `${minutes} min ${remainingSeconds} sec`;
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-indigo-600 dark:text-indigo-400 hover:underline mb-4"
          >
            <ArrowLeft size={16} className="mr-1" />
            Back to Analytics
          </button>
          
          <h1 className="text-2xl font-bold tracking-tight">
            {loading ? 'Loading post data...' : analyticsData?.post.title || 'Post Analytics'}
          </h1>
          {analyticsData?.post && (
            <p className="text-gray-500 dark:text-gray-400">
              <a 
                href={`/blog/${analyticsData.post.slug}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:underline"
              >
                View post on site
              </a>
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <div className="relative inline-block">
            <button
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-sm"
              onClick={() => document.getElementById('timeFilterDropdown')?.classList.toggle('hidden')}
            >
              <Calendar size={16} />
              {currentTimeFilterLabel}
              <ChevronDown size={16} />
            </button>
            <div 
              id="timeFilterDropdown" 
              className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 shadow-lg rounded-md z-10 hidden"
            >
              <div className="py-1">
                {[
                  { label: 'Last 7 days', value: 'week' },
                  { label: 'Today', value: 'today' },
                  { label: 'Yesterday', value: 'yesterday' },
                  { label: 'This month', value: 'month' },
                  { label: 'Last 30 days', value: 'last30days' },
                  { label: 'Last 90 days', value: 'last90days' },
                ].map((filter) => (
                  <button
                    key={filter.value}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => {
                      handleTimeFilterChange(filter.value, filter.label);
                      document.getElementById('timeFilterDropdown')?.classList.add('hidden');
                    }}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <button 
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={() => handleTimeFilterChange(timeFilter, currentTimeFilterLabel)}
            title="Refresh data"
          >
            <RefreshCw size={16} />
          </button>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="p-4 bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 rounded-md">
          {error}
        </div>
      )}

      {/* Stats overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Total Views */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Views</p>
              {loading ? (
                <div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 animate-pulse rounded mt-1"></div>
              ) : (
                <h3 className="text-2xl font-bold mt-1">
                  {analyticsData?.overview.totalViews.toLocaleString() || '0'}
                </h3>
              )}
            </div>
            <div className="p-3 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </div>
          </div>
        </div>

        {/* Unique Visitors */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Unique Visitors</p>
              {loading ? (
                <div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 animate-pulse rounded mt-1"></div>
              ) : (
                <h3 className="text-2xl font-bold mt-1">
                  {analyticsData?.overview.uniqueVisitors.toLocaleString() || '0'}
                </h3>
              )}
            </div>
            <div className="p-3 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400">
              <Users size={20} />
            </div>
          </div>
        </div>

        {/* Average Time on Page */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Avg. Time on Page</p>
              {loading ? (
                <div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 animate-pulse rounded mt-1"></div>
              ) : (
                <h3 className="text-2xl font-bold mt-1">
                  {formatTimeOnPage(analyticsData?.overview.avgTimeOnPage || null)}
                </h3>
              )}
            </div>
            <div className="p-3 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400">
              <Clock size={20} />
            </div>
          </div>
        </div>
      </div>

      {/* Daily Views Chart */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Daily Views</h2>
        {loading ? (
          <div className="h-64 w-full bg-gray-200 dark:bg-gray-700 animate-pulse rounded"></div>
        ) : (
          <div className="h-64 flex items-center justify-center">
            {analyticsData?.dailyViews && analyticsData.dailyViews.length > 0 ? (
              <div className="w-full">
                <p className="text-center text-gray-500 dark:text-gray-400">
                  Chart visualization would go here. Import a charting library to render the actual chart.
                </p>
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">No data available for this time period</p>
            )}
          </div>
        )}
      </div>

      {/* Referrers Table */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Traffic Sources</h2>
        {loading ? (
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-10 bg-gray-200 dark:bg-gray-700 animate-pulse rounded"></div>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Source</th>
                  <th className="text-right py-3 px-4">Views</th>
                  <th className="text-right py-3 px-4">Percentage</th>
                </tr>
              </thead>
              <tbody>
                {analyticsData?.referrers.map((ref) => (
                  <tr key={ref.referrer} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="py-3 px-4">
                      {ref.referrer === 'Direct' ? 'Direct / None' : ref.referrer}
                    </td>
                    <td className="text-right py-3 px-4">{ref.count.toLocaleString()}</td>
                    <td className="text-right py-3 px-4">{ref.percentage.toFixed(1)}%</td>
                  </tr>
                ))}
                {(!analyticsData?.referrers || analyticsData.referrers.length === 0) && (
                  <tr>
                    <td colSpan={3} className="py-4 text-center text-gray-500 dark:text-gray-400">
                      No data available for this time period
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Device Stats */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Device Breakdown</h2>
        {loading ? (
          <div className="h-40 w-full bg-gray-200 dark:bg-gray-700 animate-pulse rounded"></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {analyticsData?.deviceBreakdown.map((device) => (
              <div key={device.device} className="flex flex-col">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">{device.device}</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">{device.percentage.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-4">
                  <div 
                    className="bg-indigo-600 dark:bg-indigo-500 h-2.5 rounded-full" 
                    style={{ width: `${device.percentage}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{device.count.toLocaleString()} views</p>
              </div>
            ))}
            {(!analyticsData?.deviceBreakdown || analyticsData.deviceBreakdown.length === 0) && (
              <div className="col-span-3 py-4 text-center text-gray-500 dark:text-gray-400">
                No data available for this time period
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PostAnalyticsPage; 