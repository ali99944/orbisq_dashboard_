// src/types/branch.ts
export interface Branch {
    id: number;
    shop_id: number;
    name: string;
    address_line1?: string | null;
    address_line2?: string | null;
    city?: string | null;
    state_province?: string | null;
    postal_code?: string | null;
    country_code?: string | null;
    phone?: string | null;
    email?: string | null;
    latitude?: number | string | null; // Input might be string
    longitude?: number | string | null; // Input might be string
    operating_hours?: any | null; // JSON - handle appropriately
    is_active: boolean;
    is_primary: boolean;
    notes?: string | null;
    created_at?: string;
    updated_at?: string;
}

export type BranchFormData = Omit<Branch, 'id' | 'shop_id' | 'created_at' | 'updated_at'>;

export const initialBranchFormData: BranchFormData = {
    name: '',
    address_line1: '',
    address_line2: '',
    city: '',
    state_province: '',
    postal_code: '',
    country_code: 'SA', // Default
    phone: '',
    email: '',
    latitude: '', // Start as string for input
    longitude: '', // Start as string for input
    operating_hours: null, // Consider a dedicated component for this later
    is_active: true,
    is_primary: false,
    notes: '',
};