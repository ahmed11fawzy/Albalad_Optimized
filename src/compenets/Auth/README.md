# Auth Components

This folder contains all authentication-related components for the Al Balad customer application.

## Components

### LoginDialog

- **File**: `loginDialog.js`
- **Purpose**: Modal dialog for user login
- **Features**:
  - Email/phone and password authentication
  - Integration with Redux auth state
  - Error handling and validation
  - Loading states
  - Social media login options (UI only)

### RegisterPage

- **File**: `RegisterPage.js`
- **Purpose**: Account type selection page
- **Features**:
  - Choose between buyer and supplier accounts
  - Navigation to specific registration forms

### RegisterBuyerPage

- **File**: `registerBuyerPage.js`
- **Purpose**: Buyer account registration form
- **Features**:
  - User registration form with validation
  - Integration with Redux auth state
  - Social media registration options (UI only)
  - Automatic login after successful registration

### RegisterSellerPage

- **File**: `registerSellerPage.js`
- **Purpose**: Seller account registration form
- **Features**:
  - Multi-step registration process
  - Personal information, store details, and document upload
  - Integration with location and market APIs
  - File upload handling for business documents

## Usage

Import components from the Auth folder:

```javascript
import {
  LoginDialog,
  RegisterPage,
  RegisterBuyerPage,
  RegisterSellerPage,
} from "./compenets/Auth";
```

Or import individual components:

```javascript
import { LoginDialog } from "./compenets/Auth";
```

## Dependencies

All components use:

- Redux for state management
- React Router for navigation
- Custom hooks for authentication (useAuthInit)
- Auth API slice for backend communication

## File Structure

```
Auth/
├── README.md
├── index.js                    # Export file for all components
├── loginDialog.js             # Login modal component
├── loginDialog.css            # Login modal styles
├── RegisterPage.js            # Account type selection
├── registerPage.css           # Account type selection styles
├── registerBuyerPage.js       # Buyer registration form
├── registerBuyerPage.css      # Buyer registration styles
├── registerSellerPage.js      # Seller registration form
└── registerSellerPage.css     # Seller registration styles
```

## Redux Integration

All components are integrated with the Redux store and use:

- `authApi.js` for API calls
- `globalData.js` for auth state management
- Automatic token storage in localStorage
- State synchronization across the application
