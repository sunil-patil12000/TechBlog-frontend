import React, { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileEdit, 
  Users, 
  Settings, 
  Bell, 
  ChevronRight, 
  BarChart,
  Calendar,
  LogOut
} from 'lucide-react';

const AdminLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeNav, setActiveNav] = useState('dashboard');

  const navigation = [
    { name: 'Dashboard', icon: LayoutDashboard, href: '/admin' },
    { name: 'Posts', icon: FileEdit, href: '/admin/posts' },
    { name: 'Analytics', icon: BarChart, href: '/admin/analytics' },
    { name: 'Events', icon: Calendar, href: '/admin/events' },
    { name: 'Users', icon: Users, href: '/admin/users' },
    { name: 'Settings', icon: Settings, href: '/admin/settings' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex">
        {/* Sidebar */}
        <aside className={`${
          isSidebarOpen ? 'w-64' : 'w-20'
        } transition-all duration-200 ease-in-out bg-white dark:bg-gray-800 h-screen fixed left-0 top-0 shadow-xl`}>
          
          <div className="p-4 flex justify-between items-center border-b dark:border-gray-700">
            {isSidebarOpen ? (
              <h1 className="text-xl font-bold text-indigo-600 dark:text-indigo-400">TechNews Admin</h1>
            ) : (
              <div className="w-8 h-8 bg-indigo-600 rounded-full" />
            )}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              <ChevronRight className={`w-5 h-5 text-gray-600 dark:text-gray-300 ${
                isSidebarOpen ? 'rotate-180' : ''
              }`} />
            </button>
          </div>

          <nav className="p-4 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setActiveNav(item.name.toLowerCase())}
                className={`flex items-center p-3 rounded-lg transition-colors duration-150 ${
                  activeNav === item.name.toLowerCase()
                    ? 'bg-indigo-100 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100/50 dark:hover:bg-gray-700/50'
                }`}
              >
                <item.icon className="w-6 h-6" />
                {isSidebarOpen && (
                  <span className="ml-3 text-sm font-medium">{item.name}</span>
                )}
              </Link>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className={`flex-1 ${
          isSidebarOpen ? 'ml-64' : 'ml-20'
        } transition-all duration-300 p-8`}>
          
          {/* Header */}
          <header className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {activeNav.charAt(0).toUpperCase() + activeNav.slice(1)}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Last updated: {new Date().toLocaleDateString()}
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
                <Bell className="w-6 h-6 text-gray-600 dark:text-gray-300" />
              </button>
              <div className="h-8 w-px bg-gray-200 dark:bg-gray-700" />
              <div className="flex items-center space-x-2">
                <img
                  src="https://randomuser.me/api/portraits/men/32.jpg"
                  alt="Admin"
                  className="w-10 h-10 rounded-full border-2 border-indigo-600"
                />
                {isSidebarOpen && (
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Alex Chen</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Admin</p>
                  </div>
                )}
              </div>
            </div>
          </header>

          {/* Content */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout; 