import React from "react";

const StepIndicator = ({ steps, currentStep }) => {
  return (
    <div className="register-seller-steps">
      {steps.map((label, idx) => (
        <div
          key={idx}
          className={`register-seller-step${currentStep === idx ? " active" : ""}${currentStep > idx ? " done" : ""
            }`}
        >
          {label}
        </div>
      ))}
    </div>
  );
};

export default StepIndicator;

