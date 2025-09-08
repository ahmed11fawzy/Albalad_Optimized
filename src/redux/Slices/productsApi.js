import { coreApi } from "./coreApi";

export const productsApi = coreApi.injectEndpoints({
  endpoints: (builder) => ({
    getProductDetails: builder.query({
      query: (productId) => ({
        url: `/products/show/${productId}`,
        method: "GET",
      }),
      providesTags: (result, error, productId) => [
        { type: "Product", id: productId },
        "Product",
      ],
    }),
    getProductsByCategory: builder.query({
      query: (categoryId) => ({
        url: `/categories/show/${categoryId}`,
        method: "GET",
      }),
      providesTags: (result, error, categoryId) => [
        { type: "Categories", id: categoryId },
        "Product",
      ],
    }),
    getAllProducts: builder.query({
      query: (pageNumber) => ({
        url: `?page=${pageNumber}`,
        method: "GET",
      }),
      providesTags: ["Product"],
    }),
    getAllYourLikesProducts: builder.query({
      query: () => ({
        url: ``,
        method: "GET",
      }),
    }),
    addToCart: builder.mutation({
      query: (cartData) => ({
        url: `/carts/add-item`,
        method: "POST",
        body: cartData,
      }),
      invalidatesTags: ["Cart"],
    }),
    getForYouProducts: builder.query({
      query: () => ({
        url: `/promotions/products-for`,
        method: "GET",
      }),
      providesTags: ["Product"],
    }),
  }),
});

export const {
  useGetProductDetailsQuery,
  useGetProductsByCategoryQuery,
  useGetAllProductsQuery,
  useGetAllYourLikesProductsQuery,
  useGetForYouProductsQuery,
  useAddToCartMutation,
} = productsApi;
