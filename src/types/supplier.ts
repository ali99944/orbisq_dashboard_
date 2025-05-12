// src/types/supplier.ts
export interface Supplier {
    id: number;
    name: string;          // Supplier company name
    code: string;          // Unique supplier code/identifier
    contact_name: string; // Main contact person at the supplier
    phone_number: string;
    email: string;
    address: string;       // Full address string
    created_at?: string;
    updated_at?: string;
    // Add other relevant fields if needed, e.g., vat_number, website, notes
}

// Type for the Add/Edit Form state
export type SupplierFormData = Omit<Supplier, 'id' | 'created_at' | 'updated_at'>;

// Initial state for the form modal/page
export const initialSupplierFormData: SupplierFormData = {
    name: '',
    code: '',
    contact_name: '',
    phone_number: '',
    email: '',
    address: '',
};