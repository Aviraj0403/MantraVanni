// import React from "react";
// import {
//   FaPalette,       // Makeup
//   FaKissWinkHeart, // Lip Care
//   FaLeaf,          // Skin Care
//   FaCut,           // Hair Care
//   FaHandHolding,   // Nail Paint
//   FaCloud,         // Fragrance
//   FaPumpSoap,      // Body Lotion
//   FaGem            // Accessories
// } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";

// export default function MobileCategorySection() {
//   const navigate = useNavigate();

//   const categories = [
//     { id: 1, title: "Makeup", icon: <FaPalette size={22} /> },
//     { id: 2, title: "Lip Care", icon: <FaKissWinkHeart size={22} /> },
//     { id: 3, title: "Skin Care", icon: <FaLeaf size={22} /> },
//     { id: 4, title: "Hair Care", icon: <FaCut size={22} /> },
//     { id: 5, title: "Nail Paint", icon: <FaHandHolding size={22} /> },
//     { id: 6, title: "Fragrance", icon: <FaCloud size={22} /> },
//     { id: 7, title: "Body Lotion", icon: <FaPumpSoap size={22} /> },
//     { id: 8, title: "Accessories", icon: <FaGem size={22} /> },
//   ];

//   const handleCategoryClick = (categoryId) => {
//     navigate(`/category/${categoryId}`); // ✅ Navigate to dynamic category page
//   };

//   return (
//     <div className="block md:hidden bg-white py-3 border-t border-b border-gray-200">
//       <div className="flex items-center justify-start gap-4 overflow-x-auto px-4 scrollbar-hide">
//         {categories.map((cat) => (
//           <div
//             key={cat.id}
//             onClick={() => handleCategoryClick(cat.id)}
//             className="flex flex-col items-center justify-center min-w-[70px] text-center cursor-pointer group active:scale-95 transition-all"
//           >
//             <div className="text-primary-600 mb-1 group-hover:text-primary-700 transition-colors">
//               {cat.icon}
//             </div>
//             <span className="text-[11px] font-medium text-brand-text whitespace-nowrap group-hover:text-primary-600">
//               {cat.title}
//             </span>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// _________________DYNAMIC CATEGORY SECTION USING API FETCH_________________
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";  // Import React Query hook
import { getMenuCategories } from "../../services/categoryApi";  // API function for fetching categories

export default function MobileCategorySection() {
  const navigate = useNavigate();

  // Fetch categories using React Query
  const { data: menuItems, isLoading, isError, error } = useQuery({
    queryKey: ["categories"],  // Query key
    queryFn: getMenuCategories,  // Fetch function
    onError: (err) => {
      console.error("Error fetching categories:", err);
    },
  });
  const handleCategoryClick = (slug) => {
    navigate(`/${slug}`); // Navigate to dynamic category page using slug
  };

  return (
    <div className="block md:hidden bg-white py-3 border-t border-b border-gray-200">
      <div className="flex items-center justify-start gap-4 overflow-x-auto px-4 scrollbar-hide">
        {/* Loading State */}
        {isLoading && <div className="w-full text-center text-primary-600">Loading...</div>}

        {/* Error State */}
        {isError && <div className="w-full text-center text-red-600">Error fetching categories. Please try again later.</div>}

        {/* Display Categories */}
        {!isLoading && !isError && menuItems?.map((cat) => (
          <div
            key={cat._id}
            onClick={() => handleCategoryClick(cat.slug)}  // Handle category click
            className="flex flex-col items-center justify-center min-w-[70px] text-center cursor-pointer group active:scale-95 transition-all"
          >
            {/* Category Image */}
            <div className="text-primary-600 mb-1 group-hover:text-primary-700 transition-colors">
              <img
                src={cat.image[1]} // Use the second image from the image array
                alt={cat.name}
                className="w-20 h-20 object-cover rounded-full"
              />
            </div>

            {/* Category Title */}
            <span className="text-[11px] font-medium text-brand-text whitespace-nowrap group-hover:text-primary-600">
              {cat.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
