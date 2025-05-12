import React from 'react';
import { ArrowRight } from 'lucide-react'; // Icons for trend

// Define props for the enhanced card
interface StatCardEnhancedProps {
    label: string;
    value: string | number;
    unit?: string; // e.g., 'SAR', '%'
    icon: React.ElementType; // Icon representing the metric
    iconColor?: string; // Hex color for icon & accents (e.g., '#A70000')
    change?: number | null; // Percentage change (e.g., 5.2, -1.5) or null if no change/comparison
    changePeriod?: string; // e.g., "عن الأسبوع الماضي", "عن الشهر الماضي"
    linkTo?: string; // Optional link for more details
    isLoading?: boolean; // Optional loading state
}

const StatCardEnhanced: React.FC<StatCardEnhancedProps> = ({
    label,
    value,
    unit,
    icon: Icon,
    iconColor = '#A70000', // Default to primary red
    // change = null,
    // changePeriod = "عن الفترة السابقة", // Default comparison text
    linkTo,
    isLoading = false,
    // Add other props if needed
}) => {

    const formatValue = (val: string | number): string => {
        // Simple formatter, enhance as needed (e.g., localeString)
        const num = Number(val);
        if (isNaN(num)) return String(val); // Return original if not a number
        return num.toLocaleString('ar-EG'); // Use locale formatting
    };

    // const isPositiveChange = change !== null && change > 0;
    // const isNegativeChange = change !== null && change < 0;
    // const isNeutralChange = change === 0;

    // const changeColor = isPositiveChange ? 'text-green-600' : isNegativeChange ? 'text-red-600' : 'text-gray-500';
    // const ChangeIcon = isPositiveChange ? TrendingUp : isNegativeChange ? TrendingDown : Minus;

    return (
        <div className="bg-white border border-gray-200 rounded-lg p-4 transition-colors duration-150 ease-in-out"> {/* Subtle hover border */}
            {isLoading ? (
                // --- Loading Skeleton ---
                <div className="animate-pulse space-y-2">
                    <div className="flex justify-between items-center">
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                        <div className="h-6 w-6 bg-gray-200 rounded-full"></div>
                    </div>
                    <div className="h-8 bg-gray-300 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                </div>
            ) : (
                // --- Content ---
                <>
                    {/* Header: Label & Icon */}
                    <div className="flex justify-between items-start mb-1">
                        <p className="text-sm font-medium text-gray-600">{label}</p>
                        <div className="p-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: `${iconColor}1A` }}> {/* Icon Background */}
                            <Icon className="w-4 h-4" style={{ color: iconColor }} />
                        </div>
                    </div>

                    {/* Main Value */}
                    <p className="text-2xl md:text-3xl font-bold text-gray-900 truncate">
                        {formatValue(value)}
                        {unit && <span className="text-sm font-medium text-gray-500 mr-1">{unit}</span>}
                    </p>

                    {/* Change Indicator */}
                    <div className="flex items-center text-xs">
                        {/* {change !== null && (
                            <span className={`flex items-center mr-2 ${changeColor}`}>
                                <ChangeIcon size={14} className="ml-0.5" />
                                <span>{Math.abs(change).toFixed(1)}%</span>
                            </span>
                        )} */}
                        {/* {change !== null && <span className="text-gray-500">{changePeriod}</span>} */}
                        {/* {change === null && <span className="text-gray-400 italic">لا توجد بيانات مقارنة</span>} Placeholder if no change data */}
                    </div>

                    {/* Optional Link */}
                    {linkTo && (
                        <a href={linkTo} className="block mt-3 text-xs font-medium text-primary hover:underline flex items-center gap-1">
                            عرض التفاصيل <ArrowRight size={12}/>
                        </a>
                    )}
                </>
            )}
        </div>
    );
};

export default StatCardEnhanced;