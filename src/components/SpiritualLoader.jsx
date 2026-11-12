import React from "react";

export default function SpiritualLoader({ fullScreen = true }) {
  return (
    <div className={`spiritual-loader ${fullScreen ? "spiritual-loader--screen" : ""}`} role="status" aria-live="polite" aria-label="Loading MantraVanni">
      <div className="spiritual-loader__content" aria-hidden="true">
        <img src="/mantravanni-diya-loader.svg" width="240" height="190" className="spiritual-loader__diya" alt="" fetchPriority="high" />
        <span className="spiritual-loader__brand">MantraVanni</span>
        <span className="spiritual-loader__caption">A moment of stillness.</span>
        <span className="spiritual-loader__status">Preparing your sacred space…</span>
      </div>
    </div>
  );
}
