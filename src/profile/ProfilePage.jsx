import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  ShoppingBag, Smile, Star, User, MapPin, Trash2, LogOut, ChevronRight,
} from "lucide-react";
import Orders from "./Orders";
import Support from "./Support";
import Reviews from "./Reviews";
import Addresses from "./Addresses";
import DeleteAccount from "./DeleteAccount";
import SignInPage from "../pages/auth/SignInPage";
import { useProfileTabs } from "../growth/GrowthSlot";

const TABS = [
  { key: "orders", label: "Orders", short: "Orders", icon: ShoppingBag },
  { key: "addresses", label: "Addresses", short: "Address", icon: MapPin },
  { key: "support", label: "Support", short: "Support", icon: Smile },
  { key: "reviews", label: "Reviews", short: "Reviews", icon: Star },
  { key: "delete", label: "Delete Account", short: "Delete", icon: Trash2 },
];

function tabComponent(key, extraTabs = []) {
  const extra = extraTabs.find((t) => t.key === key);
  if (extra) { const C = extra.Component; return <C />; }
  switch (key) {
    case "orders": return <Orders />;
    case "support": return <Support />;
    case "reviews": return <Reviews />;
    case "addresses": return <Addresses />;
    case "delete": return <DeleteAccount />;
    default: return null;
  }
}

export default function ProfilePage() {
  const { user, logout, loading } = useAuth();
  const [activeKey, setActiveKey] = useState("orders");
  const extraTabs = useProfileTabs(); // growth add-ons (Rewards, Subscriptions, Gift cards...) that are ON for this store
  const allTabs = [...TABS.filter((t) => t.key !== "delete"), ...extraTabs, ...TABS.filter((t) => t.key === "delete")];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-4 border-primary-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!user) return <SignInPage />;

  const activeTab = allTabs.find((t) => t.key === activeKey);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">

      {/* ── Desktop Sidebar ─────────────────────────────── */}
      <aside className="hidden md:flex flex-col w-64 bg-brand-bg border-r border-gray-100 min-h-screen sticky top-0 h-screen">
        {/* User info */}
        <div className="p-6 border-b border-gray-50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-black text-lg flex-shrink-0">
              {(user.name || user.username || "U")[0].toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="font-bold text-brand-text truncate">{user.name || user.username}</p>
              <p className="text-xs text-gray-400 truncate">{user.email || user.phone}</p>
            </div>
          </div>
        </div>

        {/* Nav links */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {allTabs.filter(t => t.key !== "delete").map((tab) => {
            const Icon = tab.icon;
            const isActive = activeKey === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveKey(tab.key)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${isActive
                    ? "bg-primary-50 text-primary-600 border border-primary-100"
                    : "text-gray-600 hover:bg-gray-50"
                  }`}
              >
                <Icon size={18} className={isActive ? "text-primary-500" : "text-gray-400"} />
                {tab.label}
                {isActive && <ChevronRight size={14} className="ml-auto text-primary-400" />}
              </button>
            );
          })}
        </nav>

        {/* Bottom: logout + delete */}
        <div className="p-4 border-t border-gray-100 space-y-2">
          <button
            onClick={() => setActiveKey("delete")}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${activeKey === "delete"
                ? "bg-red-50 text-red-600 border border-red-100"
                : "text-gray-400 hover:text-red-500 hover:bg-red-50"
              }`}
          >
            <Trash2 size={16} />
            Delete Account
          </button>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold bg-primary-500 text-white hover:bg-primary-600 transition-all"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>

      {/* ── Mobile Header ───────────────────────────────── */}
      <div className="md:hidden bg-brand-bg border-b border-gray-100 px-4 py-3 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-black text-sm">
            {(user.name || user.username || "U")[0].toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="font-bold text-brand-text text-sm truncate max-w-[180px]">{user.name || user.username}</p>
            <p className="text-[10px] text-gray-400">{activeTab?.label}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-primary-500 transition-colors"
        >
          <LogOut size={16} />
        </button>
      </div>

      {/* ── Main content ────────────────────────────────── */}
      <main className="flex-1 p-4 md:p-8 pb-24 md:pb-8 min-h-screen">
        {tabComponent(activeKey, extraTabs)}
      </main>

      {/* ── Mobile bottom tab bar ───────────────────────── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-brand-bg border-t border-gray-100 flex items-stretch safe-area-inset-bottom shadow-[0_-4px_24px_rgba(0,0,0,0.06)]">
        {allTabs.filter(t => t.key !== "delete").map((tab) => {
          const Icon = tab.icon;
          const isActive = activeKey === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveKey(tab.key)}
              className={`flex-1 flex flex-col items-center justify-center py-2.5 gap-1 transition-colors ${isActive ? "text-primary-500" : "text-gray-400"
                }`}
            >
              <Icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
              <span className="text-[9px] font-bold leading-none">{tab.short}</span>
              {isActive && (
                <span className="absolute top-0 h-0.5 w-8 bg-primary-500 rounded-full" />
              )}
            </button>
          );
        })}
      </nav>

    </div>
  );
}
