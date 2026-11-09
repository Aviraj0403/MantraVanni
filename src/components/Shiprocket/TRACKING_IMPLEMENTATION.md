# Order Tracking Implementation - GK Store

## Overview

The order tracking feature displays real-time shipping status similar to Flipkart/Amazon. It includes:

1. **Detailed Tracking Timeline** - Full timeline in order details page
2. **Quick Tracking Card** - Summary card in orders list view
3. **Live Status Updates** - Shows courier, AWB code, estimated delivery

## Components Created

### 1. TrackingTimeline.jsx
**Location:** `src/components/Shiprocket/TrackingTimeline.jsx`

Displays comprehensive order tracking timeline in OrderDetails page.

**Features:**
- Visual timeline with icons for each status
- Completed steps shown in green
- Order placed → Payment → Confirmed → Shipped → In Transit → Out for Delivery → Delivered
- Shows courier details and AWB code
- Estimated delivery date
- Current status badge

**Timeline Statuses:**
```
- Order Placed: ✓ (green)
- Payment Confirmed: ✓ (if paid)
- Order Confirmed: ✓
- Shipped: ✓ (if status allows)
- In Transit: ✓ (if in transit or delivered)
- Out for Delivery: ✓ (if out for delivery or delivered)
- Delivered: ✓ (if delivered)
- Cancelled: ✗ (red) (if cancelled)
```

### 2. TrackingCard.jsx
**Location:** `src/components/Shiprocket/TrackingCard.jsx`

Compact tracking summary for Orders list view.

**Features:**
- Progress bar (0-100%)
- Status icon (colored based on status)
- Estimated delivery date
- Courier name
- Color-coded status:
  - 🟢 Green: Delivered
  - 🔵 Blue: In Transit/Out for Delivery
  - 🔴 Red: Cancelled
  - 🟡 Yellow: Pending/Processing

## Integration

### OrderDetails Page
The tracking timeline is integrated into `src/profile/OrderDetails.jsx`:

```jsx
import TrackingTimeline from "../components/Shiprocket/TrackingTimeline";

// In JSX:
<TrackingTimeline order={order} />
```

**Displays:**
- Below items section
- Full detailed timeline with all status updates
- Courier and AWB information
- Current order status

### Orders List Page
The tracking card is integrated into `src/profile/Orders.jsx`:

```jsx
import TrackingCard from "../components/Shiprocket/TrackingCard";

// In JSX:
<TrackingCard order={order} />
```

**Displays:**
- Below payment status
- Quick visual progress indicator
- Estimated delivery date
- Courier information

## Data Structure

The feature uses the shipping object from order API response:

```json
{
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
      "awb_code": "AWB123456789",
      "courier_company_id": "217",
      "courier_name": "India Post",
      "current_status": "Order Created",
      "shipment_status": "NEW"
    }
  }
}
```

## Order Status Flow

```
Pending (Order Confirmed)
    ↓
Shipped (Courier picked up)
    ↓
In Transit (En route to destination)
    ↓
Out for Delivery (Delivery agent has it)
    ↓
Delivered (Successfully delivered)
    
Or at any step → Cancelled
```

## Progress Bar Calculation

- **Pending/Processing:** 20%
- **Shipped:** 40%
- **In Transit:** 60%
- **Out for Delivery:** 85%
- **Delivered:** 100%
- **Cancelled:** 0% (Red bar)

## Icons Used (from lucide-react)

- 📦 `Package` - Order Placed
- ✓ `CheckCircle2` - Confirmed/Delivered
- 🚚 `Truck` - Shipped/In Transit
- 📍 `MapPin` - In Transit
- ⚠️ `AlertCircle` - Cancelled
- 🕐 `Clock` - Pending (not used currently)

## Styling

Both components use Tailwind CSS with:
- Pink accents (`text-pink-600`, `border-pink-100`)
- Gray backgrounds (`bg-gray-50`)
- Green for completed steps
- Blue for in-transit status
- Red for cancelled status
- White cards with shadows and rounded corners

## Responsive Design

- Mobile: Reduced padding, compact icons
- Tablet: Medium spacing
- Desktop: Full spacing and larger text

## Future Enhancements

1. **Live Updates:** Real-time WebSocket updates from Shiprocket
2. **Tracking API Integration:** Call Shiprocket tracking API for latest status
3. **Push Notifications:** Notify user on status changes
4. **SMS/Email:** Send updates via SMS/Email integration
5. **Map View:** Show delivery location on map
6. **Chat Support:** Direct support button for tracking queries
7. **Return/Refund:** Show return tracking if applicable
8. **Proof of Delivery:** Show delivery photo from courier

## Testing

Test with different order statuses:
1. Create orders with different statuses in database
2. Verify timeline updates correctly
3. Check progress bar accuracy
4. Validate date formatting for different locales
5. Test responsive layout on mobile devices

## API Response Updates

The backend should populate:
- `order.shipping.shiprocket.awb_code` - Tracking number
- `order.shipping.shiprocket.current_status` - Live status
- `order.shipping.estimated_delivery` - Expected delivery date
- `order.shipping.tracking_updates` - Array of status updates with timestamps
