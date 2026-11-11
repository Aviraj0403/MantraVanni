import React, { useState } from "react";
import { Link } from "react-router-dom";
import useStoreProfile from "../../hooks/useStoreProfile";
import usePageMeta from "../../hooks/usePageMeta";
import { ArrowUpRight, ChevronRight, Phone, Mail, Clock, MapPin, Flower2, MessageCircle, Package, Gift, Check } from "lucide-react";

const inputClass = "mt-2 w-full rounded-xl border border-[#e5d9ca] bg-[#fcfaf6] px-4 py-3 text-sm text-[#4b382b] outline-none transition placeholder:text-[#b4a18d] hover:border-[#cdb69d] focus:border-[#a66542] focus:ring-2 focus:ring-[#a66542]/10";

export default function ContactUs() {
  const [draftReady, setDraftReady] = useState(false);
  const store = useStoreProfile();
  usePageMeta({ title: `Contact Us | ${store.name}`, description: `Get in touch with ${store.name} for order help, product questions and support.`, canonical: "/contact-us" });
  // Tenant settings first; the previous literals remain as a fallback until the settings carry them.
  const email = store.supportEmail || "support@mantravanni.com";
  const phone = store.supportPhone || "+91 8510879296";
  const phoneHref = phone.replace(/s+/g, "");

  const composeMessage = (event) => {
    event.preventDefault();
    const fields = new FormData(event.currentTarget);
    const name = String(fields.get("name") || "").trim();
    const email = String(fields.get("email") || "").trim();
    const subject = String(fields.get("subject") || "");
    const message = String(fields.get("message") || "").trim();
    const body = `Name: ${name}\nEmail: ${email}\n\n${message}`;
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setDraftReady(true);
  };

  return (
    <section className="min-h-screen bg-[#faf6ee] text-[#49372b] [&_a:focus-visible]:outline-2 [&_a:focus-visible]:outline-offset-4 [&_a:focus-visible]:outline-[#a66542]" aria-labelledby="contact-heading">
      <div className="relative isolate overflow-hidden border-b border-[#e9dfd1] bg-[#f1e7d7]">
        <Flower2 className="pointer-events-none absolute -right-12 top-8 -z-10 size-[340px] -rotate-12 text-[#b99a72]/10 sm:right-8" strokeWidth={0.6} aria-hidden="true" />
        <div className="mx-auto max-w-[1280px] px-5 pb-10 pt-6 sm:px-8 sm:pb-14 lg:px-10">
          <nav aria-label="Breadcrumb" className="mb-9 flex items-center gap-2 text-[10px] text-[#9a8067] sm:mb-12"><Link to="/" className="transition-colors hover:text-[#76472e]">Home</Link><ChevronRight size={12} aria-hidden="true" /><span aria-current="page" className="text-[#795b42]">Contact us</span></nav>
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div><p className="mb-3 flex items-center gap-2.5 text-[9px] font-semibold tracking-[.22em] text-[#9c6742] sm:text-[10px]"><span className="h-px w-7 bg-[#ad825b]" aria-hidden="true" />WE'RE JUST A CONVERSATION AWAY</p><h1 id="contact-heading" className="font-serif text-[42px] font-normal leading-[1.08] tracking-[-.04em] text-[#4b3627] sm:text-[58px] lg:text-[68px]">A little help.<br /><em className="font-normal text-[#a15e3b]">A warm conversation.</em></h1></div>
            <p className="max-w-[325px] text-[13px] leading-7 text-[#8c725a] lg:pb-1">A question about your order, a thoughtful gift or finding the right essentials? We'd love to hear from you.</p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1280px] px-5 pb-12 sm:px-8 sm:pb-16 lg:px-10">
        <div className="grid grid-cols-1 gap-3 py-7 sm:gap-4 sm:py-9 md:grid-cols-3">
          <a href={`tel:${phoneHref}`} className="group flex items-center gap-4 rounded-2xl border border-[#e7dccd] bg-[#fffdf9] px-5 py-5 transition-colors hover:border-[#bfa07e]">
            <span className="grid size-10 shrink-0 place-items-center rounded-full bg-[#f1e5d5] text-[#986a47]"><Phone size={18} strokeWidth={1.5} aria-hidden="true" /></span><div className="min-w-0 flex-1"><p className="mb-1 text-[9px] tracking-[.15em] text-[#a38a72]">GIVE US A CALL</p><p className="text-sm font-medium text-[#59412d]">{phone}</p></div><ArrowUpRight size={15} className="shrink-0 text-[#a98966]" aria-hidden="true" />
          </a>
          <a href={`mailto:${email}`} className="group flex min-w-0 items-center gap-4 rounded-2xl border border-[#e7dccd] bg-[#fffdf9] px-5 py-5 transition-colors hover:border-[#bfa07e]">
            <span className="grid size-10 shrink-0 place-items-center rounded-full bg-[#e8ebdf] text-[#747b53]"><Mail size={18} strokeWidth={1.5} aria-hidden="true" /></span><div className="min-w-0 flex-1"><p className="mb-1 text-[9px] tracking-[.15em] text-[#a38a72]">DROP US A NOTE</p><p className="break-all text-[12px] font-medium text-[#59412d]">{email}</p></div><ArrowUpRight size={15} className="shrink-0 text-[#a98966]" aria-hidden="true" />
          </a>
          <div className="flex items-center gap-4 rounded-2xl border border-[#e7dccd] bg-[#fffdf9] px-5 py-5"><span className="grid size-10 shrink-0 place-items-center rounded-full bg-[#eee4df] text-[#a27561]"><Clock size={18} strokeWidth={1.5} aria-hidden="true" /></span><div><p className="mb-1 text-[9px] tracking-[.15em] text-[#a38a72]">HERE FOR YOU</p><p className="text-sm font-medium text-[#59412d]">Mon–Sat · 9 AM–7 PM</p></div></div>
        </div>

        <div className="grid min-w-0 gap-6 lg:grid-cols-[1.05fr_.95fr] lg:gap-8">
          <div className="min-w-0 rounded-[24px] border border-[#e7dccd] bg-[#fffdf9] p-5 sm:p-8 lg:p-9">
            <div className="mb-7 flex items-start justify-between gap-4"><div><p className="mb-2 text-[9px] font-medium tracking-[.2em] text-[#ac825f]">LET'S TALK</p><h2 className="font-serif text-[29px] font-normal tracking-tight text-[#503b2b] sm:text-[32px]">What's on your mind?</h2><p className="mt-2 text-xs leading-6 text-[#99816c]">A few details will help us point you in the right direction.</p></div><MessageCircle className="mt-1 size-6 shrink-0 text-[#c5a27e]" strokeWidth={1.2} aria-hidden="true" /></div>

            <form onSubmit={composeMessage} className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div><label htmlFor="contact-name" className="text-xs font-medium text-[#755943]">Your name <span className="text-[#ae7956]">*</span></label><input id="contact-name" name="name" type="text" autoComplete="name" placeholder="Your full name" required maxLength={120} className={inputClass} /></div>
                <div><label htmlFor="contact-email" className="text-xs font-medium text-[#755943]">Email address <span className="text-[#ae7956]">*</span></label><input id="contact-email" name="email" type="email" autoComplete="email" placeholder="you@example.com" required maxLength={254} className={inputClass} /></div>
              </div>
              <div>
                <label htmlFor="contact-subject" className="text-xs font-medium text-[#755943]">How can we help? <span className="text-[#ae7956]">*</span></label>
                <select id="contact-subject" name="subject" required defaultValue="" className={inputClass}>
                  <option value="" disabled>Select a topic</option>
                  <option>Help with my order</option>
                  <option>Product enquiry</option>
                  <option>Returns or exchanges</option>
                  <option>Bulk orders & gifting</option>
                  <option>Partnerships & collaboration</option>
                  <option>Feedback or something else</option>
                </select>
              </div>
              <div><label htmlFor="contact-message" className="text-xs font-medium text-[#755943]">Your message <span className="text-[#ae7956]">*</span></label><textarea id="contact-message" name="message" rows={5} required maxLength={3000} placeholder="Tell us a little more. For order queries, please include your order number." className={`${inputClass} min-h-[140px] resize-y`} /></div>
              <div className="border-t border-[#ede4d8] pt-5"><button type="submit" aria-describedby="email-draft-note" className="inline-flex w-full cursor-pointer items-center justify-center gap-6 rounded-full bg-[#8d5033] px-6 py-3.5 text-xs font-medium text-[#fff5e5] transition-colors hover:bg-[#6e3b24] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8d5033] sm:w-auto">Compose your message<ArrowUpRight size={16} aria-hidden="true" /></button><p id="email-draft-note" className="mt-3 max-w-[390px] text-[10px] leading-5 text-[#a38b74]">Opens your email app with a draft ready to send. You can also email us directly at {email}.</p></div>
              {draftReady && <p role="status" className="flex items-start gap-2 rounded-xl border border-[#d9dfc8] bg-[#f1f4e9] p-3 text-xs leading-6 text-[#68744c]"><Check size={15} className="mt-1 shrink-0" aria-hidden="true" />Your email draft is ready. If your email app didn't open, use the email link above to reach us.</p>}
            </form>
          </div>

          <div className="flex min-w-0 flex-col gap-5">
            <div className="rounded-[24px] bg-[#eee4d5] p-6 sm:p-7"><div className="mb-3 flex items-center gap-2 text-[9px] font-medium tracking-[.18em] text-[#a37852]"><MapPin size={14} aria-hidden="true" />FIND US IN DELHI</div><h2 className="font-serif text-[26px] font-normal text-[#59402c]">Rooted here. Connected to you.</h2><p className="mt-3 max-w-[340px] text-xs leading-6 text-[#90765e]">GF 58, Pocket 13, Rohini Sector 24,<br />Near Babosa Mandir, Delhi.</p></div>
            {/* Existing Google Maps embed preserved. */}
            <div className="rounded-2xl overflow-hidden shadow-xl">
              <iframe
                title="Map showing our location"
                className="w-full h-full min-h-[400px]"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14014.711338103568!2d77.205294!3d28.628901!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cfd35d8e9c0cd%3A0x4ff7c8b8c6fe4894!2sNew%20Delhi%2C%20Delhi!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3 lg:mt-10">
          <Link to="/track-order" className="group flex items-start gap-4 rounded-2xl border border-[#e5d9c9] p-5 transition-colors hover:bg-[#f0e5d5]"><Package size={20} strokeWidth={1.4} className="mt-0.5 shrink-0 text-[#a67b55]" aria-hidden="true" /><div className="flex-1"><h3 className="font-sans text-sm font-medium text-[#694c35]">Looking for your order?</h3><p className="mt-1.5 text-xs leading-6 text-[#a0876d]">Follow its journey to your doorstep.</p></div><ArrowUpRight size={14} className="mt-1 shrink-0 text-[#aa8d6d]" aria-hidden="true" /></Link>
          <Link to="/faq" className="group flex items-start gap-4 rounded-2xl border border-[#e5d9c9] p-5 transition-colors hover:bg-[#f0e5d5]"><MessageCircle size={20} strokeWidth={1.4} className="mt-0.5 shrink-0 text-[#a67b55]" aria-hidden="true" /><div className="flex-1"><h3 className="font-sans text-sm font-medium text-[#694c35]">A quick question?</h3><p className="mt-1.5 text-xs leading-6 text-[#a0876d]">Our FAQs are a good place to start.</p></div><ArrowUpRight size={14} className="mt-1 shrink-0 text-[#aa8d6d]" aria-hidden="true" /></Link>
          <a href={`mailto:${email}?subject=Bulk%20orders%20%26%20gifting`} className="group flex items-start gap-4 rounded-2xl border border-[#e5d9c9] p-5 transition-colors hover:bg-[#f0e5d5]"><Gift size={20} strokeWidth={1.4} className="mt-0.5 shrink-0 text-[#a67b55]" aria-hidden="true" /><div className="flex-1"><h3 className="font-sans text-sm font-medium text-[#694c35]">Something special in mind?</h3><p className="mt-1.5 text-xs leading-6 text-[#a0876d]">Let's talk gifting and bulk orders.</p></div><ArrowUpRight size={14} className="mt-1 shrink-0 text-[#aa8d6d]" aria-hidden="true" /></a>
        </div>
      </div>
    </section>
  );
}
