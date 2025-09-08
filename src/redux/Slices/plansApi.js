import { coreApi } from "./coreApi";

export const plansApi = coreApi.injectEndpoints({
  endpoints: (builder) => ({
    getPlans: builder.query({
      query: () => ({
        url: "/plans",
        method: "GET",
      }),
    }),
  }),
});

export const { useGetPlansQuery } = plansApi;
