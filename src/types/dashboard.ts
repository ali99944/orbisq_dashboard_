// src/types/dashboard.ts

// Dashboard Overview Types
export interface DashboardOverview {
    customers: {
        count: number
        change_percentage: number
    },
    average_order_value: {
        value: number
        change_percentage: number
        currency: string
    },
    total_orders: {
        count: number
        change_percentage: number
    },

    total_sales: {
        value: number
        change_percentage: number
        currency: string
    },

    order_status_trends: {
        total_rejected_orders: {
            count: number,
            change_percentage: number
        },
        total_completed_orders: {
            count: number,
            change_percentage: number
        },
        total_pending_orders: {
            count: number
        },
        total_preparing_orders: {
            count: number
        }
    }
}

// Top Performers Types
export interface TopDish {
    rank: number;
    product_id: string;
    name: string;
    order_count: number;
    total_quantity: number;
    total_revenue: number;
}

export interface TopCategory {
    rank: number;
    category_id: string;
    name: string;
    order_count: number;
    total_quantity: number;
    total_revenue: number;
}
// Request Parameters Type
export interface DashboardTimeframe {
    timeframe?: 'day' | 'week' | 'month' | 'year' | 'custom';
    start_date?: string;
    end_date?: string;
    limit?: number;
}

// Chart Types
export interface ChartDataPoint {
    name: string;
    value: number;
}

export interface DashboardChart {
    title: string;
    data: ChartDataPoint[];
    dataKey: string;
    color: string;
}

// Stats Type
export interface DashboardStat {
    label: string;
    value: string | number;
    previousValue?: string | number;
    unit?: string;
}

// Combined Dashboard Data Type
export interface DashboardData {
    stats: Record<string, DashboardStat>;
    charts: Record<string, DashboardChart>;
    overview: DashboardOverview;
    topDishes: TopDish[];
    topCategories: TopCategory[];
}