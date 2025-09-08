import { coreApi } from "./coreApi";

export const paymentApi = coreApi.injectEndpoints({
  endpoints: (builder) => ({
    getShippingMethods: builder.mutation({
      query: (data) => ({
        url: "/carts/add-address",
        method: "POST",
        body: data,
      }),
    }),
    completeOrder: builder.query({
      query: (data) => ({
        url: "/carts/add-address",
        method: "get",
        body: data,
      }),
    }),
    getPayForOrder: builder.query({
      query: (data) => ({
        url: "/customer/orders/pay",
        method: "get",
        body: data,
      }),
    }),
  }),
});

export const {
  useGetShippingMethodsMutation,
  useCompleteOrderQuery,
  useGetPayForOrderQuery,
} = paymentApi;
