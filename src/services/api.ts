import axios from "axios";
import type {
  ApiResponse,
  Inventory,
  Order,
  Forecast,
  Product,
  InventoryTransaction,
} from "../types";

// In real deployment, baseURL would be an environment variable
export const api = axios.create({ baseURL: "/api" });

// Mock layer: if no backend, respond from local fixtures
const useMock = true;

// Simple in-memory fixtures
const mock = {
  products: [
    { id: "fresh-tomatoes", tenant_id: "t1", name: "Fresh Tomatoes", type: "raw", unit: "kg", price: 2.50, category: "Vegetables" },
    { id: "mozzarella-cheese", tenant_id: "t1", name: "Mozzarella Cheese", type: "raw", unit: "kg", price: 10.20, category: "Dairy" },
    { id: "olive-oil", tenant_id: "t1", name: "Olive Oil", type: "raw", unit: "liter", price: 15.00, category: "Oils & Spices" },
    { id: "chicken-breast", tenant_id: "t1", name: "Chicken Breast", type: "raw", unit: "kg", price: 8.75, category: "Meat" },
    { id: "basil-leaves", tenant_id: "t1", name: "Basil Leaves", type: "raw", unit: "100g", price: 12.00, category: "Herbs" },
    { id: "tomato-sauce", tenant_id: "t1", name: "Tomato Sauce", type: "sub_product", unit: "L", price: 5, category: "Sauce" },
    { id: "pasta-dough", tenant_id: "t1", name: "Sub Pasta Dough", type: "sub_product", unit: "kg", price: 4, category: "Base" },
    { id: "raw-flour", tenant_id: "t1", name: "Raw Flour", type: "raw", unit: "kg", price: 3, category: "Grains" },
  ] as Product[],
  inventory: [
    { location_id: "loc1", product_id: "Fresh Tomatoes", available_qty: 150, reorder_point: 50, critical_point: 20, last_updated: new Date().toISOString(), price_per_unit: 2.50, unit: "kg", category: "Vegetables", forecast_days: 12 },
    { location_id: "loc1", product_id: "Mozzarella Cheese", available_qty: 25, reorder_point: 30, critical_point: 15, last_updated: new Date().toISOString(), price_per_unit: 10.20, unit: "kg", category: "Dairy", forecast_days: 6 },
    { location_id: "loc1", product_id: "Olive Oil", available_qty: 5, reorder_point: 15, critical_point: 8, last_updated: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), price_per_unit: 15.00, unit: "liter", category: "Oils & Spices", forecast_days: 4 },
    { location_id: "loc1", product_id: "Chicken Breast", available_qty: 45, reorder_point: 30, critical_point: 15, last_updated: new Date().toISOString(), price_per_unit: 8.75, unit: "kg", category: "Meat", forecast_days: 18 },
    { location_id: "loc1", product_id: "Basil Leaves", available_qty: 200, reorder_point: 300, critical_point: 150, last_updated: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), price_per_unit: 12.00, unit: "100g", category: "Herbs", forecast_days: 7 },
  ] as any[],
  orders: [
    {
      id: "o1",
      tenant_id: "t1",
      location_id: "loc1",
      created_at: new Date().toISOString(),
      lines: [ { order_id: "o1", menu_item_id: "p3", qty: 2, price: 12 } ],
    },
  ] as Order[],
  forecasts: [
    { product_id: "p1", date: new Date(Date.now()+86400000*1).toISOString(), forecast_qty: 12 },
    { product_id: "p2", date: new Date(Date.now()+86400000*1).toISOString(), forecast_qty: 6 },
  ] as Forecast[],
  ledger: [] as InventoryTransaction[],
};

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function getInventory(): Promise<ApiResponse<Inventory[]>> {
  if (useMock) {
    await delay(200);
    return { data: mock.inventory };
  }
  const { data } = await api.get<ApiResponse<Inventory[]>>("/inventory");
  return data;
}

export async function getOrders(): Promise<ApiResponse<Order[]>> {
  if (useMock) { await delay(200); return { data: mock.orders }; }
  const { data } = await api.get<ApiResponse<Order[]>>("/orders");
  return data;
}

export async function getForecasts(): Promise<ApiResponse<Forecast[]>> {
  if (useMock) { await delay(200); return { data: mock.forecasts }; }
  const { data } = await api.get<ApiResponse<Forecast[]>>("/forecasts");
  return data;
}

export async function postInventoryTx(tx: InventoryTransaction): Promise<ApiResponse<InventoryTransaction>> {
  if (useMock) {
    await delay(150);
    mock.ledger.push(tx);
    const inv = mock.inventory.find(i => i.location_id === tx.location_id && i.product_id === tx.product_id);
    const signedQty = ["purchase","transfer_in","adjustment"].includes(tx.tx_type) ? tx.qty : -tx.qty;
    if (inv) {
      inv.available_qty += signedQty;
      inv.last_updated = new Date().toISOString();
    }
    return { data: tx };
  }
  const { data } = await api.post<ApiResponse<InventoryTransaction>>("/inventory/tx", tx);
  return data;
}


