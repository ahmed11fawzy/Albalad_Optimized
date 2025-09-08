import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const styles = `
.wishlist-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
  direction: rtl;
  font-family: Arial, sans-serif;
}

.wishlist-title {
  font-weight: bold;
  font-size: 24px;
  margin-bottom: 20px;
}

.wishlist-item {
  display: flex;
  align-items: flex-start;
  border-bottom: 1px solid #eee;
  padding: 16px 0;
  gap: 12px;
}

.wishlist-item img {
  width: 120px;
  height: 120px;
  border-radius: 8px;
  object-fit: cover;
  flex-shrink: 0;
}

.item-info {
  flex: 1;
}

.item-title {
  font-size: 14px;
  margin: 0 0 8px 0;
}

.item-meta {
  font-size: 14px;
  color: #555;
  margin-bottom: 6px;
}

.item-price {
  font-weight: bold;
  font-size: 16px;
  margin-bottom: 6px;
}

.item-old-price {
  color: #888;
  text-decoration: line-through;
  font-size: 14px;
  margin-right: 10px;
}

.item-shipping {
  font-size: 14px;
  color: green;
  margin-bottom: 6px;
}

.item-label {
  font-size: 12px;
  padding: 2px 6px;
  border-radius: 4px;
  margin-left: 4px;
}

.item-label.choice {
  background: #ffd700;
  color: #000;
}

.item-label.sale {
  background: #f33;
  color: #fff;
}

.item-detail-link {
  margin-top: 8px;
  font-size: 14px;
  color: #007bff;
  cursor: pointer;
}
`;

if (typeof document !== "undefined") {
  const style = document.createElement("style");
  style.innerText = styles;
  document.head.appendChild(style);
}

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const token = localStorage.getItem("user_token");
        const res = await fetch(
          "https://back.al-balad.sa/albalad/v1.0/favorites",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await res.json();
        console.log("🚀 ~ fetchWishlist ~ data:", data);
        if (data.status && Array.isArray(data.data)) {
          setWishlistItems(data.data);
        } else {
          setWishlistItems([]);
        }
      } catch (e) {
        setWishlistItems([]);
      }
    };
    fetchWishlist();
  }, []);
  return (
    <div className="container  container-under-header-fixed">
      <h2 className="wishlist-title">جميع المنتجات ({wishlistItems.length})</h2>
      {wishlistItems.map((item) => (
        <div
          key={item.id}
          className="wishlist-item"
          style={{ cursor: "pointer" }}
          onClick={() => navigate(`/product/${item.id}`)}
        >
          <img
            src={
              item.medias && item.medias.length > 0
                ? item.medias[0].file_name
                : null
            }
            alt={item.name}
          />
          <div className="item-info">
            <p className="item-title">{item.name}</p>
            <div className="item-meta">
              <span>{item.avg_rating || 0}⭐</span> |{" "}
              <span>تم بيع {item.sold || 0}</span>
            </div>
            <div className="item-price">
              {item.price} ر.س.
              {item.old_price > 0 && (
                <span className="item-old-price">{item.old_price} ر.س.</span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Wishlist;
