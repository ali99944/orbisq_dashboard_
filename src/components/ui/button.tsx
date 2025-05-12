import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'; // Added ghost
  size?: 'sm' | 'md' | 'lg'; // Added size
  children: React.ReactNode;
  isLoading?: boolean;
  icon?: React.ElementType;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'sm',
  children,
  className = '',
  disabled,
  isLoading,
  icon: Icon,
  ...props
}) => {
  // Base styles - include focus rings here
  const baseStyles = "inline-flex items-center justify-center rounded-sm cursor-pointer text-sm font-medium border focus:outline-none transition-colors duration-150 disabled:opacity-60 disabled:cursor-not-allowed";

  // Size styles
  const sizeStyles = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-2.5 text-base",
  };

  // Variant specific styles
  let variantStyles = "";
  let hoverStyles = "";
  let activeStyles = ""; // For press effect
  let focusRingColor = "focus:ring-[#A70000]"; // Default primary focus

  switch (variant) {
    case 'secondary':
       // Improved Secondary: Clearer border, subtle background hover
      variantStyles = "bg-white border-gray-300 text-gray-700";
      hoverStyles = "hover:bg-gray-50 hover:border-gray-400";
      activeStyles = "active:bg-gray-100";
      focusRingColor = "focus:ring-gray-400"; // Adjust focus color
      break;
    case 'danger':
      variantStyles = "bg-red-600 border-transparent text-white";
      hoverStyles = "hover:bg-red-700"; // Apply hover bg directly
      activeStyles = "active:bg-red-800";
      focusRingColor = "focus:ring-red-500";
      break;
     case 'ghost': // Simple text button with hover bg
       variantStyles = "bg-transparent border-transparent text-gray-600";
       hoverStyles = "hover:bg-gray-100 hover:text-gray-800";
       activeStyles = "active:bg-gray-200";
       focusRingColor = "focus:ring-gray-400";
       break;
    case 'primary':
    default:
      variantStyles = `bg-[#A70000] border-transparent text-white`;
      hoverStyles = `hover:bg-[#8B0000]`; // Apply hover bg directly
      activeStyles = "active:bg-[#700000]"; // Darker on active press
      focusRingColor = "focus:ring-[#A70000]";
      break;
  }

  // Combine styles - Ensure hover styles are applied correctly
  const combinedClassName = `${baseStyles} ${sizeStyles[size]} ${variantStyles} ${!disabled && !isLoading ? hoverStyles : ''} ${!disabled && !isLoading ? activeStyles : ''} ${focusRingColor} ${className}`;

  return (
    <button
      // Remove direct style backgroundColor - let Tailwind classes handle it
      className={combinedClassName}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <svg className="animate-spin -mr-0.5 ml-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>}
      {Icon && !isLoading && <Icon className={`h-4 w-4 ${children ? 'ml-2' : ''}`} />} {/* Adjusted icon margin */}
      {children}
    </button>
  );
};

export default Button;