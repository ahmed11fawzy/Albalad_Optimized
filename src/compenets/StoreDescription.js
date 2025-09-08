import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./storeDescription.css";

export default function StoreDescription({ store }) {
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleFollow = async () => {
    if (!store?.id) return;
    setLoading(true);
    try {
      const token = localStorage.getItem("user_token");
      const res = await fetch(
        `https://back.al-balad.sa/albalad/v1.0/followers/follower/${store.id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      if (data.status) {
        setIsFollowing((prev) => !prev);
      }
    } catch (e) {
      // يمكن إضافة رسالة خطأ هنا
    } finally {
      setLoading(false);
    }
  };

  const handleProfileClick = () => {
    if (store?.id) {
      navigate(`/store-profile/${store.id}`);
    }
  };

  return (
    <div className="store-description-section">
      <div
        className="store-description-info pointer"
        onClick={handleProfileClick}
      >
        <img
          className="store-desc-img"
          src={store?.logo}
          alt={store?.name_ar}
        />
        <div className="store-desc-text">
          <div className="store-desc-name">{store?.name_ar}</div>
          <div className="store-desc-meta">
            <span className="store-desc-rating">% تقييم إيجابي</span>
            <span className="store-desc-sep">|</span>
            <span className="store-desc-followers">1.5K متابعون</span>
          </div>
        </div>
      </div>
      <div className="store-description-actions">
        <button
          className={`store-desc-btn follow-btn${
            isFollowing ? " unfollow-btn" : ""
          }`}
          onClick={handleFollow}
          disabled={loading}
        >
          {loading ? (
            <span className="loader-circle"></span>
          ) : isFollowing ? (
            "إلغاء المتابعة"
          ) : (
            "+ المتابعة"
          )}
        </button>
        <button className="store-desc-btn message-btn">
          رسالة <span className="msg-icon">&#8942;</span>
        </button>
      </div>
    </div>
  );
}
