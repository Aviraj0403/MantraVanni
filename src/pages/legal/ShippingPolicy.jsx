import React from "react";
import PolicyLayout from "./PolicyLayout";

// Generic template - see the legal note in PolicyLayout.jsx (needs legal review before go-live).
const sections = [
  { id: "coverage", title: "Where we deliver", body: [
    "We deliver to most serviceable pin codes across India through trusted courier partners. Enter your pin code on the product page or at checkout to confirm delivery to your area.",
  ]},
  { id: "processing", title: "Order processing", body: [
    "Orders are usually packed and handed to the courier within 1 to 2 business days. Orders placed on Sundays or public holidays are processed on the next business day.",
  ]},
  { id: "time", title: "Delivery time", body: [
    "Delivery usually takes 3 to 7 business days depending on your location; remote areas may take longer. Timelines are estimates and can be affected by weather, festivals, strikes or courier delays.",
  ]},
  { id: "charges", title: "Shipping charges", body: [
    "Shipping charges, if any, are calculated by our system based on your order and delivery address, and are shown at checkout before you pay. Any free-shipping threshold is displayed on the store.",
  ]},
  { id: "tracking", title: "Tracking", body: [
    "Once your order ships you receive tracking details by SMS, email or WhatsApp. You can also use the Track Order page at any time.",
  ]},
  { id: "delivery", title: "Delivery attempts and damaged parcels", body: [
    ["The courier will usually attempt delivery up to three times. Please keep your phone reachable.", "If the address is incorrect or the parcel is refused or undelivered, it returns to us and we will contact you; re-shipping charges may apply.", "Please check the parcel on delivery. If it is visibly damaged, tell the courier and contact us within 48 hours with photos."],
  ]},
  { id: "help", title: "Need help?", body: [
    (s) => `Write to ${s.supportEmail || "us through the Contact page"} with your order number for any delivery query.`,
  ]},
];

export default function ShippingPolicy() {
  return (
    <PolicyLayout
      title="Shipping & Delivery Policy"
      summary="How and when we ship your order, delivery charges and what to do if something goes wrong."
      path="/shipping-policy"
      lastUpdated="11 November 2026"
      sections={sections}
    />
  );
}
