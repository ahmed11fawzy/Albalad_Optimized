import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, FreeMode } from "swiper/modules";
import { FaChevronRight, FaChevronLeft, FaStore } from "react-icons/fa";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/free-mode";
import "./Markets-stores.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import ProductCard from "./styledComponents/productCard";

// Loader الاحترافي لدوران دائرتين داخل مربع (نفس subCategory.js)
const CustomLoader = () => (
  <div className="subcategory-loader-overlay">
    <div className="subcategory-loader-box">
      <span className="loader-dot loader-dot-red"></span>
      <span className="loader-dot loader-dot-black"></span>
    </div>
  </div>
);

export default function MarketsStores() {
  const { marketId } = useParams();
  const [stores, setStores] = useState([]);
  const [marketName, setMarketName] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMarketStores = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `https://back.al-balad.sa/albalad/v1.0/markets/show/${marketId}`
        );
        const data = await res.json();
        if (data && data.status && data.data) {
          setStores(Array.isArray(data.data.stores) ? data.data.stores : []);
          setMarketName(data.data.name || "");
        } else {
          setStores([]);
          setMarketName("");
        }
      } catch (e) {
        setStores([]);
        setMarketName("");
      }
      setLoading(false);
    };
    if (marketId) fetchMarketStores();
  }, [marketId]);

  // جمع جميع المنتجات من جميع المتاجر
  const allProducts = stores.flatMap((store) =>
    Array.isArray(store.products) ? store.products : []
  );
  const handleProductClick = (product) => {
    navigate(`/product/${product.id}`, { state: { product } });
  };

  return (
    <div className="markets-stores-page container-under-header-fixed">
      <h2 className="markets-stores-title">
        {marketName ? `متاجر ${marketName}` : "متاجر السوق"}
      </h2>
      <div className="markets-stores-slider">
        {loading ? (
          <CustomLoader />
        ) : stores.length === 0 ? (
          <div style={{ padding: 32, textAlign: "center", color: "#888" }}>
            لا توجد متاجر متاحة لهذا السوق
          </div>
        ) : (
          <Swiper
            modules={[Navigation, FreeMode]}
            spaceBetween={10}
            slidesPerView={7.2}
            freeMode={true}
            navigation={{
              nextEl: ".markets-stores-arrow.next",
              prevEl: ".markets-stores-arrow.prev",
            }}
            breakpoints={{
              1200: { slidesPerView: 7.2 },
              900: { slidesPerView: 6.2 },
              600: { slidesPerView: 4.2 },
              0: { slidesPerView: 4.2 },
            }}
            dir="rtl"
          >
            {stores.map((store) => (
              <SwiperSlide key={store.id}>
                <div
                  className="markets-store-item"
                  onClick={() => navigate(`/store-profile/${store.id}`)}
                  style={{ cursor: "pointer" }}
                >
                  <div className="markets-store-img-circle">
                    {store.logo ? (
                      <img
                        src={store.logo}
                        alt={store.name_ar || store.name_en || "store"}
                      />
                    ) : (
                      <span
                        style={{
                          width: 56,
                          height: 56,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          borderRadius: "50%",
                          background: "#f7f7f7",
                          border: "1px solid #eee",
                        }}
                      >
                        <FaStore size={28} color="#bbb" />
                      </span>
                    )}
                  </div>
                  <div className="markets-store-name">
                    {store.name_ar || store.name_en}
                  </div>
                </div>
              </SwiperSlide>
            ))}
            <div className="markets-stores-arrow next">
              <FaChevronRight />
            </div>
            <div className="markets-stores-arrow prev">
              <FaChevronLeft />
            </div>
          </Swiper>
        )}
      </div>
      {/* قسم المنتجات */}
      {allProducts.length > 0 && (
        <>
          <h2 className="markets-stores-title" style={{ marginTop: 40 }}>
            منتجات من سوق {marketName}
          </h2>
          <div className=" container more-loves-products-container">
            {allProducts.map((product) => (
              <ProductCard product={product} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
