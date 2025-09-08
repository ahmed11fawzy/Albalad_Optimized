import { coreApi } from "./coreApi";

export const followersApi = coreApi.injectEndpoints({
  endpoints: (builder) => ({
    getFollowedStores: builder.query({
      query: () => ({
        url: `/followers/following`,
        method: "GET",
      }),
      providesTags: ["FollowedStores"],
    }),
    followStore: builder.mutation({
      query: (storeId) => ({
        url: `/followers/follower/${storeId}`,
        method: "GET",
      }),
      invalidatesTags: ["FollowedStores"],
    }),
    unfollowStore: builder.mutation({
      query: (storeId) => ({
        url: `/followers/follower/${storeId}`,
        method: "GET",
      }),
      invalidatesTags: ["FollowedStores"],
    }),
  }),
});

export const {
  useGetFollowedStoresQuery,
  useFollowStoreMutation,
  useUnfollowStoreMutation,
} = followersApi;
