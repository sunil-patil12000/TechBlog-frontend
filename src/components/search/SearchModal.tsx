import React, { useState, useEffect, useRef, forwardRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { SearchIcon, XIcon, ArrowRightIcon, LoaderIcon } from 'lucide-react';
import debounce from 'lodash.debounce';
import { useHotkeys } from 'react-hotkeys-hook';

type SearchResult = {
  id: string;
  title: string;
  excerpt: string;
  url: string;
  type: 'post' | 'page' | 'project';
  tags?: string[];
};

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSearch: (query: string) => void;
}

const SearchModal = forwardRef<HTMLInputElement, SearchModalProps>(({ 
  isOpen, 
  onClose,
  onSearch
}, ref) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedResultIndex, setSelectedResultIndex] = useState(0);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }

    // Clear search when modal closes
    if (!isOpen) {
      setQuery('');
      setResults([]);
      setSelectedResultIndex(0);
    }
  }, [isOpen]);

  // Handle debounced search
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useRef(
    debounce(async (query: string) => {
      if (!query || query.length < 2) {
        setResults([]);
        setIsLoading(false);
        return;
      }

      try {
        // This would be replaced with an actual API call
        // For now, simulate an API call with a timeout
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Mock results - replace with actual API call
        const mockResults: SearchResult[] = [
          {
            id: '1',
            title: 'Getting Started with React',
            excerpt: 'A beginners guide to React development...',
            url: '/blog/getting-started-with-react',
            type: 'post',
            tags: ['react', 'javascript', 'frontend']
          },
          {
            id: '2',
            title: 'Advanced TypeScript Techniques',
            excerpt: 'Master the advanced features of TypeScript...',
            url: '/blog/advanced-typescript-techniques',
            type: 'post',
            tags: ['typescript', 'javascript', 'advanced']
          },
          {
            id: '3',
            title: 'About the Author',
            excerpt: 'Learn more about the blog author and their work...',
            url: '/about',
            type: 'page'
          },
          {
            id: '4',
            title: 'Portfolio Project: E-commerce Site',
            excerpt: 'A case study of building an e-commerce platform...',
            url: '/projects/ecommerce-case-study',
            type: 'project',
            tags: ['case study', 'e-commerce', 'full-stack']
          }
        ].filter(result => 
          result.title.toLowerCase().includes(query.toLowerCase()) || 
          result.excerpt.toLowerCase().includes(query.toLowerCase()) ||
          result.tags?.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
        );

        setResults(mockResults);
      } catch (error) {
        console.error('Search error:', error);
        // Handle error state
      } finally {
        setIsLoading(false);
      }
    }, 300)
  ).current;

  // Trigger search when query changes
  useEffect(() => {
    if (query.length >= 2) {
      setIsLoading(true);
      debouncedSearch(query);
    } else {
      setResults([]);
    }

    return () => {
      debouncedSearch.cancel();
    };
  }, [query, debouncedSearch]);

  // Handle keyboard navigation
  useHotkeys('esc', () => onClose(), { enableOnFormTags: true });
  useHotkeys('down', () => {
    if (results.length > 0) {
      setSelectedResultIndex(prev => (prev < results.length - 1 ? prev + 1 : prev));
    }
  }, { enableOnFormTags: true });
  useHotkeys('up', () => {
    setSelectedResultIndex(prev => (prev > 0 ? prev - 1 : 0));
  }, { enableOnFormTags: true });
  useHotkeys('enter', () => {
    if (results.length > 0 && results[selectedResultIndex]) {
      navigateToResult(results[selectedResultIndex]);
    }
  }, { enableOnFormTags: true });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  const navigateToResult = (result: SearchResult) => {
    navigate(result.url);
    onClose();
  };

  const getResultTypeColor = (type: string) => {
    switch (type) {
      case 'post':
        return 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300';
      case 'page':
        return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
      case 'project':
        return 'bg-secondary-100 text-secondary-700 dark:bg-secondary-900 dark:text-secondary-300';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            className="relative top-20 mx-auto max-w-2xl bg-white dark:bg-gray-800 rounded-xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <form onSubmit={handleSubmit} className="p-4">
              <div className="flex items-center space-x-2">
                <SearchIcon className="text-gray-400 w-5 h-5" />
                <input
                  ref={ref}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search articles, tutorials, and resources..."
                  className="w-full bg-transparent text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none text-lg"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={onClose}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                  <XIcon className="w-5 h-5" />
                </button>
              </div>
            </form>

            {/* Results */}
            <div className="max-h-[60vh] overflow-y-auto">
              {query.length >= 2 && results.length === 0 && !isLoading && (
                <div className="py-8 px-4 text-center text-gray-500 dark:text-gray-400">
                  No results found for "{query}"
                </div>
              )}

              {results.length > 0 && (
                <ul className="py-2">
                  {results.map((result, index) => (
                    <li key={result.id}>
                      <button
                        className={`w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                          selectedResultIndex === index 
                            ? 'bg-gray-50 dark:bg-gray-800' 
                            : ''
                        }`}
                        onClick={() => navigateToResult(result)}
                        onMouseEnter={() => setSelectedResultIndex(index)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getResultTypeColor(result.type)}`}>
                                {result.type.charAt(0).toUpperCase() + result.type.slice(1)}
                              </span>
                              {result.tags && result.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1">
                                  {result.tags.slice(0, 2).map(tag => (
                                    <span 
                                      key={tag} 
                                      className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                                    >
                                      {tag}
                                    </span>
                                  ))}
                                  {result.tags.length > 2 && (
                                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                                      +{result.tags.length - 2}
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                            <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                              {result.title}
                            </h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">
                              {result.excerpt}
                            </p>
                          </div>
                          <ArrowRightIcon className="h-4 w-4 text-gray-400 flex-shrink-0 ml-2" />
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Footer with keyboard shortcuts */}
            <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-3 text-xs text-gray-500 dark:text-gray-400">
              <div className="flex justify-between items-center">
                <div>
                  <span className="mr-3">
                    <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded border border-gray-300 dark:border-gray-700 font-mono">↑</kbd>
                    <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded border border-gray-300 dark:border-gray-700 font-mono ml-1">↓</kbd>
                    <span className="ml-1">to navigate</span>
                  </span>
                  <span>
                    <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded border border-gray-300 dark:border-gray-700 font-mono">Enter</kbd>
                    <span className="ml-1">to select</span>
                  </span>
                </div>
                <span>
                  <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded border border-gray-300 dark:border-gray-700 font-mono">Esc</kbd>
                  <span className="ml-1">to close</span>
                </span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

SearchModal.displayName = 'SearchModal';

export default SearchModal; 