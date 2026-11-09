import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Download, ArrowLeft, MessageCircle, RefreshCcw, Package } from "lucide-react";
import TrackingTimeline from "../components/Shiprocket/TrackingTimeline";
import OrderTrackingCard from "../components/Order/OrderTrackingCard";
import OrderStatusBadge from "../components/Order/OrderStatusBadge";
import useOrderTracking from "../hooks/useOrderTracking";

export default function OrderDetails() {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const { order, loading, error } = useOrderTracking(orderId);

  /* ── Loading / Error states ── */
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4 p-6">
        <div className="w-14 h-14 rounded-full border-4 border-primary-500 border-t-transparent animate-spin" />
        <p className="text-gray-500 font-semibold text-sm">Fetching your order…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4 p-6 text-center">
        <Package size={40} className="text-primary-300" />
        <p className="text-brand-text font-bold">{error}</p>
        <button
          onClick={() => navigate(-1)}
          className="px-5 py-2 bg-primary-500 text-white rounded-xl text-sm font-bold"
        >
          Go Back
        </button>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4 p-6 text-center">
        <Package size={40} className="text-gray-300" />
        <p className="text-gray-600 font-bold">Order not found</p>
        <button
          onClick={() => navigate(-1)}
          className="px-5 py-2 bg-primary-500 text-white rounded-xl text-sm font-bold"
        >
          Go Back
        </button>
      </div>
    );
  }

  const handleDownloadInvoice = () => {
    const blob = new Blob([`Invoice for ${order._id}`], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${order._id}-invoice.txt`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-10">

      {/* ── Sticky top bar ── */}
      <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-gray-100 px-4 py-3 flex items-center justify-between gap-3">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-primary-500 font-bold text-sm active:opacity-70"
        >
          <ArrowLeft size={18} />
          <span className="hidden xs:inline">Back</span>
        </button>
        <div className="text-center min-w-0 flex-1">
          <p className="text-xs text-gray-400 font-semibold truncate">Order ID</p>
          <p className="text-xs font-mono font-bold text-brand-text truncate">{order.orderID || order._id}</p>
        </div>
        <OrderStatusBadge
          status={order.orderStatus}
          shiprocketStatus={order.shipping?.shiprocket?.current_status}
          size="sm"
        />
      </div>

      <div className="max-w-2xl mx-auto px-4 pt-5 space-y-4">

        {/* ── Order summary header card ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Placed on</p>
              <p className="text-sm font-bold text-brand-text">
                {new Date(order.placedAt).toLocaleDateString("en-IN", {
                  day: "numeric", month: "long", year: "numeric"
                })}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total</p>
              <p className="text-lg font-black text-primary-600">₹{order.totalAmount?.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* ── Items ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-50 flex items-center justify-between">
            <h2 className="text-sm font-black text-brand-text uppercase tracking-wide">Items</h2>
            <span className="text-[10px] font-black text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full uppercase tracking-wider">
              {order.items?.length || 0}
            </span>
          </div>
          <div className="divide-y divide-gray-50">
            {order.items?.map((item, idx) => {
              const product = item.product || item.productId || {};
              const img = product.pimages?.[0] || product.image || "/placeholder-product.png";
              return (
                <div key={idx} className="flex items-center gap-3 p-4">
                  <img
                    src={img}
                    alt={product.name || item.name}
                    className="w-16 h-16 object-cover rounded-xl flex-shrink-0 bg-gray-50"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-brand-text line-clamp-2 leading-snug">
                      {product.name || item.name}
                    </p>
                    {item.selectedVariant?.size && (
                      <p className="text-xs text-gray-400 font-medium mt-0.5">
                        Size: {item.selectedVariant.size}
                      </p>
                    )}
                    <p className="text-sm font-black text-primary-500 mt-1">
                      ₹{item.selectedVariant?.price?.toLocaleString() || "—"}
                    </p>
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <span className="text-xs text-gray-400 font-semibold">×{item.quantity}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Tracking Card ── */}
        <OrderTrackingCard order={order} />

        {/* ── Tracking Timeline ── */}
        <TrackingTimeline order={order} />

        {/* ── Payment summary ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-50">
            <h2 className="text-sm font-black text-brand-text uppercase tracking-wide">Payment</h2>
          </div>
          <div className="p-4 space-y-2.5">
            {[
              { label: "Method", value: order.paymentMethod },
              { label: "Status", value: order.paymentStatus },
              { label: "Shipping", value: `₹${order.shipping?.charges ?? 80}` },
              order.discountAmount > 0 && { label: "Discount", value: `-₹${order.discountAmount}`, highlight: "text-emerald-600" },
            ].filter(Boolean).map((row, i) => (
              <div key={i} className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-500">{row.label}</span>
                <span className={`text-xs font-bold ${row.highlight || "text-brand-text"}`}>{row.value}</span>
              </div>
            ))}
            <div className="pt-2 border-t border-dashed border-gray-200 flex items-center justify-between">
              <span className="text-sm font-black text-brand-text">Total</span>
              <span className="text-base font-black text-primary-600">₹{order.totalAmount?.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* ── Action buttons ── */}
        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={handleDownloadInvoice}
            className="col-span-1 flex flex-col items-center gap-1.5 py-3.5 bg-white rounded-2xl border border-gray-100 shadow-sm text-brand-text hover:border-primary-200 transition-all active:scale-95"
          >
            <Download size={18} className="text-primary-500" />
            <span className="text-[10px] font-black uppercase tracking-wide">Invoice</span>
          </button>
          <a
            href={`https://wa.me/918510879296?text=Hi, I need help with my order ${order.orderID || order._id}`}
            className="col-span-1 flex flex-col items-center gap-1.5 py-3.5 bg-white rounded-2xl border border-gray-100 shadow-sm text-brand-text hover:border-emerald-200 transition-all active:scale-95"
          >
            <MessageCircle size={18} className="text-emerald-500" />
            <span className="text-[10px] font-black uppercase tracking-wide">Support</span>
          </a>
          <button
            onClick={() => navigate(`/`)}
            className="col-span-1 flex flex-col items-center gap-1.5 py-3.5 bg-white rounded-2xl border border-gray-100 shadow-sm text-brand-text hover:border-blue-200 transition-all active:scale-95"
          >
            <RefreshCcw size={18} className="text-blue-500" />
            <span className="text-[10px] font-black uppercase tracking-wide">Reorder</span>
          </button>
        </div>

      </div>
    </div>
  );
}
