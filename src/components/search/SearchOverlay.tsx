import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Tag, X, FileText, User, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Fuse from 'fuse.js';
import { useHotkeys } from 'react-hotkeys-hook';
import { useClickAway } from 'react-use';
import { searchPosts } from '../../data/posts';
import type { SearchResult } from '../../types/blog';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchOverlay: React.FC<SearchOverlayProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  
  // Close when clicking outside
  useClickAway(searchRef, onClose);
  
  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      setQuery('');
      setResults([]);
      setSelectedIndex(-1);
    }
  }, [isOpen]);

  // Keyboard navigation
  useHotkeys('esc', onClose, { enabled: isOpen });
  useHotkeys('up', (e) => {
    e.preventDefault();
    setSelectedIndex(prev => Math.max(prev - 1, -1));
  }, { enabled: isOpen });
  useHotkeys('down', (e) => {
    e.preventDefault();
    setSelectedIndex(prev => Math.min(prev + 1, results.length - 1));
  }, { enabled: isOpen });
  useHotkeys('enter', () => {
    if (selectedIndex >= 0) {
      handleSelect(results[selectedIndex]);
    }
  }, { enabled: isOpen });

  const handleSelect = (result: SearchResult) => {
    navigate(result.url);
    onClose();
  };

  // Fuzzy search with Fuse.js
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const results = searchPosts(query);
    setResults(results);
    setSelectedIndex(-1);
  }, [query]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-50"
        >
          <div className="min-h-screen px-4 text-center">
            <div
              ref={searchRef}
              className="fixed top-[15%] left-1/2 -translate-x-1/2 w-full max-w-2xl"
            >
              {/* Search Input */}
              <div className="relative mb-4">
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search articles, tags, or authors..."
                  className="w-full px-12 py-4 bg-white dark:bg-gray-800 rounded-xl 
                    shadow-xl border border-gray-200 dark:border-gray-700
                    text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
                <button
                  onClick={onClose}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 
                    dark:hover:bg-gray-700 rounded-full"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Results Panel */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl 
                border border-gray-200 dark:border-gray-700 overflow-hidden"
              >
                {results.length > 0 ? (
                  <div className="divide-y divide-gray-200 dark:divide-gray-700">
                    {results.map((result, index) => (
                      <button
                        key={result.url}
                        onClick={() => handleSelect(result)}
                        className={`w-full px-4 py-3 flex items-start gap-3 text-left
                          ${index === selectedIndex ? 'bg-indigo-50 dark:bg-indigo-900/30' : 
                          'hover:bg-gray-50 dark:hover:bg-gray-700/50'}`}
                      >
                        {/* Result Icon */}
                        {result.type === 'article' && <FileText className="w-5 h-5 text-indigo-500 mt-1" />}
                        {result.type === 'tag' && <Tag className="w-5 h-5 text-green-500 mt-1" />}
                        {result.type === 'author' && <User className="w-5 h-5 text-blue-500 mt-1" />}
                        
                        {/* Result Content */}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 dark:text-white">{result.title}</h4>
                          {result.description && (
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
                              {result.description}
                            </p>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                ) : query ? (
                  <div className="px-4 py-12 text-center text-gray-500 dark:text-gray-400">
                    No results found for "{query}"
                  </div>
                ) : (
                  <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                    Start typing to search...
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SearchOverlay;
