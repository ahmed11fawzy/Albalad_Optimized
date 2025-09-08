import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTruck,
  faBolt,
  faUndo,
  faCheck,
  faLock,
  faShareAlt,
  faHeart,
  faArrowRight,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import "./store_info.css";
import { Link, useNavigate } from "react-router-dom";
import CustomerServiceChat from "./chat/CustomerServiceChat";

export default function SellerInfo({
  onAddToCart,
  store,
  outOfStockMessage,
  isBundleDialog,
  product,
}) {
  const [showCard, setShowCard] = useState(false);
  const navigate = useNavigate();



  return (
    <div>
      <CustomerServiceChat Store={store} />
      <div className="seller-container">
        <div className="shipping-details-container">
          <div
            className="sold-by-box"
            onMouseEnter={() => setShowCard(true)}
            onMouseLeave={() => setShowCard(false)}
            style={{ paddingInline: "10px" }}
          >
            <p>
              <span> بائع</span> {store?.name_ar}
              {showCard && (
                <div className="seller-card">
                  <p>اسم المتجر: {store?.name_ar}</p>
                  <p>
                    رقم السجل التجاري:{" "}
                    {store?.documents?.commercial_registration_number}
                  </p>
                  <div
                    style={{ display: "flex", gap: 8, alignItems: "center" }}
                  >
                    <button className="store-details-btn">
                      <Link
                        to={`/store-profile/${store?.id}`}
                        className="store-details-btn-link"
                      >
                        {" "}
                        بيانات المتجر
                      </Link>
                    </button>
                  </div>
                </div>
              )}
            </p>
          </div>
          <hr className="splilator" />
          <div className="decoration-box">البلد</div>
          <div className="shipping-details">
            <p className="free-shipping">
              <FontAwesomeIcon icon={faTruck} className="seller-icon" />
              شحن مجاني
            </p>
            <p>
              <FontAwesomeIcon icon={faBolt} className="seller-icon" />
              <span className="delevier-time">تسليم 27 مايو</span>
            </p>
            <div className="quiq-deliver-box">
              <p>
                <FontAwesomeIcon icon={faBolt} className="seller-icon" />
                توصيل سريع
              </p>
              <ul className="quiq-deliver-list">
                <li>
                  <FontAwesomeIcon icon={faCheck} className="seller-li-icon" />
                  كوبون بقيمة 4.00ر.س. للتوصيل المتأخر
                </li>
              </ul>
            </div>
            <p>
              <FontAwesomeIcon icon={faUndo} className="seller-icon" />
              إرجاع مجاني خلال 15 يومًا
            </p>
            <div className="quiq-deliver-box">
              <p>
                <FontAwesomeIcon icon={faLock} className="seller-icon" />
                الامان والخصوصية
              </p>
              <ul className="quiq-deliver-list">
                <li>
                  <FontAwesomeIcon icon={faCheck} className="seller-li-icon" />
                  المدفوعات الآمنة: نحن لا نشارك بياناتك الشخصية{" "}
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="buy-box">
          <button
            className="btn-bx btn-rd"
            onClick={() => {
              navigate("/payment", { state: { product } });
            }}
          >
            شراء الان
          </button>
          <button className="btn-bx" onClick={onAddToCart}>
            {isBundleDialog ? "أضف إلى مختاراتي" : "أضف إلى العربة"}
          </button>
          {outOfStockMessage && (
            <div
              style={{
                color: "#b30000",
                fontWeight: "bold",
                marginTop: "8px",
                fontSize: "1rem",
              }}
            >
              {outOfStockMessage}
            </div>
          )}
          <div className="seller-actions-row">
            <button className="seller-action-btn">
              <FontAwesomeIcon icon={faShareAlt} className="seller-btn-icon" />{" "}
              مشاركة
            </button>
            <button className="seller-action-btn">
              <span>{product?.count_favorites}</span>
              <FontAwesomeIcon
                icon={faHeart}
                className="seller-btn-icon heart-icon"
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
