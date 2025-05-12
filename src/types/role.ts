// src/types/role.ts
import type { Permission } from './permission';

export interface Role {
    id: number;
    name: string;          // e.g., "Cashier", "Manager", "Chef", "Delivery Staff"
    description?: string;
    permissions: Permission[]; // List of permissions granted to this role
    is_system_role?: boolean; // Flag for default roles that cannot be deleted
    created_at?: string;
    updated_at?: string;
}

// Form data for creating/editing roles
export type RoleFormData = Pick<Role, 'name' | 'description'> & {
    permission_ids: (number | string)[]; // Array of selected permission IDs
};

export const initialRoleFormData: RoleFormData = {
    name: '',
    description: '',
    permission_ids: [],
};