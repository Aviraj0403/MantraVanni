import React, { useState, useEffect } from "react";
import useStoreModule from "../../hooks/useStoreModule";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  FaStar, FaRegStar, FaStarHalfAlt,
  FaHeart, FaRegHeart,
  FaTruck, FaShieldAlt, FaUndo,
  FaCheckCircle, FaShoppingCart, FaBolt,
  FaChevronRight, FaChevronDown, FaChevronUp,
  FaTag
} from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import { getProductBySlug } from "../../services/productApi";
import RelatedProduct from "../../pages/home/RelatedProduct";
import { useCartActions } from "../../hooks/useCartActions";
import ReviewTab from "../../pages/Review/ReviewTab";
import useCombosEnabled, { formatINR } from "../../hooks/useCombosEnabled";
import usePageMeta from "../../hooks/usePageMeta";
import { isOutOfStock, getStockQty } from "../../utils/stock";

/* ── color util ── */
const COLOR_MAP = {
  red:"#EF4444",blue:"#3B82F6",green:"#10B981",yellow:"#FBBF24",orange:"#F97316",
  purple:"#A855F7",pink:"#EC4899",black:"#1a1a1a",white:"#FFFFFF",gray:"#9CA3AF",
  grey:"#9CA3AF",brown:"#92400E",beige:"#F5F5DC",navy:"#1E3A8A",teal:"#14B8A6",
  indigo:"#6366F1",violet:"#8B5CF6",gold:"#EAB308",maroon:"#7F1D1D",coral:"#FB923C",
  peach:"#FFDAB9",lavender:"#E9D5FF",mint:"#A7F3D0",nude:"#E3BC9A",mustard:"#CA8A04",
  rust:"#B7410E",champagne:"#F7E7CE",cream:"#FFFDD0",charcoal:"#374151",
  olive:"#65A30D",burgundy:"#800020",crimson:"#DC143C",transparent:"transparent",
};
const toHex = (n) => COLOR_MAP[n?.toLowerCase().trim()] || null;

/* ── Stars ── */
function Stars({ v = 0, size = 13 }) {
  return (
    <span className="flex items-center gap-0.5">
      {[1,2,3,4,5].map(i => (
        i <= Math.floor(v)   ? <FaStar      key={i} size={size} className="text-amber-400" /> :
        i - 0.5 <= v        ? <FaStarHalfAlt key={i} size={size} className="text-amber-400" /> :
                              <FaRegStar    key={i} size={size} className="text-gray-300" />
      ))}
    </span>
  );
}

/* ── Collapsible section ── */
function Collapse({ title, open, onToggle, children }) {
  return (
    <div className="border-b border-primary-100 last:border-0">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-5 py-4 text-left group"
      >
        <span className="text-sm font-semibold text-brand-text group-hover:text-primary-600 transition-colors">{title}</span>
        {open ? <FaChevronUp size={13} className="text-primary-400" /> : <FaChevronDown size={13} className="text-primary-400" />}
      </button>
      {open && <div className="px-5 pb-5">{children}</div>}
    </div>
  );
}

/* ════════════════════════════════════════ MAIN ════════════════════════════════════════ */
export default function ProductDetails() {
  const { enabled: reviewsEnabled } = useStoreModule("reviews");
  const { slug }    = useParams();
  const navigate    = useNavigate();

  const [mainImg,     setMainImg]     = useState(null);
  const [variant,     setVariant]     = useState(null);
  const [color,       setColor]       = useState(null);
  const [qty]                         = useState(1);
  const [wished,      setWished]      = useState(false);
  const [section,     setSection]     = useState("desc");
  const [toastMsg,    setToastMsg]    = useState("");

  const { addToCart } = useCartActions();
  const combosOn = useCombosEnabled();

  const { data, isLoading, error } = useQuery({
    queryKey: ["product", slug],
    queryFn:  () => getProductBySlug(slug),
    enabled:  !!slug,
  });
  const product = data?.product;

  /* auto-hide toast */
  useEffect(() => {
    if (!toastMsg) return;
    const t = setTimeout(() => setToastMsg(""), 3000);
    return () => clearTimeout(t);
  }, [toastMsg]);

  /* SEO: title, description, og:image and Product JSON-LD */
  const seoImage = (variant?.images?.[0]) || product?.pimages?.[0];
  const seoPrice = variant?.price ?? product?.variants?.[0]?.price;
  const seoDescription = (product?.description || "").replace(/<[^>]+>/g, " ").replace(/s+/g, " ").trim().slice(0, 160);
  const seoInStock = product ? !isOutOfStock(product, variant || product?.variants?.[0]) : true;
  usePageMeta({
    title: product ? `${product.name} | MantraVanni` : undefined,
    description: product ? seoDescription || `Buy ${product.name} online at MantraVanni.` : undefined,
    canonical: product ? `/product/${slug}` : undefined,
    image: seoImage,
    jsonLd: product
      ? {
          "@context": "https://schema.org",
          "@type": "Product",
          name: product.name,
          image: product.pimages || undefined,
          description: seoDescription || undefined,
          sku: product.productCode || undefined,
          brand: { "@type": "Brand", name: "MantraVanni" },
          offers: {
            "@type": "Offer",
            priceCurrency: "INR",
            price: seoPrice != null ? String(seoPrice) : undefined,
            availability: seoInStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
            url: typeof window !== "undefined" ? window.location.href : undefined,
          },
        }
      : undefined,
  });

  /* init state on product load */
  useEffect(() => {
    if (product?.pimages?.length && product?.variants?.length) {
      setVariant(product.variants[0]);
      setColor(product.variants[0]?.color?.[0] ?? null);
      const initialImg = product.variants[0]?.images?.length ? product.variants[0].images[0] : product.pimages[0];
      setMainImg(initialImg);
    }
  }, [product]);

  const handleVariantChange = (v) => {
    setVariant(v);
    const firstColor = v.color?.[0] || null;
    setColor(firstColor);
    if (v.images?.length > 0) {
      setMainImg(v.images[0]);
    }
  };

  const handleColorChange = (c, variantObj = variant) => {
    setColor(c);
    // If variant has specific image gallery for this color/variant, switch to it
    if (variantObj?.images?.length > 0) {
      setMainImg(variantObj.images[0]);
    }
  };

  /* ── loading / error ── */
  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-primary-50/30">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-full border-4 border-primary-500 border-t-transparent animate-spin" />
        <p className="text-sm text-primary-400 font-medium tracking-wide">Loading product…</p>
      </div>
    </div>
  );
  if (error || !product) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <p className="text-gray-600 font-medium text-lg mb-4">Product not found</p>
        <button onClick={() => navigate("/")} className="text-primary-600 text-sm hover:underline">← Back to Home</button>
      </div>
    </div>
  );

  const { name, category, description, variants, pimages, rating, reviewCount, productCode, tags, additionalInfo, reviews } = product;

  const price = variant?.price    ?? 0;
  const mrp   = variant?.realPrice ?? 0;
  const disc  = mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;

  const comboItems = Array.isArray(product.comboItems) ? product.comboItems.filter((ci) => ci?.product) : [];
  const showCombo = combosOn && product.isCombo && comboItems.length > 0;
  const comboRegular = Number(product.comboRegularTotal) || 0;
  const comboSave = comboRegular > price ? comboRegular - price : 0;
  const comboSavePct = comboSave > 0 ? Math.round((comboSave / comboRegular) * 100) : 0;
  const outOfStockItems = comboItems.filter((ci) => ci.product.inStock === false);

  const soldOut = isOutOfStock(product, variant);
  const stockLeft = getStockQty(product, variant);

  const doAdd = async () => {
    if (soldOut) return;
    if (!variant || !color) return alert("Please select a size and shade.");
    const r = await addToCart(
      { _id: product._id, name, pimage: pimages[0], variants: { price, size: variant.size, color } },
      variant.size, color, qty
    );
    if (r.success) setToastMsg("Added to cart!");
    else alert("Could not add to cart.");
  };

  const doBuy = async () => {
    if (soldOut) return;
    if (!variant || !color) return alert("Please select a size and shade.");
    const r = await addToCart(
      { _id: product._id, name, pimage: pimages[0], variants: { price, size: variant.size, color } },
      variant.size, color, qty
    );
    if (r.success) navigate("/cart");
  };

  /* ═══════════════ RENDER ═══════════════ */
  return (
    <div className="min-h-screen bg-brand-bg">

      {/* ═══ Breadcrumb ═══ */}
      <div className="bg-brand-bg border-b border-secondary-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <nav className="flex items-center gap-2 text-[11px] font-semibold text-gray-500">
            <span className="hover:text-primary-600 cursor-pointer" onClick={() => navigate("/")}>Home</span>
            <span className="text-gray-300">/</span>
            <span className="hover:text-primary-600 cursor-pointer">{category?.name}</span>
            <span className="text-gray-300">/</span>
            <span className="text-brand-text truncate max-w-[150px] sm:max-w-none">{name}</span>
          </nav>
        </div>
      </div>

      {/* ═══ Main Grid ═══ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-16">

          {/* ══ LEFT — image panel & Trust Info ══ */}
          <div className="flex flex-col gap-8 lg:sticky lg:top-8 h-max">
            
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Thumbnails column */}
              <div className="flex sm:flex-col gap-2 overflow-x-auto sm:overflow-y-auto scrollbar-hide sm:w-20 sm:max-h-[500px] order-2 sm:order-1">
                {pimages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setMainImg(img)}
                    className={`shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-xl border-2 overflow-hidden p-1 transition-all duration-300 ${
                      mainImg === img
                        ? "border-primary-600 shadow-md shadow-primary-100 scale-105"
                        : "border-secondary-200 hover:border-primary-200 bg-secondary-50/60"
                    }`}
                  >
                    <img src={img} alt={`${name} - view ${i + 1}`} width="80" height="80" loading="lazy" decoding="async" className="w-full h-full object-contain" />
                  </button>
                ))}
              </div>

              {/* Main image */}
              <div className="relative flex-1 rounded-2xl border border-secondary-200 bg-brand-bg shadow-sm overflow-hidden flex items-center justify-center group order-1 sm:order-2" style={{ minHeight: 450 }}>
                {disc > 0 && (
                  <div className="absolute top-4 left-4 bg-primary-600 text-white text-[11px] font-bold px-3 py-1.5 rounded-full z-10 shadow-lg shadow-primary-200 uppercase tracking-widest">
                    {disc}% OFF
                  </div>
                )}
                <button
                  onClick={() => setWished(w => !w)}
                  className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-brand-bg/80 backdrop-blur-md shadow-md flex items-center justify-center border border-secondary-200 hover:border-primary-300 transition-all hover:scale-110"
                >
                  {wished
                    ? <FaHeart    size={18} className="text-accent" />
                    : <FaRegHeart size={18} className="text-gray-400" />}
                </button>
                <img
                  src={mainImg}
                  alt={name}
                  width="420"
                  height="420"
                  className="max-h-[420px] max-w-full object-contain p-6 transition-all duration-500 group-hover:scale-105"
                loading="lazy" decoding="async" />
              </div>
            </div>

            <div className="hidden lg:flex flex-col gap-10 bg-secondary-50/60 rounded-3xl p-8 border border-secondary-100">
              <div className="grid grid-cols-3 gap-6">
                {[
                  { Icon: FaTruck,    label: "Free Delivery",   sub: "Ships today"       },
                  { Icon: FaUndo,     label: "Easy Returns",    sub: "7 day policy"      },
                  { Icon: FaShieldAlt,label: "100% Genuine",    sub: "Quality assured"   },
                ].map(({ Icon, label, sub }) => (
                  <div key={label} className="flex flex-col items-center gap-3 group">
                    <div className="w-14 h-14 rounded-2xl bg-brand-bg shadow-sm border border-primary-100 flex items-center justify-center group-hover:bg-primary-600 group-hover:border-primary-600 transition-all duration-300">
                      <Icon size={24} className="text-primary-600 group-hover:text-white transition-colors" />
                    </div>
                    <div className="text-center">
                      <p className="text-[13px] font-bold text-brand-text tracking-tight">{label}</p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">{sub}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-6">
                <div className="h-px bg-gradient-to-r from-transparent via-secondary-200 to-transparent" />
                
                <div className="flex flex-wrap gap-2.5">
                  {tags?.map(t => (
                    <span key={t} className="text-[11px] bg-brand-bg text-primary-700 px-4 py-2 rounded-xl font-extrabold border border-primary-100 shadow-sm hover:bg-primary-600 hover:text-white hover:border-primary-600 transition-all cursor-default lowercase tracking-tight">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ══ RIGHT — details panel ══ */}
          <div className="flex flex-col gap-6">

            {/* Title + rating + SKU */}
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-primary-600/80">{category?.name}</p>
                {productCode && (
                  <span className="text-[10px] text-gray-400 font-bold uppercase">
                    SKU: {productCode}
                  </span>
                )}
              </div>
              {combosOn && product.isCombo && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-700 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white ring-1 ring-secondary/60">
                  <FaTag size={9} aria-hidden="true" /> Combo
                </span>
              )}
              <h1 className="font-serif text-xl sm:text-2xl lg:text-3xl font-bold text-brand-text leading-tight">{name}</h1>

              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2 bg-primary-50 border border-primary-100 px-3 py-1.5 rounded-full">
                  <Stars v={parseFloat(rating) || 4.5} size={12} />
                  <span className="text-sm font-bold text-primary-700">{parseFloat(rating || 4.5).toFixed(1)}</span>
                </div>
                <span className="text-sm text-gray-500">
                  {reviewCount || "1,248"} ratings &amp; {reviews?.length || "312"} reviews
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="flex flex-wrap items-baseline gap-3 pb-5 border-b border-primary-50">
              <span className="text-3xl font-extrabold text-brand-text">₹{price.toLocaleString("en-IN")}</span>
              {mrp > price && (
                <>
                  <span className="text-base text-gray-400 line-through">₹{mrp.toLocaleString("en-IN")}</span>
                  <span className="text-base font-bold text-emerald-600">{disc}% off</span>
                </>
              )}
              <span className="text-xs text-gray-400 w-full -mt-1">Inclusive of all taxes · Free delivery</span>
            </div>

            {/* Combo contents */}
            {showCombo && (
              <section aria-labelledby="combo-contents" className="rounded-2xl border border-primary-100 bg-secondary-50/50 p-4 sm:p-5">
                <h2 id="combo-contents" className="font-serif text-lg font-bold text-brand-text">What&apos;s in this combo</h2>
                <ul className="mt-3 divide-y divide-primary-100">
                  {comboItems.map((ci, i) => {
                    const p = ci.product;
                    const qtyN = Number(ci.quantity) || 1;
                    const img = Array.isArray(p.image) ? p.image[0] : p.image;
                    return (
                      <li key={p._id || i} className="flex items-center gap-3 py-2.5">
                        <Link to={`/product/${p.slug || p._id}`} className="h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-secondary-200 bg-brand-bg">
                          {img && <img src={img} alt={p.name} className="h-full w-full object-contain p-1" loading="lazy" decoding="async" />}
                        </Link>
                        <div className="min-w-0 flex-1">
                          <Link to={`/product/${p.slug || p._id}`} className="line-clamp-2 text-sm font-semibold text-brand-text hover:text-primary-600">
                            {p.name}
                          </Link>
                          <p className="mt-0.5 text-xs text-gray-500">
                            {(ci.variantSize || p.size) && <span>{ci.variantSize || p.size} · </span>}
                            <span className="font-bold text-brand-text">× {qtyN}</span>
                            {p.inStock === false && <span className="ml-2 font-bold text-rose-600">Out of stock</span>}
                          </p>
                        </div>
                        <span className="shrink-0 text-sm font-bold text-brand-text">{formatINR(p.price)}</span>
                      </li>
                    );
                  })}
                </ul>

                <dl className="mt-3 space-y-1.5 border-t border-primary-100 pt-3 text-sm">
                  {comboRegular > 0 && (
                    <div className="flex justify-between text-gray-600">
                      <dt>Regular price</dt>
                      <dd className="line-through">{formatINR(comboRegular)}</dd>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-brand-text">
                    <dt>Combo price</dt>
                    <dd className="text-base">{formatINR(price)}</dd>
                  </div>
                </dl>

                {comboSave > 0 && (
                  <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-1.5 text-sm font-extrabold text-white shadow-sm">
                    <FaTag size={11} aria-hidden="true" /> You save {formatINR(comboSave)} ({comboSavePct}%)
                  </p>
                )}

                {outOfStockItems.length > 0 && (
                  <p role="status" className="mt-3 text-xs font-semibold text-rose-600">
                    Currently unavailable: {outOfStockItems.map((ci) => ci.product.name).join(", ")} is out of stock.
                  </p>
                )}
              </section>
            )}

            {/* Size selector */}
            {variants?.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-semibold text-brand-text">
                    Size / Volume
                    {variant?.size && <span className="font-normal text-primary-600 ml-1">— {variant.size}</span>}
                  </span>
                  <button className="text-xs text-primary-600 hover:underline font-medium">Size Guide</button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {variants.map((v, i) => (
                    <button
                      key={i}
                      onClick={() => handleVariantChange(v)}
                      className={`px-4 py-2 rounded-full text-sm font-semibold border-2 transition-all ${
                        variant?.size === v.size
                          ? "border-primary-500 bg-primary-50 text-primary-700 shadow-sm"
                          : "border-secondary-200 text-gray-600 hover:border-primary-300 hover:text-primary-600"
                      }`}
                    >
                      {v.size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Shade / Color selector */}
            {variant?.color?.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-sm font-semibold text-brand-text">Shade / Color</span>
                  <span className="text-sm text-primary-600 font-medium italic">{color}</span>
                </div>
                <div className="flex flex-wrap gap-3">
                  {variant.color.map((c, i) => {
                    const hex = toHex(c);
                    const sel = color === c;
                    return (
                      <button
                        key={i}
                        title={c}
                        onClick={() => handleColorChange(c, variant)}
                        className={`relative w-10 h-10 rounded-full border-2 transition-all ${
                          sel ? "border-primary-500 scale-110 shadow-lg shadow-primary-200" : "border-transparent hover:border-primary-300"
                        }`}
                      >
                        <span className="block w-full h-full rounded-full border border-black/10" style={{ background: hex || "#d1d5db" }} />
                        {sel && <FaCheckCircle size={12} className="absolute -bottom-0.5 -right-0.5 text-primary-600 bg-brand-bg rounded-full" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {soldOut && (
              <p role="status" className="mb-3 text-sm font-bold text-rose-600">Out of stock</p>
            )}
            {!soldOut && stockLeft !== null && stockLeft > 0 && stockLeft <= 5 && (
              <p className="mb-3 text-sm font-semibold text-amber-700">Only {stockLeft} left in stock</p>
            )}

            {/* CTAs */}
            <div className="flex gap-4">
              <button
                onClick={doAdd}
                disabled={soldOut}
                className="disabled:cursor-not-allowed disabled:opacity-50 flex-1 flex items-center justify-center gap-2 bg-brand-bg border-2 border-primary-500 text-primary-600 font-bold py-4 rounded-xl hover:bg-primary-50 active:scale-[0.98] transition-all shadow-sm text-sm sm:text-base"
              >
                <FaShoppingCart size={16} /> {soldOut ? "Out of stock" : "Add to Cart"}
              </button>
              <button
                onClick={doBuy}
                disabled={soldOut}
                className="disabled:cursor-not-allowed disabled:opacity-50 flex-1 flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 active:scale-[0.98] text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-primary-200 text-sm sm:text-base"
              >
                <FaBolt size={14} /> Buy Now
              </button>
            </div>

            {/* Mobile CTAs Only (Trust badges & Tags moved above) */}
            <div className="lg:hidden flex flex-col gap-6">
               <div className="grid grid-cols-3 gap-2">
                {[
                  { Icon: FaTruck,    label: "Free Delivery",   sub: "Ships today"       },
                  { Icon: FaUndo,     label: "Easy Returns",    sub: "7 day policy"      },
                  { Icon: FaShieldAlt,label: "100% Genuine",    sub: "Quality assured"   },
                ].map(({ Icon, label, sub }) => (
                  <div key={label} className="flex flex-col items-center gap-1 bg-primary-50/60 border border-primary-100 rounded-xl py-3 px-1 text-center">
                    <Icon size={16} className="text-primary-500" />
                    <p className="text-[10px] font-bold text-brand-text leading-tight">{label}</p>
                    <p className="text-[9px] text-gray-400">{sub}</p>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                {productCode && (
                  <span className="text-[10px] bg-secondary-100 text-gray-500 px-3 py-1 rounded-full font-medium">
                    SKU: {productCode}
                  </span>
                )}
                {tags?.map(t => (
                  <span key={t} className="text-[10px] bg-primary-50 text-primary-600 px-3 py-1 rounded-full font-medium lowercase">
                    #{t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ═══ Info Accordions ═══ */}
        <div className="mt-10 rounded-2xl border border-primary-100 overflow-hidden shadow-sm">
          <Collapse
            title="Product Description"
            open={section === "desc"}
            onToggle={() => setSection(s => s === "desc" ? null : "desc")}
          >
            <p className="text-sm text-gray-600 leading-7">{description}</p>
          </Collapse>

          <Collapse
            title="Specifications"
            open={section === "specs"}
            onToggle={() => setSection(s => s === "specs" ? null : "specs")}
          >
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <tbody>
                  {(() => {
                    const specEntries = [];
                    
                    // 1. First preference: Dynamic Specifications Map from backend
                    if (product.specifications && Object.keys(product.specifications).length > 0) {
                      Object.entries(product.specifications).forEach(([k, v]) => {
                        if (v) specEntries.push([k, v]);
                      });
                    }

                    // 2. Second preference: Dynamic additionalInfo fields
                    if (additionalInfo && Object.keys(additionalInfo).length > 0) {
                      if (additionalInfo.skinType) specEntries.push(["Skin Type", additionalInfo.skinType]);
                      if (additionalInfo.shelfLife) specEntries.push(["Shelf Life", `${additionalInfo.shelfLife} Months`]);
                      if (additionalInfo.usageInstructions) specEntries.push(["Usage", additionalInfo.usageInstructions]);
                      
                      // Render any custom keys present in additionalInfo
                      Object.entries(additionalInfo).forEach(([k, v]) => {
                        if (!["skinType", "shelfLife", "usageInstructions"].includes(k) && typeof v !== 'object' && v) {
                          const formattedKey = k.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                          specEntries.push([formattedKey, String(v)]);
                        }
                      });
                    }

                    // Fallback defaults if empty
                    if (specEntries.length === 0) {
                      specEntries.push(["Product Code", productCode || "N/A"]);
                      specEntries.push(["Category", category?.name || "General"]);
                      if (product.weight) specEntries.push(["Weight", `${product.weight} kg`]);
                    }

                    return specEntries.map(([k, v]) => (
                      <tr key={k} className="border-b border-primary-50 last:border-0">
                        <td className="py-3 pr-6 text-gray-500 w-2/5 font-medium align-top">{k}</td>
                        <td className="py-3 text-brand-text font-semibold">{v}</td>
                      </tr>
                    ));
                  })()}
                </tbody>
              </table>
            </div>
          </Collapse>

          {reviewsEnabled && <Collapse
            title={`Customer Reviews ${reviewCount ? `(${reviewCount})` : ""}`}
            open={section === "reviews"}
            onToggle={() => setSection(s => s === "reviews" ? null : "reviews")}
          >
            <ReviewTab
              productId={product._id}
              reviews={reviews}
              setReviews={r => { product.reviews = r; }}
            />
          </Collapse>}
        </div>

        {/* ═══ Related Products ═══ */}
        <div className="mt-12 pt-8 border-t border-primary-50">
          <div className="flex items-center gap-3 mb-6">
            <span className="block w-1 h-6 bg-primary-500 rounded-full" />
            <h2 className="font-serif text-xl font-bold text-brand-text">You May Also Like</h2>
          </div>
          <RelatedProduct categorySlug={category?.slug} />
        </div>
      </div>

      {/* ═══ Mobile sticky CTA ═══ */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-30 flex gap-0 border-t border-primary-100 bg-brand-bg shadow-[0_-4px_20px_rgba(107,46,159,0.1)]">
        <button
          onClick={doAdd}
          disabled={soldOut}
          className="disabled:opacity-50 flex-1 flex items-center justify-center gap-2 bg-brand-bg text-primary-600 font-bold py-4 text-sm border-r border-primary-100"
        >
          <FaShoppingCart size={15} /> {soldOut ? "Out of stock" : "Add to Cart"}
        </button>
        <button
          onClick={doBuy}
          disabled={soldOut}
          className="disabled:opacity-50 flex-1 flex items-center justify-center gap-2 bg-primary-600 text-white font-bold py-4 text-sm"
        >
          <FaBolt size={13} /> Buy Now
        </button>
      </div>

      {/* ═══ Toast ═══ */}
      {toastMsg && (
        <div className="fixed bottom-20 lg:bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-accent-800 text-white px-6 py-3 rounded-full shadow-2xl text-sm font-medium whitespace-nowrap animate-fadeIn">
          <FaCheckCircle className="text-primary-400" size={15} />
          {toastMsg}
          <button onClick={() => navigate("/cart")} className="ml-1 font-bold text-primary-300 hover:text-white">
            View Cart →
          </button>
        </div>
      )}
    </div>
  );
}
