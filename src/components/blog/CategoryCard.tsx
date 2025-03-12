import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';

interface CategoryCardProps {
  name: string;
  slug: string;
  description: string;
  postCount?: number;
  icon?: string;
  image?: string;
}

const CategoryCard: React.FC<CategoryCardProps> = ({
  name,
  slug,
  description,
  postCount = 0,
  icon = 'FileText',
  image
}) => {
  // Safely get icon from lucide-react
  const IconComponent = icon in Icons 
    ? Icons[icon as keyof typeof Icons] 
    : Icons.FileText;

  return (
    <motion.div
      whileHover={{ 
        y: -5,
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
      }}
      className="bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-100 dark:border-gray-800 transition-all duration-300"
    >
      <Link to={`/category/${slug}`} className="block">
        <div className="flex flex-col items-center text-center">
          <div className="w-12 h-12 flex items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 mb-3">
            {image ? (
              <img
                src={image}
                alt={name}
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              <IconComponent className="w-6 h-6" />
            )}
          </div>
          <h3 className="font-medium text-gray-900 dark:text-white mb-1">{name}</h3>
          {description && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">{description}</p>
          )}
          <p className="text-sm text-gray-500 dark:text-gray-400">{postCount} articles</p>
        </div>
      </Link>
    </motion.div>
  );
};

export default CategoryCard; 