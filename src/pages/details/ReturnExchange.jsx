import React from "react";
import { FaUndo, FaExchangeAlt, FaClock, FaCheckCircle } from "react-icons/fa";

export default function ReturnExchange() {
  return (
    <section className="bg-brand-bg min-h-screen py-5 px-4 md:px-16">
      {/* Heading */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-primary-500 mb-4">Return & Exchange Policy</h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          We want you to love your purchase! If something isn’t right, we're here to help with easy returns and exchanges.
        </p>
      </div>

      {/* Info Cards */}
      <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto mb-16">
        <div className="bg-primary-50 p-6 rounded-xl shadow-lg hover:shadow-2xl transition text-center">
          <FaUndo className="text-primary-500 text-5xl mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Easy Returns</h3>
          <p className="text-gray-600">Return products hassle-free within 7 days of delivery.</p>
        </div>

        <div className="bg-primary-50 p-6 rounded-xl shadow-lg hover:shadow-2xl transition text-center">
          <FaExchangeAlt className="text-yellow-500 text-5xl mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Quick Exchange</h3>
          <p className="text-gray-600">Exchange your product easily if you received the wrong or damaged item.</p>
        </div>

        <div className="bg-primary-50 p-6 rounded-xl shadow-lg hover:shadow-2xl transition text-center">
          <FaClock className="text-green-500 text-5xl mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Fast Processing</h3>
          <p className="text-gray-600">We process returns & exchanges within 48 hours after approval.</p>
        </div>
      </div>

      {/* Policy Details */}
      <div className="max-w-4xl mx-auto bg-primary-50 p-10 rounded-2xl shadow-xl border border-primary-100 mb-20">
        <h2 className="text-3xl font-bold text-primary-500 mb-4">Our Return Policy</h2>
        <ul className="text-brand-text space-y-4 leading-relaxed">
          <li>✔ Items must be returned within 7 days of delivery.</li>
          <li>✔ Product must be unused, unworn, and in original packaging.</li>
          <li>✔ Returns are accepted only for damaged, defective, or incorrect items.</li>
          <li>✔ Refunds are issued as store credit or back to the original payment method.</li>
        </ul>

        <h2 className="text-3xl font-bold text-primary-500 mt-10 mb-4">Exchange Policy</h2>
        <ul className="text-brand-text space-y-4 leading-relaxed">
          <li>✔ Exchanges allowed for size issues or damaged/wrong items received.</li>
          <li>✔ Exchange requests must be raised within 7 days of delivery.</li>
          <li>✔ New product will be shipped once the original item is received.</li>
        </ul>
      </div>

      {/* Steps Section */}
      <div className="bg-primary-500 text-white py-16 text-center">
        <h2 className="text-4xl font-bold mb-6">How to Start a Return?</h2>
        <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-8 px-4">
          <div className="bg-brand-bg text-primary-600 p-6 rounded-xl shadow-lg">
            <FaCheckCircle className="text-4xl mb-2 mx-auto" />
            <h3 className="font-bold text-xl mb-2">Step 1</h3>
            <p className="text-brand-text">Go to the Contact Us page and submit your issue with order details.</p>
          </div>

          <div className="bg-brand-bg text-primary-600 p-6 rounded-xl shadow-lg">
            <FaCheckCircle className="text-4xl mb-2 mx-auto" />
            <h3 className="font-bold text-xl mb-2">Step 2</h3>
            <p className="text-brand-text">Our team will review your request and approve it within 24–48 hours.</p>
          </div>

          <div className="bg-brand-bg text-primary-600 p-6 rounded-xl shadow-lg">
            <FaCheckCircle className="text-4xl mb-2 mx-auto" />
            <h3 className="font-bold text-xl mb-2">Step 3</h3>
            <p className="text-brand-text">Ship the product back & receive your refund or exchanged product.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
