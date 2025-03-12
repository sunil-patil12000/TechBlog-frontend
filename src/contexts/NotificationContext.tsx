import React, { createContext, useContext, useState, useCallback } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
  autoClose?: boolean;
}

interface NotificationContextProps {
  notifications: Notification[];
  showNotification: (notification: Omit<Notification, 'id'>) => void;
  dismissNotification: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextProps | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const showNotification = useCallback(({ type, message, autoClose = true }: Omit<Notification, 'id'>) => {
    const id = Date.now().toString();
    
    // Add to our internal state
    setNotifications(prev => [...prev, { id, type, message, autoClose }]);
    
    // Also show as toast
    switch (type) {
      case 'info':
        toast.info(message, { 
          toastId: id,
          autoClose: autoClose ? 5000 : false 
        });
        break;
      case 'success':
        toast.success(message, { 
          toastId: id,
          autoClose: autoClose ? 5000 : false 
        });
        break;
      case 'warning':
        toast.warning(message, { 
          toastId: id,
          autoClose: autoClose ? 5000 : false 
        });
        break;
      case 'error':
        toast.error(message, { 
          toastId: id,
          autoClose: autoClose ? 5000 : false 
        });
        break;
    }
    
    return id;
  }, []);

  const dismissNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    toast.dismiss(id);
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        showNotification,
        dismissNotification,
      }}
    >
      {children}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};
