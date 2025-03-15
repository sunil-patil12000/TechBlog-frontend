import { useEffect, useState } from 'react';
import { 
  getCLS, 
  getFID, 
  getLCP, 
  getFCP, 
  getTTFB, 
  onCLS,
  onFCP,
  onFID,
  onLCP,
  onTTFB,
  CLSMetric,
  FCPMetric,
  FIDMetric,
  LCPMetric,
  TTFBMetric,
  Metric
} from 'web-vitals';

export type WebVitalsMetrics = {
  cls?: CLSMetric;
  fcp?: FCPMetric;
  fid?: FIDMetric;
  lcp?: LCPMetric;
  ttfb?: TTFBMetric;
};

type ReportHandler = (metric: Metric) => void;

/**
 * Custom hook to track Core Web Vitals metrics
 * @param reportToAnalytics - Optional function to report metrics to analytics service
 * @returns Web Vitals metrics values
 * 
 * Usage:
 * ```
 * const { metrics, isLoaded } = useWebVitals((metric) => {
 *   // Report to analytics
 *   console.log(metric.name, metric.value);
 * });
 * 
 * if (isLoaded) {
 *   console.log('LCP:', metrics.lcp?.value);
 * }
 * ```
 */
export const useWebVitals = (reportToAnalytics?: ReportHandler) => {
  const [metrics, setMetrics] = useState<WebVitalsMetrics>({});
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Create a handler for collecting metrics
    const handleMetric = (metric: Metric) => {
      // Update the state with the new metric
      setMetrics(prevMetrics => ({
        ...prevMetrics,
        [metric.name.toLowerCase()]: metric,
      }));

      // Report to analytics if provided
      if (reportToAnalytics) {
        reportToAnalytics(metric);
      }
    };

    // Register metrics
    onCLS(handleMetric);
    onFID(handleMetric);
    onLCP(handleMetric);
    onFCP(handleMetric);
    onTTFB(handleMetric);

    // Get initial values
    Promise.all([
      getCLS(),
      getFID(),
      getLCP(),
      getFCP(),
      getTTFB(),
    ]).then(([cls, fid, lcp, fcp, ttfb]) => {
      setMetrics({
        cls,
        fid,
        lcp,
        fcp,
        ttfb,
      });
      setIsLoaded(true);
    });

    // No cleanup needed as web-vitals listeners are passive
  }, [reportToAnalytics]);

  /**
   * Get a color based on the metric value (good, needs improvement, poor)
   */
  const getMetricColor = (name: string, value: number): string => {
    switch (name) {
      case 'LCP':
        return value <= 2500 ? 'green' : value <= 4000 ? 'orange' : 'red';
      case 'FID':
        return value <= 100 ? 'green' : value <= 300 ? 'orange' : 'red';
      case 'CLS':
        return value <= 0.1 ? 'green' : value <= 0.25 ? 'orange' : 'red';
      case 'FCP':
        return value <= 1800 ? 'green' : value <= 3000 ? 'orange' : 'red';
      case 'TTFB':
        return value <= 800 ? 'green' : value <= 1800 ? 'orange' : 'red';
      default:
        return 'gray';
    }
  };

  /**
   * Get a rating label based on the metric value
   */
  const getMetricRating = (name: string, value: number): string => {
    switch (name) {
      case 'LCP':
        return value <= 2500 ? 'good' : value <= 4000 ? 'needs-improvement' : 'poor';
      case 'FID':
        return value <= 100 ? 'good' : value <= 300 ? 'needs-improvement' : 'poor';
      case 'CLS':
        return value <= 0.1 ? 'good' : value <= 0.25 ? 'needs-improvement' : 'poor';
      case 'FCP':
        return value <= 1800 ? 'good' : value <= 3000 ? 'needs-improvement' : 'poor';
      case 'TTFB':
        return value <= 800 ? 'good' : value <= 1800 ? 'needs-improvement' : 'poor';
      default:
        return 'unknown';
    }
  };

  return { 
    metrics, 
    isLoaded,
    getMetricColor,
    getMetricRating
  };
};

/**
 * Report web vitals metrics to Google Analytics
 */
export const sendToGoogleAnalytics = (metric: Metric) => {
  // Check if GA is available
  const analyticsDataLayer = (window as any).dataLayer;
  if (!analyticsDataLayer) return;

  // Construct the metric data
  const eventName = 'web-vitals';
  const eventParams = {
    value: Math.round(metric.value), // round to the nearest integer
    name: metric.name,
    id: metric.id, // unique ID for the metric
    delta: Math.round(metric.delta), // amount changed since last report
    valueLabel: metric.name === 'CLS' ? metric.value.toFixed(2) : `${Math.round(metric.value)}ms`,
    actionType: 'web-vitals',
  };

  // Send to GA via dataLayer
  analyticsDataLayer.push({
    event: eventName,
    ...eventParams,
  });
};

export default useWebVitals; 