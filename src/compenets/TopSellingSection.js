import React from "react";
import OffersCardProduct from "./offersCard_compennet";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCrown } from "@fortawesome/free-solid-svg-icons";
import Button from "./styledComponents/reusableButton";
import { useGetTopSellingOffersQuery } from "../redux/Slices/offersApi";

export default function TopSellingSection() {
  const { data: topSellingProducts, isLoading } = useGetTopSellingOffersQuery();

  if (isLoading) {
    return (
      <div className="bestsellers-section-full-width">
        <div className="bestsellers-header">
          <div className="bestsellers-title-section">
            <FontAwesomeIcon icon={faCrown} className="bestsellers-crown" />
            <h2 className="bestsellers-title">الأكثر مبيعاً</h2>
          </div>
          <p className="bestsellers-subtitle">
            المنتجات الأكثر طلباً من أكثر من 5000 ماركة
          </p>
        </div>
        <div style={{ textAlign: "center", padding: "40px 0" }}>Loading...</div>
      </div>
    );
  }

  if (!topSellingProducts?.data?.products?.length) {
    return null;
  }

  return (
    <>
      {/* <div className="bestsellers-header">
                <div className="bestsellers-title-section">
                    <FontAwesomeIcon icon={faCrown} className="bestsellers-crown" />
                    <h2 className="bestsellers-title">الأكثر مبيعاً</h2>
                </div>
                <p className="bestsellers-subtitle">المنتجات الأكثر طلباً من أكثر من 5000 ماركة</p>
            </div>
 */}
      <div className="bestsellers-cards-grid">
        {topSellingProducts.data.products.slice(0, 8).map((product, index) => (
          <OffersCardProduct
            key={product.id}
            data={product}
            offerType="bestseller"
          />
        ))}
      </div>
    </>
  );
}
