import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { CookbookItem } from "../types";
import appConfig from "../config/appConfig";

export const cookbookApi = createApi({
  reducerPath: "cookbookApi",
  baseQuery: fetchBaseQuery({
    baseUrl: appConfig.api.baseUrl,
    prepareHeaders: (headers) => {
      headers.set(appConfig.api.tenantHeader, appConfig.api.tenantId);
      return headers;
    },
  }),
  tagTypes: ["Cookbook"],
  endpoints: (builder) => ({
    getCookbook: builder.query<CookbookItem[], void>({
      query: () => "/api/v1/cookbook/",
      transformResponse: (response: { data: any[] }) =>
        (response?.data ?? []) as CookbookItem[],
      providesTags: (result) =>
        result
          ? [
              ...result.map((item: any) => ({ type: "Cookbook" as const, id: item.id })),
              { type: "Cookbook" as const, id: "LIST" },
            ]
          : [{ type: "Cookbook" as const, id: "LIST" }],
    }),
    getCookbookItem: builder.query<CookbookItem, string>({
      query: (productId) => `/api/v1/cookbook/${productId}`,
      transformResponse: (response: { data: any[] }) => (response?.data?.[0] ?? null) as CookbookItem,
      providesTags: (result, error, id) => [{ type: "Cookbook", id }],
    }),
    updateCookbookItem: builder.mutation<CookbookItem, CookbookItem>({
      query: (cookbookItem) => ({
        url: `/api/v1/cookbook/${cookbookItem?.product_id}`,
        method: "PUT",
        body: cookbookItem,
      }),
    }),
  }),
});

export const { useGetCookbookQuery, useLazyGetCookbookQuery, useGetCookbookItemQuery, useUpdateCookbookItemMutation } = cookbookApi;


