import React from "react";
import { Package, Truck, CheckCircle2, Clock, AlertCircle, MapPin } from "lucide-react";

const OrderStatusBadge = ({ status, shiprocketStatus, size = "md" }) => {
  const getStatusConfig = (status, shiprocketStatus) => {
    // Priority: Shiprocket status over order status
    const currentStatus = shiprocketStatus || status;
    
    const statusConfigs = {
      // Order statuses
      'Pending': { 
        label: 'Pending', 
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200', 
        icon: Clock 
      },
      'Processing': { 
        label: 'Processing', 
        color: 'bg-blue-100 text-blue-800 border-blue-200', 
        icon: Package 
      },
      'Shipped': { 
        label: 'Shipped', 
        color: 'bg-green-100 text-green-800 border-green-200', 
        icon: Truck 
      },
      'Delivered': { 
        label: 'Delivered', 
        color: 'bg-green-100 text-green-800 border-green-200', 
        icon: CheckCircle2 
      },
      'Cancelled': { 
        label: 'Cancelled', 
        color: 'bg-red-100 text-red-800 border-red-200', 
        icon: AlertCircle 
      },
      
      // Shiprocket statuses
      'NEW': { 
        label: 'Order Created', 
        color: 'bg-blue-100 text-blue-800 border-blue-200', 
        icon: Package 
      },
      'AWB_ASSIGNED': { 
        label: 'AWB Assigned', 
        color: 'bg-blue-100 text-blue-800 border-blue-200', 
        icon: Package 
      },
      'PICKUP_SCHEDULED': { 
        label: 'Pickup Scheduled', 
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200', 
        icon: Clock 
      },
      'PICKED_UP': { 
        label: 'Picked Up', 
        color: 'bg-green-100 text-green-800 border-green-200', 
        icon: Truck 
      },
      'IN_TRANSIT': { 
        label: 'In Transit', 
        color: 'bg-green-100 text-green-800 border-green-200', 
        icon: MapPin 
      },
      'OUT_FOR_DELIVERY': { 
        label: 'Out for Delivery', 
        color: 'bg-green-100 text-green-800 border-green-200', 
        icon: Truck 
      },
      'DELIVERED': { 
        label: 'Delivered', 
        color: 'bg-green-100 text-green-800 border-green-200', 
        icon: CheckCircle2 
      },
      'RTO': { 
        label: 'Return to Origin', 
        color: 'bg-red-100 text-red-800 border-red-200', 
        icon: AlertCircle 
      },
      'LOST': { 
        label: 'Lost', 
        color: 'bg-red-100 text-red-800 border-red-200', 
        icon: AlertCircle 
      },
      'DAMAGED': { 
        label: 'Damaged', 
        color: 'bg-red-100 text-red-800 border-red-200', 
        icon: AlertCircle 
      }
    };

    const safeLabel = typeof currentStatus === 'string' ? currentStatus : 'Unknown';

    return statusConfigs[currentStatus] || {
      label: safeLabel,
      color: 'bg-gray-100 text-brand-text border-gray-200',
      icon: Package
    };
  };

  const config = getStatusConfig(status, shiprocketStatus);
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  const iconSizes = {
    sm: 12,
    md: 14,
    lg: 16
  };

  return (
    <span className={`inline-flex items-center gap-1 rounded-full border font-medium ${config.color} ${sizeClasses[size]}`}>
      <Icon size={iconSizes[size]} />
      {config.label}
    </span>
  );
};

export default OrderStatusBadge;
