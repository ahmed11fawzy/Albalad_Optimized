import React, { useEffect, useState } from "react";
import "./subCategory.css";
import { useParams, useNavigate } from "react-router-dom";
import { FaThLarge } from "react-icons/fa";

const SubCategory = () => {
  const { id } = useParams();
  const [categoryData, setCategoryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(`https://back.al-balad.sa/albalad/v1.0/categories/show/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setCategoryData(data.data);
      })
      .catch(() => setCategoryData(null))
      .finally(() => setLoading(false));
  }, [id]);

  // دالة recursive لجمع كل المنتجات من الفئة الرئيسية وكل الفروع مهما كان العمق
  function collectAllProducts(category) {
    let products = [];
    if (category?.products && Array.isArray(category.products)) {
      products = products.concat(category.products);
    }
    if (category?.children_all && Array.isArray(category.children_all)) {
      category.children_all.forEach((child) => {
        products = products.concat(collectAllProducts(child));
      });
    }
    return products;
  }

  const allProducts = categoryData ? collectAllProducts(categoryData) : [];

  // Loader احترافي لدوران دائرتين داخل مربع
  const CustomLoader = () => (
    <div className="subcategory-loader-overlay">
      <div className="subcategory-loader-box">
        <span className="loader-dot loader-dot-red"></span>
        <span className="loader-dot loader-dot-black"></span>
      </div>
    </div>
  );

  return (
    <div className="subcategory-page container-under-header-fixed2">
      <h2 className="subcategory-title">{categoryData?.name || ""}</h2>
      <div className="subcategory-grid">
        {(categoryData?.children_all || []).map((cat, idx) => (
          <div
            className="subcategory-card"
            key={cat.id}
            onClick={() => navigate(`/category/${cat.id}`)}
          >
            <div className="subcategory-img-wrapper">
              {cat.image ? (
                <img
                  src={`${cat.image}`}
                  alt={cat.name}
                  className="subcategory-img"
                />
              ) : (
                <span className="subcategory-img subcategory-img-placeholder">
                  <FaThLarge size={38} color="#bbb" />
                </span>
              )}
            </div>
            <div className="subcategory-name">{cat.name}</div>
          </div>
        ))}
      </div>

      {/* المنتجات */}
      <h2 className="section-title" style={{ marginTop: 40 }}>
        تسوق أكثر
      </h2>
      {loading ? (
        <>
          <CustomLoader />
        </>
      ) : (
        <div className="more-loves-products-container">
          {allProducts.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                color: "#888",
                margin: "32px auto",
              }}
            >
              لا توجد منتجات متاحة لهذه الفئة حالياً.
            </div>
          ) : (
            allProducts.map((product) => (
              <div
                className="product-crad"
                key={product.id}
                onClick={() =>
                  navigate(`/product/${product.id}`, { state: { product } })
                }
              >
                <div className="product-image">
                  <img
                    src={product.medias?.[0]?.file_name || null}
                    alt={product.name}
                  />
                </div>
                <div className="product-info-class">
                  <p className="product-description" title={product.name}>
                    {product.name}
                  </p>
                  <p className="review-box">
                    <span className="product-stars-icon">
                      {/* نجوم التقييم */}
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className="product-start-icon">
                          ★
                        </span>
                      ))}
                    </span>
                    <span className="product-slod-count">1000 مباعة</span>
                  </p>
                  <p className="price-box">
                    <span className="product-price">{product.price} ر.س</span>
                    {product.old_price > 0 && (
                      <span className="product-fac-price">
                        <s>{product.old_price}</s>
                      </span>
                    )}
                  </p>
                  <div className="product-offers-class">
                    <p className="product-offer-box">
                      <span className="product-is-welcome-offer">
                        {" "}
                        عرض الترحيب{" "}
                      </span>
                      <span className="product-is-add-discount">
                        {" "}
                        خصم اضافي {product.add_discount || 0}% مع العملات
                      </span>
                      <span className="product-discount">
                        {" "}
                        {product.discount_precent || 0}%
                      </span>
                    </p>
                  </div>
                  <div className="product-type-class">
                    <button className="package-offer-btn">عرض الحزمة</button>
                  </div>
                  <div className="product-free-shipping-class">
                    <p className="free-shipping-box">
                      <span className="choice-card">choice</span> شحن مجاني
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default SubCategory;
