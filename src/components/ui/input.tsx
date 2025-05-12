import React, { forwardRef, useId } from 'react';
import type { LucideIcon } from 'lucide-react';

type InputSize = 'xs' | 'sm' | 'md' | 'lg';

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'prefix'> {
    size?: InputSize;
    prefix?: React.ReactNode;
    suffix?: React.ReactNode;
    icon?: LucideIcon;
    label?: string;
    error?: string; // Optional error message
    containerClassName?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({
        size = 'sm',
        prefix,
        suffix,
        icon: Icon,
        label,
        id,
        error,
        containerClassName = '',
        className = '',
        type = 'text',
        ...props
    }, ref) => {
        const generatedId = useId();
        const inputId = id || generatedId;

        const sizeStyles = {
            xs: "px-2 py-1 text-xs border border-gray-300 focus:border-primary focus:ring-primary",
            sm: "px-2.5 py-1.5 text-sm",
            md: "px-3 py-2 text-sm",
            lg: "px-4 py-2 text-base",
        };

        const iconPadding = Icon ? "pl-10" : ""; // Padding left for icon (RTL)

        const baseInputStyle = `w-full ${suffix || prefix ? "rounded-none" : "rounded-md"} border disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 ease-in-out ${sizeStyles[size]} ${iconPadding}`;

        // Adjust border/ring based on error state
        const borderStyle = error
          ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
          : 'border-gray-300 focus:border-primary focus:ring-primary'; // Use primary color name

        const prefixStyles = prefix ? "border-l-0 rounded-l-none" : "";
        const suffixStyles = suffix ? "border-r-0 rounded-r-none" : "";

        const inputClassName = `${baseInputStyle} ${borderStyle} ${prefix ? prefixStyles : ''} ${suffix ? suffixStyles : ''} ${className}`;

        // Prefix/Suffix common styles
        const addonStyles = `inline-flex items-center px-3 border border-gray-300 bg-gray-100 text-gray-600 text-sm ${sizeStyles[size]} py-0`; // Match input padding implicitly

        return (
            <div className={containerClassName}>
                {label && (
                    <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 mb-1.5"> {/* Increased margin */}
                        {label}
                    </label>
                )}
                <div className="relative flex items-stretch">
                    {prefix && (
                        <span className={`${addonStyles} rounded-r-md border-l-0`}> {/* Addon styles */}
                            {prefix}
                        </span>
                    )}
                    <div className="relative flex-grow">
                        <input ref={ref} id={inputId} type={type} className={inputClassName} {...props} />
                        {Icon && (
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"> {/* Icon left (RTL) */}
                                <Icon className={`h-4 w-4 ${error ? 'text-red-500' : 'text-gray-400'}`} aria-hidden="true" />
                            </div>
                        )}
                    </div>
                    {suffix && (
                        <span className={`${addonStyles} rounded-l-md border-r-0`}> {/* Addon styles */}
                            {suffix}
                        </span>
                    )}
                </div>
                {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>} {/* Error message */}
            </div>
        );
    }
);

Input.displayName = 'Input';
export default Input;