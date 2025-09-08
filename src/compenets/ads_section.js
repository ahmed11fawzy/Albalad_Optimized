import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  Navigation,
  Pagination,
  Autoplay,
  Parallax,
  EffectFade,
} from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import { FaUmbrellaBeach, FaCopy } from "react-icons/fa";
import clothesProduct from "../assest/images/clothesProduct.png";
import "./FashionSlider/FashionSlider.css";

const defaultSlides = [
  {
    image:
      "https://images.pexels.com/photos/3641059/pexels-photo-3641059.jpeg?auto=compress&cs=tinysrgb&w=1350&h=750&dpr=1",
    title: "New Season Styles",
    subtitle: "Explore the latest fashion trends",
    bgColor: "#b88c36",
    link: "/shop",
  },
  {
    image:
      "https://images.unsplash.com/photo-1615655407236-b23ae4db3ae1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80",
    title: "Chic Apparel",
    subtitle: "Elevate your wardrobe with our collection",
    bgColor: "#a67c30",
    link: "/shop/apparel",
  },
  {
    image:
      "https://images.pexels.com/photos/14727906/pexels-photo-14727906.jpeg?auto=compress&cs=tinysrgb&w=1350&h=750&dpr=1",
    title: "Elegant Accessories",
    subtitle: "Add a touch of luxury to your look",
    bgColor: "#c99d47",
    link: "/shop/accessories",
  },
];

export default function AdsSection() {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(false);
  const userToken = localStorage.getItem("user_token");

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return d.toLocaleDateString("ar-EG", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  useEffect(() => {
    if (!userToken) {
      setSlides(defaultSlides);
      return;
    }
    setLoading(true);
    fetch("https://back.al-balad.sa/albalad/v1.0/promotions/coupons", {
      headers: { Authorization: `Bearer ${userToken}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status && Array.isArray(data.data)) {
          const apiSlides = data.data.map((coupon) => {
            const discount = coupon.gift_types?.find(
              (gift) => gift.name === "خصم بنسبة مئوية"
            )?.relationship?.value;
            const freeShipping = coupon.gift_types?.find(
              (gift) => gift.name === "شحن مجاني"
            );
            const subtitle = discount
              ? `${discount}% خصم${freeShipping ? " + شحن مجاني" : ""}`
              : freeShipping
              ? "شحن مجاني"
              : coupon.description || "Exclusive deal for you";
            return {
              image:
                coupon.image ||
                defaultSlides[Math.floor(Math.random() * defaultSlides.length)]
                  .image,
              title: coupon.name || "Special Offer",
              subtitle,
              bgColor: "#b88c36",
              link: coupon.link || "/shop",
              couponCode: coupon.coupon?.code || "",
              startDate: coupon.start_date,
              endDate: coupon.end_date,
            };
          });
          setSlides(
            apiSlides.length > 1 ? apiSlides : [...apiSlides, ...defaultSlides]
          );
        } else {
          setSlides(defaultSlides);
        }
      })
      .catch(() => {
        setSlides(defaultSlides);
      })
      .finally(() => setLoading(false));
  }, [userToken]);

  return (
    <div className="fashion-slider-container mt-28">
      {loading ? (
        <div className="coupons-loading">جاري التحميل...</div>
      ) : (
        <Swiper
          key={slides.length}
          modules={[Navigation, Pagination, Autoplay, Parallax, EffectFade]}
          loop={slides.length > 1}
          speed={1000}
          parallax={true}
          effect="fade"
          fadeEffect={{ crossFade: true }}
          navigation={true}
          pagination={{ clickable: true, dynamicBullets: true }}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          className="fashion-slider h-screen"
          onSlideChange={(swiper) => {
            const activeSlide = swiper.slides[swiper.realIndex];
            const bgColor =
              activeSlide?.getAttribute("data-slide-bg-color") || "#b88c36";
            const sliderElement = document.querySelector(".fashion-slider");
            if (activeSlide && sliderElement) {
              sliderElement.style.background = `linear-gradient(135deg, ${bgColor} 0%, #8a6727 100%)`;
            }
          }}
          onInit={(swiper) => {
            const activeSlide = swiper.slides[swiper.realIndex];
            const bgColor =
              activeSlide?.getAttribute("data-slide-bg-color") || "#b88c36";
            const sliderElement = document.querySelector(".fashion-slider");
            if (activeSlide && sliderElement) {
              sliderElement.style.background = `linear-gradient(135deg, ${bgColor} 0%, #8a6727 100%)`;
            }
          }}
        >
          {slides.map((slide, index) => (
            <SwiperSlide key={index} data-slide-bg-color={slide.bgColor}>
              <img
                fetchPriority="high"
                src={slide.image}
                alt={slide.title}
                data-swiper-parallax-scale="1.1"
                onError={(e) => {
                  e.target.src = defaultSlides[0].image;
                }}
              />
              <div
                className="fashion-slider-content"
                data-swiper-parallax-y="100"
              >
                <h2
                  className="fashion-slider-title"
                  data-swiper-parallax-x="-300"
                >
                  {slide.title}
                </h2>
                <p
                  className="fashion-slider-subtitle"
                  data-swiper-parallax-x="-200"
                >
                  {slide.subtitle}
                </p>
                {slide.couponCode && (
                  <div
                    className="coupon-mini-code-row"
                    data-swiper-parallax-x="-150"
                  >
                    <span className="coupon-mini-code">{slide.couponCode}</span>
                    <button
                      className="coupon-mini-copy-btn"
                      onClick={() =>
                        navigator.clipboard.writeText(slide.couponCode)
                      }
                      title="نسخ الكود"
                    >
                      <FaCopy />
                    </button>
                  </div>
                )}
                {(slide.startDate || slide.endDate) && (
                  <div
                    className="coupon-mini-dates"
                    data-swiper-parallax-x="-100"
                  >
                    {slide.startDate && (
                      <>
                        <span className="text-white">من</span>
                        <span className="coupon-mini-date-label">
                          {formatDate(slide.startDate)}
                        </span>
                      </>
                    )}
                    {slide.endDate && (
                      <>
                        <span className="text-white">الي</span>
                        <span className="coupon-mini-date-label">
                          {formatDate(slide.endDate)}
                        </span>
                      </>
                    )}
                  </div>
                )}
                <a
                  href={slide.link}
                  className="shop-now-button"
                  data-swiper-parallax-x="-100"
                >
                  اكتشف المزيد
                </a>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  );
}
