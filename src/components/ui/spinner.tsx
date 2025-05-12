import React from 'react';
import { Loader2 } from 'lucide-react';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  message?: string; // Optional loading message
}

const Spinner: React.FC<SpinnerProps> = ({ size = 'md', className = '', message }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  return (
    <div className={`inline-flex items-center justify-center text-primary ${className}`}>
      <Loader2 className={`${sizeClasses[size]} animate-spin`} />
      {message && <span className="ml-2 text-sm text-gray-600">{message}</span>}
    </div>
  );
};

export default Spinner;