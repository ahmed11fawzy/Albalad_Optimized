import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faThumbsUp, faChevronDown, faImage, faUser } from '@fortawesome/free-solid-svg-icons';
import ProductReviewDialog from './product_reviewDialog';
import '../css/product_review.css'
const reviews = [
  {
    id: 1,
    user: { name: 'R***e', avatar: 'https://randomuser.me/api/portraits/men/32.jpg' },
    date: '02 إبريل 2025',
    rating: 5,
    color: 'NEW Emirates W',
    text: 'معاها بشكل جيد وتسليمها',
    images: [
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
      'https://images.unsplash.com/photo-1519125323398-675f0ddb6308',
      'https://images.unsplash.com/photo-1465101046530-73398c7f28ca',
    ],
    likes: 1,
  },
  {
    id: 2,
    user: { name: 'J***o', avatar: '' },
    date: '23 إبريل 2025',
    rating: 4,
    color: 'NEW Emirates W',
    text: 'المنتج جيد، مع ضوء، ولكن جزء من الدليل جاء غير مطلوب ويبدوا أنه من الممكن استخدامه.',
    images: [
      'https://images.unsplash.com/photo-1465101046530-73398c7f28ca',
      'https://images.unsplash.com/photo-1465101178521-c1a9136a3c5c',
    ],
    likes: 0,
  },
  {
    id: 3,
    user: { name: 'A***b', avatar: '' },
    date: '10 مايو 2025',
    rating: 5,
    color: 'NEW Emirates W',
    text: 'ممتاز جداً وسريع التوصيل.',
    images: [],
    likes: 2,
  },
];

export default function ProductReviewsComponent({ reviews }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const reviewsToShow = reviews?.slice(0, 2);
  return (
    <div className="product-reviews-section">
      <div className="reviews-summary-box">
        <div className="reviews-summary-main">
          <span className="reviews-summary-score">({reviews?.avg_rating || 0})</span>
          <div className="reviews-summary-stars">

            <FontAwesomeIcon icon={faStar} className="star-icon" />

          </div>
          <span className="reviews-summary-label">تقييم</span>
        </div>
        <div className="reviews-summary-details">
          <span>12 التصنيفات</span>
          <span className="reviews-summary-confirmed">✔ كل ذلك من عمليات الشراء التي تم تأكيدها</span>
        </div>
      </div>
      {/* <div className="reviews-tabs">
        <button className="reviews-tab active">جميع التقييمات</button>
        <button className="reviews-tab">مع صور <FontAwesomeIcon icon={faImage} /></button>
        <button className="reviews-tab">الأعلى تقييماً</button>
        <button className="reviews-tab">الأقل تقييماً</button>
        <button className="reviews-tab"><FontAwesomeIcon icon={faChevronDown} /></button>
      </div> */}
      <div className="reviews-list-scrollable">
        {reviewsToShow?.map((review) => (
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
        {reviews?.length > 2 && (
          <div className="reviews-show-more-box">
            <button className="reviews-show-more-btn" onClick={() => setDialogOpen(true)}>عرض المزيد</button>
          </div>
        )}
      </div>
      <ProductReviewDialog reviews={reviews} open={dialogOpen} onClose={() => setDialogOpen(false)} />
    </div>
  );
} 