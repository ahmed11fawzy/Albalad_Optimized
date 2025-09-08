import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import CustomBundleDialog from "./CustomBundleDialog";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import useFavorite from "../hooks/useFavorite";
import { LoginDialog } from "./Auth";
import buondleBanner from "../assest/images/buondleBanner.png";

export default function SuperOffers() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPromotionId, setSelectedPromotionId] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSupperOffersProducts();
  }, []);

  const fetchSupperOffersProducts = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("user_token");
      const res = await fetch(
        "https://back.al-balad.sa/albalad/v1.0/promotions/super",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      // استخراج جميع المنتجات من جميع الحزم
      let allProducts = [];
      if (Array.isArray(data.data)) {
        data.data.forEach((bundlePromo) => {
          if (
            bundlePromo.bundle &&
            Array.isArray(bundlePromo.bundle.bundle_products)
          ) {
            bundlePromo.bundle.bundle_products.forEach((bp) => {
              if (bp.product) {
                allProducts.push({
                  ...bp.product,
                  promotionId: bundlePromo.id,
                });
              }
            });
          }
        });
      }
      setProducts(allProducts);
    } catch (error) {
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProductClick = (product) => {
    setSelectedPromotionId(product.promotionId);
    setDialogOpen(true);
  };

  function ProductCard({ product, onProductClick }) {
    const { isFavorite, toggleFavorite, loginOpen, setLoginOpen, loading } =
      useFavorite(product.id);
    return (
      <div
        className="product-crad"
        key={product.id}
        onClick={() => onProductClick(product)}
        style={{ cursor: "pointer" }}
      >
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
          <div className="product-image">
            <img
              src={
                product.medias && product.medias.length > 0
                  ? product.medias[0].file_name
                  : ""
              }
              alt={product.name}
            />
          </div>
        </div>
        <div className="product-info-class">
          <p className="product-description" title={product.name}>
            {product.name}
          </p>
          <p className="price-box">
            <span className="product-price">{product.price} ر.س</span>
            {product.old_price > 0 && (
              <span className="product-fac-price">
                <s>{product.old_price}</s>
              </span>
            )}
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
        </div>
      </div>
    );
  }

  return (
    <div className="container container-under-header-fixed2">
      {/* بانر إعلاني */}
      <div className="offer-banner">
        <img src={buondleBanner} alt="عروض الحزمة" />
      </div>
      <h1 className="section-title">عروض السوبر</h1>
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
          {products.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                color: "#888",
                margin: "32px auto",
              }}
            >
              لا توجد عروض حزم متاحة حالياً.
            </div>
          ) : (
            products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onProductClick={handleProductClick}
              />
            ))
          )}
        </div>
      )}
      <CustomBundleDialog
        promotionId={selectedPromotionId}
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
      />
    </div>
  );
}
