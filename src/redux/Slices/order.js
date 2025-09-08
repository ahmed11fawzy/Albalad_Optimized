import { coreApi } from "./coreApi";

export const orderApi = coreApi.injectEndpoints({
  endpoints: (builder) => ({
    getOrders: builder.query({
      query: () => ({
        url: "/orders",
        method: "GET",
      }),
    }),
    getAllUserRefunds: builder.query({
      query: () => ({
        url: `/customer/refunds`,
        method: "GET",
      }),
    }),
    createOrderRefund: builder.mutation({
      query: (refundReason) => ({
        url: `/customer/refunds/store`,
        method: "POST",
        body: refundReason,
      }),
    }),
    createOrder: builder.mutation({
      query: (refundReason) => ({
        url: `/customer/orders/store`,
        method: "POST",
      }),
    }),
    getOrderRefunds: builder.query({
      query: (orderId) => ({
        url: `/customer/refunds/create/${orderId}`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useGetOrderRefundsQuery,
  useCreateOrderRefundMutation,
  useGetAllUserRefundsQuery,
  useGetOrdersQuery,
  useCreateOrderMutation,
} = orderApi;
