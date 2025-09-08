import { coreApi } from "./coreApi";

export const offersApi = coreApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllPackageOffers: builder.query({
      query: () => ({
        url: `/promotions/bundles`,
        method: "GET",
      }),
      providesTags: ["Offers"],
    }),
    getAllSuperOffers: builder.query({
      query: () => ({
        url: `/promotions/super`,
        method: "GET",
      }),
      providesTags: ["Offers"],
    }),
    getAllXYOffers: builder.query({
      query: () => ({
        url: `/promotions/buy_x_get_y_offers`,
        method: "GET",
      }),
      providesTags: ["Offers"],
    }),
    getTopSellingOffers: builder.query({
      query: () => ({
        url: `/products/top-selling`,
        method: "GET",
      }),
      providesTags: ["Offers"],
    }),
  }),
});

export const {
  useGetAllPackageOffersQuery,
  useGetAllSuperOffersQuery,
  useGetAllXYOffersQuery,
  useGetTopSellingOffersQuery,
} = offersApi;
