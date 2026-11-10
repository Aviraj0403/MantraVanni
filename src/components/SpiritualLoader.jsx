import React from "react";
import { Flame, Flower2, Gem, Sparkles, Sun } from "lucide-react";

const orbitItems = [
  { Icon: Flame, label: "Sacred flame", angle: 0 },
  { Icon: Flower2, label: "Lotus", angle: 72 },
  { Icon: Gem, label: "Crystal", angle: 144 },
  { Icon: Sparkles, label: "Divine energy", angle: 216 },
  { Icon: Sun, label: "Auspicious light", angle: 288 },
];

const SpiritualLoader = ({ fullScreen = true }) => {
  return (
    <div
      className={`spiritual-loader ${fullScreen ? "spiritual-loader--screen" : ""}`}
      role="status"
      aria-live="polite"
    >
      <div className="spiritual-loader__halo" aria-hidden="true" />

      <div className="spiritual-loader__orbit" aria-hidden="true">
        {orbitItems.map(({ Icon, label, angle }) => (
          <span
            key={label}
            className="spiritual-loader__item"
            style={{ "--loader-angle": `${angle}deg` }}
          >
            <Icon size={22} strokeWidth={1.8} />
          </span>
        ))}
      </div>

      <div className="spiritual-loader__center" aria-hidden="true">
        <span className="font-serif text-5xl leading-none text-accent">ॐ</span>
      </div>

      <span className="spiritual-loader__text">Loading divine essentials...</span>
      <span className="sr-only">Loading MantraVanni</span>
    </div>
  );
};

export default SpiritualLoader;
