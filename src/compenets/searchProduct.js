import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../css/searchProduct.css";
import { useGetSearchResultsQuery } from "../redux/Slices/searchApi";
import { Navigation, FreeMode } from "swiper/modules";
import ProductCard from "./styledComponents/productCard";
import CustomLoader from "../components/CustomLoader";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/free-mode";
import { FaChevronLeft, FaChevronRight, FaStore } from "react-icons/fa";

export default function SearchProduct() {
  const { query } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  console.log("🚀 ~ SearchProduct ~ products:", products);
  const [categories, setCategories] = useState([]);
  console.log("🚀 ~ SearchProduct ~ categories:", categories);

  // Only call useGetSearchResultsQuery if no state.product.data is provided
  console.log("🚀 ~ SearchProduct ~ encodeURIComponent(query):", query);
  const shouldFetch = !state?.product?.data;
  const { data, isLoading, error } = useGetSearchResultsQuery(query, {
    skip: !shouldFetch, // Skip the query if state.product.data exists
  });

  useEffect(() => {
    if (state?.product?.data) {
      setProducts(state.product.data);
      setCategories(state.product.categories || []); // Assuming categories might be in state
    } else if (data?.data) {
      setProducts(data.data);
      setCategories(data.categories || []);
    } else {
      setProducts([]);
      setCategories([]);
    }
  }, [state, data]);

  const SkeletonLoader = () => (
    <div className="search-products-grid">
      {[...Array(6)].map((_, idx) => (
        <div className="product-card" key={idx}>
          <div className="product-image large">
            <div className="skeleton skeleton-img" />
          </div>
          <div className="product-info">
            <div className="skeleton skeleton-title" />
            <div className="skeleton skeleton-review" />
            <div className="skeleton skeleton-price" />
            <div className="skeleton skeleton-offer" />
            <div className="skeleton skeleton-btn" />
            <div className="skeleton skeleton-shipping" />
          </div>
        </div>
      ))}
    </div>
  );

  const handleProductClick = (product) => {
    navigate(`/product/${product.id}`, { state: { product } });
  };

  return (
    <div className="search-product-page mt-28 container">
      <h2>نتايج البحث</h2>

      {isLoading && shouldFetch ? (
        <CustomLoader />
      ) : !categories.length ? (
        <div style={{ padding: 32, textAlign: "center", color: "#888" }}>
          لا يوجد فئات مطابقة لبحثك.
        </div>
      ) : (
        <>
          <h3>الفئات</h3>
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
            {categories.map((cat) => (
              <SwiperSlide key={cat.id}>
                <div
                  className="markets-store-item"
                  onClick={() => navigate(`/sub-categories/${cat.id}`)}
                  style={{ cursor: "pointer" }}
                >
                  <div className="markets-store-img-circle">
                    {cat.image ? (
                      <img src={cat.image} alt={cat.name || "store"} />
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
                  <div className="markets-store-name">{cat.name}</div>
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
        </>
      )}
      {isLoading && shouldFetch ? (
        <SkeletonLoader />
      ) : !products.length ? (
        <div className="no-results">لا توجد منتجات مطابقة لبحثك.</div>
      ) : (
        <div className="more-loves-products-container">
          {products.map((product) => (
            <ProductCard
              product={product}
              key={product.id}
              onClick={() => handleProductClick(product)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
