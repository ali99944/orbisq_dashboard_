// src/providers/socket-provider.tsx

import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useNavigate } from 'react-router-dom';
import { SOCKET_SERVER_URL, SOCKET_EVENTS, SOCKET_OPTIONS } from '../constants/socket_constants';
import ToastNotification from '../components/ui/toast-notification';
import { Order } from '../types/order';

// Create notification sound
const notificationSound = new Audio('/tone.mp3');

// Define context types
interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
}

// Create context with default values
const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

// Custom hook to use socket context
export const useSocket = () => useContext(SocketContext);

interface SocketProviderProps {
  children: React.ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [notification, setNotification] = useState<{ show: boolean; order?: Order }>({ show: false });
  const navigate = useNavigate();

  useEffect(() => {
    // Initialize socket connection
    const socketInstance = io(SOCKET_SERVER_URL, SOCKET_OPTIONS);
    setSocket(socketInstance);

    // Connection event handlers
    socketInstance.on(SOCKET_EVENTS.CONNECT, () => {
      console.log('Socket connected');
      setIsConnected(true);
    });

    socketInstance.on(SOCKET_EVENTS.DISCONNECT, () => {
      console.log('Socket disconnected');
      setIsConnected(false);
    });

    socketInstance.on(SOCKET_EVENTS.CONNECT_ERROR, (error) => {
      console.error('Socket connection error:', error);
      setIsConnected(false);
    });

    // Order created event handler
    socketInstance.on(SOCKET_EVENTS.ORDER_CREATED, (order) => {
      // Play notification sound
      notificationSound.play().catch(err => console.error('Error playing notification sound:', err));
      
      // Show custom toast notification
      setNotification({ show: true, order });
      
      // Also show browser notification if supported
      if ('Notification' in window) {
        // Request permission if not granted
        if (Notification.permission !== 'granted') {
          Notification.requestPermission();
        }
        
        if (Notification.permission === 'granted') {
          const browserNotification = new Notification('طلب جديد', {
            body: `تم إنشاء طلب جديد #${order.id || order.order_id}`,
            icon: '/icons/favicon.ico', // Ensure this path is correct
          });
          
          // Navigate to orders page when notification is clicked
          browserNotification.onclick = () => {
            window.focus();
            navigate('/orders');
            browserNotification.close();
          };
        }
      }
    });

    // Cleanup on unmount
    return () => {
      if (socketInstance) {
        socketInstance.disconnect();
        socketInstance.off(SOCKET_EVENTS.CONNECT);
        socketInstance.off(SOCKET_EVENTS.DISCONNECT);
        socketInstance.off(SOCKET_EVENTS.CONNECT_ERROR);
        socketInstance.off(SOCKET_EVENTS.ORDER_CREATED);
      }
    };
  }, [navigate]);

  // Handle closing the toast notification
  const handleCloseNotification = () => {
    setNotification({ show: false });
  };

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {notification.show && notification.order && (
        <ToastNotification
          title="طلب جديد"
          message={`تم إنشاء طلب جديد #${notification.order.id || notification.order.id}`}
          type="success"
          duration={8000}
          onClose={handleCloseNotification}
          actionPath="/orders"
        />
      )}
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;