import { Article, WithContext } from 'schema-dts';
import { BreadcrumbItem } from '../components/utils/SEO';

export interface SEOProps {
  title: string;
  description?: string;
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: 'website' | 'article';
  twitterCardType?: 'summary' | 'summary_large_image';
  keywords?: string[];
  noIndex?: boolean;
  article?: {
    publishedTime: string;
    modifiedTime?: string;
    author: string;
    tags?: string[];
    section?: string;
  };
}

// Types for structured data
export interface ArticleSchema {
  headline: string;
  description: string;
  image?: string;
  datePublished?: string;
  dateModified?: string;
  author?: {
    name: string;
    url?: string;
  }[];
  publisher?: {
    name: string;
    logo?: string;
  };
  keywords?: string[];
  articleSection?: string;
}

export interface EventSchema {
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
  offers?: {
    price?: number;
    priceCurrency?: string;
    availability?: string;
    validFrom?: string;
  }[];
  eventStatus?: 'EventScheduled' | 'EventCancelled' | 'EventPostponed' | 'EventRescheduled';
  eventAttendanceMode?: 'OfflineEventAttendanceMode' | 'OnlineEventAttendanceMode' | 'MixedEventAttendanceMode';
  performerName?: string;
}

export interface ProductSchema {
  name: string;
  image: string;
  description: string;
  brand?: string;
  sku?: string;
  gtin?: string;
  offers?: {
    price: number;
    priceCurrency: string;
    availability: string;
    url?: string;
    priceValidUntil?: string;
    itemCondition?: string;
    seller?: {
      name: string;
      url?: string;
    };
  }[];
  aggregateRating?: {
    ratingValue: number;
    reviewCount: number;
    bestRating?: number;
  };
  review?: {
    author: string;
    datePublished: string;
    reviewRating: {
      ratingValue: number;
    };
    reviewBody?: string;
  }[];
}

export interface FAQSchema {
  questions: {
    question: string;
    answer: string;
  }[];
}

export interface VideoSchema {
  name: string;
  description: string;
  thumbnailUrl: string;
  uploadDate: string;
  duration?: string; // ISO 8601 format
  contentUrl?: string;
  embedUrl?: string;
}

/**
 * Generates SEO metadata for a page
 */
export const generateSEOMetadata = ({
  title,
  description,
  canonicalUrl,
  ogImage = '/images/default-og-image.jpg',
  ogType = 'website',
  twitterCardType = 'summary_large_image',
  keywords = [],
  noIndex = false,
  article,
}: SEOProps) => {
  // Ensure title is not too long for search engines (generally under 60 chars)
  const truncatedTitle = title.length > 60 ? `${title.substring(0, 57)}...` : title;
  
  // Ensure description is not too long for search engines (generally under 160 chars)
  const truncatedDescription = description && description.length > 160 
    ? `${description.substring(0, 157)}...` 
    : description;
  
  return {
    title: truncatedTitle,
    meta: [
      { name: 'description', content: truncatedDescription },
      
      // Open Graph
      { property: 'og:title', content: truncatedTitle },
      { property: 'og:description', content: truncatedDescription },
      { property: 'og:type', content: ogType },
      { property: 'og:image', content: ogImage },
      { property: 'og:site_name', content: 'Modern Tech Blog' },
      
      // Twitter
      { name: 'twitter:card', content: twitterCardType },
      { name: 'twitter:title', content: truncatedTitle },
      { name: 'twitter:description', content: truncatedDescription },
      { name: 'twitter:image', content: ogImage },
      
      // Keywords
      ...(keywords.length > 0 ? [{ name: 'keywords', content: keywords.join(', ') }] : []),
      
      // Robots
      ...(noIndex ? [{ name: 'robots', content: 'noindex, nofollow' }] : []),
      
      // Article metadata
      ...(article && ogType === 'article' ? [
        { property: 'article:published_time', content: article.publishedTime },
        ...(article.modifiedTime ? [{ property: 'article:modified_time', content: article.modifiedTime }] : []),
        { property: 'article:author', content: article.author },
        ...(article.section ? [{ property: 'article:section', content: article.section }] : []),
        ...(article.tags?.map(tag => ({ property: 'article:tag', content: tag })) || []),
      ] : []),
    ],
    link: [
      ...(canonicalUrl ? [{ rel: 'canonical', href: canonicalUrl }] : []),
    ],
  };
};

/**
 * Generates JSON-LD structured data for a blog article
 */
export const generateArticleSchema = (article: ArticleSchema): string => {
  return generateStructuredData('Article', {
    headline: truncateText(article.headline, 110), // Max 110 chars for Google
    description: article.description,
    image: article.image,
    datePublished: article.datePublished,
    dateModified: article.dateModified || article.datePublished,
    author: article.author?.map(a => ({
      '@type': 'Person',
      name: a.name,
      url: a.url,
    })),
    publisher: article.publisher && {
      '@type': 'Organization',
      name: article.publisher.name,
      logo: article.publisher.logo && {
        '@type': 'ImageObject',
        url: article.publisher.logo,
      },
    },
    keywords: article.keywords?.join(', '),
    articleSection: article.articleSection,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': generateCanonicalUrl(`/blog/${article.headline.toLowerCase().replace(/[^\w]+/g, '-')}`),
    },
  });
};

/**
 * Generates JSON-LD structured data for an event
 */
export const generateEventSchema = (event: EventSchema): string => {
  return generateStructuredData('Event', {
    name: event.name,
    startDate: event.startDate,
    endDate: event.endDate,
    location: {
      '@type': 'Place',
      name: event.location.name,
      address: event.location.address,
    },
    image: event.image,
    description: event.description,
    organizer: event.organizer && {
      '@type': 'Organization',
      name: event.organizer.name,
      url: event.organizer.url,
    },
    offers: event.offers?.map(offer => ({
      '@type': 'Offer',
      price: offer.price,
      priceCurrency: offer.priceCurrency,
      availability: offer.availability,
      validFrom: offer.validFrom,
    })),
    eventStatus: event.eventStatus && `https://schema.org/${event.eventStatus}`,
    eventAttendanceMode: event.eventAttendanceMode && `https://schema.org/${event.eventAttendanceMode}`,
    performer: event.performerName && {
      '@type': 'Person',
      name: event.performerName,
    },
  });
};

/**
 * Generates JSON-LD structured data for a product review
 */
export const generateProductSchema = (product: ProductSchema): string => {
  return generateStructuredData('Product', {
    name: product.name,
    image: product.image,
    description: product.description,
    brand: product.brand && {
      '@type': 'Brand',
      name: product.brand,
    },
    sku: product.sku,
    gtin: product.gtin,
    offers: product.offers?.map(offer => ({
      '@type': 'Offer',
      price: offer.price,
      priceCurrency: offer.priceCurrency,
      availability: offer.availability && `https://schema.org/${offer.availability}`,
      url: offer.url,
      priceValidUntil: offer.priceValidUntil,
      itemCondition: offer.itemCondition && `https://schema.org/${offer.itemCondition}`,
      seller: offer.seller && {
        '@type': 'Organization',
        name: offer.seller.name,
        url: offer.seller.url,
      },
    })),
    aggregateRating: product.aggregateRating && {
      '@type': 'AggregateRating',
      ratingValue: product.aggregateRating.ratingValue,
      reviewCount: product.aggregateRating.reviewCount,
      bestRating: product.aggregateRating.bestRating || 5,
    },
    review: product.review?.map(r => ({
      '@type': 'Review',
      author: {
        '@type': 'Person',
        name: r.author,
      },
      datePublished: r.datePublished,
      reviewRating: {
        '@type': 'Rating',
        ratingValue: r.reviewRating.ratingValue,
      },
      reviewBody: r.reviewBody,
    })),
  });
};

/**
 * Generates JSON-LD structured data for FAQ pages
 */
export const generateFAQSchema = (faq: FAQSchema): string => {
  return generateStructuredData('FAQPage', {
    mainEntity: faq.questions.map(q => ({
      '@type': 'Question',
      name: q.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: q.answer,
      },
    })),
  });
};

/**
 * Generates JSON-LD structured data for Video content
 */
export const generateVideoSchema = (video: VideoSchema): string => {
  return generateStructuredData('VideoObject', {
    name: video.name,
    description: video.description,
    thumbnailUrl: video.thumbnailUrl,
    uploadDate: video.uploadDate,
    duration: video.duration,
    contentUrl: video.contentUrl,
    embedUrl: video.embedUrl,
  });
};

/**
 * Generates breadcrumb structured data from breadcrumb items
 */
export const generateBreadcrumbSchema = (breadcrumbs: BreadcrumbItem[]): string => {
  if (!breadcrumbs || breadcrumbs.length === 0) return '';
  
  return generateStructuredData('BreadcrumbList', {
    itemListElement: breadcrumbs.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: generateCanonicalUrl(item.url),
    })),
  });
};

/**
 * Formats keywords for SEO optimization
 */
export const formatKeywords = (keywords: string[] | string): string => {
  if (Array.isArray(keywords)) {
    return keywords.join(', ');
  }
  return keywords;
};

/**
 * Extract primary keyword from a list of keywords
 */
export const getPrimaryKeyword = (keywords: string[] | string): string => {
  if (Array.isArray(keywords) && keywords.length > 0) {
    return keywords[0];
  }
  if (typeof keywords === 'string') {
    return keywords.split(',')[0].trim();
  }
  return '';
};

/**
 * Calculates read time in minutes for an article
 */
export const calculateReadTime = (text: string): number => {
  const wordsPerMinute = 200;
  const wordCount = text.trim().split(/\s+/).length;
  const readTime = Math.ceil(wordCount / wordsPerMinute);
  return readTime > 0 ? readTime : 1;
};

/**
 * Generates a slug from a string
 */
export const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-')     // Replace spaces with hyphens
    .replace(/-+/g, '-')      // Replace multiple hyphens with single hyphen
    .trim();
};

/**
 * Lazy loads images with blur-up effect
 */
export const blurUpImage = (src: string, placeholderSize = 10): string => {
  // This is a placeholder implementation
  // In a real implementation, you'd use a server-side API to generate a tiny placeholder
  return `${src}?width=${placeholderSize}&quality=10`;
};

// SEO Helper functions
export const truncateText = (text: string, maxLength: number): string => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
};

export const generateCanonicalUrl = (path: string): string => {
  const siteUrl = import.meta.env.VITE_APP_URL || 'https://yourdomain.com';
  // Remove trailing slash from site URL if it exists
  const baseUrl = siteUrl.endsWith('/') ? siteUrl.slice(0, -1) : siteUrl;
  // Ensure path starts with a slash
  const formattedPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${formattedPath}`;
};

export const generateStructuredData = <T extends object>(type: string, data: T): string => {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': type,
    ...data,
  };
  return JSON.stringify(structuredData);
}; 