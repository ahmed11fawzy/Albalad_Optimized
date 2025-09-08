import React from 'react';

const TypingIndicator = () => {
  return (
    <div className="message-row message-row--agent">
      <div className="message-bubble message-bubble--agent">
        <div className="agent-header">
          <span style={{ fontSize: '18px' }}>👩‍💼</span>
          <span className="agent-name-in-bubble">Sarah</span>
        </div>
        <div className="typing-indicator">
          <div className="typing-dot typing-dot--1"></div>
          <div className="typing-dot typing-dot--2"></div>
          <div className="typing-dot typing-dot--3"></div>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;