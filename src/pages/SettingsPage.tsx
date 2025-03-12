import React, { useState } from 'react';
import { useTheme, useFilter, useBlog, useAuth } from '../contexts';
import { Helmet } from 'react-helmet-async';
import { Moon, Sun, Grid, List, Save, Trash, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';

const SettingsPage: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();
  const { state: filterState, updateViewMode, updateSortOrder } = useFilter();
  const { clearHistory, clearBookmarks } = useBlog();
  const { user, logout } = useAuth();
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Settings form state
  const [settings, setSettings] = useState({
    sortOrder: filterState.sortOrder,
    viewMode: filterState.viewMode,
    darkMode: isDark,
    emailNotifications: true,
    newsletterSubscription: true
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    
    setSettings({
      ...settings,
      [name]: type === 'checkbox' ? checked : value
    });
    
    // Reset save message if it was displayed
    if (saveSuccess) {
      setSaveSuccess(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Apply theme setting
    if (settings.darkMode !== isDark) {
      toggleTheme();
    }
    
    // Apply filter settings
    if (settings.viewMode !== filterState.viewMode) {
      updateViewMode(settings.viewMode);
    }
    
    if (settings.sortOrder !== filterState.sortOrder) {
      updateSortOrder(settings.sortOrder);
    }
    
    // Show success message
    setSaveSuccess(true);
    
    // Hide success message after 3 seconds
    setTimeout(() => {
      setSaveSuccess(false);
    }, 3000);
  };

  const handleClearHistory = () => {
    if (window.confirm('Are you sure you want to clear your reading history? This action cannot be undone.')) {
      clearHistory();
      alert('Reading history cleared successfully.');
    }
  };

  const handleClearBookmarks = () => {
    if (window.confirm('Are you sure you want to remove all bookmarks? This action cannot be undone.')) {
      clearBookmarks();
      alert('Bookmarks cleared successfully.');
    }
  };

  return (
    <>
      <Helmet>
        <title>Settings | BlogFolio</title>
        <meta name="description" content="Customize your blog reading experience" />
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Settings</h1>
        
        {user ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Settings Form */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h2 className="text-xl font-bold mb-6">Preferences</h2>
                
                <form onSubmit={handleSubmit}>
                  {/* Display Settings */}
                  <div className="mb-8">
                    <h3 className="text-lg font-medium mb-4">Display</h3>
                    
                    {/* Theme Toggle */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-2">Theme</label>
                      <div className="flex items-center space-x-4">
                        <label className={`flex items-center space-x-2 p-3 rounded-lg border ${!settings.darkMode ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30' : 'border-gray-200 dark:border-gray-700'}`}>
                          <input
                            type="radio"
                            name="darkMode"
                            checked={!settings.darkMode}
                            onChange={() => setSettings({...settings, darkMode: false})}
                            className="sr-only"
                          />
                          <Sun size={20} className="text-yellow-500" />
                          <span>Light</span>
                        </label>
                        
                        <label className={`flex items-center space-x-2 p-3 rounded-lg border ${settings.darkMode ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30' : 'border-gray-200 dark:border-gray-700'}`}>
                          <input
                            type="radio"
                            name="darkMode"
                            checked={settings.darkMode}
                            onChange={() => setSettings({...settings, darkMode: true})}
                            className="sr-only"
                          />
                          <Moon size={20} className="text-indigo-500" />
                          <span>Dark</span>
                        </label>
                      </div>
                    </div>
                    
                    {/* View Mode */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-2">Post View</label>
                      <div className="flex items-center space-x-4">
                        <label className={`flex items-center space-x-2 p-3 rounded-lg border ${settings.viewMode === 'grid' ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30' : 'border-gray-200 dark:border-gray-700'}`}>
                          <input
                            type="radio"
                            name="viewMode"
                            value="grid"
                            checked={settings.viewMode === 'grid'}
                            onChange={handleChange}
                            className="sr-only"
                          />
                          <Grid size={20} className="text-indigo-500" />
                          <span>Grid</span>
                        </label>
                        
                        <label className={`flex items-center space-x-2 p-3 rounded-lg border ${settings.viewMode === 'list' ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30' : 'border-gray-200 dark:border-gray-700'}`}>
                          <input
                            type="radio"
                            name="viewMode"
                            value="list"
                            checked={settings.viewMode === 'list'}
                            onChange={handleChange}
                            className="sr-only"
                          />
                          <List size={20} className="text-indigo-500" />
                          <span>List</span>
                        </label>
                      </div>
                    </div>
                    
                    {/* Sort Order */}
                    <div className="mb-4">
                      <label htmlFor="sortOrder" className="block text-sm font-medium mb-2">Default Sort Order</label>
                      <select
                        id="sortOrder"
                        name="sortOrder"
                        value={settings.sortOrder}
                        onChange={handleChange}
                        className="block w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800"
                      >
                        <option value="recent">Most Recent</option>
                        <option value="oldest">Oldest First</option>
                        <option value="popular">Most Popular</option>
                      </select>
                    </div>
                  </div>
                  
                  {/* Notification Settings */}
                  <div className="mb-8">
                    <h3 className="text-lg font-medium mb-4">Notifications</h3>
                    
                    <div className="mb-4">
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          name="emailNotifications"
                          checked={settings.emailNotifications}
                          onChange={handleChange}
                          className="rounded text-indigo-600 focus:ring-indigo-500"
                        />
                        <span>Email notifications for comments and replies</span>
                      </label>
                    </div>
                    
                    <div className="mb-4">
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          name="newsletterSubscription"
                          checked={settings.newsletterSubscription}
                          onChange={handleChange}
                          className="rounded text-indigo-600 focus:ring-indigo-500"
                        />
                        <span>Subscribe to weekly newsletter</span>
                      </label>
                    </div>
                  </div>
                  
                  {/* Save Button */}
                  <div className="flex items-center">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center"
                    >
                      <Save size={18} className="mr-2" />
                      Save Settings
                    </button>
                    
                    {saveSuccess && (
                      <span className="ml-4 text-green-600 dark:text-green-400">
                        Settings saved successfully!
                      </span>
                    )}
                  </div>
                </form>
              </div>
            </div>
            
            {/* Sidebar Actions */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
                <h2 className="text-xl font-bold mb-4">Account</h2>
                <div className="space-y-4">
                  <Link
                    to="/profile"
                    className="block w-full text-left px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    View Profile
                  </Link>
                  <Link
                    to="/change-password"
                    className="block w-full text-left px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    Change Password
                  </Link>
                  <button
                    onClick={logout}
                    className="flex items-center w-full text-left px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 text-red-600"
                  >
                    <LogOut size={18} className="mr-2" />
                    Logout
                  </button>
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h2 className="text-xl font-bold mb-4">Data Management</h2>
                <div className="space-y-4">
                  <button
                    onClick={handleClearHistory}
                    className="flex items-center w-full text-left px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 text-amber-600"
                  >
                    <Trash size={18} className="mr-2" />
                    Clear Reading History
                  </button>
                  <button
                    onClick={handleClearBookmarks}
                    className="flex items-center w-full text-left px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 text-amber-600"
                  >
                    <Trash size={18} className="mr-2" />
                    Remove All Bookmarks
                  </button>
                  <button 
                    onClick={() => alert('Data export request submitted. You will receive your data via email within 24 hours.')}
                    className="w-full text-left px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    Export My Data
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-4">Please Log In</h2>
            <p className="mb-6">You need to be logged in to access settings.</p>
            <Link
              to="/login"
              className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Log In
            </Link>
          </div>
        )}
      </div>
    </>
  );
};

export default SettingsPage;
