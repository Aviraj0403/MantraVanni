import React from "react";
import { Package, Truck, CheckCircle2, Clock, AlertCircle, MapPin } from "lucide-react";

const QuickOrderStatus = ({ order, showDetails = false }) => {
  const getStatusIcon = (status, shiprocketStatus) => {
    const currentStatus = shiprocketStatus || status;
    
    const iconMap = {
      'Pending': Clock,
      'Processing': Package,
      'Shipped': Truck,
      'Delivered': CheckCircle2,
      'Cancelled': AlertCircle,
      'NEW': Package,
      'PICKED_UP': Truck,
      'IN_TRANSIT': MapPin,
      'OUT_FOR_DELIVERY': Truck,
      'DELIVERED': CheckCircle2,
      'CANCELLED': AlertCircle
    };
    
    return iconMap[currentStatus] || Package;
  };

  const getStatusColor = (status, shiprocketStatus) => {
    const currentStatus = shiprocketStatus || status;
    
    const colorMap = {
      'Pending': 'text-yellow-600 bg-yellow-50',
      'Processing': 'text-blue-600 bg-blue-50',
      'Shipped': 'text-green-600 bg-green-50',
      'Delivered': 'text-green-600 bg-green-50',
      'Cancelled': 'text-red-600 bg-red-50',
      'NEW': 'text-blue-600 bg-blue-50',
      'PICKED_UP': 'text-green-600 bg-green-50',
      'IN_TRANSIT': 'text-green-600 bg-green-50',
      'OUT_FOR_DELIVERY': 'text-green-600 bg-green-50',
      'DELIVERED': 'text-green-600 bg-green-50',
      'CANCELLED': 'text-red-600 bg-red-50'
    };
    
    return colorMap[currentStatus] || 'text-gray-600 bg-gray-50';
  };

  const getStatusText = (status, shiprocketStatus) => {
    const currentStatus = shiprocketStatus || status;
    
    const textMap = {
      'NEW': 'Order Created',
      'PICKED_UP': 'Picked Up',
      'IN_TRANSIT': 'In Transit',
      'OUT_FOR_DELIVERY': 'Out for Delivery',
      'DELIVERED': 'Delivered',
      'CANCELLED': 'Cancelled'
    };
    
    const safeText = typeof currentStatus === 'string' ? currentStatus : 'Unknown';
    return textMap[currentStatus] || safeText;
  };

  const StatusIcon = getStatusIcon(order.orderStatus, order.shipping?.shiprocket?.current_status);
  const colorClasses = getStatusColor(order.orderStatus, order.shipping?.shiprocket?.current_status);
  const statusText = getStatusText(order.orderStatus, order.shipping?.shiprocket?.current_status);

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg ${colorClasses}`}>
      <StatusIcon size={16} />
      <span className="font-medium text-sm">{statusText}</span>
      
      {showDetails && order.shipping?.shiprocket?.awb_code && (
        <div className="ml-2 text-xs opacity-75">
          AWB: {order.shipping.shiprocket.awb_code}
        </div>
      )}
    </div>
  );
};

export default QuickOrderStatus;
