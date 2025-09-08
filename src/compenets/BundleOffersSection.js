import React from 'react';
import OffersCardProduct from "./offersCard_compennet";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBagShopping } from '@fortawesome/free-solid-svg-icons';
import Button from "./styledComponents/reusableButton";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import { useGetAllPackageOffersQuery } from "../redux/Slices/offersApi";

export default function BundleOffersSection() {
    const { data: packageOffers, isLoading } = useGetAllPackageOffersQuery();

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

    if (isLoading) {
        return (
            <div className="offers-card-static">
                <div className="offers-card-header" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                    <div className="offers-card-title-section" style={{ display: 'flex', alignItems: 'center', gap: 5, justifyContent: 'center' }}>
                        <div className="offers-card-icon bundle-icon-small">
                            <FontAwesomeIcon icon={faBagShopping} />
                        </div>
                        <h2 className="offers-card-title">عروض الحزمة</h2>
                    </div>
                    <p className="offers-card-subtitle" style={{ textAlign: 'center' }}>احصل على أكثر ووفر أكبر</p>
                </div>
                <div className="offers-card-content">
                    <div style={{ textAlign: 'center', padding: '40px 0' }}>Loading...</div>
                </div>
            </div>
        );
    }

    if (!packageOffers?.data?.length) {
        return null;
    }

    return (
        <div className="offers-card-static">
            <div className="offers-card-header" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                <div className="offers-card-title-section" style={{ display: 'flex', alignItems: 'center', gap: 5, justifyContent: 'center' }}>
                    <div className="offers-card-icon bundle-icon-small">
                        <FontAwesomeIcon icon={faBagShopping} />
                    </div>
                    <h2 className="offers-card-title">عروض الحزمة</h2>
                </div>
                <p className="offers-card-subtitle" style={{ textAlign: 'center' }}>احصل على أكثر ووفر أكبر</p>
            </div>

            <div className="offers-card-content"   >
                <div className="offers-cards-slider">
                    <Swiper {...cardsSwiperSettings} className="offers-swiper">
                        {packageOffers.data.map((offer, index) => (
                            <SwiperSlide key={index}>
                                <OffersCardProduct
                                    data={offer}
                                    offerType="bundle"
                                />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>

                <div style={{ textAlign: 'center', position: 'relative', overflow: 'hidden' }} >
                    <Button
                        variant="primary"
                        size="medium"
                        onClick={() => window.location.href = '/boundle-offers'}
                    >
                        عرض جميع الحزم
                    </Button>
                </div>
            </div>
        </div>
    );
} 