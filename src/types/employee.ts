// src/types/employee.ts
import type { Role } from './role';
import type { Permission } from './permission';

export interface Employee {
    id: number;
    first_name: string;
    last_name: string;
    email: string; // Used for login usually
    phone_number?: string | null;
    employee_id?: string | null; // Internal ID
    job_title?: string | null; // e.g., "Cashier", "Head Chef"
    hire_date?: string | null; // ISO Date string
    avatar?: string | null; // Image path
    is_active: boolean; // Is the employee currently active?
    // Relationships (potentially eager loaded)
    shop_id?: number; // Assuming employee belongs to one shop/restaurant
    role_id?: number | null; // FK to roles table
    role?: Role | null; // Eager loaded role
    // Direct permissions (less common if using roles, but possible)
    permissions?: Permission[];
    created_at?: string;
    updated_at?: string;
}

// Form data for Add/Edit
export type EmployeeFormData = Omit<Employee, 'id' | 'created_at' | 'updated_at' | 'role' | 'permissions'> & {
    role_id: string | null; // Use string for select
    password?: string; // For setting initial password or changing
    password_confirmation?: string;
    // permission_ids?: (string|number)[]; // If managing direct permissions
};

export const initialEmployeeFormData: EmployeeFormData = {
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    employee_id: '',
    job_title: '',
    hire_date: null,
    avatar: null, // Handled by FileUpload state
    is_active: true,
    role_id: null, // Start with no role selected
    password: '',
    password_confirmation: '',
    // permission_ids: [],
};

// src/pages/hr/EmployeesPage.tsx (or a separate data file)

export const dummyEmployees: Employee[] = [
    {
        id: 101,
        first_name: "أحمد",
        last_name: "الغامدي",
        email: "ahmed.ghamdi@example-resto.com",
        phone_number: "0501234567",
        employee_id: "EMP001",
        job_title: "مدير الفرع",
        hire_date: "2023-05-15",
        avatar: "https://img.freepik.com/free-photo/portrait-mid-adult-bearded-male-ceo- Mader-suit_176474-9231.jpg?w=900", // Example image
        is_active: true,
        shop_id: 1, // Example shop ID
        role_id: 1, // Manager role ID
        role: { id: 1, name: "مدير المطعم", permissions: [] }, // Basic role info
        permissions: [], // No direct permissions initially
        created_at: "2023-05-15T10:00:00Z",
        updated_at: "2024-03-10T08:00:00Z",
    },
    {
        id: 102,
        first_name: "فاطمة",
        last_name: "الزهراني",
        email: "fatima.zahrani@example-resto.com",
        phone_number: "0557654321",
        employee_id: "EMP002",
        job_title: "كاشير رئيسي",
        hire_date: "2023-08-01",
        avatar: "https://img.freepik.com/free-photo/pleasant-looking-middle-aged-woman-with-fair-hair-wears-casual-transparent-glasses_176420-15134.jpg?w=900", // Example image
        is_active: true,
        shop_id: 1,
        role_id: 2, // Cashier role ID
        role: { id: 2, name: "كاشير", permissions: [] },
        permissions: [],
        created_at: "2023-08-01T09:00:00Z",
        updated_at: "2024-02-20T11:00:00Z",
    },
     {
        id: 103,
        first_name: "يوسف",
        last_name: "العنزي",
        email: "yousef.enzi@example-resto.com",
        phone_number: "0539876543",
        employee_id: "EMP003",
        job_title: "شيف",
        hire_date: "2023-11-20",
        avatar: null, // No avatar example
        is_active: true,
        shop_id: 1,
        role_id: 3, // Chef role ID
        role: { id: 3, name: "شيف / المطبخ", permissions: [] },
        permissions: [],
        created_at: "2023-11-20T14:00:00Z",
        updated_at: "2024-01-05T16:30:00Z",
    },
     {
        id: 104,
        first_name: "سارة",
        last_name: "القحطاني",
        email: "sara.qahtani@example-resto.com",
        phone_number: "0541122334",
        employee_id: "EMP004",
        job_title: "موظفة خدمة",
        hire_date: "2024-01-05",
        avatar: null,
        is_active: false, // Inactive example
        shop_id: 1,
        role_id: 2, // Could also be cashier role initially
        role: { id: 2, name: "كاشير", permissions: [] },
        permissions: [],
        created_at: "2024-01-05T11:00:00Z",
        updated_at: "2024-03-01T09:15:00Z",
    },
];