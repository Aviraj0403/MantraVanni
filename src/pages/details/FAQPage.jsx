import React, { useState } from "react";
import { ChevronDown, ChevronUp, HelpCircle } from "lucide-react";

export default function FAQPage() {
  const faqs = [
    {
      q: "How long does delivery take?",
      a: "Delivery usually takes 3–7 business days depending on your location.",
    },
    {
      q: "Can I return a product?",
      a: "Yes, we offer a 7-day easy return policy on most products.",
    },
    {
      q: "Do you offer Cash on Delivery (COD)?",
      a: "Yes, COD is available on prepaid-verified accounts.",
    },
    {
      q: "Are your products original?",
      a: "We only sell 100% authentic and brand-certified products.",
    },
    {
      q: "How can I track my order?",
      a: "Once shipped, you will receive a tracking link via SMS/Email.",
    },
  ];

  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section className="bg-gradient-to-br from-primary-50 to-white min-h-screen p-6 md:p-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-primary-600 mb-4 flex justify-center items-center gap-2">
          <HelpCircle className="text-primary-500" size={40} /> FAQ
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto text-lg">
          Find answers to commonly asked questions.
        </p>
      </div>

      {/* FAQ Box */}
      <div className="max-w-3xl mx-auto space-y-4">
        {faqs.map((item, i) => (
          <div
            key={i}
            className="bg-brand-bg shadow-lg rounded-xl p-5 border border-primary-100 transition hover:shadow-xl hover:border-primary-300"
          >
            <button
              className="w-full flex justify-between items-center text-left"
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
            >
              <h3 className="text-lg md:text-xl font-semibold text-brand-text">
                {item.q}
              </h3>
              {openIndex === i ? (
                <ChevronUp className="text-primary-600" />
              ) : (
                <ChevronDown className="text-primary-600" />
              )}
            </button>

            {openIndex === i && (
              <p className="mt-3 text-gray-600 leading-relaxed border-t pt-3">
                {item.a}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Bottom CTA */}
      <div className="text-center mt-16">
        <button className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-xl shadow-lg text-lg font-semibold transition">
          Still Need Help?
        </button>
      </div>
    </section>
  );
}
