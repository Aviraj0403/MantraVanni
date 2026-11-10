import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductsByCategoryAndSubCategorySlug } from "../../services/productApi"; // Assuming this is the correct API call
import ProductCard from "../../components/Product/ProductCard";

export default function CategorySubCategoryDetails() {
  const { categorySlug, subCategorySlug } = useParams();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [categoryName, setCategoryName] = useState("");
  const [subCategoryName, setSubCategoryName] = useState("");

  const fetchProducts = async (page = 1) => {
    setLoading(true);
    setError(null);

    try {
      const data = await getProductsByCategoryAndSubCategorySlug(categorySlug, subCategorySlug, page, 20);
      if (data.success) {
        setProducts(data.products);
        setPagination(data.pagination);
        setCurrentPage(page);
        setCategoryName(data.categoryName || categorySlug); // Assuming the API returns categoryName
        setSubCategoryName(data.subCategoryName || subCategorySlug); // Assuming the API returns subCategoryName
      } else {
        setError("Failed to load products");
      }
    } catch (error) {
      setError("Error fetching products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(currentPage);
  }, [categorySlug, subCategorySlug, currentPage]);

  if (loading) {
    return <div>Loading products...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  return (
    <section className="py-10 bg-brand-bg">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-primary-500 mb-8 text-center">
          {categoryName} : {subCategoryName }
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {products.length === 0 ? (
            <div>No products found in this category and subcategory.</div>
          ) : (
            products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onProductClick={handleProductClick}
              />
            ))
          )}
        </div>

        {pagination.totalPages > 1 && (
          <div className="mt-8 flex justify-center">
            <button
              onClick={() => fetchProducts(currentPage - 1)}
              disabled={currentPage <= 1}
              className="px-4 py-2 bg-primary-500 text-white rounded-md disabled:opacity-50"
            >
              Previous
            </button>
            <span className="mx-4">{currentPage} / {pagination.totalPages}</span>
            <button
              onClick={() => fetchProducts(currentPage + 1)}
              disabled={currentPage >= pagination.totalPages}
              className="px-4 py-2 bg-primary-500 text-white rounded-md disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
