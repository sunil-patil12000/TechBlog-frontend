import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, Eye, Heart, BookOpen } from 'lucide-react';
import type { Article } from '../../types/blog';
import { useTheme } from '@/contexts/ThemeContext';
import { theme } from '../../styles/designTokens';
import Avatar from '../shared/Avatar';

interface ArticleCardProps {
  article: Article;
  view: 'grid' | 'list';
  priority?: boolean;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article, view, priority = false }) => {
  const { isDark } = useTheme();

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className={`
        group relative overflow-hidden rounded-xl bg-white dark:bg-gray-800 
        ${view === 'grid' ? 'flex flex-col' : 'flex flex-row items-start gap-6'}
        hover:shadow-lg transition-shadow duration-300
        border border-gray-100 dark:border-gray-700
      `}
    >
      {/* Image Container */}
      <Link 
        to={`/blog/${article.slug}`}
        className={`
          block overflow-hidden
          ${view === 'grid' ? 'aspect-[16/9]' : 'w-1/3 aspect-[4/3]'}
        `}
      >
        <motion.img
          loading={priority ? "eager" : "lazy"}
          src={article.thumbnail.url}
          alt={article.thumbnail.alt}
          className="w-full h-full object-cover transition-transform duration-500"
          whileHover={{ scale: 1.05 }}
        />
      </Link>

      {/* Content */}
      <div className={`
        flex flex-col
        ${view === 'grid' ? 'p-6' : 'flex-1 p-4'}
      `}>
        {/* Category & Meta */}
        <div className="flex items-center gap-3 mb-3">
          <Link
            to={`/category/${article.category.toLowerCase()}`}
            className="text-xs font-medium px-2.5 py-1 rounded-full
              bg-indigo-100 dark:bg-indigo-900 
              text-indigo-600 dark:text-indigo-300
              hover:bg-indigo-200 dark:hover:bg-indigo-800"
          >
            {article.category}
          </Link>
          <span className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
            <Clock size={14} />
            {article.readingTime} min read
          </span>
        </div>

        {/* Title */}
        <Link to={`/blog/${article.slug}`} className="group/title">
          <h2 className={`
            font-bold text-gray-900 dark:text-white mb-2
            group-hover/title:text-indigo-600 dark:group-hover/title:text-indigo-400
            ${view === 'grid' ? 'text-xl' : 'text-2xl'}
          `}>
            {article.title}
          </h2>
        </Link>

        {/* Excerpt */}
        <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
          {article.excerpt}
        </p>

        {/* Author & Stats */}
        <div className="mt-auto flex items-center justify-between">
          <Link to={`/author/${article.author.id}`} className="flex items-center gap-2">
            <Avatar
              src={article.author.avatar}
              alt={article.author.name}
              size="sm"
            />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
              {article.author.name}
            </span>
          </Link>

          <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-1">
              <Eye size={14} />
              {article.viewCount}
            </span>
            <span className="flex items-center gap-1">
              <Heart size={14} />
              {article.likes}
            </span>
          </div>
        </div>
      </div>
    </motion.article>
  );
};

export default ArticleCard;
