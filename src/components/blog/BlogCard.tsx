import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { Clock, ArrowRight } from 'lucide-react';
import { Post } from '../../data/posts';

interface BlogCardProps {
  post: Post;
  featured?: boolean;
}

const BlogCard: React.FC<BlogCardProps> = ({ post, featured = false }) => {
  return (
    <article 
      className={`group overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 bg-white dark:bg-gray-800/70 border border-gray-100 dark:border-gray-700/30 ${
        featured ? 'lg:flex' : ''
      }`}
    >
      <div className={`relative overflow-hidden ${featured ? 'lg:w-1/2' : ''}`}>
        <Link to={`/blog/${post.slug}`}>
          <img
            src={post.coverImage}
            alt={post.title}
            className={`w-full object-cover transform group-hover:scale-105 transition-transform duration-500 ease-out ${
              featured ? 'h-60 lg:h-full' : 'h-52'
            }`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </Link>
      </div>
      
      <div className={`p-6 ${featured ? 'lg:w-1/2 lg:p-8' : ''}`}>
        <div className="flex flex-wrap gap-2 mb-3">
          {post.categories.slice(0, 2).map((category) => (
            <Link
              key={category}
              to={`/archives?category=${category.toLowerCase().replace(' ', '-')}`}
              className="text-xs font-semibold px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-800/70 transition-colors"
            >
              {category}
            </Link>
          ))}
        </div>
        
        <Link to={`/blog/${post.slug}`} className="group/title block">
          <h2 className={`font-bold mb-3 text-gray-900 dark:text-white group-hover/title:text-indigo-600 dark:group-hover/title:text-indigo-400 transition-colors ${
            featured ? 'text-2xl lg:text-3xl' : 'text-xl'
          }`}>
            {post.title}
          </h2>
        </Link>
        
        <p className="text-gray-600 dark:text-gray-300 mb-5 line-clamp-3">
          {post.excerpt}
        </p>
        
        <div className="flex items-center justify-between mt-6">
          <div className="flex items-center">
            <img
              src={post.author.avatar}
              alt={post.author.name}
              className="w-9 h-9 rounded-full mr-3 object-cover ring-2 ring-gray-100 dark:ring-gray-700"
            />
            <div>
              <span className="block text-sm font-medium text-gray-900 dark:text-white">
                {post.author.name}
              </span>
              <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                <span>{format(new Date(post.date), 'MMM d, yyyy')}</span>
                <span className="mx-2">•</span>
                <Clock className="w-3.5 h-3.5 mr-1" />
                <span>{post.readTime} min</span>
              </div>
            </div>
          </div>
          
          <Link 
            to={`/blog/${post.slug}`} 
            className="flex items-center text-indigo-600 dark:text-indigo-400 text-sm font-medium group/arrow"
          >
            Read
            <ArrowRight className="ml-1 w-4 h-4 transform group-hover/arrow:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </article>
  );
};

export default BlogCard;