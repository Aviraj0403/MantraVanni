import React, { Suspense } from "react";
import { Outlet } from "react-router-dom";

import Header from "./components/Header/header.jsx";
import Footer from "./components/Footer/footer.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx";
import ProgressBar from "./components/progressbar/ProgressBar.jsx";
import { useWindowContext } from "./context/windowContext.jsx";
import StoreBotWidget from "./components/bots/StoreBotWidget.jsx";
import SpiritualLoader from "./components/SpiritualLoader.jsx";
import MarketingProvider from "./marketing/MarketingProvider.jsx";
import GrowthSlot from "./growth/GrowthSlot.jsx";

const Layout = () => {
  const { divRef, progressWidth } = useWindowContext();

  return (
    <div className="flex flex-col min-h-screen bg-brand-bg">
      <GrowthSlot name="layout.top" />
      {/* Header Component */}
      <Header />

      {/* Main content area */}
      <div ref={divRef} className="flex-1 overflow-auto bg-brand-bg">
        {/* Progress Bar (conditionally displayed based on the loading state or some condition) */}
        <ProgressBar progressWidth={progressWidth} />

        {/* Scroll to top functionality for route changes */}
        <ScrollToTop />

        {/* Render the nested routes here */}
      <main className="w-full">

          <Suspense fallback={<SpiritualLoader />}>
            <Outlet />
          </Suspense>
        </main>
      </div>

      <GrowthSlot name="layout.beforeFooter" />
      {/* Footer Component */}
      <Footer />

      {/* JD Bot store support widget (renders only if enabled for this tenant) */}
      <StoreBotWidget />

      {/* Meta Pixel + consent banner (renders nothing unless marketing is enabled for this tenant) */}
      <MarketingProvider />
    </div>
  );
};

export default Layout;
