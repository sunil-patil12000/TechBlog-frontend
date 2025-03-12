import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import type { Article } from '../../types/blog';
import { theme } from '../../styles/designTokens';

interface RelatedPostsProps {
  currentPost: Article;
  recommendations: Article[];
}

const RelatedPosts: React.FC<RelatedPostsProps> = ({ currentPost, recommendations }) => {
  return (
    <aside className="mt-12 pt-12 border-t border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-2 mb-6">
        <Sparkles className="w-5 h-5 text-indigo-500" />
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Recommended for You
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recommendations.map((post, index) => (
          <motion.article
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group relative flex flex-col rounded-lg overflow-hidden bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-shadow"
          >
            <Link to={`/blog/${post.slug}`} className="relative aspect-[16/9] overflow-hidden">
              <img
                src={post.thumbnail.url}
                alt={post.thumbnail.alt}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>

            <div className="flex-1 p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300">
                  {post.category}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {post.readingTime} min read
                </span>
              </div>

              <Link to={`/blog/${post.slug}`}>
                <h3 className="font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                  {post.title}
                </h3>
              </Link>

              <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-4">
                {post.excerpt}
              </p>

              <div className="flex items-center mt-auto">
                <img
                  src={post.author.avatar}
                  alt={post.author.name}
                  className="w-6 h-6 rounded-full mr-2"
                />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {post.author.name}
                </span>
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </aside>
  );
};

export default RelatedPosts;
