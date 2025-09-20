// Core entity interfaces for Reztro multi-tenant SaaS

export type ID = string;

export interface Tenant {
  id: ID;
  name: string;
  currency: string; // e.g., USD, EUR
}

export interface Location {
  id: ID;
  tenant_id: ID;
  name: string;
  address: string;
}

export type UserRole = "owner" | "manager" | "chef";

export interface User {
  id: ID;
  tenant_id: ID;
  location_id?: ID;
  role: UserRole;
  name: string;
  email: string;
}

export type ProductType = "raw" | "sub_product" | "menu_item";

export interface Product {
  id: ID;
  tenant_id: ID;
  name: string;
  type: ProductType;
  unit: string; // e.g., kg, g, L, pcs
  price: number; // default price per unit
  category?: string;
  photo_url?: string;
}

export interface ProductBOM {
  parent_product_id: ID; // e.g., menu item or sub-product
  child_product_id: ID; // raw or sub-product
  qty: number;
  unit: string;
}

export interface Inventory {
  location_id: ID;
  product_id: ID;
  available_qty: number;
  reorder_point: number;
  critical_point: number;
  last_updated: string; // ISO date
}

export type InventoryTxType =
  | "purchase"
  | "usage"
  | "wastage"
  | "transfer_in"
  | "transfer_out"
  | "adjustment";

export interface InventoryTransaction {
  id: ID;
  location_id: ID;
  product_id: ID;
  tx_type: InventoryTxType;
  qty: number; // positive for in, negative for out if needed
  unit: string;
  reason?: string;
  created_by: ID; // user id
  created_at: string; // ISO date
}

export interface OrderLine {
  order_id: ID;
  menu_item_id: ID; // references Product with type menu_item
  qty: number;
  price: number; // unit price
}

export interface Order {
  id: ID;
  tenant_id: ID;
  location_id: ID;
  created_at: string;
  lines: OrderLine[];
}

export interface ForecastBounds {
  lower: number;
  upper: number;
}

export interface Forecast {
  product_id: ID;
  date: string; // ISO date day-granularity
  forecast_qty: number;
  bounds?: ForecastBounds;
}

export type AnomalySeverity = "low" | "medium" | "high";
export type AnomalyStatus = "open" | "acknowledged" | "resolved";

export interface Anomaly {
  product_id: ID;
  date_detected: string;
  severity: AnomalySeverity;
  status: AnomalyStatus;
  note?: string;
}

export type WastageReason = "spoilage" | "theft" | "expired" | "prep_error";

export interface Wastage {
  id: ID;
  product_id: ID;
  location_id: ID;
  reason: WastageReason;
  qty: number;
  unit: string;
  cost_loss: number;
  recorded_at: string;
}

export interface CookbookItem {
  product_id: ID; // menu item or sub-product
  recipe_steps: string[];
  yield_factor: number; // output per batch vs inputs
}

export type RecommendationType =
  | "menu_upsell"
  | "stock_rebalance"
  | "price_update"
  | "wastage_reduction";

export interface MenuRecommendation {
  id: ID;
  product_id?: ID;
  recommendation_type: RecommendationType;
  reason: string;
  created_at: string;
}

export interface SalesAnalyticsPoint {
  date: string;
  revenue: number;
  sales_qty: number;
  forecast_qty?: number;
  usage_variance?: number;
}

export interface RevenueSummary {
  timeframe: "daily" | "weekly" | "monthly";
  revenue: number;
  profit_margin: number; // 0-1
  cash_inflow: number;
  cash_outflow: number;
}

export interface ApiResponse<T> {
  data: T;
  error?: string;
}


