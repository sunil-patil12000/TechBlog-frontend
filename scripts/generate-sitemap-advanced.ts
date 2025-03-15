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
  '*-debug'
];

// Interfaces for API responses
interface BlogPost {
  slug: string;
  updatedAt: string;
}

interface Category {
  slug: string;
  updatedAt: string;
}

interface EventItem {
  slug: string;
  updatedAt: string;
}

interface Author {
  id: string;
  updatedAt: string;
}

interface ApiData {
  posts: BlogPost[];
  categories: Category[];
  events: EventItem[];
  authors: Author[];
}

// Function to fetch dynamic content from API
async function fetchDynamicContent(): Promise<ApiData> {
  // Initialize empty data
  const data: ApiData = {
    posts: [],
    categories: [],
    events: [],
    authors: []
  };
  
  try {
    // Try to fetch blog posts
    try {
      const postsResponse = await axios.get(`${API_URL}/posts?limit=1000&fields=slug,updatedAt`);
      if (postsResponse.data && Array.isArray(postsResponse.data.posts)) {
        data.posts = postsResponse.data.posts;
      }
    } catch (error) {
      console.warn('Warning: Could not fetch blog posts for sitemap', error);
    }
    
    // Try to fetch categories
    try {
      const categoriesResponse = await axios.get(`${API_URL}/categories?fields=slug,updatedAt`);
      if (categoriesResponse.data && Array.isArray(categoriesResponse.data)) {
        data.categories = categoriesResponse.data;
      }
    } catch (error) {
      console.warn('Warning: Could not fetch categories for sitemap', error);
    }
    
    // Try to fetch events
    try {
      const eventsResponse = await axios.get(`${API_URL}/events?fields=slug,updatedAt`);
      if (eventsResponse.data && Array.isArray(eventsResponse.data)) {
        data.events = eventsResponse.data;
      }
    } catch (error) {
      console.warn('Warning: Could not fetch events for sitemap', error);
    }
    
    // Try to fetch authors
    try {
      const authorsResponse = await axios.get(`${API_URL}/authors?fields=id,updatedAt`);
      if (authorsResponse.data && Array.isArray(authorsResponse.data)) {
        data.authors = authorsResponse.data;
      }
    } catch (error) {
      console.warn('Warning: Could not fetch authors for sitemap', error);
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching data from API:', error);
    return data; // Return empty data if API fails
  }
}

// Generate fallback sitemap with only static routes
function generateStaticSitemapXml() {
  const today = format(new Date(), 'yyyy-MM-dd');
  
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  
  // Add all static routes to sitemap
  staticRoutes.forEach(route => {
    // Skip excluded routes
    if (excludePatterns.some(pattern => {
      if (pattern.endsWith('*')) {
        return route.path.startsWith(pattern.slice(0, -1));
      } else if (pattern.startsWith('*')) {
        return route.path.endsWith(pattern.slice(1));
      } else {
        return route.path.includes(pattern);
      }
    })) {
      return;
    }
    
    xml += '  <url>\n';
    xml += `    <loc>${SITE_URL}${route.path}</loc>\n`;
    xml += `    <lastmod>${today}</lastmod>\n`;
    xml += `    <changefreq>${route.changefreq}</changefreq>\n`;
    xml += `    <priority>${route.priority}</priority>\n`;
    xml += '  </url>\n';
  });
  
  xml += '</urlset>';
  return xml;
}

// Generate sitemap with both static and dynamic routes
async function generateDynamicSitemapXml() {
  const today = format(new Date(), 'yyyy-MM-dd');
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  
  // Add static routes
  staticRoutes.forEach(route => {
    // Skip excluded routes
    if (excludePatterns.some(pattern => {
      if (pattern.endsWith('*')) {
        return route.path.startsWith(pattern.slice(0, -1));
      } else if (pattern.startsWith('*')) {
        return route.path.endsWith(pattern.slice(1));
      } else {
        return route.path.includes(pattern);
      }
    })) {
      return;
    }
    
    xml += '  <url>\n';
    xml += `    <loc>${SITE_URL}${route.path}</loc>\n`;
    xml += `    <lastmod>${today}</lastmod>\n`;
    xml += `    <changefreq>${route.changefreq}</changefreq>\n`;
    xml += `    <priority>${route.priority}</priority>\n`;
    xml += '  </url>\n';
  });
  
  // Fetch dynamic content
  try {
    const dynamicData = await fetchDynamicContent();
    
    // Add blog posts
    dynamicData.posts.forEach(post => {
      if (post.slug) {
        const lastmod = post.updatedAt 
          ? format(new Date(post.updatedAt), 'yyyy-MM-dd')
          : today;
          
        xml += '  <url>\n';
        xml += `    <loc>${SITE_URL}/blog/${post.slug}</loc>\n`;
        xml += `    <lastmod>${lastmod}</lastmod>\n`;
        xml += '    <changefreq>weekly</changefreq>\n';
        xml += '    <priority>0.7</priority>\n';
        xml += '  </url>\n';
      }
    });
    
    // Add categories
    dynamicData.categories.forEach(category => {
      if (category.slug) {
        const lastmod = category.updatedAt 
          ? format(new Date(category.updatedAt), 'yyyy-MM-dd')
          : today;
          
        xml += '  <url>\n';
        xml += `    <loc>${SITE_URL}/category/${category.slug}</loc>\n`;
        xml += `    <lastmod>${lastmod}</lastmod>\n`;
        xml += '    <changefreq>weekly</changefreq>\n';
        xml += '    <priority>0.6</priority>\n';
        xml += '  </url>\n';
      }
    });
    
    // Add events
    dynamicData.events.forEach(event => {
      if (event.slug) {
        const lastmod = event.updatedAt 
          ? format(new Date(event.updatedAt), 'yyyy-MM-dd')
          : today;
          
        xml += '  <url>\n';
        xml += `    <loc>${SITE_URL}/events/${event.slug}</loc>\n`;
        xml += `    <lastmod>${lastmod}</lastmod>\n`;
        xml += '    <changefreq>weekly</changefreq>\n';
        xml += '    <priority>0.7</priority>\n';
        xml += '  </url>\n';
      }
    });
    
    // Add authors
    dynamicData.authors.forEach(author => {
      if (author.id) {
        const lastmod = author.updatedAt 
          ? format(new Date(author.updatedAt), 'yyyy-MM-dd')
          : today;
          
        xml += '  <url>\n';
        xml += `    <loc>${SITE_URL}/author/${author.id}</loc>\n`;
        xml += `    <lastmod>${lastmod}</lastmod>\n`;
        xml += '    <changefreq>weekly</changefreq>\n';
        xml += '    <priority>0.6</priority>\n';
        xml += '  </url>\n';
      }
    });
    
  } catch (error) {
    console.error('Error generating dynamic sitemap:', error);
    // Continue with just static routes
  }
  
  xml += '</urlset>';
  return xml;
}

// Generate robots.txt content
function generateRobotsTxt() {
  return `# Allow all crawlers
User-agent: *
Allow: /

# Disallow admin and auth pages
Disallow: /admin/
Disallow: /login
Disallow: /register
Disallow: /profile
Disallow: /settings
Disallow: /unauthorized

# Sitemap location
Sitemap: ${SITE_URL}/sitemap.xml`;
}

// Main function to write files
async function generateFiles() {
  try {
    // Make sure public directory exists
    const publicDir = path.resolve(__dirname, '../public');
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }
    
    // Try to generate dynamic sitemap first
    try {
      console.log('Generating dynamic sitemap with API content...');
      const sitemapContent = await generateDynamicSitemapXml();
      fs.writeFileSync(
        path.resolve(publicDir, 'sitemap.xml'),
        sitemapContent,
        'utf8'
      );
      console.log('✅ Dynamic sitemap.xml generated successfully!');
    } catch (error) {
      console.error('Failed to generate dynamic sitemap:', error);
      console.log('Falling back to static sitemap...');
      
      // Fall back to static sitemap
      const staticSitemapContent = generateStaticSitemapXml();
      fs.writeFileSync(
        path.resolve(publicDir, 'sitemap.xml'),
        staticSitemapContent,
        'utf8'
      );
      console.log('✅ Static sitemap.xml generated as fallback!');
    }
    
    // Generate and write robots.txt
    const robotsContent = generateRobotsTxt();
    fs.writeFileSync(
      path.resolve(publicDir, 'robots.txt'),
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
generateFiles().catch(error => {
  console.error('Script failed:', error);
  process.exit(1);
}); 