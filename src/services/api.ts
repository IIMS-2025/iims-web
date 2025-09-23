import axios from "axios";
import type {
  ApiResponse,
  Inventory,
  Order,
  Forecast,
  Product,
  InventoryTransaction,
  RestockItem,
  RestockList,
  RestockFilter,
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
    { location_id: "loc1", id: "Fresh Tomatoes", available_qty: 150, reorder_point: 50, critical_point: 20, last_updated: new Date().toISOString(), price_per_unit: 2.50, unit: "kg", category: "Vegetables", forecast_days: 12 },
    { location_id: "loc1", id: "Mozzarella Cheese", available_qty: 25, reorder_point: 30, critical_point: 15, last_updated: new Date().toISOString(), price_per_unit: 10.20, unit: "kg", category: "Dairy", forecast_days: 6 },
    { location_id: "loc1", id: "Olive Oil", available_qty: 5, reorder_point: 15, critical_point: 8, last_updated: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), price_per_unit: 15.00, unit: "liter", category: "Oils & Spices", forecast_days: 4 },
    { location_id: "loc1", id: "Chicken Breast", available_qty: 45, reorder_point: 30, critical_point: 15, last_updated: new Date().toISOString(), price_per_unit: 8.75, unit: "kg", category: "Meat", forecast_days: 18 },
    { location_id: "loc1", id: "Basil Leaves", available_qty: 200, reorder_point: 300, critical_point: 150, last_updated: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), price_per_unit: 12.00, unit: "100g", category: "Herbs", forecast_days: 7 },
  ] as any[],
  orders: [
    {
      id: "o1",
      tenant_id: "t1",
      location_id: "loc1",
      created_at: new Date().toISOString(),
      lines: [{ order_id: "o1", menu_item_id: "p3", qty: 2, price: 12 }],
    },
  ] as Order[],
  forecasts: [
    { id: "p1", date: new Date(Date.now() + 86400000 * 1).toISOString(), forecast_qty: 12 },
    { id: "p2", date: new Date(Date.now() + 86400000 * 1).toISOString(), forecast_qty: 6 },
  ] as Forecast[],
  ledger: [] as InventoryTransaction[],
  restockItems: [
    {
      id: "r1",
      id: "Fresh Tomatoes",
      product_name: "Fresh Tomatoes",
      category: "Vegetables",
      current_stock: 150,
      forecasted_requirement: 80,
      required_quantity: 80,
      unit: "kg",
      price_per_unit: 2.50,
      estimated_cost: 200.00,
      priority: "medium",
      status: "pending",
      forecast_period_days: 7,
      supplier: "Green Valley Farms",
      last_updated: new Date().toISOString(),
      created_at: new Date().toISOString(),
    },
    {
      id: "r2",
      id: "Mozzarella Cheese",
      product_name: "Mozzarella Cheese",
      category: "Dairy",
      current_stock: 25,
      forecasted_requirement: 45,
      required_quantity: 45,
      unit: "kg",
      price_per_unit: 10.20,
      estimated_cost: 459.00,
      priority: "high",
      status: "pending",
      forecast_period_days: 7,
      supplier: "Dairy Fresh Co.",
      last_updated: new Date().toISOString(),
      created_at: new Date().toISOString(),
    },
    {
      id: "r3",
      id: "Olive Oil",
      product_name: "Olive Oil",
      category: "Oils & Spices",
      current_stock: 5,
      forecasted_requirement: 20,
      required_quantity: 20,
      unit: "L",
      price_per_unit: 15.00,
      estimated_cost: 300.00,
      priority: "critical",
      status: "pending",
      forecast_period_days: 7,
      supplier: "Mediterranean Oils Ltd.",
      last_updated: new Date().toISOString(),
      created_at: new Date().toISOString(),
    },
    {
      id: "r4",
      id: "Chicken Breast",
      product_name: "Chicken Breast",
      category: "Meat",
      current_stock: 45,
      forecasted_requirement: 30,
      required_quantity: 30,
      unit: "kg",
      price_per_unit: 8.75,
      estimated_cost: 262.50,
      priority: "low",
      status: "pending",
      forecast_period_days: 7,
      supplier: "Premium Poultry",
      last_updated: new Date().toISOString(),
      created_at: new Date().toISOString(),
    },
    {
      id: "r5",
      id: "Basil Leaves",
      product_name: "Basil Leaves",
      category: "Herbs",
      current_stock: 200,
      forecasted_requirement: 500,
      required_quantity: 500,
      unit: "g",
      price_per_unit: 25.00,
      estimated_cost: 75.00,
      priority: "medium",
      status: "pending",
      forecast_period_days: 7,
      supplier: "Herb Garden Co.",
      last_updated: new Date().toISOString(),
      created_at: new Date().toISOString(),
    },
    {
      id: "r6",
      id: "pasta-dough",
      product_name: "Pizza Dough",
      category: "Bakery",
      current_stock: 8,
      forecasted_requirement: 150,
      required_quantity: 150,
      unit: "units",
      price_per_unit: 1.00,
      estimated_cost: 150.00,
      priority: "high",
      status: "pending",
      forecast_period_days: 7,
      supplier: "Bakery Supplies Inc.",
      last_updated: new Date().toISOString(),
      created_at: new Date().toISOString(),
    },
  ] as RestockItem[],
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
    const inv = mock.inventory.find(i => i.location_id === tx.location_id && i.id === tx.id);
    const signedQty = ["purchase", "transfer_in", "adjustment"].includes(tx.tx_type) ? tx.qty : -tx.qty;
    if (inv) {
      inv.available_qty += signedQty;
      inv.last_updated = new Date().toISOString();
    }
    return { data: tx };
  }
  const { data } = await api.post<ApiResponse<InventoryTransaction>>("/inventory/tx", tx);
  return data;
}

// Restock API functions
export async function getRestockItems(filter?: RestockFilter): Promise<ApiResponse<RestockItem[]>> {
  if (useMock) {
    await delay(200);
    let items = [...mock.restockItems];

    if (filter) {
      if (filter.category && filter.category !== "all") {
        items = items.filter(item => item.category.toLowerCase() === filter.category?.toLowerCase());
      }
      if (filter.priority && filter.priority !== "all") {
        items = items.filter(item => item.priority === filter.priority);
      }
      if (filter.status && filter.status !== "all") {
        items = items.filter(item => item.status === filter.status);
      }
      if (filter.search) {
        const search = filter.search.toLowerCase();
        items = items.filter(item =>
          item.product_name.toLowerCase().includes(search) ||
          item.category.toLowerCase().includes(search) ||
          item.supplier?.toLowerCase().includes(search)
        );
      }
    }

    return { data: items };
  }
  const { data } = await api.get<ApiResponse<RestockItem[]>>("/restock/items", { params: filter });
  return data;
}

export async function updateRestockItem(id: string, updates: Partial<RestockItem>): Promise<ApiResponse<RestockItem>> {
  if (useMock) {
    await delay(150);
    const itemIndex = mock.restockItems.findIndex(item => item.id === id);
    if (itemIndex !== -1) {
      mock.restockItems[itemIndex] = {
        ...mock.restockItems[itemIndex],
        ...updates,
        last_updated: new Date().toISOString()
      };
      return { data: mock.restockItems[itemIndex] };
    }
    return { data: null as any, error: "Item not found" };
  }
  const { data } = await api.patch<ApiResponse<RestockItem>>(`/restock/items/${id}`, updates);
  return data;
}

export async function bulkUpdateRestockItems(updates: Array<{ id: string; updates: Partial<RestockItem> }>): Promise<ApiResponse<RestockItem[]>> {
  if (useMock) {
    await delay(200);
    const updatedItems: RestockItem[] = [];

    for (const { id, updates: itemUpdates } of updates) {
      const itemIndex = mock.restockItems.findIndex(item => item.id === id);
      if (itemIndex !== -1) {
        mock.restockItems[itemIndex] = {
          ...mock.restockItems[itemIndex],
          ...itemUpdates,
          last_updated: new Date().toISOString()
        };
        updatedItems.push(mock.restockItems[itemIndex]);
      }
    }

    return { data: updatedItems };
  }
  const { data } = await api.patch<ApiResponse<RestockItem[]>>("/restock/items/bulk", { updates });
  return data;
}

export async function deleteRestockItem(id: string): Promise<ApiResponse<boolean>> {
  if (useMock) {
    await delay(150);
    const itemIndex = mock.restockItems.findIndex(item => item.id === id);
    if (itemIndex !== -1) {
      mock.restockItems.splice(itemIndex, 1);
      return { data: true };
    }
    return { data: false, error: "Item not found" };
  }
  const { data } = await api.delete<ApiResponse<boolean>>(`/restock/items/${id}`);
  return data;
}

export async function createRestockList(items: RestockItem[], name: string): Promise<ApiResponse<RestockList>> {
  if (useMock) {
    await delay(200);
    const newList: RestockList = {
      id: `list-${Date.now()}`,
      name,
      location_id: "loc1",
      created_by: "user1",
      items,
      total_cost: items.reduce((sum, item) => sum + item.estimated_cost, 0),
      status: "pending",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    return { data: newList };
  }
  const { data } = await api.post<ApiResponse<RestockList>>("/restock/lists", { items, name });
  return data;
}


