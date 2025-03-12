import React from 'react';
import { Link } from 'react-router-dom';

interface TagProps {
  name: string;
  count?: number;
  href?: string;
  variant?: 'default' | 'small' | 'large';
  color?: 'default' | 'blue' | 'green' | 'red' | 'purple' | 'yellow';
  onClick?: () => void;
}

const Tag: React.FC<TagProps> = ({
  name,
  count,
  href,
  variant = 'default',
  color = 'default',
  onClick
}) => {
  // Size classes based on variant
  const sizeClasses = {
    small: 'text-xs py-1 px-2',
    default: 'text-sm py-1 px-3',
    large: 'text-sm py-2 px-4'
  };
  
  // Color classes
  const colorClasses = {
    default: 'bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-300',
    blue: 'bg-blue-100 hover:bg-blue-200 text-blue-700 dark:bg-blue-900/30 dark:hover:bg-blue-800/40 dark:text-blue-300',
    green: 'bg-green-100 hover:bg-green-200 text-green-700 dark:bg-green-900/30 dark:hover:bg-green-800/40 dark:text-green-300',
    red: 'bg-red-100 hover:bg-red-200 text-red-700 dark:bg-red-900/30 dark:hover:bg-red-800/40 dark:text-red-300',
    purple: 'bg-purple-100 hover:bg-purple-200 text-purple-700 dark:bg-purple-900/30 dark:hover:bg-purple-800/40 dark:text-purple-300',
    yellow: 'bg-yellow-100 hover:bg-yellow-200 text-yellow-700 dark:bg-yellow-900/30 dark:hover:bg-yellow-800/40 dark:text-yellow-300'
  };
  
  const classes = `
    inline-flex items-center rounded-full font-medium transition-colors
    ${sizeClasses[variant]} 
    ${colorClasses[color]}
  `;
  
  const content = (
    <>
      <span>{name}</span>
      {count !== undefined && (
        <span className="ml-1 text-xs opacity-70">({count})</span>
      )}
    </>
  );
  
  if (href) {
    return (
      <Link to={href} className={classes} onClick={onClick}>
        {content}
      </Link>
    );
  }
  
  return (
    <span className={classes} onClick={onClick}>
      {content}
    </span>
  );
};

export default Tag;
