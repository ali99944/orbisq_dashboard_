// src/types/dashboard.ts (Example)
export interface DashboardStat {
    label: string;
    value: string | number;
    // Optional: Add previous value for comparison/trend
    previousValue?: string | number;
    unit?: string; // e.g., 'SAR', '%'
}

export interface ChartDataPoint {
    name: string; // e.g., 'يوم 1', 'Week 3', 'يناير'
    value: number;
    // Optional other values for multi-line charts
}

export interface DashboardChart {
    title: string;
    data: ChartDataPoint[];
    dataKey: string; // Key in ChartDataPoint for the value line
    color: string; // Hex color for the chart line/area
}

// Type for API response (adjust based on your actual API)
export interface DashboardData {
    stats: Record<string, DashboardStat>; // Use keys like 'totalOrders', 'netSales'
    charts: Record<string, DashboardChart>; // Use keys like 'ordersTrend', 'salesTrend'
}