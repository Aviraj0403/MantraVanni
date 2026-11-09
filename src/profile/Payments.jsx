import React from "react";
import { CreditCard } from "lucide-react";

export default function Payments() {
  const cards = [
    { id: 1, type: "Visa", number: "**** **** **** 1234" },
    { id: 2, type: "MasterCard", number: "**** **** **** 5678" },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-primary-600 mb-6">My Payments</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cards.map((card) => (
          <div
            key={card.id}
            className="flex items-center justify-between p-4 border border-primary-100 rounded-xl shadow hover:shadow-lg transition duration-300"
          >
            <div className="flex items-center gap-3">
              <CreditCard className="text-primary-500" size={24} />
              <div>
                <h2 className="font-semibold text-brand-text">{card.type}</h2>
                <p className="text-gray-500">{card.number}</p>
              </div>
            </div>
            <button className="bg-primary-500 hover:bg-primary-600 text-white px-3 py-1 rounded-lg transition">
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
