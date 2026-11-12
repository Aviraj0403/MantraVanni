import React from "react";
import { Link } from "react-router-dom";

/**
 * MantraVanni text brand mark (Om medallion + wordmark).
 * variant "light" is for dark backgrounds.
 */
export default function BrandMark({ variant = "dark", size = "md", to = "/", className = "" }) {
  const sizes = {
    sm: { circle: "h-9 w-9 text-xl", title: "text-xl", cap: "text-[8px]" },
    md: { circle: "h-11 w-11 text-2xl", title: "text-2xl", cap: "text-[9px]" },
    lg: { circle: "h-14 w-14 text-3xl", title: "text-3xl", cap: "text-[10px]" },
  }[size];
  const light = variant === "light";

  const content = (
    <>
      <span
        className={`grid shrink-0 place-items-center rounded-full border border-secondary-300/70 shadow-inner ${sizes.circle} ${
          light ? "bg-white/10 text-secondary-200" : "bg-[#2b211c] text-secondary-100"
        }`}
      >
        ॐ
      </span>
      <span className="leading-none">
        <strong
          className={`block font-serif font-bold tracking-wide ${sizes.title} ${
            light ? "text-white" : "text-[#2b211c]"
          }`}
        >
          MantraVanni
        </strong>
        <small
          className={`mt-1 block font-cinzel uppercase tracking-[0.24em] ${sizes.cap} ${
            light ? "text-secondary-200" : "text-primary-600"
          }`}
        >
          Sacred living
        </small>
      </span>
    </>
  );

  if (!to) return <span className={`flex items-center gap-3 ${className}`}>{content}</span>;
  return (
    <Link to={to} aria-label="MantraVanni home" className={`flex items-center gap-3 ${className}`}>
      {content}
    </Link>
  );
}
