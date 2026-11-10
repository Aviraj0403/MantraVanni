import React from "react";
import img1 from "../../image/Dr Rashel Cart1.png";
import img2 from "../../image/Hilary Rhoda Cart 4.png";
import img3 from "../../image/Maliuo Cart 3.png";
import img4 from "../../image/Mars Cart 2.png";

const products = [
  {
    brand: "mamaearth",
    image: img1,
    offer: "GET 2 MINIS ON ₹349",
    extra: "Extra 5% off on ₹399 + Upto 50% off",
  },
  {
    brand: "DERMDOC",
    image: img2,
    offer: "GET A FREE GIFT ON ₹499",
    extra: "Extra 5% off on ₹399",
  },
  {
    brand: "ALPS",
    image: img3,
    offer: "GET A FREE GIFT ON ₹499",
    extra: "Extra 5% off on ₹299",
  },
  {
    brand: "LAKMÉ",
    image: img4,
    offer: "MINIMUM 30% OFF",
    extra: "on Body Lotion & Moisturizer",
  },
];

export default function PromoSection() {
  return (
    <section className="bg-brand-bg py-12">
      <div className="max-w-7xl mx-auto px-4 md:px-6"> 
        {/* px-4 / px-6 = Left and Right Margin */}
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {products.map((product, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center text-center"
            >
              <img
                src={product.image}
                alt={product.brand}
                className="w-full h-60 object-fit rounded-lg"
              />
              <div className="bg-brand-bg w-full py-3">
                <h3 className="font-bold text-lg text-brand-text">
                  {product.offer}
                </h3>
                <p className="text-gray-600 text-sm">{product.extra}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
