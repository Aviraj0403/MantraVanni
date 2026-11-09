import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Pagination, Navigation } from "swiper/modules";

export default function Testimonials() {
  const testimonials = [
    {
      id: 1,
      name: "Smita mishra",
      role: "Cosmetic Product User",
      image: "https://i.ibb.co/4Ws7dby/girl1.jpg",
      feedback:
        "This cosmetic product has completely changed my skincare routine. The glow, hydration, and softness it gives my skin is amazing. I noticed visible results within just one week!",
      // Unsplash background image for card (soft pastel abstract)
      bgImage: "https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=600&auto=format",
    },
    {
      id: 2,
      name: "Sweety sharma",
      role: "Beauty Enthusiast",
      image: "https://i.ibb.co/5LM5ZJB/girl2.jpg",
      feedback:
        "I absolutely love this product! It feels premium, absorbs quickly, and gives a natural shine. My acne marks started fading and my skin tone improved within days.",
      bgImage: "https://images.unsplash.com/photo-1557683316-973673baf926?w=600&auto=format",
    },
    {
      id: 3,
      name: "Manshi Gupta",
      role: "Makeup Artist",
      image: "https://i.ibb.co/D5B8jSB/girl3.jpg",
      feedback:
        "As a makeup artist, I’ve tried many brands. But this product is truly impressive — lightweight, long-lasting, and perfect for daily use. Highly recommended for all skin types!",
      bgImage: "https://images.unsplash.com/photo-1557682260-96773eb01377?w=600&auto=format",
    },
  ];

  return (
    <section className="py-10 bg-gradient-to-br from-primary-50 via-white to-primary-50">
      <div className="container mx-auto px-5 max-w-7xl">

        {/* Heading with modern design */}
        <div className="text-center mb-14">
          <div className="inline-block px-4 py-1 bg-primary-100 rounded-full text-primary-700 text-sm font-semibold mb-4">
            Testimonials
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold mb-5 bg-gradient-to-r from-primary-700 to-primary-600 bg-clip-text text-transparent">
            What Our Clients Say
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-primary-500 to-primary-500 mx-auto rounded-full mb-6"></div>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Beauty lovers from across India trust our cosmetic products for their amazing results.
            Our formulations are designed to enhance your natural glow, improve skin texture,
            and give long-lasting nourishment.
          </p>
        </div>

        {/* Swiper Slider */}
        <Swiper
          slidesPerView={1}
          spaceBetween={30}
          pagination={{ clickable: true, el: ".custom-pagination" }}
          navigation={{ nextEl: ".custom-next", prevEl: ".custom-prev" }}
          breakpoints={{
            640: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          modules={[Pagination, Navigation]}
          className="pb-14"
        >
          {testimonials.map((testimonial) => (
            <SwiperSlide key={testimonial.id}>
              {/* Card with background image from Unsplash - no rounded corners */}
              <div 
                className="relative rounded-xl overflow-hidden shadow-xl transition-transform duration-300 hover:scale-105 hover:shadow-2xl"
                style={{ minHeight: "320px" }}
              >
                {/* Background Image with overlay */}
                <div 
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${testimonial.bgImage})` }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30"></div>
                
                {/* Content */}
                <div className="relative z-10 p-6 flex flex-col h-full">
                  {/* Profile section - image without rounded shape */}
                  <div className="flex items-center mb-5">
                    <img
                    
                      alt={testimonial.name}
                      className="w-14 h-14 object-cover"
                    />
                    <div className="ml-4">
                      <h4 className="font-bold text-white text-lg">{testimonial.name}</h4>
                      <p className="text-sm text-white/80">{testimonial.role}</p>
                    </div>
                  </div>

                  {/* Quote icon */}
                  <div className="mb-3">
                    <svg className="w-8 h-8 text-white/40" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                    </svg>
                  </div>

                  {/* Feedback */}
                  <p className="text-white text-base leading-relaxed flex-1">
                    {testimonial.feedback}
                  </p>
                  
                  {/* Rating stars */}
                  <div className="flex mt-4">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 24 24">
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Custom Controls with modern styling */}
        <div className="flex justify-between items-center mt-8">
          {/* Pagination dots container */}
          <div className="custom-pagination flex space-x-2"></div>

          {/* Navigation Buttons */}
          <div className="flex space-x-3">
            <button className="custom-prev w-10 h-10 rounded-full bg-primary-600 text-white hover:bg-primary-700 transition-colors flex items-center justify-center shadow-md">
              ←
            </button>
            <button className="custom-next w-10 h-10 rounded-full bg-primary-600 text-white hover:bg-primary-700 transition-colors flex items-center justify-center shadow-md">
              →
            </button>
          </div>
        </div>

      </div>

      {/* Custom CSS for swiper pagination styling */}
      <style jsx>{`
        :global(.custom-pagination .swiper-pagination-bullet) {
          background-color: #d8b4fe;
          opacity: 0.6;
          width: 10px;
          height: 10px;
          transition: all 0.2s ease;
        }
        :global(.custom-pagination .swiper-pagination-bullet-active) {
          background-color: #9333ea;
          opacity: 1;
          width: 24px;
          border-radius: 8px;
        }
        :global(.custom-prev.swiper-button-disabled),
        :global(.custom-next.swiper-button-disabled) {
          opacity: 0.4;
          cursor: not-allowed;
        }
      `}</style>
    </section>
  );
}