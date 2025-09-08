import { coreApi } from "./coreApi";

export const locationsApi = coreApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllCountries: builder.query({
            query: () => ({
                url: "/customer/locations/countries",
                method: "GET",
            }),
        }),
        getAllRegions: builder.query({
            query: (countryId) => ({
                url: `/customer/locations/children/${countryId}`,
                method: "GET",
            }),
        }),
        getAllCities: builder.query({
            query: (regionId) => ({
                url: `/customer/locations/children/${regionId}`,
                method: "GET",
            }),
        }),
        getAllLocations: builder.query({
            query: () => ({
                url: "/stores/create",
                method: "GET",
            }),
        }),
    }),
});

export const {
    useGetAllCountriesQuery,
    useGetAllRegionsQuery,
    useGetAllCitiesQuery,
    useGetAllLocationsQuery,
} = locationsApi;