// src/components/ui/toast-notification.tsx

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ToastNotificationProps {
  title: string;
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  onClose?: () => void;
  actionPath?: string;
}

const ToastNotification: React.FC<ToastNotificationProps> = ({
  title,
  message,
  type = 'info',
  duration = 5000,
  onClose,
  actionPath,
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const navigate = useNavigate();

  // Auto-dismiss after duration
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      if (onClose) onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  // Handle close button click
  const handleClose = () => {
    setIsVisible(false);
    if (onClose) onClose();
  };

  // Handle action click (navigate to path)
  const handleAction = () => {
    if (actionPath) {
      navigate(actionPath);
    }
    handleClose();
  };

  // If not visible, don't render
  if (!isVisible) return null;

  // Determine background color based on type
  const bgColors = {
    success: 'bg-green-50 border-green-500',
    error: 'bg-red-50 border-red-500',
    warning: 'bg-yellow-50 border-yellow-500',
    info: 'bg-blue-50 border-blue-500',
  };

  const textColors = {
    success: 'text-green-800',
    error: 'text-red-800',
    warning: 'text-yellow-800',
    info: 'text-blue-800',
  };

  const iconColors = {
    success: 'text-green-500',
    error: 'text-red-500',
    warning: 'text-yellow-500',
    info: 'text-blue-500',
  };

  return (
    <div
      className={`fixed top-4 left-4 z-50 w-96 max-w-[calc(100vw-2rem)] rounded-lg border-r-4 shadow-md ${bgColors[type]}`}
      dir="rtl"
    >
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-1">
            <h3 className={`text-sm font-medium ${textColors[type]}`}>{title}</h3>
            <div className={`mt-1 text-sm ${textColors[type]} opacity-90`}>{message}</div>
            {actionPath && (
              <div className="mt-2">
                <button
                  onClick={handleAction}
                  className={`text-sm font-medium ${iconColors[type]} hover:underline`}
                >
                  عرض التفاصيل
                </button>
              </div>
            )}
          </div>
          <button
            onClick={handleClose}
            className="ml-4 flex-shrink-0 rounded-md p-1 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            <X className="h-4 w-4 text-gray-500" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ToastNotification;