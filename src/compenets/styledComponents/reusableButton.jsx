import React from 'react';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'medium', 
  disabled = false, 
  onClick,
  className = '',
  type = 'button',
  ...props 
}) => {
  const baseClass = 'ecommerce-btn';
  const variantClass = `${baseClass}--${variant}`;
  const sizeClass = `${baseClass}--${size}`;
  const disabledClass = disabled ? `${baseClass}--disabled` : '';
  
  const buttonClasses = `${baseClass} ${variantClass} ${sizeClass} ${disabledClass} ${className}`.trim();

  return (
    <>
      <button
        type={type}
        className={buttonClasses}
        disabled={disabled}
        onClick={onClick}
        {...props}
      >
        <span className="ecommerce-btn__content">
          {children}
        </span>
      </button>

      <style jsx>{`
        .ecommerce-btn {
          --primary-color: #b88c36;
          --primary-dark: #9a7530;
          --primary-light: #c9a055;
          --text-dark: #2c3e50;
          --text-light: #ffffff;
          --border-radius: 8px;
          --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          --shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          --shadow-hover: 0 8px 25px rgba(184, 140, 54, 0.3);
          
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: 2px solid transparent;
          border-radius: var(--border-radius);
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          font-weight: 600;
          text-decoration: none;
          cursor: pointer;
          transition: var(--transition);
          overflow: hidden;
          outline: none;
          box-shadow: var(--shadow);
          letter-spacing: 0.025em;
        }

        .ecommerce-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
          transition: var(--transition);
        }

        .ecommerce-btn__content {
          position: relative;
          z-index: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        /* Size Variants */
        .ecommerce-btn--small {
          padding: 0.5rem 1rem;
          font-size: 0.875rem;
          min-height: 36px;
        }

        .ecommerce-btn--medium {
          padding: 0.75rem 1.5rem;
          font-size: 1rem;
          min-height: 44px;
        }

        .ecommerce-btn--large {
          padding: 1rem 2rem;
          font-size: 1.125rem;
          min-height: 52px;
        }

        /* Primary Variant (Background) */
        .ecommerce-btn--primary {
          background: linear-gradient(135deg, var(--primary-color), var(--primary-dark));
          color: var(--text-light);
          border-color: var(--primary-color);
        }

        .ecommerce-btn--primary:hover:not(:disabled) {
          background: linear-gradient(135deg, var(--primary-light), var(--primary-color));
          transform: translateY(-2px);
          box-shadow: var(--shadow-hover);
        }

        .ecommerce-btn--primary:hover:not(:disabled)::before {
          left: 100%;
        }

        .ecommerce-btn--primary:active:not(:disabled) {
          transform: translateY(0);
          box-shadow: var(--shadow);
        }

        /* Premium Gold Variant - Classic elegance */
        .ecommerce-btn--premium-gold {
          background: linear-gradient(135deg, #ffd700, #ffb347, #b8860b);
          color: var(--text-light);
          border-color: #ffd700;
          box-shadow: 0 4px 15px rgba(255, 215, 0, 0.3);
        }

        .ecommerce-btn--premium-gold:hover:not(:disabled) {
          background: linear-gradient(135deg, #ffed4e, #ffd700, #daa520);
          transform: translateY(-3px);
          box-shadow: 0 8px 30px rgba(255, 215, 0, 0.4);
        }

        .ecommerce-btn--premium-gold:hover:not(:disabled)::before {
          left: 100%;
        }

        /* Warm Copper Variant - Inviting warmth */
        .ecommerce-btn--warm-copper {
          background: linear-gradient(135deg, #cd7f32, #a0522d, #8b4513);
          color: var(--text-light);
          border-color: #cd7f32;
          box-shadow: 0 4px 15px rgba(205, 127, 50, 0.3);
        }

        .ecommerce-btn--warm-copper:hover:not(:disabled) {
          background: linear-gradient(135deg, #e6965c, #cd7f32, #a0522d);
          transform: translateY(-3px);
          box-shadow: 0 8px 30px rgba(205, 127, 50, 0.4);
        }

        .ecommerce-btn--warm-copper:hover:not(:disabled)::before {
          left: 100%;
        }

        /* Earthy Tone Variant - Natural stability */
        .ecommerce-btn--earthy-tone {
          background: linear-gradient(135deg, #8b7355, #6b5b73, #4a4a48);
          color: var(--text-light);
          border-color: #8b7355;
          box-shadow: 0 4px 15px rgba(139, 115, 85, 0.3);
        }

        .ecommerce-btn--earthy-tone:hover:not(:disabled) {
          background: linear-gradient(135deg, #a08672, #8b7355, #6b5b73);
          transform: translateY(-3px);
          box-shadow: 0 8px 30px rgba(139, 115, 85, 0.4);
        }

        .ecommerce-btn--earthy-tone:hover:not(:disabled)::before {
          left: 100%;
        }

        /* Luxury Blend Variant - Premium sophistication */
        .ecommerce-btn--luxury-blend {
          background: linear-gradient(135deg, #2c3e50, #34495e, #b88c36);
          color: var(--text-light);
          border-color: #2c3e50;
          box-shadow: 0 4px 15px rgba(44, 62, 80, 0.3);
        }

        .ecommerce-btn--luxury-blend:hover:not(:disabled) {
          background: linear-gradient(135deg, #34495e, #2c3e50, #c9a055);
          transform: translateY(-3px);
          box-shadow: 0 8px 30px rgba(44, 62, 80, 0.4);
        }

        .ecommerce-btn--luxury-blend:hover:not(:disabled)::before {
          left: 100%;
        }

        /* Soft Elegance Variant - Gentle refinement */
        .ecommerce-btn--soft-elegance {
          background: linear-gradient(135deg, #f8f9fa, #e9ecef, #b88c36);
          color: var(--text-dark);
          border-color: #e9ecef;
          box-shadow: 0 4px 15px rgba(233, 236, 239, 0.3);
        }

        .ecommerce-btn--soft-elegance:hover:not(:disabled) {
          background: linear-gradient(135deg, #ffffff, #f8f9fa, #c9a055);
          transform: translateY(-3px);
          box-shadow: 0 8px 30px rgba(233, 236, 239, 0.4);
        }

        .ecommerce-btn--soft-elegance:hover:not(:disabled)::before {
          left: 100%;
        }

        /* Secondary Variant (Border Only) */
        .ecommerce-btn--secondary {
          background: transparent;
          color: var(--primary-color);
          border-color: var(--primary-color);
          position: relative;
        }

        .ecommerce-btn--secondary::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 0;
          height: 100%;
          background: linear-gradient(135deg, var(--primary-color), var(--primary-dark));
          transition: var(--transition);
          z-index: 0;
        }

        .ecommerce-btn--secondary:hover:not(:disabled) {
          color: var(--text-light);
          border-color: var(--primary-dark);
          transform: translateY(-2px);
          box-shadow: var(--shadow-hover);
        }

        .ecommerce-btn--secondary:hover:not(:disabled)::after {
          width: 100%;
        }

        .ecommerce-btn--secondary:active:not(:disabled) {
          transform: translateY(0);
        }

        /* Outline Variant */
        .ecommerce-btn--outline {
          background: var(--text-light);
          color: var(--primary-color);
          border-color: var(--primary-color);
        }

        .ecommerce-btn--outline:hover:not(:disabled) {
          background: var(--primary-color);
          color: var(--text-light);
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(184, 140, 54, 0.25);
        }

        .ecommerce-btn--outline:hover:not(:disabled)::before {
          left: 100%;
        }

        /* Ghost Variant */
        .ecommerce-btn--ghost {
          background: transparent;
          color: var(--primary-color);
          border-color: transparent;
          box-shadow: none;
        }

        .ecommerce-btn--ghost:hover:not(:disabled) {
          background: rgba(184, 140, 54, 0.1);
          color: var(--primary-dark);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(184, 140, 54, 0.2);
        }

        /* Disabled State */
        .ecommerce-btn--disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none !important;
          box-shadow: var(--shadow) !important;
        }

        .ecommerce-btn--disabled::before {
          display: none;
        }

        .ecommerce-btn--disabled::after {
          display: none;
        }

        /* Focus States */
        .ecommerce-btn:focus-visible {
          outline: 2px solid var(--primary-color);
          outline-offset: 2px;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .ecommerce-btn {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </>
  );
};

export default Button;