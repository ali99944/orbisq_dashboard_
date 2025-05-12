export interface Category {
    id: number;
    name: string;
    description?: string | null; // Optional description
    image?: string | null;       // Optional image path
    is_active: boolean;         // Status
    products_count?: number;   // Optional: Count of associated dishes/products
    created_at: string;
    // Add other fields if needed
}