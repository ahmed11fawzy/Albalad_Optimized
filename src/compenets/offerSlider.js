import OffersCardProduct from "./offersCard_compennet";
import { BestSellerOfferList, BigSaveOfferList, SupperOfferList } from "./offersCardData";
import React from 'react';
import Slider from 'react-slick';
import {InnerAds} from '../compenets/adsData'; 
import {ExternalAds} from '../compenets/adsData'; 
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
export default function OfferSlider({ offerType }){
    const OfferData=offerType=="bestseller"?BestSellerOfferList:offerType=="superoffer"?SupperOfferList:BigSaveOfferList;
  

}