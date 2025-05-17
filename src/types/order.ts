import { Desk } from "./desk";
import { Discount } from "./discount";
import { Modifier, Product } from "./product";
import { Shop } from "./shop";

export interface Order {
  id: string;
  order_number: string;
  status: OrderStatus;
  customer_id?: number;
//   customer?: Customer;
  desk_id?: number;
  desk?: Desk;
  order_type: OrderType;
  takeaway_pickup_time?: Date;
  takeaway_customer_name?: string;
  takeaway_customer_phone?: string;
  delivery_address?: string;
  delivery_landmark?: string;
  delivery_instructions?: string;
  delivery_customer_name?: string;
  delivery_customer_phone?: string;
  estimated_delivery_time?: Date;
  actual_delivery_time?: Date;
  delivery_fee?: number;
//   waiter_id?: number;
//   waiter?: User;
//   chef_id?: number;
//   chef?: User;
  order_items: OrderItem[];
  subtotal: number;
  tax_amount: number;
  discount_amount: number;
  service_charge?: number;
  tip_amount?: number;
  total: number;
  payment_status: PaymentStatus;
  payment_method?: PaymentMethod;
  transaction_id?: string;
  paid_at?: Date;
  placed_at: Date;
  preparation_time?: number;
  ready_at?: Date;
  served_at?: Date;
  completed_at?: Date;
  notes?: string;
  dietary_restrictions?: string;
  shop_id: number;
  shop: Shop;
  cancelled_at?: Date;
  cancellation_reason?: string;
  created_at: Date;
  updated_at: Date;

}

export interface OrderItem {
  id: number;
  order_id: number;
  order: Order;
  product_id: number;
  product: Product;
  quantity: number;
  unit_price: number;
  total_price: number;
  special_requests?: string;
  variant_options?: Record<string, string>;
  status: ItemStatus;
  started_at?: Date;
  completed_at?: Date;
  applied_discount_id?: number;
  applied_discount?: Discount;
  created_at: Date;

  payment_status: PaymentStatus;
  payment_method?: PaymentMethod;
  refunded_at?: Date;
  transaction_id?: string;
  paid_at?: Date;

  order_item_modifiers: Modifier[]
}

export enum OrderStatus {
  pending,
  confirmed,
  preparing,
  ready,
  served,
  out_for_delivery,
  delivered,
  completed,
  cancelled,
  refunded
}

enum ItemStatus {
  pending,
  preparing,
  ready,
  served,
  cancelled
}

export enum PaymentStatus {
  unpaid,
  paid,
  refunded,
}

enum PaymentMethod {
  cash,
  credit_card,
  debit_card,
  mobile_wallet,
  bank_transfer,
  voucher,
  online_payment
}

export enum OrderType {
  dine_in,
  takeaway,
  delivery
}

