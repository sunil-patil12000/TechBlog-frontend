import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTheme } from '../../contexts';
import { useLocation } from 'react-router-dom';

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export interface SEOProps {
  title: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  ogType?: 'website' | 'article' | 'product' | 'event';
  canonical?: string;
  noIndex?: boolean;
  breadcrumbs?: BreadcrumbItem[];
  article?: {
    publishedTime?: string;
    modifiedTime?: string;
    expirationTime?: string;
    authors?: {
      name: string;
      website?: string;
    }[];
    tags?: string[];
    section?: string;
  };
  product?: {
    name: string;
    image: string;
    description: string;
    brand?: string;
    offers?: {
      price: number;
      priceCurrency: string;
      availability: string;
    }[];
    aggregateRating?: {
      ratingValue: number;
      reviewCount: number;
    };
  };
  event?: {
    name: string;
    startDate: string;
    endDate?: string;
    location: {
      name: string;
      address: string;
    };
    image?: string;
    description?: string;
    organizer?: {
      name: string;
      url?: string;
    };
  };
  structuredData?: Record<string, any>;
}

const SEO: React.FC<SEOProps> = ({
  title,
  description = 'Your source for the latest tech news, events, and innovations in the technology world.',
  keywords = 'tech news, technology events, tech innovations, digital trends, tech industry',
  ogImage = '/images/og-default.jpg',
  ogType = 'website',
  canonical,
  noIndex = false,
  breadcrumbs = [],
  article,
  product,
  event,
  structuredData,
}) => {
  // Use try/catch to gracefully handle context errors
  let isDark = false;
  try {
    const themeContext = useTheme();
    isDark = themeContext.isDark;
  } catch (error) {
    console.error("Theme context error in SEO component:", error);
    // Continue with default (light) theme
  }
  
  const location = useLocation();
  const siteTitle = title ? `${title} | Tech Blog` : 'Tech Blog - Latest Tech News and Reviews';
  const siteUrl = import.meta.env.VITE_APP_URL || 'https://yourdomain.com';
  const canonicalUrl = canonical ? `${siteUrl}${canonical}` : `${siteUrl}${location.pathname}`;
  
  // Helper to safely handle ogImage
  const getImageUrl = (img: string | undefined) => {
    if (!img) return `${siteUrl}/images/og-default.jpg`;
    return typeof img === 'string' && img.startsWith('http') 
      ? img 
      : `${siteUrl}${img}`;
  };
  
  // Generate breadcrumb structured data
  const generateBreadcrumbSchema = () => {
    if (!breadcrumbs || breadcrumbs.length === 0) return null;
    
    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': breadcrumbs.map((item, index) => ({
        '@type': 'ListItem',
        'position': index + 1,
        'name': item.name,
        'item': `${siteUrl}${item.url}`,
      })),
    };
  };
  
  // Create structured data based on content type
  let contentStructuredData = {};
  
  // Article schema
  if (ogType === 'article' && article) {
    contentStructuredData = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: title.length > 110 ? title.substring(0, 107) + '...' : title, // Max 110 chars for Google
      description: description,
      image: getImageUrl(ogImage),
      ...(article.publishedTime && { datePublished: article.publishedTime }),
      ...(article.modifiedTime && { dateModified: article.modifiedTime }),
      ...(article.expirationTime && { expires: article.expirationTime }),
      ...(article.authors && { 
        author: article.authors.map(author => ({
          '@type': 'Person',
          name: author.name,
          url: author.website,
        }))
      }),
      publisher: {
        '@type': 'Organization',
        name: 'Tech Blog',
        logo: {
          '@type': 'ImageObject',
          url: `${siteUrl}/images/logo.png`,
        }
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': canonicalUrl,
      },
      ...(article.tags && { keywords: article.tags.join(', ') }),
      ...(article.section && { articleSection: article.section }),
    };
  }
  
  // Product schema
  if (ogType === 'product' && product) {
    contentStructuredData = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.name,
      image: getImageUrl(product.image),
      description: product.description,
      ...(product.brand && { 
        brand: {
          '@type': 'Brand',
          name: product.brand
        }
      }),
      ...(product.offers && {
        offers: product.offers.map(offer => ({
          '@type': 'Offer',
          price: offer.price,
          priceCurrency: offer.priceCurrency,
          availability: offer.availability
        }))
      }),
      ...(product.aggregateRating && {
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: product.aggregateRating.ratingValue,
          reviewCount: product.aggregateRating.reviewCount
        }
      })
    };
  }
  
  // Event schema
  if (ogType === 'event' && event) {
    contentStructuredData = {
      '@context': 'https://schema.org',
      '@type': 'Event',
      name: event.name,
      startDate: event.startDate,
      ...(event.endDate && { endDate: event.endDate }),
      location: {
        '@type': 'Place',
        name: event.location.name,
        address: event.location.address
      },
      ...(event.image && { image: getImageUrl(event.image) }),
      ...(event.description && { description: event.description }),
      ...(event.organizer && {
        organizer: {
          '@type': 'Organization',
          name: event.organizer.name,
          ...(event.organizer.url && { url: event.organizer.url })
        }
      })
    };
  }
  
  // Website schema (default)
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Tech Blog',
    url: siteUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${siteUrl}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string'
    }
  };
  
  // Breadcrumb schema
  const breadcrumbSchema = generateBreadcrumbSchema();
  
  // Merge with custom structured data if provided
  const finalStructuredData = structuredData || 
    (Object.keys(contentStructuredData).length > 0 ? contentStructuredData : websiteSchema);

  return (
    <Helmet>
      <title>{siteTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      
      {/* Robots directives */}
      {noIndex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      )}
      
      {/* Canonical URL for SEO */}
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:site_name" content="Tech Blog" />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={getImageUrl(ogImage)} />
      <meta property="og:image:alt" content={`Image for ${title}`} />
      <meta property="og:locale" content="en_US" />
      
      {/* Article specific Open Graph tags */}
      {ogType === 'article' && article?.publishedTime && (
        <meta property="article:published_time" content={article.publishedTime} />
      )}
      {ogType === 'article' && article?.modifiedTime && (
        <meta property="article:modified_time" content={article.modifiedTime} />
      )}
      {ogType === 'article' && article?.section && (
        <meta property="article:section" content={article.section} />
      )}
      {ogType === 'article' && article?.tags && article.tags.map((tag, i) => (
        <meta property="article:tag" content={tag} key={i} />
      ))}
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={getImageUrl(ogImage)} />
      
      {/* Structured Data / JSON-LD */}
      <script type="application/ld+json">
        {JSON.stringify(finalStructuredData)}
      </script>
      
      {/* Add breadcrumb schema if available */}
      {breadcrumbSchema && (
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>
      )}
      
      {/* PWA meta tags */}
      <meta name="theme-color" content={isDark ? '#1A1A1A' : '#FFFFFF'} />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      
      {/* Performance optimizations */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
    </Helmet>
  );
};

export default SEO;
