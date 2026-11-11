import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, ChevronRight, Truck, Clock, MapPin, Package, PackageCheck, Mail, Phone, ArrowRight, Plus, RotateCcw } from "lucide-react";

const deliveryWindows = [
  { destination: "Local / within city", time: "1–3 days", width: "w-[18%]" },
  { destination: "Within state", time: "2–5 days", width: "w-[35%]" },
  { destination: "Metro cities", time: "3–6 days", width: "w-[48%]" },
  { destination: "Rest of India", time: "5–9 days", width: "w-[72%]" },
  { destination: "Remote areas", time: "7–12 days", width: "w-full" },
];

const journey = [
  { title: "Order received", description: "Your order begins its journey with us." },
  { title: "Packed with care", description: "Processed and prepared in 1–2 business days." },
  { title: "On its way", description: "Tracking details are shared after dispatch." },
];

const questions = [
  { question: "Where can I find my tracking details?", answer: "Tracking information is shared via SMS, email or WhatsApp once the courier picks up your order. You can also visit the Track Order page for updates." },
  { question: "How soon will my order be dispatched?", answer: "Orders are processed within 1–2 business days. Your items are carefully packed before being handed over to our courier partner." },
  { question: "What if I need help with my delivery?", answer: "Contact support@mantravanni.com or call +91 8510879296 with your order details. Our team can help with shipping queries, order updates and delivery issues." },
];

export default function ShippingInfo() {
  return (
    <main className="min-h-screen bg-[#faf8f2] text-[#45503c] [&_a:focus-visible]:outline-2 [&_a:focus-visible]:outline-offset-4 [&_a:focus-visible]:outline-[#8c9a70]">
      <header className="relative overflow-hidden border-b border-[#dfe3d3] bg-[#eaf0e2]">
        <div className="pointer-events-none absolute -right-24 -top-32 size-[460px] rounded-full border border-[#a6b28c]/15 shadow-[0_0_0_60px_#a6b28c08,0_0_0_120px_#a6b28c05]" aria-hidden="true" />
        <div className="relative mx-auto max-w-[1240px] px-5 pb-10 pt-6 sm:px-8 sm:pb-14 lg:px-10">
          <nav aria-label="Breadcrumb" className="mb-9 flex items-center gap-2 text-[10px] text-[#879274] sm:mb-12"><Link to="/" className="hover:text-[#435434]">Home</Link><ChevronRight size={12} aria-hidden="true" /><span aria-current="page" className="text-[#5e7050]">Shipping information</span></nav>
          <div className="grid min-w-0 gap-8 lg:grid-cols-[1.4fr_.8fr] lg:items-end lg:gap-14">
            <div><p className="mb-4 flex items-center gap-2.5 text-[9px] font-semibold tracking-[.22em] text-[#7f8d67] sm:text-[10px]"><span className="h-px w-7 bg-[#9ba982]" aria-hidden="true" />FROM OUR HANDS TO YOUR HOME</p><h1 className="font-serif text-[39px] font-normal leading-[1.1] tracking-[-.04em] text-[#3b4a32] sm:text-[54px] lg:text-[62px]">Thoughtfully packed.<br /><em className="font-normal text-[#7e8d61]">On its way to you.</em></h1><p className="mt-5 max-w-[430px] text-[13px] leading-7 text-[#7b866e]">Everything you need to know about your MantraVanni delivery, from the first careful fold to your doorstep.</p></div>
            <div className="rounded-[22px] bg-[#35442f] p-6 text-[#edf0e1] sm:p-7"><div className="mb-5 flex items-center justify-between"><PackageCheck size={29} strokeWidth={1.2} className="text-[#bfcea4]" aria-hidden="true" /><span className="rounded-full border border-[#c0cea7]/25 px-2.5 py-1 text-[8px] tracking-[.13em] text-[#c6d2b3]">ORDER UPDATES</span></div><h2 className="font-serif text-[25px] font-normal text-[#f0f2e4]">Something on the way?</h2><p className="mt-2 text-xs leading-6 text-[#bec9af]">Follow your parcel and find the latest updates in one place.</p><Link to="/track-order" className="mt-5 flex items-center justify-between border-t border-[#c0cea7]/20 pt-4 text-xs font-medium text-[#e2edce] transition-colors hover:text-white">Track your order<ArrowUpRight size={17} aria-hidden="true" /></Link></div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1240px] px-5 pb-12 sm:px-8 sm:pb-16 lg:px-10">
        <div className="grid grid-cols-1 gap-3 py-7 sm:grid-cols-3 sm:gap-4 sm:py-9">
          <div className="flex items-center gap-3 rounded-2xl border border-[#e1e3d6] bg-[#fffefa] px-5 py-5"><Clock size={21} strokeWidth={1.4} className="shrink-0 text-[#8d9a73]" aria-hidden="true" /><div><p className="text-[13px] font-medium text-[#536044]">1–2 business days</p><p className="mt-1 text-[10px] text-[#99a08e]">Order processing</p></div></div>
          <div className="flex items-center gap-3 rounded-2xl border border-[#e1e3d6] bg-[#fffefa] px-5 py-5"><Truck size={21} strokeWidth={1.4} className="shrink-0 text-[#8d9a73]" aria-hidden="true" /><div><p className="text-[13px] font-medium text-[#536044]">Delivery across India</p><p className="mt-1 text-[10px] text-[#99a08e]">With trusted courier partners</p></div></div>
          <div className="flex items-center gap-3 rounded-2xl border border-[#e1e3d6] bg-[#fffefa] px-5 py-5"><Package size={21} strokeWidth={1.4} className="shrink-0 text-[#8d9a73]" aria-hidden="true" /><div><p className="text-[13px] font-medium text-[#536044]">Free shipping</p><p className="mt-1 text-[10px] text-[#99a08e]">On orders above ₹999</p></div></div>
        </div>

        <div className="grid min-w-0 grid-cols-1 items-start gap-6 lg:grid-cols-[1.5fr_1fr] lg:gap-8">
          <div className="min-w-0 space-y-6">
            <section className="overflow-hidden rounded-[22px] border border-[#e1e3d6] bg-[#fffefa]" aria-labelledby="delivery-time-heading">
              <div className="px-5 pb-5 pt-6 sm:px-7 sm:pt-7"><p className="mb-2 text-[9px] font-medium tracking-[.2em] text-[#9aa67f]">A LITTLE PLANNING GOES A LONG WAY</p><h2 id="delivery-time-heading" className="font-serif text-[28px] font-normal tracking-tight text-[#4c5a3d] sm:text-[32px]">When will it reach you?</h2><p className="mt-2 text-xs leading-6 text-[#969e89]">Delivery windows depend on your destination.</p></div>
              <table className="w-full border-collapse text-left"><caption className="sr-only">Estimated delivery time by destination</caption><thead><tr className="border-y border-[#e6e8dc] bg-[#f5f7ef] text-[9px] tracking-[.1em] text-[#879372]"><th scope="col" className="px-5 py-3 font-medium sm:px-7">DESTINATION</th><th scope="col" className="px-5 py-3 text-right font-medium sm:px-7">ESTIMATED TIME</th></tr></thead><tbody>{deliveryWindows.map(({ destination, time, width }) => (<tr key={destination} className="border-b border-[#ecede5] last:border-b-0"><th scope="row" className="px-5 py-4 text-xs font-normal text-[#6e795f] sm:px-7 sm:text-[13px]">{destination}</th><td className="px-5 py-4 text-right sm:px-7"><span className="text-xs font-medium text-[#5f7049]">{time}</span><span className="ml-auto mt-2 block h-0.5 w-20 overflow-hidden rounded-full bg-[#edf0e5]" aria-hidden="true"><span className={`block h-full rounded-full bg-[#bdc9a5] ${width}`} /></span></td></tr>))}</tbody></table>
              <p className="border-t border-[#e6e8dc] bg-[#f9faf5] px-5 py-4 text-[10px] leading-5 text-[#969e89] sm:px-7">These are estimated delivery windows. Your tracking updates provide the latest status of your parcel.</p>
            </section>

            <section className="rounded-[22px] border border-[#e1e3d6] bg-[#fffefa] p-5 sm:p-7" aria-labelledby="order-journey-heading"><p className="mb-2 text-[9px] font-medium tracking-[.2em] text-[#9aa67f]">THE JOURNEY TO YOUR DOOR</p><h2 id="order-journey-heading" className="font-serif text-[26px] font-normal text-[#4c5a3d]">A little care at every step.</h2><ol className="mt-6 grid gap-5 sm:grid-cols-3 sm:gap-4">{journey.map((step, index) => (<li key={step.title}><div className="mb-3 flex items-center gap-3"><span className="grid size-7 shrink-0 place-items-center rounded-full border border-[#d2d9c3] bg-[#f0f3e8] text-[10px] text-[#87956c]">0{index + 1}</span><span className="h-px flex-1 bg-[#e1e5d6]" aria-hidden="true" /></div><h3 className="font-sans text-xs font-medium text-[#667451]">{step.title}</h3><p className="mt-2 text-[11px] leading-6 text-[#9aa18d]">{step.description}</p></li>))}</ol></section>
          </div>

          <aside className="min-w-0 space-y-5" aria-label="Shipping charges and assistance">
            <section className="rounded-[22px] border border-[#ddd8c7] bg-[#eee8db] p-6 sm:p-7"><div className="mb-4 flex items-center gap-2 text-[9px] font-medium tracking-[.18em] text-[#a08b68]"><Package size={15} aria-hidden="true" />SHIPPING CHARGES</div><h2 className="font-serif text-[28px] font-normal text-[#6d5c41]">A little more.<br /><em className="font-normal text-[#9c855f]">Delivered for less.</em></h2><div className="mt-5 flex items-center justify-between gap-3 rounded-xl border border-[#d8ceb8] bg-[#f8f4ea] p-4"><span className="text-xs text-[#948162]">Orders above ₹999</span><span className="text-xs font-semibold text-[#6c7850]">FREE</span></div><p className="mt-4 text-xs leading-6 text-[#a08d6e]">Orders below ₹999 may include standard shipping fees.</p></section>
            <section className="rounded-[22px] border border-[#e1e3d6] bg-[#fffefa] p-6 sm:p-7"><MapPin size={22} strokeWidth={1.3} className="mb-4 text-[#9aaa7f]" aria-hidden="true" /><h2 className="font-serif text-[25px] font-normal text-[#586746]">Stay in the loop.</h2><p className="mt-3 text-xs leading-7 text-[#969e89]">Once the courier picks up your order, tracking details are shared via SMS, email or WhatsApp.</p><Link to="/track-order" className="mt-4 inline-flex items-center gap-5 text-xs font-medium text-[#7c8d5e] hover:text-[#465437]">Find my order<ArrowUpRight size={15} aria-hidden="true" /></Link></section>
            <section className="rounded-[22px] bg-[#e9eddf] p-6 sm:p-7"><p className="mb-3 text-[9px] font-medium tracking-[.18em] text-[#8b9870]">WE'RE HERE TO HELP</p><h2 className="font-serif text-[25px] font-normal text-[#566544]">A question about delivery?</h2><div className="mt-4 space-y-3"><a href="mailto:support@mantravanni.com" className="flex w-fit items-center gap-2.5 break-all text-xs text-[#78865f] hover:text-[#465437]"><Mail size={14} className="shrink-0" aria-hidden="true" />support@mantravanni.com</a><a href="tel:+918510879296" className="flex w-fit items-center gap-2.5 text-xs text-[#78865f] hover:text-[#465437]"><Phone size={14} aria-hidden="true" />+91 8510879296</a></div><Link to="/contact-us" className="mt-5 inline-flex items-center gap-5 rounded-full bg-[#596a43] px-5 py-3 text-[11px] text-[#f4f6e9] transition-colors hover:bg-[#3c4a2e]">Contact support<ArrowUpRight size={14} aria-hidden="true" /></Link></section>
          </aside>
        </div>

        <section className="mt-10 grid gap-6 border-t border-[#dfe3d3] pt-9 sm:mt-12 lg:grid-cols-[.7fr_1.3fr] lg:gap-12" aria-labelledby="shipping-questions-heading"><div><p className="mb-3 text-[9px] font-medium tracking-[.2em] text-[#9aa67f]">GOOD TO KNOW</p><h2 id="shipping-questions-heading" className="font-serif text-[30px] font-normal leading-tight tracking-tight text-[#52613f]">A few things<br />you might be wondering.</h2><Link to="/faq" className="mt-5 inline-flex items-center gap-4 text-xs text-[#89986c] hover:text-[#465437]">More answers<ArrowRight size={14} aria-hidden="true" /></Link></div><div className="divide-y divide-[#e1e4d7] border-y border-[#e1e4d7]">{questions.map(({ question, answer }) => (<details key={question} className="group py-5"><summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-xs font-medium text-[#687752] outline-offset-4 focus-visible:outline-2 focus-visible:outline-[#8c9a70] [&::-webkit-details-marker]:hidden">{question}<Plus size={15} className="shrink-0 text-[#a1ae8a] transition-transform group-open:rotate-45 motion-reduce:transition-none" aria-hidden="true" /></summary><p className="mt-3 pr-6 text-xs leading-7 text-[#939d83]">{answer}</p></details>))}</div></section>
        <Link to="/return-exchange-policy" className="mt-8 flex items-center justify-between gap-5 rounded-2xl border border-[#e0e3d4] bg-[#f1f3eb] px-5 py-5 transition-colors hover:bg-[#e7ebdb] sm:px-7"><span className="flex items-center gap-3"><RotateCcw size={18} strokeWidth={1.4} className="shrink-0 text-[#9aa880]" aria-hidden="true" /><span><span className="block text-xs font-medium text-[#71815a]">Need a return or exchange?</span><span className="mt-1 block text-[10px] text-[#9da68e]">Read our policy and find your next steps.</span></span></span><ArrowUpRight size={16} className="shrink-0 text-[#9aa880]" aria-hidden="true" /></Link>
      </div>
    </main>
  );
}
