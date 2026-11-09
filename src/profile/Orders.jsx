import React, { useEffect, useState } from "react";
import { Download, ChevronRight, Package } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Axios from "../utils/Axios";
import { useAuth } from "../context/AuthContext";

const STATUS_STYLE = {
  Pending: "bg-amber-50 text-amber-600 border-amber-200",
  Processing: "bg-blue-50 text-blue-600 border-blue-200",
  Shipped: "bg-emerald-50 text-emerald-600 border-emerald-200",
  Delivered: "bg-green-50 text-green-600 border-green-200",
  Cancelled: "bg-red-50 text-red-600 border-red-200",
};

export default function Orders() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const res = await Axios.get("/orders/myorders");
        setOrders(res.data.orders || []);
      } catch (err) {
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [user]);

  if (loading) {
    return (
      <div className="flex flex-col gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-100 p-4 animate-pulse h-28" />
        ))}
      </div>
    );
  }

  if (!orders.length) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
        <div className="w-16 h-16 rounded-2xl bg-primary-50 flex items-center justify-center">
          <Package size={28} className="text-primary-300" />
        </div>
        <p className="font-bold text-brand-text">No orders yet</p>
        <p className="text-sm text-gray-400">Your orders will show up here once you place them.</p>
        <button
          onClick={() => navigate("/")}
          className="mt-2 px-6 py-2.5 bg-primary-500 text-white rounded-xl font-bold text-sm hover:bg-primary-600 transition-all"
        >
          Start Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-lg font-black text-brand-text">My Orders</h1>
        <span className="text-xs font-bold text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">
          {orders.length} order{orders.length !== 1 ? "s" : ""}
        </span>
      </div>

      {orders.map((order) => {
        const mainItem = order.items?.[0];
        const extra = (order.items?.length || 1) - 1;
        const product = mainItem?.product || mainItem?.productId || {};
        const imgUrl = product.pimages?.[0] || product.image || "/placeholder-product.png";
        const statusStyle = STATUS_STYLE[order.orderStatus] || "bg-gray-50 text-gray-600 border-gray-200";
        const awb = order.shipping?.shiprocket?.awb_code;
        const courier = order.shipping?.courier?.name || order.shipping?.shiprocket?.courier_name;

        return (
          <div
            key={order._id}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-all"
          >
            {/* Order header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-50">
              <div className="min-w-0">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Order</p>
                <p className="text-xs font-mono font-bold text-brand-text truncate max-w-[160px]">
                  #{order.orderID || order._id.slice(-10)}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-black uppercase tracking-wide px-2.5 py-1 rounded-full border ${statusStyle}`}>
                  {order.orderStatus}
                </span>
              </div>
            </div>

            {/* Product row */}
            <div className="flex items-center gap-3 p-4">
              <div className="relative flex-shrink-0">
                <img
                  src={imgUrl}
                  alt={product.name || "Product"}
                  className="w-16 h-16 object-cover rounded-xl border border-gray-100 bg-gray-50"
                />
                {extra > 0 && (
                  <div className="absolute -bottom-1 -right-1 bg-primary-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-[9px] font-black shadow">
                    +{extra}
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-brand-text line-clamp-1">{product.name || "Product"}</p>
                {mainItem?.selectedVariant?.size && (
                  <p className="text-xs text-gray-400 font-medium mt-0.5">
                    {mainItem.selectedVariant.size}
                    {mainItem.selectedVariant.color ? ` · ${mainItem.selectedVariant.color}` : ""}
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-0.5">
                  {new Date(order.placedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                </p>
                <p className="text-sm font-black text-primary-600 mt-1">₹{order.totalAmount?.toLocaleString()}</p>
              </div>
            </div>



            {/* Footer actions */}
            <div className="flex items-center gap-2 px-4 py-3 border-t border-gray-50">
              <button
                onClick={() => navigate(`/profile/invoice/${order._id}`)}
                className="flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-primary-500 transition-colors px-3 py-2 rounded-xl hover:bg-primary-50"
              >
                <Download size={13} />
                Invoice
              </button>
              <div className="flex-1" />
              <button
                onClick={() => navigate(`/order/${order._id}`)}
                className="flex items-center gap-1.5 px-4 py-2 bg-primary-500 text-white text-xs font-black rounded-xl hover:bg-primary-600 transition-all active:scale-95"
              >
                Track Order
                <ChevronRight size={13} />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
