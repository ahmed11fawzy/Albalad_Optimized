import React from "react";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import "./relatedProducts.css";
// Import Redux hooks
import { useGetProductsByCategoryQuery } from "../redux/Slices/productsApi";
import ProductCard from "./styledComponents/productCard";

export default function RelatedProducts({ categoryId }) {
  const navigate = useNavigate();

  // Redux query
  const {
    data: categoryData,
    isLoading: loading,
    error,
  } = useGetProductsByCategoryQuery(categoryId, {
    skip: !categoryId, // Skip if no categoryId
  });

  const products = categoryData?.data?.products || [];

  const handleProductClick = (product) => {
    navigate(`/product/${product.id}`, { state: { product } });
    window.location.reload();
    window.scrollTo(0, 0);
  };

  return (
    <div className="container">
      <h1 className="section-title">ربما تحب أيضًا</h1>
      {loading ? (
        <div className="more-loves-products-container">
          {[...Array(6)].map((_, idx) => (
            <div className="product-crad" key={idx}>
              <div className="product-image">
                <div className="skeleton skeleton-img" />
              </div>
              <div className="product-info-class">
                <div className="skeleton skeleton-title" />
                <div className="skeleton skeleton-review" />
                <div className="skeleton skeleton-price" />
                <div className="skeleton skeleton-offer" />
                <div className="skeleton skeleton-btn" />
                <div className="skeleton skeleton-shipping" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div
          style={{
            textAlign: "center",
            color: "#888",
            padding: "2rem",
            fontSize: "1.1rem",
          }}
        >
          حدث خطأ في تحميل المنتجات المقترحة
        </div>
      ) : (
        <div className="more-loves-products-container">
          {products.map((product) => (
            <ProductCard product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
