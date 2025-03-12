import React from 'react';

type SpinnerSize = 'sm' | 'md' | 'lg' | 'xl';

interface SpinnerProps {
  size?: SpinnerSize;
  className?: string;
  light?: boolean;
  fullPage?: boolean;
  label?: string;
}

const sizeMap = {
  sm: 'h-4 w-4 border-2',
  md: 'h-6 w-6 border-2',
  lg: 'h-10 w-10 border-3',
  xl: 'h-16 w-16 border-4'
};

const Spinner: React.FC<SpinnerProps> = ({
  size = 'md',
  className = '',
  light = false,
  fullPage = false,
  label
}) => {
  const spinnerElement = (
    <div className={`${className} flex flex-col items-center justify-center`}>
      <div 
        className={`
          ${sizeMap[size]} 
          rounded-full 
          border-solid 
          border-gray-300 
          dark:border-gray-600 
          border-t-indigo-600 
          dark:border-t-indigo-400 
          animate-spin
        `}
      />
      {label && (
        <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">{label}</p>
      )}
    </div>
  );

  if (fullPage) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white/80 dark:bg-gray-900/80 z-50">
        {spinnerElement}
      </div>
    );
  }

  return spinnerElement;
};

export default Spinner; 