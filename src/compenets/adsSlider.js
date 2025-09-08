import React from 'react';
import Slider from 'react-slick';
import {InnerAds} from '../compenets/adsData'; 
import {ExternalAds} from '../compenets/adsData'; 
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ADS from './ads_compenent';
 export default function AdsSlider(data){

  const AdsData=data=="innerAds"?InnerAds:ExternalAds;
// Slider settings
const settings = {
    dots: true, // Show dots
    infinite: true, // Infinite loop
    speed: 500, // Transition speed
    slidesToShow: 1, // Number of slides to show at once
    slidesToScroll: 1, // Number of slides to scroll
    arrows: false,
    autoplay: true, // Auto-play the slider
    autoplaySpeed: 2000, // Auto-play speed
    
  };

  return (
    <div className="slider-container">
      <Slider {...settings}>
      {AdsData.map((ads) => {
 
  return (
    <div key={ads.id}>
      <ADS data={ads} />
    </div>
  );
})}
      </Slider>
    </div>
  );


   
};
