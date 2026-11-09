import React from "react";
import {
  FaInstagram,
  FaFacebookF,
  FaTwitter,
  FaHeart,
  FaTruck,
  FaShieldAlt,
  FaRegHeart,
  FaUndo,
  FaCcVisa,
  FaCcMastercard,
  FaCcPaypal,
  FaApplePay,
  FaCreditCard,
  FaGooglePay,
} from "react-icons/fa";
import { SiRazorpay, SiPhonepe } from "react-icons/si";
import { MapPin, Phone, Mail } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-[#fff1da] to-[#fffaf2] text-brand-text pt-10 border-t border-primary-200">
      {/* Newsletter Section */}
      {/* <div className="text-center mb-10 px-4">
        <h2 className="text-2xl font-semibold text-primary-600 mb-2 flex justify-center items-center gap-2 flex-wrap">
          <FaHeart className="text-primary-500" /> Join Our Beauty Club{" "}
          <FaHeart className="text-primary-500" />
        </h2>
        <p className="text-gray-600 mb-4 text-sm md:text-base">
          Subscribe to get special offers, beauty tips, and exclusive launches
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-3 w-full sm:w-auto">
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full sm:w-80 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-300"
          />
          <button className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-2 rounded-lg font-semibold w-full sm:w-auto">
            Subscribe
          </button>
        </div>
      </div> */}

      {/* Main Footer */}
      <div className="border-t border-gray-200 py-10 px-6 md:px-20 grid grid-cols-1 lg:grid-cols-4 gap-10">
        {/* Brand */}
        <div>
         <div className="flex items-center gap-3 mb-3">
  <span className="grid place-items-center w-12 h-12 rounded-full bg-[#a94217] text-[#fff1da] text-2xl">ॐ</span>
  <div>
    <strong className="block text-3xl text-[#63251a]">Puja Samagri</strong>
    <span className="text-xs uppercase tracking-[0.2em] text-[#c45c19]">Sacred living</span>
  </div>

 
</div>

          <p className="text-gray-600 mb-4 text-sm md:text-base">
            Bring the warmth of the temple into your home with authentic puja essentials,
            thoughtfully chosen for every sacred moment.
          </p>
          <div className="flex gap-3">
           <a
  href="https://www.instagram.com/"
  target="_blank"
  rel="noopener noreferrer"
  className="bg-primary-100 p-2 rounded-full text-primary-600 hover:bg-primary-200 transition"
>
  <FaInstagram />
</a>

            <a className="bg-primary-100 p-2 rounded-full text-primary-600 hover:bg-primary-200">
              <FaFacebookF />
            </a>
            <a className="bg-primary-100 p-2 rounded-full text-primary-600 hover:bg-primary-200">
              <FaTwitter />
            </a>
          </div>
        </div>

        {/* Shop + Customer Care (same row) */}
        <div className="col-span-1 md:col-span-2">
          <div className="grid grid-cols-2 gap-6">
            {/* Shop */}
            <div>
              <h4 className="font-semibold text-lg text-brand-text mb-3 border-l-2 border-primary-500 pl-2">
                Shop
              </h4>
              <ul className="space-y-2 text-gray-600 text-sm md:text-base">
                <li>New Arrivals</li>
                <li>Best Sellers</li>
                <li>Idols & Murtis</li>
                <li>Puja Samagri</li>
                <li>Incense & Diyas</li>
                <li>Festive Gifts</li>
              </ul>
            </div>

            {/* Customer Care */}
            <div>
              <h4 className="font-semibold text-lg text-brand-text mb-3 border-l-2 border-primary-500 pl-2">
                Customer Care
              </h4>
             <ul className="space-y-2 text-gray-600 text-sm md:text-base">
  <li>
    <Link to="/about-us" className="hover:text-primary-500 transition">
      About Us
    </Link>
  </li>
  <li>
    <Link to="/contact-us" className="hover:text-primary-500 transition">
      Contact Us
    </Link>
  </li>
  <li>
    <Link to="/track-order" className="hover:text-primary-500 transition">
      Track Order
    </Link>
  </li>
  <li>
    <Link to="/retun-exchnage-policy" className="hover:text-primary-500 transition">
      Returns & Exchange
    </Link>
  </li>
  <li>
    <Link to="/shipping-info" className="hover:text-primary-500 transition">
      Shipping Info
    </Link>
  </li>
  <li>
    <Link to="/faq" className="hover:text-primary-500 transition">
      FAQ
    </Link>
  </li>
</ul>
            </div>
          </div>
        </div>

        {/* Get in Touch */}
        <div>
          <h4 className="font-semibold text-lg text-brand-text mb-3 border-l-2 border-primary-500 pl-2">
            Get in Touch
          </h4>
          <ul className="space-y-3 text-gray-600 text-sm md:text-base">
            <li className="flex items-start gap-3">
              <MapPin className="text-primary-500 mt-1" size={18} />
              <span>Rohini, Delhi<br />Serving devotees across India</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="text-primary-500" size={18} />  +91 8510879296
            </li>
            <li className="flex items-center gap-3">
              <Mail className="text-primary-500" size={18} /> nishasagar8510@gmail.com
            </li>
          </ul>
        </div>
      </div>

      {/* Feature Icons */}
      <div className="border-t border-gray-200 py-8 px-6 md:px-20 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 text-brand-text">
        <div className="flex items-center justify-center md:justify-start gap-3 bg-white rounded-xl shadow-sm p-3">
          <FaTruck className="text-primary-500 text-xl" />
          <span className="text-sm md:text-base">Free Shipping</span>
        </div>
        <div className="flex items-center justify-center md:justify-start gap-3 bg-white rounded-xl shadow-sm p-3">
          <FaShieldAlt className="text-primary-500 text-xl" />
          <span className="text-sm md:text-base">Secure Payment</span>
        </div>
        <div className="flex items-center justify-center md:justify-start gap-3 bg-white rounded-xl shadow-sm p-3">
          <FaRegHeart className="text-primary-500 text-xl" />
          <span className="text-sm md:text-base">100% Authentic</span>
        </div>
        <div className="flex items-center justify-center md:justify-start gap-3 bg-white rounded-xl shadow-sm p-3">
          <FaUndo className="text-primary-500 text-xl" />
          <span className="text-sm md:text-base">Easy Returns</span>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-200 py-5 px-6 md:px-20 flex flex-col md:flex-row justify-between items-center text-gray-600 text-sm gap-3">
        <p className="text-center text-sm text-gray-600">
  © 2025 Puja Samagri. All rights reserved. | Made by{" "}
 <a
  href="https://www.jdinfotechsolutions.in/"
  target="_blank"
  rel="noopener noreferrer"
  className="font-semibold text-blue-600 hover:underline"
>
  JD Infotech Solutions
</a>

</p>

        {/* Payment Icons */}
        <div className="flex flex-wrap justify-center items-center gap-3 mt-2 md:mt-0">
          <span className="text-gray-500 text-sm">We Accept:</span>
          <FaCcVisa className="text-blue-600 text-2xl" />
          <FaCcMastercard className="text-red-500 text-2xl" />
          <FaCcPaypal className="text-blue-400 text-2xl" />
          <FaApplePay className="text-brand-text text-2xl" />
          <SiRazorpay className="text-blue-500 text-2xl" />
          <FaCreditCard className="text-brand-text text-2xl" />
          <SiPhonepe className="text-primary-500 text-2xl" />
          <FaGooglePay className="text-green-600 text-2xl" />
        </div>
      </div>
    </footer>
  );
}
