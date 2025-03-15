import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTheme } from '../../contexts';
import { useLocation } from 'react-router-dom';
import {
  ArticleSchema,
  EventSchema,
  ProductSchema,
  FAQSchema,
  VideoSchema,
  generateArticleSchema,
  generateEventSchema,
  generateProductSchema,
  generateFAQSchema,
  generateVideoSchema,
  generateBreadcrumbSchema,
  formatKeywords,
  truncateText,
  generateCanonicalUrl
} from '../../utils/seo';

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export interface SEOProps {
  title: string;
  description?: string;
  keywords?: string[] | string;
  ogImage?: string;
  ogType?: 'website' | 'article' | 'product' | 'event';
  canonical?: string;
  noIndex?: boolean;
  breadcrumbs?: BreadcrumbItem[];
  article?: ArticleSchema;
  product?: ProductSchema;
  event?: EventSchema;
  faq?: FAQSchema;
  video?: VideoSchema;
  structuredData?: Record<string, any>;
  languageAlternates?: {
    hrefLang: string;
    href: string;
  }[];
  twitter?: {
    cardType?: 'summary' | 'summary_large_image' | 'app' | 'player';
    site?: string;
    creator?: string;
  };
  meta?: Array<{
    name?: string;
    property?: string;
    content: string;
  }>;
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
  faq,
  video,
  structuredData,
  languageAlternates = [],
  twitter = {
    cardType: 'summary_large_image',
    site: '@techblog',
  },
  meta = [],
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
  const canonicalUrl = canonical 
    ? generateCanonicalUrl(canonical) 
    : generateCanonicalUrl(location.pathname);
  
  // Helper to safely handle ogImage
  const getImageUrl = (img: string | undefined) => {
    if (!img) return `${siteUrl}/images/og-default.jpg`;
    return img.startsWith('http') ? img : `${siteUrl}${img}`;
  };
  
  // Format keywords to string if they're in an array
  const keywordsString = formatKeywords(keywords);
  
  // Generate breadcrumb structured data
  const breadcrumbsSchema = breadcrumbs && breadcrumbs.length > 0 
    ? generateBreadcrumbSchema(breadcrumbs)
    : null;
  
  // Website schema (default)
  const websiteSchema = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Tech Blog',
    url: siteUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${siteUrl}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string'
    }
  });
  
  // Determine which schema to use based on the content type
  let contentSchema: string | null = null;
  
  if (article) {
    contentSchema = generateArticleSchema({
      ...article,
      headline: article.headline || title,
      description: article.description || description,
      image: article.image || getImageUrl(ogImage),
    });
  } else if (product) {
    contentSchema = generateProductSchema({
      ...product,
      image: product.image || getImageUrl(ogImage),
    });
  } else if (event) {
    contentSchema = generateEventSchema({
      ...event,
      image: event.image || getImageUrl(ogImage),
      description: event.description || description,
    });
  } else if (faq) {
    contentSchema = generateFAQSchema(faq);
  } else if (video) {
    contentSchema = generateVideoSchema(video);
  }
  
  // Use custom structured data if provided, otherwise use generated schema
  const finalSchema = structuredData ? JSON.stringify(structuredData) : 
    contentSchema || websiteSchema;
  
  // Get all meta tags including custom ones
  const metaTags = [
    { name: 'description', content: description },
    { name: 'keywords', content: keywordsString },
    // Open Graph tags
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:url', content: canonicalUrl },
    { property: 'og:type', content: ogType },
    { property: 'og:image', content: getImageUrl(ogImage) },
    { property: 'og:site_name', content: 'Tech Blog' },
    { property: 'og:locale', content: 'en_US' },
    // Twitter tags
    { name: 'twitter:card', content: twitter.cardType },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: description },
    { name: 'twitter:image', content: getImageUrl(ogImage) },
    ...(twitter.site ? [{ name: 'twitter:site', content: twitter.site }] : []),
    ...(twitter.creator ? [{ name: 'twitter:creator', content: twitter.creator }] : []),
    // Add custom meta tags
    ...meta,
  ];

  return (
    <Helmet>
      <html lang="en" data-theme={isDark ? 'dark' : 'light'} />
      <title>{siteTitle}</title>
      
      {/* Meta tags */}
      {metaTags.map((tag, i) => (
        tag.name 
          ? <meta key={`meta-${i}`} name={tag.name} content={tag.content} />
          : <meta key={`meta-${i}`} property={tag.property} content={tag.content} />
      ))}
      
      {/* Robots directives */}
      {noIndex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      )}
      
      {/* Canonical URL for SEO */}
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Language alternates for international SEO */}
      {languageAlternates.map((alt, index) => (
        <link 
          key={`lang-${index}`} 
          rel="alternate" 
          href={alt.href} 
          hrefLang={alt.hrefLang} 
        />
      ))}
      
      {/* Web App Manifest */}
      <link rel="manifest" href="/manifest.json" />
      
      {/* Preconnect to critical domains */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      
      {/* Core Web Vitals optimizations - preload critical fonts */}
      <link 
        rel="preload" 
        href="/fonts/inter-var.woff2" 
        as="font" 
        type="font/woff2" 
        crossOrigin="anonymous" 
      />
      
      {/* Structured Data / JSON-LD */}
      <script type="application/ld+json">
        {finalSchema}
      </script>
      
      {/* Add breadcrumb schema if available */}
      {breadcrumbsSchema && (
        <script type="application/ld+json">
          {breadcrumbsSchema}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;
