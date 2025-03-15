# SEO Tools for Modern Tech Blog

This document provides an overview of the SEO tools and features implemented in the Modern Tech Blog project to help improve search engine visibility, performance, and user experience.

## Table of Contents

1. [Core Web Vitals Monitoring](#core-web-vitals-monitoring)
2. [Structured Data Validation](#structured-data-validation)
3. [Image Optimization](#image-optimization)
4. [Sitemap Generation](#sitemap-generation)
5. [SEO Best Practices](#seo-best-practices)
6. [Performance Optimization](#performance-optimization)

## Core Web Vitals Monitoring

The blog includes a custom `useWebVitals` hook and a `WebVitalsDisplay` component to monitor and display Core Web Vitals metrics in real-time:

- **LCP (Largest Contentful Paint)**: Measures loading performance
- **FID (First Input Delay)**: Measures interactivity
- **CLS (Cumulative Layout Shift)**: Measures visual stability
- **FCP (First Contentful Paint)**: Measures when the first content appears
- **TTFB (Time to First Byte)**: Measures server response time
- **INP (Interaction to Next Paint)**: Measures responsiveness

### Usage

```tsx
import { useWebVitals } from '../hooks/useWebVitals';

const MyComponent = () => {
  const { metrics, isLoading, getMetricColor, getMetricRating } = useWebVitals();
  
  // Use the metrics in your component
  console.log(metrics.LCP); // Largest Contentful Paint in ms
};
```

You can also use the pre-built `WebVitalsDisplay` component to show a user-friendly dashboard:

```tsx
import WebVitalsDisplay from '../components/WebVitalsDisplay';

const MyPage = () => {
  return (
    <div>
      <h1>Performance Metrics</h1>
      <WebVitalsDisplay />
    </div>
  );
};
```

## Structured Data Validation

The blog includes tools for validating structured data (JSON-LD) against Schema.org requirements:

### Validation Scripts

- **validate-schema.js**: A comprehensive validator with external dependencies
- **validate-schema-simple.js**: A simplified validator with no external dependencies

### Example Usage

```bash
# Validate a specific file
npm run seo:validate-schema:simple ./public/example-schemas/article.json

# Validate all schemas in a directory
npm run seo:validate-schema -- --dir=./public

# Validate a URL
npm run seo:validate-schema:url -- --url=https://yourdomain.com
```

### Example Schema Types

The `/public/example-schemas/` directory contains examples of properly formatted schemas:

- Article
- Product
- FAQ
- Event
- Breadcrumbs

## Image Optimization

The `optimize-images.js` script optimizes images for web performance:

- Converts images to modern formats (WebP, AVIF)
- Resizes images for different viewport sizes
- Compresses images to reduce file size
- Generates responsive image markup

### Usage

```bash
# Optimize all images in the project
npm run images:optimize

# Optimize images with custom quality
npm run images:optimize -- --quality=80

# Optimize images in a specific directory
npm run images:optimize -- --dir=./public/images
```

## Sitemap Generation

The blog includes scripts for generating and updating XML sitemaps:

- **generate-sitemap.ts**: Generates a sitemap with static and dynamic routes
- **update-sitemap.js**: Updates the domain in the sitemap after generation

### Usage

```bash
# Generate a sitemap
npm run generate-sitemap

# Update the domain in the sitemap
npm run update-sitemap-domain
```

## SEO Best Practices

The blog implements several SEO best practices:

### Meta Tags

- Title and description tags for all pages
- Open Graph and Twitter Card meta tags
- Canonical URLs
- Robots meta tags

### Robots.txt

A comprehensive `robots.txt` file is included with:

- Crawl directives for search engines
- Sitemap location
- Disallow rules for admin and private pages

### Semantic HTML

- Proper heading hierarchy (h1, h2, h3, etc.)
- Semantic elements (article, section, nav, etc.)
- Accessible markup with ARIA attributes

## Performance Optimization

The blog includes several performance optimizations:

### Build Optimizations

- Code splitting and lazy loading
- CSS and JavaScript minification
- Tree shaking
- Image optimization

### Runtime Optimizations

- Lazy loading of images and components
- Preloading of critical resources
- Caching strategies
- Font optimization

## Running SEO Audits

The blog includes scripts for running comprehensive SEO audits:

```bash
# Run a full SEO audit
npm run seo:audit-full

# Check Core Web Vitals
npm run check:cwv

# Check SEO with Lighthouse
npm run check:seo
```

## Contributing

When contributing to the blog, please ensure that:

1. All pages have proper meta tags
2. Images include alt text and are optimized
3. Structured data is valid
4. Core Web Vitals are not negatively impacted

## License

This project is licensed under the MIT License - see the LICENSE file for details. 