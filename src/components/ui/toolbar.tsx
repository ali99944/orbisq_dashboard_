import React from 'react';
import Breadcrumb, { BreadcrumbItem } from './breadcrumb';

interface ToolbarProps {
    breadcrumbItems: BreadcrumbItem[];
    actions?: React.ReactNode; // Slot for action buttons
}

const Toolbar: React.FC<ToolbarProps> = ({ breadcrumbItems, actions }) => {
    return (
        <div className="bg-white border border-gray-200 py-2 px-2 sm:px-2 mb-4 rounded-md"> {/* Added rounded */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
                {/* Breadcrumbs */}
                <Breadcrumb items={breadcrumbItems} />

                {/* Action Buttons */}
                {actions && (
                    <div className="flex items-center gap-2 flex-shrink-0">
                        {actions}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Toolbar;