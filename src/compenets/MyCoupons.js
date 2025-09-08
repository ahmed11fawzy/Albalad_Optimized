import React, { useEffect, useState } from "react";
import "./MyCoupons.css";
import headerlogo from "./logoHeader";
import { FaTicketAlt } from "react-icons/fa";

export default function MyCoupons() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCoupons = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("user_token");
        const res = await fetch(
          "https://back.al-balad.sa/albalad/v1.0/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await res.json();
        if (data && data.data && Array.isArray(data.data.coupons)) {
          setCoupons(data.data.coupons);

        } else {
          setCoupons([]);
        }
      } catch (err) {
        setError("حدث خطأ أثناء جلب الكوبونات");
      }
      setLoading(false);
    };
    fetchCoupons();
  }, []);

  return (
    <div className="container container-under-header-fixed">
      <div className="my-coupons-header">
        <h2>كوبوناتي</h2>
      </div>
      {loading ? (
        <div className="my-coupons-loading">جاري التحميل...</div>
      ) : error ? (
        <div className="my-coupons-error">{error}</div>
      ) : coupons.length === 0 ? (
        <div className="my-coupons-empty">لا يوجد كوبونات حالياً</div>
      ) : (
        <div className="my-coupons-list">
          {coupons.map((coupon) => (
            <div className={`coupon-card pro-coupon-card`} key={coupon.id}>
              <div className="coupon-icon-box">
                <FaTicketAlt className="coupon-icon" />
              </div>
              <div className="coupon-code pro-coupon-code">{coupon.code}</div>
              <div
                className={`coupon-status pro-coupon-status ${coupon.is_active ? "active" : "inactive"
                  }`}
              >
                {coupon.is_active ? "فعال" : "غير فعال"}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
