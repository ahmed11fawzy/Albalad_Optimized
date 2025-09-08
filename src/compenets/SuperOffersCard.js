import React from "react";
import OffersCardProduct from "./offersCard_compennet";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock } from "@fortawesome/free-solid-svg-icons";
import CountdownTimer from "./timerDown";
import Button from "./styledComponents/reusableButton";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import { useGetAllSuperOffersQuery } from "../redux/Slices/offersApi";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
export default function SuperOffersCard() {
  const { data: superOffers, isLoading: isSuperOffersLoading } =
    useGetAllSuperOffersQuery();
  console.log("🚀 ~ SuperOffersCard ~ superOffers:", superOffers);

  const cardsSwiperSettings = {
    modules: [Autoplay],
    slidesPerView: 2,
    spaceBetween: 15,
    autoplay: {
      delay: 4000,
      disableOnInteraction: false,
      pauseOnMouseEnter: true,
    },
    loop: true,
    breakpoints: {
      320: {
        slidesPerView: 1,
        spaceBetween: 10,
      },
      640: {
        slidesPerView: 2,
        spaceBetween: 15,
      },
    },
  };

  if (isSuperOffersLoading) {
    return (
      <div className="offers-card-static">
        <div className="offers-card-header">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              justifyContent: "center",
            }}
            className="offers-card-title-section"
          >
            <div className="offers-card-icon super-icon-small">
              <AutoAwesomeIcon className="text-[#b88c36]" />
            </div>
            <h2 className="offers-card-title">عروض السوبر</h2>
          </div>
        </div>
        <div className="offers-card-content">
          <div style={{ textAlign: "center", padding: "40px 0" }}>
            Loading...
          </div>
        </div>
      </div>
    );
  }

  if (!superOffers?.data?.length) {
    return null;
  }

  return (
    <div className="offers-card-static">
      <div className="offers-card-header mb-5 ">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 5,
            justifyContent: "center",
          }}
          className="offers-card-title-section"
        >
          <div className="offers-card-icon super-icon-small">
            <AutoAwesomeIcon className="text-[#b88c36]" />
          </div>
          <h2 className="offers-card-title">عروض السوبر</h2>
        </div>
      </div>

      <div className="offers-card-content">
        <div
          className="offers-timer-section-simple"
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            gap: 20,
          }}
        ></div>

        <div className="offers-cards-slider">
          <Swiper {...cardsSwiperSettings} className="offers-swiper">
            {superOffers.data.map((offer, index) => (
              <SwiperSlide key={index}>
                <OffersCardProduct data={offer} offerType="XYOffer" />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <div
          style={{
            textAlign: "center",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <Button
            variant="primary"
            size="medium"
            onClick={() => (window.location.href = "/supper-offers")}
          >
            عرض جميع العروض
          </Button>
        </div>
      </div>
    </div>
  );
}
