# SEO Guidelines for Tech Blog

This document outlines the SEO implementation and best practices for maintaining optimal search engine visibility and rankings.

## Technical SEO Implementation

### Static Site Generation (SSG)

The blog uses Vite's SSG capabilities to pre-render all blog posts and critical pages into static HTML:

- Run `npm run build:ssg` to generate static HTML for all pages
- Run `npm run build:ssg:with-dynamic-sitemap` to build with dynamic sitemap generation

### Performance Optimization

Performance metrics significantly influence search rankings. Maintain high scores in all areas:

- **Target Lighthouse Scores**:
  - Performance: ≥90
  - Accessibility: ≥90
  - Best Practices: ≥90
  - SEO: ≥95

- **Core Web Vitals**:
  - LCP (Largest Contentful Paint): < 2.5s
  - FID (First Input Delay): < 100ms
  - CLS (Cumulative Layout Shift): < 0.1

### Image Optimization

All images are optimized using the `OptimizedImage` component that:

- Serves WebP/AVIF formats to supported browsers
- Prevents layout shifts with predefined aspect ratios
- Lazy loads non-critical images
- Uses blur placeholders for better perceived performance

```tsx
// Example usage:
<OptimizedImage
  src="/path/to/image.jpg"
  alt="Descriptive alt text" // Always use descriptive alt text
  width={800}
  height={600}
  priority={isHeroImage} // Set true for above-the-fold images
/>
```

### URL Structure

Follow these URL structure patterns:

- Blog posts: `/blog/[descriptive-slug]`
- Category pages: `/category/[category-slug]`
- Author pages: `/author/[author-slug]`
- Tag pages: `/tag/[tag-slug]`

Slugs should:
- Be lowercase
- Use hyphens instead of spaces
- Include relevant keywords
- Be concise yet descriptive

### Structured Data

The site implements JSON-LD structured data for:

- Articles
- Events
- Products
- BreadcrumbLists

The `SEO` component manages structured data. Use it on every page:

```tsx
<SEO
  title="Your Page Title"
  description="Concise, keyword-rich description under 160 characters"
  ogImage="/path/to/image.jpg"
  ogType="article" // or "website", "event", "product"
  breadcrumbs={[
    { name: 'Category', url: '/category/name' },
    { name: 'Current Page', url: '/current-page' }
  ]}
  // Additional structured data based on content type
/>
```

## Content SEO Best Practices

### Title Tag Guidelines

- Length: 50-60 characters
- Include target keyword near the beginning
- Each page should have a unique title
- Format: `Primary Keyword - Secondary Keyword | Brand Name`

### Meta Description Guidelines

- Length: 150-160 characters
- Include primary keyword naturally
- Add a call-to-action where appropriate
- Summarize page content accurately
- Make it compelling to improve click-through rates

### Heading Structure

Maintain proper hierarchy:

- Use only one H1 per page (main title)
- Use H2 for major sections
- Use H3-H6 for subsections
- Include keywords in headings naturally
- Keep headings descriptive and under 70 characters

### Content Creation

- Minimum 1,000 words for core articles
- Target 1,500-2,500 words for comprehensive guides
- Include primary keyword in:
  - First 100 words
  - At least one H2
  - Image alt text (where relevant)
- Maintain keyword density of 1-2%
- Include 2-4 internal links to related content
- Add 2-3 external links to authoritative sources

### E-E-A-T Optimization

Demonstrate Experience, Expertise, Authoritativeness, and Trustworthiness:

- Display author credentials and bios
- Cite sources for claims and statistics
- Include publication and last-updated dates
- Provide comprehensive coverage of topics
- Ensure factual accuracy in all content

## Regular SEO Maintenance

### Monitoring & Tools

- Monitor rankings using Google Search Console
- Track Core Web Vitals in Google Search Console
- Analyze site performance with Lighthouse
- Check backlinks with tools like Ahrefs or Moz

### Regular Tasks

- Run `npm run seo:validate-schema` to validate structured data
- Run `npm run seo:check-links` to identify broken links
- Run `npm run seo:check-lighthouse` to audit performance
- Update the XML sitemap when adding new content
- Ensure robots.txt remains properly configured

### Content Audit Schedule

- Monthly:
  - Update outdated statistics or information
  - Refresh content for seasonal topics
  - Check for broken links

- Quarterly:
  - Identify underperforming content for updates
  - Refresh top-performing content with new information
  - Analyze keyword opportunities for content gaps

## SEO Workflow for New Content

1. Perform keyword research for the topic
2. Craft SEO-optimized title and meta description
3. Create content following heading structure guidelines
4. Implement proper internal linking
5. Add structured data via the SEO component
6. Optimize all images with descriptive alt text
7. Ensure mobile-friendly design and readability
8. Submit URL to Google Search Console for indexing

## Additional Resources

- [Google Search Central Documentation](https://developers.google.com/search)
- [Schema.org](https://schema.org/) for structured data reference
- [Web.dev Vitals](https://web.dev/vitals/) for performance guidance 