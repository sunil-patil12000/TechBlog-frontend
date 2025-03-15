 import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { BreadcrumbItem } from '../utils/SEO';

interface BreadcrumbNavProps {
  items: BreadcrumbItem[];
  className?: string;
  itemClassName?: string;
  separatorClassName?: string;
  homeIcon?: boolean;
}

/**
 * BreadcrumbNav component for improved navigation and SEO
 * Includes structured data attributes for search engines
 */
const BreadcrumbNav: React.FC<BreadcrumbNavProps> = ({
  items,
  className = 'flex items-center flex-wrap py-3 text-sm',
  itemClassName = 'text-gray-700 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400 transition-colors',
  separatorClassName = 'mx-2 text-gray-400 dark:text-gray-500',
  homeIcon = true,
}) => {
  // Don't render if no items provided
  if (!items || items.length === 0) return null;
  
  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol
        className="flex items-center flex-wrap"
        itemScope
        itemType="https://schema.org/BreadcrumbList"
      >
        {/* Home link is always first */}
        <li
          itemProp="itemListElement"
          itemScope
          itemType="https://schema.org/ListItem"
          className="flex items-center"
        >
          <Link 
            to="/"
            className={itemClassName}
            itemProp="item"
          >
            {homeIcon ? <Home size={16} aria-hidden="true" /> : <span itemProp="name">Home</span>}
            <meta itemProp="position" content="1" />
          </Link>
          
          <ChevronRight 
            size={14} 
            className={separatorClassName} 
            aria-hidden="true"
          />
        </li>
        
        {/* Map through provided breadcrumb items */}
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const position = index + 2; // +2 because Home is position 1
          
          return (
            <li
              key={`${item.url}-${index}`}
              itemProp="itemListElement"
              itemScope
              itemType="https://schema.org/ListItem"
              className="flex items-center"
            >
              {isLast ? (
                <span
                  className="font-medium text-gray-800 dark:text-gray-200"
                  itemProp="name"
                  aria-current="page"
                >
                  {item.name}
                </span>
              ) : (
                <>
                  <Link
                    to={item.url}
                    className={itemClassName}
                    itemProp="item"
                  >
                    <span itemProp="name">{item.name}</span>
                  </Link>
                  
                  <ChevronRight 
                    size={14} 
                    className={separatorClassName} 
                    aria-hidden="true"
                  />
                </>
              )}
              
              <meta itemProp="position" content={position.toString()} />
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default BreadcrumbNav; 