import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import BlogCard from '../components/blog/BlogCard';
import { mockPosts } from '../data/mockPosts';

// Mock categories for display purposes
const CATEGORIES = {
  'react': { name: 'React', description: 'Articles about React, hooks, and modern frontend development.' },
  'typescript': { name: 'TypeScript', description: 'Learn about TypeScript features, best practices, and advanced types.' },
  'nextjs': { name: 'Next.js', description: 'Articles about server-side rendering, static site generation, and the Next.js framework.' },
  'javascript': { name: 'JavaScript', description: 'Explore the latest JavaScript features, patterns, and best practices.' },
  'webdev': { name: 'Web Development', description: 'General web development topics including HTML, CSS, and modern web standards.' },
};

const CategoryPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [posts, setPosts] = useState<typeof mockPosts>([]);
  const [isLoading, setIsLoading] = useState(true);
  const category = CATEGORIES[slug as keyof typeof CATEGORIES] || { 
    name: slug?.charAt(0).toUpperCase() + slug?.slice(1) || 'Category', 
    description: 'Articles in this category'
  };

  useEffect(() => {
    // Simulate API call to fetch posts by category
    setIsLoading(true);
    setTimeout(() => {
      const filteredPosts = mockPosts.filter(
        post => post.category?.slug === slug || 
               post.tags?.some(tag => tag.slug === slug)
      );
      setPosts(filteredPosts);
      setIsLoading(false);
    }, 500);
  }, [slug]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
          {category.name}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg max-w-3xl">
          {category.description}
        </p>
        <div className="h-1 w-20 bg-indigo-600 mt-4"></div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : posts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map(post => (
            <BlogCard 
              key={post.id} 
              {...post} 
              variant="compact" 
            />
          ))}
        </div>
      ) : (
        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-10 text-center">
          <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">No posts found</h3>
          <p className="text-gray-600 dark:text-gray-400">There are no posts in this category yet.</p>
        </div>
      )}
    </div>
  );
};

export default CategoryPage; 