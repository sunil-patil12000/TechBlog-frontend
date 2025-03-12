import React from 'react';
import { motion } from 'framer-motion';
import { Filter, SortDesc, Grid, List } from 'lucide-react';
import { blogUtils } from '../../data/posts';

interface FilterBarProps {
  view: 'grid' | 'list';
  onViewChange: (view: 'grid' | 'list') => void;
  selectedCategory?: string;
  selectedTag?: string;
  sortBy?: 'date' | 'popular' | 'trending';
  onFilterChange: (filter: { category?: string; tag?: string; sort?: string }) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({
  view,
  onViewChange,
  selectedCategory,
  selectedTag,
  sortBy = 'date',
  onFilterChange,
}) => {
  const categories = blogUtils.getAllCategories();
  const tags = blogUtils.getAllTags();

  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-20 z-10 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 p-4"
    >
      <div className="container mx-auto flex flex-wrap items-center gap-4 justify-between">
        {/* Left side - Filters */}
        <div className="flex items-center gap-4">
          <div className="flex items-center">
            <Filter size={16} className="text-gray-400 mr-2" />
            <select
              value={selectedCategory || ''}
              onChange={(e) => onFilterChange({ category: e.target.value || undefined })}
              className="bg-transparent border-none text-sm text-gray-700 dark:text-gray-300 focus:ring-0"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <div className="hidden md:flex flex-wrap gap-2">
            {tags.slice(0, 5).map(tag => (
              <button
                key={tag}
                onClick={() => onFilterChange({ tag: selectedTag === tag ? undefined : tag })}
                className={`px-2 py-1 text-xs rounded-full transition-colors
                  ${selectedTag === tag
                    ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Right side - Sort and View */}
        <div className="flex items-center gap-4">
          <div className="flex items-center">
            <SortDesc size={16} className="text-gray-400 mr-2" />
            <select
              value={sortBy}
              onChange={(e) => onFilterChange({ sort: e.target.value })}
              className="bg-transparent border-none text-sm text-gray-700 dark:text-gray-300 focus:ring-0"
            >
              <option value="date">Latest</option>
              <option value="popular">Most Popular</option>
              <option value="trending">Trending</option>
            </select>
          </div>

          <div className="flex items-center gap-2 border-l border-gray-200 dark:border-gray-700 pl-4">
            <button
              onClick={() => onViewChange('grid')}
              className={`p-1.5 rounded-lg transition-colors ${
                view === 'grid'
                  ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300'
                  : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
              aria-label="Grid view"
            >
              <Grid size={18} />
            </button>
            <button
              onClick={() => onViewChange('list')}
              className={`p-1.5 rounded-lg transition-colors ${
                view === 'list'
                  ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300'
                  : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
              aria-label="List view"
            >
              <List size={18} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default FilterBar;
