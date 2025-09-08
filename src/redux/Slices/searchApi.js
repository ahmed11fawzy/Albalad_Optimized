import { coreApi } from "./coreApi";

export const searchApi = coreApi.injectEndpoints({
  endpoints: (builder) => ({
    getSearchResults: builder.query({
      query: (searchQuery) => ({
        url: `/search/${searchQuery}`,
        method: "GET",
      }),
    }),
    getSearchHistory: builder.query({
      query: () => ({
        url: `/customer/search-histories`,
        method: "GET",
      }),
    }),
    searchByImage: builder.mutation({
      query: (formData) => ({
        url: `/search`,
        method: "POST",
        body: formData,
      }),
    }),
  }),
});

export const {
  useGetSearchResultsQuery,
  useGetSearchHistoryQuery,
  useSearchByImageMutation,
} = searchApi;
