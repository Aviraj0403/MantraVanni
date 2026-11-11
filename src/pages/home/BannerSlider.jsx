import React from "react";
import { createElement, useId, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, ChevronLeft, ChevronRight, Flower2, Truck, WalletCards, RotateCcw, Headphones, Pause, Play } from "lucide-react";
import spiritualHero from "../../image/banner/mantravanni-spiritual-hero.png";

const banners = [
  { eyebrow: "A LITTLE DEVOTION. EVERY DAY.", title: "Bring home", highlight: "the divine.", description: "Thoughtful essentials for your sacred space and everyday rituals.", action: "Explore the collection", to: "/#categories", note: "Pooja essentials · Sacred idols · Spiritual gifts" },
  { eyebrow: "MAKE SPACE FOR SACRED MOMENTS", title: "Small rituals.", highlight: "Deeper meaning.", description: "Discover meaningful additions to your daily moments of prayer and peace.", action: "Discover new arrivals", to: "/#new-arrivals", note: "For your altar. For your home. For your soul." },
  { eyebrow: "GIFTS WITH A SPIRITUAL SOUL", title: "Share blessings.", highlight: "Gift devotion.", description: "Celebrate new beginnings and special moments with thoughtful spiritual gifts.", action: "Explore sacred combos", to: "/combos", note: "Meaningful gifts for the moments that matter" },
];
const serviceBenefits = [
  { icon: Truck, title: "Pan India Delivery", subtitle: "Fast & Reliable" },
  { icon: WalletCards, title: "Secure Payments", subtitle: "100% Safe & Secure" },
  { icon: RotateCcw, title: "Easy Returns", subtitle: "Hassle Free Returns" },
  { icon: Headphones, title: "24/7 Support", subtitle: "We're Here to Help" },
];

// Coordinates follow the source image so each plume starts at an incense tip.
const smokeTrails = [
  {
    duration: "11s", delay: "-4s", width: 5,
    shapes: [
      "M1744 301 C1740 275 1723 266 1729 243 C1736 219 1772 220 1770 191 C1768 162 1726 161 1738 130 C1751 98 1797 103 1792 66 C1789 42 1764 29 1779 2",
      "M1744 301 C1747 276 1764 263 1752 241 C1740 218 1717 217 1729 190 C1741 161 1781 162 1769 130 C1757 100 1729 99 1745 65 C1758 40 1792 25 1781 2",
      "M1744 301 C1740 275 1723 266 1729 243 C1736 219 1772 220 1770 191 C1768 162 1726 161 1738 130 C1751 98 1797 103 1792 66 C1789 42 1764 29 1779 2",
    ],
  },
  {
    duration: "13s", delay: "-8s", width: 7,
    shapes: [
      "M1773 294 C1772 272 1787 260 1781 238 C1774 214 1749 206 1762 181 C1775 155 1817 158 1808 127 C1799 95 1766 91 1781 61 C1796 32 1835 30 1826 0",
      "M1773 294 C1768 271 1752 258 1762 237 C1774 213 1801 208 1789 181 C1778 153 1749 157 1764 126 C1780 95 1816 94 1809 63 C1802 34 1774 24 1795 0",
      "M1773 294 C1772 272 1787 260 1781 238 C1774 214 1749 206 1762 181 C1775 155 1817 158 1808 127 C1799 95 1766 91 1781 61 C1796 32 1835 30 1826 0",
    ],
  },
  {
    duration: "15s", delay: "-6s", width: 4,
    shapes: [
      "M1790 307 C1788 280 1805 270 1798 246 C1791 222 1773 213 1784 190 C1796 164 1837 163 1825 134 C1814 106 1797 97 1815 71 C1832 46 1871 36 1855 3",
      "M1790 307 C1796 281 1776 267 1785 245 C1794 223 1821 211 1810 188 C1799 164 1776 157 1791 133 C1806 107 1843 98 1834 72 C1826 45 1816 30 1836 3",
      "M1790 307 C1788 280 1805 270 1798 246 C1791 222 1773 213 1784 190 C1796 164 1837 163 1825 134 C1814 106 1797 97 1815 71 C1832 46 1871 36 1855 3",
    ],
  },
];

function IncenseSmoke({ paused }) {
  const id = useId();
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setReducedMotion(preference.matches);
    updatePreference();
    preference.addEventListener("change", updatePreference);
    return () => preference.removeEventListener("change", updatePreference);
  }, []);

  if (reducedMotion) return null;

  return (
    <svg className="pointer-events-none absolute inset-0 h-full w-full overflow-hidden" viewBox="0 0 1959 803" preserveAspectRatio="none" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={`${id}-fade`} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#fff8ee" stopOpacity="0" />
          <stop offset="14%" stopColor="#fff8ee" stopOpacity=".7" />
          <stop offset="48%" stopColor="#fff8ee" stopOpacity=".5" />
          <stop offset="80%" stopColor="#fff8ee" stopOpacity=".18" />
          <stop offset="100%" stopColor="#fff8ee" stopOpacity="0" />
        </linearGradient>
        <filter id={`${id}-soft`} x="-60%" y="-15%" width="220%" height="130%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency=".018 .034" numOctaves="2" seed="8" result="noise">
            {!paused && <animate attributeName="baseFrequency" values=".018 .034;.025 .045;.018 .034" dur="18s" repeatCount="indefinite" />}
          </feTurbulence>
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="19" xChannelSelector="R" yChannelSelector="G" />
          <feGaussianBlur stdDeviation="2.3" />
        </filter>
        <filter id={`${id}-haze`} x="-80%" y="-15%" width="260%" height="130%">
          <feGaussianBlur stdDeviation="6" />
        </filter>
      </defs>
      {smokeTrails.map((trail, index) => (
        <g key={trail.duration} fill="none" stroke={`url(#${id}-fade)`} strokeLinecap="round">
          <path d={trail.shapes[0]} strokeWidth={trail.width * 3} opacity=".23" filter={`url(#${id}-haze)`}>
            {!paused && <animate attributeName="d" values={trail.shapes.join(";")} dur={trail.duration} begin={trail.delay} repeatCount="indefinite" />}
          </path>
          <path d={trail.shapes[0]} strokeWidth={trail.width} strokeDasharray="42 12 64 18 76 14" opacity=".75" filter={`url(#${id}-soft)`}>
            {!paused && <>
              <animate attributeName="d" values={trail.shapes.join(";")} dur={trail.duration} begin={trail.delay} repeatCount="indefinite" />
              <animate attributeName="stroke-dashoffset" from="0" to="-226" dur={`${7 + index * 2}s`} begin={trail.delay} repeatCount="indefinite" />
            </>}
          </path>
        </g>
      ))}
    </svg>
  );
}

export default function BannerSlider() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const [interacting, setInteracting] = useState(false);
  useEffect(() => {
    if (paused || interacting || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const interval = setInterval(() => setCurrent((previous) => (previous + 1) % banners.length), 6500);
    return () => clearInterval(interval);
  }, [paused, interacting]);
  const moveSlide = (direction) => setCurrent((previous) => (previous + direction + banners.length) % banners.length);

  return (
    <section className="w-full overflow-hidden bg-brand-bg text-brand-text" aria-label="MantraVanni collections">
      <div className="relative w-full aspect-[1600/656] overflow-hidden [container-type:inline-size] bg-[#f4e8d7] text-[#472b1c] [&_a:focus-visible]:outline-2 [&_button:focus-visible]:outline-2 [&_a:focus-visible]:outline-[#8b4022] [&_button:focus-visible]:outline-[#8b4022] [&_a:focus-visible]:outline-offset-3 [&_button:focus-visible]:outline-offset-3 motion-reduce:[&_*]:transition-none" role="region" aria-roledescription="carousel" aria-label="Spiritual collections"
        onMouseEnter={() => setInteracting(true)} onMouseLeave={() => setInteracting(false)}
        onFocusCapture={() => setInteracting(true)}
        onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setInteracting(false); }}>
        <img className="absolute inset-0 h-full w-full object-cover" src={spiritualHero} alt="Brass diya, Ganesha idol, rudraksha mala and marigolds arranged on a warm stone altar" fetchPriority="high" />
        <IncenseSmoke paused={paused} />
        <div className="absolute inset-0 h-full w-full bg-[linear-gradient(90deg,#fff8eceb_0%,#fff8ecd9_32%,#fff8ec38_53%,transparent_70%)]" />
        <div className="absolute top-[7%] left-[7%] flex items-center gap-[.65cqw] text-[#86502b] [&>svg]:size-[2cqw] [&>svg]:stroke-[1.3] [&>span:first-of-type]:font-cinzel [&>span:first-of-type]:text-[1.65cqw] [&>span:first-of-type]:tracking-[.08em] max-[600px]:top-[5%] max-[600px]:left-[5%] max-[600px]:[&>span:first-of-type]:text-[2.2cqw] max-[600px]:[&>svg]:size-[2.6cqw]"><Flower2 aria-hidden="true" /><span>MantraVanni</span><span className="ml-[.7cqw] h-px w-[3.5cqw] bg-[#b89358]" /></div>
        {banners.map((banner, index) => (
          <div key={banner.eyebrow} className={`absolute top-[20%] left-[7%] w-[44%] transition-[opacity,transform,visibility] duration-[650ms] ease-[ease] max-[600px]:top-[19%] max-[600px]:left-[5%] max-[600px]:w-[49%] ${index === current ? "visible translate-y-0 opacity-100" : "invisible translate-y-[10px] opacity-0"}`} role="group" aria-roledescription="slide" aria-label={`${index + 1} of ${banners.length}`} aria-hidden={index !== current} inert={index !== current ? true : undefined}>
            <p className="m-0 mb-[1.2cqw] flex items-center gap-[.7cqw] text-[.72cqw] font-semibold tracking-[.22em] text-[#8e5c35] [&>span]:h-px [&>span]:w-[1.6cqw] [&>span]:bg-[#b57837] max-[600px]:mb-[1.1cqw] max-[600px]:text-[1.15cqw] max-[600px]:tracking-[.12em]"><span />{banner.eyebrow}</p>
            <h2 className="m-0 font-serif text-[4.65cqw] font-medium leading-[1.08] tracking-[-.045em] text-[#472b1c] [&>em]:font-medium [&>em]:text-[#b96325] max-[600px]:text-[5.1cqw]">{banner.title}<br /><em>{banner.highlight}</em></h2>
            <p className="mt-[1.2cqw] mb-[1.65cqw] max-w-[29cqw] text-[1cqw] leading-[1.7] text-[#79634e] max-[600px]:mt-[1.3cqw] max-[600px]:mb-[1.5cqw] max-[600px]:max-w-[40cqw] max-[600px]:text-[1.65cqw] max-[600px]:leading-[1.4]">{banner.description}</p>
            <Link className="inline-flex items-center gap-[2cqw] rounded-[3px] border border-[#8b4022] bg-[#8b4022] px-[1.5cqw] py-[1cqw] text-[.86cqw] font-medium text-[#fff8eb] no-underline shadow-[0_5px_18px_#66321415] transition-[background,transform] duration-200 hover:-translate-y-[2px] hover:bg-[#6e2e18] [&>svg]:size-[1.2cqw] max-[600px]:gap-[1.7cqw] max-[600px]:px-[1.8cqw] max-[600px]:py-[1.25cqw] max-[600px]:text-[1.6cqw] max-[600px]:[&>svg]:size-[2cqw]" to={banner.to}>{banner.action}<ArrowUpRight aria-hidden="true" /></Link>
            <p className="mt-[1.1cqw] mb-0 text-[.67cqw] tracking-[.055em] text-[#8a7256] max-[600px]:hidden">{banner.note}</p>
          </div>
        ))}
        <div className="absolute bottom-[4%] left-[7%] right-[4%] flex items-center justify-between max-[600px]:bottom-[1%] max-[600px]:left-[4%]">
          <span className="font-serif text-[.85cqw] italic text-[#8d7254] max-[600px]:hidden">Rooted in faith. Chosen with love.</span>
          <div className="flex items-center gap-[.5cqw] [&>button]:grid [&>button]:size-[2.4cqw] [&>button]:cursor-pointer [&>button]:place-items-center [&>button]:rounded-full [&>button]:border [&>button]:border-[#936d3c40] [&>button]:bg-[#fff9edc9] [&>button]:p-0 [&>button]:text-[#70421f] [&>button:hover]:bg-[#f2dbb3] [&>button>svg]:size-[1cqw] max-[600px]:gap-[.6cqw] max-[600px]:[&>button]:size-[5.5cqw] max-[600px]:[&>button]:bg-transparent max-[600px]:[&>button]:border-transparent max-[600px]:[&>button>svg]:size-[2.3cqw]">
            <button type="button" onClick={() => moveSlide(-1)} aria-label="Previous banner"><ChevronLeft /></button>
            <div className="flex items-center gap-[.25cqw] px-[.5cqw] [&>button]:grid [&>button]:h-[2.4cqw] [&>button]:w-[1.6cqw] [&>button]:cursor-pointer [&>button]:place-items-center [&>button]:border-0 [&>button]:bg-transparent [&>button]:p-0 [&>button>span]:block [&>button>span]:size-[.4cqw] [&>button>span]:rounded-[10px] [&>button>span]:bg-[#9d785665] [&>button>span]:transition-[width,background] [&>button>span]:duration-300 [&>button[aria-current=true]>span]:w-[1.5cqw] [&>button[aria-current=true]>span]:bg-[#9a4c25] max-[600px]:[&>button]:w-[3.5cqw] max-[600px]:[&>button]:h-[5.5cqw] max-[600px]:[&>button>span]:size-[.9cqw] max-[600px]:[&>button[aria-current=true]>span]:w-[2.8cqw]">{banners.map((banner, index) => (
              <button key={banner.eyebrow} type="button" onClick={() => setCurrent(index)} aria-label={`Show banner ${index + 1}`} aria-current={current === index ? "true" : undefined}><span /></button>
            ))}</div>
            <button type="button" onClick={() => moveSlide(1)} aria-label="Next banner"><ChevronRight /></button>
            <button type="button" onClick={() => setPaused((previous) => !previous)} aria-label={paused ? "Play slideshow" : "Pause slideshow"}>{paused ? <Play /> : <Pause />}</button>
          </div>
          <span className="text-[.85cqw] font-semibold text-[#744322] [&>span]:font-normal [&>span]:text-[#957858] max-[600px]:text-[1.8cqw]">0{current + 1}<span> / 0{banners.length}</span></span>
        </div>
      </div>
      <div className="hidden md:block border-t border-secondary-200 bg-brand-bg">
        <div className="mx-auto grid max-w-[1180px] grid-cols-2 gap-y-6 px-5 py-6 sm:px-10 lg:grid-cols-4 lg:px-12 lg:py-5">
          {serviceBenefits.map(({ icon, title, subtitle }) => (
            <div key={title} className="flex flex-col sm:flex-row items-center justify-center gap-3 text-center sm:text-left lg:border-r lg:border-secondary-200 lg:last:border-r-0">
              {createElement(icon, { className: "h-7 w-7 sm:h-6 sm:w-6 shrink-0 text-accent", strokeWidth: 1.8 })}
              <div><p className="text-[12px] sm:text-[11px] font-semibold leading-5 sm:leading-4 text-brand-text">{title}</p><p className="text-[11px] sm:text-[10px] text-brand-text/65 mt-0.5 sm:mt-0">{subtitle}</p></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
