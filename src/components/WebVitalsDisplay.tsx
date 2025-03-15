import React from 'react';
import { useWebVitals } from '../hooks/useWebVitals';
import { Box, Typography, CircularProgress, Paper, Grid, Tooltip } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';

/**
 * Component that displays Core Web Vitals metrics in a user-friendly format
 * Uses the useWebVitals hook to track and display real-time performance metrics
 */
const WebVitalsDisplay: React.FC = () => {
  const { metrics, isLoading, getMetricColor, getMetricRating } = useWebVitals();

  // Descriptions for each metric
  const metricDescriptions = {
    LCP: 'Largest Contentful Paint measures when the largest content element becomes visible. Good is < 2.5s.',
    FID: 'First Input Delay measures responsiveness to user interactions. Good is < 100ms.',
    CLS: 'Cumulative Layout Shift measures visual stability. Good is < 0.1.',
    FCP: 'First Contentful Paint measures when the first content appears. Good is < 1.8s.',
    TTFB: 'Time To First Byte measures server response time. Good is < 0.8s.',
    INP: 'Interaction to Next Paint measures responsiveness. Good is < 200ms.',
  };

  // Format the metric value for display
  const formatMetricValue = (metric: string, value: number | null): string => {
    if (value === null) return 'N/A';
    
    switch (metric) {
      case 'LCP':
      case 'FCP':
      case 'TTFB':
        return `${(value / 1000).toFixed(2)}s`;
      case 'FID':
      case 'INP':
        return `${value.toFixed(0)}ms`;
      case 'CLS':
        return value.toFixed(3);
      default:
        return `${value}`;
    }
  };

  // Calculate a percentage for the circular progress
  const calculatePercentage = (metric: string, value: number | null): number => {
    if (value === null) return 0;
    
    switch (metric) {
      case 'LCP':
        // 0-2.5s is good (100-0%), 2.5-4s is needs improvement (0-100%), >4s is poor (0%)
        return value < 2500 ? 100 - (value / 2500 * 100) : value < 4000 ? 0 : 0;
      case 'FID':
        // 0-100ms is good (100-0%), 100-300ms is needs improvement (0-100%), >300ms is poor (0%)
        return value < 100 ? 100 - (value / 100 * 100) : value < 300 ? 0 : 0;
      case 'CLS':
        // 0-0.1 is good (100-0%), 0.1-0.25 is needs improvement (0-100%), >0.25 is poor (0%)
        return value < 0.1 ? 100 - (value / 0.1 * 100) : value < 0.25 ? 0 : 0;
      case 'FCP':
        // 0-1.8s is good (100-0%), 1.8-3s is needs improvement (0-100%), >3s is poor (0%)
        return value < 1800 ? 100 - (value / 1800 * 100) : value < 3000 ? 0 : 0;
      case 'TTFB':
        // 0-0.8s is good (100-0%), 0.8-1.8s is needs improvement (0-100%), >1.8s is poor (0%)
        return value < 800 ? 100 - (value / 800 * 100) : value < 1800 ? 0 : 0;
      case 'INP':
        // 0-200ms is good (100-0%), 200-500ms is needs improvement (0-100%), >500ms is poor (0%)
        return value < 200 ? 100 - (value / 200 * 100) : value < 500 ? 0 : 0;
      default:
        return 0;
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
        <Typography variant="body1" sx={{ ml: 2 }}>
          Loading Web Vitals metrics...
        </Typography>
      </Box>
    );
  }

  return (
    <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Core Web Vitals
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Real-time performance metrics for this page
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {Object.entries(metrics).map(([metric, value]) => (
          <Grid item xs={12} sm={6} md={4} key={metric}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                p: 2,
                borderRadius: 1,
                bgcolor: 'background.paper',
                boxShadow: 1,
              }}
            >
              <Box sx={{ position: 'relative', display: 'inline-flex', mb: 1 }}>
                <CircularProgress
                  variant="determinate"
                  value={calculatePercentage(metric, value)}
                  size={80}
                  thickness={4}
                  sx={{ color: getMetricColor(metric, value) }}
                />
                <Box
                  sx={{
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    position: 'absolute',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography variant="caption" component="div" color="text.secondary">
                    {getMetricRating(metric, value)}
                  </Typography>
                </Box>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                <Typography variant="h6" component="div">
                  {metric}
                </Typography>
                <Tooltip title={metricDescriptions[metric as keyof typeof metricDescriptions] || ''}>
                  <InfoIcon fontSize="small" sx={{ ml: 0.5, color: 'text.secondary' }} />
                </Tooltip>
              </Box>
              
              <Typography
                variant="body1"
                component="div"
                sx={{ color: getMetricColor(metric, value) }}
              >
                {formatMetricValue(metric, value)}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
};

export default WebVitalsDisplay; 