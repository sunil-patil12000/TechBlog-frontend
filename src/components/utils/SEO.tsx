import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTheme } from '../../contexts';

interface SEOProps {
  title: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  ogType?: 'website' | 'article';
  canonical?: string;
  article?: {
    publishedTime?: string;
    modifiedTime?: string;
    authors?: {
      name: string;
      website?: string;
    }[];
    tags?: string[];
    section?: string;
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
  article,
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
  
  const siteTitle = title ? `${title} | BlogFolio` : 'BlogFolio';
  const siteUrl = 'https://www.yourblogsite.com';
  const canonicalUrl = canonical ? `${siteUrl}${canonical}` : undefined;
  
  // Helper to safely handle ogImage
  const getImageUrl = (img: any) => {
    return typeof img === 'string' && img.startsWith('http') 
      ? img 
      : `${siteUrl}${img || ''}`;
  };
  
  // Create structured data for articles if needed
  let articleStructuredData = {};
  
  if (ogType === 'article' && article) {
    articleStructuredData = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: title,
      description: description,
      image: getImageUrl(ogImage),
      ...(article.publishedTime && { datePublished: article.publishedTime }),
      ...(article.modifiedTime && { dateModified: article.modifiedTime }),
      ...(article.authors && { 
        author: article.authors.map(author => ({
          '@type': 'Person',
          name: author.name,
          url: author.website,
        }))
      }),
      publisher: {
        '@type': 'Organization',
        name: 'BlogFolio',
        logo: {
          '@type': 'ImageObject',
          url: `${siteUrl}/images/logo.png`,
        }
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': canonicalUrl || siteUrl,
      },
    };
  }
  
  // Merge with custom structured data if provided
  const finalStructuredData = structuredData || articleStructuredData;

  // Generate JSON-LD schema
  const generateSchema = () => {
    const baseSchema = {
      '@context': 'https://schema.org',
      '@type': ogType === 'article' ? 'Article' : 'WebSite',
      url: canonicalUrl || siteUrl,
      headline: title,
      description: description,
      image: getImageUrl(ogImage),
    };

    if (ogType === 'article' && article) {
      return {
        ...baseSchema,
        datePublished: article.publishedTime,
        dateModified: article.modifiedTime || article.publishedTime,
        author: article.authors?.map(author => ({
          '@type': 'Person',
          name: author.name,
          url: author.website,
        })),
        keywords: article.tags?.join(', '),
        articleSection: article.section,
      };
    }

    return baseSchema;
  };

  return (
    <Helmet>
      <title>{siteTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      
      {/* Canonical URL for SEO */}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      
      {/* Open Graph / Facebook */}
      <meta property="og:site_name" content="BlogFolio" />
      <meta property="og:url" content={canonicalUrl || siteUrl} />
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
      {Object.keys(finalStructuredData).length > 0 && (
        <script type="application/ld+json">
          {JSON.stringify(finalStructuredData)}
        </script>
      )}
      
      {/* Schema.org JSON-LD */}
      <script type="application/ld+json">
        {JSON.stringify(generateSchema())}
      </script>
      
      {/* PWA meta tags */}
      <meta name="theme-color" content={isDark ? '#1A1A1A' : '#FFFFFF'} />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
    </Helmet>
  );
};

export default SEO;
