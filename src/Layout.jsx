import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

import Header from "./components/Header/header.jsx";
import Footer from "./components/Footer/footer.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx";
import ProgressBar from "./components/progressbar/ProgressBar.jsx";
import { useWindowContext } from "./context/windowContext.jsx";

const Layout = () => {
  const { divRef, progressWidth } = useWindowContext();

  return (
    <div className="flex flex-col min-h-screen bg-white-100/100">
      {/* Toast container for notifications */}
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar={false} newestOnTop closeButton={true} />

      {/* Header Component */}
      <Header />

      {/* Main content area */}
      <div ref={divRef} className="flex-1 overflow-auto bg-white">
        {/* Progress Bar (conditionally displayed based on the loading state or some condition) */}
        <ProgressBar progressWidth={progressWidth} />

        {/* Scroll to top functionality for route changes */}
        <ScrollToTop />

        {/* Render the nested routes here */}
      <main className="w-full">

          <Outlet />
        </main>
      </div>

      {/* Footer Component */}
      <Footer />
    </div>
  );
};

export default Layout;
