import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowUpRight, ChevronDown, ChevronRight, CircleUserRound, Flower2, Heart, Home, LogOut, MessageCircle, PackageSearch, Search, ShoppingBag, Sparkles, Tag, Wallet, X } from "lucide-react";
import BrandMark from "../BrandMark";

const rowClass = "flex min-h-12 items-center gap-3 rounded-xl px-3 py-3 text-[15px] text-[#725a47] transition-colors hover:bg-[#eee5d7] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#a17a55]";

export default function MobileMenuDrawer({ open, onClose, onProfileClick, onLogout, user, categories, loading, error, combosOn, wishlistOn, walletOn }) {
  const drawerRef = useRef(null);
  const closeRef = useRef(null);
  const [expanded, setExpanded] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const name = user?.name || user?.userName || user?.displayName || "My account";

  useEffect(() => {
    if (!open) return;
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusFrame = requestAnimationFrame(() => closeRef.current?.focus({ preventScroll: true }));
    const onKeyDown = (event) => {
      if (event.key === "Escape") { event.preventDefault(); onClose(); return; }
      if (event.key !== "Tab") return;
      const elements = [...drawerRef.current.querySelectorAll('a[href], button:not([disabled]), [tabindex="0"]')].filter(element => element.getClientRects().length > 0);
      const first = elements[0];
      const last = elements[elements.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    };
    const desktop = window.matchMedia("(min-width: 768px)");
    const onViewportChange = () => { if (desktop.matches) onClose(); };
    document.addEventListener("keydown", onKeyDown);
    desktop.addEventListener("change", onViewportChange);
    return () => {
      cancelAnimationFrame(focusFrame);
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
      desktop.removeEventListener("change", onViewportChange);
      if (previousFocus instanceof HTMLElement && previousFocus.isConnected) previousFocus.focus({ preventScroll: true });
    };
  }, [open, onClose]);

  const closeMenu = () => { setExpanded(null); onClose(); };

  return (
    <>
      <button type="button" onClick={closeMenu} tabIndex={-1} aria-label="Close navigation overlay" aria-hidden={!open}
        className={`fixed inset-0 z-[100] bg-[#231d17]/55 backdrop-blur-[5px] transition-opacity duration-300 motion-reduce:transition-none ${open ? "opacity-100" : "pointer-events-none opacity-0"}`} />
      <aside id="mobile-navigation-drawer" ref={drawerRef} role="dialog" aria-modal={open ? true : undefined} aria-label="MantraVanni navigation" aria-hidden={!open} inert={!open ? true : undefined}
        onClick={(event) => { if (event.target.closest("a")) closeMenu(); }}
        className={`fixed inset-y-0 left-0 z-[110] flex h-dvh w-[92vw] max-w-[400px] flex-col overflow-hidden rounded-r-[28px] bg-[#faf6ed] shadow-[20px_0_80px_#21180e40] transition-[transform,opacity] duration-300 ease-out motion-reduce:transition-none [&_button:focus-visible]:outline-2 [&_button:focus-visible]:outline-offset-2 [&_button:focus-visible]:outline-[#a17a55] ${open ? "translate-x-0 opacity-100" : "pointer-events-none -translate-x-full opacity-0"}`}>
        <div className="shrink-0 border-b border-[#e6d9c6] px-5 pb-4 pt-[max(20px,env(safe-area-inset-top))]">
          <div className="flex items-center justify-between gap-3"><BrandMark size="sm" className="w-fit" /><button ref={closeRef} type="button" onClick={closeMenu} aria-label="Close menu" className="grid size-11 shrink-0 cursor-pointer place-items-center rounded-full border border-[#dfd0bb] bg-[#fffaf1] text-[#9c7551] transition-colors hover:bg-[#ecdfcc]"><X size={20} strokeWidth={1.6} /></button></div>
          <Link to="/search" className="mt-5 flex min-h-12 items-center gap-3 rounded-full border border-[#e4d7c4] bg-[#fffdf8] px-4 text-sm text-[#9b866d] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a17a55]"><Search size={18} strokeWidth={1.5} className="text-[#9b7c58]" aria-hidden="true" /><span className="flex-1">Find your everyday essentials</span><ArrowUpRight size={15} aria-hidden="true" /></Link>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-5 pt-5 [scrollbar-width:thin] [scrollbar-color:#d7c3a7_transparent]">
          <button type="button" onClick={onProfileClick} className="relative isolate flex w-full cursor-pointer items-center gap-3 overflow-hidden rounded-[20px] bg-[#354331] p-4 text-left text-[#f4f0df]">
            <Flower2 size={115} strokeWidth={0.6} className="pointer-events-none absolute -right-8 -top-5 -z-10 text-[#d2ddbd]/10" aria-hidden="true" />
            <span className="grid size-11 shrink-0 place-items-center rounded-full border border-[#c2cfa9]/25 bg-[#f4eedc]/10"><CircleUserRound size={24} strokeWidth={1.3} className="text-[#d8dfc4]" aria-hidden="true" /></span><span className="min-w-0 flex-1"><span className="block truncate font-serif text-xl">{user ? `Namaste, ${name.split(" ")[0]}` : "Namaste."}</span><span className="mt-1 block text-sm text-[#c2cdae]">{user ? "Your account & orders" : "Sign in or join us"}</span></span><ChevronRight size={18} className="shrink-0 text-[#d4dec1]" aria-hidden="true" />
          </button>

          <nav aria-label="Discover collections" className="mt-5 grid grid-cols-2 gap-2.5">
            <Link to="/new-products" className="flex min-h-[76px] flex-col justify-center gap-2 rounded-2xl border border-[#e1d0bc] bg-[#efe3d1] px-4 py-3 text-sm font-medium text-[#87613d] focus-visible:outline-2 focus-visible:outline-[#a17a55]"><Sparkles size={19} strokeWidth={1.4} aria-hidden="true" />New arrivals</Link>
            <Link to="/#best-sellers" className="flex min-h-[76px] flex-col justify-center gap-2 rounded-2xl border border-[#e3d8cb] bg-[#f2ebe1] px-4 py-3 text-sm font-medium text-[#8d6d51] focus-visible:outline-2 focus-visible:outline-[#a17a55]"><PackageSearch size={19} strokeWidth={1.4} aria-hidden="true" />Best sellers</Link>
            {combosOn && <Link to="/combos" className="col-span-2 flex min-h-12 items-center gap-3 rounded-xl border border-[#e2d9c8] bg-[#f7f1e6] px-4 py-3 text-sm text-[#927450]"><Tag size={17} strokeWidth={1.4} aria-hidden="true" /><span className="flex-1">Combos & bundles</span><ArrowUpRight size={15} aria-hidden="true" /></Link>}
          </nav>

          <nav className="mt-6" aria-label="Product categories">
            <div className="mb-3 flex items-center gap-3"><h2 className="shrink-0 font-sans text-xs font-medium uppercase tracking-[.15em] text-[#a48b6e]">Shop by category</h2><span className="h-px flex-1 bg-[#e6d9c6]" aria-hidden="true" /></div>
            <ul className="space-y-1">
              {loading && <li className="rounded-xl border border-[#e6d9c6] p-4 text-sm leading-6 text-[#9b866d]" role="status">Finding your collections…</li>}
              {error && <li className="rounded-xl bg-[#f1e4dc] p-4 text-sm leading-6 text-[#9a6451]">Categories couldn't load. <Link to="/new-products" className="underline underline-offset-4">Browse all products</Link></li>}
              {!loading && !error && categories.length === 0 && <li className="rounded-xl border border-[#e6d9c6] p-4 text-sm leading-6 text-[#9b866d]">Explore what's new in our collection.<Link to="/new-products" className="mt-2 block font-medium text-[#89633e] underline underline-offset-4">Shop all products</Link></li>}
              {categories.map((item, index) => {
                const key = item._id || item.slug || index;
                const hasChildren = item.subcategories?.length > 0;
                const isOpen = expanded === key;
                const active = location.pathname === `/${item.slug}` || location.pathname.startsWith(`/${item.slug}/`);
                return <li key={key} className={`overflow-hidden rounded-xl ${isOpen || active ? "bg-[#eee4d5]" : ""}`}>
                  <button type="button" aria-expanded={hasChildren ? isOpen : undefined} aria-controls={hasChildren ? `drawer-category-${index}` : undefined}
                    className={`flex min-h-[54px] w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[15px] font-medium transition-colors hover:bg-[#eee5d7] ${active ? "text-[#905c34]" : "text-[#715942]"}`}
                    onClick={() => { if (hasChildren) setExpanded(isOpen ? null : key); else { closeMenu(); navigate(`/${item.slug}`); } }}>
                    <span className="grid size-8 shrink-0 place-items-center rounded-lg border border-[#d8c3a8]/50 bg-[#fff9ed]/65 text-[#ae8c62]"><Flower2 size={18} strokeWidth={1.2} aria-hidden="true" /></span><span className="min-w-0 flex-1 break-words">{item.name}</span>{hasChildren ? <ChevronDown size={17} className={`shrink-0 text-[#ab8c66] transition-transform motion-reduce:transition-none ${isOpen ? "rotate-180" : ""}`} aria-hidden="true" /> : <ChevronRight size={16} className="shrink-0 text-[#ab8c66]" aria-hidden="true" />}
                  </button>
                  {isOpen && hasChildren && <ul id={`drawer-category-${index}`} className="mb-3 ml-7 mr-3 border-l border-[#d0b798] pl-4"><li><Link to={`/${item.slug}`} className="block rounded-md py-2.5 text-sm font-semibold leading-6 text-[#996d44]">View all {item.name}<ArrowUpRight size={14} className="ml-2 inline" aria-hidden="true" /></Link></li>{item.subcategories.map(sub=><li key={sub._id || sub.slug}><Link to={`/${item.slug}/${sub.slug}`} className="block rounded-md py-2.5 text-sm leading-6 text-[#8b7056] transition-colors hover:text-[#5c3b24]">{sub.name}</Link></li>)}</ul>}
                </li>;
              })}
            </ul>
          </nav>

          <nav aria-label="Your shortcuts" className="mt-6 border-t border-[#e6d9c6] pt-4">
            <Link to="/" className={rowClass} aria-current={location.pathname === "/" ? "page" : undefined}><Home size={18} strokeWidth={1.4} className="text-[#ab8a63]" aria-hidden="true" /><span className="flex-1">Home</span><ChevronRight size={15} className="text-[#baa082]" aria-hidden="true" /></Link>
            <Link to="/cart" className={rowClass}><ShoppingBag size={18} strokeWidth={1.4} className="text-[#ab8a63]" aria-hidden="true" /><span className="flex-1">Shopping bag</span><ChevronRight size={15} className="text-[#baa082]" aria-hidden="true" /></Link>
            {wishlistOn && <Link to="/wishlist" className={rowClass}><Heart size={18} strokeWidth={1.4} className="text-[#ab8a63]" aria-hidden="true" /><span className="flex-1">Your wishlist</span><ChevronRight size={15} className="text-[#baa082]" aria-hidden="true" /></Link>}
            {walletOn && <Link to="/wallet" className={rowClass}><Wallet size={18} strokeWidth={1.4} className="text-[#ab8a63]" aria-hidden="true" /><span className="flex-1">Your wallet</span><ChevronRight size={15} className="text-[#baa082]" aria-hidden="true" /></Link>}
            <Link to="/track-order" className={rowClass}><PackageSearch size={18} strokeWidth={1.4} className="text-[#ab8a63]" aria-hidden="true" /><span className="flex-1">Track an order</span><ChevronRight size={15} className="text-[#baa082]" aria-hidden="true" /></Link>
          </nav>
          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-3 border-t border-[#e6d9c6] pt-5 text-sm text-[#a1886d]"><Link to="/about-us" className="hover:text-[#745035]">Our story</Link><Link to="/faq" className="hover:text-[#745035]">FAQs</Link><Link to="/shipping-info" className="hover:text-[#745035]">Shipping</Link></div>
          {user && <button type="button" onClick={onLogout} className="mt-5 flex min-h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-[#e1c9bd] text-sm text-[#a4725e] transition-colors hover:bg-[#f0e2d8]"><LogOut size={17} aria-hidden="true" />Sign out</button>}
          <p className="mt-6 text-center font-serif text-sm italic text-[#ae967a]">Rooted in faith. Chosen with love.</p>
        </div>

        <Link to="/contact-us" className="flex shrink-0 items-center gap-3 border-t border-[#e1d3bf] bg-[#eee5d6] px-5 pb-[max(16px,env(safe-area-inset-bottom))] pt-4 text-sm text-[#806346]"><span className="grid size-9 shrink-0 place-items-center rounded-full border border-[#d8c3a8] bg-[#faf2e4]"><MessageCircle size={18} strokeWidth={1.4} aria-hidden="true" /></span><span className="flex-1"><span className="block font-medium">A little help?</span><span className="mt-0.5 block text-xs text-[#a28a6b]">Let's find your next step together.</span></span><ArrowUpRight size={18} aria-hidden="true" /></Link>
      </aside>
    </>
  );
}
