export const mockPosts = [
  {
    id: '1',
    slug: 'introduction-to-react-hooks',
    title: 'Introduction to React Hooks: A Complete Guide',
    excerpt: 'Learn how to use React Hooks to simplify your functional components and manage state effectively.',
    thumbnail: '/images/placeholder-post.jpg',
    publishedAt: '2023-06-15T10:30:00Z',
    readingTime: 8,
    category: {
      id: '1',
      name: 'React',
      slug: 'react'
    },
    tags: [
      { id: '1', name: 'React', slug: 'react' },
      { id: '2', name: 'JavaScript', slug: 'javascript' },
      { id: '3', name: 'Hooks', slug: 'hooks' }
    ],
    author: {
      id: '1',
      name: 'John Doe',
      avatar: '/images/placeholder-avatar.svg'
    },
    commentCount: 12,
    likeCount: 48,
    viewCount: 1024,
    isBookmarked: false
  },
  {
    id: '2',
    slug: 'typescript-best-practices',
    title: 'TypeScript Best Practices for 2023',
    excerpt: 'Discover the latest best practices for writing clean, maintainable TypeScript code in your projects.',
    thumbnail: '/images/placeholder-post.jpg',
    publishedAt: '2023-07-20T14:15:00Z',
    readingTime: 10,
    category: {
      id: '2',
      name: 'TypeScript',
      slug: 'typescript'
    },
    tags: [
      { id: '2', name: 'JavaScript', slug: 'javascript' },
      { id: '4', name: 'TypeScript', slug: 'typescript' },
      { id: '5', name: 'Best Practices', slug: 'best-practices' }
    ],
    author: {
      id: '2',
      name: 'Jane Smith',
      avatar: '/images/placeholder-avatar.svg'
    },
    commentCount: 8,
    likeCount: 36,
    viewCount: 875,
    isBookmarked: true
  },
  {
    id: '3',
    slug: 'building-with-nextjs',
    title: 'Building Blazing Fast Websites with Next.js',
    excerpt: 'Learn how to leverage Next.js to create high-performance web applications with amazing developer experience.',
    thumbnail: '/images/placeholder-post.jpg',
    publishedAt: '2023-08-05T09:45:00Z',
    readingTime: 12,
    category: {
      id: '3',
      name: 'Next.js',
      slug: 'nextjs'
    },
    tags: [
      { id: '1', name: 'React', slug: 'react' },
      { id: '6', name: 'Next.js', slug: 'nextjs' },
      { id: '7', name: 'Performance', slug: 'performance' }
    ],
    author: {
      id: '3',
      name: 'Alex Johnson',
      avatar: '/images/placeholder-avatar.svg'
    },
    commentCount: 15,
    likeCount: 52,
    viewCount: 1250,
    isBookmarked: false
  }
]; 