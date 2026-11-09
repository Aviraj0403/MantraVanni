import React from 'react';
import { ShieldCheck, Truck, Percent, Award, BadgePercent, Store } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function BulkoRetailerBanner() {
  return (
    <div className="max-w-7xl mx-auto px-4 my-6">
      <div className="bg-gradient-to-r from-zinc-950 via-zinc-900 to-red-950 text-white rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden border border-red-900/40">
        
        {/* Background glow */}
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-96 h-96 bg-red-600/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="grid md:grid-cols-2 gap-8 items-center relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 bg-red-500/20 text-red-400 text-xs font-bold px-3 py-1.5 rounded-full mb-4 border border-red-500/30">
              <Store size={14} /> INDIA'S #1 TECH & MOBILE WHOLESALE MARKETPLACE
            </div>
            
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
              Built for India's Retailers, Resellers & Dukandars
            </h2>

            <p className="text-gray-300 text-sm sm:text-base mt-3 leading-relaxed">
              Bulko cuts out 4–5 layers of middlemen between the factory and your shop shelf. Direct factory import pricing, 100% GST Invoice on every order, and 1-click business wallet restock.
            </p>

            <div className="flex flex-wrap gap-4 mt-6">
              <Link
                to="/wallet"
                className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-3 rounded-xl shadow-lg transition flex items-center gap-2 text-sm"
              >
                <BadgePercent size={18} /> Open Business Wallet
              </Link>
              
              <Link
                to="/wishlist"
                className="bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-3 rounded-xl backdrop-blur-md transition border border-white/20 text-sm"
              >
                Saved Inventory
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10">
              <div className="w-10 h-10 rounded-xl bg-red-600/20 text-red-400 flex items-center justify-center mb-3">
                <Percent size={20} />
              </div>
              <h4 className="font-bold text-white text-sm">Wholesale Margins</h4>
              <p className="text-xs text-gray-400 mt-1">Get up to 60-70% retail profit margin on SKUs.</p>
            </div>

            <div className="bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10">
              <div className="w-10 h-10 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center mb-3">
                <ShieldCheck size={20} />
              </div>
              <h4 className="font-bold text-white text-sm">GST Invoice</h4>
              <p className="text-xs text-gray-400 mt-1">Claim 18% GST input credit on all purchases.</p>
            </div>

            <div className="bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10">
              <div className="w-10 h-10 rounded-xl bg-amber-600/20 text-amber-400 flex items-center justify-center mb-3">
                <Award size={20} />
              </div>
              <h4 className="font-bold text-white text-sm">Direct Factory Imports</h4>
              <p className="text-xs text-gray-400 mt-1">Sourced straight from verified manufacturers.</p>
            </div>

            <div className="bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10">
              <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center mb-3">
                <Truck size={20} />
              </div>
              <h4 className="font-bold text-white text-sm">Fast Dispatch</h4>
              <p className="text-xs text-gray-400 mt-1">Priority dispatch to pan-India PIN codes.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
