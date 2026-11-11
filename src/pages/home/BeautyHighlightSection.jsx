import React, { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Pause, Play, Wind } from "lucide-react";
import { Link } from "react-router-dom";

const ritualSteps = [
  { title: "Make a little space", text: "Choose a quiet corner. Let the everyday rush wait a moment." },
  { title: "Bring in your ritual", text: "A favourite fragrance, a warm diya, a familiar prayer. Start with what feels like you." },
  { title: "Be here, simply", text: "Take a gentle breath. Give this small moment your full attention." },
];

export default function BeautyHighlightSection() {
  const videoRef = useRef(null);
  const userPausedRef = useRef(false);
  const [playing, setPlaying] = useState(false);
  const [videoUnavailable, setVideoUnavailable] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onPause = () => { if (video && !video.paused) video.pause(); };
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) {
        onPause();
      } else if (!motionPreference.matches && !userPausedRef.current) {
        video.play().catch(() => { /* The play button remains available if autoplay is blocked. */ });
      }
    }, { threshold: 0.2 });
    const onMotionChange = () => { if (motionPreference.matches) onPause(); };
    observer.observe(video);
    motionPreference.addEventListener("change", onMotionChange);
    return () => {
      observer.disconnect();
      motionPreference.removeEventListener("change", onMotionChange);
    };
  }, []);

  const togglePlayback = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      userPausedRef.current = false;
      video.play().catch(() => setPlaying(false));
    } else {
      userPausedRef.current = true;
      video.pause();
    }
  };

  return (
    <section className="px-3 py-5 sm:px-6 lg:px-5" aria-labelledby="quiet-moments-heading">
      <div className="relative isolate overflow-hidden rounded-[24px] bg-[#252e27] px-5 py-7 text-[#e9eadc] sm:rounded-[32px] sm:px-9 sm:py-10 lg:px-12 xl:px-16">
        <div className="pointer-events-none absolute -left-40 top-0 -z-10 size-[500px] rounded-full bg-[#8b9c65]/10 blur-[100px]" aria-hidden="true" />

        <div className="mb-8 flex items-center justify-between gap-4 border-b border-[#d9e0c7]/15 pb-5 lg:mb-10">
          <span className="flex items-center gap-2.5 text-[9px] tracking-[.23em] text-[#cad3b8] sm:text-[10px]"><Wind size={16} strokeWidth={1.3} aria-hidden="true" />THE QUIET EDIT</span>
          <span className="text-[9px] tracking-[.17em] text-[#abb79e] sm:text-[10px]">SACRED LIVING / MANTRAVANNI</span>
        </div>

        <div className="grid min-w-0 grid-cols-1 items-center gap-8 md:grid-cols-2 md:gap-9 xl:grid-cols-[1fr_1.2fr_.85fr] xl:gap-12">
          <div className="min-w-0 md:col-span-2 xl:col-span-1">
            <p className="mb-4 text-[9px] font-medium uppercase tracking-[.22em] text-[#bdc99d] sm:text-[10px]">Less hurry. More presence.</p>
            <h2 id="quiet-moments-heading" className="font-serif text-[48px] font-normal leading-[1.04] tracking-[-.045em] text-[#f4f0df] sm:text-[60px] md:max-xl:max-w-[650px] xl:text-[64px]">Pause.<br className="hidden xl:block" /> Breathe.<br /><em className="font-normal text-[#bacb9a]">Begin again.</em></h2>
            <p className="mt-5 max-w-[310px] text-[13px] leading-7 text-[#c4c9b9] md:max-xl:max-w-[550px]">Some moments ask for nothing more than a little light, a familiar fragrance and you.</p>
            <div className="mt-7 hidden items-center gap-3 xl:flex"><span className="h-px w-10 bg-[#a5b787]/60" /><span className="font-serif text-sm italic text-[#aab69a]">Your everyday, with intention.</span></div>
          </div>

          <figure className="relative min-w-0 overflow-hidden rounded-t-[100px] rounded-b-2xl border border-[#d9e0c7]/15 bg-[#788375] sm:rounded-t-[140px]">
            <video ref={videoRef} className="aspect-[4/5] w-full object-cover object-bottom" poster="/videos/mantravanni-incense-ritual-poster.jpg"
              muted loop playsInline preload="metadata"
              aria-label="Slowly drifting incense smoke above a botanical bundle in a brass dish"
              onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onError={() => setVideoUnavailable(true)}>
              <source src="/videos/mantravanni-incense-ritual.mp4" type="video/mp4" onError={() => setVideoUnavailable(true)} />
            </video>
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#172219]/90 to-transparent" aria-hidden="true" />
            <figcaption className="absolute bottom-5 left-5 right-5 flex items-center justify-between gap-3 sm:bottom-6 sm:left-6 sm:right-6">
              <div><p className="text-[8px] tracking-[.2em] text-[#dbe2cc]">A MOMENT TO YOURSELF</p><p className="mt-1 font-serif text-xl italic text-[#fff8e7]">Let the world slow down.</p></div>
              {!videoUnavailable && <button type="button" onClick={togglePlayback} aria-label={playing ? "Pause ritual video" : "Play ritual video"} className="grid size-11 shrink-0 cursor-pointer place-items-center rounded-full border border-white/40 bg-[#fff8e7]/10 text-[#fff8e7] backdrop-blur-sm transition hover:bg-[#fff8e7]/25 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#e3eacb]">{playing ? <Pause size={17} aria-hidden="true" /> : <Play size={17} aria-hidden="true" />}</button>}
            </figcaption>
            {videoUnavailable && <p className="absolute left-5 top-6 rounded-full bg-[#252e27]/80 px-3 py-1.5 text-xs text-[#f4f0df]">A quiet moment, captured.</p>}
          </figure>

          <div className="min-w-0">
            <p className="mb-6 text-[9px] font-medium tracking-[.2em] text-[#bdc99d]">YOUR EVERYDAY RESET</p>
            <ol className="space-y-6 lg:space-y-8">
              {ritualSteps.map((step, index) => (
                <li key={step.title} className="flex gap-4">
                  <span className="pt-0.5 font-serif text-sm italic text-[#a8bb8a]">0{index + 1}</span>
                  <div><h3 className="font-sans text-sm font-medium text-[#f0eddd]">{step.title}</h3><p className="mt-2 text-xs leading-[1.85] text-[#b5bfab]">{step.text}</p></div>
                </li>
              ))}
            </ol>
            <Link to="/#categories" className="mt-8 inline-flex items-center gap-5 border-b border-[#bacb9a]/50 pb-2 text-xs font-medium text-[#dfebc7] transition-colors hover:border-[#f5f1dd] hover:text-[#f5f1dd] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#dfebc7]">Discover ritual essentials<ArrowUpRight size={16} aria-hidden="true" /></Link>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-start justify-between gap-2 border-t border-[#d9e0c7]/15 pt-5 sm:flex-row sm:items-center lg:mt-10">
          <p className="font-serif text-sm italic text-[#bec8ae]">A small ritual. A softer rhythm.</p>
          <p className="text-[8px] tracking-[.16em] text-[#9ba88f]">LIGHT · FRAGRANCE · STILLNESS</p>
        </div>
      </div>
    </section>
  );
}
