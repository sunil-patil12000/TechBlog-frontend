import { io, Socket } from 'socket.io-client';
import authService from './authService';

const API_URL = import.meta.env.VITE_API_URL || '';

class SocketService {
  private socket: Socket | null = null;
  private listeners: Map<string, Set<Function>> = new Map();
  
  // Initialize socket connection
  connect() {
    if (this.socket) return;

    // Get auth token for authentication
    const token = authService.getToken();
    
    this.socket = io(API_URL, {
      auth: { token },
      withCredentials: true,
      autoConnect: true,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5
    });
    
    this.socket.on('connect', () => {
      console.log('Connected to socket server');
      
      // If user is admin, join admin room
      const user = authService.getCurrentUser();
      if (user && user.role === 'admin') {
        this.socket.emit('join-admin', user);
      }
    });
    
    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });
    
    this.socket.on('disconnect', (reason) => {
      console.log('Disconnected from socket server:', reason);
    });
    
    // Set up listeners for dashboard updates
    this.socket.on('dashboard-update', (data) => {
      this.notifyListeners('dashboard-update', data);
    });
    
    // Listen for new notifications
    this.socket.on('notification', (data) => {
      this.notifyListeners('notification', data);
    });
  }
  
  // Disconnect socket
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
  
  // Add an event listener
  on(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)?.add(callback);
    
    return () => {
      this.off(event, callback);
    };
  }
  
  // Remove an event listener
  off(event: string, callback: Function) {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.delete(callback);
    }
  }
  
  // Notify all listeners for an event
  private notifyListeners(event: string, data: any) {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in ${event} listener:`, error);
        }
      });
    }
  }
  
  // Check if socket is connected
  isConnected(): boolean {
    return this.socket?.connected || false;
  }
  
  // Manually emit an event
  emit(event: string, data?: any) {
    if (this.socket) {
      this.socket.emit(event, data);
    }
  }
}

// Create a singleton instance
const socketService = new SocketService();

export default socketService; 