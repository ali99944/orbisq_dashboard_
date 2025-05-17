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

export interface ModifierGroup {
    id: number;
    name: string;
    description?: string | null;
    display_type: 'radio' | 'checkbox' | 'dropdown' | 'quantity';
    modifiers: Modifier[];
}

export interface Modifier {
    id: number;
    group_id: number;
    name: string;
    description?: string | null;
    price_adjustment: number;
    is_default: boolean;
    sort_order: number;
    sku?: string | null;
    stock_quantity?: number | null;
    is_active: boolean;
}

export interface AddonGroup {
    id: number;
    name: string;
    description?: string | null;
    addons: Addon[];
}

export interface Addon {
    id: number;
    group_id: number;
    name: string;
    description?: string | null;
    price: number;
    sort_order: number;
    sku?: string | null;
    stock_quantity?: number | null;
    is_active: boolean;
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
    
    // Modifiers and Addons
    modifier_groups?: ProductModifierGroup[];
    addon_groups?: ProductAddonGroup[];
}

interface ProductModifierGroup {
    product_id: number
    group: ModifierGroup
    is_required: boolean
    min_selections: number
    max_selections: number
    sort_order: number
}

interface ProductAddonGroup {
    product_id: number
    group: ModifierGroup
    sort_order: number
}

// Type for Add/Edit Form state
export type ProductFormData = Omit<Product, 'id' | 'created_at' | 'updated_at' | 'product_category' | 'tax' | 'discount' | 'recipe_items' | 'modifier_groups' | 'addon_groups'> & {
    modifier_group_ids?: number[];
    addon_group_ids?: number[];
};

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
    modifier_group_ids: [],
    addon_group_ids: [],
};