import { Branch } from "./branch"
import { Category } from "./category"
import { Coupon } from "./coupon"
import { Desk } from "./desk"
import { Discount } from "./discount"
import { Product } from "./product"

export interface Shop {
  id: number
  name: string
  slug: string
  logo?: string
  cover?: string
  description?: string
  address?: Address
  address_id?: number
  contact_info?: ContactInfo
  contact_info_id?: number
  social_links?: SocialLink[]
  social_links_id?: number
  currency_info?: CurrencyInfo
  currency_info_id: number
  business_info?: BusinessInfo
  business_info_id?: number
  shop_theme?: ShopTheme
  shop_theme_id?: number
  status: ShopStatus
  orders_count: number
  views_count: number
  last_sale_at?: Date
  timezone: string
  language: string
  rating?: number
  review_count: number
  payment_methods: string[]
  fulfillment_types: string[]
  created_at: Date
  updated_at: Date
  desks: Desk[]
//   gift_cards: GiftCard[]
  branches: Branch[]
  coupons: Coupon[]
  categories: Category[]
  products: Product[]
  discounts: Discount[]
  access_portal?: ShopAccessPortal
  shop_owner_id: number
  shop_owner: ShopOwner
}

export interface ShopAccessPortal {
  id: number
  shop_id: number
  username: string
  password: string
  is_active: boolean
  last_login_at?: Date
  permissions?: object
  created_at: Date
  updated_at: Date
  shop: Shop
  access_tokens: ShopAccessToken[]
}

export interface ShopAccessToken {
  id: number
  token: string
  owner_id?: number
  portal_id?: number
  expires_at: Date
  last_used_at?: Date
  ip_address?: string
  user_agent?: string
  created_at: Date
  owner?: ShopOwner
  portal?: ShopAccessPortal
}

export interface ShopOwner {
  id: number
  first_name: string
  last_name: string
  email: string
  phone: string
  password: string
  is_active: boolean
  email_verified: boolean
  phone_verified: boolean
  last_login_at?: Date
  created_at: Date
  updated_at: Date
  shops: Shop[]
  access_tokens: ShopAccessToken[]
}

export interface Address {
  id: number
  street?: string
  city?: string
  state?: string
  country?: string
  postal_code?: string
  latitude?: number
  longitude?: number
  is_primary: boolean
  notes?: string
  created_at: Date
  updated_at: Date
  branches: Branch[]
}

export interface ContactInfo {
  id: number
  phone?: string
  mobile?: string
  email?: string
  website?: string
  support_email?: string
  whatsapp?: string
  telegram?: string
  created_at: Date
  updated_at: Date
}

export interface SocialLink {
  id: number
  facebook?: string
  twitter?: string
  instagram?: string
  linkedin?: string
  whatsapp?: string
  telegram?: string
  snapchat?: string
  youtube?: string
  tiktok?: string
  pinterest?: string
  created_at: Date
  updated_at: Date
}

export interface CurrencyInfo {
  id: number
  currency: string
  currency_symbol: string
  currency_code: string
  decimal_places: number
  exchange_rate?: number
  is_default: boolean
  created_at: Date
  updated_at: Date
}

export interface BusinessInfo {
  id: number
  has_delivery: boolean
  has_takeaway: boolean
  has_reservation: boolean
  has_dine_in: boolean
  has_through_drive: boolean
  delivery_cost: number
  minimum_order?: number
  delivery_radius?: number
  preparation_time?: number
  vat_rate: number
  vat_type: VatType
  vat_number?: string
  vat_certificate_url?: string
  commercial_license?: string
  license_url?: string
  opening_time?: string
  closing_time?: string
  created_at: Date
  updated_at: Date
}

export interface ShopTheme {
  id: number
  primary_color: string
  secondary_color: string
  accent_color: string
  text_color: string
  background_color?: string
  background_image?: string
  created_at: Date
  updated_at: Date
}

export enum VatType {
  inclusive,
  exclusive
}

export enum ShopStatus {
  active,
  inactive,
  pending_approval,
  suspended,
  on_break
}
