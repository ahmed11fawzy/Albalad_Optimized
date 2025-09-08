import React from 'react';

            
const ChatHeader = ({ isMinimized, onToggleMinimize, onClose ,store}) => {
  

  return (
    <div className="chat-header">
      <div className="header-glow"></div>
      <div className="header-content">
        <div className="agent-info">
          <div className="agent-avatar">
            <div className="avatar-circle">
              <span>👩‍💼</span>
            </div>
            <div className="agent-status"></div>
          </div>
          <div className="agent-details">
            <h3 className="agent-name">{store}</h3>
            <div className="agent-status-text">
              <div className="status-dot"></div>
              Online • Avg response: 2min
            </div>
          </div>
        </div>
        <div className="header-buttons">
          <button
            onClick={onToggleMinimize}
            className="header-button"
          >
            {isMinimized ? '⬜' : '➖'}
          </button>
          <button
            onClick={onClose}
            className="header-button"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;