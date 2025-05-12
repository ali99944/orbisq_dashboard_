
export interface Reason {
    id: number;
    name: string;
    // Optional: Link to a category (if you add the foreign key later)
    // reason_category_id?: number | null;
    // reason_category?: ReasonCategory | null; // Eager loaded
    created_at?: string;
    updated_at?: string;
}

// Form data type
export type ReasonFormData = Pick<Reason, 'name'> & {
    // reason_category_id?: string | null; // Add if linking to category
};

// Initial state
export const initialReasonFormData: ReasonFormData = {
    name: '',
    // reason_category_id: null,
};