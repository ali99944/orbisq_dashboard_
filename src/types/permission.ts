// src/types/permission.ts
export interface Permission {
    id: number | string; // Can be string like 'orders.create'
    name: string;        // Human-readable name (e.g., "Create Orders")
    description?: string; // Optional explanation
    group?: string;       // Grouping (e.g., "Orders", "Products", "Settings")
}

// src/types/permission_group.ts
// This might just be a concept for UI grouping, not necessarily a separate DB table
// If it IS a table, define its structure here.
// For now, we'll treat it as a UI construct derived from permissions.
// If you need to *manage* groups separately (add/edit group names/descriptions),
// then you would create a dedicated type and page like below.

export interface PermissionGroup {
    // Assuming groups are identified by the 'group' string in Permission type
    name: string; // The group name (e.g., "Orders")
    description?: string; // Optional description for the group
    permissions_count?: number; // Number of permissions in this group
}

// If managing groups directly:
export interface PermissionGroupManaged {
    id: number;
    name: string;
    description?: string | null;
    created_at?: string;
    updated_at?: string;
}
export type PermissionGroupFormData = Omit<PermissionGroupManaged, 'id' | 'created_at' | 'updated_at'>;
export const initialPermissionGroupFormData: PermissionGroupFormData = { name: '', description: '' };