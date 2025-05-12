import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    title?: string;
    description?: string; // Optional description below title
    actions?: React.ReactNode; // Optional actions (e.g., buttons) in the header
}

const Card: React.FC<CardProps> = ({ children, className = '', title, description, actions }) => {
    return (
        <div className={`bg-white border border-gray-200 rounded-lg  ${className}`}>
            {(title || actions) && (
                <div className={`px-2 py-2 border-b mb-2 border-gray-200 sm:px-2 flex justify-between items-center ${description ? '' : 'border-gray-200'}`}>
                    <div>
                        {title && <h3 className="text-base font-semibold leading-6 text-gray-900">{title}</h3>}
                        {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
                    </div>
                    {actions && <div className="flex-shrink-0 ml-4">{actions}</div>} {/* Adjusted margin for RTL */}
                </div>
            )}
             <div className={`p-4 sm:p-4 ${!title && !actions ? '' : 'pt-0 sm:pt-0'}`}> {/* Adjust padding if header exists */}
                {children}
            </div>
        </div>
    );
};

export default Card;