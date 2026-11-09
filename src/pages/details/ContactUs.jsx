import React from "react";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaClock } from "react-icons/fa";

export default function ContactUs() {
  return (
    <section className="bg-white min-h-screen">
      {/* Hero Section */}
      <div className="text-center py-5 px-4">
        <h1 className="text-5xl font-bold text-primary-500 mb-4">Contact Us</h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          We're here to help! Feel free to get in touch for any queries, feedback, or support.
        </p>
      </div>

      {/* Contact Info Cards */}
      <div className="grid md:grid-cols-4 gap-6 max-w-6xl mx-auto px-4 mb-16">
        <div className="bg-primary-50 shadow-lg hover:shadow-2xl transition rounded-xl p-6 text-center">
          <FaPhoneAlt className="text-primary-500 text-4xl mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Phone</h3>
          <p className="text-gray-600">+91 8510879296</p>
        </div>

        <div className="bg-primary-50 shadow-lg hover:shadow-2xl transition rounded-xl p-6 text-center">
          <FaEnvelope className="text-yellow-500 text-4xl mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Email</h3>
          <p className="text-gray-600">nishasagar8510@gmail.com</p>
        </div>

        <div className="bg-primary-50 shadow-lg hover:shadow-2xl transition rounded-xl p-6 text-center">
          <FaMapMarkerAlt className="text-green-500 text-4xl mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Address</h3>
          <p className="text-gray-600">Gf 58 pocket 13 Rohini sector 24 near babosa mandir, Delhi</p>
        </div>

        <div className="bg-primary-50 shadow-lg hover:shadow-2xl transition rounded-xl p-6 text-center">
          <FaClock className="text-blue-500 text-4xl mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Working Hours</h3>
          <p className="text-gray-600">Mon – Sat: 9 AM – 7 PM</p>
        </div>
      </div>

      {/* Form Section */}
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10 px-4 pb-16">
        {/* Form */}
        <div className="bg-primary-50 p-8 rounded-2xl shadow-xl border border-primary-100">
          <h2 className="text-3xl font-bold text-primary-500 mb-6">Send us a message</h2>

          <form className="space-y-6">
            <div className="relative group">
              <input
                type="text"
                className="w-full p-3 rounded-lg bg-primary-50/40 border border-gray-200 focus:border-primary-500 focus:bg-white transition outline-none"
                required
              />
              <label className="absolute left-3 top-3 text-gray-500 text-sm pointer-events-none group-focus-within:text-primary-500 transition">
                Your Name
              </label>
            </div>

            <div className="relative group">
              <input
                type="email"
                className="w-full p-3 rounded-lg bg-primary-50/40 border border-gray-200 focus:border-primary-500 focus:bg-white transition outline-none"
                required
              />
              <label className="absolute left-3 top-3 text-gray-500 text-sm pointer-events-none group-focus-within:text-primary-500 transition">
                Email Address
              </label>
            </div>

            <div className="relative group">
              <input
                type="text"
                className="w-full p-3 rounded-lg bg-primary-50/40 border border-gray-200 focus:border-primary-500 focus:bg-white transition outline-none"
                required
              />
              <label className="absolute left-3 top-3 text-gray-500 text-sm pointer-events-none group-focus-within:text-primary-500 transition">
                Subject
              </label>
            </div>

            <div className="relative group">
              <textarea
                rows="4"
                className="w-full p-3 rounded-lg bg-primary-50/40 border border-gray-200 focus:border-primary-500 focus:bg-white transition outline-none"
                required
              ></textarea>
              <label className="absolute left-3 top-3 text-gray-500 text-sm pointer-events-none group-focus-within:text-primary-500 transition">
                Message
              </label>
            </div>

            <button className="w-full bg-primary-500 text-white py-3 rounded-full text-lg font-semibold hover:bg-primary-600 transition">
              Send Message
            </button>
          </form>
        </div>

        {/* Google Map */}
        <div className="rounded-2xl overflow-hidden shadow-xl">
          <iframe
            title="map"
            className="w-full h-full min-h-[400px]"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14014.711338103568!2d77.205294!3d28.628901!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cfd35d8e9c0cd%3A0x4ff7c8b8c6fe4894!2sNew%20Delhi%2C%20Delhi!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>

      {/* Extra Contact Details Section */}
      <div className="max-w-6xl mx-auto px-4 pb-20">
        <div className="bg-white rounded-2xl shadow-xl p-10 grid md:grid-cols-3 gap-10 border border-primary-100">
          <div>
            <h3 className="text-xl font-bold text-primary-500 mb-2">Customer Support</h3>
            <p className="text-gray-600 leading-relaxed">Our team is available 24/7 to assist you with product inquiries, delivery issues, returns, or any store-related support.</p>
          </div>

          <div>
            <h3 className="text-xl font-bold text-primary-500 mb-2">Business Collaboration</h3>
            <p className="text-gray-600 leading-relaxed">For partnership opportunities, bulk orders, influencer tie‑ups, or wholesale queries—reach out and we’ll get back within 24 hours.</p>
          </div>

          <div>
            <h3 className="text-xl font-bold text-primary-500 mb-2">Order & Shipping Info</h3>
            <p className="text-gray-600 leading-relaxed">Track your order, request changes, or get updates related to shipments directly from our support team anytime.</p>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="bg-primary-500 py-16 text-white text-center px-4">
        <h2 className="text-4xl font-bold mb-4">We Value Your Feedback</h2>
        <p className="max-w-2xl mx-auto text-lg mb-6">
          Have suggestions or special requests? We're always looking to improve and would love to hear your thoughts.
        </p>
        <button className="bg-white text-primary-600 font-semibold px-8 py-3 rounded-full shadow-lg hover:bg-primary-50 transition">
          Share Feedback
        </button>
      </div>
    </section>
  );
}
