// src/types/warehouse.ts
export interface Warehouse {
    id: number;
    shop_id: number;
    name: string;
    address_line1?: string | null;
    address_line2?: string | null;
    city?: string | null;
    state_province?: string | null;
    postal_code?: string | null;
    country_code?: string | null;
    contact_person?: string | null;
    contact_phone?: string | null;
    is_primary: boolean;
    is_active: boolean;
    notes?: string | null;
    created_at?: string;
    updated_at?: string;
}

export type WarehouseFormData = Omit<Warehouse, 'id' | 'shop_id' | 'created_at' | 'updated_at'>;

export const initialWarehouseFormData: WarehouseFormData = {
    name: '',
    address_line1: '',
    address_line2: '',
    city: '',
    state_province: '',
    postal_code: '',
    country_code: 'SA',
    contact_person: '',
    contact_phone: '',
    is_primary: false,
    is_active: true,
    notes: '',
};