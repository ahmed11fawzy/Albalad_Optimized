import React, { useEffect, useState } from "react";
import ProductDetailsDialog from "./ProductDetailsDialog";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import useFavorite from "../hooks/useFavorite";
import { LoginDialog } from "./Auth";
import buondleBanner from "../assest/images/buondleBanner.png";

function getGiftLabel(gift) {
  if (gift.name === "percentage_discount")
    return `احصل على خصم ${gift.relationship?.value || ""}%`;
  if (gift.name === "free_shipping") return "احصل على شحن مجاني";
  if (gift.name === "free_products") return "احصل على منتجات مجانية";
  return gift.name;
}

function GiftFlipper({ giftTypes }) {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    if (!giftTypes || giftTypes.length <= 1) return;
    const timer = setInterval(() => {
      setIdx((i) => (i + 1) % giftTypes.length);
    }, 1800);
    return () => clearInterval(timer);
  }, [giftTypes]);
  if (!giftTypes || giftTypes.length === 0) return null;
  const gift = giftTypes[idx];
  const label = getGiftLabel(gift);
  return (
    <div
      style={{
        fontSize: "0.93em",
        color: "var(--primary-color)",
        marginTop: 4,
        minHeight: 22,
        transition: "all 0.3s",
      }}
    >
      {label}
    </div>
  );
}

function ProductCard({ product, offerId, giftTypes, onProductClick }) {
  const { isFavorite, toggleFavorite, loginOpen, setLoginOpen, loading } =
    useFavorite(product.id);
  return (
    <div
      className="product-crad"
      key={product.id + "-" + offerId}
      style={{ cursor: "pointer" }}
      onClick={() => onProductClick(product, giftTypes, offerId)}
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
              style={{ color: "#aaa", fontSize: 24, transition: "color 0.2s" }}
            />
          )}
        </button>
        <LoginDialog open={loginOpen} onClose={() => setLoginOpen(false)} />
        <div className="product-image">
          <img
            src={product.medias?.[0]?.file_name || null}
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
        <GiftFlipper giftTypes={giftTypes} />
      </div>
    </div>
  );
}

export default function BuyXGetYOffers() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [selectedGifts, setSelectedGifts] = useState([]);
  const [selectedPromotionId, setSelectedPromotionId] = useState(null);

  useEffect(() => {
    const fetchOffers = async () => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("user_token");
        const res = await fetch(
          "https://back.al-balad.sa/albalad/v1.0/promotions/buy_x_get_y_offers",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await res.json();
        if (data.status && Array.isArray(data.data)) setOffers(data.data);
        else setError("تعذر جلب بيانات العروض");
      } catch {
        setError("تعذر الاتصال بالخادم");
      } finally {
        setLoading(false);
      }
    };
    fetchOffers();
  }, []);

  return (
    <div className="container-under-header-fixed">
      <div className="offer-banner">
        <img src={buondleBanner} alt="عروض الحزمة" />
      </div>
      <h1 className="section-title">اشتري واحصل</h1>
      {/* Dialog for product details */}
      <ProductDetailsDialog
        open={dialogOpen}
        productId={selectedProductId}
        gifts={selectedGifts}
        promotionId={selectedPromotionId}
        onClose={() => setDialogOpen(false)}
      />
      {loading ? (
        <div
          style={{ textAlign: "center", margin: "48px 0", color: "#b88c36" }}
        >
          جاري تحميل العروض...
        </div>
      ) : error ? (
        <div
          style={{ textAlign: "center", margin: "48px 0", color: "#b71c1c" }}
        >
          {error}
        </div>
      ) : offers.length === 0 ? (
        <div style={{ textAlign: "center", margin: "48px 0", color: "#888" }}>
          لا توجد عروض متاحة حالياً.
        </div>
      ) : (
        <div className="more-loves-products-container container">
          {offers
            .flatMap((offer) =>
              offer.buy_x_get_y_products.map(({ product }) => ({
                product,
                offerId: offer.id,
                giftTypes: offer.gift_types,
              }))
            )
            .map(({ product, offerId, giftTypes }) => (
              <ProductCard
                key={product.id + "-" + offerId}
                product={product}
                offerId={offerId}
                giftTypes={giftTypes}
                onProductClick={(product, giftTypes, offerId) => {
                  setSelectedProductId(product.id);
                  setSelectedGifts(giftTypes || []);
                  setSelectedPromotionId(offerId);
                  setDialogOpen(true);
                }}
              />
            ))}
        </div>
      )}
    </div>
  );
}
