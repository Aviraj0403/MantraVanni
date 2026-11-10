import React from "react";
import { Flame, Sparkles } from "lucide-react";

export default function SacredSlokaStrip() {
  return (
    <div className="relative w-full overflow-hidden border-y-2 border-secondary/40 bg-gradient-to-r from-brand-text via-accent to-brand-text px-4 py-2.5 shadow-inner">
      <div className="mx-auto flex max-w-[1920px] flex-col items-center justify-between gap-2 text-center md:flex-row md:text-left">
        <div className="flex items-center gap-2 font-serif text-[12px] font-semibold tracking-wide text-secondary-200 sm:text-sm md:text-base">
          <span className="text-lg">🪔</span>
          <span>सर्वे भवन्तु सुखिनः सर्वे सन्तु निरामयाः । सर्वे भद्राणि पश्यन्तु मा कश्चिद्दुःखभाग्भवेत् ॥</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-secondary/30 bg-secondary/20 px-3 py-1 text-[11px] font-bold text-secondary-100 backdrop-blur-md sm:text-xs">
            <Flame size={13} className="animate-pulse text-secondary-300" />
            100% Pure Vedic Consecrated
          </span>
          <span className="hidden items-center gap-1.5 rounded-full border border-secondary/30 bg-primary-500/20 px-3 py-1 text-xs font-bold text-secondary-100 lg:inline-flex">
            <Sparkles size={13} className="text-secondary-300" />
            Direct From Sacred Artisans
          </span>
        </div>
      </div>
    </div>
  );
}
