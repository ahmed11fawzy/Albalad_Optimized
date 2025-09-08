
import { configureStore } from "@reduxjs/toolkit";
import { globalDataSlice } from "./Slices/globalData";
import { coreApi } from "./Slices/coreApi";
import { setupListeners } from "@reduxjs/toolkit/query";
// Import the productsApi to register the endpoints
import "./Slices/productsApi";
import "./Slices/followersApi";

export const store = configureStore({
    reducer: {
        globalData: globalDataSlice.reducer,
        [coreApi.reducerPath]: coreApi.reducer,
    },
    devTools: true,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(coreApi.middleware),
});

setupListeners(store.dispatch);