import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import appConfig from "../config/appConfig";

// Types for Inventory Insights

/**
 * Sales data point representing daily sales information
 * Example response: { "data": [{ "date": "2025-09-18", "total_sales": 3002 }] }
 */
export interface SalesDataPoint {
    date: string;
    total_sales: number;
}

export interface SalesResponse {
    data: SalesDataPoint[];
}

export interface WastageDataPoint {
    date: string;
    total_units: number;
    change_percentage: number;
    breakdown: {
        kg: { value: number; unit: string };
        liters: { value: number; unit: string };
        count: { value: number; unit: string };
    };
    reasons: Array<{
        reason: string;
        percentage: number;
    }>;
}

export interface WastageResponse {
    data: WastageDataPoint[];
}

export interface PurchaseCostData {
    totalCost: number;
    period: string;
    changePercentage: number;
    costBreakdown: Array<{
        category: string;
        cost: number;
        percentage: number;
    }>;
}

export interface TopCostlyItem {
    name: string;
    cost: number;
    unit: string;
    category: string;
    lastPurchaseDate: string;
}

export interface WastageRecord {
    id: string;
    inventory_id: string;
    qty: number;
    unit: string;
    cost_loss: number;
    timestamp: string;
    recorded_by: string;
}

export interface WastageByReason {
    count: number;
    cost_loss: number;
    qty: number;
    records: WastageRecord[];
}

export interface WastageDetail {
    id: string;
    product_name: string;
    product_id: string;
    qty: number;
    unit: string;
    reason: string;
    cost_loss: number;
    timestamp: string;
    recorded_by: string;
}

export interface WastageData {
    date: string;
    total_cost_loss: number;
    total_qty: number;
    total_records: number;
    by_reason: Record<string, WastageByReason>;
    wastage_details: WastageDetail[];
}

export interface StockConsumptionPoint {
    period: string;
    actualConsumption: number;
    forecastConsumption?: number;
}

export interface StockAvailabilityData {
    categories: Array<{
        status: 'good' | 'low' | 'critical' | 'out_of_stock';
        percentage: number;
        count: number;
    }>;
}

export interface CostPerItemHistory {
    itemName: string;
    purchases: Array<{
        purchaseDate: string;
        cost: number;
        quantity: number;
        supplier?: string;
    }>;
}

export interface AIInventoryForecast {
    forecastPeriod: string;
    ingredients: Array<{
        name: string;
        currentStock: number;
        predictedConsumption: Array<{
            date: string;
            quantity: number;
        }>;
        recommendedReorder: {
            quantity: number;
            date: string;
        };
    }>;
}

export interface SalesCostHistoricalData {
    date: string;
    total_sales: string;
    total_cost: string;
    profit: string;
    profit_margin: string;
    order_count: number;
    dish_count: number;
}

export interface SalesCostApiResponse {
    data: Array<{
        total_sales: string;
        total_cost: string;
        total_profit: string;
        profit_margin: string;
        date_range: string;
        days_count: number;
        historical_data: SalesCostHistoricalData[];
    }>;
}

export interface SalesCostDataGraph {
    data: Array<{
        date: string;
        sales: number;
        cost: number;
    }>;
}

export interface CategoryProduct {
    product_id: string;
    product_name: string;
    quantity_sold: string;
    revenue: string;
    unit_price: string;
}

export interface CategoryData {
    category: string;
    total_revenue: string;
    total_quantity: string;
    unique_products: number;
    percentage_of_total: string;
    products: CategoryProduct[];
}

export interface DailyBreakdown {
    date: string;
    location_id: string;
    total_categories: number;
    total_revenue: string;
    categories: CategoryData[];
}

export interface SalesByCategoryResponse {
    data: Array<{
        start_date: string;
        end_date: string;
        location_id: string;
        total_period_revenue: string;
        daily_breakdowns: DailyBreakdown[];
    }>;
}

// ===== UTILITY FUNCTIONS =====
/**
 * Generate date range with configurable days back from today
 */
const createDateRange = (daysBack: number = 7) => {
    const today = new Date();
    const end = today.toISOString().split('T')[0];
    const start = new Date(today.setDate(today.getDate() - daysBack)).toISOString().split('T')[0];
    return { start, end };
};

/**
 * Create date range query with custom start/end date support
 */
const buildDateRangeQuery = (
    baseUrl: string,
    params: { startDate?: string, endDate?: string },
    defaultDaysBack: number = 7
) => {
    const { startDate, endDate } = params;
    const { start, end } = createDateRange(defaultDaysBack);
    const finalStart = startDate || start;
    const finalEnd = endDate || end;
    return `${baseUrl}?start_date=${finalStart}&end_date=${finalEnd}`;
};

/**
 * Format date to YYYY-MM-DD
 */
const formatDateForAPI = (date: Date): string => {
    return date.getFullYear() + '-' +
        String(date.getMonth() + 1).padStart(2, '0') + '-' +
        String(date.getDate()).padStart(2, '0');
};

/**
 * Transform sales-cost API response to chart format
 */
const transformSalesCostResponse = (response: SalesCostApiResponse): SalesCostDataGraph => {
    const historicalData = response.data[0]?.historical_data || [];
    return {
        data: historicalData.map(item => ({
            date: item.date,
            sales: parseFloat(item.total_sales),
            cost: parseFloat(item.total_cost)
        }))
    };
};

// Inventory Insights API
export const inventoryInsightsApi = createApi({
    reducerPath: "inventoryInsightsApi",
    baseQuery: fetchBaseQuery({
        baseUrl: appConfig.api.baseUrl,
        prepareHeaders: (headers) => {
            headers.set(appConfig.api.tenantHeader, appConfig.api.tenantId);
            headers.set(appConfig.api.locationHeader, appConfig.api.locationId);
            return headers;
        },
    }),
    tagTypes: ["InventoryInsights", "PurchaseCost", "Wastage", "StockConsumption", "AIForecast", "Sales"],
    endpoints: (builder) => ({
        // GET /api/v1/sales/${today} - Sales data endpoint
        getSalesData: builder.query<SalesDataPoint[], { today?: string }>({
            query: ({ today = new Date().toISOString().split('T')[0] }) => `/api/v1/sales/${today}`,
            transformResponse: (response: SalesResponse) => response.data,
            providesTags: ['PurchaseCost'],
        }),

        // GET /api/v1/wastage-analytics/by-date/${today} - Wastage analytics endpoint
        getWastageData: builder.query<WastageData, { today?: string }>({
            query: ({ today = new Date().toISOString().split('T')[0] }) => `/api/v1/wastage-analytics/by-date/${today}`,
            transformResponse: (response: WastageData) => response,
            providesTags: ['Wastage'],
        }),

        // GET /api/v1/sales/total-sales?start_date=2025-09-18&end_date=2025-09-23 - Sales data endpoint
        getsalesByRange: builder.query<SalesDataPoint[], { startDate?: string, endDate?: string }>({
            query: (params) => buildDateRangeQuery('/api/v1/sales/total-sales', params, 7),
            transformResponse: (response: SalesResponse) => response.data,
            providesTags: ['Sales'],
        }),

        // GET /api/v1/sales-analytics/top-categories-range - Sales by category endpoint
        getSalesByCategory: builder.query<SalesByCategoryResponse, { startDate?: string, endDate?: string }>({
            query: ({ startDate, endDate }) => {
                const today = new Date();
                const endDateFormatted = endDate ? formatDateForAPI(new Date(endDate)) : formatDateForAPI(today);
                const startDateFormatted = startDate ? formatDateForAPI(new Date(startDate)) : formatDateForAPI(today);
                return `/api/v1/sales-analytics/top-categories-range?start_date=${startDateFormatted}&end_date=${endDateFormatted}&limit=5`;
            },
            transformResponse: (response: any) => response,
            providesTags: ['Sales'],
        }),

        // GET /api/v1/analytics/graphs/sales-cost?start_date=2025-09-15&end_date=2025-09-25
        getSalesCostDataGraph: builder.query<SalesCostDataGraph, { startDate?: string, endDate?: string }>({
            query: (params) => buildDateRangeQuery('/api/v1/analytics/graphs/sales-cost', params, 7),
            transformResponse: transformSalesCostResponse,
            providesTags: ['Sales'],
        }),

        // GET /api/v1/analytics/graphs/sales-cost with extended date range for anomaly detection
        getSalesCostDataAnomalyGraph: builder.query<SalesCostDataGraph, { startDate?: string, endDate?: string }>({
            query: (params) => buildDateRangeQuery('/api/v1/analytics/graphs/sales-cost', params, 10),
            transformResponse: transformSalesCostResponse,
            providesTags: ['Sales'],
        }),

    }),
});

export const {
    useGetSalesDataQuery,
    useGetWastageDataQuery,
    useGetsalesByRangeQuery,
    useGetSalesCostDataGraphQuery,
    useGetSalesByCategoryQuery,
    useGetSalesCostDataAnomalyGraphQuery,
} = inventoryInsightsApi;
