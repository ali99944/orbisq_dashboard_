import React from 'react';
import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';

type AlertVariant = 'success' | 'error' | 'warning' | 'info';

interface AlertProps {
    message: string;
    variant?: AlertVariant;
    title?: string;
    onClose?: () => void;
    className?: string;
}

const Alert: React.FC<AlertProps> = ({
    message,
    variant = 'info',
    title,
    onClose,
    className = ''
}) => {
    const variantStyles = {
        success: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-800', iconColor: 'text-green-500', Icon: CheckCircle },
        error: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-800', iconColor: 'text-red-500', Icon: AlertCircle },
        warning: { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-800', iconColor: 'text-yellow-500', Icon: AlertCircle },
        info: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-800', iconColor: 'text-blue-500', Icon: Info },
    };

    const styles = variantStyles[variant];

    return (
        <div className={`p-2 rounded-md border ${styles.bg} ${styles.border} ${className}`} role="alert">
            <div className="flex">
                <div className="flex-shrink-0">
                    <styles.Icon className={`h-5 w-5 ${styles.iconColor}`} aria-hidden="true" />
                </div>
                <div className="mr-3 flex-grow">
                    {title && <h3 className={`text-sm font-medium ${styles.text}`}>{title}</h3>}
                    <div className={`text-sm ${styles.text} ${title ? 'mt-1' : ''}`}>
                        {message}
                    </div>
                </div>
                {onClose && (
                    <div className="ml-auto pr-3">
                        <div className="-mx-1.5 -my-1">
                            <button
                                type="button"
                                onClick={onClose}
                                className={`inline-flex cursor-pointer rounded-md p-1.5 ${styles.text} hover:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2`}
                                style={{ backgroundColor: `${styles.iconColor.replace('text-','bg-')}/10`}} // Adjust hover bg
                                aria-label="Dismiss"
                            >
                                <span className="sr-only">Dismiss</span>
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Alert;