import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../css/CategoryProducts.css";
import ProductCard from "./styledComponents/productCard";

const CategoryProducts = () => {
  const { id } = useParams();
  const [categoryData, setCategoryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(`https://back.al-balad.sa/categories/show/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setCategoryData(data.data);
      })
      .catch(() => setCategoryData(null))
      .finally(() => setLoading(false));
  }, [id]);

  // المنتجات المباشرة فقط
  const directProducts = categoryData?.products || [];

  // Loader skeleton
  const SkeletonLoader = () => (
    <div className="category-products-container">
      {[...Array(6)].map((_, idx) => (
        <div className="product-crad" key={idx}>
          <div className="product-image large">
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
  );

  return (
    <div className="category-products-page container-under-header-fixed">
      {loading ? (
        <SkeletonLoader />
      ) : (
        <div className="category-products-container">
          {directProducts.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                color: "#888",
                margin: "32px auto",
              }}
            >
              لا توجد منتجات متاحة لهذه الفئة حالياً.
            </div>
          ) : (
            directProducts.map((product) => (
              <ProductCard
                product={product}
                key={product.id}
                onClick={() =>
                  navigate(`/product/${product.id}`, { state: { product } })
                }
              />
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default CategoryProducts;
{
  /* <div
                className="product-crad"
                key={product.id}
                onClick={() =>
                  navigate(`/product/${product.id}`, { state: { product } })
                }
              >
                <div className="product-image large">
                  <img
                    src={product.medias?.[0]?.file_name || null}
                    alt={product.name}
                  />
                </div>
                <div className="product-info-class">
                  <p className="product-description" title={product.name}>
                    {product.name}
                  </p>
                  <p className="review-box">
                    <span className="product-stars-icon">
                      {[...Array(5)].map((_, i) => (
                        <FontAwesomeIcon
                          icon={faStar}
                          className="product-start-icon"
                          key={i}
                        />
                      ))}
                    </span>
                    <span className="product-slod-count">1000 مباعة</span>
                  </p>
                  <p className="price-box">
                    <span className="product-price">{product.price} ر.س</span>
                    {product.old_price > 0 && (
                      <span className="product-fac-price">
                        <s>{product.old_price}</s>
                      </span>
                    )}
                  </p>
                  <div className="product-offers-class">
                    <p className="product-offer-box">
                      <span className="product-is-welcome-offer">
                        {" "}
                        عرض الترحيب{" "}
                      </span>
                      <span className="product-is-add-discount">
                        {" "}
                        خصم اضافي {product.add_discount || 0}% مع العملات
                      </span>
                      <span className="product-discount">
                        {" "}
                        {product.discount_precent || 0}%
                      </span>
                    </p>
                  </div>
                  <div className="product-type-class">
                    <button className="package-offer-btn">عرض الحزمة</button>
                  </div>
                  <div className="product-free-shipping-class">
                    <p className="free-shipping-box">
                      <span className="choice-card">choice</span> شحن مجاني
                    </p>
                  </div>
                </div>
              </div> */
}
