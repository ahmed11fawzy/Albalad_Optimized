import React from 'react';

const QuickActions = () => {
  const actions = [
    { icon: '📞', label: 'Call' },
    { icon: '✉️', label: 'Email' },
    { icon: '🕒', label: 'Hours' }
  ];

  return (
    <div className="quick-actions">
      {actions.map((action, index) => (
        <button
          key={index}
          className="quick-action-button"
        >
          <span>{action.icon}</span>
          <span>{action.label}</span>
        </button>
      ))}
    </div>
  );
};

export default QuickActions;