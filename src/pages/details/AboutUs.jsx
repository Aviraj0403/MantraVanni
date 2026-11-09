// src/pages/AboutUs.jsx
import React from "react";
import { FaHeart, FaLeaf, FaGift, FaBullseye, FaUsers, FaStar, FaShoppingBag } from "react-icons/fa";
import img from "../../image/about (2).png";

export default function AboutUs() {
  return (
    <section className="bg-gradient-to-r from-primary-50 to-white min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-primary-100">
        <img
          src={img}
          alt="Hero"
          className="w-full h-130 object-cover "
        />
       
      </div>

      {/* Our Story Section */}
      <div className="grid md:grid-cols-2 gap-10 items-center py-16 px-4 md:px-16">
        <div>
          <h2 className="text-4xl font-semibold text-primary-500 mb-6">Our Story</h2>
          <p className="text-brand-text mb-4">
            At Puja Samagri, we believe devotion lives in the details. Our collection brings authentic puja essentials, sacred idols, incense, diyas, and thoughtful gifts together for homes that honour tradition.
          </p>
          <p className="text-brand-text mb-4">
            Every product is selected with care, respect for craftsmanship, and a promise of authenticity. From daily prayers to festivals and new beginnings, we help you create a more meaningful ritual at home.
          </p>
          <p className="text-brand-text">
            Puja Samagri is a trusted companion for devotees across India, making sacred living feel beautiful, accessible, and deeply personal.
          </p>
        </div>
        <img
          src={img}
          alt="Our Journey"
          className="w-full rounded-xl shadow-lg object-cover"
        />
      </div>

      {/* Milestones / Stats */}
      <div className="bg-primary-50 py-16 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-primary-500 mb-8">Our Achievements</h2>
        <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto">
          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition">
            <FaHeart className="text-primary-500 text-4xl mb-2 mx-auto" />
            <h3 className="text-3xl font-bold mb-2">10K+</h3>
            <p className="text-gray-600">Happy Customers</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition">
            <FaShoppingBag className="text-yellow-500 text-4xl mb-2 mx-auto" />
            <h3 className="text-3xl font-bold mb-2">500+</h3>
            <p className="text-gray-600">Products Curated</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition">
            <FaStar className="text-green-500 text-4xl mb-2 mx-auto" />
            <h3 className="text-3xl font-bold mb-2">5K+</h3>
            <p className="text-gray-600">Positive Reviews</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition">
            <FaGift className="text-primary-500 text-4xl mb-2 mx-auto" />
            <h3 className="text-3xl font-bold mb-2">50+</h3>
            <p className="text-gray-600">Awards & Recognitions</p>
          </div>
        </div>
      </div>

      {/* Mission & Vision */}
      <div className="grid md:grid-cols-2 gap-10 py-16 px-4 md:px-16">
        <div className="bg-gradient-to-tr from-primary-100 to-primary-200 p-8 rounded-xl shadow-lg hover:shadow-2xl transition text-center">
          <FaBullseye className="text-primary-500 text-5xl mb-4 mx-auto" />
          <h3 className="text-3xl font-semibold mb-2">Our Mission</h3>
          <p className="text-brand-text">
            Make authentic, beautiful puja essentials easy to find and worthy of every sacred moment.
          </p>
        </div>
        <div className="bg-gradient-to-tr from-yellow-100 to-yellow-200 p-8 rounded-xl shadow-lg hover:shadow-2xl transition text-center">
          <FaUsers className="text-yellow-500 text-5xl mb-4 mx-auto" />
          <h3 className="text-3xl font-semibold mb-2">Our Vision</h3>
          <p className="text-brand-text">
            To be India's most loved destination for authentic devotional products and thoughtful service.
          </p>
        </div>
      </div>

      {/* Our Values */}
      <div className="text-center py-16 px-4 md:px-16 bg-primary-50">
        <h2 className="text-4xl font-bold text-primary-500 mb-12">Why Choose Us</h2>
        <div className="grid md:grid-cols-3 gap-10 max-w-5xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-2xl transition text-center">
            <FaHeart className="text-primary-500 text-5xl mb-4 mx-auto" />
            <h3 className="font-bold text-2xl mb-2">Customer Love</h3>
            <p className="text-gray-600">
              Personalized care and amazing shopping experience for every customer.
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-2xl transition text-center">
            <FaLeaf className="text-green-500 text-5xl mb-4 mx-auto" />
            <h3 className="font-bold text-2xl mb-2">Quality Products</h3>
            <p className="text-gray-600">
              Only the best makes it to our store. Quality and authenticity guaranteed.
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-2xl transition text-center">
            <FaGift className="text-yellow-500 text-5xl mb-4 mx-auto" />
            <h3 className="font-bold text-2xl mb-2">Thoughtful Selection</h3>
            <p className="text-gray-600">
              Every product curated to bring devotion, warmth, and beauty into your home.
            </p>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-16 px-4 md:px-16">
        <h2 className="text-4xl font-bold text-primary-500 mb-12 text-center">What Our Customers Say</h2>
        <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition">
            <p className="text-brand-text mb-4">
              "Absolutely love the curated products! The quality and service are exceptional."
            </p>
            <h4 className="font-semibold text-primary-500">– Anjali Sharma</h4>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition">
            <p className="text-brand-text mb-4">
              "Fast delivery and beautiful packing. Puja Samagri made our festival shopping so easy!"
            </p>
            <h4 className="font-semibold text-primary-500">– Priya Singh</h4>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition">
            <p className="text-brand-text mb-4">
              "The selection is amazing! Every product feels thoughtfully chosen."
            </p>
            <h4 className="font-semibold text-primary-500">– Ritu Verma</h4>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center py-16 bg-primary-100">
        <h2 className="text-4xl font-bold text-primary-500 mb-4">Join Our Community</h2>
        <p className="text-brand-text mb-6 max-w-2xl mx-auto">
          Be the first to know about new arrivals, festive collections, and sacred gifting ideas.
        </p>
        <button className="bg-primary-500 text-white font-semibold px-8 py-4 rounded-full hover:bg-primary-600 transition text-lg">
          Subscribe Now
        </button>
      </div>
    </section>
  );
}