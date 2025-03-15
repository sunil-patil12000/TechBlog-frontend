# Structured Data Validator Guide

This directory contains example JSON-LD schema files for testing our structured data validation tool. Properly formatted structured data is crucial for SEO as it helps search engines understand your content and can result in rich search results.

## Available Schema Examples

1. **Article Schema** (`article.json`)
   - Used for blog posts and news articles
   - Required properties: headline, author, datePublished, publisher

2. **Event Schema** (`event.json`)
   - Used for event pages
   - Required properties: name, startDate, location

3. **FAQ Schema** (`faq.json`)
   - Used for FAQ pages
   - Required structure: mainEntity array with Question objects

4. **Product Schema** (`product.json`)
   - Used for product pages
   - Required properties: name

5. **Breadcrumbs Schema** (`breadcrumbs.json`)
   - Used for navigation breadcrumbs
   - Required structure: itemListElement array with ListItem objects

6. **Invalid Article Schema** (`invalid-article.json`)
   - Contains common errors to demonstrate validation failures

## Using the Schema Validator

Run one of the following npm scripts to validate your structured data:

```bash
# Validate all schemas in the public directory
npm run seo:validate-schema

# Validate schemas from a specific URL
npm run seo:validate-schema:url -- --url=https://yourdomain.com/example-page

# Validate a specific file with detailed output
npm run schema:test -- --file=./public/example-schemas/article.json --verbose

# Validate and attempt to fix common issues
npm run seo:validate-schema:fix

# Validate and open in Google's Rich Results Test
npm run seo:validate-schema:google
```

## Common Validation Errors

1. **Missing @context**
   - All schema.org structured data must include `"@context": "https://schema.org"`

2. **Missing Required Properties**
   - Each schema type has specific required properties (e.g., Article needs headline, author, etc.)

3. **Invalid Property Types**
   - Properties must have the correct data type (e.g., dates in ISO format)

4. **Improper Nesting**
   - Complex schemas like FAQ must follow the proper nesting structure

## Tips for Schema Implementation

1. **Test Before Deploying**
   - Always validate your schemas before publishing them to your website

2. **Be Specific**
   - Use the most specific schema type possible (e.g., use BlogPosting instead of Article when appropriate)

3. **Include Recommended Properties**
   - While not required, recommended properties improve the richness of your data

4. **Use SEO Component**
   - Our SEO component (`src/components/utils/SEO.tsx`) handles schema generation automatically

5. **Monitor Rich Results**
   - Use Google Search Console to monitor how your structured data appears in search results

## References

- [Google's Structured Data Guidelines](https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data)
- [Schema.org Full Specifications](https://schema.org/docs/full.html)
- [Rich Results Test](https://search.google.com/test/rich-results) 