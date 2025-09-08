import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCards, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-cards';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './offers.css';
import { faStar, faEye } from '@fortawesome/free-solid-svg-icons';
import Button from './styledComponents/reusableButton';

export default function OffersCardProduct({ data, offerType }) {
  // Handle different data structures based on offer type
  const getProductImages = () => {
    if (offerType === "bundle" && data.bundle?.bundle_products) {
      return data.bundle.bundle_products.map(product => product.product.medias[0]?.file_name || '/placeholder-image.jpg');
    } else if (offerType === "XYOffer" && data.buy_x_get_y_products) {
      return data.buy_x_get_y_products.map(item => item.product.medias[0]?.file_name || '/placeholder-image.jpg');
    } else if (data.medias?.length > 0) {
      // For top-selling products - filter out empty file names
      const validImages = data.medias.filter(media => media.file_name && media.file_name.trim() !== '').map(media => media.file_name);
      return validImages.length > 0 ? validImages : ['/placeholder-image.jpg'];
    } else if (data.product?.medias?.length > 0) {
      // Filter out empty file names
      const validImages = data.product.medias.filter(media => media.file_name && media.file_name.trim() !== '').map(media => media.file_name);
      return validImages.length > 0 ? validImages : ['/placeholder-image.jpg'];
    } else {
      // Fallback image
      return ['/placeholder-image.jpg'];
    }
  };

  const getProductTitle = () => {
    if (offerType === "bundle") {
      return data.name || data.description || 'حزمة منتجات';
    } else if (offerType === "XYOffer") {
      return data.name || data.description || 'عرض خاص';
    } else {
      return data.name || data.description || data.title || 'منتج';
    }
  };

  const getProductPrice = () => {
    if (offerType === "bundle") {
      // Calculate total price for bundle
      const bundlePrice = data.bundle?.bundle_products?.reduce((total, item) => {
        return total + parseFloat(item.product.price || 0);
      }, 0);
      return bundlePrice ? bundlePrice.toFixed(2) : '0';
    } else if (offerType === "XYOffer") {
      // Get price from first product in XY offer
      const firstProduct = data.buy_x_get_y_products?.[0]?.product;
      return firstProduct?.price || '0';
    } else {
      return data.price || data.current_price || '0';
    }
  };

  const getOriginalPrice = () => {
    if (offerType === "bundle") {
      // Calculate original total price for bundle
      const originalPrice = data.bundle?.bundle_products?.reduce((total, item) => {
        return total + parseFloat(item.product.old_price || item.product.price || 0);
      }, 0);
      return originalPrice ? originalPrice.toFixed(2) : null;
    } else if (offerType === "XYOffer") {
      const firstProduct = data.buy_x_get_y_products?.[0]?.product;
      return firstProduct?.old_price || firstProduct?.face_price;
    } else {
      return data.old_price || data.facePrice || data.original_price || data.face_price;
    }
  };

  const getDiscountPercentage = () => {
    if (offerType === "bundle" && data.gift_types) {
      const percentageDiscount = data.gift_types.find(gift => gift.name === "percentage_discount");
      return percentageDiscount?.relationship?.value || null;
    } else if (offerType === "XYOffer" && data.gift_types) {
      const percentageDiscount = data.gift_types.find(gift => gift.name === "percentage_discount");
      return percentageDiscount?.relationship?.value || null;
    } else {
      return data.discountPerecent || data.discount_percent || null;
    }
  };

  const getOrderCount = () => {
    if (offerType === "bestseller") {
      return data.order_items_count || data.product_sales_total || 0;
    }
    return data.orderCount || 0;
  };

  const getRating = () => {
    return data.avg_rating || data.stars || "4.5";
  };

  // Function to get truncated title (first 10 words for top sellers)
  const getTruncatedTitle = () => {
    const fullTitle = getProductTitle();
    if (offerType === "bestseller" && fullTitle) {
      const words = fullTitle.split(' ');
      if (words.length > 10) {
        return words.slice(0, 10).join(' ') + '...';
      }
    }
    return fullTitle;
  };

  const productImages = getProductImages();
  const title = getTruncatedTitle();
  const price = getProductPrice();
  const originalPrice = getOriginalPrice();
  const discountPercentage = getDiscountPercentage();
  const orderCount = getOrderCount();
  const rating = getRating();

  const swiperSettings = {
    effect: 'cards',
    grabCursor: true,
    modules: [EffectCards, Autoplay],
    autoplay: {
      delay: 1500,
      disableOnInteraction: false,
      pauseOnMouseEnter: false,
      reverseDirection: false,
    },
    cardsEffect: {
      slideShadows: false,
      transformEl: null,
      rotate: true,
      perSlideRotate: 2,
      perSlideOffset: 4,
    },
    loop: true,
    allowTouchMove: true,
    centeredSlides: true,
    speed: 800,
    watchSlidesProgress: true,
  };

  const getBadgeText = () => {
    switch (offerType) {
      case "bundle":
        return "حزمة مميزة";
      case "bigsave":
        return "وفر كبير";
      case "bestseller":
        return "الأفضل مبيعاً";
      case "superoffer":
        return "عرض سوبر";
      case "XYOffer":
        return "عرض محدود";
      default:
        return "عرض خاص";
    }
  };

  return (
    <div className="product-offer-card" data-offer-type={offerType}>
      {/* Photo Container - Conditional rendering based on offer type */}
      <div className="product-image-swiper-container">
        {offerType === "bestseller" ? (
          // Single image for Best Sellers
          <div className="product-image-single">
            <div className="product-image-container">
              <img src={productImages[0]} alt={title} />
              <div className="product-overlay">
                <div className="product-badge">
                  {getBadgeText()}
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Card effect swiper for other offer types
          <Swiper {...swiperSettings} className="product-image-swiper">
            {productImages.map((image, index) => (
              <SwiperSlide key={index} className="product-image-slide">
                <div className="product-image-container">
                  <img src={image} alt={`${title} - صورة ${index + 1}`} />
                  <div className="product-overlay">
                    <div className="product-badge">
                      {getBadgeText()}
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>

      {/* Product Content */}
      <div className="product-offer-card-content">
        {/* Title and Savings Badge Row for Bundle */}
        {discountPercentage ? (
          <div className="product-title-with-savings">
            <p className="product-title">{title}</p>
            <div className="savings-badge-inline">
              <span className="save-text">وفر</span>
              <span className="save-amount">{discountPercentage}%</span>
            </div>
          </div>
        ) : (
          <p className="product-title">{title}</p>
        )}

        <div className="product-pricing">
          <div className="product-pricing-left" style={{ display: 'flex', alignItems: 'center' }}>
            <div className="current-price">
              <span className="price-value">{price}</span>
              <span className="currency">ر.س</span>
            </div>
            {originalPrice && originalPrice !== price && (
              <div className="original-price">
                <s>{originalPrice}</s>
              </div>
            )}
          </div>
          <div className="product-action-button-inline">
            <button
              className="eye-button"
              onClick={() => window.location.href = `/product/${data.id || 'details'}`}
              title={offerType === "bundle" ? "عرض الحزمة" :
                offerType === "XYOffer" ? "عرض العرض" :
                  "عرض المنتج"}
            >
              <FontAwesomeIcon icon={faEye} />
            </button>
          </div>
        </div>

        {offerType === "bestseller" && (
          <div className="product-rating">
            <span className="stars">
              <FontAwesomeIcon icon={faStar} className="star-icon" />
              {rating}
            </span>
            <span className="separator">|</span>
            <span className="sales-count">{orderCount}+ بيع</span>
          </div>
        )}

        {(offerType === "superoffer") && discountPercentage && (
          <div className="discount-badge">
            <span className="discount-percent">{discountPercentage}%-</span>
          </div>
        )}

        {/* {offerType === "XYOffer" && discountPercentage && (
          <div className="savings-info">
            <div className="savings-badge">
              <span className="save-text">وفر</span>
              <span className="save-amount">{discountPercentage}%</span>
            </div>
          </div>
        )} */}
      </div>
    </div>
  );
}