import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminNavbar from './AdminNavbar';
import AdminSidebar from './AdminSidebar';
import { Menu, X } from 'lucide-react';
import useAnalytics from '../../hooks/useAnalytics';

const AdminLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Initialize analytics tracking with automatic page view tracking
  useAnalytics({
    trackPageView: true,
    trackTimeOnPage: true,
    pageViewData: {
      page: 'Admin - ' + document.title
    }
  });
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Top Navbar */}
      <AdminNavbar toggleSidebar={toggleSidebar} />
      
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar for mobile - overlay */}
        <div className={`
          fixed inset-0 z-40 md:hidden transition-opacity duration-300 ease-in-out
          ${sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
        `}>
          <div 
            className="absolute inset-0 bg-gray-600 opacity-75"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
          
          <div className="absolute inset-y-0 left-0 flex flex-col max-w-xs w-full h-full bg-white dark:bg-gray-900 shadow-xl">
            <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-800">
              <h2 className="text-xl font-bold text-indigo-600 dark:text-indigo-400">Admin Dashboard</h2>
              <button 
                onClick={() => setSidebarOpen(false)}
                className="rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                <X size={24} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <AdminSidebar />
            </div>
          </div>
        </div>
        
        {/* Sidebar for desktop - permanent */}
        <div className="hidden md:flex md:flex-shrink-0">
          <AdminSidebar />
        </div>
        
        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50 dark:bg-gray-900">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
