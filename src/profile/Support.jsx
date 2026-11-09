import React from "react";
import { Smile } from "lucide-react";

export default function Support() {
  // Define the WhatsApp number and message
  const whatsappNumber = "+918510879296"; // Remove any "+" sign and spaces
  const message = "How can I help you?";

  // Create the WhatsApp link
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

  return (
    <div>
      <h1 className="text-3xl font-bold text-primary-600 mb-6">Customer Support</h1>
      <p className="text-brand-text mb-6">
        Need help regarding your orders or products? Contact our support team.
      </p>

      <div className="p-6 border border-primary-100 rounded-xl shadow hover:shadow-lg transition duration-300">
        <div className="flex items-center gap-4">
          <Smile className="text-primary-500" size={32} />
          <div>
            <h2 className="text-lg font-semibold text-brand-text">Chat with Support</h2>
            <p className="text-gray-500 text-sm">Our team is ready to assist you 24/7.</p>
            <a
              href={whatsappLink}  // Link to WhatsApp
              target="_blank"  // Open in a new tab
              rel="noopener noreferrer"  // Security
            >
              <button className="mt-2 bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg transition">
                Start Chat
              </button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
