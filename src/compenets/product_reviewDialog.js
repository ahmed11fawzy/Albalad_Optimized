import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faThumbsUp, faTimes, faUser } from '@fortawesome/free-solid-svg-icons';
import '../css/product_review.css';

export default function ProductReviewDialog({ reviews, open, onClose }) {
  if (!open) return null;
  return (
    <div className="review-dialog-overlay">
      <div className="review-dialog-box">
        <button className="review-dialog-close" onClick={onClose}>
          <FontAwesomeIcon icon={faTimes} />
        </button>
        <div className="review-dialog-title">جميع التقييمات والتعليقات</div>
        <div className="review-dialog-list-scrollable">
          {reviews.map((review) => (
            <div className="review-card" key={review.id}>
              <div className="review-user-info">
                {review.user.avatar ? (
                  <img src={review.user.avatar} alt={review.user.name} className="review-avatar" />
                ) : (
                  <span className="review-avatar review-avatar-default"><FontAwesomeIcon icon={faUser} /></span>
                )}
                <div>
                  <div className="review-user-name">{review.user.name}</div>
                  <div className="review-date">{review.date}</div>
                </div>
                <div className="review-rating">
                  {[...Array(review.rating)].map((_, i) => (
                    <FontAwesomeIcon key={i} icon={faStar} className="star-icon filled" />
                  ))}
                  {[...Array(5 - review.rating)].map((_, i) => (
                    <FontAwesomeIcon key={i} icon={faStar} className="star-icon" />
                  ))}
                </div>
              </div>
              <div className="review-variant">Color: {review.color}</div>
              <div className="review-text">{review.text}</div>
              {review.images && review.images.length > 0 && (
                <div className="review-images">
                  {review.images.slice(0, 2).map((img, idx) => (
                    <div className="review-image-thumb" key={idx}>
                      <img src={img} alt="review" />
                    </div>
                  ))}
                  {review.images.length > 2 && (
                    <button className="review-image-more-btn">+{review.images.length - 2}</button>
                  )}
                </div>
              )}
              <div className="review-actions">
                <span className="review-like"><FontAwesomeIcon icon={faThumbsUp} /> مفيد ({review.likes})</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 