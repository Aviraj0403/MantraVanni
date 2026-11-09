import React, { useState, useEffect } from "react";
import {
  CheckCircle2, Clock, Package, Truck, MapPin,
  AlertCircle, RefreshCw, ChevronDown, ChevronUp
} from "lucide-react";
import Axios from "../../utils/Axios";

/* ── status → display metadata ── */
const STATUS_MAP = {
  NEW: { label: "Order Created", icon: Package, color: "blue" },
  AWB_ASSIGNED: { label: "AWB Assigned", icon: Package, color: "blue" },
  PICKUP_SCHEDULED: { label: "Pickup Scheduled", icon: Clock, color: "yellow" },
  PICKED_UP: { label: "Picked Up", icon: Truck, color: "green" },
  IN_TRANSIT: { label: "In Transit", icon: MapPin, color: "green" },
  OUT_FOR_DELIVERY: { label: "Out for Delivery", icon: Truck, color: "green" },
  DELIVERED: { label: "Delivered", icon: CheckCircle2, color: "green" },
  CANCELLED: { label: "Cancelled", icon: AlertCircle, color: "red" },
  RTO: { label: "Return to Origin", icon: AlertCircle, color: "red" },
  LOST: { label: "Lost", icon: AlertCircle, color: "red" },
  DAMAGED: { label: "Damaged", icon: AlertCircle, color: "red" },
};

const resolveStatus = (key) => {
  const safeKey = typeof key === 'string' ? key : 'Unknown';
  return STATUS_MAP[safeKey] || { label: safeKey, icon: Package, color: "gray" };
};

const DOT_COLORS = {
  green: "bg-emerald-500 text-white",
  blue: "bg-blue-500 text-white",
  yellow: "bg-amber-400 text-white",
  red: "bg-red-500 text-white",
  gray: "bg-gray-300 text-gray-600",
};

const getProgressPct = (status = "") => {
  const s = typeof status === 'string' ? status.toUpperCase() : "";
  if (s.includes("DELIVERED")) return 100;
  if (s.includes("OUT_FOR_DELIVERY") || s.includes("OUT FOR")) return 80;
  if (s.includes("IN_TRANSIT") || s.includes("TRANSIT")) return 60;
  if (s.includes("PICKED") || s.includes("PICKUP")) return 40;
  return 20;
};

/* ── Main component ── */
const TrackingTimeline = ({ order }) => {
  const [trackingData, setTrackingData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState(true);

  if (!order.shipping) return null;

  const { shipping } = order;
  const shiprocket = shipping.shiprocket || {};

  const fetchTracking = async () => {
    if (!shiprocket.awb_code) return;
    setLoading(true);
    setError(null);
    try {
      const res = await Axios.get(`/shipping/track/${shiprocket.awb_code}`);
      if (res.data.isPending) {
        setError(res.data.message || "Tracking is being initialized. Check back soon.");
        setTrackingData(null);
      } else {
        setTrackingData(res.data);
      }
    } catch (err) {
      setError("Could not fetch live updates. Carrier is still processing.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTracking(); }, [shiprocket.awb_code]);

  /* Build timeline */
  const buildTimeline = () => {
    const items = [];

    // Order placed
    items.push({
      label: "Order Placed",
      desc: "Your order was placed successfully",
      ts: order.placedAt,
      icon: Package,
      color: "green",
    });

    // Payment
    if (order.paymentStatus === "Paid") {
      items.push({
        label: "Payment Confirmed",
        desc: `₹${order.totalAmount} via ${order.paymentMethod}`,
        ts: order.payment?.transactionDate || order.placedAt,
        icon: CheckCircle2,
        color: "green",
      });
    }

    // Shiprocket status
    if (shiprocket.order_id) {
      const info = resolveStatus(shiprocket.current_status || "NEW");
      items.push({
        label: info.label,
        desc: `Carrier: ${shiprocket.courier_name || "—"}`,
        ts: order.updatedAt,
        icon: info.icon,
        color: info.color,
      });
    }

    // Live tracking API updates
    if (trackingData?.tracking_data?.track_status) {
      trackingData.tracking_data.track_status.forEach((t) => {
        const info = resolveStatus(t.current_status);
        items.push({
          label: info.label,
          desc: t.activity || t.current_status,
          ts: t.date || order.updatedAt,
          icon: info.icon,
          color: info.color,
          location: t.location,
        });
      });
    } else if (!trackingData && order.orderStatus !== "Pending") {
      const info = resolveStatus(order.orderStatus.toUpperCase());
      items.push({
        label: order.orderStatus,
        desc: `Order status: ${order.orderStatus}`,
        ts: order.updatedAt,
        icon: info.icon,
        color: info.color,
      });
    }

    // Sort ascending, then reverse for display (latest first)
    return items.sort((a, b) => new Date(b.ts) - new Date(a.ts));
  };

  const timeline = buildTimeline();
  const pct = getProgressPct(shiprocket.current_status || order.orderStatus);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

      {/* Header */}
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3 border-b border-gray-50"
      >
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-black text-brand-text uppercase tracking-wide">Shipment Timeline</h2>
          <div className="flex items-center gap-1 px-2 py-0.5 bg-emerald-50 rounded-full border border-emerald-100">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-[9px] font-black text-emerald-600 uppercase tracking-wider">Live</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => { e.stopPropagation(); fetchTracking(); }}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors"
            disabled={loading}
          >
            <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
          </button>
          {expanded ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
        </div>
      </button>

      {expanded && (
        <div className="p-4 space-y-4">
          {/* Progress bar */}
          <div>
            <div className="flex items-center justify-between text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
              <span>{trackingData?.tracking_data?.origin || "Puja Samagri Hub"}</span>
              <span>{order.shippingAddress?.city || "Destination"}</span>
            </div>
            <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="absolute left-0 top-0 h-full bg-gradient-to-r from-primary-500 to-emerald-500 rounded-full transition-all duration-1000"
                style={{ width: `${pct}%` }}
              />
            </div>
            <p className="text-right text-[10px] font-bold text-gray-400 mt-1">{pct}% complete</p>
          </div>

          {/* Error */}
          {error && (
            <p className="text-xs text-red-400 font-semibold text-center py-2">{error}</p>
          )}

          {/* Timeline entries */}
          <div className="space-y-0">
            {timeline.map((step, idx) => {
              const Icon = step.icon;
              const isFirst = idx === 0;
              const dotCls = DOT_COLORS[step.color] || DOT_COLORS.gray;

              return (
                <div key={idx} className="flex gap-3">
                  {/* Left: icon + connector */}
                  <div className="flex flex-col items-center flex-shrink-0">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${dotCls} ${isFirst ? "ring-2 ring-offset-2 ring-primary-300" : ""}`}>
                      <Icon size={14} />
                    </div>
                    {idx < timeline.length - 1 && (
                      <div className="w-0.5 flex-1 min-h-[1.5rem] bg-gray-100 my-1" />
                    )}
                  </div>

                  {/* Right: content */}
                  <div className={`flex-1 pb-4 ${idx === 0 ? "pb-4" : ""}`}>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className={`text-sm font-bold ${isFirst ? "text-brand-text" : "text-gray-600"}`}>
                          {step.label}
                        </p>
                        <p className="text-xs text-gray-400 font-medium leading-snug mt-0.5">
                          {step.desc}
                        </p>
                        {step.location && (
                          <div className="flex items-center gap-1.5 mt-2 px-2 py-1 bg-gray-50 rounded-lg border border-gray-100 self-start">
                            <MapPin size={10} className="text-primary-500" />
                            <span className="text-[10px] font-bold text-gray-600 uppercase tracking-tight">
                              Location: {step.location}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-[11px] font-bold text-brand-text">
                          {new Date(step.ts).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                        </p>
                        <p className="text-[10px] text-gray-400">
                          {new Date(step.ts).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default TrackingTimeline;
