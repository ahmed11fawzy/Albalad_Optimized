import React from "react";
import { useNavigate } from "react-router-dom";
import { FaRegCalendarCheck } from "react-icons/fa";
import "./MainCategoriesSidebar.css";
export default function MainCategoriesSidebar({
  open,
  onClose,
  categories,
  loading,
}) {
  const navigate = useNavigate();

  const handleCategoryClick = (catId) => {
    onClose();
    navigate(`/sub-categories/${catId}`);
  };

  return (
    <>
      {open && (
        <div className="category-sidebar-backdrop" onClick={onClose}></div>
      )}
      <aside className={`category-sidebar${open ? " open" : ""}`}>
        <div className="category-sidebar-header">
          <span className="category-sidebar-title">الفئات الرئيسية</span>
          <button className="category-sidebar-close" onClick={onClose}>
            &times;
          </button>
        </div>
        <button
          className="event-jeddah-btn"
          onClick={() => {
            onClose();
            navigate("/historic-jeddah");
          }}
        >
          <span className="event-jeddah-icon">
            <FaRegCalendarCheck />
          </span>
          فعاليات جدة التاريخية
        </button>
        <ul className="category-sidebar-list">
          {loading ? (
            <li>جاري التحميل...</li>
          ) : (
            categories?.map((cat) => (
              <li key={cat.id} onClick={() => handleCategoryClick(cat.id)}>
                {cat.image ? (
                  <img
                    src={`https://back.al-balad.sa/albalad/v1.0/uploads/categories/images/${cat.image}`}
                    alt={cat.name}
                  />
                ) : (
                  <span
                    style={{
                      width: 38,
                      height: 38,
                      display: "inline-block",
                      background: "#f7f7f7",
                      borderRadius: 8,
                    }}
                  ></span>
                )}
                <span>{cat.name}</span>
              </li>
            ))
          )}
        </ul>
      </aside>
    </>
  );
}
