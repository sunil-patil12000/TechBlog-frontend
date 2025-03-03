import React from 'react';
import { Link } from 'react-router-dom';
import { blogUtils } from '../../data/posts';

interface SidebarProps {
  showCategories?: boolean;
  showTags?: boolean;
  showRecentPosts?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({
  showCategories = true,
  showTags = true,
  showRecentPosts = true,
}) => {
  // Use the blogUtils methods to get categories and tags
  const categories = blogUtils.getAllCategories();
  const tags = blogUtils.getAllTags();
  
  return (
    <aside className="space-y-8">
      {showCategories && categories.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Categories</h3>
          <div className="flex flex-col space-y-2">
            {categories.map((category) => (
              <Link
                key={category}
                to={`/archives?category=${category.toLowerCase().replace(' ', '-')}`}
                className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >
                {category}
              </Link>
            ))}
          </div>
        </div>
      )}
      
      {showTags && tags.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Link
                key={tag}
                to={`/archives?tag=${tag.toLowerCase().replace(' ', '-')}`}
                className="text-sm px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full hover:bg-indigo-100 dark:hover:bg-indigo-900 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
              >
                {tag}
              </Link>
            ))}
          </div>
        </div>
      )}
      
      {showRecentPosts && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Recent Posts</h3>
          {/* You can display recent posts here using the posts from posts.ts */}
          <div className="space-y-4">
            {/* This would typically come from your posts data */}
            <p className="text-gray-600 dark:text-gray-400 text-sm italic">
              Recent posts will be displayed here
            </p>
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;