import React, { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { ChevronLeft, ChevronRight, Truck, ShieldCheck, RefreshCw, Headphones } from "lucide-react";

export default function CosmeticTestimonials() {
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  const testimonials = [
    {
      id: 1,
      name: "Ankit Sharma",
      location: "Delhi",
      feedback:
        "The quality of products is amazing. I felt positive energy after wearing Rudraksha. Thank you MantraVanni!",
    },
    {
      id: 2,
      name: "Pooja Verma",
      location: "Jaipur",
      feedback:
        "Very authentic and pure products. Fast delivery and beautiful packaging. Highly recommended!",
    },
    {
      id: 3,
      name: "Rohit Mehta",
      location: "Mumbai",
      feedback:
        "MantraVanni has a wide range of spiritual products. My go-to store for all puja needs.",
    },
    {
      id: 4,
      name: "Sneha Patel",
      location: "Ahmedabad",
      feedback:
        "Loved the quality of the incense sticks. The fragrance is divine and long-lasting.",
    },
  ];

  return (
    <section className="bg-brand-bg pt-10 pb-0">
      <div className="mx-auto  px-4 sm:px-6">
        {/* Heading */}
        <div className="mb-10 text-center">
          <h2 className="font-serif text-3xl font-bold text-primary-600">What Our Customers Say</h2>
          <div className="mx-auto mt-3 flex items-center justify-center gap-2">
            <div className="h-px w-12 bg-primary-500/40"></div>
            <div className="h-2 w-2 rotate-45 bg-primary-500"></div>
            <div className="h-px w-12 bg-primary-500/40"></div>
          </div>
        </div>

        {/* Testimonials Slider */}
        <div className="relative px-2 sm:px-12">
          <button
            ref={prevRef}
            className="absolute left-0 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-primary-500/30 bg-brand-bg text-primary-600 shadow-sm transition hover:bg-primary-500 hover:text-white disabled:opacity-50 disabled:hover:bg-brand-bg disabled:hover:text-primary-600"
          >
            <ChevronLeft size={20} />
          </button>

          <button
            ref={nextRef}
            className="absolute right-0 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-primary-500/30 bg-brand-bg text-primary-600 shadow-sm transition hover:bg-primary-500 hover:text-white disabled:opacity-50 disabled:hover:bg-brand-bg disabled:hover:text-primary-600"
          >
            <ChevronRight size={20} />
          </button>

          <Swiper
            modules={[Pagination, Navigation]}
            slidesPerView={1}
            spaceBetween={20}
            pagination={{ clickable: true, el: ".custom-pagination" }}
            navigation={{
              prevEl: prevRef.current,
              nextEl: nextRef.current,
            }}
            onInit={(swiper) => {
              swiper.params.navigation.prevEl = prevRef.current;
              swiper.params.navigation.nextEl = nextRef.current;
              swiper.navigation.init();
              swiper.navigation.update();
            }}
            breakpoints={{
              640: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            className="!pb-6"
          >
            {testimonials.map((testimonial) => (
              <SwiperSlide key={testimonial.id}>
                <div className="flex h-full flex-col justify-between rounded-xl bg-[#fdfaf6] p-8 shadow-sm">
                  <div>
                    <div className="mb-4 font-serif text-4xl text-primary-600">“</div>
                    <p className="text-sm font-medium leading-relaxed text-[#5c4a3d]">
                      {testimonial.feedback}
                    </p>
                  </div>
                  <div className="mt-8">
                    <h4 className="font-bold text-[#3E2723]">{testimonial.name}</h4>
                    <p className="text-xs text-gray-500">{testimonial.location}</p>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Pagination */}
          <div className="custom-pagination mt-4 flex justify-center gap-2 [&>.swiper-pagination-bullet-active]:bg-primary-500 [&>.swiper-pagination-bullet]:bg-primary-500/30"></div>
        </div>
      </div>

      {/* Footer Banner */}
      <div className="mt-10 border-y border-primary-500/20 bg-[#fff9f0] py-6">
        <div className="mx-auto max-w-[1360px] px-4 sm:px-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-center justify-center gap-4 text-left">
              <Truck size={32} strokeWidth={1.5} className="text-primary-600" />
              <div>
                <h4 className="text-sm font-bold text-[#3E2723]">Free Shipping</h4>
                <p className="text-xs text-gray-600">On Orders Above ₹999</p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-4 text-left">
              <ShieldCheck size={32} strokeWidth={1.5} className="text-primary-600" />
              <div>
                <h4 className="text-sm font-bold text-[#3E2723]">Secure Payments</h4>
                <p className="text-xs text-gray-600">100% Safe & Secure</p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-4 text-left">
              <RefreshCw size={32} strokeWidth={1.5} className="text-primary-600" />
              <div>
                <h4 className="text-sm font-bold text-[#3E2723]">Easy Returns</h4>
                <p className="text-xs text-gray-600">Hassle Free Returns</p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-4 text-left">
              <Headphones size={32} strokeWidth={1.5} className="text-primary-600" />
              <div>
                <h4 className="text-sm font-bold text-[#3E2723]">24/7 Support</h4>
                <p className="text-xs text-gray-600">We're Here to Help</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
