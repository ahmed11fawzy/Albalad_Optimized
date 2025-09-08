import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useGetCurrentUserQuery } from '../redux/Slices/authApi';
import { setUser, initializeAuth } from '../redux/Slices/globalData';

export const useAuthInit = () => {
    const dispatch = useDispatch();
    const { isLoggedIn, token, user } = useSelector((state) => state.globalData);

    // Skip user profile fetch if not logged in or user data already exists
    const {
        data: userData,
        isLoading,
        error
    } = useGetCurrentUserQuery(undefined, {
        skip: !isLoggedIn || !token || !!user,
    });

    useEffect(() => {
        // Initialize auth state from localStorage on component mount
        dispatch(initializeAuth());
    }, [dispatch]);

    useEffect(() => {
        // Update user data in Redux when fetched from API
        if (userData && isLoggedIn) {
            dispatch(setUser(userData));
        }
    }, [userData, isLoggedIn, dispatch]);

    useEffect(() => {
        // Handle auth errors (e.g., invalid token)
        if (error && isLoggedIn) {
            console.warn('Auth error:', error);
            // Optionally dispatch logout action if token is invalid
            // dispatch(logout());
        }
    }, [error, isLoggedIn]);

    return {
        isLoading,
        isLoggedIn,
        user: user || userData,
        error,
    };
}; 