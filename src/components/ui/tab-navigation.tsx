import React from 'react';

interface TabItem {
    key: string;
    label: string;
}

interface TabNavigationProps {
    tabs: TabItem[];
    activeTab: string;
    onTabChange: (tabKey: string) => void;
}

const TabNavigation: React.FC<TabNavigationProps> = ({ tabs, activeTab, onTabChange }) => {
    const primaryColor = '#A70000';

    return (
        <div className="border-b border-gray-200">
            <nav className="-mb-px flex gap-x-4" aria-label="Tabs" dir="rtl">
                {tabs.map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => onTabChange(tab.key)}
                        className={`whitespace-nowrap py-3 px-1 border-b-2 text-sm font-medium transition-colors duration-150 ease-in-out focus:outline-none ${
                            activeTab === tab.key
                                ? `border-[${primaryColor}] text-[${primaryColor}]` // Active tab style
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300' // Inactive tab style
                        }`}
                         style={{
                            borderColor: activeTab === tab.key ? primaryColor : undefined,
                            color: activeTab === tab.key ? primaryColor : undefined
                         }}
                        aria-current={activeTab === tab.key ? 'page' : undefined}
                    >
                        {tab.label}
                    </button>
                ))}
            </nav>
        </div>
    );
};

export default TabNavigation;