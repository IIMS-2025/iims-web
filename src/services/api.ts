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
    { id: "p1", tenant_id: "t1", name: "Tomatoes", type: "raw", unit: "kg", price: 3, category: "Veg" },
    { id: "p2", tenant_id: "t1", name: "Cheese", type: "raw", unit: "kg", price: 8, category: "Dairy" },
    { id: "p3", tenant_id: "t1", name: "Pizza Margherita", type: "menu_item", unit: "pcs", price: 12, category: "Pizza" },
  ] as Product[],
  inventory: [
    { location_id: "loc1", product_id: "p1", available_qty: 45, reorder_point: 20, critical_point: 10, last_updated: new Date().toISOString() },
    { location_id: "loc1", product_id: "p2", available_qty: 18, reorder_point: 15, critical_point: 7, last_updated: new Date().toISOString() },
  ] as Inventory[],
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


