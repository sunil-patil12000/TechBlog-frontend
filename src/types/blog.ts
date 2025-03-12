import { ReactNode } from 'react';

/**
 * Core type definitions for the blog application
 */

export interface Author {
  id: string;
  name: string;
  avatar: string;
  bio?: string;
  role?: 'admin' | 'editor' | 'author' | 'contributor';
  email?: string;
  website?: string;
  socialLinks?: {
    platform: string;
    url: string;
  }[];
  expertise?: string[];
  followers?: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parentId?: string;
  count?: number;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  description?: string;
  count?: number;
}

export interface Image {
  url: string;
  alt?: string;
  width?: number;
  height?: number;
  caption?: string;
}

export interface Comment {
  id: string;
  content: string;
  createdAt: string;
  updatedAt?: string;
  author: Author | string;
  likes?: number;
  parentId?: string;
  replies?: Comment[];
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  thumbnail: Image;
  images?: Image[];
  createdAt: string;
  updatedAt?: string;
  publishedAt?: string;
  author: Author;
  category: string;
  tags: string[];
  readingTime: number;
  likes: number;
  viewCount: number;
  relatedPosts?: string[];
  featured?: boolean;
  status?: 'draft' | 'published' | 'archived';
  comments?: Comment[];
  seoTitle?: string;
  seoDescription?: string;
  canonical?: string;
}

export interface SearchResult {
  id: string;
  title: string;
  url: string;
  type: 'article' | 'author' | 'tag' | 'category';
  description?: string;
  image?: string;
}

export interface TableOfContents {
  id: string;
  title: string;
  level: number;
  children?: TableOfContents[];
}

export interface FilterOptions {
  category?: string;
  tag?: string;
  author?: string;
  search?: string;
  sort?: 'latest' | 'popular' | 'trending';
  view?: 'grid' | 'list';
  page?: number;
  limit?: number;
}

export interface ReadingStats {
  articlesRead: number;
  totalTimeSpent: number;
  lastRead: string | null;
}

// Project-specific types
export interface Project {
  id: string;
  title: string;
  description: string;
  slug?: string;
  image: string;
  tags: string[];
  githubUrl?: string;
  demoUrl?: string;
  featured?: boolean;
  createdAt?: string;
  technologies?: string[];
  keyFeatures?: string[];
}
