import React from "react";
import {
  FaInstagram,
  FaFacebookF,
  FaYoutube,
  FaCcVisa,
  FaCcMastercard,
} from "react-icons/fa";
import { SiRazorpay } from "react-icons/si";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import useCombosEnabled from "../../hooks/useCombosEnabled";
import { getPublicSettings } from "../../services/settingsApi";
import BrandMark from "../BrandMark";

const linkClass = "hover:text-white transition-colors";
const socialClass =
  "flex h-9 w-9 items-center justify-center rounded-full border border-white/45 text-white transition-colors hover:bg-secondary hover:text-brand-text";

export default function Footer() {
  const { data: storeSettings } = useQuery({
    queryKey: ["publicSettings"],
    queryFn: getPublicSettings,
    staleTime: 5 * 60 * 1000,
  });

  const combosOn = useCombosEnabled();
  const isWalletEnabled = storeSettings?.walletEnabled !== false && storeSettings?.modules?.wallet !== false;
  const isWishlistEnabled = storeSettings?.wishlistEnabled !== false && storeSettings?.modules?.wishlist !== false;

  return (
    <footer className="bg-accent text-white font-sans border-t-4 border-secondary">
      {/* Main Footer */}
      <div className="py-12 px-6 md:px-12 lg:px-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
        {/* Brand & Social */}
        <div className="lg:col-span-1">
          <BrandMark variant="light" size="md" />

          <p className="text-sm mt-6 mb-6 leading-relaxed text-white/85">
            Your trusted spiritual partner on the journey.
            Peace, prosperity and protection.
          </p>

          <div className="flex gap-3">
            <a
              href="https://www.facebook.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="MantraVanni on Facebook"
              className={socialClass}
            >
              <FaFacebookF size={15} />
            </a>
            <a
              href="https://www.instagram.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="MantraVanni on Instagram"
              className={socialClass}
            >
              <FaInstagram size={15} />
            </a>
            <a
              href="https://www.youtube.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="MantraVanni on YouTube"
              className={socialClass}
            >
              <FaYoutube size={15} />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-semibold text-[15px] text-white mb-5">Quick Links</h4>
          <ul className="space-y-2.5 text-sm">
            <li><Link to="/about-us" className={linkClass}>About Us</Link></li>
            <li><Link to="/contact-us" className={linkClass}>Contact Us</Link></li>
            <li><Link to="/track-order" className={linkClass}>Track Order</Link></li>
            <li><Link to="/shipping-info" className={linkClass}>Shipping Info</Link></li>
            <li><Link to="/retun-exchnage-policy" className={linkClass}>Returns & Exchange</Link></li>
            <li><Link to="/faq" className={linkClass}>FAQ</Link></li>
          </ul>
        </div>

        {/* Shop */}
        <div>
          <h4 className="font-semibold text-[15px] text-white mb-5">Shop</h4>
          <ul className="space-y-2.5 text-sm">
            <li><Link to="/new-products" className={linkClass}>New Arrivals</Link></li>
            <li><Link to="/#best-sellers" className={linkClass}>Best Sellers</Link></li>
            {combosOn && <li><Link to="/combos" className={linkClass}>Combos</Link></li>}
            <li><Link to="/new-products" className={linkClass}>Idols & Murtis</Link></li>
            <li><Link to="/new-products" className={linkClass}>Puja Essentials</Link></li>
            <li><Link to="/new-products" className={linkClass}>Festive Gifts</Link></li>
          </ul>
        </div>

        {/* My Account */}
        <div>
          <h4 className="font-semibold text-[15px] text-white mb-5">My Account</h4>
          <ul className="space-y-2.5 text-sm">
            <li><Link to="/profile" className={linkClass}>My Profile</Link></li>
            <li><Link to="/profile" className={linkClass}>Orders</Link></li>
            {isWishlistEnabled && (
              <li><Link to="/wishlist" className={linkClass}>Wishlist</Link></li>
            )}
            <li><Link to="/cart" className={linkClass}>Cart</Link></li>
          </ul>
        </div>

        {/* Contact Us */}
        <div>
          <h4 className="font-semibold text-[15px] text-white mb-5">Contact Us</h4>
          <ul className="space-y-4 text-sm">
            <li className="flex items-start gap-3">
              <MapPin className="text-white mt-0.5 shrink-0" size={16} />
              <span className="leading-snug">Rohini, Delhi<br />Serving devotees across India</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="text-white shrink-0" size={16} />
              <a href="tel:+918510879296" className={linkClass}>+91 8510879296</a>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="text-white shrink-0" size={16} />
              <a href="mailto:support@mantravanni.com" className={linkClass}>support@mantravanni.com</a>
            </li>
            <li className="flex items-center gap-3">
              <Clock className="text-white shrink-0" size={16} />
              <span>Mon - Sat: 10 AM - 7 PM</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/25 bg-brand-text py-4 px-6 md:px-12 lg:px-20 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
        <p className="text-center md:text-left text-white/80">
          © {new Date().getFullYear()} MantraVanni. All Rights Reserved.{" "}
          <span className="ml-2">
            Developed by{" "}
            <a
              href="https://www.jdinfotechsolutions.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-white"
            >
              JD Infotech Solutions
            </a>
          </span>
        </p>

        <div className="flex items-center gap-3 text-2xl">
          <div className="bg-brand-bg rounded px-1.5 py-0.5 flex items-center justify-center">
            <FaCcVisa className="text-[#1a1f71] text-xl" />
          </div>
          <div className="bg-brand-bg rounded px-1.5 py-0.5 flex items-center justify-center">
            <FaCcMastercard className="text-[#eb001b] text-xl" />
          </div>
          <div className="bg-brand-bg rounded px-1.5 py-0.5 flex items-center justify-center font-bold text-[#f26522] text-[10px] italic">
            UPI
          </div>
          <div className="bg-brand-bg rounded px-1.5 py-0.5 flex items-center justify-center">
            <SiRazorpay className="text-[#002e6e] text-[18px]" />
          </div>
        </div>
      </div>
    </footer>
  );
}
