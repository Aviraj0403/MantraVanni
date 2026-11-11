import React from "react";
import PolicyLayout from "./PolicyLayout";

// Generic template - see the legal note in PolicyLayout.jsx (needs legal review before go-live).
const sections = [
  { id: "acceptance", title: "Acceptance of terms", body: [
    (s) => `By accessing this website or placing an order with ${s.legalName || s.name} you agree to these Terms & Conditions, our Privacy Policy, Cancellation & Refund Policy and Shipping & Delivery Policy. If you do not agree, please do not use the site.`,
  ]},
  { id: "eligibility", title: "Eligibility and account", body: [
    "You must be at least 18 years old, or use the site under the supervision of a parent or guardian, to place orders. You are responsible for keeping your login details confidential and for all activity on your account. Please give accurate information.",
  ]},
  { id: "products", title: "Products and pricing", body: [
    ["Product images and descriptions are as accurate as we can make them; slight variations in colour, size or finish may occur with handcrafted and natural items.", "All prices are in Indian Rupees (INR) and include applicable taxes unless stated otherwise.", "Prices, offers and availability may change without notice. The price confirmed at checkout is the price you pay.", "We may cancel an order if an item is out of stock or a price was clearly displayed in error, and will refund any amount paid."],
  ]},
  { id: "orders", title: "Orders and payment", body: [
    "An order is confirmed only after payment is successful (or the order is accepted for Cash on Delivery). Payments are processed securely by our payment partner. We may refuse or cancel orders that appear fraudulent or that breach these terms.",
  ]},
  { id: "coupons", title: "Coupons and wallet", body: [
    "Coupons are valid only as stated in the offer, cannot be combined unless specified, and have no cash value. Wallet balance, where available, can be used only on this store and is subject to the rules shown in your wallet.",
  ]},
  { id: "shipping", title: "Shipping, returns and refunds", body: [
    "Shipping, delivery, cancellation, returns and refunds are governed by our Shipping & Delivery Policy and Cancellation & Refund Policy, which form part of these terms.",
  ]},
  { id: "use", title: "Acceptable use", body: [
    ["Do not misuse the site, attempt unauthorised access, scrape data or interfere with its operation.", "Do not post unlawful, abusive or misleading reviews or content."],
  ]},
  { id: "ip", title: "Intellectual property", body: [
    (s) => `All content on this site, including the ${s.name} name, logo, text, images and design, is owned by or licensed to us and may not be copied or reused without written permission.`,
  ]},
  { id: "liability", title: "Limitation of liability", body: [
    "To the extent permitted by law, we are not liable for indirect or consequential losses arising from use of the site or products. Nothing in these terms limits any right you have under the Consumer Protection Act, 2019. Spiritual and wellness products are offered as items of faith and tradition and are not a substitute for medical advice.",
  ]},
  { id: "law", title: "Governing law", body: [
    "These terms are governed by the laws of India. Subject to applicable consumer law, courts at the location of our registered office have jurisdiction over disputes.",
  ]},
  { id: "changes", title: "Changes", body: [
    "We may update these terms from time to time. Continued use of the site after an update means you accept the revised terms.",
  ]},
];

export default function TermsAndConditions() {
  return (
    <PolicyLayout
      title="Terms & Conditions"
      summary="The terms that apply when you browse our store and place an order."
      path="/terms-and-conditions"
      lastUpdated="11 November 2026"
      sections={sections}
    />
  );
}
