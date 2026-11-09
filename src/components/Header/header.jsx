import React from "react";
import DesktopHeader from "./DesktopHeader"; // your current header
import MobileHeader from "./MobileHeader";   // new mobile version

export default function Header() {
  return (
    <>
      {/* Desktop View */}
      <div className="hidden md:block">
        <DesktopHeader />
      </div>

      {/* Mobile View */}
      <div className="block md:hidden">
        <MobileHeader />
      </div>
    </>
  );
}
