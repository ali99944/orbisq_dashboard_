import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react'; // Use ChevronLeft for RTL separator

export interface BreadcrumbItem {
    label: string;
    href?: string; // Optional href for links
}

interface BreadcrumbProps {
    items: BreadcrumbItem[];
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
    return (
        <nav aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2 space-x-reverse text-sm"> {/* RTL spacing */}
                {items.map((item, index) => (
                    <li key={index} className="flex items-center">
                        {index > 0 && (
                            <ChevronLeft className="w-4 h-4 text-gray-400 mx-1" /> // Separator icon
                        )}
                        {item.href && index < items.length - 1 ? (
                            <Link
                                to={item.href}
                                className="font-medium text-gray-500 hover:text-gray-700 transition-colors"
                            >
                                {item.label}
                            </Link>
                        ) : (
                            // Last item or non-link item
                            <span
                                className={`font-medium ${index === items.length - 1 ? 'text-gray-800' : 'text-gray-500'}`}
                                aria-current={index === items.length - 1 ? 'page' : undefined}
                            >
                                {item.label}
                            </span>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    );
};

export default Breadcrumb;