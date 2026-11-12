import React, { useCallback, useEffect, useState } from "react";
import { CircleUserRound, Grid2X2, Home, Menu, Search, ShoppingBasket, Store } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { getMenuCategories } from "../../services/categoryApi";
import { useAuth } from "../../context/AuthContext";
import useCombosEnabled from "../../hooks/useCombosEnabled";
import { getPublicSettings } from "../../services/settingsApi";
import BrandMark from "../BrandMark";
import MobileMenuDrawer from "./MobileMenuDrawer";

export default function MobileHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const closeMenu = useCallback(() => setIsMenuOpen(false), []);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { items: cartItems } = useSelector((state) => state.cart);

  const totalQuantity = cartItems.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  const { data: menuItems = [], isLoading, isError } = useQuery({
    queryKey: ["categories"],
    queryFn: getMenuCategories,
  });

  const { data: storeSettings } = useQuery({
    queryKey: ["publicSettings"],
    queryFn: getPublicSettings,
    staleTime: 5 * 60 * 1000,
  });

  const combosOn = useCombosEnabled();
  const isWalletEnabled = storeSettings?.walletEnabled !== false && storeSettings?.modules?.wallet !== false;
  const isWishlistEnabled = storeSettings?.wishlistEnabled !== false && storeSettings?.modules?.wishlist !== false;

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.key]);


  const handleLogout = async () => {
    await logout();
    setIsMenuOpen(false);
    navigate("/signin");
  };

  const handleProfileClick = () => {
    setIsMenuOpen(false);
    if (user) navigate("/profile");
    else navigate("/signin?redirect=/profile");
  };

  const isActive = (tab) => {
    const path = location.pathname;
    if (tab === "home") return path === "/";
    if (tab === "search") return path === "/search";
    if (tab === "shop") return path.startsWith("/new-product");
    if (tab === "account") return path.startsWith("/profile") || path.startsWith("/signin");
    return false;
  };

  const bottomItemClass = (active) =>
    `flex min-w-[52px] flex-col items-center justify-center gap-1 text-[10px] font-semibold transition ${
      active ? "text-primary-600" : "text-[#736b60]"
    }`;

  return (
    <div className="w-full bg-brand-bg md:hidden">
      <header className="fixed inset-x-0 top-0 z-[90] border-b border-secondary-200/70 bg-brand-bg/95 shadow-[0_5px_20px_rgba(139,30,30,0.09)] backdrop-blur-xl">
        <div className="grid h-[72px] grid-cols-[44px_1fr_auto] items-center gap-2 px-3">
          <button
            type="button"
            onClick={() => setIsMenuOpen(true)}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-navigation-drawer"
            aria-haspopup="dialog"
            className="grid h-10 w-10 place-items-center rounded-full border border-secondary-200 bg-secondary-50 text-[#2b211c] transition active:scale-95"
            aria-label="Open menu"
          >
            <Menu size={22} strokeWidth={1.8} />
          </button>

          <BrandMark size="sm" className="mx-auto min-w-0 justify-center gap-2" />

          <div className="flex items-center gap-1.5">
            <Link
              to="/cart"
              className="relative grid h-10 w-10 place-items-center rounded-full text-brand-text transition hover:bg-secondary-50 hover:text-[#2b211c] active:scale-95"
              aria-label="Open cart"
            >
              <ShoppingBasket size={24} strokeWidth={1.7} />
              {totalQuantity > 0 && (
                <span className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-primary-600 px-1 text-[9px] font-bold text-white ring-2 ring-white">
                  {totalQuantity > 99 ? "99+" : totalQuantity}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>

      <div className="h-[72px]" />

      <nav className="fixed inset-x-0 bottom-0 z-[80] border-t border-secondary-200/80 bg-brand-bg/95 px-2 pb-[max(8px,env(safe-area-inset-bottom))] pt-2 shadow-[0_-8px_24px_rgba(139,30,30,0.11)] backdrop-blur-xl">
        <div className="mx-auto grid max-w-md grid-cols-5 items-end">
          <Link to="/" className={bottomItemClass(isActive("home"))}>
            <Home size={21} strokeWidth={isActive("home") ? 2.3 : 1.8} />
            <span>Home</span>
          </Link>

          <button
            type="button"
            onClick={() => setIsMenuOpen(true)}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-navigation-drawer"
            aria-haspopup="dialog"
            className={bottomItemClass(isMenuOpen)}
          >
            <Grid2X2 size={21} strokeWidth={isMenuOpen ? 2.3 : 1.8} />
            <span>Menu</span>
          </button>

          <Link
            to="/search"
            className="group -mt-7 flex flex-col items-center gap-1 text-[10px] font-bold text-primary-600"
            aria-label="Search products"
          >
            <span
              className={`grid h-12 w-12 place-items-center rounded-full border-[3px] border-white shadow-[0_5px_16px_rgba(139,30,30,0.28)] transition active:scale-95 ${
                isActive("search") ? "bg-[#2b211c] text-white" : "bg-primary-500 text-white"
              }`}
            >
              <Search size={22} strokeWidth={2.1} />
            </span>
            <span>Search</span>
          </Link>

          <Link to="/new-products" className={bottomItemClass(isActive("shop"))}>
            <Store size={21} strokeWidth={isActive("shop") ? 2.3 : 1.8} />
            <span>Shop</span>
          </Link>

          <button
            type="button"
            onClick={handleProfileClick}
            className={bottomItemClass(isActive("account"))}
          >
            <CircleUserRound size={21} strokeWidth={isActive("account") ? 2.3 : 1.8} />
            <span>Account</span>
          </button>
        </div>
      </nav>

      <MobileMenuDrawer
        open={isMenuOpen}
        onClose={closeMenu}
        onProfileClick={handleProfileClick}
        onLogout={handleLogout}
        user={user}
        categories={menuItems}
        loading={isLoading}
        error={isError}
        combosOn={combosOn}
        wishlistOn={isWishlistEnabled}
        walletOn={isWalletEnabled}
      />
    </div>
  );
}
