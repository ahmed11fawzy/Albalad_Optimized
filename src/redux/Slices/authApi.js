import { coreApi } from "./coreApi";

export const authApi = coreApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: "/login",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["User"],
    }),
    register: builder.mutation({
      query: (userData) => ({
        url: "/register",
        method: "POST",
        body: userData,
      }),
      invalidatesTags: ["User"],
    }),
    registerSeller: builder.mutation({
      query: (sellerData) => ({
        url: "seller-register-with-document",
        method: "POST",
        body: sellerData,
      }),
      invalidatesTags: ["User"],
    }),
    getCurrentUser: builder.query({
      query: (token) => ({
        url: "/profile",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      providesTags: ["User"],
      transformResponse: (response) => response.data,
    }),
    logout: builder.mutation({
      query: () => ({
        url: "/logout",
        method: "POST",
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useRegisterSellerMutation,
  useGetCurrentUserQuery,
  useLogoutMutation,
} = authApi;
