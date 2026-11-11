import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, ChevronRight, RotateCcw, RefreshCw, Clock, PackageCheck, Check, Mail, Phone, HeartHandshake } from "lucide-react";
import returnsHero from "../../image/returns/mantravanni-returns-hero.png";
import careImage from "../../image/returns/mantravanni-packaging-care.png";

const returnRules = [
  "Items must be returned within 7 days of delivery.",
  "Products must be unused, unworn and in their original packaging.",
  "Returns are accepted only for damaged, defective or incorrect items.",
  "Refunds are issued as store credit or to the original payment method.",
];
const exchangeRules = [
  "Exchanges are allowed for size issues or damaged/wrong items received.",
  "Exchange requests must be raised within 7 days of delivery.",
  "Your replacement will be shipped once the original item is received.",
];
const steps = [
  { title: "Tell us what happened", text: "Visit our Contact Us page and share your issue along with your order details.", note: "Start with your order details" },
  { title: "We'll review your request", text: "Our team reviews your request and confirms approval within 24–48 hours.", note: "A little help from our team" },
  { title: "Return, then a fresh start", text: "Send the product back and receive your refund or exchanged product as outlined in our policy.", note: "We'll guide you through the next steps" },
];

export default function ReturnExchange() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#fcf8f3] text-[#66524a] [&_a:focus-visible]:outline-2 [&_a:focus-visible]:outline-offset-4 [&_a:focus-visible]:outline-[#875251]">
      <header className="relative isolate flex min-h-[500px] items-center overflow-hidden bg-[#efe1d9] sm:min-h-[520px]">
        <img src={returnsHero} alt="An open kraft box with a brass diya, protective paper and a cotton pouch, ready to be handled with care" className="absolute inset-0 -z-20 h-full w-full object-cover object-[68%_center] sm:object-center" fetchPriority="high" />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,#f6ebe4f0_0%,#f6ebe4ed_65%,#f6ebe470_100%)] sm:bg-[linear-gradient(90deg,#f6ebe4f5_0%,#f6ebe4e8_36%,#f6ebe47a_65%,#f6ebe41a_100%)]" />
        <div className="mx-auto w-full max-w-[1280px] px-5 pb-10 pt-24 sm:px-8 sm:pb-12 lg:px-10">
          <nav aria-label="Breadcrumb" className="absolute top-6 flex flex-wrap items-center gap-2 text-sm text-[#8b6d61]"><Link to="/" className="hover:text-[#673b36]">Home</Link><ChevronRight size={15} aria-hidden="true" /><span aria-current="page">Returns & exchanges</span></nav>
          <p className="mb-4 text-sm font-medium uppercase tracking-[.13em] text-[#91665d]">A little peace of mind</p>
          <h1 className="max-w-[700px] font-serif text-[39px] font-normal leading-[1.12] tracking-[-.035em] text-[#563530] sm:text-[54px] lg:text-[66px]">Care that stays.<br /><em className="font-normal text-[#99635c]">Even after delivery.</em></h1>
          <p className="mt-5 max-w-[480px] text-base leading-8 text-[#7e6055] sm:text-lg">If something isn't right with your order, we're here to help you find the next step.</p>
          <Link to="/contact-us" className="mt-7 inline-flex items-center gap-6 rounded-full bg-[#794741] px-6 py-3.5 text-base font-medium text-[#fff8ed] transition-colors hover:bg-[#5c322d]">Start a conversation<ArrowUpRight size={19} aria-hidden="true" /></Link>
        </div>
      </header>

      <div className="mx-auto max-w-[1280px] px-5 pb-12 sm:px-8 sm:pb-16 lg:px-10">
        <div className="grid grid-cols-1 gap-4 py-7 md:grid-cols-3 sm:py-10">
          <div className="flex items-center gap-4 rounded-2xl border border-[#e7d9d0] bg-[#fffdf9] p-5 sm:p-6"><RotateCcw size={25} strokeWidth={1.4} className="shrink-0 text-[#a77569]" aria-hidden="true" /><div><p className="text-lg font-medium text-[#704b42]">7-day window</p><p className="mt-1 text-sm leading-6 text-[#8f766a]">From the date of delivery</p></div></div>
          <div className="flex items-center gap-4 rounded-2xl border border-[#e7d9d0] bg-[#fffdf9] p-5 sm:p-6"><Clock size={25} strokeWidth={1.4} className="shrink-0 text-[#a77569]" aria-hidden="true" /><div><p className="text-lg font-medium text-[#704b42]">48-hour processing</p><p className="mt-1 text-sm leading-6 text-[#8f766a]">After your request is approved</p></div></div>
          <div className="flex items-center gap-4 rounded-2xl border border-[#e7d9d0] bg-[#fffdf9] p-5 sm:p-6"><PackageCheck size={25} strokeWidth={1.4} className="shrink-0 text-[#a77569]" aria-hidden="true" /><div><p className="text-lg font-medium text-[#704b42]">Keep it original</p><p className="mt-1 text-sm leading-6 text-[#8f766a]">Unused, with original packaging</p></div></div>
        </div>

        <section aria-labelledby="returns-policy-heading">
          <div className="mb-7 flex flex-col justify-between gap-4 lg:flex-row lg:items-end"><div><p className="mb-3 text-sm font-medium uppercase tracking-[.12em] text-[#a47767]">Clear details. Thoughtful support.</p><h2 id="returns-policy-heading" className="font-serif text-[32px] font-normal leading-tight tracking-tight text-[#63463b] sm:text-[42px]">Our return & exchange policy.</h2></div><p className="max-w-[330px] text-base leading-7 text-[#8d7468]">Before you get in touch, here's what you need to know.</p></div>
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 lg:gap-7">
            <article className="rounded-[24px] border border-[#e7d9d0] bg-[#fffdf9] p-6 sm:p-8"><div className="mb-6 flex items-center justify-between border-b border-[#e9ddd3] pb-5"><div className="flex items-center gap-3"><span className="grid size-11 place-items-center rounded-full bg-[#f2e5df]"><RotateCcw size={21} strokeWidth={1.4} className="text-[#a16e60]" aria-hidden="true" /></span><h3 className="font-serif text-[27px] font-normal text-[#714c40] sm:text-[30px]">Returns</h3></div><span className="font-serif text-lg italic text-[#b08d7c]">01</span></div><ul className="space-y-5">{returnRules.map(rule => <li key={rule} className="flex items-start gap-3 text-base leading-8 text-[#7e675a]"><Check size={18} className="mt-2 shrink-0 text-[#b0886d]" aria-hidden="true" /><span>{rule}</span></li>)}</ul></article>
            <article className="rounded-[24px] border border-[#dbdfcf] bg-[#f1f3e9] p-6 sm:p-8"><div className="mb-6 flex items-center justify-between border-b border-[#dce1cf] pb-5"><div className="flex items-center gap-3"><span className="grid size-11 place-items-center rounded-full bg-[#e4e9d8]"><RefreshCw size={21} strokeWidth={1.4} className="text-[#889668]" aria-hidden="true" /></span><h3 className="font-serif text-[27px] font-normal text-[#65724e] sm:text-[30px]">Exchanges</h3></div><span className="font-serif text-lg italic text-[#9eaa89]">02</span></div><ul className="space-y-5">{exchangeRules.map(rule => <li key={rule} className="flex items-start gap-3 text-base leading-8 text-[#778063]"><Check size={18} className="mt-2 shrink-0 text-[#93a276]" aria-hidden="true" /><span>{rule}</span></li>)}</ul><div className="mt-7 border-t border-[#dce1cf] pt-5"><p className="text-sm leading-7 text-[#7c8669]">Please keep the original item and packaging ready while our team helps with your request.</p></div></article>
          </div>
        </section>

        <section className="mt-12 grid min-w-0 grid-cols-1 items-center gap-8 border-t border-[#e6d8cc] pt-10 sm:mt-16 sm:pt-14 lg:grid-cols-[.85fr_1.15fr] lg:gap-14" aria-labelledby="return-steps-heading">
          <figure className="relative mx-auto w-full max-w-[470px] overflow-hidden rounded-[24px] bg-[#e2d1bd] lg:mx-0"><img src={careImage} alt="Hands carefully wrapping a brass diya in protective honeycomb paper above a kraft box" className="aspect-[4/5] h-full w-full object-cover" loading="lazy" width="1024" height="1280" /><div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#4b3024]/75 to-transparent" aria-hidden="true" /><figcaption className="absolute bottom-6 left-6 right-6 flex items-end justify-between gap-3 text-[#fff8e9] sm:bottom-8 sm:left-8 sm:right-8"><span className="font-serif text-[28px] italic leading-tight sm:text-[34px]">Handled with care.<br />From start to finish.</span><HeartHandshake size={29} strokeWidth={1.2} className="shrink-0" aria-hidden="true" /></figcaption></figure>
          <div className="min-w-0"><p className="mb-3 text-sm font-medium uppercase tracking-[.12em] text-[#a47767]">Let's take it one step at a time</p><h2 id="return-steps-heading" className="font-serif text-[32px] font-normal leading-tight tracking-tight text-[#63463b] sm:text-[42px]">How to start a return.</h2><ol className="mt-7 space-y-7">{steps.map((step, index) => <li key={step.title} className="flex gap-4 sm:gap-5"><span className="grid size-10 shrink-0 place-items-center rounded-full border border-[#dfc9ba] bg-[#f4e9dd] text-base text-[#a17b60]">{index + 1}</span><div className="border-b border-[#e9ddd1] pb-6"><h3 className="font-sans text-lg font-medium text-[#70503f]">{step.title}</h3><p className="mt-2 text-base leading-8 text-[#8b7262]">{step.text}</p><p className="mt-2 text-sm italic text-[#a0846e]">{step.note}</p></div></li>)}</ol><Link to="/contact-us" className="mt-7 inline-flex items-center gap-6 rounded-full bg-[#794741] px-6 py-3.5 text-base font-medium text-[#fff8ed] transition-colors hover:bg-[#5c322d]">Contact our team<ArrowUpRight size={18} aria-hidden="true" /></Link></div>
        </section>

        <section className="mt-12 flex flex-col justify-between gap-6 rounded-[24px] border border-[#e4d2c5] bg-[#efe4d9] p-6 sm:mt-16 sm:p-8 lg:flex-row lg:items-center" aria-labelledby="returns-help-heading"><div><h2 id="returns-help-heading" className="font-serif text-[28px] font-normal text-[#70503f] sm:text-[34px]">A real conversation can help.</h2><p className="mt-2 max-w-[540px] text-base leading-8 text-[#8c7260]">Have your order details handy. We're here to help with questions about your return or exchange.</p></div><div className="flex min-w-0 shrink-0 flex-col gap-3"><a href="mailto:support@mantravanni.com" className="flex w-fit items-center gap-2.5 break-all text-base text-[#875e46] hover:text-[#543626]"><Mail size={18} className="shrink-0" aria-hidden="true" />support@mantravanni.com</a><a href="tel:+918510879296" className="flex w-fit items-center gap-2.5 text-base text-[#875e46] hover:text-[#543626]"><Phone size={18} aria-hidden="true" />+91 8510879296</a></div></section>
      </div>
    </main>
  );
}
