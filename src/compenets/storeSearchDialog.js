import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import "./storeSearchDialog.css";
import { useNavigate } from "react-router-dom";

export default function StoreSearchDialog({ open, onClose }) {
  const [query, setQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [multiStores, setMultiStores] = useState([]);
  const navigate = useNavigate();

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setInfo("");
    setMultiStores([]);
    if (!query.trim()) {
      setError("يرجى إدخال اسم المتجر");
      return;
    }
    setSearching(true);
    try {
      const res = await fetch(
        `https://back.al-balad.sa/albalad/v1.0/stores/search/${encodeURIComponent(
          query
        )}`
      );
      const data = await res.json();
      if (data && data.status && Array.isArray(data.data)) {
        if (data.data.length === 1) {
          onClose();
          navigate(`/store-profile/${data.data[0].id}`);
        } else if (data.data.length > 1) {
          setInfo("هناك أكثر من متجر بهذا الاسم");
          setMultiStores(data.data);
        } else {
          setError("لا يوجد متجر بهذا الاسم");
        }
      } else {
        setError("حدث خطأ أثناء البحث");
      }
    } catch {
      setError("حدث خطأ أثناء البحث");
    }
    setSearching(false);
  };

  return (
    <div className="store-search-dialog-overlay" onClick={onClose}>
      <div className="store-search-dialog" onClick={(e) => e.stopPropagation()}>
        <form className="store-search-form" onSubmit={handleSubmit}>
          <input
            type="text"
            className="store-search-input"
            placeholder="ابحث باسم المتجر..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setError("");
              setInfo("");
              setMultiStores([]);
            }}
            autoFocus
            disabled={searching}
          />
          <button
            className="store-search-icon-btn"
            type="submit"
            disabled={searching}
          >
            <FaSearch />
          </button>
        </form>
        {info && <div className="store-search-info-msg">{info}</div>}
        {multiStores.length > 1 && (
          <div className="store-search-multi-list">
            {multiStores.map((store) => (
              <div
                key={store.id}
                className="store-search-multi-item"
                onClick={() => {
                  onClose();
                  navigate(`/store-profile/${store.id}`);
                }}
              >
                <img
                  src={store.logo ? store.logo : "/store-default-logo.png"}
                  alt={store.name_ar}
                  className="store-search-multi-logo"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/store-default-logo.png";
                  }}
                />
                <span className="store-search-multi-name">{store.name_ar}</span>
              </div>
            ))}
          </div>
        )}
        {error && <div className="store-search-error-msg">{error}</div>}
        <button className="store-search-dialog-close" onClick={onClose}>
          &times;
        </button>
      </div>
    </div>
  );
}
