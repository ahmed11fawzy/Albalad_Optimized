import React from 'react';

const ChatInput = ({ message, onMessageChange, onSendMessage }) => {
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      onSendMessage();
    }
  };

  return (
    <div className="input-container">
      <input
        type="text"
        value={message}
        onChange={(e) => onMessageChange(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Type your message..."
        className="message-input"
      />
      <button
        onClick={onSendMessage}
        disabled={!message.trim()}
        className="send-button"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
        </svg>
      </button>
    </div>
  );
};

export default ChatInput;