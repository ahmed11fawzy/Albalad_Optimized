import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SellerInfo from "./seller_info";
import ProductReviewsComponent from "./product_reviews_component";
import ProductDescription from "./ProductDescription";
import StoreDescription from "./StoreDescription";
import RelatedProducts from "./RelatedProducts";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { FaShoppingCart } from "react-icons/fa";
// Import Redux hooks
import {
  useGetProductDetailsQuery,
  useAddToCartMutation,
} from "../redux/Slices/productsApi";

export default function ProductDetail() {
  const location = useLocation();
  const { id } = useParams();
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedAttributes, setSelectedAttributes] = useState({});
  const [mainImage, setMainImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState(null); // 'success' | 'error'
  const [showMessage, setShowMessage] = useState(false);
  const [outOfStockMessage, setOutOfStockMessage] = useState("");
  const [pageLoading, setPageLoading] = useState(false);

  // Redux queries
  const {
    data: productData,
    isLoading: initialLoading,
    error: productError,
    refetch: refetchProduct,
  } = useGetProductDetailsQuery(id, {
    skip: !id || !!location.state?.product, // Skip if we have product from location state
  });

  // console.log("prod", productData?.data);

  const [addToCart, { isLoading: loading }] = useAddToCartMutation();

  // Get product from location state or Redux query
  const product = location.state?.product || productData?.data;


  const isValidImage = (url) => {
    if (!url) return false;
    return /\.(jpg|jpeg|png|webp|gif|bmp|svg)$/i.test(url);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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

    product?.product_variants?.forEach((variant) => {
      variant?.product_attributes?.forEach((attrObj) => {
        const attrName = attrObj.attribute_value?.attribute?.name;
        const attrValue = attrObj.attribute_value?.value;
        if (!attrName || !attrValue) return;
        if (!groupedAttributesTemp[attrName]) {
          groupedAttributesTemp[attrName] = {};
        }
        if (!groupedAttributesTemp[attrName][attrValue]) {
          groupedAttributesTemp[attrName][attrValue] = { variants: [] };
        }
        groupedAttributesTemp[attrName][attrValue].variants.push(variant);
      });
    });

    Object.keys(groupedAttributesTemp).forEach((attrName) => {
      const values = groupedAttributesTemp[attrName];
      const firstValue = Object.keys(values)[0];
      defaultSelection[attrName] = firstValue;
    });

    setSelectedAttributes(defaultSelection);

    const matchedVariant = product?.product_variants?.find((variant) =>
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
      setSelectedVariant(
        product?.product_variants ? product.product_variants[0] : null
      );
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
    const matchedVariant = product?.product_variants?.find((variant) =>
      variant?.product_attributes?.every(
        (attrObj) =>
          updatedSelection[attrObj?.attribute_value?.attribute?.name] ===
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
    const availableQty = selectedVariant?.quantity || product?.quantity || 0;
    if (availableQty === 0) {
      setOutOfStockMessage("نفذت الكمية");
      return;
    } else {
      setOutOfStockMessage("");
    }

    let userId = localStorage.getItem("user_id");
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

      const result = await addToCart(bodyData).unwrap();

      if (result.status) {
        setMessage("تمت إضافة المنتج إلى العربة بنجاح!");
        setMessageType("success");
      } else {
        setMessage("فشل في إضافة المنتج إلى العربة.");
        setMessageType("error");
        // console.error("سبب الفشل:", result?.message || result);
      }
    } catch (error) {
      setMessage("حدث خطأ أثناء إضافة المنتج إلى العربة.");
      setMessageType("error");
      // console.error("خطأ في الاتصال بالـ API:", error);
    }
  };

  const handleRelatedProductClick = (productId) => {
    setPageLoading(true);
    window.scrollTo(0, 0);
    setTimeout(() => {
      window.location.href = `/product/${productId}`;
    }, 300);
  };

  if (initialLoading) {
    return (
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
    );
  }

  if (!product || productError) {
    return (
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
    );
  }

  const discountedPrice = selectedVariant?.price
    ? parseFloat(selectedVariant?.price)
    : parseFloat(product?.price);
  const totalPrice = discountedPrice * quantity;

  return (
    <div className="container-under-header-fixed">
      <div className="container product-page-container product-detailes-section">
        <div className="product-details">
          <div className="above-product-details">
            <div className="products-images">
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
                          color: "#666",
                        }}
                      >
                        No Image Available
                      </div>
                    )}
                  </TransformComponent>
                </TransformWrapper>
              </div>
              <div className="all-product-images">
                {product.medias
                  .filter(
                    (media) => media.file_name && media.file_name.trim() !== ""
                  )
                  .map((media, index) => (
                    <img
                      key={index}
                      src={media.file_name}
                      alt={`Thumbnail ${index + 1}`}
                      onMouseOver={() => setMainImage(media.file_name)}
                    />
                  ))}
              </div>
            </div>

            <div className="product-price-variants">
              <div className="offer-box">
                <div className="save-offer-box">
                  يوفر {product.old_price - product.price} ر.س.
                </div>
                <div className="offer-type-box">
                  توفيرات مشرقة من عرض الترحيب
                </div>
              </div>

              <div className="price-box">
                <p className="price-txt">{product.price}</p>
                {selectedVariant?.old_price &&
                  selectedVariant.old_price !== "0.00" && (
                    <span className="old-price">
                      <s>{selectedVariant.old_price}</s>
                    </span>
                  )}
                <p className="end-offer-time">تنتهي في: 18 مايو 23:59</p>
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
                    <span className="review-average">
                      {productData?.data?.avg_rating}
                    </span>{" "}
                    التقيمات |{" "}
                    <span className="sold-count">
                      {productData?.data?.product_sales_total} مباع
                    </span>
                  </p>
                </div>
              </div>

              <hr className="spilator" style={{ margin: 0 }} />

              <div className="product-variants-box">
                <div className="space-y-6">
                  {Object.entries(
                    (() => {
                      const grouped = {};
                      product?.product_variants?.forEach((variant) => {
                        variant?.product_attributes?.forEach((attrObj) => {
                          const attrName =
                            attrObj.attribute_value?.attribute?.name;
                          const attrValue = attrObj.attribute_value?.value;
                          if (!attrName || !attrValue) return;
                          if (!grouped[attrName]) grouped[attrName] = {};
                          if (!grouped[attrName][attrValue]) {
                            grouped[attrName][attrValue] = {
                              variants: [],
                              image: null,
                            };
                          }
                          grouped[attrName][attrValue].variants.push(variant);
                          if (
                            !grouped[attrName][attrValue].image &&
                            variant.image
                          ) {
                            grouped[attrName][attrValue].image = variant.image;
                          }
                        });
                      });
                      return grouped;
                    })()
                  ).map(([attrName, values]) => (
                    <div key={attrName} className="space-y-2">
                      <h3 className="font-medium text-gray-700">{attrName}</h3>
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(values).map(([value, data]) => {
                          const isActive =
                            selectedAttributes[attrName] === value;
                          return (
                            <button
                              key={value}
                              onClick={() =>
                                handleAttributeSelect(attrName, value)
                              }
                              style={{
                                border: isActive ? "1px solid red" : "none",
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
                        })}
                      </div>
                    </div>
                  ))}
                </div>
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
                    color: messageType === "success" ? "#155724" : "#721c24",
                    background:
                      messageType === "success" ? "#d4edda" : "#f8d7da",
                    border: `2px solid ${messageType === "success" ? "#c3e6cb" : "#f5c6cb"
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
          <ProductReviewsComponent reviews={productData?.data?.reviews} />
          <ProductDescription description={product.description} />
        </div>
        <div className="seller-details">
          <SellerInfo
            onAddToCart={handleAddToCart}
            store={product.store}
            outOfStockMessage={outOfStockMessage}
            product={{ ...location.state?.product, quantity }}
          />
        </div>
      </div>
      <StoreDescription store={product.store} />
      {product?.category_id && (
        <RelatedProducts
          categoryId={product.category_id}
          onProductClick={handleRelatedProductClick}
        />
      )}
      {pageLoading && (
        <div className="page-loader-overlay">
          <div className="page-loader-spinner"></div>
        </div>
      )}
      <button
        className="add-to-cart-fixed-btn responsive-cart-btn"
        onClick={handleAddToCart}
        disabled={
          loading ||
          (selectedVariant
            ? selectedVariant.quantity === 0
            : product?.quantity === 0)
        }
      >
        <FaShoppingCart style={{ marginLeft: 8 }} />
        {loading ? "جاري الإضافة..." : "أضف إلى العربة"}
      </button>
    </div>
  );
}
