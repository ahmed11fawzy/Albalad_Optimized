import BrandAdsComponent from "./ads_brand_compennet";
import CategoryCarousel from "./categorySlider";

export default function BrandAdsSection() {
  return (
    <div className="container">
      {/* <h1 className="section-title">تسوق حسب الفئة</h1> */}
      <BrandAdsComponent />
      {/* <div style={{ display: 'flex', gap: 5 }} >
            <div style={{ flex: 1 }}>
            </div>
            <div style={{ flex: 1 }}>
                <CategoryCarousel />
            </div>
        </div> */}
    </div>
  );
}
