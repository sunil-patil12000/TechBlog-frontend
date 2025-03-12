import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

// Constants
const API_URL = import.meta.env.VITE_API_URL || '/api';
const SESSION_ID_KEY = 'blog_session_id';

// Types
export interface PageViewParams {
  page: string;
  path: string;
  postId?: string;
  referrer?: string;
}

export interface EventParams {
  type: string; // 'click', 'scroll', 'engagement', etc.
  category: string; // 'navigation', 'content', 'social', etc.
  action: string; // 'click', 'view', 'share', etc.
  label?: string; // additional context
  value?: number; // numeric value if applicable
  page: string; // current page name
  path: string; // current URL path
  postId?: string; // post ID if on a post page
}

export interface AnalyticsTimeRange {
  start: string;
  end: string;
}

export interface AnalyticsOverview {
  totalPageViews: number;
  uniqueVisitors: number;
  visitorGrowth?: number;
}

export interface PageViewData {
  date: string;
  count: number;
  uniqueUsers: number;
  uniqueSessions: number;
}

export interface DeviceStats {
  device: string;
  count: number;
  percentage: number;
}

export interface BrowserStats {
  browser: string;
  count: number;
  percentage: number;
}

export interface PopularPage {
  path: string;
  page: string;
  count: number;
  percentage: number;
}

export interface PopularPost {
  postId: string;
  title: string;
  slug: string;
  views: number;
}

export interface DashboardAnalyticsResponse {
  timeRange: AnalyticsTimeRange;
  overview: AnalyticsOverview;
  dailyViewsTrend: Array<{date: string; views: number}>;
  deviceStats: DeviceStats[];
  popularPosts: PopularPost[];
}

export interface PostAnalyticsResponse {
  post: {
    _id: string;
    title: string;
    slug: string;
    views: number;
    createdAt: string;
  };
  timeRange: AnalyticsTimeRange;
  overview: {
    totalViews: number;
    uniqueVisitors: number;
    avgTimeOnPage: number | null;
  };
  dailyViews: PageViewData[];
  referrers: Array<{
    referrer: string;
    count: number;
    percentage: number;
  }>;
  deviceBreakdown: DeviceStats[];
}

export interface PageViewAnalyticsResponse {
  timeRange: AnalyticsTimeRange;
  overview: AnalyticsOverview;
  pageViews: PageViewData[];
  deviceBreakdown: DeviceStats[];
  browserBreakdown: BrowserStats[];
  topPages: PopularPage[];
}

// Helper functions
const getSessionId = (): string => {
  let sessionId = localStorage.getItem(SESSION_ID_KEY);
  
  if (!sessionId) {
    sessionId = uuidv4();
    localStorage.setItem(SESSION_ID_KEY, sessionId);
  }
  
  return sessionId;
};

const closeSessionOnUnload = (): void => {
  const sessionId = localStorage.getItem(SESSION_ID_KEY);
  if (sessionId) {
    // Use sendBeacon for more reliable delivery during page unload
    if (navigator.sendBeacon) {
      navigator.sendBeacon(
        `${API_URL}/analytics/session/${sessionId}/close`,
        JSON.stringify({ timestamp: new Date().toISOString() })
      );
    } else {
      // Fallback to synchronous XHR
      const xhr = new XMLHttpRequest();
      xhr.open('PUT', `${API_URL}/analytics/session/${sessionId}/close`, false);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.send(JSON.stringify({ timestamp: new Date().toISOString() }));
    }
  }
};

// API Service
const AnalyticsService = {
  // Initialize analytics tracking
  init: () => {
    // Ensure we have a session ID
    getSessionId();
    
    // Set up event listener for when user leaves the site
    window.addEventListener('beforeunload', closeSessionOnUnload);
    
    // Return cleanup function
    return () => {
      window.removeEventListener('beforeunload', closeSessionOnUnload);
    };
  },
  
  // Track page view
  trackPageView: async (params: PageViewParams): Promise<{id: string}> => {
    try {
      const response = await axios.post(`${API_URL}/analytics/pageview`, {
        ...params,
        sessionId: getSessionId(),
        referrer: params.referrer || document.referrer
      });
      return response.data.data;
    } catch (error) {
      console.error('Error tracking page view:', error);
      return { id: '' };
    }
  },
  
  // Track event
  trackEvent: async (params: EventParams): Promise<{id: string}> => {
    try {
      const response = await axios.post(`${API_URL}/analytics/event`, {
        ...params,
        sessionId: getSessionId()
      });
      return response.data.data;
    } catch (error) {
      console.error('Error tracking event:', error);
      return { id: '' };
    }
  },
  
  // Get dashboard analytics (admin)
  getDashboardAnalytics: async (timeFilter: string = 'week'): Promise<DashboardAnalyticsResponse> => {
    const response = await axios.get(`${API_URL}/analytics/dashboard`, {
      params: { timeFilter }
    });
    return response.data.data;
  },
  
  // Get post analytics (admin)
  getPostAnalytics: async (postId: string, timeFilter: string = 'month'): Promise<PostAnalyticsResponse> => {
    const response = await axios.get(`${API_URL}/analytics/posts/${postId}`, {
      params: { timeFilter }
    });
    return response.data.data;
  },
  
  // Get page view analytics (admin)
  getPageViewAnalytics: async (params: {
    timeFilter?: string;
    startDate?: string;
    endDate?: string;
    page?: string;
    postId?: string;
    groupBy?: 'hour' | 'day' | 'week' | 'month';
  } = {}): Promise<PageViewAnalyticsResponse> => {
    const response = await axios.get(`${API_URL}/analytics/pageviews`, {
      params
    });
    return response.data.data;
  }
};

export default AnalyticsService;
