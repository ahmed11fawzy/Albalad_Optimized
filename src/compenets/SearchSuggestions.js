import React, { useState } from "react";
import "../css/SearchSuggestions.css";
import { FiX } from "react-icons/fi";
import { useGetSearchHistoryQuery } from "../redux/Slices/searchApi";

const initialSearchHistory = [
  "ادوات صيانة",
  "لاينير طقم ملابس للنساء مكون من قطعتين",
  "اكسسوارات تقنية",
  "اكسسوارات مطبخ",
];
const moreDiscover = [
  "طقم مجوهرات",
  "ملابس رجالية بتصميم 2024",
  "ساعات يد نسائية ماركة اصلية",
  "اطقم نسائية قطعتين أنيقة",
  "قلم كارتيير",
  "زي البيسبول",
  "الساعات للذكاء",
  "مسدس شبه حقيقي لعبة",
  "six نساء",
];
const suggestions = [
  {
    img: "https://cdn-icons-png.flaticon.com/512/1046/1046857.png",
    name: "مجفف شعر",
  },
  {
    img: "https://cdn-icons-png.flaticon.com/512/1046/1046858.png",
    name: "طنجره الضغط",
  },
  {
    img: "https://cdn-icons-png.flaticon.com/512/1046/1046859.png",
    name: "فرشاة الشعر الكهربائية",
  },
  {
    img: "https://cdn-icons-png.flaticon.com/512/1046/1046860.png",
    name: "المماسح الكاملة الكهربائية",
  },
  {
    img: "https://cdn-icons-png.flaticon.com/512/1046/1046861.png",
    name: "آلات القهوة",
  },
  {
    img: "https://cdn-icons-png.flaticon.com/512/1046/1046862.png",
    name: "ثلاجات",
  },
  {
    img: "https://cdn-icons-png.flaticon.com/512/1046/1046863.png",
    name: "غلاية كهربائية",
  },
  {
    img: "https://cdn-icons-png.flaticon.com/512/1046/1046864.png",
    name: "الروبوتات المطبخ",
  },
  {
    img: "https://cdn-icons-png.flaticon.com/512/1046/1046865.png",
    name: "منقّي الهواء",
  },
  {
    img: "https://cdn-icons-png.flaticon.com/512/1046/1046866.png",
    name: "الحديد",
  },
];

export default function SearchSuggestions() {
  const { data: searchHistoryData, isLoading: searchHistoryLoading } =
    useGetSearchHistoryQuery();

  const [searchHistory, setSearchHistory] = useState(searchHistoryData);


  const handleRemoveHistoryItem = (item) => {
    setSearchHistory((prev) => prev.filter((i) => i !== item));
  };
  const handleClearAll = () => setSearchHistory([]);

  return (
    <div className="search-suggestions-overlay">
      <div className="search-suggestions-popup">
        <div className="search-suggestions-main">
          {/* سجل البحث واكتشاف المزيد */}
          <div className="search-suggestions-sidebar">
            <div className="search-suggestions-history-row">
              <span className="search-suggestions-history-title">
                سجل البحث
              </span>
              <span
                className="search-suggestions-clear"
                onClick={handleClearAll}
              >
                مسح الكل
              </span>
            </div>
            {searchHistoryData && (
              <ul className="search-suggestions-history-list">
                {searchHistoryData.data?.length === 0 ? (
                  <li className="search-suggestions-history-empty">
                    لا يوجد سجل بحث
                  </li>
                ) : (
                  searchHistoryData?.data?.map((item, i) => (
                    <li key={i} className="search-suggestions-history-item">
                      <span>{item}</span>
                      <button
                        className="search-suggestions-history-remove"
                        onClick={() => handleRemoveHistoryItem(item)}
                        title="حذف"
                      >
                        <FiX size={14} />
                      </button>
                    </li>
                  ))
                )}
              </ul>
            )}
            <div className="search-suggestions-discover-title">
              اكتشف المزيد
            </div>
            <ul className="search-suggestions-discover-list">
              {moreDiscover.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
          {/* المنتجات المقترحة */}
          <div className="search-suggestions-content">
            <div className="search-suggestions-clear-row">
              <span className="search-suggestions-other">ترشيحات أخرى</span>
            </div>
            <div className="search-suggestions-section-title">
              الأجهزة المنزلية
            </div>
            <div className="search-suggestions-products-grid">
              {suggestions.map((item, i) => (
                <div className="search-suggestions-product-card" key={i}>
                  <img src={item.img} alt={item.name} />
                  <div className="search-suggestions-product-name">
                    {item.name}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
