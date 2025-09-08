import React, { useEffect, useState } from "react";
import "./CustomBundleDialog.css";
import ProductDetailsDialog from "./ProductDetailsDialog";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faTimesCircle,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import { LoginDialog } from "./Auth";

export default function CustomBundleDialog({ promotionId, open, onClose }) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [buondleProducts, setBuondleProducts] = useState([]);
  const [loadingCheckout, setLoadingCheckout] = useState(false);
  const [checkoutMessage, setCheckoutMessage] = useState(null);
  const [checkoutSuccess, setCheckoutSuccess] = useState(null);
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);

  useEffect(() => {
    if (!open || !promotionId) return;
    setLoading(true);
    setError("");
    setData(null);
    const token = localStorage.getItem("user_token");
    fetch(`https://back.al-balad.sa/promotions/show/${promotionId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.status && res.data) setData(res.data);
        else setError("تعذر جلب بيانات الحزمة");
      })
      .catch(() => setError("تعذر الاتصال بالخادم"))
      .finally(() => setLoading(false));
  }, [open, promotionId]);

  const handleAddToBuondle = (product, quantity = 1, options = {}) => {
    const userId = localStorage.getItem("user_id");
    const userToken = localStorage.getItem("user_token");
    if (!userId || !userToken) {
      setLoginDialogOpen(true);
      return;
    }
    setBuondleProducts((prev) => {
      const idx = prev.findIndex(
        (p) =>
          p.id === product.id &&
          JSON.stringify(p.options) === JSON.stringify(options)
      );
      if (idx !== -1) {
        const updated = [...prev];
        updated[idx].quantity += quantity;
        return updated;
      }
      return [...prev, { ...product, quantity, options }];
    });
  };

  const handleCheckout = async () => {
    setLoadingCheckout(true);
    setCheckoutMessage(null);
    setCheckoutSuccess(null);
    try {
      const token = localStorage.getItem("user_token");
      let userId = localStorage.getItem("user_id");
      let sessionId = localStorage.getItem("session_id");
      if (!userId && !sessionId) {
        sessionId = Math.floor(Math.random() * 1_000_000_000);
        localStorage.setItem("session_id", sessionId);
      }
      let allSuccess = true;
      for (const item of buondleProducts) {
        const bodyData = {
          user_id: userId ? userId : sessionId,
          product_id: item.id,
          quantity: item.quantity,
          promotion_id: promotionId,
        };
        if (item.options && item.options.variant_id) {
          bodyData.product_variant_id = item.options.variant_id;
        }
        const response = await fetch(
          "https://back.al-balad.sa/carts/add-item",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: JSON.stringify(bodyData),
          }
        );
        const data = await response.json();
        if (!data.status) {
          allSuccess = false;
        }
      }
      if (allSuccess) {
        setCheckoutMessage("تمت إضافة جميع المنتجات إلى السلة بنجاح!");
        setCheckoutSuccess(true);
        setBuondleProducts([]);
      } else {
        setCheckoutMessage("حدث خطأ أثناء إضافة بعض المنتجات إلى السلة.");
        setCheckoutSuccess(false);
      }
    } catch (e) {
      setCheckoutMessage("حدث خطأ أثناء الاتصال بالخادم.");
      setCheckoutSuccess(false);
    } finally {
      setLoadingCheckout(false);
    }
  };

  if (!open) return null;

  return (
    <div className="custom-bundle-dialog-overlay" onClick={onClose}>
      <div
        className="custom-bundle-dialog"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="custom-bundle-dialog-close" onClick={onClose}>
          &times;
        </button>
        <LoginDialog
          open={loginDialogOpen}
          onClose={() => setLoginDialogOpen(false)}
        />
        <div className="custom-bundle-main-content">
          {loading ? (
            <div className="custom-bundle-loading">
              جاري تحميل بيانات الحزمة...
            </div>
          ) : error ? (
            <div className="custom-bundle-error">{error}</div>
          ) : data ? (
            <>
              <h2 className="custom-bundle-title">
                {data.name || "حزمة مخصصة"}
              </h2>
              <div className="custom-bundle-info-row">
                <span>
                  أقل عدد للشراء: <b>{data.bundle?.min_selections}</b>
                </span>
                <span>من {data.bundle?.bundle_products?.length || 0} منتج</span>
              </div>
              <div
                style={{
                  background: "#fffbe6",
                  color: "#b88c36",
                  padding: "6px 12px",
                  borderRadius: 8,
                  margin: "8px 0",
                  fontSize: "1em",
                  fontWeight: "bold",
                }}
              >
                <span>الحد الأدنى للشراء: {data?.bundle?.min_selections}</span>{" "}
                | <span>عدد المنتجات المختارة: {buondleProducts.length}</span>
              </div>
              <div className="custom-bundle-products-row">
                {data.bundle?.bundle_products?.length > 0 && (
                  <Swiper
                    modules={[FreeMode]}
                    spaceBetween={18}
                    slidesPerView={Math.min(
                      4,
                      data.bundle?.bundle_products?.length
                    )}
                    freeMode={true}
                    dir="rtl"
                    breakpoints={{
                      1200: {
                        slidesPerView: Math.min(
                          4,
                          data.bundle?.bundle_products?.length
                        ),
                      },
                      900: {
                        slidesPerView: Math.min(
                          3,
                          data.bundle?.bundle_products?.length
                        ),
                      },
                      600: {
                        slidesPerView: Math.min(
                          2,
                          data.bundle?.bundle_products?.length
                        ),
                      },
                      0: { slidesPerView: 1 },
                    }}
                  >
                    {data.bundle?.bundle_products?.map((bp) => {
                      const p = bp.product;
                      return (
                        <SwiperSlide key={p?.id}>
                          <div
                            className="custom-bundle-product-card"
                            onClick={() => setSelectedProductId(p?.id)}
                            style={{ cursor: "pointer" }}
                          >
                            <div className="custom-bundle-product-img-wrapper">
                              <img
                                src={p?.medias?.[0]?.file_name || null}
                                alt={p?.name}
                              />
                            </div>
                            <div
                              className="custom-bundle-product-name"
                              title={p?.name}
                            >
                              {p?.name}
                            </div>
                            <div className="custom-bundle-product-meta">
                              <span className="custom-bundle-product-rating">
                                {p?.avg_rating || 4.9}{" "}
                                <span className="star">★</span>
                              </span>
                              <span className="custom-bundle-product-sold">
                                {p?.sold || p?.sold_count || "+2000"} تم بيع
                              </span>
                            </div>
                            <div className="custom-bundle-product-price-row">
                              <span className="custom-bundle-product-price">
                                {p?.price} ر.س.
                              </span>
                              {p?.old_price > 0 && (
                                <span className="custom-bundle-product-old-price">
                                  {p?.old_price}
                                </span>
                              )}
                            </div>
                          </div>
                        </SwiperSlide>
                      );
                    })}
                  </Swiper>
                )}
              </div>
              <div className="custom-bundle-gifts-row">
                <span>الهدايا:</span>
                {data.gift_types && data.gift_types.length > 0 ? (
                  data.gift_types.map((gift) => (
                    <span className="custom-bundle-gift" key={gift.id}>
                      {gift.name === "percentage_discount" &&
                        `خصم ${gift.relationship?.value}%`}
                      {gift.name === "free_shipping" && "شحن مجاني"}
                    </span>
                  ))
                ) : (
                  <span className="custom-bundle-gift">
                    لا توجد هدايا إضافية
                  </span>
                )}
              </div>
            </>
          ) : null}
        </div>
        <div className="custom-bundle-buondle-cart">
          <div className="custom-bundle-buondle-cart-header">سلة مختاراتي</div>
          <div className="custom-bundle-buondle-cart-list">
            {buondleProducts.length === 0 ? (
              <div className="custom-bundle-buondle-cart-empty">
                لم تقم باختيار أي منتج بعد.
              </div>
            ) : (
              buondleProducts.map((item, idx) => (
                <div
                  className="custom-bundle-buondle-cart-item"
                  key={item.id + "-" + idx}
                >
                  <img
                    className="custom-bundle-buondle-cart-img"
                    src={item.medias?.[0]?.file_name || null}
                    alt={item.name}
                  />
                  <div className="custom-bundle-buondle-cart-info">
                    <span className="custom-bundle-buondle-cart-name">
                      {item.name}
                    </span>
                    {item.options && Object.keys(item.options).length > 0 && (
                      <div className="custom-bundle-buondle-cart-attrs">
                        {Object.entries(item.options).map(
                          ([key, value], idx) => (
                            <span key={key} style={{ marginLeft: 4 }}>
                              <b>{key}:</b> {value}
                              {idx < Object.entries(item.options).length - 1
                                ? " | "
                                : ""}
                            </span>
                          )
                        )}
                      </div>
                    )}
                    <div className="custom-bundle-buondle-cart-qty-row">
                      <button
                        className="custom-bundle-buondle-cart-qty-btn"
                        onClick={() =>
                          setBuondleProducts((prev) =>
                            prev.map((p, i) =>
                              i === idx && p.quantity > 1
                                ? { ...p, quantity: p.quantity - 1 }
                                : p
                            )
                          )
                        }
                      >
                        -
                      </button>
                      <span className="custom-bundle-buondle-cart-qty">
                        {item.quantity}
                      </span>
                      <button
                        className="custom-bundle-buondle-cart-qty-btn"
                        onClick={() =>
                          setBuondleProducts((prev) =>
                            prev.map((p, i) =>
                              i === idx ? { ...p, quantity: p.quantity + 1 } : p
                            )
                          )
                        }
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div>
                    {item.old_price > 0 && (
                      <span className="custom-bundle-buondle-cart-oldprice">
                        {item.old_price} ر.س
                      </span>
                    )}
                    <span className="custom-bundle-buondle-cart-price">
                      {item.price} ر.س
                    </span>
                  </div>
                  <button
                    className="custom-bundle-buondle-cart-remove"
                    onClick={() =>
                      setBuondleProducts((prev) =>
                        prev.filter((_, i) => i !== idx)
                      )
                    }
                    title="حذف المنتج"
                  >
                    🗑️
                  </button>
                </div>
              ))
            )}
          </div>
          <div className="custom-bundle-buondle-cart-footer">
            <button
              className="custom-bundle-buondle-cart-checkout"
              disabled={
                buondleProducts.length < (data?.bundle?.min_selections || 1) ||
                loadingCheckout
              }
              onClick={handleCheckout}
            >
              {loadingCheckout ? (
                <FontAwesomeIcon
                  icon={faSpinner}
                  spin
                  style={{ marginLeft: 8 }}
                />
              ) : null}
              إكمال الطلب
            </button>
            {checkoutMessage && (
              <div
                style={{
                  marginTop: 8,
                  color: checkoutSuccess ? "#388e3c" : "#b71c1c",
                  fontWeight: "bold",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <FontAwesomeIcon
                  icon={checkoutSuccess ? faCheckCircle : faTimesCircle}
                />
                {checkoutMessage}
              </div>
            )}
          </div>
        </div>
        <ProductDetailsDialog
          productId={selectedProductId}
          open={!!selectedProductId}
          onClose={() => setSelectedProductId(null)}
          onAddToBuondle={(product, quantity, options) => {
            handleAddToBuondle(product, quantity, options);
            setSelectedProductId(null);
          }}
        />
      </div>
    </div>
  );
}
