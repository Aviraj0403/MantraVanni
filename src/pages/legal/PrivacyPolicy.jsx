import React from "react";
import { useQuery } from "@tanstack/react-query";
import PolicyLayout from "./PolicyLayout";
import { getPublicSettings } from "../../services/settingsApi";

// Generic template - see the legal note in PolicyLayout.jsx (needs legal review before go-live).
const sections = [
  { id: "who", title: "Who we are", body: [
    (s) => `This Privacy Policy explains how ${s.legalName || s.name} ("${s.name}", "we", "us") handles your personal data when you use our website and place orders. We process personal data in line with the Information Technology Act, 2000 and the Digital Personal Data Protection Act, 2023.`,
  ]},
  { id: "data", title: "Information we collect", body: [
    "We collect only what we need to run the store:",
    ["Account details: name, email address, phone number and password (stored in hashed form).", "Order details: delivery address, items purchased, order value and payment status.", "Payment information: payments are processed by our payment partner (Razorpay). We do not store your card, UPI PIN or net-banking credentials.", "Technical data: device and browser type, IP address and pages visited, used for security and to keep the site working.", "Messages you send us through support or contact forms."],
  ]},
  { id: "use", title: "How we use your information", body: [
    ["To create and manage your account, and verify you by one-time password (OTP).", "To process orders, arrange delivery, send order updates and handle returns or refunds.", "To prevent fraud and keep your account and our systems secure.", "To respond to your queries and provide customer support.", "To send promotional messages only where you have chosen to receive them. You can opt out at any time."],
  ]},
  { id: "sharing", title: "Who we share it with", body: [
    "We do not sell your personal data. We share it only with service providers who help us fulfil your order, under appropriate safeguards:",
    ["Payment gateway (Razorpay) to collect payment.", "Courier and logistics partners to deliver your parcel (name, address, phone).", "Communication providers that send OTP, SMS, WhatsApp or email notifications.", "Authorities where required by law or to protect our legal rights."],
  ]},
  { id: "retention", title: "How long we keep it", body: [
    "We keep account and order records for as long as your account is active and as required by tax, accounting and consumer laws. When data is no longer needed it is deleted or anonymised.",
  ]},
  { id: "security", title: "Security", body: [
    "We use encryption in transit (HTTPS), access controls and secure session handling. No online service is completely risk free, so please keep your password and OTP private.",
  ]},
  { id: "rights", title: "Your rights and choices", body: [
    "Subject to applicable law you may access, correct or update your information, withdraw consent, request deletion of your account and data, and raise a grievance. You can manage most of this from your profile, including the Delete Account option, or by contacting us.",
  ]},
  { id: "cookies", title: "Cookies and local storage", body: [
    "We use cookies and browser storage that are necessary for sign-in, your cart and your wishlist. We do not use them to build advertising profiles.",
  ]},
  { id: "children", title: "Children", body: [
    "Our store is intended for adults. We do not knowingly collect personal data of children without the consent of a parent or guardian.",
  ]},
  { id: "changes", title: "Changes to this policy", body: [
    "We may update this policy from time to time. The latest version, with its last updated date, is always on this page.",
  ]},
  { id: "grievance", title: "Grievance redressal", body: [
    (s) => `For privacy concerns or to exercise your rights, contact ${s.supportEmail ? s.supportEmail : "us through the Contact page"}. We aim to acknowledge complaints within 48 hours and resolve them within 30 days.`,
  ]},
];

const marketingSection = {
  id: "marketing", title: "Advertising, Meta Pixel and Conversions API", body: [
    "With your consent where required, we use the Meta (Facebook / Instagram) Pixel and Meta Conversions API to measure the performance of our ads and to show relevant offers. When enabled, your browser and our servers send Meta events such as page views, product views, add to cart, checkout steps, searches and purchases, along with your IP address, browser details, Meta cookie identifiers (_fbp, _fbc) and, if you are signed in and have accepted, your email address and phone number in hashed (SHA-256) form.",
    "We also remember, in your browser, which ad or campaign brought you to the store (UTM parameters and click identifiers) for up to 30 days, and attach it to your order so we can understand which campaigns lead to purchases. Meta processes this data under its own privacy policy.",
    "You can accept or decline at any time using the Cookie & ad preferences link in the footer. If you decline, the Meta Pixel is not loaded and no advertising data about you is sent to Meta.",
  ],
};

export default function PrivacyPolicy() {
  const { data } = useQuery({ queryKey: ["publicSettings"], queryFn: getPublicSettings, staleTime: 5 * 60 * 1000 });
  const marketingOn = data?.marketing?.enabled === true;
  const list = marketingOn ? sections.flatMap((s) => (s.id === "cookies" ? [marketingSection, s] : [s])) : sections;
  return (
    <PolicyLayout
      title="Privacy Policy"
      summary="How we collect, use and protect your personal information when you shop with us."
      path="/privacy-policy"
      lastUpdated="11 November 2026"
      sections={list}
    />
  );
}
