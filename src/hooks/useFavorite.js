import { useState } from "react";

export default function useFavorite(productId) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // يمكن جلب حالة المنتج من API عند الحاجة

  const toggleFavorite = async () => {
    const userToken = localStorage.getItem("user_token");
    const userId = localStorage.getItem("user_id");
    if (!userToken || !userId) {
      setLoginOpen(true);
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(
        `https://back.al-balad.sa/favorites/favorite/${productId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
      const data = await response.json();
      if (data.status) {
        setIsFavorite((prev) => !prev);
      }
    } catch (e) {
      // يمكن إظهار رسالة خطأ إذا رغبت
    } finally {
      setLoading(false);
    }
  };

  return {
    isFavorite,
    toggleFavorite,
    loginOpen,
    setLoginOpen,
    loading,
  };
}
