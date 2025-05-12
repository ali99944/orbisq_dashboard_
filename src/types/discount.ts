// src/types/discount.ts

type ShopId = number;

export interface Discount {
    id: number;
    shop_id: ShopId;
    name: string;
    description?: string | null;
    type: 'percentage' | 'fixed_amount_off' | 'fixed_price';
    value: number | string; // Store as string from input, convert on save
    is_active: boolean;
    start_date?: string | null; // ISO Date string from API or Date object in state
    end_date?: string | null;   // ISO Date string from API or Date object in state
    created_at?: string;
    updated_at?: string;
}

// Type for form state, potentially using Date objects for pickers
export interface DiscountFormData extends Omit<Discount, 'id' | 'shop_id' | 'created_at' | 'updated_at'> {
    start_date_obj?: Date | null;
    end_date_obj?: Date | null;
    // Value might still be string here for easier input handling
}

// Initial state for Add Form
export const initialDiscountState: DiscountFormData = {
    name: '',
    description: '',
    type: 'percentage',
    value: '', // Start as empty string
    is_active: true,
    start_date: null,
    end_date: null,
    start_date_obj: null, // For picker state
    end_date_obj: null,   // For picker state
};