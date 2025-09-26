import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { OrderSyncResponse, OrdersResponse } from "../types";
import appConfig from "../config/appConfig";

// Orders API following the same pattern as inventoryApi
export const ordersApi = createApi({
  reducerPath: "ordersApi",
  baseQuery: fetchBaseQuery({
    baseUrl: appConfig.api.baseUrl,
    prepareHeaders: (headers) => {
      headers.set(appConfig.api.tenantHeader, appConfig.api.tenantId);
      headers.set('X-Location-ID', '22222222-2222-2222-2222-222222222222');
      return headers;
    },
  }),
  tagTypes: ["Orders", "Inventory"],
  endpoints: (builder) => ({
    // GET /api/v1/orders
    getOrders: builder.query<
      OrdersResponse,
      { start_date?: string; end_date?: string } | void
    >({
      query: (params) => ({
        url: "/api/v1/orders",
        params: params || {},
      }),
      transformResponse: (response: OrdersResponse) => {
        return response;
      },
      providesTags: ["Orders", "Inventory"],
    }),

    // POST /api/v1/orders/sync
        syncOrders: builder.mutation<OrderSyncResponse, void>({
      query: () => ({
        url: "/api/v1/orders/sync",
        method: "POST",
      }),
      transformResponse: (response: OrderSyncResponse) => {
        return response;
      },
      invalidatesTags: ["Orders", "Inventory"],
    }),
  }),
});

export const {
  useGetOrdersQuery,
  useSyncOrdersMutation,
} = ordersApi;
