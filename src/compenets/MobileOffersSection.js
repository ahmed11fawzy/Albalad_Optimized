import React from 'react';
import Slider from 'react-slick';
import './mobile-offers-section.css';
import { useNavigate } from 'react-router-dom';
import product1 from '../assest/images/product1.jpg';
import product2 from '../assest/images/product2.jpg';
import product3 from '../assest/images/product3.jpg';
import product4 from '../assest/images/product4.jpg';
import product5 from '../assest/images/product5.jpg';

const bundleOffers = [
  { id: 1, img: product1, price: 199.00, oldPrice: 299.00, orders: 3200, rating: 4.7 },
  { id: 2, img: product2, price: 89.00, oldPrice: 149.00, orders: 2100, rating: 4.5 },
  { id: 3, img: product3, price: 129.00, oldPrice: 199.00, orders: 1800, rating: 4.6 },
  { id: 4, img: product4, price: 159.00, oldPrice: 249.00, orders: 2500, rating: 4.8 },
  { id: 5, img: product5, price: 99.00, oldPrice: 179.00, orders: 4100, rating: 4.9 },
];
const BuyXGetYOffers = [
  { id: 1, img: product1, price: 49.00, oldPrice: 99.00, orders: 4000, rating: 4.7 },
  { id: 2, img: product2, price: 79.00, oldPrice: 159.00, orders: 1000, rating: 4.3 },
  { id: 3, img: product3, price: 59.00, oldPrice: 119.00, orders: 1000, rating: 4.6 },
  { id: 4, img: product4, price: 299.00, oldPrice: 499.00, orders: 800, rating: 4.5 },
  { id: 5, img: product5, price: 99.00, oldPrice: 179.00, orders: 1200, rating: 4.8 },
];

function MobileOfferSlider({ products, moreType }) {
  const navigate = useNavigate();
  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 2.05,
    slidesToScroll: 1,
    arrows: false,
    swipeToSlide: true,
    responsive: [
      {
        breakpoint: 700,
        settings: {
          slidesToShow: 2.05,
        }
      },
      {
        breakpoint: 500,
        settings: {
          slidesToShow: 2.05,
        }
      }
    ]
  };
  return (
    <div className="mobile-offers-slider">
      <Slider {...settings}>
        {products.map((prod) => (
          <div className="mobile-offer-card" key={prod.id}>
            <div className="mobile-offer-img-wrapper">
              <img src={prod.img} alt="offer" className="mobile-offer-img" />
              <div className="mobile-offer-img-overlay"></div>
            </div>
            <div className="mobile-offer-info">
              <div className="mobile-offer-prices">
                <span className="mobile-offer-price">{prod.price} ر.س.</span>
                <span className="mobile-offer-old-price">{prod.oldPrice} ر.س.</span>
              </div>
              <div className="mobile-offer-orders-rating">
                <span className="mobile-offer-orders">+{prod.orders} الطلبات</span>
                <span className="mobile-offer-rating">⭐ {prod.rating}</span>
              </div>
            </div>
          </div>
        ))}
        <div className="mobile-offer-card mobile-more-btn-card">
          <button className="mobile-offer-more-btn" onClick={() => {
            if (moreType === 'bundle') {
              navigate('/boundle-offers');
            } else if (moreType === 'super') {
              navigate('/buy-x-get-y-offers');
            }
          }}>
            عرض المزيد
            <span className="mobile-offer-arrow">&#x279C;</span>
          </button>
        </div>
      </Slider>
    </div>
  );
}

export default function MobileOffersSection() {
  return (
    <div className="container mobile-offers-section-root">
      <div className="mobile-offers-block">
        <div className="mobile-offers-title-row">
          <h2 className="mobile-offers-title">عروض الحزمة</h2>
          <span className="mobile-offers-desc">3 منتجات بـ 7.75 SAR فأكثر</span>
        </div>
        <MobileOfferSlider products={bundleOffers} moreType="bundle" />
      </div>
      <div className="mobile-offers-block">
        <div className="mobile-offers-title-row">
          <h2 className="mobile-offers-title mobile-super">عروض اشتري واحصل</h2>
          <span className="mobile-offers-desc">خصم %70 لفترة محدودة</span>
        </div>
        <MobileOfferSlider products={BuyXGetYOffers} moreType="super" />
      </div>
    </div>
  );
} 