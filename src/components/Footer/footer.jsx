import React from "react";
import { FaCcVisa, FaCcMastercard } from "react-icons/fa";
import { SiRazorpay } from "react-icons/si";
import { ArrowUpRight, ArrowUp, Flower2, MapPin, Phone, Clock, Heart, UserRound, Package, Wallet, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import useCombosEnabled from "../../hooks/useCombosEnabled";
import { getPublicSettings } from "../../services/settingsApi";
import { getMenuCategories } from "../../services/categoryApi";
import useStoreProfile from "../../hooks/useStoreProfile";
import { FaInstagram, FaFacebookF, FaYoutube, FaWhatsapp } from "react-icons/fa";
import BrandMark from "../BrandMark";

const footerLinkClass = "inline-flex py-1 text-[13px] text-[#c5b5a1] transition-colors hover:text-[#f4dfba]";
const accountLinkClass = "inline-flex items-center gap-2 rounded-full border border-[#d7b88b]/20 px-3.5 py-2 text-[10px] text-[#cfbda5] transition-colors hover:border-[#d7b88b]/60 hover:bg-[#d7b88b]/5 hover:text-[#f4dfba]";

export default function Footer() {
  const { data: storeSettings } = useQuery({
    queryKey: ["publicSettings"],
    queryFn: getPublicSettings,
    staleTime: 5 * 60 * 1000,
  });
  const store = useStoreProfile();
  const { data: categories = [] } = useQuery({ queryKey: ["categories"], queryFn: getMenuCategories, staleTime: 10 * 60 * 1000 });
  const footerCategories = (Array.isArray(categories) ? categories : []).filter((c) => c?.slug).slice(0, 4);
  // Existing contact details act as fallback until the tenant settings provide them.
  const supportEmail = store.supportEmail || "support@mantravanni.com";
  const supportPhone = store.supportPhone || "+91 8510879296";
  const addressLine = store.address || "Rohini, Delhi";
  const socials = [
    { key: "instagram", href: store.social.instagram, label: "Instagram", Icon: FaInstagram },
    { key: "facebook", href: store.social.facebook, label: "Facebook", Icon: FaFacebookF },
    { key: "youtube", href: store.social.youtube, label: "YouTube", Icon: FaYoutube },
    { key: "whatsapp", href: store.social.whatsapp, label: "WhatsApp", Icon: FaWhatsapp },
  ].filter((s) => /^https?:[/][/]/.test(s.href || ""));
  const combosOn = useCombosEnabled();
  const isWalletEnabled = storeSettings?.walletEnabled !== false && storeSettings?.modules?.wallet !== false;
  const isWishlistEnabled = storeSettings?.wishlistEnabled !== false && storeSettings?.modules?.wishlist !== false;

  return (
    <footer className="overflow-hidden bg-[#2b211c] font-sans text-[#f3e6d1] [&_a:focus-visible]:outline-2 [&_a:focus-visible]:outline-offset-4 [&_a:focus-visible]:outline-[#c9a16c] [&_button:focus-visible]:outline-2 [&_button:focus-visible]:outline-offset-4 [&_button:focus-visible]:outline-[#c9a16c]">
      <div className="relative isolate overflow-hidden border-t border-[#e1cfb3] bg-[#eee1cb] px-6 py-10 sm:px-10 lg:px-16 lg:py-12">
        <Flower2 className="pointer-events-none absolute -right-12 -top-12 -z-10 size-72 rotate-12 text-[#b5966b]/15 sm:right-[30%]" strokeWidth={0.5} aria-hidden="true" />
        <div className="mx-auto flex max-w-[1440px] flex-col justify-between gap-7 md:flex-row md:items-center">
          <div><p className="mb-3 text-[9px] font-medium tracking-[.22em] text-[#936540] sm:text-[10px]">A LITTLE CLOSER TO THE SACRED</p><h2 className="font-serif text-[34px] font-normal leading-[1.1] tracking-[-.035em] text-[#4e3829] sm:text-[44px]">Good things begin<br /><em className="font-normal text-[#9b6140]">with a little devotion.</em></h2></div>
          <div className="md:pr-4"><Link to="/#categories" className="inline-flex items-center gap-8 rounded-full bg-[#5a3b2b] px-6 py-3.5 text-xs font-medium text-[#fff3df] transition-colors hover:bg-[#784e35]">Find your everyday essentials<ArrowUpRight size={17} aria-hidden="true" /></Link><p className="mt-3 text-[10px] text-[#94795d] md:text-center">For your home. For your rituals. For you.</p></div>
        </div>
      </div>

      <div className="mx-auto max-w-[1568px] px-6 sm:px-10 lg:px-16">
        <div className="grid grid-cols-2 gap-x-6 gap-y-9 py-10 lg:grid-cols-[1.3fr_.7fr_.8fr_1.1fr] lg:gap-12 lg:py-14">
          <div className="col-span-2 lg:col-span-1">
            <BrandMark variant="light" size="md" className="w-fit" />
            <p className="mb-5 mt-5 max-w-[280px] text-[13px] leading-7 text-[#b6a48f]">Thoughtful essentials for the moments that bring us back to ourselves. Rooted in tradition. Part of your everyday.</p>
            <Link to="/about-us" className="inline-flex items-center gap-3 border-b border-[#c5a47a]/35 pb-1.5 text-xs text-[#d8bc94] transition-colors hover:border-[#f5dfbc] hover:text-[#f5dfbc]">The story of MantraVanni<ArrowUpRight size={14} aria-hidden="true" /></Link>
          </div>

          <nav aria-label="Footer shopping links">
            <h3 className="mb-4 font-sans text-[10px] font-medium uppercase tracking-[.2em] text-[#e3c79f]">Discover</h3>
            <ul className="space-y-2">
              <li><Link to="/#categories" className={footerLinkClass}>All collections</Link></li>
              <li><Link to="/new-products" className={footerLinkClass}>New arrivals</Link></li>
              <li><Link to="/#best-sellers" className={footerLinkClass}>Best sellers</Link></li>
              {combosOn && <li><Link to="/combos" className={footerLinkClass}>Combos & bundles</Link></li>}
              {footerCategories.map((c) => (
                <li key={c.slug}><Link to={`/${c.slug}`} className={footerLinkClass}>{c.name}</Link></li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Footer customer care links">
            <h3 className="mb-4 font-sans text-[10px] font-medium uppercase tracking-[.2em] text-[#e3c79f]">Here to help</h3>
            <ul className="space-y-2">
              <li><Link to="/track-order" className={footerLinkClass}>Track your order</Link></li>
              <li><Link to="/shipping-info" className={footerLinkClass}>Shipping & delivery</Link></li>
              <li><Link to="/return-exchange-policy" className={footerLinkClass}>Returns & exchanges</Link></li>
              <li><Link to="/cancellation-refund-policy" className={footerLinkClass}>Cancellation & refunds</Link></li>
              <li><Link to="/shipping-policy" className={footerLinkClass}>Shipping policy</Link></li>
              <li><Link to="/privacy-policy" className={footerLinkClass}>Privacy policy</Link></li>
              <li><Link to="/terms-and-conditions" className={footerLinkClass}>Terms & conditions</Link></li>
              <li><Link to="/faq" className={footerLinkClass}>Common questions</Link></li>
              <li><Link to="/contact-us" className={footerLinkClass}>Contact us</Link></li>
            </ul>
          </nav>

          <div className="col-span-2 border-t border-[#d7b88b]/15 pt-7 lg:col-span-1 lg:border-t-0 lg:pt-0">
            <h3 className="mb-4 font-sans text-[10px] font-medium uppercase tracking-[.2em] text-[#e3c79f]">Let's stay connected</h3>
            <a href={`mailto:${supportEmail}`} className="group flex w-fit max-w-full items-center gap-2 border-b border-[#d7b88b]/30 pb-2 text-[14px] text-[#f0ddc0] transition-colors hover:text-white sm:text-base">{supportEmail}<ArrowUpRight size={15} className="shrink-0" aria-hidden="true" /></a>
            <div className="mt-5 space-y-3.5 text-xs leading-6 text-[#b6a48f]">
              <a href={`tel:${supportPhone.replace(/s+/g, "")}`} className="flex w-fit items-center gap-2.5 transition-colors hover:text-[#f4dfba]"><Phone size={14} className="shrink-0 text-[#b38d62]" aria-hidden="true" />{supportPhone}</a>
              <p className="flex items-start gap-2.5"><MapPin size={14} className="mt-1 shrink-0 text-[#b38d62]" aria-hidden="true" /><span>{addressLine}<br /><span className="text-[#8f7d69]">Serving devotees across India</span></span></p>
              <p className="flex items-center gap-2.5"><Clock size={14} className="shrink-0 text-[#b38d62]" aria-hidden="true" />Mon–Sat · 10 AM–7 PM</p>
            </div>
            {socials.length > 0 && (
              <ul className="mt-5 flex gap-3" aria-label="Social media">
                {socials.map(({ key, href, label, Icon }) => (
                  <li key={key}><a href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className="grid size-8 place-items-center rounded-full border border-[#d7b88b]/25 text-[#dfc6a1] transition-colors hover:text-[#f4dfba]"><Icon size={14} aria-hidden="true" /></a></li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="flex flex-col justify-between gap-5 border-y border-[#d7b88b]/15 py-5 md:flex-row md:items-center">
          <nav aria-label="Footer account links" className="flex flex-wrap gap-2">
            <Link to="/profile" className={accountLinkClass}><UserRound size={13} aria-hidden="true" />My account</Link>
            <Link to="/profile" className={accountLinkClass}><Package size={13} aria-hidden="true" />My orders</Link>
            {isWishlistEnabled && <Link to="/wishlist" className={accountLinkClass}><Heart size={13} aria-hidden="true" />Wishlist</Link>}
            {isWalletEnabled && <Link to="/wallet" className={accountLinkClass}><Wallet size={13} aria-hidden="true" />Wallet</Link>}
            <Link to="/cart" className={accountLinkClass}><ShoppingBag size={13} aria-hidden="true" />Shopping bag</Link>
          </nav>
          <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" })} className="flex w-fit shrink-0 cursor-pointer items-center gap-3 text-[10px] text-[#bda88d] transition-colors hover:text-[#f4dfba]">Back to top<span className="grid size-8 place-items-center rounded-full border border-[#d7b88b]/25"><ArrowUp size={13} aria-hidden="true" /></span></button>
        </div>

        <div className="pointer-events-none select-none overflow-hidden pb-2 pt-7 text-center sm:pt-9" aria-hidden="true"><span className="block font-serif text-[clamp(48px,12.8vw,184px)] font-normal leading-none tracking-[-.055em] text-[#e1c39a]/10">MantraVanni</span></div>

        <div className="flex flex-col items-start justify-between gap-5 border-t border-[#d7b88b]/10 py-6 text-[10px] text-[#9f8b73] md:flex-row md:items-center">
          <div><p>© {new Date().getFullYear()} {store.name}. All rights reserved.</p><p className="mt-1.5 text-[#7f6c59]">Developed by <a href="https://www.jdinfotechsolutions.in/" target="_blank" rel="noopener noreferrer" className="text-[#ad9477] transition-colors hover:text-[#f4dfba]">JD Infotech Solutions<ArrowUpRight className="ml-1 inline size-2.5" aria-hidden="true" /></a></p></div>
          <div className="flex flex-wrap items-center gap-2" aria-label="Payment methods">
            <span className="mr-2 text-[9px] text-[#9f8b73]">Ways to pay</span>
            <span className="grid h-7 w-10 place-items-center rounded border border-[#d7b88b]/20 bg-[#fff5e7]/5 text-[#dfc6a1]" aria-label="Visa"><FaCcVisa size={23} aria-hidden="true" /></span>
            <span className="grid h-7 w-10 place-items-center rounded border border-[#d7b88b]/20 bg-[#fff5e7]/5 text-[#dfc6a1]" aria-label="Mastercard"><FaCcMastercard size={23} aria-hidden="true" /></span>
            <span className="grid h-7 w-10 place-items-center rounded border border-[#d7b88b]/20 bg-[#fff5e7]/5 text-[10px] font-bold italic text-[#dfc6a1]">UPI</span>
            <span className="grid h-7 w-10 place-items-center rounded border border-[#d7b88b]/20 bg-[#fff5e7]/5 text-[#dfc6a1]" aria-label="Razorpay"><SiRazorpay size={15} aria-hidden="true" /></span>
          </div>
        </div>
      </div>
    </footer>
  );
}
