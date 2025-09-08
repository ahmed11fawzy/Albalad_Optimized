import React from 'react';

const MessageBubble = ({ message, formatTime }) => {
  const isUser = message.is_sender; // Use isAgent instead of sender
  
  return (
    <div className={`message-row ${isUser ? 'message-row--user' : 'message-row--agent'}`}>
      <div className={`message-bubble ${isUser ? 'message-bubble--user' : 'message-bubble--agent'}`}>
        {!isUser && (
          <div className="agent-header">
            <span style={{ fontSize: '18px' }}>🤖</span> {/* Default avatar emoji */}
            <span className="agent-name-in-bubble">Customer Support</span> {/* Default agent name */}
          </div>
        )}
        <p className="message-text">{message.content.text}</p> {/* Use message.message instead of message.text */}
        <p className={`message-time ${isUser ? 'message-time--user' : 'message-time--agent'}`}>
          {formatTime(message.created_at)}
        </p>
      </div>
    </div>
  );
};

export default MessageBubble;