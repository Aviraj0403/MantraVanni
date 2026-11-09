import React from "react";
import { Flame, Sparkles } from "lucide-react";

export default function SacredSlokaStrip() {
  return (
    <div className="w-full bg-gradient-to-r from-[#4A200B] via-[#8B1E1E] to-[#4A200B] border-y-2 border-[#D4AF37]/40 py-3 px-4 shadow-inner relative overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-center md:text-left">
        
        <div className="flex items-center gap-2 text-amber-200 font-serif text-sm md:text-base font-bold tracking-wide">
          <span className="text-xl">🪔</span>
          <span>सर्वे भवन्तु सुखिनः सर्वे सन्तु निरामयाः । सर्वे भद्राणि पश्यन्तु मा कश्चिद्दुःखभाग्भवेत् ॥</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#D4AF37]/20 text-amber-200 border border-[#D4AF37]/30 backdrop-blur-md">
            <Flame size={13} className="text-amber-400 animate-pulse" />
            100% Pure Vedic Consecrated
          </span>
          <span className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-100 border border-amber-400/30">
            <Sparkles size={13} className="text-amber-300" />
            Direct From Sacred Artisans
          </span>
        </div>

      </div>
    </div>
  );
}
