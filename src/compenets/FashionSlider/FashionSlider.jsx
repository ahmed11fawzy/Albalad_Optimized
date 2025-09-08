import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, Parallax, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import './FashionSlider.css';

const slides = [
  {
    image: 'https://images.unsplash.com/photo-1490481659583-1f7f28b6ebee?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80',
    title: 'Summer Collection',
    subtitle: 'Discover the latest trends in summer fashion',
    bgColor: '#D1C4B4',
    link: '/shop/dresses',
  },
  {
    image: 'https://images.pexels.com/photos/985635/pexels-photo-985635.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    title: ' Elegant Dresses',
    subtitle: 'Step into luxury with our exclusive footwear',
    bgColor: '#9B89C5',
    link: '/shop/dresses',
  },
 
  {
    image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80',
    title: 'Luxury Accessories',
    subtitle: 'Complete your look with premium accessories',
    bgColor: '#D7A594',
    link: '/shop/accessories',
  },
  {
    image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80',
    title: 'Winter Collection',
    subtitle: 'Stay warm and stylish this season',
    bgColor: '#A8B5C8',
    link: '/shop/winter',
  },
  {
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80',
    title: 'Premium Bags',
    subtitle: 'Carry your essentials in style',
    bgColor: '#C8A8B5',
    link: '/shop/bags',
  },
  {
    image: 'https://images.pexels.com/photos/786003/pexels-photo-786003.jpeg',
    title: 'Designer Shoes',
    subtitle: 'Step into luxury with our exclusive footwear',
    bgColor: '#9B89C5',
    link: '/shop/shoes',
  },
];

const FashionSlider = () => {
  return (
    <div className="fashion-slider-container">
      <Swiper
        modules={[Navigation, Pagination, Autoplay, Parallax, EffectFade]}
        loop={true}
        speed={1000}
        parallax={true}
        effect="fade"
        fadeEffect={{
          crossFade: true
        }}
        navigation={true}
        pagination={{ 
          clickable: true,
          dynamicBullets: true
        }}
        autoplay={{ 
          delay: 5000, 
          disableOnInteraction: false,
          pauseOnMouseEnter: true
        }}
        className="fashion-slider"
        onSlideChange={(swiper) => {
          const activeSlide = swiper.slides[swiper.activeIndex];
          const bgColor = activeSlide.getAttribute('data-slide-bg-color') || '#667eea';
          document.querySelector('.fashion-slider').style.background = 
            `linear-gradient(135deg, ${bgColor} 0%, #764ba2 100%)`;
        }}
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index} data-slide-bg-color={slide.bgColor}>
            <img 
              src={slide.image} 
              alt={slide.title} 
              data-swiper-parallax-scale="1.1"
            />
            <div className="fashion-slider-content" data-swiper-parallax-y="100">
              <h2 className="fashion-slider-title" data-swiper-parallax-x="-300">
                {slide.title}
              </h2>
              <p className="fashion-slider-subtitle" data-swiper-parallax-x="-200">
                {slide.subtitle}
              </p>
              <a
                href={slide.link}
                className="shop-now-button"
                data-swiper-parallax-x="-100"
              >
                Shop Now
              </a>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default FashionSlider;