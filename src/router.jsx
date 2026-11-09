import React, { Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";
import Layout from "./Layout.jsx";
import Home from "./pages/home/home.jsx";
import NotFoundPage from "./pages/PNF/NotFoundPage.jsx";
import ProfilePage from "./profile/ProfilePage";
import OrderDetails from "./profile/OrderDetails";
import TrackOrder from "./pages/TrackOrder.jsx";
import OrderTrackingDemo from "./pages/OrderTrackingDemo.jsx";

import CartPage from "./cart/CartPage.jsx";
import CheckoutPage from "./checkout/CheckoutPage.jsx";
import AuthPage from "./authentication/AuthPage.jsx";
import NewProductsPage from "./pages/NewProductsPage.jsx";
import ProductDetails from "./components/Product/ProductDetails.jsx";
import CategoryDetails from "./pages/category/CategoryDetails.jsx";
import SignInPage from "./pages/auth/SignInPage.jsx";
import SignupPage from "./pages/auth/SignupPage.jsx";
import CategorySubCategoryDetails from "./pages/category/CategorySubCategoryDetails.jsx";
import AboutUs from "./pages/details/AboutUs.jsx";
import ContactUs from "./pages/details/ContactUs.jsx";
import ReturnExchange from "./pages/details/ReturnExchange.jsx";
import ShippingInfo from "./pages/details/ShippingInfo.jsx";
import FAQPage from "./pages/details/FAQPage.jsx";
import Invoice from "./profile/Invoice.jsx";
import Invoice1 from "./checkout/Invoice1.jsx";
import NewProducts from "./pages/newProduct/NewProducts.jsx";
import MobileSearchPage from "./components/Header/MobileSearchPage.jsx";
// import Login from "./authentication/Login.jsx";
// import Signup from "./authentication/Signup.jsx";
import RequireAuth from "./components/RequireAuth.jsx";

import WishlistPage from "./pages/WishlistPage.jsx";
import WalletPage from "./pages/WalletPage.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Suspense fallback={null}>
        <Layout />
      </Suspense>
    ),
    children: [
      { index: true, element: <Home /> },
      { path: "/signin", element: <SignInPage /> },
      { path: "/signup", element: <SignupPage /> },
      { path: "/profile", element: <ProfilePage /> },
      { path: "/wallet", element: <WalletPage /> },
      { path: "/wishlist", element: <WishlistPage /> },
      { path: "/order/:orderId", element: <OrderDetails /> },
      { path: "/track-order", element: <TrackOrder /> },
      { path: "/tracking-demo", element: <OrderTrackingDemo /> },

      { path: "/cart", element: <CartPage /> },
      // { path: "/checkout", element: <CheckoutPage /> },
       { path: "/checkout", element: (
          <RequireAuth>
            <CheckoutPage />
          </RequireAuth>
      ) },
      { path: "/new-product", element: <NewProductsPage /> },
      { path: "/product/:slug", element: <ProductDetails /> },
      { path: "/:categorySlug", element: <CategoryDetails /> },
      {
        path: "/:categorySlug/:subCategorySlug",
        element: <CategorySubCategoryDetails />,
      },
       { path: "/about-us", element: <AboutUs /> },
       {path : "/contact-us", element: <ContactUs />},
       {path : "/retun-exchnage-policy", element: <ReturnExchange />},
       { path : "/shipping-info", element: <ShippingInfo />},
       { path: "/faq", element: <FAQPage /> },
      //  <Route path="/invoice/:orderId" element={<Invoice />} />
       {path : "/invoice/:orderId", element: <Invoice1 />},
       {path : "/profile/invoice/:orderId", element: <Invoice />},
       {path:"/new-products", element:<NewProducts />},
       {path :"/search", element:<MobileSearchPage />},

      // {path: "/auth", element: < Login/>},
      { path: "/auth", element: < AuthPage /> },
    ],
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);

export default router;
