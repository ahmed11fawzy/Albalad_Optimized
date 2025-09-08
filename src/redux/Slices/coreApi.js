/* eslint-disable no-undef */
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const API_URL = import.meta.env.VITE_REACT_APP_API_URL;
console.log("🚀 ~ API_URL:", API_URL);

const baseQuery = fetchBaseQuery({
  baseUrl: `${API_URL}`,
  prepareHeaders: (headers, { getState, endpoint }) => {
    // Skip Authorization header for the getSearchResults endpoint
    if (endpoint === "getSearchResults" || endpoint === "searchByImage") {
      headers.set("Content-Type", "application/json");
      headers.set("Accept", "application/json");
      return headers;
    }

    // Get token from Redux state or localStorage
    const token =
      getState()?.globalData?.token || localStorage.getItem("user_token");

    // If we have a token, include it in the Authorization header
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
      headers.set("Content-Type", "application/json");
      headers.set("Accept", "application/json");
    }

    return headers;
  },
});

export const coreApi = createApi({
  reducerPath: "coreApi",
  baseQuery,
  tagTypes: [
    "User",
    "Product",
    "Offers",
    "Customers",
    "Orders",
    "Categories",
    "SubCategories",
    "Brands",
    "Coupons",
    "CouponCodes",
    "Cart",
  ],
  endpoints: () => ({}),
});
