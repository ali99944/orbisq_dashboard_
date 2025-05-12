import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react'; // For trend indication

interface KPICardProps {
    title: string;
    value: string | number;
    unit?: string;
    trend?: number | null; // Positive or negative percentage
    trendPeriod?: string;
    icon: React.ElementType;
    iconColorClass?: string; // e.g., 'text-green-500'
    bgColorClass?: string;   // e.g., 'bg-green-50'
    description?: string;
}

const KPICard: React.FC<KPICardProps> = ({
    title,
    value,
    unit,
    trend,
    trendPeriod,
    icon: Icon,
    iconColorClass = 'text-primary',
    bgColorClass = 'bg-primary/10',
    description,
}) => {
    const isPositiveTrend = trend !== null && trend !== undefined && trend >= 0;
    const trendColor = isPositiveTrend ? 'text-green-600' : 'text-red-600';
    const TrendIcon = isPositiveTrend ? ArrowUpRight : ArrowDownRight;

    return (
        <div className="bg-white border border-gray-200 rounded-xl p-5  hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-gray-500">{title}</p>
                <div className={`p-2 rounded-lg ${bgColorClass}`}>
                    <Icon size={20} className={iconColorClass} />
                </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">
                {value}
                {unit && <span className="text-sm font-medium text-gray-500 ml-1">{unit}</span>}
            </p>
            {(trend !== null && trend !== undefined) && (
                <div className={`mt-1 flex items-center text-xs ${trendColor}`}>
                    <TrendIcon size={14} className="ml-0.5" />
                    <span>{Math.abs(trend).toFixed(1)}%</span>
                    {trendPeriod && <span className="text-gray-400 mr-1">{trendPeriod}</span>}
                </div>
            )}
            {description && <p className="text-xs text-gray-500 mt-2">{description}</p>}
        </div>
    );
};

export default KPICard;