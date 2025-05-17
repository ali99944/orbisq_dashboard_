// src/pages/dashboard/DashboardHomePage.tsx
import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom'; // Assuming you use react-router-dom
import {
    ShoppingCart, DollarSign, Users,
    Percent, ArrowUpRight, ArrowDownRight,
} from 'lucide-react';

import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear } from 'date-fns';
import { arSA } from 'date-fns/locale'; // For Arabic date formatting
import Alert from '../../components/ui/alert';
import Spinner from '../../components/ui/spinner';
import Card from '../../components/ui/card';

// --- KPICard Component (Enhanced for this page) ---
interface KPICardProps {
    title: string;
    value: string | number;
    unit?: string;
    trendValue?: number | null; // Positive or negative percentage or absolute change
    trendType?: 'percentage' | 'absolute';
    trendPeriod?: string;
    icon: React.ElementType;
    iconColorClass?: string;
    bgColorClass?: string;
    description?: string;
    linkTo?: string; // Optional link for "View Details"
    isLoading?: boolean;
}

const KPICard: React.FC<KPICardProps> = ({
    title,
    value,
    unit,
    trendValue,
    trendType = 'percentage',
    trendPeriod,
    icon: Icon,
    iconColorClass = 'text-primary',
    bgColorClass = 'bg-primary/10',
    description,
    linkTo,
    isLoading
}) => {
    const isPositiveTrend = trendValue !== null && trendValue !== undefined && trendValue >= 0;
    const trendColor = isPositiveTrend ? 'text-green-600' : 'text-red-600';
    const TrendIcon = isPositiveTrend ? ArrowUpRight : ArrowDownRight;

    if (isLoading) {
        return (
            <div className="bg-white border border-gray-200 rounded-xl p-5 animate-pulse">
                <div className="flex items-center justify-between mb-2">
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-8 w-8 bg-gray-200 rounded-lg"></div>
                </div>
                <div className="h-10 bg-gray-300 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/3"></div>
            </div>
        );
    }

    return (
        <div className="bg-white border border-gray-200 rounded-xl p-4  transition-shadow duration-200 flex flex-col justify-between h-full">
            <div>
                <div className="flex items-start justify-between mb-1">
                    <p className="text-sm font-medium text-gray-500">{title}</p>
                    <div className={`p-2 rounded-lg ${bgColorClass}`}>
                        <Icon size={20} className={iconColorClass} />
                    </div>
                </div>
                <p className="text-3xl font-bold text-gray-900 truncate">
                    {value}
                    {unit && <span className="text-sm font-medium text-gray-500 mr-1">{unit}</span>}
                </p>
                {(trendValue !== null && trendValue !== undefined) && (
                    <div className={`mt-1 flex items-center text-xs ${trendColor}`}>
                        <TrendIcon size={14} className="ml-0.5" />
                        <span>
                            {Math.abs(trendValue).toFixed(trendType === 'percentage' ? 1 : 2)}
                            {trendType === 'percentage' ? '%' : (unit ? ` ${unit}` : '')}
                        </span>
                        {trendPeriod && <span className="text-gray-400 mr-1">{trendPeriod}</span>}
                    </div>
                )}
                 {description && <p className="text-xs text-gray-500 mt-2">{description}</p>}
            </div>
            {linkTo && (
                <Link to={linkTo} className="block mt-3 text-xs font-medium text-primary hover:underline self-start">
                    عرض التفاصيل
                </Link>
            )}
        </div>
    );
};
// --- End KPICard Component ---


type TimePeriod = 'day' | 'week' | 'month' | 'year' | 'custom'; // Added 'year' to TimePeriod type

import { useDashboardOverview, useTopDishes, useTopCategories } from '../../hooks/use-dashboard';
import type { DashboardTimeframe } from '../../types/dashboard';

// --- Component ---
const DashboardHomePage: React.FC = () => {
    const [timePeriod, setTimePeriod] = useState<TimePeriod>('week');
    const [customStartDate, setCustomStartDate] = useState<Date | null>(null);
    const [customEndDate, setCustomEndDate] = useState<Date | null>(new Date()); // Default custom end to today
     // Initial date for 'day' period - could also be updated when 'day' is selected
    const [selectedSingleDate, setSelectedSingleDate] = useState<Date | null>(new Date());


    // --- API Data Fetching ---
    const params: DashboardTimeframe = {
        timeframe: timePeriod,
        ...(customStartDate && { start_date: format(customStartDate, 'yyyy-MM-dd') }),
        ...(customEndDate && { end_date: format(customEndDate, 'yyyy-MM-dd') }),
        ...(timePeriod === 'day' && selectedSingleDate && { start_date: format(selectedSingleDate, 'yyyy-MM-dd'), end_date: format(selectedSingleDate, 'yyyy-MM-dd') })
    };

    const { data: overview, isLoading: overviewLoading, error: overviewError } = useDashboardOverview(params);
    const { data: topDishes, isLoading: dishesLoading } = useTopDishes(params);
    const { data: topCategories, isLoading: categoriesLoading } = useTopCategories(params);

    console.log(overview);
    console.log(topDishes);
    console.log(topCategories);
    

    const isLoading = overviewLoading || dishesLoading || categoriesLoading;
    const error = overviewError;

    const dashboardKPIs = useMemo(() => overview ? {
        totalSales: {
            title: "إجمالي المبيعات",
            value: overview.total_sales.value,
            unit: overview.total_sales.currency,
            trendValue: overview.total_sales.change_percentage,
            icon: DollarSign,
            iconColorClass: 'text-green-500',
            bgColorClass: 'bg-green-50',
            linkTo: "/reports/sales"
        },
        totalOrders: {
            title: "إجمالي الطلبات",
            value: overview.total_orders.count,
            trendValue: overview.total_orders.change_percentage,
            icon: ShoppingCart,
            iconColorClass: 'text-blue-500',
            bgColorClass: 'bg-blue-50',
            linkTo: "/orders"
        },
        avgOrderValue: {
            title: "متوسط قيمة الطلب",
            value: overview.average_order_value.value,
            unit: overview.average_order_value.currency,
            trendValue: overview.average_order_value.change_percentage,
            icon: Percent,
            iconColorClass: 'text-indigo-500',
            bgColorClass: 'bg-indigo-50'
        },
        activeCustomers: {
            title: "العملاء (هذا " + (timePeriod === 'day' ? 'اليوم' : timePeriod === 'week' ? 'الأسبوع' : 'الشهر') + ")",
            value: overview.customers.count,
            trendValue: overview.customers.change_percentage,
            icon: Users,
            iconColorClass: 'text-sky-500',
            bgColorClass: 'bg-sky-50',
            linkTo: "/customers"
        }
    } : {}, [overview, timePeriod]);


    // --- Time Period Buttons & Logic ---
    const timePeriodOptions: { key: TimePeriod; label: string }[] = [
        { key: 'day', label: 'اليوم' }, { key: 'week', label: 'هذا الأسبوع' },
        { key: 'month', label: 'هذا الشهر' }, { key: 'year', label: 'هذه السنة' }, // Changed 'this_year' to 'year'
        { key: 'custom', label: 'فترة مخصصة' },
    ];

    const handleTimePeriodChange = (period: TimePeriod) => {
        setTimePeriod(period);
        if (period === 'day') {
             setSelectedSingleDate(new Date()); // Default to today when 'day' is selected
             setCustomStartDate(null); setCustomEndDate(null);
        } else if (period !== 'custom') {
            setCustomStartDate(null); setCustomEndDate(null);
            setSelectedSingleDate(null);
        }
        // For custom, dates are set via DatePickerInput
    };

    // --- Date Range for Display ---
     const displayDateRange = useMemo(() => {
        const today = new Date();
        let start: Date | null = null;
        let end: Date | null = null;

        switch (timePeriod) {
            case 'day':
                start = end = selectedSingleDate || today;
                return format(start, 'd MMMM yyyy', { locale: arSA });
            case 'week':
                start = startOfWeek(today, { weekStartsOn: 0, locale: arSA }); // Sunday as start
                end = endOfWeek(today, { weekStartsOn: 0, locale: arSA });
                break;
            case 'month':
                start = startOfMonth(today);
                end = endOfMonth(today);
                break;
            case 'year': // Changed from this_year
                start = startOfYear(today);
                end = endOfYear(today);
                break;
            case 'custom':
                start = customStartDate;
                end = customEndDate;
                if (!start && !end) return "اختر فترة مخصصة";
                if (start && !end) return `من ${format(start, 'd MMM yyyy', { locale: arSA })}`;
                if (!start && end) return `حتى ${format(end, 'd MMM yyyy', { locale: arSA })}`;
                break;
            default: return "فترة غير محددة";
        }
        if (!start || !end) return "اختر فترة"; // Should not happen if logic is correct
        if (format(start, 'yyyy-MM-dd') === format(end, 'yyyy-MM-dd')) return format(start, 'd MMMM yyyy', { locale: arSA });
        return `${format(start, 'd MMM', { locale: arSA })} - ${format(end, 'd MMM yyyy', { locale: arSA })}`;
    }, [timePeriod, selectedSingleDate, customStartDate, customEndDate]);


    // --- Render ---
    return (
        <div className="space-y-6 md:space-y-8 p-1"> {/* Added small padding for page */}
            {/* === Header Row === */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
                <h1 className="text-2xl font-bold text-gray-800">نظرة عامة على الأداء</h1>
                <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-end">
                    <div className="flex items-center bg-gray-100 border border-gray-300 rounded-lg p-1">
                        {timePeriodOptions.map(period => (
                            <button
                                key={period.key}
                                onClick={() => handleTimePeriodChange(period.key)}
                                className={`px-3 py-1.5 text-xs font-semibold rounded-md ${
                                    timePeriod === period.key
                                        ? 'bg-white text-primary  border border-gray-300'
                                        : 'text-gray-500 hover:text-gray-800 hover:bg-white/70'
                                } transition-all duration-150 ease-in-out`}
                            >
                                {period.label}
                            </button>
                        ))}
                    </div>
                    {/* Custom Date Range Pickers */}
                     {timePeriod === 'custom' ? (
                        <div className="flex items-center gap-1 text-xs">
                            {/* <div className="w-36"><DatePickerInput selectedDate={customStartDate} onChange={setCustomStartDate} placeholder="من تاريخ"  maxDate={customEndDate || new Date()}/></div> */}
                            {/* <div className="w-36"><DatePickerInput selectedDate={customEndDate} onChange={setCustomEndDate} placeholder="إلى تاريخ"  minDate={customStartDate} maxDate={new Date()}/></div> */}
                        </div>
                     ) : timePeriod === 'day' ? (
                        <div></div>
                        // <div className="w-36"><DatePickerInput selectedDate={selectedSingleDate} onChange={setSelectedSingleDate} dateFormat="yyyy-MM-dd"  maxDate={new Date()}/></div>
                     ) : null}
                    {/* <Button variant="ghost" size="sm" icon={Download} className="p-2 text-gray-500 hover:bg-gray-200" title="تصدير التقرير" /> */}
                </div>
            </div>
            <p className="text-sm text-gray-500 -mt-4">
                عرض بيانات: <span className="font-medium text-primary">{displayDateRange}</span>
            </p>

            {/* --- Main Content --- */}
            {isLoading && <div className="flex justify-center py-20"><Spinner size="lg" message="جاري تحميل البيانات..." /></div>}
            {error && !isLoading && <Alert variant="error" title="خطأ" message={(error as Error).message || "فشل تحميل البيانات."} />}

            {!isLoading && !error && (
                <>
                    {/* --- KPIs Section --- */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        {Object.entries(dashboardKPIs).map(([key, kpiData]) => (
                            <KPICard key={key} {...kpiData} trendPeriod="مقارنة بالفترة السابقة" isLoading={isLoading} />
                        ))}
                    </div>

                    {/* --- Top Performers & Insights --- */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-6">
                        <Card title="الأطباق الأكثر طلباً" className="md:col-span-1">
                            <ul className="space-y-1.5 max-h-80 overflow-y-auto pr-1 text-sm">
                                {topDishes?.top_dishes?.map((dish) => (
                                    <li key={dish.id} className="flex justify-between items-center py-1.5 border-b border-gray-100 last:border-0">
                                        <span className="text-gray-700 truncate max-w-[65%]">{dish.name}</span>
                                        <div className="flex items-center gap-2">
                                            <span className={`text-xs ${dish.trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                {dish.trend > 0 ? '+' : ''}{dish.trend}%
                                            </span>
                                            <span className="font-semibold text-xs">{dish.quantity} طلب</span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </Card>
                        <Card title="الأصناف الأكثر طلباً" className="md:col-span-1">
                            <ul className="space-y-1.5 max-h-80 overflow-y-auto pr-1 text-sm">
                                {topCategories?.top_categories?.map((category) => (
                                    <li key={category.id} className="flex justify-between items-center py-1.5 border-b border-gray-100 last:border-0">
                                        <span className="text-gray-700 truncate max-w-[65%]">{category.name}</span>
                                        <div className="flex items-center gap-2">
                                            <span className={`text-xs ${category.trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                {category.trend > 0 ? '+' : ''}{category.trend}%
                                            </span>
                                            <span className="font-semibold text-xs">{category.quantity} طلب</span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </Card>
                    </div>
                </>
            )}
        </div>
    );
};

export default DashboardHomePage;