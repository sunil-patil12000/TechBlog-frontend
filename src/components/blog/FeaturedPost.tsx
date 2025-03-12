import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { ArrowRight, Star } from 'lucide-react';
import { Post } from '../../data/posts';
import Avatar from '../shared/Avatar';

interface FeaturedPostProps {
  post: Post;
}

const FeaturedPost: React.FC<FeaturedPostProps> = ({ post }) => {  
  return (
    <article className="relative overflow-hidden bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-gray-800 rounded-lg border-l-4 border-indigo-500 shadow-lg hover:shadow-xl transition-all duration-300">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-full -mr-8 -mt-8"></div>
      <div className="absolute bottom-0 left-1/2 w-16 h-16 bg-pink-500/10 rounded-full -mb-8"></div>
      
      <div className="flex flex-col md:flex-row">
        {/* Left side - Image with overlay gradient */}
        <div className="md:w-2/5 h-64 md:h-auto relative overflow-hidden">
          <div className="absolute inset-0 bg-indigo-600 mix-blend-multiply opacity-10"></div>
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover"
          />
          {/* Featured badge - stylized */}
          <div className="absolute top-4 left-0 bg-indigo-600 text-white text-xs font-bold pl-4 pr-5 py-1.5 rounded-r-full flex items-center shadow-md">
            <Star className="w-3.5 h-3.5 mr-1.5 fill-white" />
            Featured Pick
          </div>
        </div>
        
        {/* Right side - Content with asymmetric design */}
        <div className="md:w-3/5 p-5 md:p-6 flex flex-col relative">
          {/* Curved divider for visual interest */}
          <div className="hidden md:block absolute top-0 left-0 h-full w-8 overflow-hidden">
            <div className="h-full w-16 bg-gradient-to-r from-indigo-50 to-transparent dark:from-slate-800 dark:to-transparent rounded-l-full"></div>
          </div>
          
          {/* Category tag */}
          {post.categories.length > 0 && (
            <span className="inline-block text-xs font-semibold text-indigo-600 dark:text-indigo-400 tracking-wider uppercase mb-2">
              {post.categories[0]}
            </span>
          )}
          
          {/* Title with creative typography */}
          <Link to={`/blog/${post.slug}`} className="group">
            <h2 className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 leading-tight group-hover:from-indigo-600 group-hover:to-purple-600 transition-all duration-300 mb-3">
              {post.title}
            </h2>
          </Link>
          
          {/* Excerpt with styled first letter */}
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 relative">
            <span className="float-left text-2xl font-bold text-indigo-500 mr-1 mt-1">{post.excerpt.charAt(0)}</span>
            {post.excerpt.substring(1, 120)}...
          </p>
          
          {/* Author info with styled border */}
          <div className="flex items-center mt-auto mb-4 pb-4 border-b border-gray-100 dark:border-gray-700">
            {/* Using the new Avatar component */}
            <Avatar 
              src={post.author.avatar} 
              alt={post.author.name}
              size="md"
              className="ring-2 ring-indigo-100 dark:ring-indigo-900"
            />
            
            <div className="ml-3">
              <span className="block text-gray-800 dark:text-white text-sm font-medium">
                {post.author.name}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {format(new Date(post.date), 'MMM d, yyyy')} • {post.readTime} min read
              </span>
            </div>
          </div>
          
          {/* Read button with animated arrow */}
          <div className="flex justify-end">
            <Link 
              to={`/blog/${post.slug}`}
              className="group flex items-center text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors"
            >
              Continue Reading
              <span className="inline-block ml-1 transform group-hover:translate-x-1 transition-transform duration-200">
                <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
};

export default FeaturedPost;