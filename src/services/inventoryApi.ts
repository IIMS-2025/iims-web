import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Inventory } from "../types";
import appConfig from "../config/appConfig";

// Inventory API leveraging the same base configuration as cookbookApi
export const inventoryApi = createApi({
  reducerPath: "inventoryApi",
  baseQuery: fetchBaseQuery({
    baseUrl: appConfig.api.baseUrl,
    prepareHeaders: (headers) => {
      headers.set(appConfig.api.tenantHeader, appConfig.api.tenantId);
      return headers;
    },
  }),
  tagTypes: ["Inventory"],
  endpoints: (builder) => ({
    // GET /api/v1/inventory
    getInventory: builder.query<Inventory[], void>({
      query: () => "/api/v1/inventory",
      transformResponse: (response: { data: any[] }) => (response?.data ?? []) as Inventory[],
      providesTags: (result) =>
        result
          ? [
              ...result.map((item: any) => ({ type: "Inventory" as const, id: item?.id })),
              { type: "Inventory" as const, id: "LIST" },
            ]
          : [{ type: "Inventory" as const, id: "LIST" }],
    }),

    // GET /api/v1/inventory/{id}
    getInventoryItem: builder.query<Inventory | null, string>({
      query: (productId) => `/api/v1/inventory/${productId}`,
      transformResponse: (response: { data: any[] }) => (response?.data?.[0] ?? null) as Inventory | null,
      providesTags: (result, error, id) => [{ type: "Inventory", id }],
    }),

    // POST /api/v1/stock/update-stock (single item payload)
    updateStockSingle: builder.mutation<
      any,
      { id: string; qty: number; unit: string; expiry_date?: string; tx_type: string; reason?: string }
    >({
      query: (body) => ({
        url: "/api/v1/stock/update-stock",
        method: "POST",
        body,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Inventory", id: arg.id },
        { type: "Inventory", id: "LIST" },
      ],
    }),

    // POST /api/v1/stock/update-stock (batch payload)
    updateStockBatch: builder.mutation<
      any,
      {
        batch_id?: string;
        expiry_date?: string;
        tx_type: string;
        items: Array<{ id: string; qty: number; unit: string; reason?: string }>;
      }
    >({
      query: (body) => ({
        url: "/api/v1/stock/update-stock",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Inventory", id: "LIST" }],
    }),
  }),
});

export const {
  useGetInventoryQuery,
  useGetInventoryItemQuery,
  useUpdateStockSingleMutation,
  useUpdateStockBatchMutation,
} = inventoryApi;


