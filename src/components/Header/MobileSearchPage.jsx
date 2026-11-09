import React, { useState, useEffect, useRef } from "react";
import { Search, X, Clock, TrendingUp, Sparkles, ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getMenuCategories, getSearchSuggestions } from "../../services/categoryApi";

export default function MobileSearchPage() {
  const [query, setQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState(() => {
    const saved = localStorage.getItem('recentSearches');
    return saved ? JSON.parse(saved) : [];
  });
  const navigate = useNavigate();
  const inputRef = useRef(null);

  const trendingKeywords = [
    "Shoes Craze Sale",
    "Perfumes for Women",
    "Trending Fashion",
    "New Arrivals",
    "Hot Deals"
  ];

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Fetch categories
  const { data: menuItems, isLoading: isCategoriesLoading, isError: isCategoriesError } = useQuery({
    queryKey: ["categories"],
    queryFn: getMenuCategories,
    onError: (err) => console.error("Error fetching categories:", err),
  });

  // Fetch search suggestions
  const { data: suggestions, isLoading, isError } = useQuery({
    queryKey: ['searchSuggestions', query],
    queryFn: () => getSearchSuggestions(query),
    enabled: query.length > 1,
    onError: (err) => console.error("Error fetching search suggestions:", err),
  });

  const handleSearch = (searchTerm) => {
    setQuery(searchTerm);
    
    // Add to recent searches
    if (searchTerm && !recentSearches.includes(searchTerm)) {
      const updated = [searchTerm, ...recentSearches.filter(s => s !== searchTerm)].slice(0, 5);
      setRecentSearches(updated);
      localStorage.setItem('recentSearches', JSON.stringify(updated));
    }
  };

  const handleClearRecent = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  const handleProductClick = (slug) => {
    if (query && !recentSearches.includes(query)) {
      const updated = [query, ...recentSearches].slice(0, 5);
      setRecentSearches(updated);
      localStorage.setItem('recentSearches', JSON.stringify(updated));
    }
    navigate(`/product/${slug}`);
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-primary-50 via-primary-50 to-blue-50 mt-[65px] sm:mt-0">

      {/* 🎨 Sticky Search Header with Glass Effect */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200 shadow-sm">
        <div className="px-4 py-4">
          <div className="flex gap-3 items-center">
            <div className="flex-1 relative">
              <div className="flex items-center bg-white rounded-2xl px-4 py-3 shadow-md border border-gray-200 transition-all focus-within:ring-2 focus-within:ring-primary-400 focus-within:border-transparent">
                <Search size={20} className="text-gray-400" />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Search products, brands..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="bg-transparent ml-3 outline-none text-brand-text w-full text-base placeholder-gray-400"
                />
                {query.length > 0 && (
                  <button 
                    onClick={() => setQuery("")} 
                    className="ml-2 p-1 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X size={18} className="text-gray-500" />
                  </button>
                )}
              </div>
            </div>
            
            {query.length > 0 && (
              <button 
                onClick={() => setQuery("")} 
                className="text-primary-600 font-semibold text-sm px-2"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="px-4 pb-20">
        {/* 🔎 Search Results - Show when query exists */}
        {query.length > 1 && (
          <div className="mt-6">
            {isLoading && (
              <div className="flex justify-center items-center py-16">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-primary-200 border-t-purple-600 rounded-full animate-spin"></div>
                  <ShoppingBag className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-primary-600" size={24} />
                </div>
              </div>
            )}

            {isError && (
              <div className="text-center py-16 px-4">
                <div className="inline-block p-4 bg-red-50 rounded-2xl mb-4">
                  <X size={48} className="text-red-500" />
                </div>
                <h3 className="text-lg font-semibold text-brand-text mb-2">Oops! Something went wrong</h3>
                <p className="text-gray-600 text-sm">Error fetching results. Please try again.</p>
              </div>
            )}

            {!isLoading && !isError && suggestions?.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-brand-text">
                    Found {suggestions.length} Results
                  </h2>
                  <Sparkles size={20} className="text-primary-500" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {suggestions.map((item) => (
                    <div
                      key={item._id}
                      onClick={() => handleProductClick(item.slug)}
                      className="group cursor-pointer bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                    >
                      {/* Product Image */}
                      <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-primary-100 to-primary-100">
                        <img
                          src={item.pimages?.[0] || '/placeholder.jpg'}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          onError={(e) => e.target.src = '/placeholder.jpg'}
                        />
                        {item.discount && (
                          <div className="absolute top-2 right-2 bg-gradient-to-r from-primary-500 to-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                            -{item.discount}%
                          </div>
                        )}
                      </div>
                      
                      {/* Product Details */}
                      <div className="p-3">
                        <h3 className="text-sm font-semibold text-brand-text line-clamp-2 mb-2 min-h-[40px]">
                          {item.name}
                        </h3>
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-lg font-bold text-primary-600">
                              ₹{item.price}
                            </span>
                            {item.originalPrice && (
                              <span className="text-xs text-gray-400 line-through ml-2">
                                ₹{item.originalPrice}
                              </span>
                            )}
                          </div>
                          <button className="text-primary-600 text-xs font-semibold group-hover:text-primary-700">
                            View →
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!isLoading && !isError && suggestions?.length === 0 && (
              <div className="text-center py-16 px-4">
                <div className="inline-block p-6 bg-gradient-to-br from-primary-100 to-primary-100 rounded-full mb-4">
                  <Search size={48} className="text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-brand-text mb-2">No products found</h3>
                <p className="text-gray-600 text-sm mb-6">Try different keywords or browse categories</p>
              </div>
            )}
          </div>
        )}

        {/* 🏠 Default View - Show when no query */}
        {query.length === 0 && (
          <div className="mt-6 space-y-8">
            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Clock size={18} className="text-gray-500" />
                    <h3 className="text-sm font-bold text-brand-text uppercase tracking-wide">
                      Recent Searches
                    </h3>
                  </div>
                  <button 
                    onClick={handleClearRecent}
                    className="text-xs text-primary-600 font-semibold hover:text-primary-700"
                  >
                    Clear All
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((search, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSearch(search)}
                      className="px-4 py-2 bg-white rounded-full text-sm text-brand-text font-medium shadow-sm border border-gray-200 hover:border-primary-300 hover:shadow-md transition-all"
                    >
                      {search}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Trending Keywords */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp size={18} className="text-primary-500" />
                <h3 className="text-sm font-bold text-brand-text uppercase tracking-wide">
                  Trending Searches
                </h3>
              </div>
              <div className="space-y-2">
                {trendingKeywords.map((item, i) => (
                  <div
                    key={i}
                    onClick={() => handleSearch(item)}
                    className="flex items-center gap-3 px-4 py-3 bg-white rounded-xl text-brand-text border border-gray-200 cursor-pointer hover:border-primary-300 hover:shadow-md transition-all group"
                  >
                    <div className="p-2 bg-gradient-to-br from-primary-100 to-primary-100 rounded-lg group-hover:from-primary-200 group-hover:to-primary-200 transition-all">
                      <Search size={16} className="text-primary-600" />
                    </div>
                    <span className="flex-1 font-medium">{item}</span>
                    <span className="text-xs text-primary-600 font-semibold">🔥</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 🛒 Original CategorySlider */}
            <div className="mt-8">
              <h2 className="text-2xl font-semibold text-primary-600 mb-4">Shop by Categories</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {isCategoriesLoading && (
                  <p className="w-full text-center text-primary-600 col-span-full">Loading categories...</p>
                )}
                {isCategoriesError && (
                  <div className="w-full text-center text-red-600 col-span-full">
                    Error fetching categories. Please try again later.
                  </div>
                )}
                {!isCategoriesLoading && !isCategoriesError && menuItems?.map((cat) => (
                  <div
                    key={cat._id}
                    onClick={() => navigate(`/${cat.slug}`)}
                    className="flex flex-col items-center justify-center cursor-pointer group relative"
                  >
                    <div className="rounded-lg overflow-hidden shadow-md border border-gray-100">
                      <img
                        src={cat.image[0]}
                        alt={cat.name}
                        className="w-full h-[150px] sm:h-[180px] object-cover"
                      />
                    </div>
                    <h3 className="text-center mt-3 font-semibold text-brand-text text-sm sm:text-base">
                      {cat.name}
                    </h3>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
