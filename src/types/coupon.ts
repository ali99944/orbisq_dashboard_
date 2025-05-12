// src/types/coupon.ts

// Assuming Shop and Discount types exist or are simple IDs for now
type ShopId = number;
type DiscountId = number | null;

export interface Coupon {
    id: number;
    shop_id: ShopId; // From context or API response
    discount_id?: DiscountId; // Optional linked discount
    code: string;
    description?: string | null;
    type?: 'percentage' | 'fixed_amount' | null; // Nullable if linked to Discount
    value?: number | string | null; // Nullable if linked to Discount
    is_active: boolean;
    start_date?: string | null; // ISO Date string
    end_date?: string | null;   // ISO Date string
    usage_limit_per_customer?: number | null;
    usage_limit_total?: number | null;
    times_used: number;
    minimum_order_amount?: number | string | null;
    created_at: string;
    updated_at: string;

    // Optional related data if eager loaded
    // discount?: Discount;
    // shop?: Shop;
}