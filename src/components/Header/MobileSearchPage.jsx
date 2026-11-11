import React, { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  ChevronRight,
  Clock3,
  Flame,
  Search,
  ShoppingBag,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  getMenuCategories,
  getSearchSuggestions,
} from "../../services/categoryApi";
import { getMiniProducts } from "../../services/productApi";
import usePageMeta from "../../hooks/usePageMeta";

const readRecentSearches = () => {
  try {
    const saved = JSON.parse(localStorage.getItem("recentSearches"));
    return Array.isArray(saved) ? saved.slice(0, 5) : [];
  } catch {
    return [];
  }
};

const getProductImage = (product) =>
  product?.pimages?.[0] ||
  product?.pimage ||
  product?.image?.[0] ||
  product?.image ||
  "/placeholder.jpg";

const getProductPrice = (product) => {
  const variant = Array.isArray(product?.variants)
    ? product.variants[0]
    : product?.variants;

  return {
    price: product?.price ?? variant?.price,
    originalPrice:
      product?.originalPrice ?? product?.realPrice ?? variant?.realPrice,
  };
};

export default function MobileSearchPage() {
  usePageMeta({ title: "Search | MantraVanni", description: "Search MantraVanni products.", noindex: true });
  // "Popular right now" is driven by the store's best-selling products (no hard-coded terms).
  const { data: popularData } = useQuery({
    queryKey: ["popularSearches"],
    queryFn: () => getMiniProducts(1, 6, "", "", "", "true"),
    staleTime: 10 * 60 * 1000,
  });
  const POPULAR_SEARCHES = (popularData?.products || []).map((p) => p?.name).filter(Boolean).slice(0, 5);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState(readRecentSearches);
  const navigate = useNavigate();
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedQuery(query.trim());
    }, 350);

    return () => window.clearTimeout(timer);
  }, [query]);

  const {
    data: menuItems = [],
    isLoading: isCategoriesLoading,
    isError: isCategoriesError,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: getMenuCategories,
  });

  const {
    data: suggestions = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["searchSuggestions", debouncedQuery],
    queryFn: () => getSearchSuggestions(debouncedQuery),
    enabled: debouncedQuery.length > 1,
  });

  const saveSearch = (searchTerm) => {
    const cleanTerm = searchTerm.trim();
    if (!cleanTerm) return;

    const updated = [
      cleanTerm,
      ...recentSearches.filter(
        (item) => item.toLowerCase() !== cleanTerm.toLowerCase(),
      ),
    ].slice(0, 5);

    setRecentSearches(updated);
    localStorage.setItem("recentSearches", JSON.stringify(updated));
  };

  const handleSuggestedSearch = (searchTerm) => {
    setQuery(searchTerm);
    saveSearch(searchTerm);
    inputRef.current?.focus();
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    saveSearch(query);
    inputRef.current?.blur();
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem("recentSearches");
  };

  const removeRecentSearch = (searchTerm) => {
    const updated = recentSearches.filter((item) => item !== searchTerm);
    setRecentSearches(updated);
    localStorage.setItem("recentSearches", JSON.stringify(updated));
  };

  const handleProductClick = (product) => {
    saveSearch(query);
    navigate(`/product/${product.slug}`);
  };

  const hasQuery = query.trim().length > 0;
  const canSearch = debouncedQuery.length > 1;

  return (
    <div className="min-h-screen bg-[#f5f5f5] pb-24 text-[#30291f] md:pb-12">
      <div className="sticky top-0 z-40 border-b border-[#e5e1db] bg-brand-bg px-4 py-3 shadow-[0_3px_12px_rgba(40,28,12,0.08)] md:top-0 md:px-8 md:py-4">
        <form
          onSubmit={handleSubmit}
          className="mx-auto flex max-w-3xl items-center gap-2"
        >
          <label className="relative flex-1">
            <span className="sr-only">Search spiritual products</span>
            <Search
              size={20}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#8d692c]"
            />
            <input
              ref={inputRef}
              type="search"
              inputMode="search"
              autoComplete="off"
              placeholder="Search rudraksha, diya, crystals..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="h-12 w-full rounded-xl border border-[#d8d2c9] bg-[#f8f8f8] pl-12 pr-11 text-sm text-[#332c23] outline-none transition placeholder:text-[#8b8175] focus:border-[#8d692c] focus:bg-brand-bg focus:ring-2 focus:ring-[#8d692c]/15 sm:h-14 sm:text-base"
            />
            {hasQuery && (
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  inputRef.current?.focus();
                }}
                className="absolute right-3 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full text-[#766b5d] transition hover:bg-[#ece8e2] hover:text-[#D35400]"
                aria-label="Clear search"
              >
                <X size={16} />
              </button>
            )}
          </label>
          <button
            type="submit"
            disabled={!hasQuery}
            className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-[#D35400] text-white shadow-sm transition hover:bg-[#C45509] active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 sm:h-14 sm:w-auto sm:px-6"
            aria-label="Search"
          >
            <Search size={20} className="sm:hidden" />
            <span className="hidden text-sm font-semibold sm:inline">Search</span>
          </button>
        </form>
      </div>

      <main className="mx-auto max-w-6xl px-3 py-5 sm:px-6 md:py-7">
        {hasQuery ? (
          <section aria-live="polite">
            {query.trim().length === 1 && (
              <div className="rounded-3xl border border-[#eadfc9] bg-brand-bg px-6 py-12 text-center shadow-sm">
                <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[#fbf2e3] text-[#8d692c]">
                  <Search size={25} />
                </span>
                <h2 className="mt-4 font-serif text-xl font-semibold text-[#4b0910]">
                  Keep typing your search
                </h2>
                <p className="mt-1 text-sm text-[#766b5d]">
                  Enter at least two letters to discover divine products.
                </p>
              </div>
            )}

            {canSearch && isLoading && (
              <div>
                <div className="mb-5 h-6 w-44 animate-pulse rounded-lg bg-[#eadfcf]" />
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-5 lg:grid-cols-4">
                  {Array.from({ length: 8 }).map((_, index) => (
                    <div
                      key={index}
                      className="overflow-hidden rounded-2xl border border-[#eee4d4] bg-brand-bg p-2.5"
                    >
                      <div className="aspect-square animate-pulse rounded-xl bg-[#f2ebdf]" />
                      <div className="mt-3 h-3 w-full animate-pulse rounded bg-[#eee6da]" />
                      <div className="mt-2 h-3 w-2/3 animate-pulse rounded bg-[#eee6da]" />
                      <div className="mb-2 mt-4 h-4 w-1/2 animate-pulse rounded bg-[#e5d8c5]" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {canSearch && isError && (
              <div className="rounded-3xl border border-[#ead6d8] bg-brand-bg px-6 py-14 text-center shadow-sm">
                <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[#fff0f1] text-[#D35400]">
                  <X size={25} />
                </span>
                <h2 className="mt-4 font-serif text-xl font-semibold text-[#4b0910]">
                  We could not complete your search
                </h2>
                <p className="mt-1 text-sm text-[#766b5d]">
                  Please check your connection and try again.
                </p>
              </div>
            )}

            {canSearch && !isLoading && !isError && suggestions.length > 0 && (
              <div>
                <div className="mb-5 flex items-end justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#9b7b3e]">
                      Search results
                    </p>
                    <h2 className="mt-1 font-serif text-xl font-semibold text-[#3f350a] sm:text-2xl">
                      Results for “{debouncedQuery}”
                    </h2>
                  </div>
                  <span className="shrink-0 rounded-full bg-[#f1e6d2] px-3 py-1 text-[11px] font-semibold text-[#725821]">
                    {suggestions.length} {suggestions.length === 1 ? "item" : "items"}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-5 lg:grid-cols-4">
                  {suggestions.map((item) => {
                    const { price, originalPrice } = getProductPrice(item);

                    return (
                      <button
                        type="button"
                        key={item._id || item.slug}
                        onClick={() => handleProductClick(item)}
                        className="group overflow-hidden rounded-xl border border-[#e5e1db] bg-brand-bg p-2.5 text-left shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[#d5bd8b] hover:shadow-lg sm:p-3"
                      >
                        <div className="relative aspect-square overflow-hidden rounded-xl bg-[#f8f3ea] sm:rounded-2xl">
                          <img
                            src={getProductImage(item)}
                            alt={item.name}
                            className="h-full w-full object-contain p-2 transition duration-500 group-hover:scale-105"
                            loading="lazy"
                            onError={(event) => {
                              event.currentTarget.src = "/placeholder.jpg";
                            }}
                          />
                          {item.discount > 0 && (
                            <span className="absolute left-2 top-2 rounded-full bg-[#D35400] px-2 py-1 text-[9px] font-bold text-white shadow-sm sm:text-[10px]">
                              {item.discount}% OFF
                            </span>
                          )}
                        </div>

                        <div className="px-1 pb-1 pt-3">
                          <p className="line-clamp-2 min-h-9 text-xs font-semibold leading-[18px] text-[#3d352b] transition group-hover:text-[#D35400] sm:text-sm">
                            {item.name}
                          </p>
                          <div className="mt-3 flex flex-wrap items-baseline gap-x-1.5 gap-y-1">
                            {price != null ? (
                              <span className="text-sm font-bold text-[#D35400] sm:text-base">
                                ₹{price}
                              </span>
                            ) : (
                              <span className="text-xs font-semibold text-[#8d692c]">
                                View details
                              </span>
                            )}
                            {originalPrice != null && Number(originalPrice) > Number(price) && (
                              <span className="text-[10px] text-[#9a9187] line-through sm:text-xs">
                                ₹{originalPrice}
                              </span>
                            )}
                            <ArrowRight
                              size={15}
                              className="ml-auto text-[#a08247] transition-transform group-hover:translate-x-1"
                            />
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {canSearch && !isLoading && !isError && suggestions.length === 0 && (
              <div className="rounded-3xl border border-[#eadfc9] bg-brand-bg px-6 py-14 text-center shadow-sm">
                <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#fbf2e3] text-[#8d692c]">
                  <ShoppingBag size={28} strokeWidth={1.6} />
                </span>
                <h2 className="mt-4 font-serif text-xl font-semibold text-[#4b0910]">
                  No sacred finds yet
                </h2>
                <p className="mx-auto mt-1 max-w-sm text-sm leading-5 text-[#766b5d]">
                  Try a broader word like “diya”, “rudraksha” or explore one of
                  our spiritual categories below.
                </p>
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="mt-5 rounded-full bg-[#D35400] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#C45509]"
                >
                  Explore categories
                </button>
              </div>
            )}
          </section>
        ) : (
          <div className="space-y-9">
            {recentSearches.length > 0 && (
              <section>
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock3 size={17} className="text-[#8d692c]" />
                    <h2 className="text-xs font-bold uppercase tracking-[0.14em] text-[#5b5043]">
                      Recent searches
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={clearRecentSearches}
                    className="text-xs font-semibold text-[#D35400] hover:underline"
                  >
                    Clear all
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((searchTerm) => (
                    <span
                      key={searchTerm}
                      className="flex items-center overflow-hidden rounded-full border border-[#e3d5bd] bg-brand-bg shadow-sm"
                    >
                      <button
                        type="button"
                        onClick={() => handleSuggestedSearch(searchTerm)}
                        className="py-2 pl-3.5 pr-2 text-xs font-medium text-[#594f43] transition hover:text-[#D35400] sm:text-sm"
                      >
                        {searchTerm}
                      </button>
                      <button
                        type="button"
                        onClick={() => removeRecentSearch(searchTerm)}
                        className="mr-1 grid h-7 w-7 place-items-center rounded-full text-[#a19586] transition hover:bg-[#f6ecdc] hover:text-[#D35400]"
                        aria-label={`Remove ${searchTerm} from recent searches`}
                      >
                        <X size={13} />
                      </button>
                    </span>
                  ))}
                </div>
              </section>
            )}

            {POPULAR_SEARCHES.length > 0 && (
            <section>
              <div className="mb-3 flex items-center gap-2">
                <Flame size={17} className="text-[#9b6b22]" />
                <h2 className="text-xs font-bold uppercase tracking-[0.14em] text-[#5b5043]">
                  Popular right now
                </h2>
              </div>
              <div className="overflow-hidden rounded-2xl border border-[#e9ddca] bg-brand-bg shadow-[0_8px_25px_rgba(71,51,22,0.05)]">
                {POPULAR_SEARCHES.map((item, index) => (
                  <button
                    type="button"
                    key={item}
                    onClick={() => handleSuggestedSearch(item)}
                    className="group flex w-full items-center gap-3 border-b border-[#f0e7d9] px-4 py-3.5 text-left last:border-b-0 hover:bg-[#fffaf1] sm:px-5"
                  >
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#f7edda] font-serif text-xs font-bold text-[#8d692c]">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="flex-1 text-sm font-semibold text-[#443b31] group-hover:text-[#D35400]">
                      {item}
                    </span>
                    <ChevronRight
                      size={17}
                      className="text-[#b3a48c] transition-transform group-hover:translate-x-1 group-hover:text-[#8d692c]"
                    />
                  </button>
                ))}
              </div>
            </section>
            )}

            <section>
              <div className="mb-4">
                <h2 className="text-lg font-bold text-[#332c23] sm:text-xl">
                  Shop by Category
                </h2>
                <p className="mt-1 text-xs text-[#766b5d]">Browse all spiritual essentials</p>
              </div>

              {isCategoriesLoading && (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <div
                      key={index}
                      className="h-44 animate-pulse rounded-2xl bg-[#eee5d7]"
                    />
                  ))}
                </div>
              )}

              {isCategoriesError && (
                <p className="rounded-2xl border border-[#eadfc9] bg-brand-bg px-4 py-8 text-center text-sm text-[#D35400]">
                  Categories are unavailable right now. Please try again later.
                </p>
              )}

              {!isCategoriesLoading && !isCategoriesError && (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                  {menuItems.map((category) => (
                    <button
                      type="button"
                      key={category._id || category.slug}
                      onClick={() => navigate(`/${category.slug}`)}
                      className="group overflow-hidden rounded-2xl border border-[#e9decd] bg-brand-bg p-2.5 text-center shadow-[0_5px_18px_rgba(71,51,22,0.05)] transition duration-300 hover:-translate-y-1 hover:border-[#d4bd8d] hover:shadow-[0_12px_26px_rgba(71,51,22,0.11)]"
                    >
                      <div className="flex aspect-[4/3] items-center justify-center overflow-hidden rounded-xl bg-[#f8f3ea]">
                        <img
                          src={category.image?.[0]}
                          alt={category.name}
                          className="h-full w-full object-contain p-2 transition duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                      </div>
                      <span className="mt-3 block line-clamp-1 text-xs font-semibold text-[#463d32] transition group-hover:text-[#D35400] sm:text-sm">
                        {category.name}
                      </span>
                      <span className="mb-1 mt-1 inline-flex items-center gap-1 text-[10px] font-semibold text-[#9b7b3e]">
                        Explore <ArrowRight size={11} />
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </section>
          </div>
        )}
      </main>
    </div>
  );
}
