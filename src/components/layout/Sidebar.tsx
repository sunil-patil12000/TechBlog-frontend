import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar: React.FC = () => {
  // Popular categories - in a real app, these would come from an API
  const categories = [
    { name: 'Technology', slug: 'technology', count: 12 },
    { name: 'Programming', slug: 'programming', count: 8 },
    { name: 'Web Development', slug: 'web-development', count: 15 },
    { name: 'Design', slug: 'design', count: 6 },
  ];

  // Popular tags
  const tags = [
    { name: 'React', slug: 'react' },
    { name: 'JavaScript', slug: 'javascript' },
    { name: 'CSS', slug: 'css' },
    { name: 'TypeScript', slug: 'typescript' },
    { name: 'Node.js', slug: 'nodejs' },
  ];

  // Recent posts
  const recentPosts = [
    { title: 'Getting Started with React 18', slug: 'getting-started-with-react-18' },
    { title: 'Understanding TypeScript Generics', slug: 'understanding-typescript-generics' },
    { title: 'CSS Grid Layout: A Complete Guide', slug: 'css-grid-layout-guide' },
  ];

  return (
    <aside className="w-full lg:w-1/3 xl:w-1/4 px-4 lg:pl-8">
      {/* Categories Section */}
      <div className="mb-8 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-bold mb-4 text-gray-800 dark:text-gray-100">Categories</h3>
        <ul className="space-y-2">
          {categories.map((category) => (
            <li key={category.slug}>
              <Link 
                to={`/blog/category/${category.slug}`}
                className="flex justify-between text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
              >
                <span>{category.name}</span>
                <span className="text-gray-500 dark:text-gray-400">({category.count})</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Recent Posts Section */}
      <div className="mb-8 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-bold mb-4 text-gray-800 dark:text-gray-100">Recent Posts</h3>
        <ul className="space-y-3">
          {recentPosts.map((post, index) => (
            <li key={index}>
              <Link 
                to={`/blog/${post.slug}`}
                className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
              >
                {post.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Tags Section */}
      <div className="mb-8 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-bold mb-4 text-gray-800 dark:text-gray-100">Tags</h3>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Link
              key={tag.slug}
              to={`/blog/tag/${tag.slug}`}
              className="inline-block px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full hover:bg-indigo-100 dark:hover:bg-indigo-900 hover:text-indigo-800 dark:hover:text-indigo-200"
            >
              {tag.name}
            </Link>
          ))}
        </div>
      </div>
      
      {/* About Section */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-bold mb-4 text-gray-800 dark:text-gray-100">About</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          A modern tech blog featuring articles on web development, programming, and the latest technology trends.
        </p>
        <Link 
          to="/about"
          className="text-indigo-600 dark:text-indigo-400 hover:underline"
        >
          Learn more
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;
