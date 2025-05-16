// src/components/socket-status.tsx

import React from 'react';
import { useSocket } from '../providers/socket-provider';

/**
 * A simple component that displays the current socket connection status
 * This can be used anywhere in the application to show if the socket is connected
 */
const SocketStatus: React.FC = () => {
  const { isConnected } = useSocket();

  return (
    <div className="fixed bottom-4 left-4 z-40">
      <div 
        className={`px-3 py-1 rounded-full text-xs font-medium ${isConnected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
      >
        {isConnected ? 'متصل بالخادم' : 'غير متصل'}
      </div>
    </div>
  );
};

export default SocketStatus;