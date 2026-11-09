// import React, { useRef } from "react";
// import { ChevronLeft, ChevronRight } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import { useQuery } from "@tanstack/react-query";  // Import React Query hook
// import { getMenuCategories } from "../../services/categoryApi";  // API function for fetching categories

// export default function CategorySlider() {
//   const scrollRef = useRef(null);
//   const navigate = useNavigate();

//   let isDown = false;
//   let startX;
//   let scrollLeft;

//   // Fetch categories using React Query -- new tech mutation 
//   const { data: menuItems, isLoading, isError, error } = useQuery({
//     queryKey: ["categories"],  // Query key
//     queryFn: getMenuCategories,  // Fetch function
//     onError: (err) => {
//       console.error("Error fetching categories:", err);
//     },
//   });
//   console.log(menuItems);  // Ensure the categories data is correct

//   // Handle category click (navigate to category page)
//   const handleCategoryClick = (slug) => {
//     navigate(`/${slug}`); // Navigate to dynamic category page using slug
//   };

//   // Scroll function
//   const scroll = (direction) => {
//     const { current } = scrollRef;
//     if (direction === "left") current.scrollBy({ left: -250, behavior: "smooth" });
//     else current.scrollBy({ left: 250, behavior: "smooth" });
//   };

//   // Mouse drag scroll
//   const handleMouseDown = (e) => {
//     isDown = true;
//     scrollRef.current.classList.add("cursor-grabbing");
//     startX = e.pageX - scrollRef.current.offsetLeft;
//     scrollLeft = scrollRef.current.scrollLeft;
//   };
//   const handleMouseLeave = () => {
//     isDown = false;
//     scrollRef.current.classList.remove("cursor-grabbing");
//   };
//   const handleMouseUp = () => {
//     isDown = false;
//     scrollRef.current.classList.remove("cursor-grabbing");
//   };
//   const handleMouseMove = (e) => {
//     if (!isDown) return;
//     e.preventDefault();
//     const x = e.pageX - scrollRef.current.offsetLeft;
//     const walk = (x - startX) * 1.2;
//     scrollRef.current.scrollLeft = scrollLeft - walk;
//   };

//   return (
//    <div className="w-full py-5 bg-white relative px-3 sm:px-4">
//   {/* Header with arrows */}
//   <div className="flex justify-between items-center mb-7 ml-5">
//     <h2 className="text-2xl font-semibold text-primary-600">
//       Shop by Categories
//     </h2>
//     <div className="flex items-center gap-3">
//       <button
//         onClick={() => scroll("left")}
//         className="p-2 bg-primary-100 text-primary-600 rounded-full shadow hover:bg-primary-500 hover:text-white transition-all duration-300"
//       >
//         <ChevronLeft size={22} />
//       </button>
//       <button
//         onClick={() => scroll("right")}
//         className="p-2 bg-primary-100 text-primary-600 rounded-full shadow hover:bg-primary-500 hover:text-white transition-all duration-300"
//       >
//         <ChevronRight size={22} />
//       </button>
//     </div>
//   </div>

//   {/* Category List */}
//   <div className="px-2 sm:px-4">
//     <div
//       ref={scrollRef}
//      className="flex overflow-x-auto scrollbar-hide cursor-grab select-none scroll-smooth space-x-1 sm:space-x-4 px-2"


//       onMouseLeave={handleMouseLeave}
//       onMouseUp={handleMouseUp}
//       onMouseMove={handleMouseMove}
//     >
//      {!isLoading && !isError && menuItems?.map((cat) => (
//   <div
//     key={cat._id}
//     onClick={() => handleCategoryClick(cat.slug)}
//     className="flex-shrink-0 w-[45.33%] sm:w-[180px] cursor-pointer group relative px-1 gap-1"
//   >
//     <div className="rounded-2xl overflow-hidden shadow-md border border-gray-100 transition-all duration-300 hover:shadow-xl hover:scale-105 bg-white">
//       <img
//         src={cat.image?.[0]}
//         alt={cat.name}
//        className="w-full h-[90px] sm:h-[140px] object-fit"
//   // ✅ image fit fix
//       />
//       <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-all"></div>
//     </div>
//     <h3 className="text-center mt-2 font-semibold text-brand-text group-hover:text-primary-600 text-xs sm:text-base">
//       {cat.name}
//     </h3>
//   </div>
// ))}

//     </div>
//   </div>
// </div>

//   );
// }




import React, { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getMenuCategories } from "../../services/categoryApi";

export default function CategorySlider() {
  const scrollRef = useRef(null);
  const navigate = useNavigate();
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const { data: menuItems, isLoading, isError, error } = useQuery({
    queryKey: ["categories"],
    queryFn: getMenuCategories,
    onError: (err) => {
      console.error("Error fetching categories:", err);
    },
  });

  const handleCategoryClick = (slug) => {
    navigate(`/${slug}`);
  };

  const scroll = (direction) => {
    const { current } = scrollRef;
    if (direction === "left") {
      current.scrollBy({ left: -300, behavior: "smooth" });
    } else {
      current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  const checkScrollPosition = () => {
    const element = scrollRef.current;
    if (element) {
      setShowLeftArrow(element.scrollLeft > 0);
      setShowRightArrow(
        element.scrollLeft < element.scrollWidth - element.clientWidth - 10
      );
    }
  };

  useEffect(() => {
    const element = scrollRef.current;
    if (element) {
      element.addEventListener("scroll", checkScrollPosition);
      checkScrollPosition();
      return () => element.removeEventListener("scroll", checkScrollPosition);
    }
  }, [menuItems]);

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="w-full py-8 bg-gradient-to-br from-primary-50 via-white to-primary-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <div className="h-8 w-48 bg-gray-200 rounded-lg animate-pulse"></div>
            <div className="flex gap-3">
              <div className="h-10 w-10 bg-gray-200 rounded-full animate-pulse"></div>
              <div className="h-10 w-10 bg-gray-200 rounded-full animate-pulse"></div>
            </div>
          </div>
          <div className="flex gap-5 overflow-hidden">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex-shrink-0 w-[180px]">
                <div className="h-[160px] bg-gray-200 rounded-2xl animate-pulse"></div>
                <div className="h-4 w-24 bg-gray-200 rounded mx-auto mt-3 animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full py-8 bg-gradient-to-br from-primary-50 via-white to-primary-50">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-red-500">Error loading categories: {error?.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full py-8 md:py-12 bg-gradient-to-br from-primary-50 via-white to-primary-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 md:mb-12">
          <div className="text-center md:text-left mb-4 md:mb-0">
            <div className="flex items-center gap-2 justify-center md:justify-start mb-2">
              <Sparkles className="text-primary-500 w-5 h-5" />
              <span className="text-primary-600 font-semibold text-sm uppercase tracking-wide">
                Sacred Puja Collections
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-brand-text gold-emboss-3d">
              Explore Sacred{" "}
              <span className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 bg-clip-text text-transparent">
                Categories
              </span>
            </h2>
            <p className="text-stone-600 mt-2 text-sm md:text-base">
              Handcrafted puja samagri, brass idols, dhoop & divine essentials
            </p>
          </div>

          {/* Navigation Arrows */}
          <div className="flex items-center gap-3">
            {showLeftArrow && (
              <button
                onClick={() => scroll("left")}
                className="p-2.5 bg-white/90 text-primary-600 rounded-full shadow-lg hover:bg-primary-600 hover:text-white transition-all duration-300 hover:scale-110 border border-amber-200"
                aria-label="Scroll left"
              >
                <ChevronLeft size={24} />
              </button>
            )}
            {showRightArrow && (
              <button
                onClick={() => scroll("right")}
                className="p-2.5 bg-white/90 text-primary-600 rounded-full shadow-lg hover:bg-primary-600 hover:text-white transition-all duration-300 hover:scale-110 border border-amber-200"
                aria-label="Scroll right"
              >
                <ChevronRight size={24} />
              </button>
            )}
          </div>
        </div>

        {/* Category Slider */}
        <div className="relative">
          <div
            ref={scrollRef}
            className="flex overflow-x-auto scrollbar-hide cursor-grab active:cursor-grabbing scroll-smooth gap-5 pb-6 px-1"
            onScroll={checkScrollPosition}
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {menuItems?.map((cat, index) => (
              <div
                key={cat._id}
                onClick={() => handleCategoryClick(cat.slug)}
                className="flex-shrink-0 w-[160px] md:w-[200px] cursor-pointer group"
                style={{
                  animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`,
                }}
              >
                <div className="relative rounded-3xl overflow-hidden bg-white/90 border border-amber-100 card-3d">
                  {/* Image Container */}
                  <div className="relative overflow-hidden h-[140px] md:h-[180px]">
                    <img
                      src={cat.image?.[0]}
                      alt={cat.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                    />
                    {/* Overlay Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* View Button on Hover */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <button className="bg-white/90 backdrop-blur-sm text-primary-600 px-4 py-2 rounded-full text-sm font-semibold hover:bg-primary-600 hover:text-white transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                        View Items
                      </button>
                    </div>
                  </div>

                  {/* Category Info */}
                  <div className="p-3 text-center bg-white">
                    <h3 className="font-semibold text-brand-text group-hover:text-primary-600 transition-colors duration-300 text-sm md:text-base">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-gray-400 mt-1">
                      {cat.description || "Pure Vedic samagri"}
                    </p>
                  </div>

                </div>
              </div>
            ))}
          </div>

          {/* Gradient Overlays for Scroll Indication */}
          {showLeftArrow && (
            <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-white to-transparent pointer-events-none" />
          )}
          {showRightArrow && (
            <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white to-transparent pointer-events-none" />
          )}
        </div>

        {/* View All Categories Button */}
        <div className="text-center mt-10">
          <button
            onClick={() => navigate("/categories")}
            className="px-6 py-2.5 bg-gradient-to-r from-primary-600 to-primary-600 text-white rounded-full font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300"
          >
            View All Categories
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}