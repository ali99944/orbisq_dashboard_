// src/components/ui/badge.tsx
import React from 'react';
import { cn } from '../../lib/utils';

export type BadgeColor = 'gray' | 'blue' | 'green' | 'red' | 'yellow' | 'purple' | 'indigo' | 'orange'
export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  color?: BadgeColor;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'solid' | 'outline';
  children: React.ReactNode;
}

const Badge: React.FC<BadgeProps> = ({
  color = 'gray',
  size = 'md',
  variant = 'solid',
  className,
  children,
  ...props
}) => {
  // Color variants
  const colorStyles = {
    gray: {
      solid: 'bg-gray-100 text-gray-800',
      outline: 'border border-gray-300 text-gray-800',
    },
    blue: {
      solid: 'bg-blue-100 text-blue-800',
      outline: 'border border-blue-300 text-blue-800',
    },
    green: {
      solid: 'bg-green-100 text-green-800',
      outline: 'border border-green-300 text-green-800',
    },
    red: {
      solid: 'bg-red-100 text-red-800',
      outline: 'border border-red-300 text-red-800',
    },
    yellow: {
      solid: 'bg-yellow-100 text-yellow-800',
      outline: 'border border-yellow-300 text-yellow-800',
    },
    purple: {
      solid: 'bg-purple-100 text-purple-800',
      outline: 'border border-purple-300 text-purple-800',
    },
    indigo: {
      solid: 'bg-indigo-100 text-indigo-800',
      outline: 'border border-indigo-300 text-indigo-800',
    },
    orange: {
      solid: 'bg-orange-100 text-orange-800',
      outline: 'border border-orange-300 text-orange-800',
    },
  };

  // Size variants
  const sizeStyles = {
    sm: 'text-xs px-1.5 py-0.5 rounded',
    md: 'text-xs px-2 py-1 rounded-md',
    lg: 'text-sm px-2.5 py-1.5 rounded-md',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center font-medium',
        colorStyles[color][variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge;