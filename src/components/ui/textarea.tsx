import React, { forwardRef, useId } from 'react';

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
    containerClassName?: string;
}

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
    ({ label, id, error, containerClassName = '', className = '', ...props }, ref) => {
        const generatedId = useId();
        const textAreaId = id || generatedId;

        const borderStyle = error
            ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
            : 'border-gray-300 focus:border-primary focus:ring-primary';

        return (
            <div className={containerClassName}>
                {label && (
                    <label htmlFor={textAreaId} className="block text-sm font-medium text-gray-700 mb-1.5">
                        {label}
                    </label>
                )}
                <textarea
                    ref={ref}
                    id={textAreaId}
                    className={`block w-full rounded-md border px-3 py-2 text-sm transition duration-150 ease-in-out focus:outline-none focus:ring-1 disabled:opacity-50 disabled:cursor-not-allowed ${borderStyle} ${className}`}
                    {...props}
                />
                {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}
            </div>
        );
    }
);

TextArea.displayName = 'TextArea';
export default TextArea;