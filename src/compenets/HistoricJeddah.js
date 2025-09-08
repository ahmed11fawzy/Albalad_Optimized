import React from "react";
import "../css/HistoricJeddah.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { FaChevronRight, FaChevronLeft } from "react-icons/fa";
import event1 from "../assest/images/event-1.webp";
import event2 from "../assest/images/event-2.webp";
import event3 from "../assest/images/event-3.webp";
import event4 from "../assest/images/event-4.webp";
import event5 from "../assest/images/event-5.webp";
import event6 from "../assest/images/event-6.webp";
import event11 from "../assest/images/event11.jpeg";
import {
  useGetEventCategoriesQuery,
  useGetEventsQuery,
} from "../redux/Slices/events";
import { Link, Navigate, useNavigate } from "react-router-dom";

const sliderImages = [
  event3, // بيت نصيف جدة
  event4, // شارع جدة القديمة
];

/* const events = [
  {
    name: "فعالية جدة التاريخية",
    date: "15",
    month: "أكتوبر",
    time: "7:00 م",
    img: event1, // بيت نصيف
  },
  {
    name: "مهرجان ثقافي",
    date: "20",
    month: "نوفمبر",
    time: "6:00 م",
    img: event2, // شارع جدة القديمة
  },
  {
    name: "معرض فني",
    date: "5",
    month: "ديسمبر",
    time: "8:00 م",
    img: event3, // سوق جدة
  },
  {
    name: "مهرجان الألوان",
    date: "12",
    month: "يناير",
    time: "5:00 م",
    img: event4, // متحف جدة
  },
  {
    name: "أمسية شعرية",
    date: "8",
    month: "فبراير",
    time: "9:00 م",
    img: event5, // فندق تراثي
  },
  {
    name: "عرض مسرحي",
    date: "22",
    month: "مارس",
    time: "8:30 م",
    img: event4,
  },
  {
    name: "مؤتمر التراث",
    date: "3",
    month: "أبريل",
    time: "4:00 م",
    img: event4, // مؤتمر جدة
  },
  {
    name: "سوق الحرفيين",
    date: "17",
    month: "مايو",
    time: "6:30 م",
    img: event3, // بيوت جدة القديمة
  },
]; */

function HistoricJeddah() {
  const navigate = useNavigate();
  const handleNavigate = (id, marketId) => {
    navigate(`/event/${id}`, { state: { marketId } });
  };
  const { data: categoriesData, isLoading: categoriesLoading } =
    useGetEventCategoriesQuery();
  const { data: eventsData, isLoading } = useGetEventsQuery();

  return (
    <>
      <div
        style={{ position: "relative", width: "100%", paddingBottom: "56.25%" }}
        className="mt-9 flex justify-center items-center "
      >
        <iframe
          style={{
            position: "absolute",
            top: 55,

            width: "80%",
            height: "80%",
          }}
          src="https://www.youtube.com/embed/jyG991Ehqbs?autoplay=1&mute=1&rel=0&controls=0&modestbranding=1&showinfo=0"
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        ></iframe>
      </div>
      <div className="saudi-font container-under-header-fixed historic-jeddah-swiper-page container">
        {/* Categories Swiper */}
        <h2 className="section-title">الفئات</h2>
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
          {categoriesData?.data?.map((cat, idx) => (
            <SwiperSlide key={cat.name}>
              <Link to={`/historic-jeddah/${cat.id}`} key={idx}>
                <div className="">
                  <img src={`${cat.image}`} alt={cat.name} className="" />
                  {/* <div className="historic-category-name">{cat.name}</div> */}
                </div>
              </Link>
            </SwiperSlide>
          ))}
          <div className="categories-swiper-next custom-swiper-arrow">
            <FaChevronRight />
          </div>
          <div className="categories-swiper-prev custom-swiper-arrow">
            <FaChevronLeft />
          </div>
        </Swiper>
        {/* Banner Swiper */}

        <Swiper
          className="banner-swiper"
          modules={[Navigation]}
          navigation={{
            nextEl: ".banner-swiper-next",
            prevEl: ".banner-swiper-prev",
          }}
          spaceBetween={0}
          slidesPerView={1}
          loop={true}
        >
          {sliderImages.map((img, idx) => (
            <SwiperSlide key={idx}>
              <img src={img} alt="بانر جدة التاريخية" className="banner-img" />
            </SwiperSlide>
          ))}
          <div className="banner-swiper-next custom-swiper-arrow">
            <FaChevronRight />
          </div>
          <div className="banner-swiper-prev custom-swiper-arrow">
            <FaChevronLeft />
          </div>
        </Swiper>

        {/* Events Swiper */}
        <h2 className="section-title">الفعاليات</h2>
        <Swiper
          className="events-swiper"
          modules={[Navigation]}
          navigation={{
            nextEl: ".events-swiper-next",
            prevEl: ".events-swiper-prev",
          }}
          spaceBetween={16}
          slidesPerView={2.2}
          breakpoints={{
            1200: { slidesPerView: 4.2 },
            900: { slidesPerView: 3.2 },
            600: { slidesPerView: 2.2 },
            0: { slidesPerView: 1.1 },
          }}
          dir="rtl"
        >
          {eventsData?.data?.map((event, idx) => (
            <SwiperSlide key={event.name}>
              <div
                className="event-card cursor-pointer"
                onClick={() => handleNavigate(event.id, event.market_id)}
              >
                <img
                  src={event.images[0]}
                  alt={event.name}
                  className="historic-category-img"
                />
                <div className="px-2 my-2.5">{event.name}</div>
                <div className="text-right  text-[14px] text-gray-500  ">
                  {event.start_datetime.split("T")[0]} -{" "}
                  {event.end_datetime.split("T")[0]}
                </div>
                <button className="event-readmore-slider event-readmore-black mb-2 ">
                  قراءة المزيد{" "}
                  <FaChevronLeft
                    style={{
                      marginRight: 6,
                      marginLeft: 6,
                      verticalAlign: "middle",
                    }}
                  />
                </button>
              </div>
            </SwiperSlide>
          ))}
          <div className="events-swiper-next custom-swiper-arrow">
            <FaChevronRight />
          </div>
          <div className="events-swiper-prev custom-swiper-arrow">
            <FaChevronLeft />
          </div>
        </Swiper>
      </div>
    </>
  );
}

export default HistoricJeddah;
