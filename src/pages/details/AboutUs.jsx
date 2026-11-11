import React, { createElement } from "react";
import { Link } from "react-router-dom";
import { ArrowDown, ArrowUpRight, ChevronRight, Flower2, HandHeart, Gift, Sun } from "lucide-react";
import aboutHero from "../../image/about/mantravanni-about-hero.png";
import aboutStory from "../../image/about/mantravanni-about-story.png";

const values = [
  { icon: Flower2, title: "Tradition, carried forward", text: "We take inspiration from the rituals and familiar objects that connect generations, making space for them in the way we live today." },
  { icon: HandHeart, title: "Care in the little things", text: "From a diya's warm glow to the texture of a mala, we value the small details that turn an everyday object into something personal." },
  { icon: Gift, title: "Meaning, shared", text: "A new home, a festival, a quiet thank-you. We believe a thoughtful gift can carry warmth, intention and a sense of belonging." },
];

export default function AboutUs() {
  return (
    <main className="overflow-hidden bg-[#faf6ee] text-[#513b2c] [&_a:focus-visible]:outline-2 [&_a:focus-visible]:outline-offset-4 [&_a:focus-visible]:outline-[#b58c58]">
      <section className="relative isolate flex min-h-[440px] items-center overflow-hidden bg-[#51241f] sm:min-h-[500px] lg:min-h-[550px]" aria-labelledby="about-heading">
        <img src={aboutHero} alt="A glowing brass diya, rudraksha mala and incense arranged on a sandstone plinth against a deep maroon backdrop" className="absolute inset-0 -z-20 h-full w-full object-cover object-[68%_center] sm:object-center" fetchPriority="high" />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,#32150fe8_0%,#3b1913c4_35%,#3b19134d_65%,transparent_100%)]" />
        <div className="mx-auto w-full max-w-[1280px] px-5 pb-16 pt-24 sm:px-8 lg:px-10">
          <nav aria-label="Breadcrumb" className="absolute top-6 flex items-center gap-2 text-[10px] text-[#dfc3a9]"><Link to="/" className="transition-colors hover:text-white">Home</Link><ChevronRight size={12} aria-hidden="true" /><span aria-current="page">Our story</span></nav>
          <p className="mb-4 flex items-center gap-3 text-[9px] font-medium tracking-[.24em] text-[#e4c197] sm:text-[10px]"><span className="h-px w-7 bg-[#d0a273]" aria-hidden="true" />THE HEART OF MANTRAVANNI</p>
          <h1 id="about-heading" className="max-w-[650px] font-serif text-[47px] font-normal leading-[1.05] tracking-[-.04em] text-[#fff4e3] sm:text-[64px] lg:text-[76px]">Sacred living.<br /><em className="font-normal text-[#ebc391]">Made personal.</em></h1>
          <p className="mt-5 max-w-[310px] text-[13px] leading-7 text-[#eddbc6] sm:max-w-[390px] sm:text-sm">For the rituals you grew up with.<br />For the ones you're making your own.</p>
          <a href="#our-story" className="mt-7 inline-flex items-center gap-4 border-b border-[#d0a273]/60 pb-2 text-xs font-medium text-[#f3d5b0] transition-colors hover:border-white hover:text-white">Discover our story<ArrowDown size={14} aria-hidden="true" /></a>
        </div>
        <span className="absolute bottom-5 right-6 hidden text-[9px] tracking-[.24em] text-[#e8c4a0] sm:block lg:right-10">LIGHT. FRAGRANCE. MEANING.</span>
      </section>

      <div className="mx-auto max-w-[1280px] px-5 sm:px-8 lg:px-10">
        <section id="our-story" className="grid scroll-mt-28 grid-cols-1 items-center gap-9 py-12 sm:py-16 lg:grid-cols-[1.05fr_.95fr] lg:gap-20 lg:py-20" aria-labelledby="our-story-heading">
          <div>
            <p className="mb-4 text-[9px] font-semibold tracking-[.22em] text-[#ad7d54] sm:text-[10px]">OUR STORY</p>
            <h2 id="our-story-heading" className="max-w-[520px] font-serif text-[34px] font-normal leading-[1.15] tracking-[-.035em] text-[#4d392a] sm:text-[43px] lg:text-[48px]">A familiar ritual.<br /><em className="font-normal text-[#9e603d]">A new way to find it.</em></h2>
            <div className="mt-6 max-w-[490px] space-y-4 text-[13px] leading-7 text-[#8b7460] sm:text-sm">
              <p>There is something comforting about a diya at dusk, the fragrance of incense and a quiet moment of prayer. These little rituals make a place feel like home.</p>
              <p>MantraVanni brings pooja essentials, sacred idols, incense, diyas and meaningful gifts together in one place. Our collection is inspired by the traditions we carry with us and the ways we choose to honour them.</p>
              <p>From daily devotion to festivals and new beginnings, our purpose is simple: to help you find something that feels right for your sacred space.</p>
            </div>
            <div className="mt-7 border-l-2 border-[#c6a17c] py-1 pl-5"><p className="font-serif text-lg italic leading-relaxed text-[#a0714f] sm:text-xl">A small flame. A familiar fragrance.<br />A moment that feels like home.</p></div>
          </div>

          <figure className="mx-auto w-full max-w-[480px]">
            <div className="relative aspect-[4/5] overflow-hidden rounded-t-[120px] rounded-b-[20px] bg-[#e6d6be] sm:rounded-t-[170px]">
              <img src={aboutStory} alt="Hands folding ivory muslin around a terracotta diya and rudraksha mala, with marigold petals on a wooden table" className="h-full w-full object-cover" loading="lazy" width="1024" height="1280" />
              <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#3f2919]/65 to-transparent" aria-hidden="true" />
              <figcaption className="absolute bottom-6 left-6 right-6 flex items-end justify-between gap-3 text-[#fff5e5] sm:bottom-8 sm:left-8 sm:right-8"><span className="font-serif text-[25px] italic leading-tight sm:text-[29px]">Thoughtful things.<br />Beautiful intentions.</span><HandHeart size={28} strokeWidth={1} aria-hidden="true" /></figcaption>
            </div>
            <p className="mt-3 text-right text-[9px] tracking-[.12em] text-[#ac9177]">THE EVERYDAY CAN BE SACRED, TOO.</p>
          </figure>
        </section>

        <section className="border-t border-[#e2d5c3] pb-12 pt-10 sm:pb-16 sm:pt-12" aria-labelledby="about-values-heading">
          <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end"><div><p className="mb-3 text-[9px] font-semibold tracking-[.22em] text-[#ad7d54] sm:text-[10px]">WHAT GUIDES US</p><h2 id="about-values-heading" className="font-serif text-[32px] font-normal tracking-[-.03em] text-[#4d392a] sm:text-[40px]">Meaning in every detail.</h2></div><p className="max-w-[305px] text-xs leading-6 text-[#9a8069]">The ideas we return to when we think about the things you bring into your home.</p></div>
          <div className="grid gap-4 md:grid-cols-3 sm:gap-5">
            {values.map(({ icon, title, text }, index) => (
              <div key={title} className="rounded-[20px] border border-[#e7dac8] bg-[#fffcf6] p-6 lg:p-8">
                <div className="mb-7 flex items-center justify-between">{createElement(icon, { className: "size-6 text-[#aa7952]", strokeWidth: 1.3, "aria-hidden": true })}<span className="font-serif text-sm italic text-[#c2a68a]">0{index + 1}</span></div>
                <h3 className="font-serif text-[23px] font-normal leading-tight text-[#63452e]">{title}</h3><p className="mt-3 text-xs leading-7 text-[#92785f]">{text}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="relative isolate overflow-hidden bg-[#303a2f] px-5 py-12 sm:px-8 sm:py-16 lg:py-20" aria-labelledby="about-purpose-heading">
        <Sun className="pointer-events-none absolute -left-24 -top-20 -z-10 size-[400px] text-[#bcc79d]/5" strokeWidth={0.5} aria-hidden="true" />
        <div className="mx-auto grid max-w-[1200px] gap-9 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
          <div><p className="mb-5 text-[9px] font-medium tracking-[.22em] text-[#bdc6a7] sm:text-[10px]">A PURPOSE WE COME BACK TO</p><h2 id="about-purpose-heading" className="font-serif text-[34px] font-normal leading-[1.15] tracking-[-.03em] text-[#f3eedf] sm:text-[46px]">More connection.<br /><em className="font-normal text-[#c1cea7]">In the everyday.</em></h2></div>
          <div className="space-y-7"><div className="border-b border-[#b9c79e]/20 pb-7"><h3 className="mb-2 font-sans text-xs font-medium text-[#e5e7d3]">Our mission</h3><p className="text-[13px] leading-7 text-[#b7c0aa]">To make beautiful devotional essentials easier to discover, helping you create meaningful rituals that fit naturally into your life.</p></div><div><h3 className="mb-2 font-sans text-xs font-medium text-[#e5e7d3]">Our vision</h3><p className="text-[13px] leading-7 text-[#b7c0aa]">A world where sacred living feels personal, accessible and connected to the traditions and people we love.</p></div></div>
        </div>
      </section>

      <section className="mx-auto flex max-w-[1280px] flex-col items-start justify-between gap-7 px-5 py-12 sm:px-8 sm:py-16 md:flex-row md:items-center lg:px-10" aria-labelledby="about-collection-heading">
        <div><p className="mb-3 text-[9px] font-semibold tracking-[.2em] text-[#ad7d54]">MAKE IT YOUR OWN</p><h2 id="about-collection-heading" className="font-serif text-[32px] font-normal leading-tight tracking-[-.03em] text-[#4d392a] sm:text-[40px]">Your next ritual starts here.</h2><p className="mt-3 text-xs leading-6 text-[#9a8069]">Discover something for your space, your day or someone you love.</p></div>
        <div className="flex shrink-0 flex-col items-start gap-4"><Link to="/#categories" className="inline-flex items-center gap-7 rounded-full bg-[#8e5033] px-6 py-3.5 text-xs font-medium text-[#fff2df] transition-colors hover:bg-[#6d3a24]">Explore the collection<ArrowUpRight size={16} aria-hidden="true" /></Link><Link to="/contact-us" className="inline-flex items-center gap-3 text-[11px] text-[#9c7250] transition-colors hover:text-[#67472e]">A question? Let's talk<ArrowUpRight size={13} aria-hidden="true" /></Link></div>
      </section>
    </main>
  );
}
