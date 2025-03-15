import fs from 'fs';
import path from 'path';
import { format } from 'date-fns';

// Domain configuration
const SITE_URL = process.env.VITE_APP_URL || 'https://yourdomain.com';

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
  
  // You can add more static routes as needed
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

// Generate XML for the sitemap
function generateSitemapXml() {
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
function generateFiles() {
  try {
    // Make sure public directory exists
    const publicDir = path.resolve(__dirname, '../public');
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }
    
    // Generate and write sitemap.xml
    const sitemapContent = generateSitemapXml();
    fs.writeFileSync(
      path.resolve(publicDir, 'sitemap.xml'),
      sitemapContent,
      'utf8'
    );
    console.log('✅ sitemap.xml generated successfully!');
    
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
generateFiles(); 