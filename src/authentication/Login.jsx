import React from "react";
import { motion } from "framer-motion";
import { FcGoogle } from "react-icons/fc";

export default function Login() {
  return (
    <div className="flex items-center justify-center w-full">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full sm:max-w-md md:max-w-2xl bg-brand-bg/80 backdrop-blur-xl rounded-none sm:rounded-3xl shadow-xl overflow-hidden border border-primary-100"
      >
        {/* Header */}
        <div className="text-center py-8 bg-gradient-to-r from-primary-500 to-primary-400 text-white">
          <h2 className="text-3xl font-bold mb-1 tracking-wide">
            Welcome Back 💕
          </h2>
          <p className="text-sm opacity-90">
            Login to continue your journey with us
          </p>
        </div>

        {/* Form Section */}
        <div className="p-8">
          <form className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-brand-text font-medium mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 outline-none"
                />
              </div>

              <div>
                <label className="block text-brand-text font-medium mb-1">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                className="text-sm text-primary-500 hover:text-primary-600"
              >
                Forgot Password?
              </button>
            </div>

            <motion.button
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="w-full bg-gradient-to-r from-primary-500 to-primary-400 text-white font-semibold py-3 rounded-lg shadow-md hover:shadow-lg transition duration-300"
            >
              Login
            </motion.button>
          </form>

          {/* Divider */}
          <div className="flex items-center justify-center my-5">
            <span className="h-px w-16 bg-gray-300"></span>
            <span className="text-gray-400 mx-3 text-sm">OR</span>
            <span className="h-px w-16 bg-gray-300"></span>
          </div>

          {/* Google Login */}
          <button className="w-full flex items-center justify-center gap-2 border border-gray-300 py-2 rounded-lg hover:bg-gray-50 transition">
            <FcGoogle size={22} />
            <span className="text-brand-text font-medium">
              Continue with Google
            </span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}
