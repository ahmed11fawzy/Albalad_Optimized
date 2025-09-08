import React, { useMemo } from 'react'
import { useGetMarketQuery } from '../../redux/Slices/markets';
import { useParams, useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, FreeMode } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/free-mode";
import CustomLoader from '../../components/CustomLoader';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import ProductCard from '../styledComponents/productCard';
import { Box } from '@mui/material';
import BannerAd from '../../components/BannerAd';

const Market = () => {
  const {marketId} = useParams();
  console.log("🚀 ~ Market ~ id  :", marketId )
  const { data: marketData, isLoading, error } = useGetMarketQuery(marketId);
  console.log("🚀 ~ Market ~ marketData:", marketData)
  
  const navigate = useNavigate();

    if (isLoading) return <CustomLoader />;
    // جمع جميع المنتجات من جميع المتاجر
  const allProducts = marketData?.data?.stores.flatMap((store) =>
    Array.isArray(store?.products) ? store?.products : []
  );

    const handleProductClick = (product) => {
        navigate(`/product/${product.id}`, { state: { product } });
      };
    
      return (
        <Box
          className="mt-28"
          sx={{
            width: "90%",
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: "10px",
            marginInline: "auto",
            flexWrap: "nowrap",
        }}>
          <Box sx={{ flex: { xs: "1 0 100%", md: "3 0 0" }, overflow: "auto" }} > 
            <h2 className="markets-stores-title text-center text-4xl mb-3">
              {marketData ? `متاجر ${marketData?.data?.name}` : "متاجر السوق"}
            </h2>
            {/* قسم المتاجر */}
            <div className="markets-stores-slider ">
            {isLoading ? (
              <CustomLoader />
            ) : marketData?.data?.stores?.length === 0 ? (
              <div style={{ padding: 32, textAlign: "center", color: "#888" }}>
                لا توجد متاجر متاحة لهذا السوق
              </div>
            ) : (
              <Swiper
                modules={[Navigation, FreeMode]}
                spaceBetween={1}
                slidesPerView={3}
                freeMode={true}
                navigation={{
                  nextEl: ".markets-stores-arrow.next",
                  prevEl: ".markets-stores-arrow.prev",
                }}
                breakpoints={{
                  1200: { slidesPerView: 3 },
                  
                  600: { slidesPerView: 2 },
                  0: { slidesPerView: 2 },
                }}
                dir="rtl"
              >
                {marketData?.data?.stores?.map((store) => (
                  <SwiperSlide key={store.id}>
                    <div
                      className=" flex flex-col items-center "
                      onClick={() => navigate(`/store-profile/${store.id}`)}
                      style={{ cursor: "pointer" }}
                    >
                      <div className="markets-store-img-circle overflow-hidden w-[100px] h-[100px] rounded-full shadow-amber-200  ">
                        {store.logo ? (
                          <img
                            src={store.logo}
                            alt={store.name_ar || store.name_en || "store"}
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
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
                {/* <div className="markets-stores-arrow next">
                  <FaChevronRight />
                </div>
                <div className="markets-stores-arrow prev">
                  <FaChevronLeft />
                </div> */}
              </Swiper>
            )}
            </div>
          </Box>
          <Box sx={{ flex: { xs: "1 0 100%", md: "7 0 0" }, overflow: "auto" }} >
             <BannerAd
                      imageUrl="https://images.pexels.com/photos/210126/pexels-photo-210126.jpeg?_gl=1*59w5ze*_ga*Mjc4MzgzMDg2LjE3NTU3NzQ1MTM.*_ga_8JE65Q40S6*czE3NTU3NzQ1MTMkbzEkZzAkdDE3NTU3NzQ1MTMkajYwJGwwJGgw"
                      altText="Summer Sale"
                      title="عروض الصيف !"
                      subtitle="احصل على خصومات تصل إلى 50%"
                      width="100%"
                      height={300}
                      onClick={() => console.log("Ad clicked!")}
                    />
            
            {/* قسم المنتجات */}
            {allProducts?.length > 0 && (
              <>
                <h2 className="markets-stores-title px-7 text-center" style={{ marginTop: 40 }}>
                  منتجات من سوق {marketData?.data?.name }
                </h2>
                <div className=" grid  grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-4 mt-4">
                  {allProducts.map((product) => (
                    <ProductCard onClick={handleProductClick} product={product} />
                  ))}
                </div>
              </>
            )}  
          </Box>
          
        </Box>
      );
}

export default Market