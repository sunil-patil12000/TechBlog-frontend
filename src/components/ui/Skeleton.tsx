import React from 'react';
import { motion } from 'framer-motion';

type SkeletonVariant = 
  | 'text' 
  | 'circle' 
  | 'rectangle' 
  | 'avatar' 
  | 'card' 
  | 'title' 
  | 'paragraph'
  | 'thumbnail'
  | 'button'
  | 'banner';

type SkeletonProps = {
  variant?: SkeletonVariant;
  width?: string | number;
  height?: string | number;
  className?: string;
  count?: number;
  animate?: boolean;
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
};

const Skeleton: React.FC<SkeletonProps> = ({
  variant = 'rectangle',
  width,
  height,
  className = '',
  count = 1,
  animate = true,
  rounded = 'md',
}) => {
  // Determine base classes based on variant
  const getBaseClasses = () => {
    const baseClasses = 'bg-gray-200 dark:bg-gray-700';
    
    // Add rounded corners based on prop
    const roundedClass = rounded === 'none' 
      ? '' 
      : rounded === 'full' 
        ? 'rounded-full' 
        : `rounded-${rounded}`;
        
    return `${baseClasses} ${roundedClass}`;
  };
  
  // Get dimension classes or styles based on variant and props
  const getDimensions = () => {
    let dimensionClasses = '';
    let customStyles = {};
    
    // If width/height are provided, use them as styles
    if (width || height) {
      customStyles = {
        width: width || 'auto',
        height: height || 'auto'
      };
    } else {
      // Otherwise use preset dimensions based on variant
      switch (variant) {
        case 'text':
          dimensionClasses = 'h-4 w-2/3';
          break;
        case 'title':
          dimensionClasses = 'h-7 w-3/4';
          break;
        case 'paragraph':
          dimensionClasses = 'h-4 w-full';
          break;
        case 'circle':
          dimensionClasses = 'h-12 w-12 rounded-full';
          break;
        case 'avatar':
          dimensionClasses = 'h-10 w-10 rounded-full';
          break;
        case 'thumbnail':
          dimensionClasses = 'h-48 w-full';
          break;
        case 'card':
          dimensionClasses = 'h-64 w-full';
          break;
        case 'button':
          dimensionClasses = 'h-10 w-24';
          break;
        case 'banner':
          dimensionClasses = 'h-40 w-full';
          break;
        default:
          dimensionClasses = 'h-24 w-full';
      }
    }
    
    return { dimensionClasses, customStyles };
  };
  
  // Create multiple skeleton items if count > 1
  const renderItems = () => {
    const items = [];
    const { dimensionClasses, customStyles } = getDimensions();
    const baseClasses = getBaseClasses();
    
    for (let i = 0; i < count; i++) {
      if (variant === 'paragraph' && i > 0) {
        // Make paragraph lines have varying widths
        const widthClass = i % 3 === 0 ? 'w-full' : i % 3 === 1 ? 'w-5/6' : 'w-4/5';
        items.push(
          <motion.div
            key={i}
            className={`${baseClasses} ${className} ${widthClass} h-4 mb-2`}
            style={customStyles}
            animate={animate ? { opacity: [0.7, 0.9, 0.7] } : {}}
            transition={animate ? { repeat: Infinity, duration: 1.5 } : {}}
          />
        );
      } else {
        items.push(
          <motion.div
            key={i}
            className={`${baseClasses} ${dimensionClasses} ${className} ${i > 0 ? 'mt-2' : ''}`}
            style={customStyles}
            animate={animate ? { opacity: [0.7, 0.9, 0.7] } : {}}
            transition={animate ? { repeat: Infinity, duration: 1.5 } : {}}
          />
        );
      }
    }
    
    return items;
  };
  
  return <>{renderItems()}</>;
};

// Compound components for more readable usage
Skeleton.Text = (props: Omit<SkeletonProps, 'variant'>) => <Skeleton variant="text" {...props} />;
Skeleton.Title = (props: Omit<SkeletonProps, 'variant'>) => <Skeleton variant="title" {...props} />;
Skeleton.Circle = (props: Omit<SkeletonProps, 'variant'>) => <Skeleton variant="circle" {...props} />;
Skeleton.Avatar = (props: Omit<SkeletonProps, 'variant'>) => <Skeleton variant="avatar" {...props} />;
Skeleton.Paragraph = (props: Omit<SkeletonProps, 'variant'>) => <Skeleton variant="paragraph" {...props} />;
Skeleton.Card = (props: Omit<SkeletonProps, 'variant'>) => <Skeleton variant="card" {...props} />;
Skeleton.Thumbnail = (props: Omit<SkeletonProps, 'variant'>) => <Skeleton variant="thumbnail" {...props} />;
Skeleton.Button = (props: Omit<SkeletonProps, 'variant'>) => <Skeleton variant="button" {...props} />;
Skeleton.Banner = (props: Omit<SkeletonProps, 'variant'>) => <Skeleton variant="banner" {...props} />;

// Common patterns as helper components
Skeleton.BlogCard = () => (
  <div className="bg-white dark:bg-gray-800 p-5 rounded-lg border border-gray-200 dark:border-gray-700">
    <Skeleton.Thumbnail className="mb-4" />
    <Skeleton.Title className="mb-2" />
    <Skeleton.Paragraph count={2} className="mb-3" />
    <div className="flex justify-between items-center">
      <div className="flex items-center">
        <Skeleton.Avatar className="mr-3" />
        <Skeleton.Text width={100} />
      </div>
      <Skeleton.Text width={60} />
    </div>
  </div>
);

Skeleton.ArticleHeader = () => (
  <div className="max-w-screen-lg mx-auto px-4">
    <Skeleton.Text width={200} className="mb-3" />
    <Skeleton.Title height={50} className="mb-4" />
    <Skeleton.Paragraph count={1} className="mb-6" />
    <Skeleton.Banner className="mb-6" />
    <div className="flex justify-between items-center py-4 border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center">
        <Skeleton.Avatar className="mr-3" />
        <div>
          <Skeleton.Text width={120} className="mb-1" />
          <Skeleton.Text width={80} height={10} />
        </div>
      </div>
      <div className="flex space-x-2">
        <Skeleton.Circle width={35} height={35} />
        <Skeleton.Circle width={35} height={35} />
        <Skeleton.Circle width={35} height={35} />
      </div>
    </div>
  </div>
);

export default Skeleton; 