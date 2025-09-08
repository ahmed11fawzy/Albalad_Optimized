import React, { useState, useRef, useLayoutEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiSearch, FiCamera } from "react-icons/fi"; // Importing from Feather Icons
import ImageSearchPopover from "./ImageSearchPopover";

const SearchBar = ({
  onFocus,
  inputRef,
  onHideSuggestions,
  searchQuery,
  setSearchQuery,
}) => {
  const navigate = useNavigate();
  const [showImagePopover, setShowImagePopover] = useState(false);
  const cameraBtnRef = useRef();
  const containerRef = useRef();
  const [popoverPos, setPopoverPos] = useState({ top: 0, left: 0 });

  const handleSearch = () => {
    if (searchQuery.trim()) {
      if (onHideSuggestions) onHideSuggestions();
      navigate(`/searchProduct/${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // عند إظهار البوكس، احسب موضعه أسفل زر الكاميرا
  useLayoutEffect(() => {
    if (showImagePopover && cameraBtnRef.current && containerRef.current) {
      const btnRect = cameraBtnRef.current.getBoundingClientRect();
      const containerRect = containerRef.current.getBoundingClientRect();
      setPopoverPos({
        top: btnRect.bottom - containerRect.top + 6, // 6px مسافة بسيطة
        left: btnRect.left - containerRect.left + btnRect.width / 2,
      });
    }
  }, [showImagePopover]);

  const handlePopoverEnter = () => setShowImagePopover(true);
  const handlePopoverLeave = () => setShowImagePopover(false);

  return (
    <div className="search-container" ref={containerRef}>
      <input
        type="text"
        placeholder="بحث عن منتج ..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        className="search-input"
        ref={inputRef}
        onFocus={onFocus}
      />
      <button
        className="search-image-button"
        type="button"
        style={{ marginLeft: 4 }}
        onClick={handlePopoverEnter}
        ref={cameraBtnRef}
      >
        <FiCamera className="search-image-icon" />
      </button>
      {showImagePopover && (
        <ImageSearchPopover
          onClose={handlePopoverLeave}
          style={{
            position: "absolute",
            top: popoverPos.top,
            left: popoverPos.left,
            transform: "translateX(-50%)",
            zIndex: 10010,
          }}
          onMouseEnter={handlePopoverEnter}
        />
      )}
      <button onClick={handleSearch} className="search-button">
        <FiSearch className="search-icon" />
      </button>
    </div>
  );
};

export default SearchBar;
