import { useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import AnalyticsService, { PageViewParams, EventParams } from '../services/analytics';

// Extend Window interface to include postData property
declare global {
  interface Window {
    postData?: {
      _id: string;
      [key: string]: any;
    };
  }
}

// Types for analytics events
type EventName = string;

interface EventObject {
  type?: string;
  category?: string;
  action?: string;
  label?: string;
  page?: string;
  path?: string;
  value?: number;
  [key: string]: any;
}

// Optional props for analytics initialization
interface AnalyticsOptions {
  trackPageView?: boolean;
  trackTimeOnPage?: boolean;
  pageViewData?: Record<string, any>;
}

/**
 * Custom hook for tracking analytics events
 */
const useAnalytics = (options: AnalyticsOptions = {}) => {
  const { trackPageView = false, trackTimeOnPage = false, pageViewData = {} } = options;
  const location = useLocation();
  const pageViewSent = useRef(false);
  const startTime = useRef(Date.now());
  
  // Initialize analytics service
  useEffect(() => {
    const cleanup = AnalyticsService.init();
    return cleanup;
  }, []);
  
  // Track page view on mount or route change
  useEffect(() => {
    if (trackPageView && !pageViewSent.current) {
      // Get post ID from window if it exists (attached by post pages)
      const postData = (window as any).postData || {};
      
      // Send page view event
      const eventData: PageViewParams = {
        page: document.title || 'Unknown Page',
        path: location.pathname,
        postId: postData._id,
        referrer: document.referrer || '',
        ...pageViewData
      };
      
      try {
        // Send to analytics service
        console.log('Page view:', eventData);
        
        // Actually send to analytics service
        AnalyticsService.trackPageView(eventData)
          .then(result => {
            if (result.id) {
              console.log('Page view tracked successfully:', result.id);
            }
          });
        
        pageViewSent.current = true;
      } catch (error) {
        console.error('Error tracking page view:', error);
      }
    }
    
    // Reset time tracking on route change
    if (trackTimeOnPage) {
      startTime.current = Date.now();
    }
    
    // Track time on page when component unmounts or route changes
    return () => {
      if (trackTimeOnPage) {
        const timeOnPage = Math.floor((Date.now() - startTime.current) / 1000);
        
        if (timeOnPage > 2) { // Only track if user spent more than 2 seconds
          try {
            console.log('Time on page:', { 
              page: location.pathname, 
              seconds: timeOnPage 
            });
            
            // Track time on page as an event
            AnalyticsService.trackEvent({
              type: 'engagement',
              category: 'time',
              action: 'time_on_page',
              label: `${timeOnPage}s`,
              value: timeOnPage,
              page: document.title || 'Unknown Page',
              path: location.pathname
            });
          } catch (error) {
            console.error('Error tracking time on page:', error);
          }
        }
      }
    };
  }, [location, trackPageView, trackTimeOnPage, pageViewData]);
  
  /**
   * Track a custom event
   * @param eventNameOrObject Either an event name (string) or an event object with properties
   * @param eventData Optional data to include with the event (used when eventNameOrObject is a string)
   */
  const trackEvent = useCallback((eventNameOrObject: EventName | EventObject, eventData: Record<string, any> = {}) => {
    try {
      // Handle both string event names and object-based event data
      if (typeof eventNameOrObject === 'string') {
        // Handle string event name with separate data object
        const eventName = eventNameOrObject;
        console.log('Event:', eventName, eventData);
        
        // Prepare the event parameter object
        const params: EventParams = {
          type: eventData.type || 'custom',
          category: eventData.category || 'general',
          action: eventName,
          label: eventData.label,
          value: eventData.value,
          page: document.title || 'Unknown Page',
          path: window.location.pathname,
          postId: (window as any).postData?._id,
          ...eventData
        };
        
        // Send to analytics service
        AnalyticsService.trackEvent(params)
          .then(result => {
            if (result.id) {
              console.log('Event tracked successfully:', result.id);
            }
          });
      } else {
        // Handle object-based event data
        const eventObject = eventNameOrObject;
        const eventName = eventObject.action || 'custom_event';
        
        console.log('Event:', eventName, eventObject);
        
        // Prepare the event parameter object
        const params: EventParams = {
          type: eventObject.type || 'custom',
          category: eventObject.category || 'general',
          action: eventName,
          label: eventObject.label,
          value: eventObject.value,
          page: document.title || 'Unknown Page',
          path: window.location.pathname,
          postId: (window as any).postData?._id,
          ...eventObject
        };
        
        // Send to analytics service
        AnalyticsService.trackEvent(params)
          .then(result => {
            if (result.id) {
              console.log('Event tracked successfully:', result.id);
            }
          });
      }
    } catch (error) {
      console.error('Error tracking event:', error);
    }
  }, []);
  
  return { trackEvent };
};

export default useAnalytics; 