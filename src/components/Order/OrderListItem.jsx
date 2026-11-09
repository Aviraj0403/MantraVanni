import React from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, Package, Calendar, CreditCard } from "lucide-react";
import OrderStatusBadge from "./OrderStatusBadge";

const OrderListItem = ({ order }) => {
  const navigate = useNavigate();

  const handleOrderClick = () => {
    navigate(`/order/${order._id}`);
  };

  const getFirstProductImage = () => {
    return order.items?.[0]?.product?.pimages?.[0] || "/placeholder-product.jpg";
  };

  const getOrderSummary = () => {
    const itemCount = order.items?.length || 0;
    const firstItem = order.items?.[0];

    if (itemCount === 1) {
      return firstItem?.product?.name || "Product";
    } else if (itemCount > 1) {
      return `${firstItem?.product?.name || "Product"} +${itemCount - 1} more`;
    }
    return "No items";
  };

  return (
    <div
      onClick={handleOrderClick}
      className="bg-white p-4 rounded-2xl shadow border border-primary-100 hover:shadow-md transition-shadow cursor-pointer"
    >
      <div className="flex items-center gap-4">
        {/* Product Image */}
        <div className="w-16 h-16 flex-shrink-0">
          <img
            src={getFirstProductImage()}
            alt="Product"
            className="w-full h-full object-cover rounded-lg"
          />
        </div>

        {/* Order Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-brand-text text-sm truncate">
                {getOrderSummary()}
              </h3>
              <p className="text-xs text-gray-600 truncate">
                Order #{order.orderID || order._id}
              </p>
            </div>

            <OrderStatusBadge
              status={order.orderStatus}
              shiprocketStatus={order.shipping?.shiprocket?.current_status}
              size="sm"
            />
          </div>

          {/* Order Details */}
          <div className="flex items-center gap-4 text-xs text-gray-600">
            <div className="flex items-center gap-1">
              <Calendar size={12} />
              <span>{new Date(order.placedAt).toLocaleDateString("en-IN")}</span>
            </div>

            <div className="flex items-center gap-1">
              <CreditCard size={12} />
              <span>₹{order.totalAmount}</span>
            </div>

            {order.items?.length > 1 && (
              <div className="flex items-center gap-1">
                <Package size={12} />
                <span>{order.items.length} items</span>
              </div>
            )}
          </div>


        </div>

        {/* Arrow */}
        <ChevronRight size={20} className="text-gray-400 flex-shrink-0" />
      </div>
    </div>
  );
};

export default OrderListItem;
