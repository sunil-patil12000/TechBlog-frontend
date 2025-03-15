/**
 * This script updates the robots.txt and sitemap.xml files in the public directory
 * to use the correct domain from environment variables
 */

const fs = require('fs');
const path = require('path');

// Get the site URL from environment variables
const siteUrl = process.env.VITE_APP_URL || 'https://yourdomain.com';
console.log(`Using site URL: ${siteUrl}`);

// Path to public directory
const publicDir = path.resolve(__dirname, '../public');

// Update robots.txt
try {
  const robotsPath = path.join(publicDir, 'robots.txt');
  if (fs.existsSync(robotsPath)) {
    let robotsContent = fs.readFileSync(robotsPath, 'utf8');
    
    // Replace the domain in the Sitemap directive
    robotsContent = robotsContent.replace(
      /Sitemap:.*$/m,
      `Sitemap: ${siteUrl}/sitemap.xml`
    );
    
    fs.writeFileSync(robotsPath, robotsContent, 'utf8');
    console.log('✅ Updated robots.txt with correct domain');
  } else {
    console.log('⚠️ robots.txt not found in public directory');
  }
} catch (error) {
  console.error('Error updating robots.txt:', error);
}

// Update sitemap.xml if it exists
try {
  const sitemapPath = path.join(publicDir, 'sitemap.xml');
  if (fs.existsSync(sitemapPath)) {
    let sitemapContent = fs.readFileSync(sitemapPath, 'utf8');
    
    // Replace all occurrences of yourdomain.com with the actual domain
    sitemapContent = sitemapContent.replace(
      /https:\/\/yourdomain\.com/g,
      siteUrl
    );
    
    fs.writeFileSync(sitemapPath, sitemapContent, 'utf8');
    console.log('✅ Updated sitemap.xml with correct domain');
  } else {
    console.log('⚠️ sitemap.xml not found in public directory');
  }
} catch (error) {
  console.error('Error updating sitemap.xml:', error);
}

console.log('Domain update complete'); 