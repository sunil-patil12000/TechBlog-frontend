import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bell, X, Check, CheckCheck, ExternalLink, MessageSquare, FileText, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotifications, Notification } from '../../contexts/NotificationsContext';
import { formatDistanceToNow } from 'date-fns';

const NotificationCenter: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  
  const toggleOpen = () => {
    setIsOpen(!isOpen);
    if (!isOpen && unreadCount > 0) {
      // When opening, if there are unread notifications, don't mark them as read yet
    } else if (isOpen) {
      // When closing, mark all as read
      markAllAsRead();
    }
  };
  
  // Handle clicking a single notification
  const handleNotificationClick = (id: string) => {
    markAsRead(id);
  };
  
  // Get icon based on notification type
  const getIcon = (type: string) => {
    switch (type) {
      case 'post':
        return <FileText className="h-5 w-5 text-blue-500" />;
      case 'comment':
        return <MessageSquare className="h-5 w-5 text-green-500" />;
      case 'user':
        return <User className="h-5 w-5 text-purple-500" />;
      case 'scheduled-post':
        return <FileText className="h-5 w-5 text-amber-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };
  
  // Format notification time
  const formatTime = (time: string) => {
    try {
      return formatDistanceToNow(new Date(time), { addSuffix: true });
    } catch (error) {
      return time;
    }
  };
  
  return (
    <div className="relative">
      {/* Notification Bell Button */}
      <button
        onClick={toggleOpen}
        className="relative p-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white focus:outline-none"
        aria-label="Notifications"
      >
        <Bell className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>
      
      {/* Notification Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden z-50"
          >
            <div className="p-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Notifications</h3>
              <div className="flex space-x-2">
                <button 
                  onClick={markAllAsRead} 
                  className="p-1 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                  title="Mark all as read"
                >
                  <CheckCheck className="h-5 w-5" />
                </button>
                <button 
                  onClick={toggleOpen} 
                  className="p-1 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                  title="Close"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <div className="overflow-y-auto max-h-96">
              {notifications.length === 0 ? (
                <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                  No new notifications
                </div>
              ) : (
                <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                  {notifications.map((notification: Notification) => (
                    <li key={notification.id} className="relative">
                      <Link
                        to={notification.url || '#'}
                        className={`block px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors ${
                          !notification.isRead ? 'bg-blue-50 dark:bg-blue-900/10' : ''
                        }`}
                        onClick={() => handleNotificationClick(notification.id)}
                      >
                        <div className="flex items-start">
                          <div className="flex-shrink-0 pt-0.5">
                            {notification.user?.avatar ? (
                              <img
                                src={notification.user.avatar}
                                alt={notification.user.name}
                                className="h-10 w-10 rounded-full"
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                                {getIcon(notification.type)}
                              </div>
                            )}
                          </div>
                          <div className="ml-3 flex-1">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {notification.title}
                            </p>
                            {notification.content && (
                              <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                                {notification.content}
                              </p>
                            )}
                            <div className="mt-1 flex items-center text-xs text-gray-500 dark:text-gray-400">
                              <span>{formatTime(notification.time)}</span>
                              {notification.url && (
                                <ExternalLink className="ml-1 h-3 w-3" />
                              )}
                            </div>
                          </div>
                          {!notification.isRead && (
                            <div className="absolute right-4 top-3">
                              <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                            </div>
                          )}
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            
            <div className="p-3 border-t border-gray-200 dark:border-gray-700">
              <Link
                to="/admin/notifications"
                className="block text-center text-sm font-medium text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
              >
                View all notifications
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationCenter; 