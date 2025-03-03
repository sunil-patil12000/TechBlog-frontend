import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { Clock, ArrowRight } from 'lucide-react';
import { Post } from '../../data/posts';

interface FeaturedPostProps {
  post: Post;
}

const FeaturedPost: React.FC<FeaturedPostProps> = ({ post }) => {
  return (
    <article className="relative overflow-hidden rounded-2xl shadow-2xl group">
      <div className="absolute inset-0">
        <img
          src={post.coverImage}
          alt={post.title}
          className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent"></div>
      </div>
      
      <div className="relative p-6 md:p-8 lg:p-12 flex flex-col h-full min-h-[550px] justify-end">
        <span className="inline-flex mb-6 bg-indigo-600/90 text-white text-xs font-semibold px-3 py-1 rounded-full backdrop-blur-sm">
          Featured
        </span>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {post.categories.map((category) => (
            <Link
              key={category}
              to={`/archives?category=${category.toLowerCase().replace(' ', '-')}`}
              className="text-xs font-medium px-3 py-1 rounded-full bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm transition-colors"
            >
              {category}
            </Link>
          ))}
        </div>
        
        <Link to={`/blog/${post.slug}`} className="group/title">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight group-hover/title:text-indigo-200 transition-colors duration-300">
            {post.title}
          </h2>
        </Link>
        
        <p className="text-gray-100 mb-8 text-lg max-w-3xl leading-relaxed opacity-90">
          {post.excerpt}
        </p>
        
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center">
            <img
              src={post.author.avatar}
              alt={post.author.name}
              className="w-12 h-12 rounded-full mr-3 object-cover border-2 border-white/50"
            />
            <div>
              <span className="block text-white font-medium">
                {post.author.name}
              </span>
              <span className="text-gray-300 text-sm">
                {format(new Date(post.date), 'MMM d, yyyy')}
              </span>
            </div>
          </div>
          
          <div className="flex items-center text-gray-300 bg-black/30 px-3 py-1.5 rounded-full backdrop-blur-sm">
            <Clock className="w-4 h-4 mr-1" />
            <span>{post.readTime} min read</span>
          </div>
        </div>
        
        <Link 
          to={`/blog/${post.slug}`}
          className="mt-8 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-md text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 ease-in-out w-fit group/btn"
        >
          Read Article
          <ArrowRight className="ml-2 w-5 h-5 transform group-hover/btn:translate-x-1 transition-transform" />
        </Link>
      </div>
    </article>
  );
};

export default FeaturedPost;