// src/components/ui/tabs.tsx
import React from 'react';

interface Tab {
  id: string;
  label: string;
  disabled?: boolean;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (tabId: string) => void;
  className?: string;
  variant?: 'default' | 'pills' | 'underline';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onChange,
  className = '',
  variant = 'default',
  size = 'md',
  fullWidth = false,
}) => {
  // Size classes
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  // Variant specific styles
  const getTabStyles = (isActive: boolean, isDisabled: boolean) => {
    const baseClasses = `
      flex items-center justify-center transition-colors duration-200
      ${isDisabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
      ${sizeClasses[size]}
    `;

    if (variant === 'pills') {
      return `
        ${baseClasses}
        rounded-full px-4 py-2 font-medium
        ${isActive 
          ? 'bg-blue-500 text-white' 
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}
      `;
    } else if (variant === 'underline') {
      return `
        ${baseClasses}
        px-4 py-2 font-medium
        ${isActive 
          ? 'text-blue-600 border-b-2 border-blue-600' 
          : 'text-gray-600 border-b-2 border-transparent hover:text-gray-900 hover:border-gray-300'}
      `;
    } else {
      // Default variant - similar to what's in the file
      return `
        ${baseClasses}
        px-4 py-2 font-medium rounded-t-md 
        ${isActive 
          ? 'text-blue-600 border-b-2 border-blue-600' 
          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}
      `;
    }
  };

  return (
    <div className={`border-b border-gray-200 ${className}`}>
      <div 
        className={`flex ${fullWidth ? 'w-full' : 'w-max'} gap-1`}
        role="tablist"
        aria-orientation="horizontal"
      >
        {tabs.map((tab) => (
          <div
            key={tab.id}
            role="tab"
            className={getTabStyles(activeTab === tab.id, !!tab.disabled)}
            aria-selected={activeTab === tab.id}
            tabIndex={activeTab === tab.id ? 0 : -1}
            onClick={() => !tab.disabled && onChange(tab.id)}
            style={fullWidth ? { flex: 1 } : {}}
          >
            {tab.label}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tabs;