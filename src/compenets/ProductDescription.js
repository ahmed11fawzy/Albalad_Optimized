import React, { useRef, useState, useEffect } from 'react';
import './productDescription.css';

export default function ProductDescription({ description }) {
  const [expanded, setExpanded] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const contentRef = useRef(null);

  useEffect(() => {
    if (contentRef.current) {
      // إذا كان ارتفاع الوصف أكبر من 300px أظهر زر عرض المزيد
      setShowMore(contentRef.current.scrollHeight > 300);
    }
  }, [description]);

  if (!description) return null;
  return (
    <div className="product-description-container">
      <h2 className="product-description-title">وصف المنتج</h2>
      <div
        className={`product-description-content${expanded ? ' expanded' : ''}`}
        ref={contentRef}
        style={expanded ? {} : { maxHeight: 450, overflow: 'hidden', position: 'relative' }}
        dangerouslySetInnerHTML={{ __html: description }}
      />
      {showMore && !expanded && (
        <>
          <div className="product-description-fade" />
          <button className="show-more-btn" onClick={() => setExpanded(true)}>
            عرض المزيد
          </button>
        </>
      )}
    </div>
  );
} 