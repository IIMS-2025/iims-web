import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import appConfig from "../config/appConfig";

// Types for Inventory Insights
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

export interface WastageData {
    totalUnits: number;
    changePercentage: number;
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

// Inventory Insights API
export const inventoryInsightsApi = createApi({
    reducerPath: "inventoryInsightsApi",
    baseQuery: fetchBaseQuery({
        baseUrl: appConfig.api.baseUrl,
        prepareHeaders: (headers) => {
            headers.set(appConfig.api.tenantHeader, appConfig.api.tenantId);
            return headers;
        },
    }),
    tagTypes: ["InventoryInsights", "PurchaseCost", "Wastage", "StockConsumption", "AIForecast"],
    endpoints: (builder) => ({
        // GET /api/v1/inventory/insights/purchase-cost
        getPurchaseCost: builder.query<PurchaseCostData, { period?: string }>({
            query: ({ period = '7-week' }) => `/api/v1/inventory/insights/purchase-cost?period=${period}`,
            transformResponse: (response: { data: PurchaseCostData }) => response.data,
            providesTags: ['PurchaseCost'],
        }),

        // GET /api/v1/inventory/insights/top-costly-item
        getTopCostlyItem: builder.query<TopCostlyItem, void>({
            query: () => "/api/v1/inventory/insights/top-costly-item",
            transformResponse: (response: { data: TopCostlyItem }) => response.data,
            providesTags: ['InventoryInsights'],
        }),

        // GET /api/v1/inventory/insights/wastage
        getWastageData: builder.query<WastageData, { period?: string }>({
            query: ({ period = '1-week' }) => `/api/v1/inventory/insights/wastage?period=${period}`,
            transformResponse: (response: { data: WastageData }) => response.data,
            providesTags: ['Wastage'],
        }),

        // GET /api/v1/inventory/insights/stock-consumption
        getStockConsumption: builder.query<StockConsumptionPoint[], { period?: string }>({
            query: ({ period = '7-week' }) => `/api/v1/inventory/insights/stock-consumption?period=${period}`,
            transformResponse: (response: { data: StockConsumptionPoint[] }) => response.data,
            providesTags: ['StockConsumption'],
        }),

        // GET /api/v1/inventory/insights/stock-availability
        getStockAvailability: builder.query<StockAvailabilityData, void>({
            query: () => "/api/v1/inventory/insights/stock-availability",
            transformResponse: (response: { data: StockAvailabilityData }) => response.data,
            providesTags: ['InventoryInsights'],
        }),

        // GET /api/v1/inventory/insights/cost-history
        getCostPerItemHistory: builder.query<CostPerItemHistory[], { items?: string[]; limit?: number }>({
            query: ({ items = [], limit = 10 }) => {
                const params = new URLSearchParams();
                if (items.length > 0) {
                    items.forEach(item => params.append('items', item));
                }
                params.append('limit', limit.toString());
                return `/api/v1/inventory/insights/cost-history?${params.toString()}`;
            },
            transformResponse: (response: { data: CostPerItemHistory[] }) => response.data,
            providesTags: ['InventoryInsights'],
        }),

        // GET /api/v1/inventory/insights/ai-forecast
        getAIInventoryForecast: builder.query<AIInventoryForecast, { days?: number }>({
            query: ({ days = 7 }) => `/api/v1/inventory/insights/ai-forecast?days=${days}`,
            transformResponse: (response: { data: AIInventoryForecast }) => response.data,
            providesTags: ['AIForecast'],
        }),

        // POST /api/v1/inventory/insights/refresh-forecast
        refreshAIForecast: builder.mutation<{ success: boolean }, void>({
            query: () => ({
                url: "/api/v1/inventory/insights/refresh-forecast",
                method: "POST",
            }),
            invalidatesTags: ['AIForecast'],
        }),
    }),
});

export const {
    useGetPurchaseCostQuery,
    useGetTopCostlyItemQuery,
    useGetWastageDataQuery,
    useGetStockConsumptionQuery,
    useGetStockAvailabilityQuery,
    useGetCostPerItemHistoryQuery,
    useGetAIInventoryForecastQuery,
    useRefreshAIForecastMutation,
} = inventoryInsightsApi;
