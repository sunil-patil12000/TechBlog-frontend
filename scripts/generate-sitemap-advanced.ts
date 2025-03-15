import fs from 'fs';
import path from 'path';
import { format } from 'date-fns';
import axios from 'axios';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Domain and API configuration
const SITE_URL = process.env.VITE_APP_URL || 'https://yourdomain.com';
const API_URL = process.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Define routes to include in sitemap
// Static routes that don't have dynamic parameters
const staticRoutes = [
  // Public pages
  { path: '/', changefreq: 'daily', priority: 1.0 },
  { path: '/blog', changefreq: 'daily', priority: 0.9 },
  { path: '/tech-news', changefreq: 'daily', priority: 0.9 },
  { path: '/tech-news/latest', changefreq: 'daily', priority: 0.8 },
  { path: '/tech-news/featured', changefreq: 'weekly', priority: 0.8 },
  { path: '/tech-news/popular', changefreq: 'weekly', priority: 0.8 },
  { path: '/about', changefreq: 'monthly', priority: 0.7 },
  { path: '/about-us', changefreq: 'monthly', priority: 0.7 },
  { path: '/contact', changefreq: 'monthly', priority: 0.7 },
  { path: '/privacy', changefreq: 'monthly', priority: 0.5 },
  { path: '/archives', changefreq: 'weekly', priority: 0.6 },
  { path: '/projects', changefreq: 'weekly', priority: 0.7 },
  { path: '/events', changefreq: 'daily', priority: 0.8 },
  { path: '/events/latest', changefreq: 'daily', priority: 0.7 },
  { path: '/events/featured', changefreq: 'weekly', priority: 0.7 },
  { path: '/events/popular', changefreq: 'weekly', priority: 0.7 },
  { path: '/categories', changefreq: 'weekly', priority: 0.6 },
  { path: '/latest', changefreq: 'daily', priority: 0.8 },
  { path: '/tags', changefreq: 'weekly', priority: 0.6 },
];

// Routes to exclude from sitemap (admin, auth, etc.)
const excludePatterns = [
  '/admin',
  '/login',
  '/register',
  '/profile',
  '/settings',
  '/unauthorized',
  '/test-',
  '*-debug',
  '/image-debug',
];

// Interfaces for API responses
interface BlogPost {
  slug: string;
  updatedAt: string;
  publishedAt?: string;
  title?: string;
  summary?: string;
  tags?: string[];
  image?: string;
}

interface Category {
  slug: string;
  updatedAt: string;
  name?: string;
}

interface EventItem {
  slug: string;
  updatedAt: string;
  name?: string;
  startDate?: string;
  endDate?: string;
  location?: {
    name: string;
    address: string;
  };
}

interface Author {
  id: string;
  updatedAt: string;
  name?: string;
}

interface Tag {
  slug: string;
  updatedAt: string;
  name?: string;
}

interface ApiData {
  posts: BlogPost[];
  categories: Category[];
  events: EventItem[];
  authors: Author[];
  tags: Tag[];
}

// Function to fetch dynamic content from API
async function fetchDynamicContent(): Promise<ApiData> {
  // Initialize empty data
  const data: ApiData = {
    posts: [],
    categories: [],
    events: [],
    authors: [],
    tags: [],
  };
  
  try {
    console.log('Fetching dynamic content for sitemap generation...');
    
    // Try to fetch blog posts
    try {
      console.log('Fetching blog posts...');
      const postsResponse = await axios.get(`${API_URL}/posts?limit=1000&fields=slug,updatedAt,publishedAt,title,summary,tags,image`);
      if (postsResponse.data && Array.isArray(postsResponse.data.posts)) {
        data.posts = postsResponse.data.posts;
        console.log(`Retrieved ${data.posts.length} posts`);
      }
    } catch (error) {
      console.warn('Warning: Could not fetch blog posts for sitemap', error);
      // If API fails, try to use sample data for testing
      data.posts = getSamplePosts();
    }
    
    // Try to fetch categories
    try {
      console.log('Fetching categories...');
      const categoriesResponse = await axios.get(`${API_URL}/categories?limit=100&fields=slug,updatedAt,name`);
      if (categoriesResponse.data && Array.isArray(categoriesResponse.data.categories)) {
        data.categories = categoriesResponse.data.categories;
        console.log(`Retrieved ${data.categories.length} categories`);
      }
    } catch (error) {
      console.warn('Warning: Could not fetch categories for sitemap', error);
      // If API fails, try to use sample data for testing
      data.categories = getSampleCategories();
    }
    
    // Try to fetch events
    try {
      console.log('Fetching events...');
      const eventsResponse = await axios.get(`${API_URL}/events?limit=100&fields=slug,updatedAt,name,startDate,endDate,location`);
      if (eventsResponse.data && Array.isArray(eventsResponse.data.events)) {
        data.events = eventsResponse.data.events;
        console.log(`Retrieved ${data.events.length} events`);
      }
    } catch (error) {
      console.warn('Warning: Could not fetch events for sitemap', error);
      // If API fails, try to use sample data for testing
      data.events = getSampleEvents();
    }
    
    // Try to fetch authors
    try {
      console.log('Fetching authors...');
      const authorsResponse = await axios.get(`${API_URL}/authors?limit=50&fields=id,updatedAt,name`);
      if (authorsResponse.data && Array.isArray(authorsResponse.data.authors)) {
        data.authors = authorsResponse.data.authors;
        console.log(`Retrieved ${data.authors.length} authors`);
      }
    } catch (error) {
      console.warn('Warning: Could not fetch authors for sitemap', error);
      // If API fails, try to use sample data for testing
      data.authors = getSampleAuthors();
    }
    
    // Try to fetch tags
    try {
      console.log('Fetching tags...');
      const tagsResponse = await axios.get(`${API_URL}/tags?limit=200&fields=slug,updatedAt,name`);
      if (tagsResponse.data && Array.isArray(tagsResponse.data.tags)) {
        data.tags = tagsResponse.data.tags;
        console.log(`Retrieved ${data.tags.length} tags`);
      }
    } catch (error) {
      console.warn('Warning: Could not fetch tags for sitemap', error);
      // If API fails, try to use sample data for testing
      data.tags = getSampleTags();
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching dynamic content:', error);
    // If all API calls fail, return sample data for testing
    return {
      posts: getSamplePosts(),
      categories: getSampleCategories(),
      events: getSampleEvents(),
      authors: getSampleAuthors(),
      tags: getSampleTags(),
    };
  }
}

// Sample data functions for testing when API is unavailable
function getSamplePosts(): BlogPost[] {
  const today = new Date().toISOString();
  return [
    { slug: 'latest-tech-trends-2024', updatedAt: today, publishedAt: today, title: 'Latest Tech Trends 2024' },
    { slug: 'ai-revolution-in-healthcare', updatedAt: today, publishedAt: today, title: 'AI Revolution in Healthcare' },
    { slug: 'web3-development-guide', updatedAt: today, publishedAt: today, title: 'Web3 Development Guide' },
    { slug: 'meta-quest-3-review', updatedAt: today, publishedAt: today, title: 'Meta Quest 3 Review' },
    { slug: 'quantum-computing-explained', updatedAt: today, publishedAt: today, title: 'Quantum Computing Explained' },
  ];
}

function getSampleCategories(): Category[] {
  const today = new Date().toISOString();
  return [
    { slug: 'artificial-intelligence', updatedAt: today, name: 'Artificial Intelligence' },
    { slug: 'gadgets', updatedAt: today, name: 'Gadgets' },
    { slug: 'programming', updatedAt: today, name: 'Programming' },
    { slug: 'web-development', updatedAt: today, name: 'Web Development' },
    { slug: 'tech-news', updatedAt: today, name: 'Tech News' },
  ];
}

function getSampleEvents(): EventItem[] {
  const today = new Date().toISOString();
  const nextMonth = new Date();
  nextMonth.setMonth(nextMonth.getMonth() + 1);
  
  return [
    { 
      slug: 'wwdc-2024', 
      updatedAt: today,
      name: 'WWDC 2024',
      startDate: nextMonth.toISOString(),
      location: { name: 'Apple Park', address: 'Cupertino, CA' }
    },
    { 
      slug: 'google-io-2024', 
      updatedAt: today,
      name: 'Google I/O 2024',
      startDate: nextMonth.toISOString(),
      location: { name: 'Shoreline Amphitheatre', address: 'Mountain View, CA' }
    },
    { 
      slug: 'ces-2025', 
      updatedAt: today,
      name: 'CES 2025',
      startDate: nextMonth.toISOString(),
      location: { name: 'Las Vegas Convention Center', address: 'Las Vegas, NV' }
    },
  ];
}

function getSampleAuthors(): Author[] {
  const today = new Date().toISOString();
  return [
    { id: 'jane-doe', updatedAt: today, name: 'Jane Doe' },
    { id: 'john-smith', updatedAt: today, name: 'John Smith' },
    { id: 'alex-johnson', updatedAt: today, name: 'Alex Johnson' },
  ];
}

function getSampleTags(): Tag[] {
  const today = new Date().toISOString();
  return [
    { slug: 'ai', updatedAt: today, name: 'AI' },
    { slug: 'machine-learning', updatedAt: today, name: 'Machine Learning' },
    { slug: 'apple', updatedAt: today, name: 'Apple' },
    { slug: 'google', updatedAt: today, name: 'Google' },
    { slug: 'react', updatedAt: today, name: 'React' },
    { slug: 'javascript', updatedAt: today, name: 'JavaScript' },
    { slug: 'vr', updatedAt: today, name: 'VR' },
    { slug: 'ar', updatedAt: today, name: 'AR' },
  ];
}

// Generate sitemap XML for static routes
function generateStaticSitemapXml(): string {
  const today = format(new Date(), 'yyyy-MM-dd');
  
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">\n';
  
  // Add all static routes to sitemap
  staticRoutes.forEach(route => {
    // Skip excluded routes
    if (shouldExcludeRoute(route.path)) return;
    
    xml += '  <url>\n';
    xml += `    <loc>${SITE_URL}${route.path}</loc>\n`;
    xml += `    <lastmod>${today}</lastmod>\n`;
    xml += `    <changefreq>${route.changefreq}</changefreq>\n`;
    xml += `    <priority>${route.priority}</priority>\n`;
    xml += '  </url>\n';
  });
  
  return xml;
}

// Generate XML for dynamic routes based on API data
async function generateDynamicSitemapXml(): Promise<string> {
  // Start with static routes
  let xml = generateStaticSitemapXml();
  
  try {
    // Fetch dynamic content
    const data = await fetchDynamicContent();
    const today = format(new Date(), 'yyyy-MM-dd');
    
    // Add blog posts
    if (data.posts && data.posts.length > 0) {
      data.posts.forEach(post => {
        // Format lastmod date
        const lastmod = post.updatedAt ? format(new Date(post.updatedAt), 'yyyy-MM-dd') : today;
        // Get publish date for Google News
        const publishDate = post.publishedAt ? format(new Date(post.publishedAt), 'yyyy-MM-dd') : '';
        
        xml += '  <url>\n';
        xml += `    <loc>${SITE_URL}/blog/${post.slug}</loc>\n`;
        xml += `    <lastmod>${lastmod}</lastmod>\n`;
        xml += '    <changefreq>weekly</changefreq>\n';
        xml += '    <priority>0.8</priority>\n';
        
        // Add Google News extension for tech news
        if (publishDate && differenceInDays(new Date(), new Date(publishDate)) <= 2) {
          xml += '    <news:news>\n';
          xml += '      <news:publication>\n';
          xml += '        <news:name>Tech Blog</news:name>\n';
          xml += '        <news:language>en</news:language>\n';
          xml += '      </news:publication>\n';
          xml += `      <news:publication_date>${publishDate}</news:publication_date>\n`;
          xml += `      <news:title>${escapeXML(post.title || post.slug)}</news:title>\n`;
          xml += '    </news:news>\n';
        }
        
        // Add image extension if available
        if (post.image) {
          xml += '    <image:image>\n';
          xml += `      <image:loc>${post.image.startsWith('http') ? post.image : `${SITE_URL}${post.image}`}</image:loc>\n`;
          if (post.title) {
            xml += `      <image:title>${escapeXML(post.title)}</image:title>\n`;
          }
          xml += '    </image:image>\n';
        }
        
        xml += '  </url>\n';
        
        // Add alternate URL for the post (for posts that can be accessed via /post/:slug as well)
        xml += '  <url>\n';
        xml += `    <loc>${SITE_URL}/post/${post.slug}</loc>\n`;
        xml += `    <lastmod>${lastmod}</lastmod>\n`;
        xml += '    <changefreq>weekly</changefreq>\n';
        xml += '    <priority>0.7</priority>\n'; // Slightly lower priority for alternate URL
        xml += '  </url>\n';
      });
    }
    
    // Add categories
    if (data.categories && data.categories.length > 0) {
      data.categories.forEach(category => {
        const lastmod = category.updatedAt ? format(new Date(category.updatedAt), 'yyyy-MM-dd') : today;
        
        xml += '  <url>\n';
        xml += `    <loc>${SITE_URL}/category/${category.slug}</loc>\n`;
        xml += `    <lastmod>${lastmod}</lastmod>\n`;
        xml += '    <changefreq>weekly</changefreq>\n';
        xml += '    <priority>0.7</priority>\n';
        xml += '  </url>\n';
      });
    }
    
    // Add events
    if (data.events && data.events.length > 0) {
      data.events.forEach(event => {
        const lastmod = event.updatedAt ? format(new Date(event.updatedAt), 'yyyy-MM-dd') : today;
        
        xml += '  <url>\n';
        xml += `    <loc>${SITE_URL}/events/${event.slug}</loc>\n`;
        xml += `    <lastmod>${lastmod}</lastmod>\n`;
        xml += '    <changefreq>weekly</changefreq>\n';
        xml += '    <priority>0.8</priority>\n';
        xml += '  </url>\n';
      });
    }
    
    // Add authors
    if (data.authors && data.authors.length > 0) {
      data.authors.forEach(author => {
        const lastmod = author.updatedAt ? format(new Date(author.updatedAt), 'yyyy-MM-dd') : today;
        
        xml += '  <url>\n';
        xml += `    <loc>${SITE_URL}/author/${author.id}</loc>\n`;
        xml += `    <lastmod>${lastmod}</lastmod>\n`;
        xml += '    <changefreq>weekly</changefreq>\n';
        xml += '    <priority>0.6</priority>\n';
        xml += '  </url>\n';
      });
    }
    
    // Add tags
    if (data.tags && data.tags.length > 0) {
      data.tags.forEach(tag => {
        const lastmod = tag.updatedAt ? format(new Date(tag.updatedAt), 'yyyy-MM-dd') : today;
        
        xml += '  <url>\n';
        xml += `    <loc>${SITE_URL}/tag/${tag.slug}</loc>\n`;
        xml += `    <lastmod>${lastmod}</lastmod>\n`;
        xml += '    <changefreq>weekly</changefreq>\n';
        xml += '    <priority>0.6</priority>\n';
        xml += '  </url>\n';
      });
    }
    
    // Close XML
    xml += '</urlset>';
    return xml;
  } catch (error) {
    console.error('Error generating dynamic sitemap:', error);
    
    // Close XML and return what we have so far
    xml += '</urlset>';
    return xml;
  }
}

// Helper to escape XML special characters
function escapeXML(text: string = ''): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// Helper to check if a route should be excluded
function shouldExcludeRoute(path: string): boolean {
  return excludePatterns.some(pattern => {
    if (pattern.endsWith('*')) {
      return path.startsWith(pattern.slice(0, -1));
    } else if (pattern.startsWith('*')) {
      return path.endsWith(pattern.slice(1));
    } else {
      return path.includes(pattern);
    }
  });
}

// Helper to calculate days difference for Google News
function differenceInDays(date1: Date, date2: Date): number {
  const diffTime = Math.abs(date1.getTime() - date2.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

// Generate robots.txt content
function generateRobotsTxt() {
  return `# robots.txt for ${SITE_URL}
User-agent: *
Allow: /

# Disallow admin and auth pages
Disallow: /admin/
Disallow: /login
Disallow: /register
Disallow: /profile
Disallow: /settings
Disallow: /unauthorized
Disallow: /test-
Disallow: /*-debug

# Crawl delay to avoid overwhelming the server
Crawl-delay: 1

# Sitemap location
Sitemap: ${SITE_URL}/sitemap.xml`;
}

// Main function to write files
async function generateFiles() {
  try {
    console.log('Starting sitemap generation...');
    
    // Make sure we generate for the public and dist directories
    const distDir = path.resolve(__dirname, '../dist');
    const publicDir = path.resolve(__dirname, '../public');
    
    // Ensure directories exist
    [distDir, publicDir].forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`Created directory: ${dir}`);
      }
    });
    
    // Generate and write dynamic sitemap.xml
    const sitemapContent = await generateDynamicSitemapXml();
    
    // Write to both public and dist directories
    fs.writeFileSync(
      path.resolve(publicDir, 'sitemap.xml'),
      sitemapContent,
      'utf8'
    );
    
    fs.writeFileSync(
      path.resolve(distDir, 'sitemap.xml'),
      sitemapContent,
      'utf8'
    );
    
    console.log('✅ sitemap.xml generated successfully!');
    
    // Generate and write robots.txt
    const robotsContent = generateRobotsTxt();
    
    // Write to both public and dist directories
    fs.writeFileSync(
      path.resolve(publicDir, 'robots.txt'),
      robotsContent,
      'utf8'
    );
    
    fs.writeFileSync(
      path.resolve(distDir, 'robots.txt'),
      robotsContent,
      'utf8'
    );
    
    console.log('✅ robots.txt generated successfully!');
  } catch (error) {
    console.error('Error generating sitemap or robots.txt:', error);
    process.exit(1);
  }
}

// Execute the script
generateFiles().then(() => {
  console.log('Sitemap generation complete!');
}).catch(error => {
  console.error('Failed to generate sitemap:', error);
  process.exit(1);
}); 