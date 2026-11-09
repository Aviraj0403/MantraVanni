import React, { useState, useEffect } from "react";
import {
  ExternalLink,
  RefreshCw,
  Package,
  Truck,
  MapPin,
  Clock,
  Phone,
  Activity,
  CheckCircle,
  Copy,
  ChevronRight,
  MessageCircle,
} from "lucide-react";
import Axios from "../../utils/Axios";
import OrderStatusBadge from "./OrderStatusBadge";
import TrackingTimeline from "../Shiprocket/TrackingTimeline";

/* ─────────────────────────────────────────────────────────
   Tracking-step definitions
   ───────────────────────────────────────────────────────── */
const TRACKING_STEPS = [
  { key: "ordered", label: "Order Placed", icon: Package },
  { key: "processing", label: "Processing", icon: RefreshCw },
  { key: "shipped", label: "Shipped", icon: Truck },
  { key: "out", label: "Out for Delivery", icon: MapPin },
  { key: "delivered", label: "Delivered", icon: CheckCircle },
];

/**
 * Maps a Shiprocket / internal status string → step index (0-based)
 */
function resolveStepIndex(orderStatus = "", shiprocketStatus = "") {
  const os = typeof orderStatus === 'string' ? orderStatus : "";
  const ss = typeof shiprocketStatus === 'string' ? shiprocketStatus : "";
  const s = (ss || os).toLowerCase();
  if (s.includes("deliver")) return 4;
  if (s.includes("out")) return 3;
  if (s.includes("ship") || s.includes("transit") || s.includes("dispatch")) return 2;
  if (s.includes("process") || s.includes("manifest") || s.includes("hub")) return 1;
  return 0;
}

/* ─────────────────────────────────────────────────────────
   Sub-component: Visual progress stepper
   ───────────────────────────────────────────────────────── */
const TrackingProgress = ({ orderStatus, shiprocketStatus }) => {
  const currentStep = resolveStepIndex(orderStatus, shiprocketStatus);

  return (
    <div className="w-full">
      {/* Desktop: horizontal stepper */}
      <div className="hidden sm:flex items-center w-full">
        {TRACKING_STEPS.map((step, idx) => {
          const isDone = idx < currentStep;
          const isCurrent = idx === currentStep;
          const Icon = step.icon;

          return (
            <React.Fragment key={step.key}>
              {idx > 0 && (
                <div
                  className={`flex-1 h-0.5 mx-1 transition-colors duration-500 ${isDone ? "bg-primary-500" : "bg-gray-200"
                    }`}
                />
              )}
              <div className="flex flex-col items-center gap-1.5">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${isDone
                    ? "bg-primary-500 text-white shadow-md shadow-primary-200"
                    : isCurrent
                      ? "bg-gray-900 text-white ring-4 ring-primary-200 shadow-lg shadow-gray-300"
                      : "bg-gray-100 text-gray-300"
                    }`}
                >
                  <Icon size={16} />
                </div>
                <span
                  className={`text-[10px] font-bold text-center leading-tight max-w-[60px] ${isCurrent ? "text-brand-text" : isDone ? "text-primary-500" : "text-gray-300"
                    }`}
                >
                  {step.label}
                </span>
              </div>
            </React.Fragment>
          );
        })}
      </div>

      {/* Mobile: vertical stepper (more readable on small screens) */}
      <div className="flex sm:hidden flex-col gap-0">
        {TRACKING_STEPS.map((step, idx) => {
          const isDone = idx < currentStep;
          const isCurrent = idx === currentStep;
          const Icon = step.icon;

          return (
            <div key={step.key} className="flex items-start gap-3">
              {/* Left column: icon + connector line */}
              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${isDone
                    ? "bg-primary-500 text-white"
                    : isCurrent
                      ? "bg-gray-900 text-white ring-2 ring-primary-300"
                      : "bg-gray-100 text-gray-300"
                    }`}
                >
                  <Icon size={14} />
                </div>
                {idx < TRACKING_STEPS.length - 1 && (
                  <div
                    className={`w-0.5 h-6 my-0.5 ${isDone ? "bg-primary-400" : "bg-gray-200"}`}
                  />
                )}
              </div>

              {/* Right column: label */}
              <div className="pt-1.5 pb-4">
                <p
                  className={`text-xs font-bold ${isCurrent ? "text-brand-text" : isDone ? "text-primary-500" : "text-gray-300"
                    }`}
                >
                  {step.label}
                </p>
                {isCurrent && (
                  <p className="text-[10px] text-primary-500 font-medium mt-0.5">Current status</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────
   Main component
   ───────────────────────────────────────────────────────── */
const OrderTrackingCard = ({ order }) => {
  const [copied, setCopied] = useState(false);
  const shipping = order.shipping || {};
  const shiprocket = shipping.shiprocket || {};

  const copyToClipboard = () => {
    if (!shiprocket.awb_code) return;
    navigator.clipboard.writeText(shiprocket.awb_code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const estimatedDay = shipping.estimated_delivery
    ? new Date(shipping.estimated_delivery).toLocaleDateString("en-IN", { weekday: "long" })
    : "Soon";
  const estimatedDate = shipping.estimated_delivery
    ? new Date(shipping.estimated_delivery).toLocaleDateString("en-IN", { month: "short", day: "numeric" })
    : null;

  return (
    <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl border border-gray-100 overflow-hidden">

      {/* ── Header ─────────────────────────────────────────── */}
      <div className="relative overflow-hidden bg-gray-900 px-4 py-5 sm:px-8 sm:py-8">
        {/* Decorative blob */}
        <div className="absolute top-0 right-0 w-48 h-48 sm:w-80 sm:h-80 bg-gradient-to-br from-primary-500/20 to-red-500/20 rounded-full blur-[60px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />

        <div className="relative z-10 flex flex-col gap-4">
          {/* Live tag */}
          <div className="self-start inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 backdrop-blur-xl rounded-full text-[10px] font-bold uppercase tracking-widest text-primary-300 border border-white/10">
            <Activity size={10} className="animate-pulse" />
            Live Tracking
          </div>

          {/* Title row */}
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div>
              <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-none">
                Arriving{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-red-400">
                  {estimatedDay}
                </span>
              </h2>
              <div className="flex items-center gap-3 mt-2 flex-wrap">
                {estimatedDate && (
                  <span className="px-3 py-1 bg-primary-500 text-white rounded-lg text-[11px] font-black uppercase tracking-wider shadow-md shadow-primary-500/30">
                    {estimatedDate}
                  </span>
                )}
                <p className="text-gray-400 text-xs font-semibold flex items-center gap-1.5">
                  <Clock size={13} />
                  {typeof shiprocket.current_status === 'string' ? shiprocket.current_status : "Hub Processing"}
                </p>
              </div>
            </div>

            <OrderStatusBadge
              status={order.orderStatus}
              shiprocketStatus={shiprocket.current_status}
              size="sm"
            />
          </div>

          {/* AWB / tracking code */}
          {shiprocket.awb_code && (
            <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl px-4 py-3 gap-3">
              <div className="min-w-0">
                <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-0.5">
                  AWB / Tracking No.
                </p>
                <p className="text-white font-mono text-sm sm:text-base font-bold truncate">
                  {shiprocket.awb_code}
                </p>
              </div>
              <button
                onClick={copyToClipboard}
                className={`flex-shrink-0 p-2.5 rounded-lg transition-all text-sm font-bold flex items-center gap-1.5 ${copied
                  ? "bg-emerald-500 text-white"
                  : "bg-white/10 text-white hover:bg-white/20 active:scale-95"
                  }`}
              >
                {copied ? <CheckCircle size={15} /> : <Copy size={15} />}
                <span className="text-[11px]">{copied ? "Copied!" : "Copy"}</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── Progress stepper ───────────────────────────────── */}
      <div className="px-4 py-5 sm:px-8 sm:py-6 border-b border-gray-100 bg-gray-50/50">
        <TrackingProgress
          orderStatus={order.orderStatus}
          shiprocketStatus={shiprocket.current_status}
        />
      </div>

      {/* ── Body ───────────────────────────────────────────── */}
      <div className="px-4 py-5 sm:px-8 sm:py-6 space-y-6">

        {/* Shipment contents */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-black text-brand-text uppercase tracking-wide">
              Shipment Contents
            </h3>
            <span className="text-[10px] font-black text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full uppercase tracking-wider">
              {order.items?.length || 0} item{order.items?.length !== 1 ? "s" : ""}
            </span>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {order.items?.map((item, idx) => {
              const productData = item.product || item.productId || {};
              const imageUrl = productData.pimages?.[0] || productData.image || "/placeholder-product.png";
              return (
                <div key={idx} className="flex-shrink-0 relative group">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-50 rounded-xl sm:rounded-2xl border border-gray-100 overflow-hidden group-hover:border-primary-200 transition-all">
                    <img
                      src={imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-white rounded-full shadow border border-gray-100 flex items-center justify-center text-[9px] font-black text-brand-text">
                    ×{item.quantity}
                  </div>
                </div>
              );
            })}
            {(!order.items || order.items.length === 0) && (
              <div className="flex items-center gap-3 p-4 bg-primary-50 rounded-xl border border-dashed border-primary-200 w-full">
                <Package className="text-primary-300 flex-shrink-0" size={24} />
                <p className="text-primary-500 font-bold text-xs">Item details loading from hub…</p>
              </div>
            )}
          </div>
        </div>

        {/* Info cards: responsive grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-gray-100">

          {/* Delivery address */}
          <div className="bg-gray-50 rounded-xl p-4 border border-transparent hover:border-primary-100 transition-colors">
            <div className="flex items-center gap-2 text-primary-500 mb-2">
              <MapPin size={14} />
              <span className="text-[10px] font-black uppercase tracking-widest">Delivering To</span>
            </div>
            <p className="font-black text-brand-text text-sm">{order.shippingAddress?.name}</p>
            <p className="text-xs text-gray-500 font-medium leading-relaxed mt-0.5">
              {order.shippingAddress?.street}, {order.shippingAddress?.city}<br />
              {order.shippingAddress?.state} – {order.shippingAddress?.postalCode}
            </p>
            {order.shippingAddress?.phoneNumber && (
              <div className="flex items-center gap-1.5 mt-2">
                <Phone size={11} className="text-gray-400" />
                <span className="text-[11px] font-bold text-gray-500">{order.shippingAddress.phoneNumber}</span>
              </div>
            )}
          </div>

          {/* Logistics info */}
          <div className="bg-gray-50 rounded-xl p-4 border border-transparent hover:border-blue-100 transition-colors">
            <div className="flex items-center gap-2 text-blue-500 mb-2">
              <Truck size={14} />
              <span className="text-[10px] font-black uppercase tracking-widest">Carrier</span>
            </div>
            <p className="font-black text-brand-text text-sm">{shipping.courier?.name || "Global Concierge"}</p>
            <p className="text-xs text-gray-500 font-medium mt-1">Priority Shipping</p>
          </div>

          {/* Payment */}
          <div className="bg-gray-50 rounded-xl p-4 border border-transparent hover:border-emerald-100 transition-colors">
            <div className="flex items-center gap-2 text-emerald-500 mb-2">
              <CheckCircle size={14} />
              <span className="text-[10px] font-black uppercase tracking-widest">Payment</span>
            </div>
            <p className="text-xl font-black text-brand-text">₹{order.totalAmount?.toLocaleString()}</p>
            <span className={`inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${order.paymentStatus === "Paid"
              ? "bg-emerald-100 text-emerald-700"
              : "bg-primary-100 text-primary-700"
              }`}>
              {order.paymentStatus === "Paid" ? "Paid" : "Cash on Delivery"}
            </span>
          </div>
        </div>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <a
            href={`https://wa.me/91XXXXXXXXXX?text=Help with order ${order.orderID || order._id}`}
            className="flex-1 flex items-center justify-center gap-2 px-5 py-3.5 bg-emerald-500 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-md shadow-emerald-100 active:scale-95"
          >
            <MessageCircle size={16} />
            WhatsApp Support
          </a>
          {shiprocket.awb_code && (
            <a
              href={`https://shiprocket.co/tracking/${shiprocket.awb_code}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 px-5 py-3.5 bg-gray-900 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-black transition-all shadow-md active:scale-95"
            >
              <ExternalLink size={16} />
              Track on Shiprocket
              <ChevronRight size={14} />
            </a>
          )}
        </div>

        {/* ── Live Timeline ─────────────────────────────────── */}
        {shiprocket.awb_code && (
          <div className="pt-2">
            <TrackingTimeline order={order} />
          </div>
        )}

      </div>
    </div>
  );
};

export default OrderTrackingCard;
