// src/types/inventory_item.ts
import type { Supplier } from './supplier'; // Assuming supplier type

export interface InventoryItem {
    id: number;
    name: string;
    sku_number: string;
    reference_code?: string | null; // Made optional based on schema
    storage_unit: string; // e.g., kg, liter, box
    recipe_unit: string; // e.g., g, ml, piece
    conversion_factor: number | string; // How many recipe units in one storage unit
    pricing_type: 'fixed' | 'dynamic';
    price: number | string; // Price per storage unit

    barcode?: string | null;
    inventory_category_id?: number | null; // Optional category link

    minimum_stock?: number | string | null;
    maximum_stock?: number | string | null;
    refill_level?: number | string | null;
    stock: number | string; // Current stock in storage units

    supplier_id?: number | null; // Optional supplier link
    supplier?: Supplier | null; // Eager loaded relationship

    created_at?: string;
    updated_at?: string;
}

export type InventoryItemFormData = Omit<InventoryItem, 'id' | 'supplier' | 'created_at' | 'updated_at'> & {
    // Ensure numeric fields start as strings, optionals as null
    supplier_id: string | null;
    inventory_category_id: string | null;
    minimum_stock: string; // Start as string
    maximum_stock: string; // Start as string
    refill_level: string;  // Start as string
};

export const initialInventoryItemFormData: InventoryItemFormData = {
    name: '',
    sku_number: '',
    reference_code: '',
    storage_unit: '', // e.g., kg
    recipe_unit: '', // e.g., g
    conversion_factor: '', // e.g., 1000
    pricing_type: 'fixed',
    price: '', // e.g., 50
    barcode: '',
    inventory_category_id: null,
    minimum_stock: '0',
    maximum_stock: '0',
    refill_level: '0',
    stock: '0', // Initial stock on creation
    supplier_id: null,
};