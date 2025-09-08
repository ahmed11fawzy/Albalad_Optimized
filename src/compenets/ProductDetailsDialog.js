import React, { useEffect, useState } from "react";
import "./ProductDetailsDialog.css";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SellerInfo from "./seller_info";
import ProductReviewsComponent from "./product_reviews_component";
import ProductDescription from "./ProductDescription";
import StoreDescription from "./StoreDescription";
import RelatedProducts from "./RelatedProducts";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { LoginDialog } from "./Auth";
// Import Redux hooks
import { useGetProductDetailsQuery, useAddToCartMutation } from "../redux/Slices/productsApi";

export default function ProductDetailsDialog({
  productId,
  open,
  onClose,
  onAddToBuondle,
  gifts = [],
  promotionId = null,
}) {
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedAttributes, setSelectedAttributes] = useState({});
  const [mainImage, setMainImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState(null); // 'success' | 'error'
  const [showMessage, setShowMessage] = useState(false);
  const [outOfStockMessage, setOutOfStockMessage] = useState("");
  const [pageLoading, setPageLoading] = useState(false);
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);

  // Redux queries
  const {
    data: productData,
    isLoading: initialLoading,
    error: productError,
    refetch: refetchProduct
  } = useGetProductDetailsQuery(productId, {
    skip: !open || !productId, // Skip if dialog is closed or no productId
  });

  const [addToCart, { isLoading: loading }] = useAddToCartMutation();

  // Get product from Redux query
  const product = productData?.data;

  // Prevent background scrolling when dialog is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Reset state when dialog opens
  useEffect(() => {
    if (!open || !productId) return;

    setSelectedVariant(null);
    setSelectedAttributes({});
    setMainImage("");
    setQuantity(1);
    setMessage(null);
    setMessageType(null);
    setShowMessage(false);
    setOutOfStockMessage("");
    setPageLoading(false);
  }, [open, productId]);

  const isValidImage = (url) => {
    if (!url) return false;
    return /\.(jpg|jpeg|png|webp|gif|bmp|svg)$/i.test(url);
  };

  useEffect(() => {
    if (message) {
      setShowMessage(true);
      const timer = setTimeout(() => {
        setShowMessage(false);
        setMessage(null);
        setMessageType(null);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // Initialize product variants and attributes when product data is available
  useEffect(() => {
    if (!product) return;

    const groupedAttributesTemp = {};
    const defaultSelection = {};

    product.product_variants.forEach((variant) => {
      variant.product_attributes.forEach((attrObj) => {
        const attrName = attrObj.attribute_value?.attribute?.name;
        const attrValue = attrObj.attribute_value?.value;
        if (!attrName || !attrValue) return;
        if (!groupedAttributesTemp[attrName])
          groupedAttributesTemp[attrName] = {};
        if (!groupedAttributesTemp[attrName][attrValue])
          groupedAttributesTemp[attrName][attrValue] = { variants: [] };
        groupedAttributesTemp[attrName][attrValue].variants.push(variant);
      });
    });

    Object.keys(groupedAttributesTemp).forEach((attrName) => {
      const values = groupedAttributesTemp[attrName];
      const firstValue = Object.keys(values)[0];
      defaultSelection[attrName] = firstValue;
    });

    setSelectedAttributes(defaultSelection);

    const matchedVariant = product.product_variants.find((variant) =>
      variant.product_attributes.every(
        (attrObj) =>
          defaultSelection[attrObj.attribute_value?.attribute?.name] ===
          attrObj.attribute_value?.value
      )
    );

    if (matchedVariant) {
      setSelectedVariant(matchedVariant);
      if (matchedVariant.image && isValidImage(matchedVariant.image)) {
        setMainImage(matchedVariant.image);
      } else if (product.medias?.length > 0) {
        setMainImage(product.medias[0].file_name);
      }
    } else {
      setSelectedVariant(product.product_variants[0]);
      if (product.medias?.length > 0) {
        setMainImage(product.medias[0].file_name);
      }
    }
  }, [product]);

  const handleAttributeSelect = (attributeName, value) => {
    const updatedSelection = {
      ...selectedAttributes,
      [attributeName]: value,
    };
    setSelectedAttributes(updatedSelection);
    if (!product) return;
    const matchedVariant = product.product_variants.find((variant) =>
      variant.product_attributes.every(
        (attrObj) =>
          updatedSelection[attrObj.attribute_value?.attribute?.name] ===
          attrObj.attribute_value?.value
      )
    );
    if (matchedVariant) {
      setSelectedVariant(matchedVariant);
      if (matchedVariant.image && isValidImage(matchedVariant.image)) {
        setMainImage(matchedVariant.image);
      } else if (product.medias?.length > 0) {
        setMainImage(product.medias[0].file_name);
      }
    }
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (
      value > 0 &&
      value <= (selectedVariant?.quantity || product?.quantity || 100)
    ) {
      setQuantity(value);
    }
  };

  const handleAddToCart = async () => {
    const userId = localStorage.getItem("user_id");
    const userToken = localStorage.getItem("user_token");
    if ((!userId || !userToken) && promotionId != null) {
      setLoginDialogOpen(true);
      return;
    }
    if (!product) return;
    const availableQty = selectedVariant?.quantity || product.quantity || 0;
    if (availableQty === 0) {
      setOutOfStockMessage("نفذت الكمية");
      return;
    } else {
      setOutOfStockMessage("");
    }
    let sessionId = localStorage.getItem("session_id");
    if (!userId && !sessionId) {
      sessionId = Math.floor(Math.random() * 1_000_000_000);
      localStorage.setItem("session_id", sessionId);
    }
    const productId = product.id;
    const variantId = selectedVariant ? selectedVariant.id : null;

    setMessage(null);
    setMessageType(null);

    try {
      let bodyData = {
        user_id: userId ? userId : sessionId,
        quantity: quantity,
      };

      if (variantId) {
        bodyData.product_variant_id = variantId;
      } else {
        bodyData.product_id = productId;
      }

      if (promotionId) {
        bodyData.promotion_id = promotionId;
      }

      const result = await addToCart(bodyData).unwrap();

      if (result.status) {
        setMessage("تمت إضافة المنتج إلى العربة بنجاح!");
        setMessageType("success");
      } else {
        setMessage("فشل في إضافة المنتج إلى العربة.");
        setMessageType("error");
      }
    } catch (error) {
      setMessage("حدث خطأ أثناء إضافة المنتج إلى العربة.");
      setMessageType("error");
    }
  };

  const handleRelatedProductClick = (relatedProductId) => {
    // Handle related product click
  };

  if (!open) return null;

  const discountedPrice = selectedVariant?.price
    ? parseFloat(selectedVariant.price)
    : parseFloat(product?.price || 0);
  const totalPrice = discountedPrice * quantity;

  function getGiftLabel(gift) {
    if (gift.name === "percentage_discount")
      return `احصل على خصم ${gift.relationship?.value || ""}%`;
    if (gift.name === "free_shipping") return "احصل على شحن مجاني";
    if (gift.name === "free_products") return "احصل على منتجات مجانية";
    return gift.name;
  }

  return (
    <div className="product-details-dialog-overlay" onClick={onClose}>
      <div
        className="product-details-dialog"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="product-details-dialog-close" onClick={onClose}>
          ×
        </button>
        <div style={{ display: "flex", gap: 32 }}>
          {gifts && gifts.length > 0 && (
            <div className="product-gifts-section">
              <div className="product-gifts-section-title">هدايا هذا العرض</div>
              {gifts.map((gift, idx) => (
                <div key={idx} className="product-gift-card">
                  🎁 {getGiftLabel(gift)}
                  {gift.name === "free_products" &&
                    Array.isArray(gift.relationship?.products) &&
                    gift.relationship.products.length > 0 && (
                      <div className="gift-free-products-list">
                        {gift.relationship.products.map((prod, i) => (
                          <div
                            className="gift-free-product-item"
                            key={prod.id || i}
                            title={prod.name}
                          >
                            <img
                              className="gift-free-product-img"
                              src={
                                prod.image || prod.medias?.[0]?.file_name || ""
                              }
                              alt={prod.name}
                            />
                            <span className="gift-free-product-title">
                              {prod.name}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                </div>
              ))}
            </div>
          )}
          <div style={{ flex: 1, minWidth: 0 }}>
            {initialLoading ? (
              <div
                style={{
                  position: "fixed",
                  top: 0,
                  left: 0,
                  width: "100vw",
                  height: "100vh",
                  background: "rgba(255,255,255,0.95)",
                  zIndex: 9999,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div style={{ textAlign: "center" }}>
                  <span
                    className="loader"
                    style={{
                      display: "inline-block",
                      width: "64px",
                      height: "64px",
                      border: "8px solid #a67c2e",
                      borderTop: "8px solid #fff",
                      borderRadius: "50%",
                      animation: "spin 1s linear infinite",
                      background: "#fff",
                      boxShadow: "0 2px 16px rgba(0,0,0,0.08)",
                    }}
                  ></span>
                  <style>{`@keyframes spin { 0% { transform: rotate(0deg);} 100% { transform: rotate(360deg);} }`}</style>
                  <div
                    style={{
                      color: "#a67c2e",
                      fontWeight: "bold",
                      fontSize: "1.3rem",
                      marginTop: 18,
                    }}
                  >
                    جاري تحميل تفاصيل المنتج...
                  </div>
                </div>
              </div>
            ) : !product || productError ? (
              <div
                style={{
                  padding: "48px 0",
                  textAlign: "center",
                  color: "#a67c2e",
                  fontWeight: "bold",
                  fontSize: "1.2rem",
                }}
              >
                لم يتم العثور على المنتج.
              </div>
            ) : (
              <React.Fragment>
                <div className="container product-page-container product-detailes-section">
                  <div className="product-details">
                    <div className="above-product-details">
                      <div className="products-images">
                        <div className="all-product-images">
                          {product.medias.filter(media => media.file_name && media.file_name.trim() !== '').map((media, index) => (
                            <img
                              key={index}
                              src={media.file_name}
                              alt={`Thumbnail ${index + 1}`}
                              onMouseOver={() => setMainImage(media.file_name)}
                            />
                          ))}
                        </div>
                        <div className="main-product-image">
                          <TransformWrapper>
                            <TransformComponent>
                              {mainImage ? (
                                <img
                                  src={mainImage}
                                  alt={product.name}
                                  style={{ width: "100%", maxWidth: "300px" }}
                                />
                              ) : (
                                <div
                                  style={{
                                    width: "100%",
                                    maxWidth: "300px",
                                    height: "300px",
                                    backgroundColor: "#f0f0f0",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    color: "#666"
                                  }}
                                >
                                  No Image Available
                                </div>
                              )}
                            </TransformComponent>
                          </TransformWrapper>
                        </div>
                      </div>

                      <div className="product-price-variants">
                        <div className="offer-box">
                          <div className="save-offer-box">يوفر 34.89ر.س.</div>
                          <div className="offer-type-box">
                            توفيرات مشرقة عرض الترحيب
                          </div>
                        </div>

                        <div className="price-box">
                          <p className="price-txt">
                            {selectedVariant?.price
                              ? selectedVariant.price
                              : product.price}
                          </p>
                          {selectedVariant?.old_price &&
                            selectedVariant.old_price !== "0.00" && (
                              <span className="old-price">
                                <s>{selectedVariant.old_price}</s>
                              </span>
                            )}
                          <p className="end-offer-time">
                            تنتهي في: 18 مايو 23:59
                          </p>
                        </div>

                        <div className="product-title">{product.name}</div>

                        <div className="product-review">
                          <div className="stars-icon-box">
                            <FontAwesomeIcon
                              icon={faStar}
                              className="product-start-icon"
                            />
                            <FontAwesomeIcon
                              icon={faStar}
                              className="product-start-icon"
                            />
                            <FontAwesomeIcon
                              icon={faStar}
                              className="product-start-icon"
                            />
                            <FontAwesomeIcon
                              icon={faStar}
                              className="product-start-icon"
                            />
                            <FontAwesomeIcon
                              icon={faStar}
                              className="product-start-icon"
                            />
                          </div>
                          <div className="review-count">
                            <p>
                              <span className="review-average">4.5</span>{" "}
                              التقيمات |{" "}
                              <span className="sold-count">25 مباع</span>
                            </p>
                          </div>
                        </div>

                        <hr className="spilator" style={{ margin: 0 }} />

                        <div className="product-variants-box">
                          <div className="space-y-6">
                            {Object.entries(
                              (() => {
                                const grouped = {};
                                product.product_variants.forEach((variant) => {
                                  variant.product_attributes.forEach(
                                    (attrObj) => {
                                      const attrName =
                                        attrObj.attribute_value?.attribute
                                          ?.name;
                                      const attrValue =
                                        attrObj.attribute_value?.value;
                                      if (!attrName || !attrValue) return;
                                      if (!grouped[attrName])
                                        grouped[attrName] = {};
                                      if (!grouped[attrName][attrValue]) {
                                        grouped[attrName][attrValue] = {
                                          variants: [],
                                          image: null,
                                        };
                                      }
                                      grouped[attrName][
                                        attrValue
                                      ].variants.push(variant);
                                      if (
                                        !grouped[attrName][attrValue].image &&
                                        variant.image
                                      ) {
                                        grouped[attrName][attrValue].image =
                                          variant.image;
                                      }
                                    }
                                  );
                                });
                                return grouped;
                              })()
                            ).map(([attrName, values]) => (
                              <div key={attrName} className="space-y-2">
                                <h3 className="font-medium text-gray-700">
                                  {attrName}
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                  {Object.entries(values).map(
                                    ([value, data]) => {
                                      const isActive =
                                        selectedAttributes[attrName] === value;
                                      return (
                                        <button
                                          key={value}
                                          onClick={() =>
                                            handleAttributeSelect(
                                              attrName,
                                              value
                                            )
                                          }
                                          style={{
                                            border: isActive
                                              ? "1px solid red"
                                              : "none",
                                            padding: "8px 12px",
                                            margin: "4px",
                                            borderRadius: "4px",
                                            cursor: "pointer",
                                            backgroundColor: isActive
                                              ? "#fff0f0"
                                              : "#f0f0f0",
                                          }}
                                        >
                                          <span>{value}</span>
                                        </button>
                                      );
                                    }
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div
                          className="selected-attributes-summary"
                          style={{
                            margin: "12px 0",
                            padding: "10px 14px",
                            background: "#f9f6f1",
                            borderRadius: "8px",
                            fontWeight: "bold",
                            color: "#a67c2e",
                            fontSize: "1.05rem",
                          }}
                        >
                          {Object.keys(selectedAttributes).length > 0 && (
                            <span>
                              {Object.entries(selectedAttributes).map(
                                ([attr, value], idx, arr) => (
                                  <span key={attr}>
                                    {attr} : {value}
                                    {idx < arr.length - 1 ? " | " : ""}
                                  </span>
                                )
                              )}
                            </span>
                          )}
                        </div>

                        <div className="stock-section">
                          <label>
                            الكمية:
                            <input
                              type="number"
                              min="1"
                              max={
                                selectedVariant
                                  ? selectedVariant.quantity
                                  : product?.quantity || 100
                              }
                              value={quantity}
                              onChange={handleQuantityChange}
                              className="number-input"
                            />
                          </label>
                          <p>
                            متوفر:{" "}
                            <strong>
                              {selectedVariant
                                ? selectedVariant.quantity
                                : product?.quantity || 0}
                            </strong>{" "}
                            وحدات
                          </p>
                        </div>

                        {message && showMessage && (
                          <div
                            style={{
                              position: "fixed",
                              top: "32px",
                              left: "50%",
                              transform: "translateX(-50%)",
                              minWidth: "320px",
                              maxWidth: "90vw",
                              padding: "18px 28px",
                              borderRadius: "12px",
                              fontWeight: "bold",
                              fontSize: "1.15rem",
                              color:
                                messageType === "success"
                                  ? "#155724"
                                  : "#721c24",
                              background:
                                messageType === "success"
                                  ? "#d4edda"
                                  : "#f8d7da",
                              border: `2px solid ${messageType === "success"
                                ? "#c3e6cb"
                                : "#f5c6cb"
                                }`,
                              boxShadow: "0 4px 32px rgba(0,0,0,0.13)",
                              textAlign: "center",
                              zIndex: 9999,
                              transition: "opacity 0.3s",
                            }}
                          >
                            {message}
                          </div>
                        )}
                        {loading && (
                          <div
                            style={{
                              position: "fixed",
                              top: 0,
                              left: 0,
                              width: "100vw",
                              height: "100vh",
                              background: "rgba(0,0,0,0.18)",
                              zIndex: 9998,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              pointerEvents: "auto",
                              transition: "opacity 0.3s",
                            }}
                          >
                            <div style={{ textAlign: "center" }}>
                              <span
                                className="loader"
                                style={{
                                  display: "inline-block",
                                  width: "48px",
                                  height: "48px",
                                  border: "6px solid #a67c2e",
                                  borderTop: "6px solid #fff",
                                  borderRadius: "50%",
                                  animation: "spin 1s linear infinite",
                                  marginBottom: "18px",
                                  background: "#fff",
                                  boxShadow: "0 2px 16px rgba(0,0,0,0.08)",
                                }}
                              ></span>
                              <style>{`@keyframes spin { 0% { transform: rotate(0deg);} 100% { transform: rotate(360deg);} }`}</style>
                              <div
                                style={{
                                  color: "#a67c2e",
                                  fontWeight: "bold",
                                  fontSize: "1.2rem",
                                }}
                              >
                                جاري إضافة المنتج...
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <ProductReviewsComponent />
                    <ProductDescription description={product.description} />
                  </div>
                  <div className="seller-details">
                    <SellerInfo
                      onAddToCart={() => {
                        if (onAddToBuondle) {
                          onAddToBuondle(product, quantity, selectedAttributes);
                        } else {
                          handleAddToCart();
                        }
                      }}
                      product={productData ? productData?.data : null}
                      store={product.store}
                      outOfStockMessage={outOfStockMessage}
                      isBundleDialog={!!onAddToBuondle}
                    />
                  </div>
                </div>
                {pageLoading && (
                  <div className="page-loader-overlay">
                    <div className="page-loader-spinner"></div>
                  </div>
                )}
                <LoginDialog
                  open={loginDialogOpen}
                  onClose={() => setLoginDialogOpen(false)}
                />
              </React.Fragment>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
