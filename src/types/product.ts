// src/types/product.ts
import type { Tax } from './tax'; // Assuming you have this type
import type { Discount } from './discount'; // Assuming you have this type
import { Category } from './category';

// Structure for linked inventory items (Recipe/Bill of Materials)
export interface ProductRecipeItem {
    inventory_item_id: number;
    inventory_item_name: string; // Denormalized name for display
    quantity: number | string;   // Quantity of inventory item needed
    recipe_unit: string;         // Unit from inventory item (e.g., 'g', 'ml', 'piece')
    // Maybe add cost calculation later
}

export interface Product {
    id: number;
    name: string;
    image?: string | null;
    description?: string | null;
    calories?: number | string | null;
    perpare_time?: number | string | null; // Preparation time in minutes

    product_category_id: number | null;
    tax_id?: number | null;
    discount_id?: number | null;
    is_active: boolean;
    is_retail: boolean; // New field

    sku_number?: string | null;
    reference_code?: string | null;

    price?: number | string | null; // Price is optional now
    pricing_type: 'fixed' | 'dynamic';
    sales_unit_type: 'piece' | 'weight'; // kg, g, lb, oz etc. might be needed later
    cost_calculation_unit: 'ingredient' | 'operation';

    stock?: number; // Current stock level (might be calculated or manually set)

    created_at?: string;
    updated_at?: string;

    // Eager loaded relationships (optional from API)
    product_category?: Category;
    tax?: Tax | null;
    discount?: Discount | null;
    recipe_items?: ProductRecipeItem[]; // Array of linked inventory items for recipe
}

// Type for Add/Edit Form state
export type ProductFormData = Omit<Product, 'id' | 'created_at' | 'updated_at' | 'product_category' | 'tax' | 'discount' | 'recipe_items'>;

// Initial state for Add Form
export const initialProductFormData: ProductFormData = {
    name: '',
    image: null, // Handled by FileUpload
    description: '',
    calories: '',
    perpare_time: '',
    product_category_id: null, // Required, user must select
    tax_id: null,
    discount_id: null,
    is_active: true,
    is_retail: false, // Default to not retail
    sku_number: '',
    reference_code: '',
    price: '',
    pricing_type: 'fixed',
    sales_unit_type: 'piece',
    cost_calculation_unit: 'ingredient',
};