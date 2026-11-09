# Design Document

## Overview

This design document outlines the architecture for a production-grade, modular React Native mobile application built with TypeScript. The system is designed to support multiple clients through a white-label approach, enabling rapid deployment of customized e-commerce mobile apps while maintaining a single, maintainable codebase.

The architecture follows a feature-based modular structure with clear separation of concerns:
- **Core Layer**: Shared infrastructure (navigation, state, API, config)
- **Feature Modules**: Self-contained domains (auth, products, cart, checkout, profile)
- **Design System**: Reusable UI components with theming
- **Client Configuration**: JSON-driven branding and feature flags

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Mobile Application                    │
├─────────────────────────────────────────────────────────┤
│  Feature Modules (Auth, Products, Cart, Profile, etc.)  │
├─────────────────────────────────────────────────────────┤
│         Design System (Themed UI Components)            │
├─────────────────────────────────────────────────────────┤
│  Core Infrastructure (Navigation, State, API, Config)   │
├─────────────────────────────────────────────────────────┤
│           React Native + TypeScript Runtime             │
└─────────────────────────────────────────────────────────┘
```

### Directory Structure

**Note**: This React Native project will be created in a separate directory from the existing React web application. The recommended structure is to create a sibling directory (e.g., `../gkstore-mobile/` or create a `mobile/` folder at the root level) to keep the mobile and web codebases separate while allowing shared configuration if needed.

```
gkstore-mobile/                    # New React Native project (separate from web app)
├── src/
│   ├── core/                      # Core infrastructure
│   │   ├── navigation/            # Navigation configuration
│   │   ├── state/                 # Redux store setup
│   │   ├── api/                   # API client and interceptors
│   │   ├── config/                # Configuration loader
│   │   └── utils/                 # Shared utilities
│   ├── features/                  # Feature modules
│   │   ├── auth/                  # Authentication
│   │   │   ├── screens/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── state/             # Redux slice
│   │   │   ├── services/          # API calls
│   │   │   └── types/
│   │   ├── products/              # Product browsing
│   │   ├── cart/                  # Shopping cart
│   │   ├── checkout/              # Checkout flow
│   │   └── profile/               # User profile
│   ├── shared/                    # Shared across features
│   │   ├── components/            # Design system components
│   │   ├── hooks/                 # Shared hooks
│   │   ├── theme/                 # Theme configuration
│   │   └── types/                 # Shared TypeScript types
│   ├── assets/                    # Images, fonts, icons
│   └── config/                    # Client configurations
│       ├── clients/
│       │   ├── client-a.json
│       │   └── client-b.json
│       └── env/
│           ├── development.ts
│           ├── staging.ts
│           └── production.ts
├── __tests__/                     # Test files
├── android/                       # Android native code
├── ios/                           # iOS native code
├── scripts/                       # Build and deployment scripts
│   ├── switch-client.js
│   └── generate-assets.js
└── package.json
```

## Components and Interfaces

### 1. Configuration System


**ClientConfig Interface:**
```typescript
interface ClientConfig {
  clientId: string;
  appName: string;
  bundleId: {
    ios: string;
    android: string;
  };
  branding: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    logo: string;
    splashScreen: string;
  };
  api: {
    baseUrl: string;
    timeout: number;
  };
  features: {
    socialLogin: boolean;
    biometricAuth: boolean;
    wishlist: boolean;
    reviews: boolean;
    pushNotifications: boolean;
  };
  analytics: {
    firebaseConfig: object;
    sentryDsn?: string;
  };
}
```

**Configuration Loader:**
```typescript
class ConfigLoader {
  private static instance: ClientConfig;
  
  static load(clientId: string): ClientConfig;
  static get(): ClientConfig;
  static validate(config: ClientConfig): boolean;
}
```

### 2. Navigation System

**Navigation Structure:**
- **Root Navigator**: Handles authentication state (Auth Stack vs Main Stack)
- **Auth Stack**: Login, Signup, Forgot Password
- **Main Tab Navigator**: Home, Categories, Cart, Profile
- **Nested Stacks**: Each tab has its own stack navigator


**Navigation Types:**
```typescript
type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
};

type AuthStackParamList = {
  Login: undefined;
  Signup: undefined;
  ForgotPassword: undefined;
};

type MainTabParamList = {
  HomeTab: undefined;
  CategoriesTab: undefined;
  CartTab: undefined;
  ProfileTab: undefined;
};

type HomeStackParamList = {
  Home: undefined;
  ProductDetails: { slug: string };
  Search: undefined;
};

type ProfileStackParamList = {
  Profile: undefined;
  Orders: undefined;
  OrderDetails: { orderId: string };
  Addresses: undefined;
  Wishlist: undefined;
  Reviews: undefined;
};
```

### 3. State Management

**Redux Store Structure:**
```typescript
interface RootState {
  auth: AuthState;
  cart: CartState;
  products: ProductsState;
  ui: UIState;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

interface CartState {
  items: CartItem[];
  totalQuantity: number;
  totalAmount: number;
  merged: boolean;
}

interface ProductsState {
  items: Record<string, Product>;
  categories: Category[];
  loading: boolean;
  error: string | null;
}
```


### 4. API Layer

**API Client:**
```typescript
class ApiClient {
  private axiosInstance: AxiosInstance;
  
  constructor(config: ClientConfig);
  
  // Request interceptor
  private setupRequestInterceptor(): void;
  
  // Response interceptor
  private setupResponseInterceptor(): void;
  
  // HTTP methods
  get<T>(url: string, config?: AxiosRequestConfig): Promise<T>;
  post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
  put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
  delete<T>(url: string, config?: AxiosRequestConfig): Promise<T>;
}
```

**API Service Pattern:**
```typescript
// Example: Product Service
class ProductService {
  static async getProducts(params: ProductQueryParams): Promise<ProductsResponse>;
  static async getProductBySlug(slug: string): Promise<Product>;
  static async searchProducts(query: string): Promise<Product[]>;
}

// Example: Auth Service
class AuthService {
  static async login(credentials: LoginCredentials): Promise<AuthResponse>;
  static async signup(data: SignupData): Promise<AuthResponse>;
  static async refreshToken(token: string): Promise<TokenResponse>;
  static async logout(): Promise<void>;
}
```

### 5. Design System Components

**Base Components:**
- `Button`: Primary, secondary, outline, text variants
- `Input`: Text, email, password, search with validation
- `Card`: Product card, info card with shadows
- `Typography`: Heading, body, caption with theme integration
- `Icon`: Wrapper around react-native-vector-icons
- `Image`: Optimized image with caching (react-native-fast-image)
- `Loading`: Spinner, skeleton loaders
- `Modal`: Bottom sheet, full screen, alert modals


**Theme System:**
```typescript
interface Theme {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    error: string;
    success: string;
    warning: string;
    border: string;
  };
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  typography: {
    h1: TextStyle;
    h2: TextStyle;
    h3: TextStyle;
    body: TextStyle;
    caption: TextStyle;
  };
  borderRadius: {
    sm: number;
    md: number;
    lg: number;
    full: number;
  };
}

// Theme Provider
const ThemeProvider: React.FC<{ config: ClientConfig }>;
const useTheme = (): Theme;
```

### 6. Feature Module Structure

Each feature module follows this pattern:

**Auth Module:**
- `screens/`: LoginScreen, SignupScreen, ForgotPasswordScreen
- `components/`: SocialLoginButton, BiometricPrompt
- `hooks/`: useAuth, useLogin, useSignup
- `state/`: authSlice.ts (Redux Toolkit slice)
- `services/`: authService.ts (API calls)
- `types/`: auth.types.ts

**Products Module:**
- `screens/`: ProductListScreen, ProductDetailScreen, SearchScreen
- `components/`: ProductCard, ProductGallery, VariantSelector
- `hooks/`: useProducts, useProductDetail, useSearch
- `state/`: productsSlice.ts
- `services/`: productService.ts
- `types/`: product.types.ts


**Cart Module:**
- `screens/`: CartScreen, ApplyCouponScreen
- `components/`: CartItem, CartSummary, CouponInput
- `hooks/`: useCart, useCartSync
- `state/`: cartSlice.ts
- `services/`: cartService.ts
- `types/`: cart.types.ts

**Checkout Module:**
- `screens/`: CheckoutScreen, AddressSelectionScreen, PaymentScreen, OrderConfirmationScreen
- `components/`: AddressCard, PaymentMethodCard, OrderSummary
- `hooks/`: useCheckout, useAddresses
- `state/`: checkoutSlice.ts
- `services/`: checkoutService.ts, addressService.ts
- `types/`: checkout.types.ts

**Profile Module:**
- `screens/`: ProfileScreen, OrdersScreen, OrderDetailScreen, AddressesScreen, WishlistScreen, ReviewsScreen
- `components/`: ProfileHeader, OrderCard, AddressForm, ReviewForm
- `hooks/`: useProfile, useOrders, useWishlist
- `state/`: profileSlice.ts
- `services/`: profileService.ts, orderService.ts
- `types/`: profile.types.ts

## Data Models

### User Model
```typescript
interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}
```

### Product Model
```typescript
interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  salePrice?: number;
  images: string[];
  category: Category;
  subCategory?: SubCategory;
  variants: ProductVariant[];
  stock: number;
  isHotProduct: boolean;
  isBestSeller: boolean;
  isFeatured: boolean;
  isCombo: boolean;
  rating: number;
  reviewCount: number;
}

interface ProductVariant {
  id: string;
  size?: string;
  color?: string;
  stock: number;
  priceModifier?: number;
}
```


### Category Model
```typescript
interface Category {
  id: string;
  slug: string;
  name: string;
  image: string;
  subCategories: SubCategory[];
}

interface SubCategory {
  id: string;
  slug: string;
  name: string;
  categoryId: string;
}
```

### Cart Model
```typescript
interface CartItem {
  id: string;
  productId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
}

interface Cart {
  items: CartItem[];
  totalQuantity: number;
  totalAmount: number;
  coupon?: Coupon;
  discount: number;
}

interface Coupon {
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderAmount?: number;
}
```

### Order Model
```typescript
interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  shippingAddress: Address;
  billingAddress: Address;
  paymentMethod: PaymentMethod;
  subtotal: number;
  discount: number;
  shippingCost: number;
  tax: number;
  total: number;
  status: OrderStatus;
  trackingNumber?: string;
  createdAt: string;
  updatedAt: string;
}

interface OrderItem {
  productId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
}

type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
```


### Address Model
```typescript
interface Address {
  id: string;
  userId: string;
  name: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}
```

### Payment Model
```typescript
interface PaymentMethod {
  id: string;
  type: 'card' | 'upi' | 'netbanking' | 'cod';
  details: CardDetails | UPIDetails | NetBankingDetails | null;
}

interface CardDetails {
  last4: string;
  brand: string;
  expiryMonth: number;
  expiryYear: number;
}

interface UPIDetails {
  vpa: string;
}

interface NetBankingDetails {
  bankName: string;
}
```

### Review Model
```typescript
interface Review {
  id: string;
  userId: string;
  userName: string;
  productId: string;
  rating: number;
  title: string;
  comment: string;
  images?: string[];
  createdAt: string;
  helpful: number;
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*


### Property Reflection

After analyzing all acceptance criteria, I've identified the following testable properties. Some redundancies have been eliminated:

- **Configuration properties (2.1, 2.3, 2.4)** can be combined into a single schema validation property
- **Deep linking properties (5.5, 14.4)** are duplicates - will use one comprehensive property
- **Cart sync properties (8.7, 8.8)** both test cart synchronization - will combine into one property
- **Persistence properties (4.2, 13.1)** test similar round-trip behavior - will keep separate as they test different data types

### Correctness Properties

**Property 1: Configuration Schema Completeness**
*For any* client configuration, it must contain all required fields including brand colors, logos, app name, bundle identifiers, API endpoints for all environments, and feature flags.
**Validates: Requirements 2.1, 2.3, 2.4**

**Property 2: Configuration Round Trip**
*For any* valid client configuration, loading it into the ConfigLoader then retrieving it should return an equivalent configuration object.
**Validates: Requirements 2.5**

**Property 3: Theme Application Consistency**
*For any* client configuration with brand colors, applying it to the Theme_System should result in all theme colors matching the configuration's branding values.
**Validates: Requirements 3.3**

**Property 4: Theme Mode Variants**
*For any* design system component, rendering it in light mode versus dark mode should produce different style values for color-related properties.
**Validates: Requirements 3.2**

**Property 5: State Persistence Round Trip**
*For any* authentication or cart state, persisting it to AsyncStorage then rehydrating should produce an equivalent state object.
**Validates: Requirements 4.2**

**Property 6: Async Operation State Transitions**
*For any* async thunk operation, dispatching it should transition the state through exactly one of these paths: loading→success or loading→error, never skipping loading state.
**Validates: Requirements 4.6**


**Property 7: Authentication Guard Redirect**
*For any* protected route, attempting to navigate to it while unauthenticated should result in navigation to the login screen instead.
**Validates: Requirements 5.4**

**Property 8: Deep Link Navigation**
*For any* valid deep link URL (product, category, or order), processing it should navigate to the correct screen with the correct parameters extracted from the URL.
**Validates: Requirements 5.5, 14.4**

**Property 9: Navigation State Persistence**
*For any* navigation state, persisting it then restarting the app should restore the same navigation stack and active screen.
**Validates: Requirements 5.6**

**Property 10: Authentication Token Injection**
*For any* API request made while authenticated, the request headers should contain the authentication token from the State_Manager.
**Validates: Requirements 6.2**

**Property 11: 401 Error Token Refresh**
*For any* API response with 401 status code, the response interceptor should attempt to refresh the authentication token before retrying the original request.
**Validates: Requirements 6.3**

**Property 12: API Error Toast Display**
*For any* API error response, a toast notification should be displayed with a user-friendly error message derived from the error response.
**Validates: Requirements 6.4**

**Property 13: Request Cancellation on Unmount**
*For any* in-flight API request, unmounting the component that initiated it should cancel the request and prevent state updates.
**Validates: Requirements 6.5**

**Property 14: Environment-Based API URL**
*For any* environment configuration (development, staging, production), the API client's base URL should match the URL specified in the Client_Config for that environment.
**Validates: Requirements 6.6**

**Property 15: Form Validation Rejection**
*For any* email/password authentication form, submitting it with invalid email format or password below minimum length should prevent submission and display validation errors.
**Validates: Requirements 7.1**


**Property 16: Login State Update**
*For any* successful login response, the State_Manager should update to contain both the authentication token and user profile data from the response.
**Validates: Requirements 7.3**

**Property 17: Logout State Cleanup**
*For any* logout action, the State_Manager should clear all authentication data and the persisted storage should no longer contain any auth tokens or user data.
**Validates: Requirements 7.4**

**Property 18: Token Auto-Refresh**
*For any* expired authentication token, making an API request should automatically trigger token refresh and retry the request without user intervention.
**Validates: Requirements 7.6**

**Property 19: Cart Quantity Update Totals**
*For any* cart item, adjusting its quantity should update the cart's totalQuantity and totalAmount to reflect the new quantity.
**Validates: Requirements 8.3**

**Property 20: Search Debouncing**
*For any* sequence of search input changes within a short time window, only the final input value should trigger an API search request after the debounce delay.
**Validates: Requirements 8.6**

**Property 21: Cart Login Synchronization**
*For any* local cart state, logging in should merge it with the backend cart such that items present in both have their quantities combined, and all items are persisted to the backend.
**Validates: Requirements 8.7, 8.8**

**Property 22: Order Status Display**
*For any* order in the orders list, it should display a status indicator that matches one of the valid OrderStatus values.
**Validates: Requirements 9.2**

**Property 23: Address CRUD Round Trip**
*For any* address object, adding it via the API then retrieving the address list should include an address with equivalent field values.
**Validates: Requirements 9.4**

**Property 24: Wishlist Add-Remove Idempotence**
*For any* product, adding it to the wishlist then removing it should result in the wishlist returning to its original state (not containing that product).
**Validates: Requirements 9.5**


**Property 25: Review Submission Persistence**
*For any* review submission, submitting it successfully should result in the review appearing in the product's review list with matching content.
**Validates: Requirements 9.6**

**Property 26: Build Metadata Injection**
*For any* client configuration, building the app with that configuration should produce an app bundle with app name and bundle ID matching the configuration's values.
**Validates: Requirements 10.2**

**Property 27: Environment Variable Injection**
*For any* environment (development, staging, production), building for that environment should inject the correct API keys and secrets from environment variables.
**Validates: Requirements 10.5**

**Property 28: Image Cache Reuse**
*For any* image URL, loading it a second time should retrieve it from cache rather than making a new network request.
**Validates: Requirements 12.2**

**Property 29: Data Cache Round Trip**
*For any* product data, caching it to AsyncStorage then retrieving it should return equivalent product data.
**Validates: Requirements 13.1**

**Property 30: Offline Data Display with Indicator**
*For any* cached data, displaying it while offline should render the data and show an offline indicator in the UI.
**Validates: Requirements 13.2**

**Property 31: Reconnection Cart Sync**
*For any* local cart modifications made while offline, reconnecting to the network should sync those changes to the backend API.
**Validates: Requirements 13.3**

**Property 32: Failed Request Retry Queue**
*For any* API request that fails due to network error, it should be added to a retry queue and automatically retried when network connection is restored.
**Validates: Requirements 13.4**

**Property 33: Offline Action Feedback**
*For any* action that requires internet connectivity, attempting it while offline should display user feedback (toast or alert) indicating network is required.
**Validates: Requirements 13.6**


**Property 34: Notification Display**
*For any* push notification received, it should be displayed to the user using the notification system.
**Validates: Requirements 14.2**

**Property 35: Notification Tap Navigation**
*For any* notification containing a deep link, tapping it should navigate to the screen specified in the deep link with correct parameters.
**Validates: Requirements 14.3**

**Property 36: Deep Link Multi-State Handling**
*For any* deep link, it should successfully navigate to the target screen regardless of whether the app is closed, backgrounded, or active.
**Validates: Requirements 14.5**

**Property 37: Analytics Event Logging**
*For any* tracked user action (product view, add to cart, purchase, screen view), an analytics event should be logged with the action name and relevant parameters.
**Validates: Requirements 15.2**

**Property 38: Error Context Logging**
*For any* error that occurs, it should be logged with contextual information including user ID (if authenticated), current screen name, and the action that triggered the error.
**Validates: Requirements 15.4**

## Error Handling

### Error Categories

1. **Network Errors**
   - Connection timeout
   - No internet connection
   - Server unreachable
   - **Handling**: Display user-friendly message, queue request for retry, show offline indicator

2. **Authentication Errors**
   - Invalid credentials (401)
   - Token expired (401)
   - Insufficient permissions (403)
   - **Handling**: Redirect to login, attempt token refresh, show permission denied message

3. **Validation Errors**
   - Invalid form input
   - Missing required fields
   - Format errors (email, phone)
   - **Handling**: Display inline validation errors, prevent form submission

4. **API Errors**
   - 400 Bad Request
   - 404 Not Found
   - 500 Internal Server Error
   - **Handling**: Parse error response, display user-friendly message via toast

5. **Client Errors**
   - Component render errors
   - State update errors
   - Navigation errors
   - **Handling**: Log to crash reporting, show error boundary fallback UI


### Error Handling Implementation

**Global Error Boundary:**
```typescript
class ErrorBoundary extends React.Component<Props, State> {
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log to crash reporting
    logError(error, {
      componentStack: errorInfo.componentStack,
      userId: getCurrentUserId(),
      screen: getCurrentScreen(),
    });
  }
  
  render() {
    if (this.state.hasError) {
      return <ErrorFallbackScreen />;
    }
    return this.props.children;
  }
}
```

**API Error Interceptor:**
```typescript
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Attempt token refresh
      const refreshed = await refreshAuthToken();
      if (refreshed) {
        return axiosInstance.request(error.config);
      }
      // Redirect to login
      navigationRef.navigate('Login');
    }
    
    // Display user-friendly error
    const message = getErrorMessage(error);
    Toast.show({ type: 'error', text1: message });
    
    return Promise.reject(error);
  }
);
```

**Network Status Monitoring:**
```typescript
const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(true);
  
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsOnline(state.isConnected ?? false);
      
      if (state.isConnected) {
        // Sync queued requests
        syncQueuedRequests();
        // Sync cart
        syncCart();
      }
    });
    
    return unsubscribe;
  }, []);
  
  return isOnline;
};
```

## Testing Strategy

### Dual Testing Approach

The testing strategy employs both unit tests and property-based tests as complementary approaches:

- **Unit Tests**: Verify specific examples, edge cases, and error conditions
- **Property Tests**: Verify universal properties across all inputs

Both are necessary for comprehensive coverage. Unit tests catch concrete bugs in specific scenarios, while property tests verify general correctness across a wide range of inputs.


### Testing Framework Selection

**Unit Testing:**
- **Framework**: Jest with React Native Testing Library
- **Purpose**: Test React components, hooks, and business logic
- **Coverage**: Specific examples, edge cases, error conditions

**Property-Based Testing:**
- **Framework**: fast-check (JavaScript/TypeScript property testing library)
- **Purpose**: Test universal properties across randomized inputs
- **Configuration**: Minimum 100 iterations per property test
- **Coverage**: Universal properties that should hold for all valid inputs

**End-to-End Testing:**
- **Framework**: Detox
- **Purpose**: Test complete user flows on iOS and Android simulators
- **Coverage**: Critical user journeys (login, browse, add to cart, checkout)

### Property Test Configuration

Each property-based test must:
1. Run minimum 100 iterations with randomized inputs
2. Include a comment tag referencing the design document property
3. Use fast-check generators appropriate for the data type
4. Test one specific property from the design document

**Tag Format:**
```typescript
// Feature: react-native-multi-client-platform, Property 1: Configuration Schema Completeness
```

### Test Organization

```
__tests__/
├── unit/
│   ├── components/
│   │   ├── Button.test.tsx
│   │   └── Input.test.tsx
│   ├── hooks/
│   │   ├── useAuth.test.ts
│   │   └── useCart.test.ts
│   ├── state/
│   │   ├── authSlice.test.ts
│   │   └── cartSlice.test.ts
│   └── services/
│       ├── authService.test.ts
│       └── productService.test.ts
├── property/
│   ├── config.property.test.ts
│   ├── state.property.test.ts
│   ├── navigation.property.test.ts
│   └── api.property.test.ts
└── e2e/
    ├── auth.e2e.ts
    ├── shopping.e2e.ts
    └── checkout.e2e.ts
```

### Example Property Test

```typescript
import fc from 'fast-check';

// Feature: react-native-multi-client-platform, Property 2: Configuration Round Trip
describe('Configuration Round Trip Property', () => {
  it('should preserve configuration through load/get cycle', () => {
    fc.assert(
      fc.property(
        fc.record({
          clientId: fc.string(),
          appName: fc.string(),
          branding: fc.record({
            primaryColor: fc.hexaString({ minLength: 6, maxLength: 6 }),
            secondaryColor: fc.hexaString({ minLength: 6, maxLength: 6 }),
          }),
          api: fc.record({
            baseUrl: fc.webUrl(),
            timeout: fc.integer({ min: 1000, max: 30000 }),
          }),
        }),
        (config) => {
          ConfigLoader.load(config);
          const retrieved = ConfigLoader.get();
          expect(retrieved).toEqual(config);
        }
      ),
      { numRuns: 100 }
    );
  });
});
```

### Example Unit Test

```typescript
import { render, fireEvent } from '@testing-library/react-native';
import { LoginScreen } from '../screens/LoginScreen';

describe('LoginScreen', () => {
  it('should display validation error for invalid email', () => {
    const { getByPlaceholderText, getByText } = render(<LoginScreen />);
    
    const emailInput = getByPlaceholderText('Email');
    fireEvent.changeText(emailInput, 'invalid-email');
    fireEvent.press(getByText('Login'));
    
    expect(getByText('Please enter a valid email')).toBeTruthy();
  });
  
  it('should call login API with correct credentials', async () => {
    const mockLogin = jest.fn();
    const { getByPlaceholderText, getByText } = render(
      <LoginScreen onLogin={mockLogin} />
    );
    
    fireEvent.changeText(getByPlaceholderText('Email'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('Password'), 'password123');
    fireEvent.press(getByText('Login'));
    
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });
  });
});
```

### CI/CD Integration

Tests run automatically in the CI/CD pipeline:
1. **Pre-commit**: Lint and format checks
2. **Pull Request**: Unit tests and property tests
3. **Pre-deployment**: Full test suite including E2E tests
4. **Coverage Threshold**: Minimum 70% for critical business logic

### Performance Testing

Monitor and test:
- Screen render times (< 16ms for 60fps)
- API response times
- Bundle size (< 10MB for initial load)
- Memory usage
- Battery consumption

Use React Native Performance Monitor and Flipper for profiling during development.
