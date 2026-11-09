import React from "react";
import OrderTrackingCard from "../components/Order/OrderTrackingCard";
import OrderStatusBadge from "../components/Order/OrderStatusBadge";
import OrderListItem from "../components/Order/OrderListItem";
import QuickOrderStatus from "../components/Order/QuickOrderStatus";

const OrderTrackingDemo = () => {
  // Sample order data based on your provided JSON
  const sampleOrder = {
    "_id": "6982247823e8c4b6b7731afe",
    "user": {
      "_id": "692f0dae0e0fececcd77fd3e",
      "email": "aviraj0403@gmail.com"
    },
    "items": [
      {
        "product": {
          "_id": "694141366dad16306f2cf171",
          "name": "Dr. Rashel Hair Combo Pack For Men & Women",
          "pimages": [
            "https://res.cloudinary.com/dkijflooc/image/upload/v1765959529/food_images/jfgjdfre5uwu2gauq6hx.webp",
            "https://res.cloudinary.com/dkijflooc/image/upload/v1765959531/food_images/j1g7pbhpdilmknzpadoa.webp",
            "https://res.cloudinary.com/dkijflooc/image/upload/v1765959533/food_images/nn583fgzkjwepgwilkqz.webp"
          ]
        },
        "selectedVariant": {
          "name": "Dr. Rashel Hair Combo Pack For Men & Women",
          "price": 849,
          "size": "pack of 4",
          "color": "Brown"
        },
        "quantity": 1
      }
    ],
    "shippingAddress": {
      "label": "Home",
      "name": "Avi Raj",
      "email": "aviraj0403@gmail.com",
      "phoneNumber": "9876543210",
      "street": "Shaheed Captain Shashikant Sharma Marg, Noida City Centre, Noida, Dadri, Gautam Buddha Nagar, Uttar Pradesh, 201307, India",
      "city": "Noida",
      "state": "Uttar Pradesh",
      "postalCode": "201307",
      "country": "India",
      "location": {
        "type": "Point",
        "coordinates": [77.36670147850248, 28.582542301081016]
      }
    },
    "paymentMethod": "Razorpay",
    "paymentStatus": "Paid",
    "orderStatus": "Shipped",
    "totalAmount": 929,
    "discountAmount": 0,
    "discountCode": null,
    "offerApplied": null,
    "isOfferApplied": false,
    "appliedDiscountPercentage": 0,
    "placedAt": "2026-02-03T16:38:16.750Z",
    "payment": {
      "_id": "6982241423e8c4b6b7731af7",
      "userId": "692f0dae0e0fececcd77fd3e",
      "paymentMethod": "Razorpay",
      "paymentStatus": "Paid",
      "amount": 964.4,
      "currency": "INR",
      "razorpayOrderId": "order_SBk0ffkUx5cRkl",
      "razorpayPaymentId": "pay_SBk27MYeV9P6pN",
      "razorpaySignature": "4eef8b7ef97e516328965f5fa14c502e30c2a76dede0f7750e605b71b9c16676",
      "transactionDate": "2026-02-03T16:36:36.903Z"
    },
    "shipping": {
      "charges": 35.4,
      "method": "Shiprocket",
      "courier": {
        "name": "India Post-Speed Post Air Prepaid",
        "company_id": "217"
      },
      "estimated_delivery": "2026-02-08T16:36:36.676Z",
      "weight": 0.5,
      "tracking_updates": [],
      "dimensions": {
        "length": 10,
        "breadth": 10,
        "height": 10
      },
      "shiprocket": {
        "order_id": "1167018903",
        "shipment_id": "1163364039",
        "awb_code": "SR123456789",
        "courier_company_id": "217",
        "courier_name": "India Post-Speed Post Air Prepaid",
        "current_status": "PICKED_UP",
        "shipment_status": "PICKED_UP"
      }
    },
    "sourceDomain": "UNKNOWN",
    "orderHistory": [],
    "createdAt": "2026-02-03T16:38:16.759Z",
    "updatedAt": "2026-02-04T15:07:17.940Z"
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-brand-text mb-2">Order Tracking Components Demo</h1>
          <p className="text-gray-600">Shiprocket integration for real-time order tracking</p>
        </div>

        {/* Status Badges Demo */}
        <div className="bg-white rounded-2xl shadow-lg border border-primary-100 p-6 mb-8">
          <h2 className="text-xl font-semibold text-brand-text mb-4">Order Status Badges</h2>
          <div className="flex flex-wrap gap-4">
            <OrderStatusBadge status="Pending" size="sm" />
            <OrderStatusBadge status="Processing" size="md" />
            <OrderStatusBadge status="Shipped" shiprocketStatus="PICKED_UP" size="lg" />
            <OrderStatusBadge status="Delivered" shiprocketStatus="DELIVERED" size="md" />
            <OrderStatusBadge status="Cancelled" size="sm" />
          </div>
        </div>

        {/* Quick Status Demo */}
        <div className="bg-white rounded-2xl shadow-lg border border-primary-100 p-6 mb-8">
          <h2 className="text-xl font-semibold text-brand-text mb-4">Quick Order Status</h2>
          <div className="space-y-4">
            <QuickOrderStatus order={sampleOrder} showDetails={true} />
            <QuickOrderStatus order={{...sampleOrder, orderStatus: "Delivered", shipping: {...sampleOrder.shipping, shiprocket: {...sampleOrder.shipping.shiprocket, current_status: "DELIVERED"}}}} />
            <QuickOrderStatus order={{...sampleOrder, orderStatus: "Processing"}} />
          </div>
        </div>

        {/* Order List Item Demo */}
        <div className="bg-white rounded-2xl shadow-lg border border-primary-100 p-6 mb-8">
          <h2 className="text-xl font-semibold text-brand-text mb-4">Order List Item</h2>
          <div className="space-y-4">
            <OrderListItem order={sampleOrder} />
            <OrderListItem order={{
              ...sampleOrder,
              _id: "6982247823e8c4b6b7731aff",
              orderStatus: "Delivered",
              items: [
                ...sampleOrder.items,
                {
                  product: {
                    _id: "694141366dad16306f2cf172",
                    name: "Another Product",
                    pimages: ["https://res.cloudinary.com/dkijflooc/image/upload/v1765959529/food_images/jfgjdfre5uwu2gauq6hx.webp"]
                  },
                  selectedVariant: { price: 299 },
                  quantity: 1
                }
              ]
            }} />
          </div>
        </div>

        {/* Full Tracking Card Demo */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-brand-text mb-4">Complete Order Tracking Card</h2>
          <OrderTrackingCard order={sampleOrder} />
        </div>

        {/* Usage Instructions */}
        <div className="bg-white rounded-2xl shadow-lg border border-primary-100 p-6">
          <h2 className="text-xl font-semibold text-brand-text mb-4">How to Use</h2>
          <div className="space-y-4 text-sm text-brand-text">
            <div>
              <h3 className="font-semibold text-brand-text">1. Order Status Badge</h3>
              <p>Use <code className="bg-gray-100 px-2 py-1 rounded">OrderStatusBadge</code> for simple status display with icons and colors.</p>
              <pre className="bg-gray-100 p-2 rounded mt-2 text-xs overflow-x-auto">
{`<OrderStatusBadge 
  status={order.orderStatus}
  shiprocketStatus={order.shipping?.shiprocket?.current_status}
  size="md"
/>`}
              </pre>
            </div>

            <div>
              <h3 className="font-semibold text-brand-text">2. Quick Order Status</h3>
              <p>Use <code className="bg-gray-100 px-2 py-1 rounded">QuickOrderStatus</code> for inline status with optional AWB details.</p>
              <pre className="bg-gray-100 p-2 rounded mt-2 text-xs overflow-x-auto">
{`<QuickOrderStatus order={order} showDetails={true} />`}
              </pre>
            </div>

            <div>
              <h3 className="font-semibold text-brand-text">3. Order List Item</h3>
              <p>Use <code className="bg-gray-100 px-2 py-1 rounded">OrderListItem</code> for order lists with click navigation.</p>
              <pre className="bg-gray-100 p-2 rounded mt-2 text-xs overflow-x-auto">
{`<OrderListItem order={order} />`}
              </pre>
            </div>

            <div>
              <h3 className="font-semibold text-brand-text">4. Order Tracking Card</h3>
              <p>Use <code className="bg-gray-100 px-2 py-1 rounded">OrderTrackingCard</code> for complete tracking interface with real-time updates.</p>
              <pre className="bg-gray-100 p-2 rounded mt-2 text-xs overflow-x-auto">
{`<OrderTrackingCard order={order} />`}
              </pre>
            </div>

            <div>
              <h3 className="font-semibold text-brand-text">5. Tracking Hook</h3>
              <p>Use <code className="bg-gray-100 px-2 py-1 rounded">useOrderTracking</code> hook for managing order and tracking state.</p>
              <pre className="bg-gray-100 p-2 rounded mt-2 text-xs overflow-x-auto">
{`const { order, trackingData, loading, error, refreshTracking } = useOrderTracking(orderId);`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTrackingDemo;
