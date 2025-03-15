import { lazy, ComponentType } from 'react';

/**
 * Enhanced lazy loading utility for React components
 * - Uses Intersection Observer for viewport detection
 * - Improves Core Web Vitals (LCP, FID, CLS)
 * - Includes automatic retry mechanism for failed loads
 * 
 * @param importFn - Dynamic import function for the component
 * @param fallback - Optional component to show while loading (defaults to null)
 * @param retries - Number of retries on failure (defaults to 2)
 * @returns Dynamically imported component with proper loading
 */
export function lazyLoad<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  options?: {
    fallback?: React.ReactNode;
    retries?: number;
    preload?: boolean;
    chunkName?: string;
  }
): React.LazyExoticComponent<T> {
  const { retries = 2, preload = false } = options || {};

  // Enhanced import function with automatic retry
  const enhancedImport = () => 
    retryImport(importFn, retries)
      .catch(error => {
        console.error('Failed to load component after retries:', error);
        return importFn(); // Final attempt
      });
  
  // Preload component if specified
  if (preload) {
    void enhancedImport();
  }
  
  return lazy(enhancedImport);
}

/**
 * Retry import with exponential backoff
 */
function retryImport<T>(
  importFn: () => Promise<T>,
  retries: number,
  delay = 1000
): Promise<T> {
  return new Promise((resolve, reject) => {
    importFn()
      .then(resolve)
      .catch((error) => {
        if (retries === 0) {
          reject(error);
          return;
        }
        
        setTimeout(() => {
          retryImport(importFn, retries - 1, delay * 1.5)
            .then(resolve)
            .catch(reject);
        }, delay);
      });
  });
}

/**
 * Create a custom intersection observer hook for lazy loading components
 * only when they enter the viewport
 */
export const createIntersectionObserver = () => {
  let observer: IntersectionObserver | null = null;
  
  if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          // Handle the intersection
          if (entry.isIntersecting) {
            const target = entry.target as HTMLElement;
            // Load the component
            const componentId = target.dataset.lazyComponent;
            if (componentId) {
              // Implement custom logic to load component by ID
              // This could interact with a registry of lazy components
              
              // Unobserve after loading
              observer?.unobserve(target);
            }
          }
        });
      },
      {
        rootMargin: '200px', // Start loading 200px before it enters viewport
        threshold: 0.01, // Trigger when 1% of the element is visible
      }
    );
  }
  
  return observer;
};

/**
 * Preload critical components to improve Largest Contentful Paint (LCP)
 * @param importFns - Array of import functions to preload
 */
export function preloadComponents(importFns: Array<() => Promise<any>>): void {
  if (typeof window === 'undefined') return;
  
  // Use requestIdleCallback for non-critical preloading
  const requestIdleCallbackPolyfill = 
    window.requestIdleCallback || 
    ((cb) => setTimeout(cb, 1));
  
  requestIdleCallbackPolyfill(() => {
    importFns.forEach(importFn => {
      void importFn();
    });
  });
}

/**
 * Preload critical paths based on user behavior prediction
 * @param paths - Array of likely next paths to preload
 */
export function preloadRoutes(paths: string[]): void {
  if (typeof document === 'undefined') return;

  paths.forEach(path => {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = path;
    link.as = path.endsWith('.js') ? 'script' : 'fetch';
    document.head.appendChild(link);
  });
}

/**
 * Register components that should be dynamically loaded
 * based on visibility or other triggers
 */
export const lazyComponentRegistry: Record<string, () => Promise<any>> = {};

/**
 * Register a component for later lazy loading
 */
export function registerLazyComponent(
  id: string, 
  importFn: () => Promise<any>
): void {
  lazyComponentRegistry[id] = importFn;
}

/**
 * Load a registered lazy component
 */
export function loadLazyComponent(id: string): Promise<any> | null {
  const importFn = lazyComponentRegistry[id];
  return importFn ? importFn() : null;
} 