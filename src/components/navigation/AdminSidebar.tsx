import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const AdminSidebar: React.FC = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <aside className="w-64 bg-gray-800 text-white min-h-screen">
      <div className="p-4">
        <h2 className="text-xl font-bold mb-8">Admin Dashboard</h2>
        
        <nav className="space-y-2">
          <Link 
            to="/admin" 
            className={`flex items-center p-3 rounded-lg transition duration-150 ${
              isActive('/admin') ? 'bg-indigo-600' : 'hover:bg-gray-700'
            }`}
          >
            <span className="mr-3">📊</span>
            <span>Dashboard</span>
          </Link>
          
          <Link 
            to="/admin/posts" 
            className={`flex items-center p-3 rounded-lg transition duration-150 ${
              isActive('/admin/posts') ? 'bg-indigo-600' : 'hover:bg-gray-700'
            }`}
          >
            <span className="mr-3">📝</span>
            <span>Posts</span>
          </Link>
          
          <Link 
            to="/admin/posts/new" 
            className={`flex items-center p-3 rounded-lg transition duration-150 ${
              isActive('/admin/posts/new') ? 'bg-indigo-600' : 'hover:bg-gray-700'
            }`}
          >
            <span className="mr-3">➕</span>
            <span>New Post</span>
          </Link>
          
          <Link 
            to="/admin/test-upload" 
            className={`flex items-center p-3 rounded-lg transition duration-150 ${
              isActive('/admin/test-upload') ? 'bg-indigo-600' : 'hover:bg-gray-700'
            }`}
          >
            <span className="mr-3">🔼</span>
            <span>Test Upload</span>
          </Link>
          
          <Link 
            to="/" 
            className="flex items-center p-3 rounded-lg hover:bg-gray-700 transition duration-150"
          >
            <span className="mr-3">🏠</span>
            <span>Back to Site</span>
          </Link>
        </nav>
      </div>
    </aside>
  );
};

export default AdminSidebar;
