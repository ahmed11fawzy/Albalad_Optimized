import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Container, Typography, Box, CircularProgress, Button, Grid } from '@mui/material';
import { useGetAllHistoricalPlacesQuery, useGetEventCategoryQuery } from '../redux/Slices/events';
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import RelatedPlaceDetails from '../components/relatedPlaceDetails';

const PlaceDetailsPage = () => {
  const { id } = useParams();
  const { data: place, isLoading, isError } = useGetEventCategoryQuery(id);
  const { data: relatedPlaces } = useGetAllHistoricalPlacesQuery();
  const [selectedPlace, setSelectedPlace] = useState(null); // State for selected place
  const [isPopupOpen, setIsPopupOpen] = useState(false); // State for popup visibility

  const handleCardClick = (place) => {
    setSelectedPlace(place);
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setSelectedPlace(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 font-roboto mt-28">
      <Box className="bg-gradient-to-r from-[#f5c25c] to-[#7c4e05] py-16">
        <Container>
          <Typography variant="h3" className="text-[#cecbc5b9] font-bold font-[Kufam]">
            اهلا بك في جدة التاريخية
          </Typography>
          {isLoading && (
            <Box className="flex justify-center">
              <CircularProgress />
            </Box>
          )}
          {isError && (
            <Typography color="error" className="text-center">
              Error loading category details
            </Typography>
          )}
          {place && place.status && place.data && (
            <Box className="flex">
              <Box className="w-3/4 px-6">
                <Typography variant="h4" className="text-white font-bold font-amiri">
                  {place.data.name}
                </Typography>
                <Typography variant="body1" className="text-white font-roboto mt-16">
                  {place.data.description.split('\r\n').map((paragraph, index) => (
                    <p key={index} className="mb-4">{paragraph}</p>
                  ))}
                </Typography>
              </Box>
              <Box className="bg-white shadow-lg rounded-lg p-6">
                <img
                  src={place?.data?.image}
                  alt={place?.data.name}
                  className="w-full h-96 object-cover rounded-lg mb-6"
                />
              </Box>
            </Box>
          )}
        </Container>
      </Box>

      <Container className="py-8">
        <h2 className="section-title">جميع {place?.data?.name} التاريخية</h2>
        <Swiper
          className="categories-swiper"
          modules={[Navigation]}
          navigation={{
            nextEl: ".categories-swiper-next",
            prevEl: ".categories-swiper-prev",
          }}
          spaceBetween={16}
          slidesPerView={3.2}
          breakpoints={{
            900: { slidesPerView: 5.2 },
            600: { slidesPerView: 4.2 },
            0: { slidesPerView: 2.2 },
          }}
          dir="rtl"
        >
          {relatedPlaces?.data
            ?.filter((cat) => cat.place_category_id == place?.data?.id)
            .map((cat, idx) => (
              <SwiperSlide key={cat.name}>
                <div
                  className="historic-category-card"
                  onClick={() => handleCardClick(cat)}
                  style={{ cursor: 'pointer' }}
                >
                  <img
                    src={`${cat.main_image}`}
                    alt={cat.name}
                    className="historic-category-img"
                  />
                  <div className="historic-category-name">{cat.name}</div>
                </div>
              </SwiperSlide>
            ))}
          <div className="categories-swiper-next custom-swiper-arrow">
            <FaChevronRight />
          </div>
          <div className="categories-swiper-prev custom-swiper-arrow">
            <FaChevronLeft />
          </div>
        </Swiper>
      </Container>

      {isPopupOpen && selectedPlace && (
        <RelatedPlaceDetails place={selectedPlace} onClose={handleClosePopup} />
      )}

      <Container className="py-8">
        <Box className="w-full h-11/12 flex border-b-cyan-600 justify-end rounded-lg overflow-hidden">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d237514.3516791274!2d39.0331644296875!3d21.485811049999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x15c3d01d85940001%3A0x7f4f3f65782c2889!2sJeddah%2C%20Saudi%20Arabia!5e0!3m2!1sen!2sus!4v1697051234567!5m2!1sen!2sus"
            width="100%"
            height="300px"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Jeddah Location"
          ></iframe>
        </Box>
      </Container>
    </div>
  );
};

export default PlaceDetailsPage;