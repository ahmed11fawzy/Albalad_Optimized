import React, { useState, useEffect } from "react";
import "./trackingOrders.css";

const tabs = [
  "كل الطلبات",
  "قيد الانتظار",
  "قيد التجهيز",
  "تم الشحن",
  "تم الاستلام (تم التوصيل)",
  "مرتجع",
  "ملغي",
];

// دالة ترجمة حالات الطلب
const translateOrderStatus = (status) => {
  const statusMap = {
    pending: "قيد الانتظار",
    confirmed: "قيد التجهيز",
    shipped: "تم الشحن",
    delivered: "تم التوصيل",
    refunded: "مرتجع",
    cancelled: "ملغي",
  };
  return statusMap[status] || status;
};

export default function OrderTracking() {
  const [selectedTab, setSelectedTab] = useState("كل الطلبات");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("user_token");
        let url = "https://back.al-balad.sa/albalad/v1.0/customer/orders";

        // تحديد API حسب التصنيف المختار
        switch (selectedTab) {
          case "قيد الانتظار":
            url =
              "https://back.al-balad.sa/albalad/v1.0/customer/orders/pending";
            break;
          case "قيد التجهيز":
            url =
              "https://back.al-balad.sa/albalad/v1.0/customer/orders/confirmed";
            break;
          case "تم الشحن":
            url =
              "https://back.al-balad.sa/albalad/v1.0/customer/orders/shipped";
            break;
          case "تم الاستلام (تم التوصيل)":
            url =
              "https://back.al-balad.sa/albalad/v1.0/customer/orders/delivered";
            break;
          case "ملغي":
            url =
              "https://back.al-balad.sa/albalad/v1.0/customer/orders/cancelled";
            break;
          case "مرتجع":
            url = "https://back.al-balad.sa/albalad/v1.0/customer/refunds";
            break;
          default:
            url = "https://back.al-balad.sa/albalad/v1.0/customer/orders";
        }

        const res = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (data && data.status && Array.isArray(data.data)) {
          setOrders(data.data);
        } else {
          setOrders([]);
        }
      } catch (err) {
        setError("حدث خطأ أثناء جلب الطلبات");
        setOrders([]);
      }
      setLoading(false);
    };
    fetchOrders();
  }, [selectedTab]);

  if (selectedOrder) {
    return (
      <div className="container mt-28">
        <button className="back-button" onClick={() => setSelectedOrder(null)}>
          ◀ العودة إلى الطلبات
        </button>

        <h2 className="heading">تفاصيل الطلب</h2>

        <div className="card">
          <p>
            <strong>رقم الطلب:</strong> #{selectedOrder.id}
          </p>
          <p>
            <strong>تاريخ الطلب:</strong>{" "}
            {new Date(selectedOrder.created_at).toLocaleDateString("ar-EG")}
          </p>
          <p>
            <strong>حالة الطلب:</strong>{" "}
            <span className="status-text">
              {translateOrderStatus(selectedOrder.status)}
            </span>
          </p>
          <p>
            <strong>المبلغ الإجمالي:</strong> {selectedOrder.total}{" "}
            {selectedOrder.currency?.code}
          </p>
        </div>

        <div className="card">
          <p>
            <strong>طريقة الدفع:</strong> {selectedOrder.payment_method?.name}
          </p>
          <p>
            <strong>طريقة الشحن:</strong> {selectedOrder.shipping_method?.name}
          </p>
          <p>
            <strong>عنوان التوصيل:</strong>{" "}
            {selectedOrder.customer_addresse?.address}
          </p>
        </div>

        <div className="card">
          <h3 className="subheading">المتاجر والمنتجات</h3>
          {selectedOrder.order_store?.map((storeOrder, index) => (
            <div key={index} className="store-order">
              <p>
                <strong>المتجر:</strong> {storeOrder.store?.name_ar}
              </p>
              <p>
                <strong>حالة الطلب:</strong>{" "}
                {translateOrderStatus(storeOrder.status)}
              </p>
              <p>
                <strong>المبلغ:</strong> {storeOrder.total}{" "}
                {selectedOrder.currency?.code}
              </p>

              {/* عرض المنتجات */}
              <div className="order-items">
                <h4>المنتجات:</h4>
                {storeOrder.items?.map((item, itemIndex) => (
                  <div key={itemIndex} className="order-item">
                    <div className="item-image">
                      <img
                        src={
                          item.product?.medias?.[0]?.file_name ||
                          "/placeholder.jpg"
                        }
                        alt={item.product?.name}
                        onError={(e) => (e.target.src = "/placeholder.jpg")}
                      />
                    </div>
                    <div className="item-details">
                      <p>
                        <strong>اسم المنتج:</strong> {item.product?.name}
                      </p>
                      <p>
                        <strong>السعر:</strong> {item.price}{" "}
                        {selectedOrder.currency?.code}
                      </p>
                      <p>
                        <strong>الكمية:</strong> {item.quantity}
                      </p>
                      <p>
                        <strong>المجموع:</strong> {item.total}{" "}
                        {selectedOrder.currency?.code}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-28">
      <h2 className="heading">طلباتي</h2>

      <div className="tabs">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setSelectedTab(tab)}
            className={`tab ${selectedTab === tab ? "active-tab" : ""}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="loading">جاري تحميل الطلبات...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : (
        <div className="orders-grid">
          {orders.map((order) => (
            <div
              key={order.id}
              onClick={() => setSelectedOrder(order)}
              className="order-card"
            >
              <div className="order-header">
                <div>
                  <p>
                    <strong>رقم الطلب:</strong> #{order.id}
                  </p>
                  <p>
                    <strong>تاريخ:</strong>{" "}
                    {new Date(order.created_at).toLocaleDateString("ar-EG")}
                  </p>
                  <p>
                    <strong>المبلغ:</strong> {order.total}{" "}
                    {order.currency?.code}
                  </p>
                </div>
                <div>
                  <span className="order-status">
                    {translateOrderStatus(order.status)}
                  </span>
                </div>
              </div>

              {/* عرض المنتجات في البطاقة */}
              <div className="order-items-preview">
                {order.order_store?.map((storeOrder, storeIndex) =>
                  storeOrder.items?.slice(0, 3).map((item, itemIndex) => (
                    <div
                      key={`${storeIndex}-${itemIndex}`}
                      className="order-item-preview"
                    >
                      <img
                        src={
                          item.product?.medias?.[0]?.file_name ||
                          "/placeholder.jpg"
                        }
                        alt={item.product?.name}
                        onError={(e) => (e.target.src = "/placeholder.jpg")}
                      />
                      <span className="item-name">{item.product?.name}</span>
                      <span className="item-quantity">×{item.quantity}</span>
                    </div>
                  ))
                )}
                {order.order_store?.[0]?.items?.length > 3 && (
                  <div className="more-items">
                    +{order.order_store[0].items.length - 3} منتجات أخرى
                  </div>
                )}
              </div>
            </div>
          ))}
          {orders.length === 0 && <p>لا توجد طلبات في هذا التصنيف.</p>}
        </div>
      )}
    </div>
  );
}
