import React from "react";

export default function BeautyHighlightSection() {
  return (
    <section className="w-full bg-gradient-to-r from-[#fff1da] via-[#fffaf2] to-[#f6dfc2] py-14 px-4 md:px-6 border-y border-primary-100">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-8 items-center">
        
        {/* Left Content */}
        <div className="space-y-4">
          <span className="inline-block bg-primary-100 text-primary-600 text-xs font-semibold px-3 py-1 rounded-full">
            A sacred ritual, beautifully prepared
          </span>

          <h2 className="text-3xl md:text-4xl font-bold text-brand-text leading-snug">
            Make every prayer feel more divine
          </h2>

          <p className="text-gray-600 text-base leading-relaxed max-w-md">
            From the first diya at dawn to festive celebrations, discover pure,
            authentic essentials that honour tradition and elevate your home altar.
          </p>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="bg-white shadow-sm rounded-xl p-3 border border-primary-100">
              <h3 className="text-sm font-semibold text-brand-text">
                Authentic & Pure
              </h3>
              <p className="text-gray-500 text-xs mt-1">
                Chosen with devotion and care.
              </p>
            </div>

            <div className="bg-white shadow-sm rounded-xl p-3 border border-primary-100">
              <h3 className="text-sm font-semibold text-brand-text">
                Delivered with Blessings
              </h3>
              <p className="text-gray-500 text-xs mt-1">
                Beautifully packed for every ritual.
              </p>
            </div>
          </div>

          <div className="pt-2">
            <button className="bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-full text-sm font-medium shadow transition">
              Explore the collection
            </button>
          </div>
        </div>

        {/* Right Video */}
        <div className="relative">
          <div className="rounded-2xl overflow-hidden shadow-lg border border-primary-100">
            <video
              className="w-full h-[240px] md:h-[320px] object-cover"
              src="https://videos.pexels.com/video-files/3195394/3195394-hd_1920_1080_25fps.mp4"
              autoPlay
              muted
              loop
              playsInline
            />
          </div>

          {/* Small Badge */}
          <div className="absolute -bottom-3 -left-3 bg-white shadow-md rounded-xl px-3 py-2 border border-primary-100">
            <p className="text-xs text-gray-500">For every prayer</p>
            <h4 className="text-sm font-semibold text-[#a94217]">
              A little more divine
            </h4>
          </div>
        </div>
      </div>
    </section>
  );
}