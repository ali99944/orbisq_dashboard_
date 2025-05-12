// src/types/report.ts
import type { ChartDataPoint } from './dashboard'; // Reuse chart data type

export interface ReportStat {
    label: string;
    value: string | number;
    unit?: string;
    change?: number | null; // Percentage change vs previous period
}

export interface ReportChart {
    title: string;
    data: ChartDataPoint[];
    dataKey: string;
    color: string;
    // Add other potential keys if multi-line chart (e.g., delivery vs pickup)
    // dataKey2?: string;
    // color2?: string;
}

export interface TopItem {
    id: number;
    name: string;
    quantity_sold?: number; // Or count
    total_sales?: number | string;
}

// Example structure for the API response for a Sales Report
export interface SalesReportData {
    summary: {
        total_sales: ReportStat;
        total_orders: ReportStat;
        average_order_value: ReportStat;
        total_discount: ReportStat;
        net_sales: ReportStat; // Sales after discount
        total_tax: ReportStat;
        // Add more summary stats...
    };
    sales_trend: ReportChart; // Time series chart
    sales_by_order_type: ReportChart; // Pie or Bar chart data
    top_selling_items: TopItem[];
    top_selling_categories: TopItem[];
    // Add more report sections...
}

// Add similar interfaces for other report types (OrdersReportData, etc.)