import React, { useState, useEffect } from "react";
import { FiChevronDown } from "react-icons/fi";
import { FaStore } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./MarketsDropdown.css";

export default function MarketsDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedMarket, setSelectedMarket] = useState(null);
  const [markets, setMarkets] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMarkets = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          "https://back.al-balad.sa/albalad/v1.0/markets"
        );
        const data = await res.json();
        if (data && data.status && Array.isArray(data.data)) {
          setMarkets(data.data);
        } else {
          setMarkets([]);
        }
      } catch (e) {
        setMarkets([]);
      }
      setLoading(false);
    };
    fetchMarkets();
  }, []);

  const handleSelect = (marketId) => {
    setSelectedMarket(marketId);
    setIsOpen(false);
    navigate(`/markets-stores/${marketId}`);
  };

  const selectedMarketObj = markets.find((m) => m.id === selectedMarket);

  return (
    <div className="market-dropdown">
      <button
        className="market-dropdown-trigger"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="market-selected-option">
          {selectedMarketObj?.name || "الأسواق"}
        </span>
        <FiChevronDown
          className={`market-dropdown-icon${isOpen ? " open" : ""}`}
        />
      </button>
      {isOpen && (
        <div className="market-dropdown-container">
          <div className="market-dropdown-menu">
            <div className="market-menu-scroll-container">
              {loading ? (
                <div
                  style={{ padding: 16, textAlign: "center", color: "#888" }}
                >
                  جاري التحميل...
                </div>
              ) : markets.length === 0 ? (
                <div
                  style={{ padding: 16, textAlign: "center", color: "#888" }}
                >
                  لا توجد أسواق متاحة
                </div>
              ) : (
                markets.map((market) => (
                  <button
                    key={market.id}
                    className={`market-menu-item${
                      selectedMarket === market.id ? " selected" : ""
                    }`}
                    onClick={() => handleSelect(market.id)}
                  >
                    {market.logo ? (
                      <img
                        src={market.logo}
                        alt={market.name}
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: "50%",
                          objectFit: "cover",
                          marginLeft: 6,
                          background: "#f7f7f7",
                          border: "1px solid #eee",
                        }}
                      />
                    ) : (
                      <span
                        style={{
                          width: 28,
                          height: 28,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          marginLeft: 6,
                          background: "#f7f7f7",
                          borderRadius: "50%",
                          border: "1px solid #eee",
                        }}
                      >
                        <FaStore size={18} color="#bbb" />
                      </span>
                    )}
                    <span>{market.name}</span>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
