import React, { useRef, useState } from "react";
import { FiX, FiImage, FiSearch } from "react-icons/fi";
import "../css/ImageSearchPopover.css";
import { useSearchByImageMutation } from "../redux/Slices/searchApi";
import { useNavigate } from "react-router-dom";

export default function ImageSearchPopover({
  onClose,
  style,
  onMouseEnter,
  onMouseLeave,
}) {
  const fileInputRef = useRef();
  const [searchByImage, { isLoading }] = useSearchByImageMutation();
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const navigate = useNavigate();
  // Handle file selection (via input or drop)
  const handleFileSelect = (file) => {
    if (file && file.type.startsWith("image/")) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      console.error("Invalid file type. Please select an image.");
    }
  };

  // Handle file input change
  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    handleFileSelect(file);
  };

  // Handle drag-and-drop
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files && e.dataTransfer.files[0];
    handleFileSelect(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  // Handle upload button click
  const handleUploadClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  // Handle search button click
  const handleSearchClick = async () => {
    if (selectedImage) {
      const formData = new FormData();
      formData.append("image", selectedImage);
      try {
        const response = await searchByImage(formData).unwrap();
        if (response) {
          navigate(`/searchProduct/${encodeURIComponent(selectedImage.name)}`, {
            state: { product: response },
          });
          console.log("Search Results:", {
            data: response,
            fileName: selectedImage.name,
            fileSize: selectedImage.size,
            fileType: selectedImage.type,
          });
        }
      } catch (error) {
        console.error("Search Error:", {
          message: error.message,
          status: error.status,
          data: error.data,
        });
      }
    }
  };

  // Clean up preview URL on component unmount or image change
  React.useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  return (
    <div
      className="image-search-popover"
      style={style}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <button className="image-search-popover-close" onClick={onClose}>
        <FiX />
      </button>
      <div className="image-search-popover-title">البحث بالصورة</div>
      <div className="image-search-popover-desc">
        اعثر على ما تريد بأسعار أفضل على Albalad باستخدام البحث بالصور
      </div>
      {isLoading && <div>Loading...</div>}
      <div
        className="image-search-popover-droparea"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        {previewUrl ? (
          <img
            src={previewUrl}
            alt="Selected"
            className="image-search-popover-preview"
            style={{ maxWidth: "100%", maxHeight: "150px" }}
          />
        ) : (
          <>
            <FiImage className="image-search-popover-imgicon" />
            <div className="image-search-popover-droptext">
              اسحب صورة هنا
              <br />
              أو
            </div>
          </>
        )}
        <button
          className="image-search-popover-uploadbtn"
          onClick={handleUploadClick}
          disabled={isLoading}
        >
          قم بتحميل صورة
        </button>
        <button
          className="image-search-popover-searchbtn"
          onClick={handleSearchClick}
          disabled={!selectedImage || isLoading}
        >
          <FiSearch style={{ marginRight: "5px" }} />
          بحث
        </button>
        <input
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          ref={fileInputRef}
          onChange={handleFileChange}
        />
      </div>
      <div className="image-search-popover-note">
        *للبحث السريع اضغط على CTRL+V للصق صورة في مربع البحث
      </div>
    </div>
  );
}
