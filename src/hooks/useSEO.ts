import { Helmet } from 'react-helmet-async';

export const useSEO = (metadata: {
  title: string;
  description: string;
  slug: string;
  type?: 'article' | 'website';
  image?: string;
}) => {
  return (
    <Helmet>
      <title>{metadata.title}</title>
      <meta name="description" content={metadata.description} />
      
      {/* Open Graph */}
      <meta property="og:title" content={metadata.title} />
      <meta property="og:description" content={metadata.description} />
      <meta property="og:type" content={metadata.type || 'website'} />
      <meta property="og:url" content={`https://yourdomain.com${metadata.slug}`} />
      {metadata.image && <meta property="og:image" content={metadata.image} />}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={metadata.title} />
      <meta name="twitter:description" content={metadata.description} />
      {metadata.image && <meta name="twitter:image" content={metadata.image} />}

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "TechBlog",
          "url": "https://yourdomain.com",
          "potentialAction": {
            "@type": "SearchAction",
            "target": "https://yourdomain.com/search?q={search_term_string}",
            "query-input": "required name=search_term_string"
          }
        })}
      </script>
    </Helmet>
  );
}; 