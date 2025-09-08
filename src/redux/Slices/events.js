import { coreApi } from "./coreApi";

export const eventApi = coreApi.injectEndpoints({
  endpoints: (builder) => ({
    getEvents: builder.query({
      query: () => ({
        url: "/events",
        method: "GET",
      }),
      providesTags: ["Events"],
    }),
    getEvent: builder.query({
      query: (id) => ({
        url: `/events/show/${id}`,
        method: "GET",
      }),
      providesTags: ["Events"],
    }),
    getEventCategories: builder.query({
      query: () => ({
        url: "/place-categories",
        method: "GET",
      }),
      providesTags: ["Events"],
    }),
    getEventCategory: builder.query({
      query: (id) => ({
        url: `/place-categories/show/${id}`,
        method: "GET",
      }),
      providesTags: ["Events"],
    }),
    getAllHistoricalPlaces: builder.query({
      query: () => ({
        url: "/historical-places",
        method: "GET",
      }),
      providesTags: ["Events"],
    }),
  }),
});
export const {
  useGetEventsQuery,
  useGetEventQuery,
  useGetEventCategoryQuery,
  useGetEventCategoriesQuery,
  useGetAllHistoricalPlacesQuery,
} = eventApi;
