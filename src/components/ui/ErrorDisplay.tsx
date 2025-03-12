import React from 'react';
import { AlertTriangle, X, RefreshCw } from 'lucide-react';

interface ErrorDisplayProps {
  message: string;
  details?: string;
  onRetry?: () => void;
  onDismiss?: () => void;
  fullPage?: boolean;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  message,
  details,
  onRetry,
  onDismiss,
  fullPage = false
}) => {
  if (fullPage) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
          <div className="bg-red-50 dark:bg-red-900/20 p-4 flex items-center border-b border-red-100 dark:border-red-900/30">
            <AlertTriangle className="h-6 w-6 text-red-500 dark:text-red-400 mr-3" />
            <h3 className="text-lg font-medium text-red-800 dark:text-red-300">Error</h3>
            {onDismiss && (
              <button 
                onClick={onDismiss}
                className="ml-auto text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
              >
                <X className="h-5 w-5" />
                <span className="sr-only">Dismiss</span>
              </button>
            )}
          </div>
          
          <div className="p-6">
            <p className="text-gray-700 dark:text-gray-300 mb-4">{message}</p>
            {details && (
              <div className="mt-2 text-sm text-gray-500 dark:text-gray-400 border-l-4 border-red-200 dark:border-red-900/30 pl-3">
                {details}
              </div>
            )}
            
            <div className="mt-6 flex justify-end gap-3">
              {onRetry && (
                <button
                  onClick={onRetry}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:focus:ring-offset-gray-800"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Try Again
                </button>
              )}
              
              {onDismiss && (
                <button
                  onClick={onDismiss}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md shadow-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
                >
                  Dismiss
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 rounded-lg p-4 mb-6">
      <div className="flex">
        <AlertTriangle className="h-5 w-5 text-red-500 dark:text-red-400 mr-3 flex-shrink-0" />
        <div className="flex-1">
          <h3 className="text-sm font-medium text-red-800 dark:text-red-300">
            {message}
          </h3>
          {details && (
            <p className="mt-2 text-sm text-red-700 dark:text-red-400">
              {details}
            </p>
          )}
          <div className="mt-3 flex gap-3">
            {onRetry && (
              <button
                onClick={onRetry}
                className="inline-flex items-center text-sm text-red-700 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 font-medium"
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                Try Again
              </button>
            )}
          </div>
        </div>
        {onDismiss && (
          <button 
            onClick={onDismiss}
            className="text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
          >
            <X className="h-5 w-5" />
            <span className="sr-only">Dismiss</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorDisplay; 