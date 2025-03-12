import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangleIcon, RefreshCwIcon } from 'lucide-react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onReset?: () => void;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * ErrorBoundary component that catches JavaScript errors anywhere in its child component tree,
 * logs those errors, and displays a fallback UI instead of the component tree that crashed.
 */
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
    
    // Call onError callback if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  private handleReset = (): void => {
    // Reset the error boundary state
    this.setState({ hasError: false, error: null });
    
    // Call onReset callback if provided
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  public render(): ReactNode {
    if (this.state.hasError) {
      // Render custom fallback UI if provided, otherwise render default fallback
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="bg-white dark:bg-gray-900 border border-red-100 dark:border-red-900/30 rounded-lg p-6 my-4 text-center">
          <div className="flex flex-col items-center justify-center">
            <div className="bg-red-100 dark:bg-red-900/30 rounded-full p-4 mb-4">
              <AlertTriangleIcon className="h-6 w-6 text-red-600 dark:text-red-400" aria-hidden="true" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Something went wrong
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4 max-w-md">
              An error occurred while rendering this component. We've been notified and will fix the issue as soon as possible.
            </p>
            <details className="mb-4 text-left w-full max-w-md">
              <summary className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
                Error details
              </summary>
              <pre className="mt-2 p-3 text-xs bg-gray-100 dark:bg-gray-800 rounded overflow-auto max-h-40">
                {this.state.error?.toString() || 'Unknown error'}
              </pre>
            </details>
            <button
              onClick={this.handleReset}
              className="flex items-center px-4 py-2 rounded-md bg-primary-600 hover:bg-primary-700 text-white font-medium transition-colors"
            >
              <RefreshCwIcon className="h-4 w-4 mr-2" aria-hidden="true" />
              Try again
            </button>
          </div>
        </div>
      );
    }

    // When there's no error, render children normally
    return this.props.children;
  }
}

/**
 * Component-specific error boundary HOC
 */
export const withErrorBoundary = <P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<ErrorBoundaryProps, 'children'>
): React.FC<P> => {
  const WrappedComponent: React.FC<P> = (props) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );
  
  // Set display name for debugging
  const displayName = Component.displayName || Component.name || 'Component';
  WrappedComponent.displayName = `withErrorBoundary(${displayName})`;
  
  return WrappedComponent;
};

export default ErrorBoundary;
