// src/types/reason_category.ts
export interface ReasonCategory {
    id: number;
    name: string;
    created_at?: string;
    updated_at?: string;
    reasons_count?: number; // Optional: Count of reasons in this category
}

// Form data type (simple)
export type ReasonCategoryFormData = Pick<ReasonCategory, 'name'>;

// Initial state
export const initialReasonCategoryFormData: ReasonCategoryFormData = {
    name: '',
};