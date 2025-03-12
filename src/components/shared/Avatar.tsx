import React, { useState } from 'react';

interface AvatarProps {
  src: string | undefined;
  alt: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  fallbackClassName?: string;
}

const Avatar: React.FC<AvatarProps> = ({ 
  src, 
  alt, 
  size = 'md', 
  className = '',
  fallbackClassName = ''
}) => {
  const [hasError, setHasError] = useState(!src);
  
  // Get initials from name
  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  // Set size classes
  const sizeClasses = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg'
  };
  
  const baseClasses = `rounded-full overflow-hidden flex-shrink-0 ${sizeClasses[size]}`;
  const containerClasses = `${baseClasses} ${className}`;
  
  const fallbackBaseClasses = 'w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-medium';
  const fallbackClasses = `${fallbackBaseClasses} ${fallbackClassName}`;

  return (
    <div className={containerClasses}>
      {!hasError && src ? (
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
          onError={() => setHasError(true)}
        />
      ) : (
        <div className={fallbackClasses}>
          {getInitials(alt)}
        </div>
      )}
    </div>
  );
};

export default Avatar; 