# Analytics Integration Guide

This guide explains how to implement analytics tracking in various components of the blog application.

## Basic Integration with useAnalytics Hook

The `useAnalytics` hook makes it easy to add tracking to any component:

```tsx
import useAnalytics from '../hooks/useAnalytics';

const MyComponent = () => {
  const { trackEvent, trackPageView } = useAnalytics({
    // Automatically track page view when component mounts
    trackPageView: true,
    
    // Track time spent on page when component unmounts
    trackTimeOnPage: true,
    
    // Additional data for page view tracking
    pageViewData: {
      page: 'My Page Name',
      // Other fields can be provided as needed
    }
  });

  // Component logic...
  
  return (
    // JSX...
  );
};
```

## Tracking User Interactions

You can track various user interactions using the `trackEvent` function:

```tsx
const handleButtonClick = () => {
  trackEvent({
    type: 'click',           // Event type (click, scroll, engagement, etc.)
    category: 'conversion',  // Event category
    action: 'signup-click',  // Event action
    label: 'hero-section',   // Optional label for better context
    value: 1,                // Optional numeric value
    page: 'Landing Page',    // Page where the event occurred
    path: window.location.pathname  // Current URL path
  });
  
  // Your existing button logic
};
```

## Common Event Types to Track

### 1. Page Views

Automatically tracked when using `trackPageView: true` in the hook options.

### 2. Click Events

Track when users click on important elements:

```tsx
<button 
  onClick={() => {
    trackEvent({
      type: 'click',
      category: 'navigation',
      action: 'menu-click',
      label: 'hamburger-menu'
    });
    toggleMenu();
  }}
>
  Menu
</button>
```

### 3. Scroll Depth

Track how far users scroll down a page:

```tsx
useEffect(() => {
  const handleScroll = () => {
    const scrollPosition = window.scrollY;
    const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercentage = (scrollPosition / documentHeight) * 100;
    
    // Track when user reaches 50% of the page
    if (scrollPercentage >= 50 && !sessionStorage.getItem('scroll-50')) {
      trackEvent({
        type: 'scroll',
        category: 'engagement',
        action: 'scroll-depth',
        label: 'reached-50-percent'
      });
      sessionStorage.setItem('scroll-50', 'true');
    }
  };
  
  window.addEventListener('scroll', handleScroll);
  return () => window.removeEventListener('scroll', handleScroll);
}, [trackEvent]);
```

### 4. Form Submissions

Track form submissions and conversions:

```tsx
const handleSubmit = (e) => {
  e.preventDefault();
  
  trackEvent({
    type: 'conversion',
    category: 'form',
    action: 'submit',
    label: 'contact-form'
  });
  
  // Form submission logic
};
```

### 5. Content Engagement

Track interactions with content:

```tsx
<button
  onClick={() => {
    trackEvent({
      type: 'engagement',
      category: 'content',
      action: 'like',
      label: `post-${postId}`,
      value: 1
    });
    likePost(postId);
  }}
>
  Like
</button>
```

## Tracking Post-Specific Data

For blog posts, set the post ID in the window object:

```tsx
useEffect(() => {
  if (post?.id) {
    window.postData = { _id: post.id };
  }
  
  return () => {
    delete window.postData;
  };
}, [post?.id]);
```

This allows the `useAnalytics` hook to automatically include the post ID in tracking data.

## Best Practices

1. **Be Consistent**: Use consistent event types, categories, and actions across the application
2. **Don't Over-Track**: Focus on meaningful interactions rather than tracking everything
3. **Use Descriptive Labels**: Make sure event labels provide useful context
4. **Group Related Events**: Use the category field to group related events
5. **Include Context**: Always include page context where the event occurred
6. **Handle Errors Gracefully**: Make sure tracking errors don't break the application

## Event Naming Conventions

### Event Types
- `click`: User clicked on an element
- `scroll`: User scrolled to a specific depth
- `engagement`: User engaged with content (commenting, liking, etc.)
- `conversion`: User completed a valuable action (signup, purchase, etc.)
- `navigation`: User navigated to a different page or section
- `search`: User performed a search
- `error`: User encountered an error

### Event Categories
- `navigation`: Menu, pagination, links
- `content`: Blog posts, articles, images
- `form`: Contact forms, signup forms, etc.
- `social`: Social media sharing, likes, etc.
- `search`: Search actions and results
- `ecommerce`: Shopping cart, purchases, etc.
- `error`: Application errors and exceptions

## Testing Analytics Implementation

You can add debug logging to verify tracking is working correctly:

```tsx
// In your useAnalytics.ts file
const trackEvent = useCallback(async (params: Partial<EventParams>) => {
  console.log('🔍 Tracking event:', params);
  
  // Rest of the tracking logic...
}, []);
```

## Common Integration Points

Here are common places to integrate analytics tracking:

- **Layout components**: Track page views
- **Navigation components**: Track menu interactions
- **Blog posts**: Track content engagement and scroll depth
- **Comment sections**: Track social interactions
- **Search components**: Track search behavior
- **Forms**: Track form submissions and conversions
- **Error pages**: Track application errors 