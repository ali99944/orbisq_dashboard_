// src/types/coupon.ts

export type DiscountType = 'percentage' | 'fixed_amount_off' | 'fixed_price' | 'free_shipping';

export interface Coupon {
  id: number;
  code: string;
  description?: string | null;
  discount_type: DiscountType;
  discount_value: number;
  min_order_amount?: number | null;
  max_discount?: number | null;
  expires_at?: string | null;
  is_active: boolean;
  usage_limit?: number | null;
  per_user_limit?: number | null;
  times_used: number;
  
  // Relations
  shop_id: number;
  
  created_at: string;
  updated_at: string;
}

export interface CouponRedemption {
  id: number;
  coupon_id: number;
  order_id?: number | null;
  redeemed_at: string;
  discount_amount: number;
  
  // Relations
  coupon?: Coupon;
}