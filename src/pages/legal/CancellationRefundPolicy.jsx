import React from "react";
import PolicyLayout from "./PolicyLayout";

// Generic template - see the legal note in PolicyLayout.jsx (needs legal review before go-live).
const sections = [
  { id: "cancel", title: "Cancelling an order", body: [
    ["You can cancel an order before it is shipped from your Orders page or by contacting support.", "Once an order has been handed to the courier it cannot be cancelled; you may refuse delivery or request a return after receiving it.", "If we cancel an order (for example, an item is out of stock), you receive a full refund."],
  ]},
  { id: "returns", title: "Returns and exchanges", body: [
    ["Raise a return or exchange request within 7 days of delivery.", "Returns are accepted for damaged, defective or incorrect items. Items must be unused and in original packaging.", "Please share your order number and clear photos of the item and packaging when you contact us.", "Some items, such as consumables, personalised or hygiene-sensitive products, may not be eligible unless they arrive damaged. Eligibility is shown on the product page where it applies."],
  ]},
  { id: "process", title: "How the process works", body: [
    ["Contact us with your order details and the reason for return.", "We review the request and confirm approval, usually within 24 to 48 hours.", "We arrange pickup or share return instructions.", "After we receive and check the item, we issue your refund or ship the replacement."],
  ]},
  { id: "refunds", title: "Refunds", body: [
    ["Prepaid orders are refunded to the original payment method. Banks usually take 5 to 7 working days to show the amount after we initiate the refund.", "Cash on Delivery orders are refunded to your wallet or by bank transfer once you share account details.", "Shipping charges are refundable only if the return is due to our error (damaged, defective or wrong item).", "Where a payment was debited but no order was created, the amount is automatically refunded."],
  ]},
  { id: "contact", title: "Need help?", body: [
    (s) => `Contact us at ${s.supportEmail || "our Contact page"}${s.supportPhone ? " or " + s.supportPhone : ""} and quote your order number.`,
  ]},
];

export default function CancellationRefundPolicy() {
  return (
    <PolicyLayout
      title="Cancellation & Refund Policy"
      summary="When you can cancel an order, return an item and how refunds are issued."
      path="/cancellation-refund-policy"
      lastUpdated="11 November 2026"
      sections={sections}
    />
  );
}
