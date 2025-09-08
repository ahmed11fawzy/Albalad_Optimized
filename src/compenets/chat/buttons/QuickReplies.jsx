import React from 'react';

const QuickReplies = ({ replies, onReplySelect }) => {
  return (
    <div className="quick-replies">
      <div className="quick-replies-container">
        {replies.map((reply, index) => (
          <button
            key={index}
            onClick={() => onReplySelect(reply)}
            className="quick-reply-button"
          >
            {reply}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickReplies;