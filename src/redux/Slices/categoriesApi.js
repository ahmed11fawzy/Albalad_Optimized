import { coreApi } from "./coreApi";

export const categoriesApi = coreApi.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query({
      query: (id) => ({
        url: `/categories?page=${id}`,
        method: "GET",
      }),
      providesTags: ["Categories"],
    }),
  }),
});

export const { useGetCategoriesQuery } = categoriesApi;
