import React from "react";
import { CheckCircle2, Truck, Package, AlertCircle } from "lucide-react";

const TrackingCard = ({ order }) => {
  if (!order.shipping) {
    return null;
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "Delivered":
        return <CheckCircle2 size={20} className="text-green-500" />;
      case "In Transit":
      case "Out for Delivery":
        return <Truck size={20} className="text-blue-500" />;
      case "Cancelled":
        return <AlertCircle size={20} className="text-red-500" />;
      default:
        return <Package size={20} className="text-yellow-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Delivered":
        return "text-green-600";
      case "In Transit":
      case "Out for Delivery":
        return "text-blue-600";
      case "Cancelled":
        return "text-red-600";
      default:
        return "text-yellow-600";
    }
  };

  const getProgressPercentage = (status) => {
    switch (status) {
      case "Delivered":
        return 100;
      case "Out for Delivery":
        return 85;
      case "In Transit":
        return 60;
      case "Shipped":
        return 40;
      case "Pending":
        return 20;
      case "Cancelled":
        return 0;
      default:
        return 0;
    }
  };

  const progress = getProgressPercentage(order.orderStatus);

  return (
    <div className="mt-3 space-y-2">
      {/* Progress Bar */}
      <div className="flex items-center gap-2">
        <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-300 ${
              order.orderStatus === "Cancelled"
                ? "bg-red-500"
                : "bg-green-500"
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
        {getStatusIcon(order.orderStatus)}
      </div>

      {/* Status Text */}
      <div className="flex items-center justify-between text-xs">
        <span className={`font-semibold ${getStatusColor(order.orderStatus)}`}>
          {order.orderStatus}
        </span>
        {order.shipping?.estimated_delivery && (
          <span className="text-gray-600">
            Est. {new Date(order.shipping.estimated_delivery).toLocaleDateString("en-IN", {
              month: "short",
              day: "numeric",
            })}
          </span>
        )}
      </div>

      {/* Courier Info */}
      {order.shipping?.courier?.name && (
        <p className="text-xs text-gray-600">
          Via <span className="font-semibold">{order.shipping.courier.name}</span>
        </p>
      )}
    </div>
  );
};

export default TrackingCard;
