import React from 'react';

const ChatButton = ({ product,onClick, notificationCount }) => {
  return (
    <button
      onClick={onClick}
      className={` ${product ? 'chat-button--product' : 'chat-button'}`}
    >
      <svg className={`${product ? 'chat-icon--product' : 'chat-icon'}`} viewBox="0 0 24 24" fill="currentColor">
        <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4l4 4 4-4h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
      </svg>
      {notificationCount > 0 && (
        <div className={`${product ? 'notification-badge--product' : 'notification-badge'}`}>{notificationCount}</div>
      )}
      <div className={`${product ? 'online-indicator--product' : 'online-indicator'}`}></div>
    </button>
  );
};

export default ChatButton;