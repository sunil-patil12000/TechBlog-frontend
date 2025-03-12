import { SearchResult } from '../types/blog';

export interface Author {
  name: string;
  bio: string;
  avatar: string;
  socialLinks?: { platform: string; url: string }[];
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  date: string;
  coverImage: string;
  author: Author;
  categories: string[];
  tags: string[];
  readTime: number;
}

export const authors: Record<string, Author> = {
  johndoe: {
    name: "John Doe",
    bio: "Full-stack developer with a passion for React and TypeScript.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=250&q=80",
    socialLinks: [
      { platform: "twitter", url: "https://twitter.com/johndoe" },
      { platform: "github", url: "https://github.com/johndoe" },
      { platform: "linkedin", url: "https://linkedin.com/in/johndoe" },
    ],
  },
  janedoe: {
    name: "Jane Doe",
    bio: "UX designer and front-end developer focused on creating beautiful user experiences.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=250&q=80",
    socialLinks: [
      { platform: "twitter", url: "https://twitter.com/janedoe" },
      { platform: "github", url: "https://github.com/janedoe" },
      { platform: "linkedin", url: "https://linkedin.com/in/janedoe" },
    ],
  },
};

// Sample posts data
export const posts: Post[] = [
  {
    id: "1",
    title: "Getting Started with React 18",
    slug: "getting-started-with-react-18",
    excerpt: "Learn about the new features in React 18 and how to use them in your projects.",
    content: "# Getting Started with React 18\n\nReact 18 introduces several new features...",
    date: "2023-06-15",
    coverImage: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-1.2.1&auto=format&fit=crop&w=1470&q=80",
    author: authors.johndoe,
    categories: ["React", "JavaScript"],
    tags: ["react", "javascript", "frontend"],
    readTime: 8,
  },
  // Add more posts as needed
];

// Fetch posts function
export async function fetchPosts(): Promise<Post[]> {
  // In a real app, this would be an API call
  return new Promise((resolve) => {
    setTimeout(() => resolve(posts), 500);
  });
}

// Get post by slug
export function getPostBySlug(slug: string): Post | undefined {
  return posts.find((post) => post.slug === slug);
}

// Fetch post by slug (async version)
export async function fetchPostBySlug(slug: string): Promise<Post | null> {
  // In a real app, this would be an API call
  return new Promise((resolve) => {
    setTimeout(() => {
      const post = getPostBySlug(slug);
      resolve(post || null);
    }, 500);
  });
}

// Helper function to fetch data from an external API
async function fetchData(url: string) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch from ${url}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
}

// Export utility functions
export const blogUtils = {
  getAllCategories: () => {
    const categoriesSet = new Set<string>();
    posts.forEach((post) => {
      post.categories.forEach((category) => categoriesSet.add(category));
    });
    return Array.from(categoriesSet);
  },
  
  getAllTags: () => {
    const tagsSet = new Set<string>();
    posts.forEach((post) => {
      post.tags.forEach((tag) => tagsSet.add(tag));
    });
    return Array.from(tagsSet);
  },
  
  getPostsByCategory: (category: string) => {
    return posts.filter((post) => 
      post.categories.some((cat) => cat.toLowerCase() === category.toLowerCase())
    );
  },
  
  getPostsByTag: (tag: string) => {
    return posts.filter((post) => 
      post.tags.some((t) => t.toLowerCase() === tag.toLowerCase())
    );
  },
  
  getFeaturedPost: () => {
    // For simplicity, just return the first post
    // In a real app, you might have a 'featured' flag in your post data
    return posts.length > 0 ? posts[0] : null;
  },
  
  getRecentPosts: (count: number) => {
    const sorted = [...posts].sort((a, b) => new Date(b.date).valueOf() - new Date(a.date).valueOf());
    return sorted.slice(0, count);
  }
};

export const categories = blogUtils.getAllCategories();
export const tags = blogUtils.getAllTags();

// Mock data for search functionality
const mockPosts = [
  {
    id: '1',
    title: 'Getting Started with React 18',
    slug: 'getting-started-with-react-18',
    excerpt: 'Learn about the new features in React 18 and how to use them in your projects.',
    content: '## Introduction\n\nReact 18 introduces several new features...',
    author: {
      id: 'auth1',
      name: 'Jane Doe',
      avatar: 'https://i.pravatar.cc/150?img=1'
    },
    category: 'React',
    tags: ['React', 'JavaScript', 'Frontend'],
    createdAt: '2023-09-15T10:30:00Z',
    updatedAt: '2023-09-16T08:15:00Z',
    readingTime: 5,
    viewCount: 1250,
    likes: 42,
    thumbnail: {
      url: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee',
      alt: 'React logo on screen'
    }
  },
  // ...other mock posts
];

// Search function for UI components
export function searchPosts(query: string): SearchResult[] {
  const lowerCaseQuery = query.toLowerCase();
  
  return mockPosts
    .filter(post => 
      post.title.toLowerCase().includes(lowerCaseQuery) ||
      post.content?.toLowerCase().includes(lowerCaseQuery) ||
      post.excerpt?.toLowerCase().includes(lowerCaseQuery) ||
      post.category.toLowerCase().includes(lowerCaseQuery) ||
      post.tags.some(tag => tag.toLowerCase().includes(lowerCaseQuery))
    )
    .map(post => ({
      id: post.id,
      title: post.title,
      url: `/blog/${post.slug}`,
      type: 'article' as const,
      description: post.excerpt
    }));
}

// Export helper functions to match original exports
export { mockPosts };

// Default export
export default posts;