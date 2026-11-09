# Implementation Plan: React Native Multi-Client Platform

## Overview

This implementation plan breaks down the creation of a production-grade, modular React Native mobile application in TypeScript into discrete, manageable tasks. The project will be created in a separate directory from the existing React web app, following a feature-based architecture that supports multiple clients through configuration-driven white-labeling.

The implementation follows an incremental approach:
1. Project initialization and core infrastructure
2. Configuration and theming system
3. State management and API layer
4. Authentication feature
5. Navigation setup
6. E-commerce features (products, cart, checkout)
7. User profile features
8. Advanced features (offline support, notifications, analytics)
9. Build pipeline and deployment

## Tasks

- [x] 1. Initialize React Native project with TypeScript
  - Create new React Native project in separate directory using `npx react-native init gkstoreMobile --template react-native-template-typescript`
  - Configure absolute imports in tsconfig.json and babel.config.js with path aliases (@core, @features, @shared, @assets, @config)
  - Set up ESLint and Prettier for TypeScript and React Native
  - Create base directory structure: src/{core,features,shared,assets,config}
  - Install core dependencies: @react-navigation/native, @reduxjs/toolkit, react-redux, redux-persist, axios
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

- [ ]* 1.1 Write unit tests for project structure validation
  - Test that all required directories exist
  - Test that tsconfig path aliases resolve correctly
  - _Requirements: 1.2, 1.3_

- [x] 2. Implement configuration system
  - [x] 2.1 Create ClientConfig TypeScript interface
    - Define interface with all required fields (clientId, appName, bundleId, branding, api, features, analytics)
    - Create example client configurations in src/config/clients/ (client-a.json, client-b.json)
    - _Requirements: 2.1, 2.3, 2.4_

  - [ ]* 2.2 Write property test for configuration schema
    - **Property 1: Configuration Schema Completeness**
    - **Validates: Requirements 2.1, 2.3, 2.4**

  - [x] 2.3 Implement ConfigLoader class
    - Create singleton ConfigLoader with load(), get(), and validate() methods
    - Implement JSON schema validation for client configs
    - Add environment detection (development, staging, production)
    - _Requirements: 2.5, 2.6_

  - [ ]* 2.4 Write property test for configuration round trip
    - **Property 2: Configuration Round Trip**
    - **Validates: Requirements 2.5**


- [x] 3. Build design system and theme engine
  - [x] 3.1 Create Theme interface and ThemeProvider
    - Define Theme interface with colors, spacing, typography, borderRadius
    - Implement ThemeProvider component that accepts ClientConfig
    - Create useTheme hook for accessing theme in components
    - Support light and dark mode variants
    - _Requirements: 3.2, 3.3_

  - [ ]* 3.2 Write property test for theme application
    - **Property 3: Theme Application Consistency**
    - **Validates: Requirements 3.3**

  - [ ]* 3.3 Write property test for theme mode variants
    - **Property 4: Theme Mode Variants**
    - **Validates: Requirements 3.2**

  - [x] 3.4 Create atomic UI components
    - Implement Button component (primary, secondary, outline, text variants)
    - Implement Input component (text, email, password, search with validation)
    - Implement Card component with shadows and theming
    - Implement Typography components (Heading, Body, Caption)
    - Implement Icon wrapper component
    - Implement Loading components (Spinner, Skeleton)
    - All components should use theme values via useTheme hook
    - _Requirements: 3.1, 3.5_

  - [ ]* 3.5 Write unit tests for design system components
    - Test Button variants render correctly
    - Test Input validation behavior
    - Test components respond to theme changes
    - _Requirements: 3.1, 3.2_

- [x] 4. Set up state management with Redux Toolkit
  - [x] 4.1 Configure Redux store with persistence
    - Create store configuration with redux-persist and AsyncStorage
    - Set up typed hooks (useAppDispatch, useAppSelector)
    - Configure persistence for auth and cart slices
    - Implement rehydration logic
    - _Requirements: 4.1, 4.2, 4.4, 4.5_

  - [ ]* 4.2 Write property test for state persistence
    - **Property 5: State Persistence Round Trip**
    - **Validates: Requirements 4.2**

  - [x] 4.3 Create auth slice with async thunks
    - Define AuthState interface
    - Implement authSlice with login, logout, refreshToken reducers
    - Create async thunks for login, signup, logout with loading/error states
    - _Requirements: 4.3, 4.6_

  - [ ]* 4.4 Write property test for async operation state transitions
    - **Property 6: Async Operation State Transitions**
    - **Validates: Requirements 4.6**

  - [x] 4.5 Create cart slice with sync logic
    - Define CartState interface
    - Implement cartSlice with addItem, updateQuantity, removeItem, setCart, mergeCart, clearCart
    - Implement cart total calculations
    - _Requirements: 4.3_

- [x] 5. Checkpoint - Verify core infrastructure
  - Ensure all tests pass, ask the user if questions arise.


- [x] 6. Implement API layer with Axios
  - [x] 6.1 Create ApiClient class
    - Implement ApiClient with Axios instance
    - Configure base URL from ClientConfig
    - Implement HTTP methods (get, post, put, delete) with TypeScript generics
    - _Requirements: 6.1, 6.6_

  - [ ]* 6.2 Write property test for environment-based API URL
    - **Property 14: Environment-Based API URL**
    - **Validates: Requirements 6.6**

  - [x] 6.3 Implement request and response interceptors
    - Add request interceptor to attach auth token from Redux state
    - Add response interceptor for 401 handling with token refresh
    - Add response interceptor for error toast notifications
    - Implement request cancellation on component unmount
    - _Requirements: 6.2, 6.3, 6.4, 6.5_

  - [ ]* 6.4 Write property test for authentication token injection
    - **Property 10: Authentication Token Injection**
    - **Validates: Requirements 6.2**

  - [ ]* 6.5 Write property test for 401 error token refresh
    - **Property 11: 401 Error Token Refresh**
    - **Validates: Requirements 6.3**

  - [ ]* 6.6 Write property test for API error toast display
    - **Property 12: API Error Toast Display**
    - **Validates: Requirements 6.4**

  - [ ]* 6.7 Write property test for request cancellation
    - **Property 13: Request Cancellation on Unmount**
    - **Validates: Requirements 6.5**

- [-] 7. Build authentication feature module
  - [x] 7.1 Create auth service with API calls
    - Implement AuthService with login, signup, refreshToken, logout methods
    - Define TypeScript interfaces for request/response types
    - _Requirements: 7.1, 7.2_

  - [x] 7.2 Create login screen with form validation
    - Implement LoginScreen with email and password inputs
    - Add form validation (email format, password length)
    - Integrate with auth slice and AuthService
    - Add social login buttons (Google, Facebook) with Firebase Auth
    - _Requirements: 7.1, 7.2_

  - [ ]* 7.3 Write property test for form validation
    - **Property 15: Form Validation Rejection**
    - **Validates: Requirements 7.1**

  - [ ]* 7.4 Write property test for login state update
    - **Property 16: Login State Update**
    - **Validates: Requirements 7.3**

  - [x] 7.5 Create signup screen
    - Implement SignupScreen with name, email, password, confirm password inputs
    - Add form validation
    - Integrate with auth slice and AuthService
    - _Requirements: 7.1_

  - [ ] 7.6 Implement biometric authentication
    - Install and configure react-native-biometrics
    - Add biometric prompt for returning users
    - Store biometric preference in AsyncStorage
    - _Requirements: 7.5_

  - [ ]* 7.7 Write property test for logout state cleanup
    - **Property 17: Logout State Cleanup**
    - **Validates: Requirements 7.4**

  - [ ]* 7.8 Write property test for token auto-refresh
    - **Property 18: Token Auto-Refresh**
    - **Validates: Requirements 7.6**


- [-] 8. Set up navigation with React Navigation
  - [x] 8.1 Install and configure React Navigation
    - Install @react-navigation/native, @react-navigation/stack, @react-navigation/bottom-tabs
    - Install required dependencies (react-native-screens, react-native-safe-area-context, react-native-gesture-handler)
    - Define TypeScript types for all navigation stacks
    - _Requirements: 5.1_

  - [x] 8.2 Create root navigator with auth flow
    - Implement RootNavigator that switches between Auth and Main stacks based on auth state
    - Create AuthStack with Login, Signup, ForgotPassword screens
    - _Requirements: 5.4_

  - [ ]* 8.3 Write property test for authentication guard
    - **Property 7: Authentication Guard Redirect**
    - **Validates: Requirements 5.4**

  - [x] 8.4 Create main tab navigator
    - Implement MainTabNavigator with Home, Categories, Cart, Profile tabs
    - Create nested stack navigators for each tab
    - Add tab bar icons and labels from theme
    - _Requirements: 5.2, 5.3_

  - [ ] 8.5 Implement deep linking configuration
    - Configure deep linking for products, categories, orders
    - Add URL scheme to iOS and Android configs
    - Implement linking configuration with path mappings
    - _Requirements: 5.5, 14.4_

  - [ ]* 8.6 Write property test for deep link navigation
    - **Property 8: Deep Link Navigation**
    - **Validates: Requirements 5.5, 14.4**

  - [ ] 8.7 Add navigation state persistence
    - Configure navigation state persistence with AsyncStorage
    - Implement state restoration on app restart
    - _Requirements: 5.6_

  - [ ]* 8.8 Write property test for navigation state persistence
    - **Property 9: Navigation State Persistence**
    - **Validates: Requirements 5.6**

- [x] 9. Checkpoint - Verify auth and navigation
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 10. Build products feature module
  - [ ] 10.1 Create product service and state slice
    - Implement ProductService with getProducts, getProductBySlug, searchProducts methods
    - Create productsSlice with async thunks
    - Define Product, Category, SubCategory TypeScript interfaces
    - _Requirements: 8.1, 8.2_

  - [ ] 10.2 Create product list screen
    - Implement ProductListScreen with FlatList
    - Add infinite scroll with pagination
    - Add pull-to-refresh functionality
    - Implement ProductCard component
    - _Requirements: 8.1_

  - [ ] 10.3 Create product detail screen
    - Implement ProductDetailScreen with image gallery (react-native-image-viewing)
    - Add variant selector for size and color
    - Add quantity selector
    - Add "Add to Cart" button
    - _Requirements: 8.2_

  - [ ] 10.4 Create search screen with debouncing
    - Implement SearchScreen with search input
    - Add debounced search with lodash.debounce or custom hook
    - Display search results in FlatList
    - _Requirements: 8.6_

  - [ ]* 10.5 Write property test for search debouncing
    - **Property 20: Search Debouncing**
    - **Validates: Requirements 8.6**

  - [ ] 10.6 Create category browsing screens
    - Implement CategoryListScreen with category cards
    - Implement SubCategoryScreen with nested navigation
    - _Requirements: 8.5_


- [ ] 11. Build cart feature module
  - [ ] 11.1 Create cart service
    - Implement CartService with addToCart, updateCartItem, removeFromCart, getCart, applyCoupon methods
    - Define CartItem, Coupon TypeScript interfaces
    - _Requirements: 8.3_

  - [ ] 11.2 Create cart screen
    - Implement CartScreen with cart items list
    - Add CartItem component with quantity adjustment controls
    - Add CartSummary component showing subtotal, discount, total
    - Add "Proceed to Checkout" button
    - _Requirements: 8.3_

  - [ ]* 11.3 Write property test for cart quantity updates
    - **Property 19: Cart Quantity Update Totals**
    - **Validates: Requirements 8.3**

  - [ ] 11.4 Implement cart synchronization logic
    - Create useCartSync hook that merges local and backend cart on login
    - Implement cart sync in auth slice login success handler
    - _Requirements: 8.7, 8.8_

  - [ ]* 11.5 Write property test for cart login synchronization
    - **Property 21: Cart Login Synchronization**
    - **Validates: Requirements 8.7, 8.8**

  - [ ] 11.6 Create apply coupon screen
    - Implement ApplyCouponScreen with coupon input
    - Add coupon validation and application
    - Update cart totals with discount
    - _Requirements: 8.3_

- [ ] 12. Build checkout feature module
  - [ ] 12.1 Create checkout service and state
    - Implement CheckoutService with createOrder, getAddresses, addAddress, updateAddress, deleteAddress methods
    - Create checkoutSlice with order state
    - Define Order, OrderItem, Address, PaymentMethod TypeScript interfaces
    - _Requirements: 8.4, 9.4_

  - [ ] 12.2 Create address selection screen
    - Implement AddressSelectionScreen with address list
    - Add AddressCard component
    - Add "Add New Address" button
    - _Requirements: 8.4_

  - [ ] 12.3 Create address form modal
    - Implement AddressFormModal with all address fields
    - Add form validation
    - Support add and edit modes
    - _Requirements: 9.4_

  - [ ]* 12.4 Write property test for address CRUD
    - **Property 23: Address CRUD Round Trip**
    - **Validates: Requirements 9.4**

  - [ ] 12.5 Create payment method screen
    - Implement PaymentMethodScreen with payment options (card, UPI, net banking, COD)
    - Add PaymentMethodCard component
    - _Requirements: 8.4_

  - [ ] 12.6 Create order confirmation screen
    - Implement OrderConfirmationScreen with order summary
    - Add order tracking information
    - Add "View Order Details" button
    - _Requirements: 8.4_

- [ ] 13. Checkpoint - Verify shopping flow
  - Ensure all tests pass, ask the user if questions arise.


- [ ] 14. Build profile feature module
  - [ ] 14.1 Create profile service and state
    - Implement ProfileService with getProfile, updateProfile, getOrders, getOrderDetails methods
    - Create profileSlice with user profile state
    - _Requirements: 9.1_

  - [ ] 14.2 Create profile screen
    - Implement ProfileScreen with user information display
    - Add navigation to Orders, Addresses, Wishlist, Reviews, Settings
    - Add logout button
    - _Requirements: 9.1_

  - [ ] 14.3 Create orders screen
    - Implement OrdersScreen with order list
    - Add OrderCard component with status indicator
    - _Requirements: 9.2_

  - [ ]* 14.4 Write property test for order status display
    - **Property 22: Order Status Display**
    - **Validates: Requirements 9.2**

  - [ ] 14.5 Create order details screen
    - Implement OrderDetailScreen with item breakdown
    - Add tracking information display
    - Add "Download Invoice" button using react-native-pdf or similar
    - _Requirements: 9.3_

  - [ ] 14.6 Create addresses management screen
    - Implement AddressesScreen with address list
    - Add edit and delete functionality
    - Reuse AddressFormModal from checkout
    - _Requirements: 9.4_

  - [ ] 14.7 Create wishlist feature
    - Implement WishlistScreen with product list
    - Add add/remove wishlist functionality
    - Create wishlist service and slice
    - _Requirements: 9.5_

  - [ ]* 14.8 Write property test for wishlist operations
    - **Property 24: Wishlist Add-Remove Idempotence**
    - **Validates: Requirements 9.5**

  - [ ] 14.9 Create reviews feature
    - Implement ReviewsScreen with user's reviews
    - Create ReviewFormModal for submitting reviews
    - Implement ReviewService with getReviews, submitReview methods
    - _Requirements: 9.6_

  - [ ]* 14.10 Write property test for review submission
    - **Property 25: Review Submission Persistence**
    - **Validates: Requirements 9.6**

- [ ] 15. Implement offline support and data caching
  - [ ] 15.1 Set up AsyncStorage caching layer
    - Install @react-native-async-storage/async-storage or react-native-mmkv
    - Create CacheService with get, set, remove, clear methods
    - Implement cache expiration logic
    - _Requirements: 13.1_

  - [ ]* 15.2 Write property test for data cache round trip
    - **Property 29: Data Cache Round Trip**
    - **Validates: Requirements 13.1**

  - [ ] 15.3 Implement network status monitoring
    - Install @react-native-community/netinfo
    - Create useNetworkStatus hook
    - Add offline indicator to UI
    - _Requirements: 13.2, 13.5_

  - [ ]* 15.4 Write property test for offline data display
    - **Property 30: Offline Data Display with Indicator**
    - **Validates: Requirements 13.2**

  - [ ] 15.5 Implement request queue for offline actions
    - Create RequestQueue service for failed requests
    - Implement retry logic on network reconnection
    - Sync cart changes when reconnecting
    - _Requirements: 13.3, 13.4_

  - [ ]* 15.6 Write property test for reconnection cart sync
    - **Property 31: Reconnection Cart Sync**
    - **Validates: Requirements 13.3**

  - [ ]* 15.7 Write property test for failed request retry
    - **Property 32: Failed Request Retry Queue**
    - **Validates: Requirements 13.4**

  - [ ]* 15.8 Write property test for offline action feedback
    - **Property 33: Offline Action Feedback**
    - **Validates: Requirements 13.6**


- [ ] 16. Implement push notifications and deep linking
  - [ ] 16.1 Set up Firebase Cloud Messaging
    - Install @react-native-firebase/app and @react-native-firebase/messaging
    - Configure Firebase for iOS and Android
    - Add Firebase config to ClientConfig
    - _Requirements: 14.1_

  - [ ] 16.2 Implement notification handling
    - Create NotificationService with display and handling logic
    - Request notification permissions on first launch
    - Handle foreground, background, and quit state notifications
    - _Requirements: 14.2, 14.6_

  - [ ]* 16.3 Write property test for notification display
    - **Property 34: Notification Display**
    - **Validates: Requirements 14.2**

  - [ ] 16.4 Implement notification tap navigation
    - Parse notification data for deep links
    - Navigate to appropriate screen on notification tap
    - _Requirements: 14.3_

  - [ ]* 16.5 Write property test for notification tap navigation
    - **Property 35: Notification Tap Navigation**
    - **Validates: Requirements 14.3**

  - [ ]* 16.6 Write property test for deep link multi-state handling
    - **Property 36: Deep Link Multi-State Handling**
    - **Validates: Requirements 14.5**

- [ ] 17. Implement analytics and monitoring
  - [ ] 17.1 Set up Firebase Analytics
    - Install @react-native-firebase/analytics
    - Create AnalyticsService with logEvent, logScreenView methods
    - _Requirements: 15.1_

  - [ ] 17.2 Add analytics tracking throughout app
    - Track product views, add to cart, purchases, screen views
    - Add analytics calls to key user actions
    - _Requirements: 15.2_

  - [ ]* 17.3 Write property test for analytics event logging
    - **Property 37: Analytics Event Logging**
    - **Validates: Requirements 15.2**

  - [ ] 17.4 Set up crash reporting
    - Install @react-native-firebase/crashlytics or @sentry/react-native
    - Configure crash reporting with Sentry DSN from ClientConfig
    - Implement global error boundary
    - _Requirements: 15.3_

  - [ ] 17.5 Implement error logging with context
    - Create ErrorLogger service
    - Add contextual information (user ID, screen, action) to error logs
    - _Requirements: 15.4_

  - [ ]* 17.6 Write property test for error context logging
    - **Property 38: Error Context Logging**
    - **Validates: Requirements 15.4**

- [ ] 18. Checkpoint - Verify advanced features
  - Ensure all tests pass, ask the user if questions arise.


- [ ] 19. Implement performance optimizations
  - [ ] 19.1 Set up image optimization
    - Install react-native-fast-image
    - Replace Image components with FastImage
    - Configure image caching
    - _Requirements: 12.2_

  - [ ]* 19.2 Write property test for image cache reuse
    - **Property 28: Image Cache Reuse**
    - **Validates: Requirements 12.2**

  - [ ] 19.3 Optimize FlatList components
    - Add getItemLayout, keyExtractor, removeClippedSubviews props
    - Implement React.memo for list item components
    - Add windowSize optimization
    - _Requirements: 12.3_

  - [ ] 19.4 Implement code splitting and lazy loading
    - Use React.lazy and Suspense for screen components
    - Add loading indicators for lazy-loaded screens
    - _Requirements: 12.1_

- [ ] 20. Build multi-client build pipeline
  - [ ] 20.1 Create client switching script
    - Write scripts/switch-client.js to switch between client configs
    - Update package.json with npm scripts for each client
    - _Requirements: 10.1_

  - [ ] 20.2 Create asset generation script
    - Write scripts/generate-assets.js to copy client-specific assets
    - Update app icons, splash screens based on ClientConfig
    - Update app name and bundle ID in native configs
    - _Requirements: 10.2_

  - [ ]* 20.3 Write property test for build metadata injection
    - **Property 26: Build Metadata Injection**
    - **Validates: Requirements 10.2**

  - [ ] 20.4 Set up environment variable injection
    - Create .env files for each environment (development, staging, production)
    - Install react-native-config or react-native-dotenv
    - Configure environment-specific API keys and secrets
    - _Requirements: 10.5_

  - [ ]* 20.5 Write property test for environment variable injection
    - **Property 27: Environment Variable Injection**
    - **Validates: Requirements 10.5**

  - [ ] 20.6 Configure Fastlane for automated deployment
    - Install Fastlane
    - Create Fastfile with lanes for iOS and Android builds
    - Configure code signing for iOS
    - Configure Play Store and App Store credentials
    - _Requirements: 10.3, 10.4_

  - [ ] 20.7 Set up crash reporting and sourcemaps
    - Configure sourcemap generation in build scripts
    - Upload sourcemaps to Sentry or Firebase Crashlytics
    - _Requirements: 10.6_

- [ ] 21. Set up testing infrastructure
  - [ ] 21.1 Configure Jest and React Native Testing Library
    - Set up Jest configuration for React Native
    - Install @testing-library/react-native
    - Create test utilities and custom matchers
    - _Requirements: 11.1, 11.2_

  - [ ] 21.2 Configure fast-check for property-based testing
    - Install fast-check
    - Create property test utilities and generators
    - Set up test organization structure (__tests__/unit, __tests__/property)
    - _Requirements: Testing Strategy_

  - [ ] 21.3 Configure Detox for E2E testing
    - Install Detox
    - Configure Detox for iOS and Android
    - Create E2E test utilities
    - Write E2E tests for critical flows (login, browse, add to cart, checkout)
    - _Requirements: 11.3_

  - [ ] 21.4 Set up CI/CD pipeline
    - Create GitHub Actions or similar CI/CD workflow
    - Configure automated test runs on PR
    - Add code coverage reporting
    - _Requirements: 11.6_


- [ ] 22. Create home screen and additional features
  - [ ] 22.1 Create home screen
    - Implement HomeScreen with banner slider (react-native-swiper)
    - Add category slider
    - Add best sellers section
    - Add new arrivals section
    - Add promotional banners
    - _Requirements: 8.1_

  - [ ] 22.2 Implement additional UI features
    - Add bottom sheet modals using @gorhom/bottom-sheet
    - Add toast notifications using react-native-toast-message
    - Add loading overlays and skeletons
    - _Requirements: 6.4_

  - [ ] 22.3 Add app-wide error boundary
    - Create ErrorBoundary component
    - Add error fallback UI
    - Integrate with crash reporting
    - _Requirements: Error Handling_

- [ ] 23. Polish and final integration
  - [ ] 23.1 Add splash screen
    - Install react-native-splash-screen
    - Configure splash screen for iOS and Android
    - Hide splash screen after app initialization
    - _Requirements: 2.1_

  - [ ] 23.2 Configure app icons and branding
    - Generate app icons for all sizes (iOS and Android)
    - Update launch screens with client branding
    - _Requirements: 2.1_

  - [ ] 23.3 Add accessibility features
    - Add accessibility labels to interactive elements
    - Test with screen readers (TalkBack, VoiceOver)
    - Ensure proper focus management
    - _Requirements: Best Practices_

  - [ ] 23.4 Optimize bundle size
    - Enable Hermes engine
    - Enable ProGuard for Android
    - Analyze bundle size and remove unused dependencies
    - _Requirements: 12.5_

  - [ ] 23.5 Add app documentation
    - Create README with setup instructions
    - Document client configuration process
    - Document build and deployment process
    - Add architecture documentation
    - _Requirements: Best Practices_

- [ ] 24. Final checkpoint - Complete testing and deployment
  - Run full test suite (unit, property, E2E)
  - Test on physical iOS and Android devices
  - Verify all client configurations work correctly
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties
- Unit tests validate specific examples and edge cases
- The project will be created in a separate directory from the existing React web app
- All TypeScript interfaces should be strictly typed for type safety
- Follow React Native best practices for performance and user experience
