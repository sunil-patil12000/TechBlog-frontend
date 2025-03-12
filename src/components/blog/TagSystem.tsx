import React from 'react';
import { motion } from 'framer-motion';
import { Tag, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

interface TagSystemProps {
  tags: string[];
  selectedTag?: string;
  onTagSelect: (tag: string) => void;
  trendingTags?: string[];
  showTrending?: boolean;
}

const TagSystem: React.FC<TagSystemProps> = ({ 
  tags, 
  selectedTag, 
  onTagSelect,
  trendingTags = [],
  showTrending = true
}) => {
  return (
    <div className="space-y-6">
      {showTrending && trendingTags.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-4 h-4 text-indigo-500" />
            <h3 className="font-medium text-gray-900 dark:text-white">
              Trending Tags
            </h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {trendingTags.map(tag => (
              <TagChip
                key={tag}
                tag={tag}
                selected={tag === selectedTag}
                onClick={() => onTagSelect(tag)}
                trending
              />
            ))}
          </div>
        </div>
      )}

      <div>
        <div className="flex items-center gap-2 mb-3">
          <Tag className="w-4 h-4 text-gray-400" />
          <h3 className="font-medium text-gray-900 dark:text-white">
            All Tags
          </h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {tags.map(tag => (
            <TagChip
              key={tag}
              tag={tag}
              selected={tag === selectedTag}
              onClick={() => onTagSelect(tag)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

interface TagChipProps {
  tag: string;
  selected?: boolean;
  trending?: boolean;
  onClick: () => void;
}

const TagChip: React.FC<TagChipProps> = ({ tag, selected, trending, onClick }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`
        px-3 py-1.5 rounded-full text-sm font-medium
        ${selected
          ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300'
          : trending
            ? 'bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-300'
            : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'
        }
        hover:shadow-md transition-all duration-200
      `}
    >
      {trending && (
        <span className="mr-1 text-rose-500">•</span>
      )}
      {tag}
      <span className="ml-2 text-xs opacity-60">
        {Math.floor(Math.random() * 100)}
      </span>
    </motion.button>
  );
};

export default TagSystem;
