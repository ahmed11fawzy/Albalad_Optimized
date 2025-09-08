import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/Slices/globalData';
import { useLogoutMutation } from '../redux/Slices/authApi';
import { useAuthInit } from '../hooks/useAuthInit';

const AuthStatus = () => {
    const dispatch = useDispatch();
    const [logoutMutation] = useLogoutMutation();
    const { isLoggedIn, user, isLoading } = useAuthInit();

    const handleLogout = async () => {
        try {
            // Call API logout endpoint
            await logoutMutation().unwrap();
        } catch (error) {
            console.warn('Logout API call failed:', error);
        } finally {
            // Always clear local state regardless of API call result
            dispatch(logout());
        }
    };

    if (isLoading) {
        return <div>جاري التحميل...</div>;
    }

    if (!isLoggedIn) {
        return (
            <div>
                <span>غير مسجل دخول</span>
            </div>
        );
    }

    return (
        <div>
            <span>مرحباً، {user?.name || 'المستخدم'}</span>
            <button onClick={handleLogout} style={{ marginRight: '10px' }}>
                تسجيل خروج
            </button>
        </div>
    );
};

export default AuthStatus; 