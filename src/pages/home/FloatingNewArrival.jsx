import React from "react";
import { Flame, Sparkles } from "lucide-react";

export default function FloatingNewArrival() {
  return (
    <>
      <style>{`
        @keyframes sacred-strip-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
      <div className="w-full overflow-hidden border-y-2 border-secondary bg-[#2b211c] py-2">
        <div className="flex w-max items-center whitespace-nowrap animate-[sacred-strip-scroll_40s_linear_infinite] hover:[animation-play-state:paused] motion-reduce:animate-none">
          {[0, 1].map((copy) => (
            <div key={copy} aria-hidden={copy === 1 ? true : undefined} className="flex shrink-0 items-center gap-6 px-6 sm:gap-8 sm:px-8">
              <span className="flex items-center gap-2 font-serif text-sm font-semibold tracking-wide text-secondary-200 md:text-base">
                <span aria-hidden="true" className="text-lg">🪔</span>
                सर्वे भवन्तु सुखिनः सर्वे सन्तु निरामयाः । सर्वे भद्राणि पश्यन्तु मा कश्चिद्दुःखभाग्भवेत् ॥
              </span>
              <span aria-hidden="true" className="h-4 w-px bg-secondary/80" />
              <span className="inline-flex items-center gap-1.5 rounded-full border border-secondary/30 bg-secondary/20 px-3 py-1 text-xs font-bold text-secondary-100">
                <Flame size={13} aria-hidden="true" className="text-secondary-300" />
                100% Pure Vedic Consecrated
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-secondary/30 bg-primary-500/20 px-3 py-1 text-xs font-bold text-secondary-100">
                <Sparkles size={13} aria-hidden="true" className="text-secondary-300" />
                Direct From Sacred Artisans
              </span>
              <span aria-hidden="true" className="h-4 w-px bg-secondary/80" />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
