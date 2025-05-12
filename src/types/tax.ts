// src/types/tax.ts
export interface Tax {
    id: number;
    name: string;
    tax_rate: number | string; // Can be string from input
    is_active: boolean;
    created_at?: string; // Optional from API
    updated_at?: string; // Optional from API
}

// Type for the Add/Edit Form state
export type TaxFormData = Omit<Tax, 'id' | 'created_at' | 'updated_at'>;

// Initial state for the form modal
export const initialTaxFormData: TaxFormData = {
    name: '',
    tax_rate: '', // Start as string for input
    is_active: true,
};