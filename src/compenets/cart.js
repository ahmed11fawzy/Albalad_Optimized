import React, { useState, useEffect } from "react";
import "../css/cart.css";
import {
  faTrash,
  faHeart,
  faSpinner,
  faCheckSquare,
  faSquare,
  faCreditCard,
  faShoppingCart,
} from "@fortawesome/free-solid-svg-icons";
import {
  faPaypal,
  faCcVisa,
  faCcMastercard,
  faCcApplePay,
  faCcAmazonPay,
} from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import { addOrUpdateCartItem } from "./cartApi";
import { LoginDialog } from "./Auth";

// نافذة تأكيد الحذف الاحترافية
function ConfirmDeleteModal({ open, onConfirm, onCancel }) {
  if (!open) return null;
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(0,0,0,0.18)",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 12,
          padding: "32px 24px",
          minWidth: 320,
          boxShadow: "0 4px 32px rgba(0,0,0,0.13)",
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontWeight: "bold",
            fontSize: "1.15rem",
            marginBottom: 18,
            color: "#a67c2e",
          }}
        >
          هل أنت متأكد أنك تريد حذف هذا المنتج من السلة؟
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: 16 }}>
          <button
            style={{
              background: "#e1251b",
              color: "#fff",
              border: "none",
              borderRadius: 6,
              padding: "8px 24px",
              fontWeight: "bold",
              cursor: "pointer",
            }}
            onClick={onConfirm}
          >
            نعم، حذف
          </button>
          <button
            style={{
              background: "#eee",
              color: "#222",
              border: "none",
              borderRadius: 6,
              padding: "8px 24px",
              fontWeight: "bold",
              cursor: "pointer",
            }}
            onClick={onCancel}
          >
            إلغاء
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Cart() {
  const [products, setProducts] = useState([]);
  const [selected, setSelected] = useState([]); // array of selected product ids
  const [loadingIds, setLoadingIds] = useState([]); // ids being added/removed
  const [loading, setLoading] = useState(true); // تحميل بيانات السلة
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [deleteId, setDeleteId] = useState(null); // id المنتج المراد حذفه
  const [deleting, setDeleting] = useState(false); // حالة الحذف
  const [deleteError, setDeleteError] = useState("");
  const [qtyLoadingIds, setQtyLoadingIds] = useState([]); // ids being updated for quantity
  const [loginOpen, setLoginOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // جلب بيانات السلة من الـ API
  useEffect(() => {
    const fetchCart = async () => {
      setLoading(true);
      setError(null);
      try {
        const userId = localStorage.getItem("user_id");
        let response;
        if (userId) {
          const token = localStorage.getItem("user_token");
          response = await fetch(
            "https://back.al-balad.sa/albalad/v1.0/carts",
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );
        } else {
          const sessionId = localStorage.getItem("session_id");
          response = await fetch(
            `https://back.al-balad.sa/albalad/v1.0/carts/${sessionId}`,
            {
              headers: { "Content-Type": "application/json" },
            }
          );

        }
        const data = await response.json();

        // استخراج المنتجات من الاستجابة
        if (data.status && Array.isArray(data.data) && data.data.length > 0) {
          // Flatten all items from all cart_stores
          const allItems = [];
          data.data.forEach((cart) => {
            cart.cart_stores?.forEach((store) => {
              store.items?.forEach((item) => {
                allItems.push({
                  id: item.id,
                  product_id:
                    item.product?.id || item.product_variant?.product?.id || "",
                  product_variant_id: item.product_variant?.id || "",
                  name:
                    item.product?.name ||
                    item.product_variant?.product?.name ||
                    "",
                  img:
                    item.product?.medias?.[0]?.file_name ||
                    item.product_variant?.product?.medias?.[0]?.file_name ||
                    item.product_variant?.image ||
                    "",
                  price: parseFloat(item.price),
                  oldPrice: item.product_variant?.product?.old_price
                    ? parseFloat(item.product_variant.product.old_price)
                    : parseFloat(item.price),
                  discount: item.discount || 0,
                  store:
                    item.product?.store?.name_ar ||
                    item.product?.store?.name_en ||
                    "",
                  variant: (() => {
                    if (
                      item.product_variant?.product_attributes &&
                      Array.isArray(item.product_variant.product_attributes)
                    ) {
                      const seen = new Set();
                      return item.product_variant.product_attributes
                        .filter((attrObj) => {
                          const key = attrObj.attribute_value?.attribute?.name;
                          if (!key || seen.has(key)) return false;
                          seen.add(key);
                          return true;
                        })
                        .map(
                          (attrObj) =>
                            `${attrObj.attribute_value?.attribute?.name || ""
                            }: ${attrObj.attribute_value?.value || ""}`
                        )
                        .join(" / ");
                    }
                    return "";
                  })(),
                  quantity: item.quantity,
                });
              });
            });
          });
          setProducts(allItems);
          localStorage.setItem("cart_items", JSON.stringify(allItems));
        } else {
          setProducts([]);
        }
      } catch (err) {
        setError("حدث خطأ أثناء جلب بيانات السلة");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, []);


  // Select all logic
  const allSelected =
    products.length > 0 && selected.length === products.length;
  const toggleSelectAll = () => {
    if (allSelected) setSelected([]);
    else setSelected(products.map((p) => p.id));
  };

  // Select single
  const toggleSelect = (id) => {
    setLoadingIds((ids) => [...ids, id]);
    setTimeout(() => {
      setSelected((sel) =>
        sel.includes(id) ? sel.filter((i) => i !== id) : [...sel, id]
      );
      setLoadingIds((ids) => ids.filter((i) => i !== id));
    }, 500);
  };

  // حذف المنتج من قاعدة البيانات
  const deleteProduct = async (id) => {
    setDeleting(true);
    setDeleteError("");
    try {
      const response = await fetch(
        `https://back.al-balad.sa/albalad/v1.0/carts/delete-item/${id}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );
      const data = await response.json();
      if (data.status) {
        setProducts((ps) => ps.filter((p) => p.id !== id));
        setSelected((sel) => sel.filter((i) => i !== id));
        setDeleteId(null);
      } else {
        setDeleteError("فشل حذف المنتج من السلة.");
      }
    } catch (err) {
      setDeleteError("حدث خطأ أثناء حذف المنتج.");
    } finally {
      setDeleting(false);
    }
  };

  // Add to favorite (placeholder)
  const addToFav = (id) => {
    alert("تمت الإضافة إلى المفضلة!");
  };

  // Change quantity
  const changeQty = async (id, qty) => {
    setProducts((ps) =>
      ps.map((p) => (p.id === id ? { ...p, quantity: qty < 1 ? 1 : qty } : p))
    );
    setQtyLoadingIds((ids) => [...ids, id]);
    const product = products.find((p) => p.id === id);
    if (!product) {
      setQtyLoadingIds((ids) => ids.filter((i) => i !== id));
      return;
    }
    await addOrUpdateCartItem({
      product_id: product.product_id,
      product_variant_id: product.product_variant_id,
      quantity: qty < 1 ? 1 : qty,
    });
    setQtyLoadingIds((ids) => ids.filter((i) => i !== id));
  };

  // Summary
  const selectedProducts = products.filter((p) => selected.includes(p.id));
  const total = selectedProducts.reduce(
    (sum, p) => sum + p.price * p.quantity,
    0
  );
  const oldTotal = selectedProducts.reduce(
    (sum, p) => sum + p.oldPrice * p.quantity,
    0
  );
  const discount = oldTotal - total;
  const shipping = selectedProducts.length > 0 ? 0 : 0;

  const userId = localStorage.getItem("user_id");
  const userToken = localStorage.getItem("user_token");

  return (
    <div className="cart-page-container container-under-header-fixed">
      {loading && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "200px",
          }}
        >
          <FontAwesomeIcon icon={faSpinner} spin size="2x" color="#a67c2e" />
        </div>
      )}
      {error && (
        <div
          style={{
            color: "#b71c1c",
            background: "#fff0f0",
            borderRadius: "8px",
            padding: "16px",
            textAlign: "center",
            fontWeight: "bold",
            margin: "16px 0",
          }}
        >
          {error}
        </div>
      )}
      {/* شاشة السلة الفارغة */}
      {!loading && products.length === 0 && (
        <div
          style={{
            width: "100%",
            minHeight: "70vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "#f7f7f7",
          }}
        >
          <FontAwesomeIcon
            icon={faShoppingCart}
            style={{ fontSize: 180, color: "#ddd", marginBottom: 18 }}
          />
          <div
            style={{
              fontWeight: "bold",
              fontSize: "1.15rem",
              marginBottom: 18,
              color: "#222",
            }}
          >
            عربة التسوق فارغة
          </div>
          {!userId || !userToken ? (
            <>
              <button
                style={{
                  background: "#e1251b",
                  color: "#fff",
                  border: "none",
                  borderRadius: 28,
                  padding: "16px 0",
                  width: 340,
                  fontWeight: "bold",
                  fontSize: "1.15rem",
                  marginBottom: 18,
                  cursor: "pointer",
                }}
                onClick={() => {
                  setLoginOpen(true);
                }}
              >
                تسجيل الدخول
              </button>
              <button
                style={{
                  background: "#ffe6e6",
                  color: "#e1251b",
                  border: "none",
                  borderRadius: 28,
                  padding: "16px 0",
                  width: 340,
                  fontWeight: "bold",
                  fontSize: "1.15rem",
                  marginBottom: 8,
                  cursor: "pointer",
                }}
                onClick={() => navigate("/")}
              >
                استكشف المنتجات
              </button>
            </>
          ) : (
            <button
              style={{
                background: "#ffe6e6",
                color: "#e1251b",
                border: "none",
                borderRadius: 28,
                padding: "16px 0",
                width: 340,
                fontWeight: "bold",
                fontSize: "1.15rem",
                marginBottom: 8,
                cursor: "pointer",
              }}
              onClick={() => navigate("/")}
            >
              استكشف المنتجات
            </button>
          )}
        </div>
      )}
      <LoginDialog open={loginOpen} onClose={() => setLoginOpen(false)} />
      {/* باقي الكود كما هو */}
      {!loading && !error && products.length > 0 && (
        <>
          <div className="cart-summary-section">
            <div className="cart-summary-title">الملخص</div>
            <div className="cart-summary-images">
              {selectedProducts.map((p, i) => (
                <img key={p.id} src={p.img} alt={p.name} />
              ))}
            </div>
            <div className="cart-summary-row cart-summary-oldprice">
              <span>{oldTotal ? oldTotal.toFixed(2) + " ر.س." : ""}</span>
            </div>
            <div className="cart-summary-row cart-summary-discount">
              {discount > 0 && <span>- {discount.toFixed(2)} ر.س.</span>}
            </div>
            <div className="cart-summary-row cart-summary-total">
              <span>{total.toFixed(2)} ر.س.</span>
            </div>
            <div className="cart-summary-row cart-summary-shipping">
              <span>الشحن</span>
              <span>
                {shipping === 0 ? "مجانا" : shipping.toFixed(2) + " ر.س."}
              </span>
            </div>
            <div className="cart-summary-row cart-summary-count">
              <span>عدد المنتجات</span>
              <span>{selectedProducts.length}</span>
            </div>
            <button
              className="cart-summary-checkout"
              disabled={selectedProducts.length === 0}
              onClick={async () => {
                if (userId && userToken) {
                  navigate("/payment", { state: { selectedProducts } });
                } else {
                  setLoginOpen(true);
                }
              }}
            >
              إكمال طلب ({selectedProducts.length})
            </button>
            <div className="cart-summary-payments">
              <FontAwesomeIcon icon={faCreditCard} className="payment-icon" />
              <FontAwesomeIcon icon={faPaypal} className="payment-icon" />
              <FontAwesomeIcon icon={faCcVisa} className="payment-icon" />
              <FontAwesomeIcon icon={faCcMastercard} className="payment-icon" />
              <FontAwesomeIcon icon={faCcApplePay} className="payment-icon" />
              <FontAwesomeIcon icon={faCcAmazonPay} className="payment-icon" />
            </div>
          </div>
          <div className="cart-products-section">
            <div className="cart-products-header">
              <button className="cart-selectall-btn" onClick={toggleSelectAll}>
                <FontAwesomeIcon
                  icon={allSelected ? faCheckSquare : faSquare}
                />{" "}
                تحديد الكل
              </button>
            </div>
            {products.map((p) => (
              <div
                className={`cart-product-row${selected.includes(p.id) ? " selected" : ""
                  }`}
                key={p.id}
              >
                <div className="cart-product-1st-row">
                  <button
                    className="cart-product-select"
                    onClick={() => toggleSelect(p.id)}
                  >
                    {loadingIds.includes(p.id) ? (
                      <FontAwesomeIcon icon={faSpinner} spin />
                    ) : (
                      <FontAwesomeIcon
                        icon={
                          selected.includes(p.id) ? faCheckSquare : faSquare
                        }
                      />
                    )}
                  </button>
                  <img className="cart-product-img" src={p.img} alt={p.name} />
                  <div className="cart-product-info">
                    <p className="cart-product-name">{p.name}</p>
                    <div className="cart-product-variant">{p.variant}</div>
                    <div className="cart-product-store">{p.store}</div>
                  </div>
                </div>
                <div className="cart-product-2nd-row">
                  <div className="cart-product-price">
                    <span className="cart-product-price-current">
                      {p.price.toFixed(2)} ر.س.
                    </span>
                    <span className="cart-product-price-old">
                      {p.oldPrice.toFixed(2)} ر.س.
                    </span>
                  </div>
                  <div className="cart-product-qty">
                    {qtyLoadingIds.includes(p.id) ? (
                      <FontAwesomeIcon
                        icon={faSpinner}
                        spin
                        style={{ color: "#a67c2e", fontSize: 18 }}
                      />
                    ) : (
                      <>
                        <button onClick={() => changeQty(p.id, p.quantity - 1)}>
                          -
                        </button>
                        <input
                          type="number"
                          value={p.quantity}
                          min={1}
                          onChange={(e) =>
                            changeQty(p.id, parseInt(e.target.value) || 1)
                          }
                        />
                        <button onClick={() => changeQty(p.id, p.quantity + 1)}>
                          +
                        </button>
                      </>
                    )}
                  </div>
                  <button
                    className="cart-product-fav"
                    onClick={() => addToFav(p.id)}
                  >
                    <FontAwesomeIcon icon={faHeart} />
                  </button>
                  <button
                    className="cart-product-delete"
                    onClick={() => setDeleteId(p.id)}
                    disabled={deleting && deleteId === p.id}
                  >
                    {deleting && deleteId === p.id ? (
                      <FontAwesomeIcon icon={faSpinner} spin />
                    ) : (
                      <FontAwesomeIcon icon={faTrash} />
                    )}
                  </button>
                </div>
              </div>
            ))}
            {/* نافذة تأكيد الحذف */}
            <ConfirmDeleteModal
              open={!!deleteId}
              onConfirm={() => deleteProduct(deleteId)}
              onCancel={() => {
                setDeleteId(null);
                setDeleteError("");
              }}
            />
            {deleteError && (
              <div
                style={{
                  color: "#b71c1c",
                  background: "#fff0f0",
                  borderRadius: "8px",
                  padding: "12px",
                  textAlign: "center",
                  fontWeight: "bold",
                  margin: "12px 0",
                }}
              >
                {deleteError}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
