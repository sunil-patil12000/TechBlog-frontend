import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import socketService from '../services/socketService';
import api from '../services/api';
import authService from '../services/authService';

export interface Notification {
  id: string;
  type: string;
  title: string;
  content?: string;
  time: string;
  isRead: boolean;
  url?: string;
  user?: {
    name: string;
    avatar: string;
  };
}

interface NotificationsContextType {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  fetchNotifications: () => Promise<void>;
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationsContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationsProvider');
  }
  return context;
};

interface NotificationsProviderProps {
  children: ReactNode;
}

export const NotificationsProvider: React.FC<NotificationsProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const unreadCount = notifications.filter(n => !n.isRead).length;
  
  const fetchNotifications = async () => {
    // Only fetch if user is logged in and is admin
    const user = authService.getCurrentUser();
    if (!user || user.role !== 'admin') return;
    
    setLoading(true);
    try {
      const response = await api.getDashboardNotifications(20);
      setNotifications(response.data);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching notifications:', err);
      setError(err.message || 'Failed to fetch notifications');
    } finally {
      setLoading(false);
    }
  };
  
  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, isRead: true } 
          : notification
      )
    );
    // You could also update this on the server
  };
  
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, isRead: true }))
    );
    // You could also update this on the server
  };
  
  // Listen for real-time notifications
  useEffect(() => {
    const user = authService.getCurrentUser();
    if (!user || user.role !== 'admin') return;
    
    // Connect to socket
    socketService.connect();
    
    // Set up notification listener
    const removeListener = socketService.on('notification', (newNotification: Notification) => {
      setNotifications(prev => [newNotification, ...prev].slice(0, 50));
    });
    
    // Set up dashboard update listener - also creates notifications
    const removeDashboardListener = socketService.on('dashboard-update', (update: any) => {
      if (!update || !update.type) return;
      
      let notification: Notification | null = null;
      
      switch (update.type) {
        case 'new-post':
          notification = {
            id: Date.now().toString(),
            type: 'post',
            title: `New post published: "${update.data.title}"`,
            content: `By ${update.data.author?.name || 'Unknown'}`,
            time: new Date().toISOString(),
            isRead: false,
            url: `/blog/${update.data.slug}`,
            user: update.data.author
          };
          break;
          
        case 'new-comment':
          notification = {
            id: Date.now().toString(),
            type: 'comment',
            title: `New comment on "${update.data.postTitle}"`,
            content: update.data.content.substring(0, 100) + (update.data.content.length > 100 ? '...' : ''),
            time: new Date().toISOString(),
            isRead: false,
            url: `/blog/${update.data.postSlug}`,
            user: {
              name: update.data.user,
              avatar: ''
            }
          };
          break;
          
        case 'new-user':
          notification = {
            id: Date.now().toString(),
            type: 'user',
            title: `New user registered: ${update.data.name}`,
            time: new Date().toISOString(),
            isRead: false,
            url: `/admin/users`,
            user: {
              name: update.data.name,
              avatar: update.data.avatar || ''
            }
          };
          break;
          
        default:
          break;
      }
      
      if (notification) {
        setNotifications(prev => [notification!, ...prev].slice(0, 50));
      }
    });
    
    // Initial fetch
    fetchNotifications();
    
    return () => {
      removeListener();
      removeDashboardListener();
      socketService.disconnect();
    };
  }, []);
  
  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        unreadCount,
        loading,
        error,
        markAsRead,
        markAllAsRead,
        fetchNotifications
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
}; 