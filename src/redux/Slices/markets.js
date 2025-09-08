import { coreApi } from "./coreApi";

export const marketsApi = coreApi.injectEndpoints({
  endpoints: (builder) => ({
    getMarkets: builder.query({
      query: () => ({
        url: "/markets",
        method: "GET",
      }),
    }),
    getMarket: builder.query({
      query: (id) => ({
        url: `markets/show/${id}`,
        method: "GET",
      }),
    }),
    getStores: builder.query({
      query: () => ({
        url: "/stores",
        method: "GET",
      }),
    }),
    getStoreById: builder.query({
      query: (id) => ({
        url: `/stores/${id}`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useGetMarketsQuery,
  useGetMarketQuery,
  useGetStoresQuery,
  useGetStoreByIdQuery,
} = marketsApi;
