#!/usr/bin/env node

/**
 * Sitemap Generator Script
 * 
 * This script generates a sitemap.xml file for the blog, including all static pages
 * and dynamically generated content pages (blog posts, author pages, category pages).
 * 
 * Usage:
 *   npm run generate-sitemap
 * 
 * Configuration:
 *   - Set the BASE_URL to your production domain
 *   - Modify the STATIC_ROUTES array to include all static routes in your application
 *   - Update the API_ENDPOINTS to fetch dynamic content from your backend
 */

import fs from 'fs';
import path from 'path';
import axios from 'axios';
import { format } from 'date-fns';

// Configuration
const BASE_URL = 'https://yourdomain.com';
const OUTPUT_PATH = './dist/sitemap.xml';
const API_BASE_URL = process.env.VITE_API_URL || 'http://localhost:5000/api';

// Static routes that should always be included
const STATIC_ROUTES = [
  '/',
  '/blog',
  '/about',
  '/contact',
  '/categories',
  '/authors',
  '/search',
  '/privacy-policy',
  '/terms-of-service',
];

// API endpoints to fetch dynamic content
const API_ENDPOINTS = {
  posts: `${API_BASE_URL}/posts`,
  categories: `${API_BASE_URL}/categories`,
  authors: `${API_BASE_URL}/authors`,
};

// Sitemap change frequency and priority settings
const CHANGE_FREQ = {
  home: 'daily',
  blog: 'weekly',
  post: 'monthly',
  category: 'weekly',
  author: 'monthly',
  static: 'monthly',
};

const PRIORITY = {
  home: '1.0',
  blog: '0.9',
  post: '0.8',
  category: '0.7',
  author: '0.6',
  static: '0.5',
};

// Types
interface Post {
  slug: string;
  updatedAt: string;
}

interface Category {
  slug: string;
}

interface Author {
  slug: string;
}

interface SitemapEntry {
  url: string;
  lastmod?: string;
  changefreq: string;
  priority: string;
}

/**
 * Fetches data from the API
 */
async function fetchData<T>(endpoint: string): Promise<T[]> {
  try {
    const response = await axios.get(endpoint);
    return response.data;
  } catch (error) {
    console.error(`Error fetching data from ${endpoint}:`, error);
    return [];
  }
}

/**
 * Generates sitemap entries for static routes
 */
function generateStaticEntries(): SitemapEntry[] {
  return STATIC_ROUTES.map(route => {
    const isHome = route === '/';
    const isBlog = route === '/blog';
    
    return {
      url: `${BASE_URL}${route}`,
      lastmod: format(new Date(), 'yyyy-MM-dd'),
      changefreq: isHome ? CHANGE_FREQ.home : isBlog ? CHANGE_FREQ.blog : CHANGE_FREQ.static,
      priority: isHome ? PRIORITY.home : isBlog ? PRIORITY.blog : PRIORITY.static,
    };
  });
}

/**
 * Generates sitemap entries for blog posts
 */
function generatePostEntries(posts: Post[]): SitemapEntry[] {
  return posts.map(post => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastmod: format(new Date(post.updatedAt), 'yyyy-MM-dd'),
    changefreq: CHANGE_FREQ.post,
    priority: PRIORITY.post,
  }));
}

/**
 * Generates sitemap entries for categories
 */
function generateCategoryEntries(categories: Category[]): SitemapEntry[] {
  return categories.map(category => ({
    url: `${BASE_URL}/category/${category.slug}`,
    lastmod: format(new Date(), 'yyyy-MM-dd'),
    changefreq: CHANGE_FREQ.category,
    priority: PRIORITY.category,
  }));
}

/**
 * Generates sitemap entries for authors
 */
function generateAuthorEntries(authors: Author[]): SitemapEntry[] {
  return authors.map(author => ({
    url: `${BASE_URL}/author/${author.slug}`,
    lastmod: format(new Date(), 'yyyy-MM-dd'),
    changefreq: CHANGE_FREQ.author,
    priority: PRIORITY.author,
  }));
}

/**
 * Generates the XML content for the sitemap
 */
function generateSitemapXml(entries: SitemapEntry[]): string {
  const xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>\n';
  const urlsetOpen = '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  const urlsetClose = '</urlset>';
  
  const urlEntries = entries.map(entry => {
    let urlXml = `  <url>\n    <loc>${entry.url}</loc>\n`;
    
    if (entry.lastmod) {
      urlXml += `    <lastmod>${entry.lastmod}</lastmod>\n`;
    }
    
    urlXml += `    <changefreq>${entry.changefreq}</changefreq>\n`;
    urlXml += `    <priority>${entry.priority}</priority>\n`;
    urlXml += '  </url>';
    
    return urlXml;
  }).join('\n');
  
  return xmlHeader + urlsetOpen + urlEntries + '\n' + urlsetClose;
}

/**
 * Creates the output directory if it doesn't exist
 */
function ensureOutputDirectory(): void {
  const outputDir = path.dirname(OUTPUT_PATH);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
}

/**
 * Main function to generate the sitemap
 */
async function generateSitemap(): Promise<void> {
  console.log('Generating sitemap...');
  
  try {
    // Fetch dynamic content
    const [posts, categories, authors] = await Promise.all([
      fetchData<Post>(API_ENDPOINTS.posts),
      fetchData<Category>(API_ENDPOINTS.categories),
      fetchData<Author>(API_ENDPOINTS.authors),
    ]);
    
    console.log(`Fetched ${posts.length} posts, ${categories.length} categories, and ${authors.length} authors.`);
    
    // Generate entries
    const staticEntries = generateStaticEntries();
    const postEntries = generatePostEntries(posts);
    const categoryEntries = generateCategoryEntries(categories);
    const authorEntries = generateAuthorEntries(authors);
    
    // Combine all entries
    const allEntries = [
      ...staticEntries,
      ...postEntries,
      ...categoryEntries,
      ...authorEntries,
    ];
    
    // Generate XML
    const sitemapXml = generateSitemapXml(allEntries);
    
    // Write to file
    ensureOutputDirectory();
    fs.writeFileSync(OUTPUT_PATH, sitemapXml);
    
    console.log(`Sitemap generated successfully at ${OUTPUT_PATH}`);
    console.log(`Total URLs in sitemap: ${allEntries.length}`);
  } catch (error) {
    console.error('Error generating sitemap:', error);
    process.exit(1);
  }
}

// Execute the main function
generateSitemap(); 