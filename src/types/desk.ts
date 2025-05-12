import { Customer } from "./customer"

export enum DeskStatus {
    Free = 'free',
    Occupied = 'occupied',
    Reserved = 'reserved',
    Cleaning = 'cleaning',
    OutOfService = 'out_of_service',
}

export interface Desk {
    id: number
    shop_id: number
    desk_number: number
    number_of_seats: number
    qrcode: string
    qrcode_url?: string
    status: DeskStatus
    name?: string | null
    customer_id?: number | null
    customer?: Customer | null
    created_at?: string
    updated_at?: string

    // NEW: Custom name like "Window View", "VIP Booth"
    section?: string
    floor?: number
    position_x?: number
    position_y?: number

    // NEW: When desk was reserved
    reservation_time?: string

    // NEW: When desk was occupied
    occupation_time?: string

    // NEW: Service information
    minimum_spend?: number
    has_outlets?: boolean
    has_view?: boolean
    is_wheelchair_accessible?: boolean

    // NEW: Maintenance flags
    needs_cleaning?: boolean
    is_under_maintenance?: boolean
    maintenance_notes?: string
}

export type DeskFormData = Omit<Desk, 'id' | 'shop_id' | 'created_at' | 'updated_at' | 'qrcode' | 'qrcode_url' | 'customer' | 'status'>

export const initialDeskFormData: DeskFormData = {
    desk_number: 0,
    number_of_seats: 2, // Default seats
    name: '',
    customer_id: null, // No customer assigned initially
    section: '',
    floor: 1,
    position_x: 0,
    position_y: 0,
    reservation_time: '',
    occupation_time: '',
    minimum_spend: 0,
    has_outlets: false,
    has_view: false,
    is_wheelchair_accessible: true,
    needs_cleaning: false,
    is_under_maintenance: false,
    maintenance_notes: '',
}
