import React, { useState, useEffect } from "react";
import { FiChevronDown } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { CategoryList } from "../data/categoryData";
import { FaThLarge } from "react-icons/fa";

// مكون شجري للفئات الفرعية والفئات التابعة لها بنفس الكلاسات الأصلية
function SubCategoryTree({ categories }) {
  if (!categories || categories.length === 0) return null;
  return (
    <>
      {categories.map((subCat) => (
        <div key={subCat.id} className="subcategory-group">
          <h3 className="subcategory-title">{subCat.name}</h3>
          {subCat.children_all && subCat.children_all.length > 0 && (
            <div className="sub-subcategories">
              <SubCategoryTree categories={subCat.children_all} />
            </div>
          )}
        </div>
      ))}
    </>
  );
}

const CategoryDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("user-token");
        const response = await fetch("https://back.al-balad.sa/categories", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (data.status && Array.isArray(data.data)) {
          setCategories(data.data);
        } else {
          setCategories([]);
        }
      } catch (error) {
        setCategories([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // فقط الفئات الرئيسية (parent_id === null)
  const mainCategories = categories.filter((cat) => cat.parent_id === null);
  const selectedCategoryObj = mainCategories.find(
    (cat) => cat.id === selectedCategory
  );

  const handleSelect = (categoryId) => {
    setSelectedCategory(categoryId);
    setIsOpen(false);
    navigate(`/sub-categories/${categoryId}`);
  };
  const handleMouseLeave = () => {
    setHoveredCategory(null);
  };

  // نافذة الفئات الفرعية (popup)
  const renderSubcategoriesPopup = () => {
    const mainCat = mainCategories.find((cat) => cat.id === hoveredCategory);
    if (!mainCat || !mainCat.children_all || mainCat.children_all.length === 0)
      return null;
    return (
      <div className="category-popup" onMouseLeave={handleMouseLeave}>
        <div className="category-popup-inner">
          {mainCat.children_all
            .filter((subCat) => subCat.parent_id !== null)
            .map((subCat) => (
              <div className="category-popup-col" key={subCat.id}>
                <div className="category-popup-col-title">{subCat.name}</div>
                {subCat.children_all && subCat.children_all.length > 0 && (
                  <div className="category-popup-col-list">
                    {subCat.children_all.map((child) => (
                      <div
                        className="category-popup-col-item"
                        key={child.id}
                        onClick={() => {
                          navigate(`/category/${child.id}`);
                          handleMouseLeave();
                          setIsOpen(false);
                        }}
                      >
                        {child.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
        </div>
        <style>{`          .category-popup {
            position: absolute;
            top: 0;
            right: 100%;
            background: #fff;
            border-radius: 18px;
            box-shadow: 0 4px 32px rgba(0,0,0,0.13);
            padding: 32px 24px 32px 24px;
            min-width: 700px;
            z-index: 1000;
            margin-right: 8px;
            display: flex;
            align-items: flex-start;
            max-height: 450px;
            overflow-y: auto;
          }
          .category-popup-inner {
            display: flex;
            gap: 36px;
            flex-wrap: wrap;
            width: 100%;
          }
          .category-popup-col {
            min-width: 160px;
            max-width: 200px;
            margin-left: 12px;
          }
          .category-popup-col-title {
            font-weight: bold;
            font-size: 0.8em;
            margin-bottom: 10px;
            color: #222;
            letter-spacing: 0.01em;
          }
          .category-popup-col-list {
            display: flex;
            flex-direction: column;
            gap: 4px;
          }
          .category-popup-col-item {
            color: #888;
            font-size: 0.98em;
            margin-bottom: 2px;
            cursor: pointer;
            transition: color 0.2s;
          }
          .category-popup-col-item:hover {
            color: #a67c2e;
          }
        `}</style>
      </div>
    );
  };

  return (
    <div className="category-dropdown" style={{ position: "relative" }}>
      <button className="dropdown-trigger" onClick={() => setIsOpen(!isOpen)}>
        <span className="selected-option">
          {selectedCategoryObj?.name || "اختر فئة"}
        </span>
        <FiChevronDown className={`dropdown-icon ${isOpen ? "open" : ""}`} />
      </button>
      {isOpen && (
        <div className="dropdown-container" style={{ direction: "rtl" }}>
          <div className="dropdown-menu">
            <div className="menu-scroll-container">
              {isLoading ? (
                <div>جاري التحميل...</div>
              ) : (
                mainCategories.map((category) => {
                  const catImg = category.image
                    ? `https://back.al-balad.sa/albalad/v1.0/uploads/categories/images/${category.image}`
                    : null;
                  return (
                    <button
                      key={category.id}
                      className={`menu-item ${
                        selectedCategory === category.id ? "selected" : ""
                      }`}
                      onClick={() => handleSelect(category.id)}
                      onMouseEnter={() => setHoveredCategory(category.id)}
                      style={{ display: "flex", alignItems: "center", gap: 8 }}
                    >
                      {catImg ? (
                        <img
                          src={catImg}
                          alt={category.name}
                          style={{
                            width: 28,
                            height: 28,
                            borderRadius: "50%",
                            objectFit: "cover",
                            marginLeft: 6,
                            background: "#f7f7f7",
                            border: "1px solid #eee",
                          }}
                        />
                      ) : (
                        <span
                          style={{
                            width: 28,
                            height: 28,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            marginLeft: 6,
                            background: "#f7f7f7",
                            borderRadius: "50%",
                            border: "1px solid #eee",
                          }}
                        >
                          <FaThLarge size={18} color="#bbb" />
                        </span>
                      )}
                      <span>{category.name}</span>
                    </button>
                  );
                })
              )}
            </div>
          </div>
          {/* نافذة الفئات الفرعية */}
          {hoveredCategory && renderSubcategoriesPopup()}
        </div>
      )}
    </div>
  );
};

export default CategoryDropdown;
