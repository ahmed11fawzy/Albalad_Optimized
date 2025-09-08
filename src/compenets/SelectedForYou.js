import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import ProductDetailsDialog from "./ProductDetailsDialog";
import useFavorite from "../hooks/useFavorite";
import { LoginDialog } from "./Auth";
import buondleBanner from "../assest/images/buondleBanner.png";

export default function SelectedForYou() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [likedProducts, setLikedProducts] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        "https://back.al-balad.sa/promotions/products-for"
      );
      const data = await response.json();
      setProducts(data.data || []);
    } catch (error) {
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProductClick = (product) => {
    setSelectedProductId(product.id);
    setDialogOpen(true);
  };

  const toggleLike = (productId) => {
    setLikedProducts((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  function ProductCard({ product, onProductClick }) {
    const { isFavorite, toggleFavorite, loginOpen, setLoginOpen, loading } =
      useFavorite(product.id);
    return (
      <div className="product-crad" key={product.id}>
        <div style={{ position: "relative" }}>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite();
            }}
            style={{
              position: "absolute",
              top: 8,
              right: 8,
              background: "none",
              border: "none",
              cursor: loading ? "wait" : "pointer",
              zIndex: 2,
              padding: 0,
              opacity: loading ? 0.6 : 1,
            }}
            aria-label={isFavorite ? "إزالة من المفضلة" : "إضافة إلى المفضلة"}
            disabled={loading}
          >
            {isFavorite ? (
              <FaHeart
                style={{
                  color: "#e53935",
                  fontSize: 24,
                  transition: "color 0.2s",
                }}
              />
            ) : (
              <FaRegHeart
                style={{
                  color: "#aaa",
                  fontSize: 24,
                  transition: "color 0.2s",
                }}
              />
            )}
          </button>
          <LoginDialog open={loginOpen} onClose={() => setLoginOpen(false)} />
          <div
            className="product-image"
            onClick={() => onProductClick(product)}
            style={{ cursor: "pointer" }}
          >
            <img
              src={
                product.medias && product.medias.length > 0
                  ? product.medias[0].file_name
                  : null
              }
              alt={product.name}
            />
          </div>
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
              <span className="product-is-welcome-offer"> عرض الترحيب </span>
              <span className="product-is-add-discount">
                {" "}
                خصم اضافي {product.add_discount}% مع العملات
              </span>
              <span className="product-discount">
                {" "}
                {product.discount_precent}%
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
      </div>
    );
  }

  return (
    <div className="container-under-header-fixed2 container ">
      <div className="offer-banner">
        <img src={buondleBanner} alt="عروض الحزمة" />
        {/* <div className="bundle-offer-banner-text">
          <h2>عروض الحزمة المميزة</h2>
          <p>احصل على أفضل العروض عند شراء أكثر من منتج مع هدايا وخصومات حصرية!</p>
        </div> */}
      </div>
      <h1 className="section-title">منتجات مختارة من أجلك</h1>
      {isLoading ? (
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
      ) : (
        <div className="more-loves-products-container">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onProductClick={handleProductClick}
            />
          ))}
        </div>
      )}
      <ProductDetailsDialog
        productId={selectedProductId}
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
      />
    </div>
  );
}
