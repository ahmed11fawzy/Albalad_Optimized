# Redux Authentication System

This document explains how to use the Redux-based authentication system in the Al Balad customer application.

## Overview

The authentication system includes:

- Redux slices for auth state management
- RTK Query API endpoints for login/register operations
- Automatic token handling
- localStorage persistence
- React hooks for easy integration

## Files Structure

```
src/
├── redux/
│   ├── Slices/
│   │   ├── authApi.js          # Auth API endpoints
│   │   ├── globalData.js       # Global state including auth
│   │   └── coreApi.js          # Base API configuration
│   └── store.js                # Redux store configuration
├── hooks/
│   └── useAuthInit.js          # Auth initialization hook
└── components/
    └── AuthStatus.js           # Example usage component
```

## API Endpoints

### Available Mutations

- `useLoginMutation()` - Login user
- `useRegisterMutation()` - Register buyer
- `useRegisterSellerMutation()` - Register seller
- `useLogoutMutation()` - Logout user

### Available Queries

- `useGetCurrentUserQuery()` - Get current user profile

## State Management

### Global Auth State

```javascript
{
  user: null,           // User profile data
  userId: string|null,  // User ID
  token: string|null,   // Auth token
  isLoggedIn: boolean,  // Login status
}
```

### Actions

- `setAuthData({ user, userId, token, isLoggedIn })` - Set all auth data
- `logout()` - Clear auth state and localStorage
- `initializeAuth()` - Initialize from localStorage

## Usage Examples

### 1. Login Component

```javascript
import { useLoginMutation } from "../redux/Slices/authApi";
import { setAuthData } from "../redux/Slices/globalData";

const LoginForm = () => {
  const dispatch = useDispatch();
  const [login, { isLoading }] = useLoginMutation();

  const handleLogin = async (credentials) => {
    try {
      const result = await login(credentials).unwrap();

      if (
        result.status &&
        result.data.id &&
        result.data.token
      ) {
        // Store in localStorage
        localStorage.setItem("user_id", result.data.id);
        localStorage.setItem(
          "user_token",
          result.data.token
        );

        // Update Redux state
        dispatch(
          setAuthData({
            user: result.data,
            userId: result.data.id,
            token: result.data.token,
            isLoggedIn: true,
          })
        );
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
  };
};
```

### 2. Register Component

```javascript
import { useRegisterMutation } from "../redux/Slices/authApi";

const RegisterForm = () => {
  const [register, { isLoading }] = useRegisterMutation();

  const handleRegister = async (userData) => {
    try {
      const result = await register({
        name: userData.name,
        email: userData.email,
        password: userData.password,
        password_confirmation:
          userData.password_confirmation,
        type: "customer",
      }).unwrap();

      // Handle success similar to login
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };
};
```

### 3. Auth Status Component

```javascript
import { useAuthInit } from "../hooks/useAuthInit";
import { logout } from "../redux/Slices/globalData";

const AuthStatus = () => {
  const dispatch = useDispatch();
  const { isLoggedIn, user, isLoading } = useAuthInit();

  const handleLogout = () => {
    dispatch(logout());
  };

  if (isLoading) return <div>Loading...</div>;

  return isLoggedIn ? (
    <div>
      Welcome, {user?.name}
      <button onClick={handleLogout}>Logout</button>
    </div>
  ) : (
    <div>Please login</div>
  );
};
```

### 4. Protected Route Component

```javascript
import { useSelector } from "react-redux";

const ProtectedRoute = ({ children }) => {
  const { isLoggedIn } = useSelector(
    (state) => state.globalData
  );

  return isLoggedIn ? children : <Navigate to="/login" />;
};
```

### 5. Using Auth State in Any Component

```javascript
import { useSelector } from "react-redux";

const SomeComponent = () => {
  const { isLoggedIn, user, userId, token } = useSelector(
    (state) => state.globalData
  );

  // Use auth state as needed
  if (!isLoggedIn) {
    return <div>Please login to continue</div>;
  }

  return <div>Hello {user?.name}</div>;
};
```

## Key Features

### 1. Automatic Token Handling

The system automatically includes auth tokens in API requests when available.

### 2. localStorage Persistence

Auth state persists across browser sessions using localStorage.

### 3. Initialization Hook

Use `useAuthInit()` in your main App component to automatically restore auth state on app startup.

### 4. Error Handling

The system includes proper error handling for auth failures and token expiration.

### 5. Type Safety

All endpoints include proper TypeScript-like JSDoc comments for better IDE support.

## Integration Steps

1. **Import the auth hook in your main App component:**

```javascript
import { useAuthInit } from "./hooks/useAuthInit";

function App() {
  useAuthInit(); // Initialize auth state
  return <YourAppContent />;
}
```

2. **Use auth mutations in login/register components**
3. **Use auth state in components that need user information**
4. **Implement logout functionality where needed**

## Notes

- The system automatically handles token refresh if the API supports it
- All auth-related localStorage operations are centralized in the Redux slice
- The system is designed to work with the existing Al Balad API endpoints
- Error handling includes both network errors and API response errors
