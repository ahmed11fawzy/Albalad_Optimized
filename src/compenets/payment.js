import React, { useState, useEffect } from "react";
import "../css/payment.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faCreditCard,
  faMapMarkerAlt,
  faCheckCircle,
  faQuestionCircle,
  faTag,
  faSpinner,
  faShoppingBag,
} from "@fortawesome/free-solid-svg-icons";
import {
  faCcVisa,
  faCcMastercard,
  faCcApplePay,
} from "@fortawesome/free-brands-svg-icons";
import AddNewAddressDialog from "./addnewAddressDialog";
import { useLocation, useNavigate } from "react-router-dom";
import { addOrUpdateCartItem } from "./cartApi";
import CustomerAddresses from "./CustomerAddresses";
import {
  useGetPayForOrderQuery,
  useGetShippingMethodsMutation,
} from "../redux/Slices/payment";

export default function Payment() {
  const navigate = useNavigate();
  const location = useLocation();
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [selectedMethod, setSelectedMethod] = useState(null);

  const [loadingMethods, setLoadingMethods] = useState(true);
  const [products, setProducts] = useState(() => {
    if (location.state && Array.isArray(location.state?.selectedProducts)) {
      if (location.state?.selectedProducts.length > 0) {
        return location.state?.selectedProducts;
      } else if (location.state) {
        return location.state?.product;
      } else {
        return location.state;
      }
    }
    return location.state;
  });

  console.log("products", location.state);
  /* console.log("productId", location.state?.selectedProducts[0].id); */
  const [addressDialogOpen, setAddressDialogOpen] = useState(false);
  const [shippingMethods, setShippingMethods] = useState([]);
  console.log("🚀 ~ Payment ~ shippingMethods:", shippingMethods);
  const [selectedShipping, setSelectedShipping] = useState(null);
  console.log("🚀 ~ Payment ~ selectedShipping:", selectedShipping);
  const [loadingShipping, setLoadingShipping] = useState(true);
  const [qtyLoadingIds, setQtyLoadingIds] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  console.log("🚀 ~ Payment ~ selectedAddress:", selectedAddress);
  const [requireAddressCheck, setRequireAddressCheck] = useState(null);
  const [discount, setDiscount] = useState(19.55);
  const [shipping, setShipping] = useState(0);
  const [coupon, setCoupon] = useState("");
  const [addressRefreshTrigger, setAddressRefreshTrigger] = useState(0);
  const [addressError, setAddressError] = useState("");
  const [showAddressSelectError, setShowAddressSelectError] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [isDefaultAddress, setIsDefaultAddress] = useState(false);
  const [validationErrors, setValidationErrors] = useState({
    address: false,
    payment: false,
    shipping: false,
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [topMessage, setTopMessage] = useState(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [getShippingMethods, { isLoading: loadingShippingMethods }] =
    useGetShippingMethodsMutation(); // [getShippingMethods]

  useEffect(() => {
    const fetchShippingMethods = async () => {
      try {
        const response = await getShippingMethods({
          customer_addresse_id: selectedAddress.id,
          user_id: localStorage.getItem("user_id"),
        }).unwrap();
        console.log("🚀 ~ fetchShippingMethods ~ response:", response);
        setShippingMethods(response.data.shipping_methods || []);
      } catch (error) {
        console.error("Failed to fetch shipping methods:", error);
        setShippingMethods([]); // Fallback to empty array or handle error as needed
      }
    };

    fetchShippingMethods();
  }, [selectedAddress, getShippingMethods, setShippingMethods]);

  useEffect(() => {
    if (location.state?.product) {
      setQuantity(location.state.product.quantity);
    }
  }, []);

  const total = location.state.product?.quantity
    ? location?.state?.product?.price * quantity
    : products?.reduce((sum, p) => sum + p.price * p.quantity, 0);
  const finalTotal = total - discount + shipping;
  console.log("total", total);
  console.log("finalTotal", finalTotal);
  console.log("products", Array.isArray(products));

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

  const setDefaultAddress = async (addressId) => {
    console.log("🚀 ~ setDefaultAddress ~ addressId:", addressId);
    try {
      const userToken = localStorage.getItem("user_token");
      if (!userToken) {
        console.error("No user token found");
        return;
      }

      const response = await fetch(
        `https://back.al-balad.sa/albalad/v1.0/customer/customer-addresses/default/${addressId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${userToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      if (data.status) {
        // ('Address set as default successfully'); // Removed unused expression
      } else {
        console.error("Failed to set default address:", data.message);
      }
    } catch (error) {
      console.error("Error setting default address:", error);
    }
  };

  const handleSaveAddress = async (data) => {
    setSelectedAddress(data);
    console.log("🚀 ~ handleSaveAddress ~ data:", data);
    console.log("🚀 ~ handleSaveAddress ~ selected address:", selectedAddress);
    if (isDefaultAddress) {
      setDefaultAddress(data.id);
    }
    const response = await getShippingMethods({
      customer_addresse_id: data.id,
      user_id: localStorage.getItem("user_id"),
    }).unwrap();
    console.log("🚀 ~ handleSaveAddress ~ response:", response);
    setShippingMethods(response.data.shipping_methods || []);
  };

  useEffect(() => {
    const fetchMethods = async () => {
      setLoadingMethods(true);
      try {
        const userToken = localStorage.getItem("user_token");
        const headers = {};
        if (userToken) headers["Authorization"] = `Bearer ${userToken}`;
        const res = await fetch(
          "https://back.al-balad.sa/albalad/v1.0/payment-methods",
          {
            headers,
          }
        );
        const data = await res.json();
        // ('بيانات طرق الدفع من API:', data); // Removed unused expression
        if (data.status && Array.isArray(data.data)) {
          setPaymentMethods(data.data);
          if (data.data.length > 0) setSelectedMethod(data.data[0].id);
        } else {
          setPaymentMethods([]);
        }
      } catch (err) {
        setPaymentMethods([]);
      } finally {
        setLoadingMethods(false);
      }
    };
    fetchMethods();
  }, []);

  useEffect(() => {
    const fetchShipping = async () => {
      setLoadingShipping(true);
      try {
        const res = await fetch(
          "https://back.al-balad.sa/albalad/v1.0/shipping-methods"
        );
        const data = await res.json();
        if (data.status && Array.isArray(data.data)) {
          setShippingMethods(data.data);
          if (data.data.length > 0) setSelectedShipping(data.data[0].id);
        } else {
          setShippingMethods([]);
        }
      } catch (err) {
        setShippingMethods([]);
      } finally {
        setLoadingShipping(false);
      }
    };
    fetchShipping();
  }, []);

  const handleCheckout = () => {
    if (!selectedAddress) {
      setShowAddressSelectError(true);
      return;
    }
    setShowAddressSelectError(false);
    setAddressError("");
    // ... existing checkout logic ...
  };

  useEffect(() => {
    if (selectedAddress) setAddressError("");
  }, [selectedAddress]);

  useEffect(() => {
    if (selectedAddress) setShowAddressSelectError(false);
  }, [selectedAddress]);

  // Function to validate selections
  const validateSelections = () => {
    const errors = {
      address: !selectedAddress,
      payment: !selectedMethod,
      shipping: !selectedShipping,
    };
    setValidationErrors(errors);
    return !Object.values(errors).some((error) => error);
  };

  // Function to show top message
  const showMessage = (message, type = "error") => {
    setTopMessage({ text: message, type });
    setTimeout(() => setTopMessage(null), 3000);
  };

  // Function to handle API calls
  const handleApiCall = async (url, data) => {
    const userId = localStorage.getItem("user_id");
    const userToken = localStorage.getItem("user_token");

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify({ ...data, user_id: userId }),
      });

      const result = await response.json();
      if (!result.status) {
        throw new Error(result.message || "حدث خطأ في العملية");
      }
      return result;
    } catch (error) {
      console.error(`Error in API call to ${url}:`, error);
      throw error;
    }
  };

  // Function to handle order completion
  const handleCompleteOrder = async () => {
    // Validate selections
    if (!validateSelections()) {
      showMessage(
        "يرجى التأكد من اختيار جميع المتطلبات (العنوان، طريقة الدفع، طريقة الشحن)"
      );
      return;
    }

    setIsProcessing(true);
    setIsSubmitting(true);
    try {
      // Add address
      await handleApiCall(
        "https://back.al-balad.sa/albalad/v1.0/carts/add-address",
        {
          customer_addresse_id: selectedAddress.id,
        }
      );

      // Add payment method
      await handleApiCall(
        "https://back.al-balad.sa/albalad/v1.0/carts/add-payment-method",
        {
          payment_method_id: selectedMethod,
        }
      );

      // Add shipping method
      await handleApiCall(
        "https://back.al-balad.sa/albalad/v1.0/carts/add-shipping-method",
        {
          shipping_method_id: selectedShipping,
        }
      );

      // Add currency (always set to 1)
      await handleApiCall(
        "https://back.al-balad.sa/albalad/v1.0/carts/add-currency",
        {
          currency_id: 1,
        }
      );

      // Submit final order
      const userToken = localStorage.getItem("user_token");
      const response = await fetch(
        "https://back.al-balad.sa/albalad/v1.0/customer/orders/store",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${userToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      const result = await response.json();
      console.log("Order submission result:", result);
      if (result.status) {
        setShowSuccessMessage(true);
      } else {
        throw new Error(result.message || "فشل في إرسال الطلب");
      }
    } catch (error) {
      showMessage("حدث خطأ أثناء إتمام العملية");
      console.error("Error:", error);
    } finally {
      setIsProcessing(false);
      setIsSubmitting(false);
    }
  };

  const handleReturnToShopping = () => {
    navigate("/");
  };

  return (
    <div className="container mt-28">
      {/* Loading Overlay */}
      {isSubmitting && (
        <div className="loading-overlay">
          <div className="loading-content">
            <FontAwesomeIcon icon={faSpinner} spin size="3x" />
            <p>جاري إرسال طلبك...</p>
          </div>
        </div>
      )}

      {showSuccessMessage && (
        <div className="order-success-overlay">
          <div className="order-success-dialog">
            <div className="order-success-icon">
              <FontAwesomeIcon icon={faCheckCircle} />
            </div>
            <h2>تم إرسال طلبك بنجاح</h2>
            <p>شكراً لك على الطلب! سنقوم بمعالجته في أقرب وقت ممكن.</p>
            <button
              className="return-to-shopping-btn"
              onClick={handleReturnToShopping}
            >
              <FontAwesomeIcon icon={faShoppingBag} />
              العودة للتسوق
            </button>
          </div>
        </div>
      )}

      <div className="payment-page-container">
        {/* Top Message */}
        {topMessage && (
          <div className={`top-message ${topMessage.type}-message`}>
            {topMessage.text}
          </div>
        )}

        {/* Right: Summary */}
        <div className="payment-summary-section">
          <div className="payment-summary-title">الملخص</div>
          <div className="payment-summary-row">
            <span>إجمالي الطلب</span>
            <span>{total.toFixed(2)} ر.س.</span>
          </div>
          <div className="payment-summary-row payment-summary-discount">
            <span>
              تم التوفير{" "}
              <FontAwesomeIcon
                icon={faCheckCircle}
                className="payment-discount-icon"
              />
            </span>
            <span>-{discount.toFixed(2)} ر.س.</span>
          </div>
          <div className="payment-summary-row payment-summary-coupon">
            <span>كود العرض الترويجي</span>
            <span>
              <input
                className="payment-coupon-input"
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
                placeholder="ادخل الرمز هنا"
              />
            </span>
          </div>
          <div className="payment-summary-row">
            <span>تكلفة الشحن</span>
            <span>
              {shipping === 0 ? "مجاني" : shipping.toFixed(2) + " ر.س."}
            </span>
          </div>
          <div className="payment-summary-total-row">
            <span>الإجمالي</span>
            <span>{finalTotal.toFixed(2)} ر.س.</span>
          </div>
          <button
            className="payment-summary-checkout"
            onClick={handleCompleteOrder}
          >
            إكمال الطلب
          </button>
          <div className="payment-summary-note">
            بالنقر فوق "إكمال الطلب"، فإنك تؤكد أنك قرأت ووافقت على{" "}
            <a href="#">الأحكام والسياسات</a>
          </div>
        </div>
        {/* Left: Address, Payment, Products */}
        <div className="payment-details-section">
          {addressError && (
            <div
              style={{
                color: "#b71c1c",
                background: "#fff0f0",
                borderRadius: 8,
                padding: "10px 18px",
                textAlign: "center",
                fontWeight: "bold",
                margin: "10px 0",
              }}
            >
              {addressError}
            </div>
          )}
          <div className="payment-address-section">
            <div className="payment-address-title">عنوان التسليم</div>
            <div className="payment-address-row">
              <FontAwesomeIcon
                icon={faMapMarkerAlt}
                className="payment-address-icon"
              />
              <span>{selectedAddress?.address}</span>
              <button
                className="payment-add-address-btn"
                onClick={() => setAddressDialogOpen(true)}
              >
                <FontAwesomeIcon icon={faPlus} /> إضافة عنوان جديد
              </button>
            </div>
          </div>
          <div className="payment-methods-section">
            <div className="payment-methods-title">طرق السداد</div>
            {loadingMethods ? (
              <div style={{ textAlign: "center", margin: "12px 0" }}>
                <span
                  style={{ display: "inline-block", width: 28, height: 28 }}
                >
                  <FontAwesomeIcon
                    icon={faSpinner}
                    spin
                    size="lg"
                    color="#a67c2e"
                  />
                </span>
              </div>
            ) : paymentMethods.length === 0 ? (
              <div
                style={{
                  color: "#b71c1c",
                  background: "#fff0f0",
                  borderRadius: "8px",
                  padding: "10px",
                  textAlign: "center",
                  fontWeight: "bold",
                  margin: "10px 0",
                }}
              >
                لا توجد طرق دفع متاحة حالياً
              </div>
            ) : (
              paymentMethods.map((method) => (
                <label
                  key={method.id}
                  className={`payment-method-row${
                    selectedMethod === method.id ? " selected" : ""
                  }`}
                  style={{
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                  }}
                >
                  <input
                    type="radio"
                    name="payment-method"
                    checked={selectedMethod === method.id}
                    onChange={() => {
                      setSelectedMethod(method.id);
                      // ('تم اختيار طريقة الدفع:', method); // Removed unused expression
                    }}
                    style={{
                      accentColor: "#e53935",
                      width: 18,
                      height: 18,
                      marginLeft: 8,
                    }}
                  />
                  <img
                    src={method.image}
                    alt={method.name}
                    className="payment-method-icon"
                    style={{
                      width: 38,
                      height: 38,
                      objectFit: "contain",
                      marginLeft: 12,
                      borderRadius: 8,
                      background: "#fff",
                    }}
                  />
                  <span>{method.name}</span>
                </label>
              ))
            )}
          </div>
          <div className="payment-shipping-section">
            <div className="payment-shipping-title">طريقة الشحن</div>
            {loadingShipping ? (
              <div style={{ textAlign: "center", margin: "12px 0" }}>
                <span
                  style={{ display: "inline-block", width: 28, height: 28 }}
                >
                  <FontAwesomeIcon
                    icon={faSpinner}
                    spin
                    size="lg"
                    color="#a67c2e"
                  />
                </span>
              </div>
            ) : shippingMethods.length === 0 ? (
              <div
                style={{
                  color: "#b71c1c",
                  background: "#fff0f0",
                  borderRadius: "8px",
                  padding: "10px",
                  textAlign: "center",
                  fontWeight: "bold",
                  margin: "10px 0",
                }}
              >
                لا توجد طرق شحن متاحة حالياً
              </div>
            ) : (
              shippingMethods.map((method) => (
                <label
                  key={method.id}
                  className={`payment-method-row${
                    selectedShipping === method.id ? " selected" : ""
                  }`}
                  style={{
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                  }}
                >
                  <input
                    type="radio"
                    name="shipping-method"
                    checked={selectedShipping === method.id}
                    onChange={() => setSelectedShipping(method.id)}
                    style={{
                      accentColor: "#e53935",
                      width: 18,
                      height: 18,
                      marginLeft: 8,
                    }}
                  />
                  <img
                    src={method.image}
                    alt={method.name}
                    className="payment-method-icon"
                    style={{
                      width: 38,
                      height: 38,
                      objectFit: "contain",
                      marginLeft: 12,
                      borderRadius: 8,
                      background: "#fff",
                    }}
                  />
                  <span>{method.name}</span>
                </label>
              ))
            )}
          </div>
          <div className="payment-products-section">
            <div className="payment-products-title">تفاصيل المنتجات</div>
            <div className="payment-products-list">
              {Array.isArray(products) ? (
                location.state.selectedProducts.map((p) => (
                  <div className="payment-product-row" key={p.id}>
                    <img
                      src={p.img}
                      alt={p.name}
                      className="payment-product-img"
                    />
                    <div className="payment-product-info">
                      <div className="payment-product-name">{p.name}</div>
                    </div>
                    <div className="payment-product-qty">
                      {qtyLoadingIds.includes(p.id) ? (
                        <FontAwesomeIcon
                          icon={faSpinner}
                          spin
                          style={{ color: "#a67c2e", fontSize: 18 }}
                        />
                      ) : (
                        <>
                          <button
                            onClick={() => changeQty(p.id, p.quantity - 1)}
                          >
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
                          <button
                            onClick={() => changeQty(p.id, p.quantity + 1)}
                          >
                            +
                          </button>
                        </>
                      )}
                    </div>
                    <div className="payment-product-price">
                      {(p.price * p.quantity).toFixed(2)} ر.س.
                    </div>
                  </div>
                ))
              ) : (
                <div className="payment-product-row">
                  {/* <img src={location.state?.product?.medias[0].file_name} alt={location.state?.product?.name} className="payment-product-img" /> */}
                  <div className="payment-product-info">
                    <div className="payment-product-name">
                      {location.state?.product?.name}
                    </div>
                  </div>
                  <div className="payment-product-qty">
                    <button
                      onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                    >
                      -
                    </button>
                    <input type="number" value={quantity} min={1} />
                    <button onClick={() => setQuantity(quantity + 1)}>+</button>
                  </div>
                  <div className="payment-product-price">
                    {finalTotal.toFixed(2)} ر.س.
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <AddNewAddressDialog
          open={addressDialogOpen}
          onClose={() => {
            setAddressDialogOpen(false);
            setAddressRefreshTrigger((t) => t + 1);
          }}
          onSave={handleSaveAddress}
        />
        <CustomerAddresses
          onSelect={setSelectedAddress}
          selectedAddressId={selectedAddress?.id}
          onRequireSelect={setRequireAddressCheck}
          refreshTrigger={addressRefreshTrigger}
          showSelectError={showAddressSelectError}
          onDefaultChange={setIsDefaultAddress}
        />
      </div>
    </div>
  );
}
