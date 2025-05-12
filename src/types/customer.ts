// src/types/customer.ts
export interface Customer {
    id: number;
    name: string;
    phone_number: string; // Assuming phone is mandatory/primary identifier
    // Optional data that might be collected or added later
    email?: string | null;
    address?: string | null;
    orders_count?: number; // Count of associated orders (from API)
    last_order_date?: string | null; // ISO Date string
    created_at?: string;
    updated_at?: string;
    // shop_id might be implicit based on authenticated user
}

// Type for Add/Edit form
export type CustomerFormData = Omit<Customer, 'id' | 'created_at' | 'updated_at' | 'orders_count' | 'last_order_date'>;

// Initial state for Add/Edit modal
export const initialCustomerFormData: CustomerFormData = {
    name: '',
    phone_number: '',
    email: '',
    address: '',
};