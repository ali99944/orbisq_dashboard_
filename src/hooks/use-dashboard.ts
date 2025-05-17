// src/hooks/use-dashboard.ts

import { useGetQuery } from './queries-actions';
import type { DashboardOverview, TopDish, TopCategory, DashboardTimeframe } from '../types/dashboard';

export const useDashboardOverview = (params: DashboardTimeframe) => {
    return useGetQuery<DashboardOverview>({
        key: ['dashboard', 'overview', params],
        url: `/dashboard/overview?${new URLSearchParams({
            timeframe: params.timeframe || 'week',
            ...(params.start_date && { start_date: params.start_date }),
            ...(params.end_date && { end_date: params.end_date })
        }).toString()}`,
    });
};

export const useTopDishes = (params: DashboardTimeframe) => {
    return useGetQuery<{
        top_dishes: TopDish[];
        time_frame: {
            start: string
            end: string
            label: string
        }
    }>({
        key: ['dashboard', 'top-dishes', params],
        url: `/dashboard/top-dishes?${new URLSearchParams({
            timeframe: params.timeframe || 'week',
            limit: String(params.limit || 5),
            ...(params.start_date && { start_date: params.start_date }),
            ...(params.end_date && { end_date: params.end_date })
        }).toString()}`,
    });
};

export const useTopCategories = (params: DashboardTimeframe) => {
    return useGetQuery<{
        top_categories: TopCategory[];
        time_frame: {
            start: string
            end: string
            label: string
        }
    }>({
        key: ['dashboard', 'top-categories', params],
        url: `/dashboard/top-categories?${new URLSearchParams({
            timeframe: params.timeframe || 'week',
            limit: String(params.limit || 5),
            ...(params.start_date && { start_date: params.start_date }),
            ...(params.end_date && { end_date: params.end_date })
        }).toString()}`,
    });
};