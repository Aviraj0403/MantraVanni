import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Smartphone, Info, Truck, ShoppingCart, User, LogOut, ChevronDown, Heart, Wallet } from "lucide-react";
import { FaPhone, FaMapMarkerAlt } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import { getMenuCategories } from "../../services/categoryApi";
import { useAuth } from "../../context/AuthContext";
import { useSelector } from "react-redux";
import { HiOutlinePhone } from "react-icons/hi";
import { getLocalWishlist } from "../../utils/wishlistHelper";

export default function DesktopHeader() {
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState(null);
  const [showTopBar, setShowTopBar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const { user, logout } = useAuth();
  const { items: cartItems } = useSelector((state) => state.cart);
  const totalQuantity = cartItems.reduce((total, item) => total + item.quantity, 0);

  const { data: menuItems, isLoading, isError, error } = useQuery({
    queryKey: ["categories"],
    queryFn: getMenuCategories,
  });

  const handleLogout = async () => {
    await logout();
    navigate("/signin");
  };

  const handleProfileClick = () => {
    if (user) navigate("/profile");
    else navigate("/signin?redirect=/profile");
  };

  // Sync wishlist count
  useEffect(() => {
    const updateCount = () => {
      setWishlistCount(getLocalWishlist().length);
    };
    updateCount();
    window.addEventListener('wishlistUpdated', updateCount);
    return () => window.removeEventListener('wishlistUpdated', updateCount);
  }, []);

  // ⭐ Hide/Show on Scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY) setShowTopBar(false);
      else setShowTopBar(true);

      setLastScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  if (isLoading) {
    return (
      <header className="w-full border-b border-primary-100">
        <div className="bg-gray-200 text-center py-4">Loading...</div>
      </header>
    );
  }

  if (isError) {
    return (
      <header className="w-full border-b border-primary-100">
        <div className="bg-red-100 text-center py-4">
          Failed to load categories. {error?.message}
        </div>
      </header>
    );
  }

  return (
    <header className="w-full z-[999]">
      {/* 🟣 TOP BAR */}
      <div
        className={`fixed top-0 left-0 w-full bg-gradient-to-r from-[#FFF9F0] via-[#F9EDBF] to-[#FFF9F0] border-b border-[#D4AF37]/30 text-brand-text text-sm flex justify-between items-center px-8 py-2.5 shadow-sm transition-transform duration-300 z-[999] ${
          showTopBar ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <span>
            शुभ आरम्भ • Welcome to <strong>MantraVanni</strong>
        </span>
        <div className="flex items-center gap-6 text-brand-text">
         <span className="flex items-center gap-2 text-brand-text">
  <HiOutlinePhone className="text-primary-500 text-lg" />
  +91 8510879296
</span>
          <span className="flex items-center gap-2">
            <FaMapMarkerAlt className="text-primary-700" /> Sacred essentials, lovingly packed from Delhi
          </span>
        </div>
      </div>

      {/* 🔴 SEARCH + SIGN IN */}
      <div
        className={`fixed left-0 w-full bg-primary-500 text-sm text-white flex justify-between items-center px-8 py-3 shadow-md z-[998] transition-all duration-300`}
        style={{ top: showTopBar ? "40px" : "0px" }}
      >
        {/* Premium Search */}
        <div className="flex justify-start w-full">
          <div
            onClick={() => navigate("/search")}
            className="relative w-1/3 cursor-pointer group"
          >
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary-400/40 to-fuchsia-400/40 blur-xl opacity-0 group-hover:opacity-100 transition-all"></div>

            <div className="bg-primary-100 border border-white rounded-full pl-10 pr-4 py-2 shadow-md text-brand-text font-medium hover:shadow-lg transition-all">
              Search puja samagri, idols and sacred gifts...
            </div>

            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="absolute left-3 top-2.5 text-brand-text"
              width="18"
              height="18"
              fill="none"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z"
              />
            </svg>
          </div>
        </div>

        {/* Right Side */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2 flex items-center gap-6 text-white font-medium">
          <Link to="/wishlist" className="flex items-center gap-1.5 text-sm font-semibold hover:text-red-200 transition relative">
            <Heart size={16} className="text-red-200 fill-red-200" />
            <span>WISHLIST</span>
            {wishlistCount > 0 && (
              <span className="bg-rose-600 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full shadow-sm">
                {wishlistCount}
              </span>
            )}
          </Link>


          <Link to="/wallet" className="flex items-center gap-1.5 text-sm font-semibold hover:text-emerald-200 transition bg-white/10 px-2.5 py-1 rounded-lg border border-white/20">
            <Wallet size={16} className="text-emerald-300" /> WALLET
          </Link>

          <Link to="/contact-us" className="flex items-center gap-1 hover:text-gray-200 transition">
            <Info size={15} /> SUPPORT
          </Link>

          <Link to="/profile" className="flex items-center gap-1 text-sm font-semibold hover:text-gray-200 transition">
            <Truck size={15} /> TRACK ORDER
          </Link>

          {user ? (
            <div className="flex items-center gap-2">
              <User size={16} className="cursor-pointer hover:text-primary-900" onClick={handleProfileClick} />
              <span className="font-semibold cursor-pointer" onClick={handleProfileClick}>
                {user.userName}
              </span>
              <LogOut size={16} className="cursor-pointer" onClick={handleLogout} />
            </div>
          ) : (
            <Link to="/signin" className="hover:text-gray-200">Sign In</Link>
          )}
        </div>
      </div>

      {/* 🔵 MENU NAVBAR */}
      <div
        className="fixed left-0 w-full flex justify-between items-center px-8 py-3 bg-white shadow-md z-[997] transition-all duration-300"
        style={{ top: showTopBar ? "100px" : "60px" }}
      >
       <Link to="/" className="flex items-center gap-3">
  <span className="grid place-items-center w-11 h-11 rounded-full bg-[#a94217] text-[#fff1da] text-2xl shadow-inner">ॐ</span>
  <span className="leading-none">
    <strong className="block text-2xl text-[#63251a] tracking-wide">MantraVanni</strong>
    <small className="text-[10px] uppercase tracking-[0.24em] text-[#c45c19]">Sacred living</small>
  </span>
</Link>

       <ul className="flex items-center gap-4 text-brand-text font-semibold whitespace-nowrap z-10">

  {/* ⭐ DYNAMIC MENU ITEMS FIRST */}
  {menuItems.map((item, index) => (
    <li
      key={index}
      className="relative group"
      onMouseEnter={() => setActiveMenu(index)}
      onMouseLeave={() => setActiveMenu(null)}
    >
      <Link
        to={`/${item.slug}`}
        className="flex items-center gap-1 relative py-1 
          after:content-[''] after:absolute after:left-0 after:bottom-0 
          after:w-0 after:h-[2px] after:bg-primary-500 after:transition-all after:duration-300
          group-hover:after:w-full hover:text-primary-600"
      >
        {item.name}
        {item.subcategories.length > 0 && <ChevronDown size={16} className="mt-0.5" />}
      </Link>

 {item.subcategories.length > 0 && activeMenu === index && (
  <div className="absolute top-9 left-0 z-50">
    <ul
      className="
        bg-white
        border border-primary-100
        shadow-xl
        rounded-lg
        w-64
        max-h-80
        overflow-y-auto
        py-2
        scrollbar-thin
        scrollbar-thumb-purple-300
        scrollbar-track-purple-50
      "
    >
      {item.subcategories.map((sub, subIndex) => (
        <Link
          key={subIndex}
          to={`/${item.slug}/${sub.slug}`}
          className="
            block
            px-5
            py-2.5
            text-sm
            text-brand-text
            hover:bg-primary-50
            hover:text-primary-600
            transition
            whitespace-nowrap
          "
        >
          {sub.name}
        </Link>
      ))}
    </ul>
  </div>
)}

    </li>
  ))}

  {/* ⭐ STATIC MENU ITEM 1 → NEW ARRIVALS */}
  {/* <li>
    <Link
      to="/new-products"
      className="hover:text-primary-600 transition"
    >
      New Arrivals
    </Link>
  </li> */}

  {/* ⭐ STATIC MENU ITEM 2 → CLOTHS */}
  <li>
    {/* <Link
      to="/cloths"
      className="hover:text-primary-600 transition"
    >
      Cloths
    </Link> */}
  </li>

</ul>


        {/* CART ICON */}
        <Link to="/cart" className="relative cursor-pointer hover:text-primary-600 transition">
          <ShoppingCart size={24} />
          {totalQuantity > 0 && (
            <span className="absolute -top-2 -right-2 text-xs bg-primary-600 text-white rounded-full px-2 py-0.5">
              {totalQuantity}
            </span>
          )}
        </Link>
      </div>

      {/* Spacer */}
      <div className="h-[170px]"></div>
    </header>
  );
}
