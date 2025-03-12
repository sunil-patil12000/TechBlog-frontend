import React, { useState, useEffect, useRef, KeyboardEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, ArrowUp, ArrowDown, Loader2, CornerDownLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useHotkeys } from 'react-hotkeys-hook';
import { postAPI } from '../../services/api';
import debounce from 'lodash.debounce';
import Skeleton from './Skeleton';

interface IntelligentSearchProps {
  onClose?: () => void;
  className?: string;
  placeholder?: string;
  minSearchLength?: number;
  debounceTime?: number;
  maxResults?: number;
  autoFocus?: boolean;
}

interface SearchResult {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  category?: string;
  thumbnail?: string;
  tags?: string[];
  matches?: {
    field: string;
    snippet: string;
  }[];
}

const IntelligentSearch: React.FC<IntelligentSearchProps> = ({
  onClose,
  className = '',
  placeholder = 'Search articles, topics, or tags...',
  minSearchLength = 2,
  debounceTime = 300,
  maxResults = 10,
  autoFocus = true,
}) => {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [noResults, setNoResults] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsContainerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  
  // Search function with debounce
  const debouncedSearch = useRef(
    debounce(async (searchTerm: string) => {
      if (searchTerm.length < minSearchLength) {
        setSearchResults([]);
        setNoResults(false);
        return;
      }
      
      try {
        setIsLoading(true);
        const response = await postAPI.searchPosts(searchTerm, maxResults);
        const results = response.data.data || [];
        
        setSearchResults(results);
        setNoResults(results.length === 0);
        
        // Reset selected index when results change
        setSelectedIndex(results.length > 0 ? 0 : -1);
      } catch (error) {
        console.error('Search error:', error);
        setSearchResults([]);
        setNoResults(true);
      } finally {
        setIsLoading(false);
      }
    }, debounceTime)
  ).current;
  
  useEffect(() => {
    // Trigger search on query change
    debouncedSearch(query);
    
    return () => {
      // Cancel any pending debounced searches on cleanup
      debouncedSearch.cancel();
    };
  }, [query, debouncedSearch]);
  
  // Auto-focus the input on mount
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);
  
  // Keyboard navigation
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < searchResults.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : prev));
        break;
      case 'Enter':
        if (selectedIndex >= 0 && searchResults[selectedIndex]) {
          navigateToResult(searchResults[selectedIndex]);
        }
        break;
      case 'Escape':
        onClose?.();
        break;
      default:
        break;
    }
  };
  
  // Scroll selected item into view
  useEffect(() => {
    if (selectedIndex >= 0 && resultsContainerRef.current) {
      const selectedElement = resultsContainerRef.current.children[selectedIndex] as HTMLElement;
      if (selectedElement) {
        selectedElement.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }
  }, [selectedIndex]);
  
  // Navigate to result
  const navigateToResult = (result: SearchResult) => {
    navigate(`/blog/${result.slug}`);
    onClose?.();
  };
  
  // Global hotkey for search focus
  useHotkeys('meta+k', (e) => {
    e.preventDefault();
    inputRef.current?.focus();
  });
  
  // Highlight text with matching query
  const highlightMatch = (text: string, matchText: string) => {
    if (!matchText.trim()) return text;
    
    try {
      const regex = new RegExp(`(${matchText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
      const parts = text.split(regex);
      
      return (
        <>
          {parts.map((part, i) => 
            regex.test(part) ? (
              <mark key={i} className="bg-yellow-200 dark:bg-yellow-700 px-0.5 rounded">
                {part}
              </mark>
            ) : (
              part
            )
          )}
        </>
      );
    } catch (e) {
      return text;
    }
  };
  
  return (
    <div className={`bg-white dark:bg-gray-800 shadow-2xl rounded-xl overflow-hidden ${className}`}>
      {/* Search input */}
      <div className="relative">
        <div className="flex items-center px-4 py-3 border-b border-gray-200 dark:border-gray-700">
          <Search size={20} className="text-gray-400 dark:text-gray-500 mr-3" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="flex-1 bg-transparent border-none outline-none text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
            aria-label="Search"
          />
          {isLoading && (
            <Loader2 size={20} className="text-gray-400 dark:text-gray-500 animate-spin" />
          )}
          {query && !isLoading && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
              aria-label="Clear search"
            >
              <X size={18} />
            </button>
          )}
          {onClose && (
            <button
              onClick={onClose}
              className="ml-2 p-1 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
              aria-label="Close search"
            >
              <X size={20} />
            </button>
          )}
        </div>
        
        {/* Keyboard shortcuts hint */}
        {query.length > 0 && searchResults.length > 0 && (
          <div className="absolute right-4 top-14 flex gap-3 text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center">
              <span className="bg-gray-200 dark:bg-gray-700 rounded px-1.5 py-0.5 mr-1">
                <ArrowUp size={12} />
              </span>
              <span className="bg-gray-200 dark:bg-gray-700 rounded px-1.5 py-0.5 mr-1">
                <ArrowDown size={12} />
              </span>
              to navigate
            </div>
            <div className="flex items-center">
              <span className="bg-gray-200 dark:bg-gray-700 rounded px-1.5 py-0.5 mr-1">
                <CornerDownLeft size={12} />
              </span>
              to select
            </div>
          </div>
        )}
      </div>
      
      {/* Results */}
      <AnimatePresence>
        {query.length >= minSearchLength && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="max-h-96 overflow-y-auto"
          >
            {isLoading && (
              <div className="p-4 space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex gap-3">
                    <Skeleton width={60} height={60} rounded="md" />
                    <div className="flex-1">
                      <Skeleton width="60%" height={20} className="mb-2" />
                      <Skeleton width="90%" height={16} />
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {!isLoading && noResults && (
              <div className="px-4 py-12 text-center text-gray-500 dark:text-gray-400">
                <p className="mb-2 text-lg">No results found for "{query}"</p>
                <p className="text-sm">Try different keywords or check your spelling</p>
              </div>
            )}
            
            {!isLoading && searchResults.length > 0 && (
              <div ref={resultsContainerRef} className="py-2">
                {searchResults.map((result, index) => (
                  <div
                    key={result.id}
                    className={`px-4 py-3 cursor-pointer transition-colors hover:bg-gray-100 dark:hover:bg-gray-700 ${
                      selectedIndex === index ? 'bg-gray-100 dark:bg-gray-700' : ''
                    }`}
                    onClick={() => navigateToResult(result)}
                    onMouseEnter={() => setSelectedIndex(index)}
                  >
                    <div className="flex items-center gap-2 mb-1 text-xs">
                      {result.category && (
                        <span className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-0.5 rounded-full">
                          {result.category}
                        </span>
                      )}
                      {result.tags && result.tags.length > 0 && (
                        <div className="flex gap-1">
                          {result.tags.slice(0, 2).map((tag, i) => (
                            <span key={i} className="text-gray-500 dark:text-gray-400">
                              #{tag}
                            </span>
                          ))}
                          {result.tags.length > 2 && (
                            <span className="text-gray-500 dark:text-gray-400">+{result.tags.length - 2}</span>
                          )}
                        </div>
                      )}
                    </div>
                    
                    <h4 className="text-base font-medium text-gray-900 dark:text-white mb-1">
                      {highlightMatch(result.title, query)}
                    </h4>
                    
                    <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                      {result.matches && result.matches.length > 0
                        ? highlightMatch(result.matches[0].snippet, query)
                        : highlightMatch(result.excerpt, query)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default IntelligentSearch;
