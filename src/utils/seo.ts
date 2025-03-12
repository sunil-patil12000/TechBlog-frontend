import { Article, WithContext } from 'schema-dts';

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
export const generateArticleSchema = (
  {
    title,
    description,
    url,
    imageUrl,
    datePublished,
    dateModified,
    authorName,
    authorUrl,
    publisherName = 'Modern Tech Blog',
    publisherLogoUrl = '/images/logo.png',
  }: {
    title: string;
    description: string;
    url: string;
    imageUrl: string;
    datePublished: string;
    dateModified?: string;
    authorName: string;
    authorUrl?: string;
    publisherName?: string;
    publisherLogoUrl?: string;
  }
): WithContext<Article> => {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description: description,
    image: imageUrl,
    datePublished,
    dateModified: dateModified || datePublished,
    author: {
      '@type': 'Person',
      name: authorName,
      url: authorUrl,
    },
    publisher: {
      '@type': 'Organization',
      name: publisherName,
      logo: {
        '@type': 'ImageObject',
        url: publisherLogoUrl,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
  };
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