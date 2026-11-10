import React from "react";

const Marquee = () => {
  return (
    <>
      <style>
        {`
          @keyframes marquee-right-left {
            0% { transform: translateX(0%); }
            100% { transform: translateX(-50%); }
          }
        `}
      </style>

      <div className="w-full overflow-hidden border-y-2 border-secondary bg-gradient-to-b from-brand-text to-accent py-2">
        <div
          className="flex w-max items-center whitespace-nowrap"
          style={{ animation: "marquee-right-left 18s linear infinite" }}
        >
          {[...Array(17)].map((_, i) => (
            <React.Fragment key={i}>
              <span className="mx-4 text-sm font-semibold tracking-widest text-secondary-200">
                NEW ARRIVALS
              </span>
              <span className="h-4 w-px bg-secondary opacity-80" />
            </React.Fragment>
          ))}
        </div>
      </div>
    </>
  );
};

export default Marquee;
