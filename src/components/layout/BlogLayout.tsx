import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';

// Layout variations
export type LayoutVariant = 'standard' | 'grid' | 'magazine';

interface BlogLayoutProps {
  children: ReactNode;
  variant?: LayoutVariant;
  sidebar?: ReactNode;
  header?: ReactNode;
  footer?: ReactNode;
  fullWidth?: boolean;
}

/**
 * BlogLayout component that provides different layout variations for the blog
 */
const BlogLayout: React.FC<BlogLayoutProps> = ({
  children,
  variant = 'standard',
  sidebar,
  header,
  footer,
  fullWidth = false,
}) => {
  // Animation variants for the content
  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  // Render different layouts based on the variant
  const renderLayout = () => {
    switch (variant) {
      case 'grid':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {children}
          </div>
        );
      
      case 'magazine':
        // Special magazine-style layout with featured items
        return (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Main content area taking 8 columns */}
            <div className="lg:col-span-8 space-y-6">
              {React.Children.toArray(children)[0]}
            </div>
            
            {/* Secondary content area taking 4 columns */}
            <div className="lg:col-span-4 space-y-6">
              {React.Children.toArray(children).slice(1)}
            </div>
          </div>
        );
      
      case 'standard':
      default:
        // Standard blog layout with optional sidebar
        return (
          <div className={`flex flex-col lg:flex-row gap-8 ${sidebar ? 'lg:space-x-8' : ''}`}>
            <main className={sidebar ? 'lg:w-2/3' : 'w-full'}>
              <motion.div
                variants={contentVariants}
                initial="hidden"
                animate="visible"
                className="space-y-8"
              >
                {children}
              </motion.div>
            </main>
            
            {sidebar && (
              <aside className="lg:w-1/3">
                {sidebar}
              </aside>
            )}
          </div>
        );
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Optional header component */}
      {header && <div className="mb-8">{header}</div>}
      
      {/* Main content container */}
      <div className={`px-4 py-8 mx-auto ${fullWidth ? 'container-fluid' : 'container'}`}>
        {renderLayout()}
      </div>
      
      {/* Optional footer component */}
      {footer && <div className="mt-8">{footer}</div>}
    </div>
  );
};

/**
 * BlogGrid component for creating responsive grid layouts
 */
export const BlogGrid: React.FC<{
  children: ReactNode;
  columns?: {
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  gap?: 'sm' | 'md' | 'lg';
  className?: string;
}> = ({
  children,
  columns = { sm: 1, md: 2, lg: 3, xl: 3 },
  gap = 'md',
  className = '',
}) => {
  // Convert columns to tailwind classes
  const getColumnsClass = () => {
    const colClasses = [];
    
    if (columns.sm) colClasses.push(`grid-cols-${columns.sm}`);
    if (columns.md) colClasses.push(`md:grid-cols-${columns.md}`);
    if (columns.lg) colClasses.push(`lg:grid-cols-${columns.lg}`);
    if (columns.xl) colClasses.push(`xl:grid-cols-${columns.xl}`);
    
    return colClasses.join(' ');
  };
  
  // Get gap class
  const getGapClass = () => {
    switch (gap) {
      case 'sm': return 'gap-4';
      case 'lg': return 'gap-8';
      case 'md':
      default: return 'gap-6';
    }
  };
  
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0 },
        visible: { 
          opacity: 1,
          transition: { staggerChildren: 0.1 }
        }
      }}
      initial="hidden"
      animate="visible"
      className={`grid ${getColumnsClass()} ${getGapClass()} ${className}`}
    >
      {React.Children.map(children, child => (
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 }
          }}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
};

/**
 * BlogFeaturedSection component for featured content with hero layout
 */
export const BlogFeaturedSection: React.FC<{
  mainFeature: ReactNode;
  secondaryFeatures?: ReactNode[];
  className?: string;
}> = ({
  mainFeature,
  secondaryFeatures = [],
  className = '',
}) => {
  return (
    <div className={`mb-12 ${className}`}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main featured item */}
        <div className="lg:col-span-7 xl:col-span-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {mainFeature}
          </motion.div>
        </div>
        
        {/* Secondary featured items in a column */}
        {secondaryFeatures.length > 0 && (
          <div className="lg:col-span-5 xl:col-span-4 space-y-6">
            {secondaryFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 + (index * 0.1) }}
              >
                {feature}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogLayout; 