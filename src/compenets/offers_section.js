import React from 'react';
import BundleOffersSection from './BundleOffersSection';
import XYOffersSection from './XYOffersSection';
import TopSellingSection from './TopSellingSection';

export default function OffersSection() {
  return (
    <div className="offers-main-container">
      <div className="offers-section-header">
        <h1 className="section-title offers-section-title">عروض اليوم المميزة</h1>
        <p className="offers-section-subtitle">اكتشف أفضل العروض والخصومات الحصرية</p>
      </div>

      {/* Two Column Layout for Offers */}
      <div className="container">
        <div className="offers-two-column-grid">
          {/* Bundle Offers Card */}
          <BundleOffersSection />

          {/* XY Offers Card */}
          <XYOffersSection />
        </div>
      </div>

      {/* Top Selling Section - Full Width */}
      <div className="container">
        <TopSellingSection />
      </div>
    </div>
  );
}