import React, { Suspense, lazy } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import Layout from "./Layout.jsx";
import SpiritualLoader from "./components/SpiritualLoader.jsx";
import Home from "./pages/home/home.jsx";
import NotFoundPage from "./pages/PNF/NotFoundPage.jsx";
import RequireAuth from "./components/RequireAuth.jsx";

// Route-level code splitting: everything except the layout, home and 404 is loaded on demand.
const ProfilePage = lazy(() => import("./profile/ProfilePage"));
const OrderDetails = lazy(() => import("./profile/OrderDetails"));
const TrackOrder = lazy(() => import("./pages/TrackOrder.jsx"));
const CartPage = lazy(() => import("./cart/CartPage.jsx"));
const CheckoutPage = lazy(() => import("./checkout/CheckoutPage.jsx"));
const AuthPage = lazy(() => import("./authentication/AuthPage.jsx"));
const ProductDetails = lazy(() => import("./components/Product/ProductDetails.jsx"));
const CategoryDetails = lazy(() => import("./pages/category/CategoryDetails.jsx"));
const SignInPage = lazy(() => import("./pages/auth/SignInPage.jsx"));
const SignupPage = lazy(() => import("./pages/auth/SignupPage.jsx"));
const CategorySubCategoryDetails = lazy(() => import("./pages/category/CategorySubCategoryDetails.jsx"));
const AboutUs = lazy(() => import("./pages/details/AboutUs.jsx"));
const ContactUs = lazy(() => import("./pages/details/ContactUs.jsx"));
const ReturnExchange = lazy(() => import("./pages/details/ReturnExchange.jsx"));
const ShippingInfo = lazy(() => import("./pages/details/ShippingInfo.jsx"));
const FAQPage = lazy(() => import("./pages/details/FAQPage.jsx"));
const PrivacyPolicy = lazy(() => import("./pages/legal/PrivacyPolicy.jsx"));
const TermsAndConditions = lazy(() => import("./pages/legal/TermsAndConditions.jsx"));
const CancellationRefundPolicy = lazy(() => import("./pages/legal/CancellationRefundPolicy.jsx"));
const ShippingPolicy = lazy(() => import("./pages/legal/ShippingPolicy.jsx"));
const Invoice = lazy(() => import("./profile/Invoice.jsx"));
const Invoice1 = lazy(() => import("./checkout/Invoice1.jsx"));
const NewProducts = lazy(() => import("./pages/newProduct/NewProducts.jsx"));
const MobileSearchPage = lazy(() => import("./components/Header/MobileSearchPage.jsx"));
const WishlistPage = lazy(() => import("./pages/WishlistPage.jsx"));
const WalletPage = lazy(() => import("./pages/WalletPage.jsx"));
const StoreUnavailable = lazy(() => import("./pages/StoreUnavailable.jsx"));
const CombosPage = lazy(() => import("./pages/CombosPage.jsx"));
const GrowthRoute = lazy(() => import("./growth/GrowthRoute.jsx"));
const CodConfirm = lazy(() => import("./pages/CodConfirm.jsx"));

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "/signin", element: <SignInPage /> },
      { path: "/signup", element: <SignupPage /> },
      { path: "/profile", element: <ProfilePage /> },
      { path: "/wallet", element: <WalletPage /> },
      { path: "/wishlist", element: <WishlistPage /> },
      { path: "/order/:orderId", element: (<RequireAuth><OrderDetails /></RequireAuth>) },
      { path: "/track-order", element: <TrackOrder /> },

      { path: "/cart", element: <CartPage /> },
      // CheckoutPage guards itself: guests get the inline phone-OTP panel (Fast checkout) or are sent to /signin exactly like RequireAuth did.
      { path: "/checkout", element: <CheckoutPage /> },
      { path: "/combos", element: <CombosPage /> },
      // Pages owned by growth add-ons (404 unless the add-on is ON for the store). Placed before the dynamic category routes.
      { path: "/blog", element: <GrowthRoute module="seoCms" view="blog" /> },
      { path: "/blog/:slug", element: <GrowthRoute module="seoCms" view="post" /> },
      { path: "/page/:slug", element: <GrowthRoute module="seoCms" view="page" /> },
      { path: "/book", element: <GrowthRoute module="serviceBooking" view="list" /> },
      { path: "/book/:serviceId", element: <GrowthRoute module="serviceBooking" view="book" /> },
      { path: "/affiliate", element: <GrowthRoute module="affiliates" view="dashboard" /> },
      { path: "/downloads", element: <GrowthRoute module="digitalProducts" view="downloads" /> },
      { path: "/wholesale", element: <GrowthRoute module="b2bWholesale" view="apply" /> },
      { path: "/product/:slug", element: <ProductDetails /> },
      { path: "/about-us", element: <AboutUs /> },
      { path: "/contact-us", element: <ContactUs /> },
      { path: "/return-exchange-policy", element: <ReturnExchange /> },
      // Old (misspelled) URL kept so existing links and bookmarks keep working.
      { path: "/retun-exchnage-policy", element: <Navigate to="/return-exchange-policy" replace /> },
      { path: "/shipping-info", element: <ShippingInfo /> },
      { path: "/shipping-policy", element: <ShippingPolicy /> },
      { path: "/privacy-policy", element: <PrivacyPolicy /> },
      { path: "/terms-and-conditions", element: <TermsAndConditions /> },
      { path: "/cancellation-refund-policy", element: <CancellationRefundPolicy /> },
      { path: "/faq", element: <FAQPage /> },
      { path: "/invoice/:orderId", element: (<RequireAuth><Invoice1 /></RequireAuth>) },
      { path: "/profile/invoice/:orderId", element: (<RequireAuth><Invoice /></RequireAuth>) },
      { path: "/new-products", element: <NewProducts /> },
      { path: "/search", element: <MobileSearchPage /> },
      { path: "/auth", element: <AuthPage /> },
      { path: "/cod-confirm/:token", element: <CodConfirm /> },
      // Dynamic category routes come last. An unknown slug renders the 404 page (see CategoryDetails).
      { path: "/:categorySlug", element: <CategoryDetails /> },
      { path: "/:categorySlug/:subCategorySlug", element: <CategorySubCategoryDetails /> },
    ],
  },
  {
    // Outside <Layout> so no store API calls run while the store is suspended.
    path: "/store-unavailable",
    element: (
      <Suspense fallback={<SpiritualLoader />}>
        <StoreUnavailable />
      </Suspense>
    ),
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);

export default router;
