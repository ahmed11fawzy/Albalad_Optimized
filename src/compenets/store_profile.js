import React, { useState, useEffect } from "react";
import "./store_profile.css";
import { useParams, useNavigate } from "react-router-dom";
import ProductCard from "./styledComponents/productCard";
import BannerAd from "../components/BannerAd";
import { Box } from "@mui/material";
import ProfileCard from "../components/ProfileCard";

export default function StoreProfile() {
  const { storeId } = useParams();
  const [storeData, setStoreData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStoreData = async () => {
      try {
        const response = await fetch(
          `https://back.al-balad.sa/albalad/v1.0/stores/show/${storeId}`
        );
        if (!response.ok) throw new Error("فشل تحميل بيانات المتجر");

        const result = await response.json();
        console.log("🚀 ~ fetchStoreData ~ result:", result);

        if (!result.status) throw new Error("البيانات غير صحيحة");

        setStoreData(result);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchStoreData();
  }, [storeId]);

  if (loading) {
    return (
      <div className="store-profile-loading-skeletons">
        {[...Array(12)].map((_, i) => (
          <div className="product-skeleton" key={i}>
            <div className="skeleton-image" />
            <div className="skeleton-line short" />
            <div className="skeleton-line" />
            <div className="skeleton-line" />
          </div>
        ))}
      </div>
    );
  }
  if (error) {
    return <div className="error">حدث خطأ: {error}</div>;
  }

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
      }}
    >
      <Box sx={{ flex: { xs: "1 0 100%", md: "3 0 0" }, overflow: "auto" }}>
        <ProfileCard storeData={storeData} />
      </Box>
      <Box sx={{ flex: { xs: "1 0 100%", md: "7 0 0" }, overflow: "auto" }}>
        <BannerAd
          imageUrl="https://images.pexels.com/photos/210126/pexels-photo-210126.jpeg?_gl=1*59w5ze*_ga*Mjc4MzgzMDg2LjE3NTU3NzQ1MTM.*_ga_8JE65Q40S6*czE3NTU3NzQ1MTMkbzEkZzAkdDE3NTU3NzQ1MTMkajYwJGwwJGgw"
          altText="Summer Sale"
          title="عروض الصيف !"
          subtitle="احصل على خصومات تصل إلى 50%"
          width="100%"
          height={300}
          onClick={() => console.log("Ad clicked!")}
        />
        <div className=" grid  grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-4 mt-4">
          {storeData?.products?.map((product) => (
            <ProductCard product={product} key={product.id} />
          ))}
        </div>
      </Box>
    </Box>
  );
}
