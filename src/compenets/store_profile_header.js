import React, { useState, useEffect } from "react";
import "./store_profile.css";
import CustomerServiceChat from "./chat/CustomerServiceChat";
import { useGetFollowedStoresQuery } from "../redux/Slices/followersApi";
import { useGetCurrentUserQuery } from "../redux/Slices/authApi";

export default function StoreProfileHeader({ storeData }) {
  const [showInfo, setShowInfo] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const { data: user, isLoading: userLoading } = useGetCurrentUserQuery();
  // Fetch initial follow status
  useEffect(() => {
    const fetchFollowStatus = async () => {
      if (!storeData?.id) {
        console.error("storeData.id is undefined or null");
        return;
      }
      try {
        if (user) {
          const followedStores = user?.followers || [];

          setIsFollowing(
            followedStores.find((store) => store.id === storeData.id) !==
              undefined
          );
        }
      } catch (e) {
        console.error("Error fetching follow status:", e);
      }
    };
    fetchFollowStatus();
  }, [storeData?.id]);

  // Handle follow/unfollow action
  const handleFollow = async () => {
    if (!storeData?.id) {
      console.error("storeData.id is undefined or null");
      return;
    }
    console.log("Follow button clicked, storeId:", storeData.id);
    setLoading(true);
    try {
      const token = localStorage.getItem("user_token");
      if (!token) {
        console.error("No user_token found in localStorage");
        return;
      }
      console.log("Making API request...");
      const res = await fetch(
        `https://back.al-balad.sa/albalad/v1.0/followers/follower/${storeData.id}`,
        {
          method: "GET", // Use POST for follow, adjust to DELETE for unfollow if needed
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      console.log("API Response:", data);
      if (data.message === "Follower Successfully") {
        setIsFollowing(true);
      } else {
        setIsFollowing(false);
      }
    } catch (e) {
      console.error("Error in handleFollow:", e);
    } finally {
      setLoading(false);
    }
  };

  // Protect against undefined storeData
  if (!storeData) {
    return (
      <div className="store-profile-header-loading">
        جاري تحميل بيانات المتجر...
      </div>
    );
  }

  return (
    <div className="store-profile-header">
      <div
        className="store-info"
        onMouseEnter={() => setShowInfo(true)}
        style={{ position: "relative" }}
      >
        <img src={storeData.logo} alt="Store-Logo" className="store-logo" />
        <div className="store-name">{storeData.name_ar}</div>
        {showInfo && (
          <div
            className="store-info-popup"
            onMouseLeave={() => setShowInfo(false)}
          >
            <div>
              <div className="store-info-popup-title">معلومات المتجر</div>
              <div className="store-info-popup-row">
                <span>اسم النشاط التجاري:</span>{" "}
                {storeData.documents?.business_name || storeData.name_ar}
              </div>
              <div className="store-info-popup-row">
                <span>رقم السجل التجاري:</span>{" "}
                {storeData.documents?.commercial_registration_number || "-"}
              </div>
              <div className="store-info-popup-row">
                <span>رقم الهاتف:</span> {storeData.phone || "-"}
              </div>
              <div className="store-info-popup-row">
                <span>الموقع:</span>
                {storeData.location_hierarchy?.country?.name} -
                {storeData.location_hierarchy?.state?.name} -
                {storeData.location_hierarchy?.province?.name}
              </div>
            </div>
            <div className="store-info-popup-map">
              {storeData.location ? (
                <div
                  dangerouslySetInnerHTML={{
                    __html: storeData.location
                      .replace('width="600"', 'width="220"')
                      .replace('height="450"', 'height="120"'),
                  }}
                />
              ) : (
                <span style={{ color: "#aaa" }}>لا يوجد موقع</span>
              )}
            </div>
          </div>
        )}
      </div>
      <div className="store-stats">
        <span>تقييم إيجابي {storeData.average_rating}</span> |
        <span>{storeData.count_followers} المتابعين</span>
      </div>
      <div className="store-actions">
        <button
          className={`follow-btn${isFollowing ? " unfollow-btn" : ""}`}
          onClick={() => {
            console.log("Follow button clicked");
            handleFollow();
          }}
          disabled={loading}
        >
          {loading ? (
            <span className="loader-circle"></span>
          ) : isFollowing ? (
            "إلغاء المتابعة"
          ) : (
            "+ متابعة"
          )}
        </button>
        <button className="contact-btn" onClick={() => setIsOpen(true)}>
          اتصل الآن
        </button>
        <CustomerServiceChat Store={storeData} Open={isOpen} />
      </div>
      <div className="store-search">
        <input type="text" placeholder="البحث في هذا المتجر" />
      </div>
    </div>
  );
}
