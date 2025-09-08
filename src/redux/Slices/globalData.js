import { createSlice } from "@reduxjs/toolkit";

// Check localStorage for existing auth data
const getInitialAuthState = () => {
    try {
        const userId = localStorage.getItem('user_id');
        const token = localStorage.getItem('user_token');
        return {
            userId: userId || null,
            token: token || null,
            isLoggedIn: !!(userId && token),
            user: null, // User data will be fetched if needed
        };
    } catch (error) {
        return {
            userId: null,
            token: null,
            isLoggedIn: false,
            user: null,
        };
    }
};

const initialState = {
    theme: "light",
    ...getInitialAuthState(),
    cart: [],
    wishlist: [],
};

export const globalDataSlice = createSlice({
    name: "globalData",
    initialState,
    reducers: {
        setTheme: (state, action) => {
            state.theme = state.theme === 'dark' ? 'light' : 'dark';
        },
        setUser: (state, action) => {
            state.user = action.payload;
        },
        setUserId: (state, action) => {
            state.userId = action.payload;
        },
        setToken: (state, action) => {
            state.token = action.payload;
        },
        setIsLoggedIn: (state, action) => {
            state.isLoggedIn = action.payload;
        },
        setAuthData: (state, action) => {
            const { user, userId, token, isLoggedIn } = action.payload;
            state.user = user || null;
            state.userId = userId || null;
            state.token = token || null;
            state.isLoggedIn = isLoggedIn || false;
        },
        initializeAuth: (state) => {
            const authState = getInitialAuthState();
            state.userId = authState.userId;
            state.token = authState.token;
            state.isLoggedIn = authState.isLoggedIn;
            state.user = authState.user;
        },
        logout: (state) => {
            state.user = null;
            state.userId = null;
            state.token = null;
            state.isLoggedIn = false;
            // Clear localStorage
            localStorage.removeItem('user_id');
            localStorage.removeItem('user_token');
            localStorage.removeItem('session_id');
        },
        setCart: (state, action) => {
            state.cart = action.payload;
        },
        setWishlist: (state, action) => {
            state.wishlist = action.payload;
        },
    },
});

export const {
    setTheme,
    setUser,
    setUserId,
    setToken,
    setIsLoggedIn,
    setAuthData,
    initializeAuth,
    logout,
    setCart,
    setWishlist
} = globalDataSlice.actions;

export default globalDataSlice.reducer;
