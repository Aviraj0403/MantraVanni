import React from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getMiniProducts } from "../services/productApi";
import ProductCard from "../components/Product/ProductCard";
import { useCombosModule } from "../hooks/useCombosEnabled";

export default function CombosPage() {
  const navigate = useNavigate();
  const { enabled, isLoading: settingsLoading } = useCombosModule();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["comboProducts", "all"],
    queryFn: () => getMiniProducts(1, 100, "", "", "", "", "", "true"),
    enabled,
  });

  if (!settingsLoading && !enabled) return <Navigate to="/" replace />;

  const products = data?.products || [];
  return (
    <section className="min-h-screen bg-brand-bg py-8 sm:py-12">
      <div className="mx-auto max-w-[1360px] px-4 sm:px-6">
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-[11px] font-semibold text-gray-500">
          <Link to="/" className="hover:text-primary-600">Home</Link>
          <span className="text-gray-300">/</span>
          <span className="text-brand-text">Combos</span>
        </nav>

        <div className="mb-10 text-center">
          <h1 className="font-serif text-3xl font-bold text-primary-600 sm:text-4xl">Combos &amp; Bundles</h1>
          <div className="mx-auto mt-4 flex items-center justify-center gap-2" aria-hidden="true">
            <div className="h-px w-12 bg-primary-500/40" />
            <div className="h-2 w-2 rotate-45 bg-primary-500" />
            <div className="h-px w-12 bg-primary-500/40" />
          </div>
          <p className="mx-auto mt-4 max-w-2xl text-sm font-medium text-brand-text/70">
            More Savings, More Blessings
          </p>
        </div>

        {isLoading && (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:gap-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-square rounded-xl bg-black/5" />
                <div className="mt-3 h-3.5 w-3/4 rounded bg-black/5" />
              </div>
            ))}
          </div>
        )}

        {isError && (
          <p className="py-12 text-center text-sm text-primary-600">{error?.message || "Unable to load combos."}</p>
        )}

        {!isLoading && !isError && products.length === 0 && (
          <p className="py-12 text-center font-medium text-brand-text/70">No combos right now</p>
        )}

        {!isLoading && !isError && products.length > 0 && (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:gap-6">
            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onProductClick={(slug) => navigate(`/product/${slug}`)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
