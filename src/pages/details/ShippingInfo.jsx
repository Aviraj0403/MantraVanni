import React from "react";
import { Truck, Clock, Globe, Phone, Mail, MapPin, ShieldCheck, Package, RefreshCcw } from "lucide-react";
import { motion } from "framer-motion";

export default function ShippingInfo() {
  return (
    <section className="bg-gradient-to-br from-primary-50 to-white min-h-screen p-6 md:p-14">
      {/* Header */}
      <div className="text-center mb-16">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl md:text-6xl font-extrabold text-primary-600 drop-shadow-sm"
        >
          Shipping Information
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-gray-600 max-w-2xl mx-auto text-lg mt-4"
        >
          Fast, Safe & Reliable delivery experience across India.
        </motion.p>
      </div>

      {/* Highlight Banner */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white shadow-xl rounded-3xl border border-primary-200 p-6 md:p-10 mb-16 flex flex-col md:flex-row items-center gap-6 justify-between"
      >
        <div className="flex items-center gap-4">
          <ShieldCheck size={45} className="text-primary-600" />
          <div>
            <h3 className="text-2xl font-semibold text-brand-text">100% Secure Delivery</h3>
            <p className="text-gray-600 text-sm">Your items are packed with premium protection.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Package size={45} className="text-primary-600" />
          <div>
            <h3 className="text-2xl font-semibold text-brand-text">Live Order Tracking</h3>
            <p className="text-gray-600 text-sm">Track your parcel anytime after dispatch.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Cards Section */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
        {/* Shipping Policy */}
        <motion.div
          whileHover={{ scale: 1.03 }}
          className="bg-white shadow-lg rounded-2xl p-7 border border-primary-100 hover:shadow-primary-200 transition"
        >
          <div className="flex items-center gap-3 mb-4">
            <Truck className="text-primary-600" size={28} />
            <h2 className="text-xl font-semibold text-brand-text">Shipping Policy</h2>
          </div>
          <p className="text-gray-600 leading-relaxed">
            Orders are processed within <strong>1–2 business days</strong>. We use trusted courier partners to ensure fast & safe deliveries.
          </p>
        </motion.div>

        {/* Delivery Timeframes */}
        <motion.div
          whileHover={{ scale: 1.03 }}
          className="bg-white shadow-lg rounded-2xl p-7 border border-primary-100 hover:shadow-primary-200 transition"
        >
          <div className="flex items-center gap-3 mb-4">
            <Clock className="text-primary-600" size={28} />
            <h2 className="text-xl font-semibold text-brand-text">Delivery Time</h2>
          </div>
          <ul className="text-gray-600 space-y-2 text-sm">
            <li>• Local / Within City: <strong>1–3 days</strong></li>
            <li>• Within State: <strong>2–5 days</strong></li>
            <li>• Metro Cities: <strong>3–6 days</strong></li>
            <li>• Rest of India: <strong>5–9 days</strong></li>
            <li>• Remote Areas: <strong>7–12 days</strong></li>
          </ul>
        </motion.div>

        {/* Shipping Charges */}
        <motion.div
          whileHover={{ scale: 1.03 }}
          className="bg-white shadow-lg rounded-2xl p-7 border border-primary-100 hover:shadow-primary-200 transition"
        >
          <div className="flex items-center gap-3 mb-4">
            <Globe className="text-primary-600" size={28} />
            <h2 className="text-xl font-semibold text-brand-text">Shipping Charges</h2>
          </div>
          <p className="text-gray-600 leading-relaxed text-sm">
            Orders below ₹999 may include standard shipping fees. Orders above ₹999 qualify for <strong>Free Shipping</strong>.
          </p>
        </motion.div>

        {/* Order Processing */}
        <motion.div
          whileHover={{ scale: 1.03 }}
          className="bg-white shadow-lg rounded-2xl p-7 border border-primary-100 hover:shadow-primary-200 transition"
        >
          <div className="flex items-center gap-3 mb-4">
            <Clock className="text-primary-600" size={28} />
            <h2 className="text-xl font-semibold text-brand-text">Order Processing</h2>
          </div>
          <p className="text-gray-600 leading-relaxed text-sm">
            After placing an order, items are packed carefully and dispatched within <strong>1–2 days</strong>. You will receive your tracking details instantly after dispatch.
          </p>
        </motion.div>

        {/* Tracking Info */}
        <motion.div
          whileHover={{ scale: 1.03 }}
          className="bg-white shadow-lg rounded-2xl p-7 border border-primary-100 hover:shadow-primary-200 transition"
        >
          <div className="flex items-center gap-3 mb-4">
            <MapPin className="text-primary-600" size={28} />
            <h2 className="text-xl font-semibold text-brand-text">Order Tracking</h2>
          </div>
          <p className="text-gray-600 leading-relaxed text-sm">
            Tracking info will be shared via <strong>SMS, Email or WhatsApp</strong> as soon as the courier picks up your order.
          </p>
        </motion.div>

        {/* Easy Returns */}
        <motion.div
          whileHover={{ scale: 1.03 }}
          className="bg-white shadow-lg rounded-2xl p-7 border border-primary-100 hover:shadow-primary-200 transition"
        >
          <div className="flex items-center gap-3 mb-4">
            <RefreshCcw className="text-primary-600" size={28} />
            <h2 className="text-xl font-semibold text-brand-text">Easy Returns</h2>
          </div>
          <p className="text-gray-600 leading-relaxed text-sm">
            If you face any issue, you can request a return/exchange within 2 days of delivery through our support team.
          </p>
        </motion.div>

        {/* Support */}
        <motion.div
          whileHover={{ scale: 1.03 }}
          className="bg-white shadow-lg rounded-2xl p-7 border border-primary-100 hover:shadow-primary-200 transition"
        >
          <div className="flex items-center gap-3 mb-4">
            <Phone className="text-primary-600" size={28} />
            <h2 className="text-xl font-semibold text-brand-text">Customer Support</h2>
          </div>
          <p className="text-gray-600 leading-relaxed text-sm">We're always here to help:</p>

          <ul className="text-brand-text mt-3 space-y-1 text-sm">
            <li className="flex items-center gap-2"><Mail size={18} />nishasagar8510@gmail.com</li>
            <li className="flex items-center gap-2"><Phone size={18} />+91 8510879296</li>
          </ul>
        </motion.div>
      </div>

      {/* CTA */}
      <div className="text-center mt-20">
        <motion.button
          whileHover={{ scale: 1.05 }}
          className="bg-primary-600 hover:bg-primary-700 text-white px-10 py-3 rounded-2xl shadow-lg text-lg font-semibold transition"
        >
          Contact Support
        </motion.button>
      </div>
    </section>
  );
}
