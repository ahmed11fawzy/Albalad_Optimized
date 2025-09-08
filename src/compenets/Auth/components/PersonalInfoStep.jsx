import React from "react";

const PersonalInfoStep = ({ 
  personal, 
  errors, 
  handlePersonalChange, 
  handleNext 
}) => {
  return (
    <div className="register-seller-step-content">
      <div className="register-seller-field">
        <label>
          الاسم الكامل<span className="required">*</span>
        </label>
        <input
          type="text"
          name="user_name"
          value={personal.user_name}
          onChange={handlePersonalChange}
        />
        {errors.user_name && (
          <div className="register-seller-error">
            {errors.user_name}
          </div>
        )}
      </div>
      
      <div className="register-seller-field">
        <label>
          البريد الإلكتروني<span className="required">*</span>
        </label>
        <input
          type="email"
          name="user_email"
          value={personal.user_email}
          onChange={handlePersonalChange}
        />
        {errors.user_email && (
          <div className="register-seller-error">
            {errors.user_email}
          </div>
        )}
      </div>
      
             <div className="register-seller-field">
         <label>رقم الجوال</label>
         <input
           type="text"
           name="user_phone"
           value={personal.user_phone}
           onChange={handlePersonalChange}
           placeholder="مثال: 05xxxxxxxx"
         />
         {errors.user_phone && (
           <div className="register-seller-error">
             {errors.user_phone}
           </div>
         )}
       </div>
      
      <div className="register-seller-field">
        <label>
          كلمة المرور<span className="required">*</span>
        </label>
        <input
          type="password"
          name="password"
          value={personal.password}
          onChange={handlePersonalChange}
        />
        {errors.password && (
          <div className="register-seller-error">{errors.password}</div>
        )}
      </div>
      
      <div className="register-seller-field">
        <label>
          تأكيد كلمة المرور<span className="required">*</span>
        </label>
        <input
          type="password"
          name="password_confirmation"
          value={personal.password_confirmation}
          onChange={handlePersonalChange}
        />
        {errors.password_confirmation && (
          <div className="register-seller-error">
            {errors.password_confirmation}
          </div>
        )}
      </div>
      
      <div className="register-seller-field">
        <label>الصورة الشخصية</label>
        <label className="custom-file-btn">
          اختر صورة
          <input
            type="file"
            name="avatar"
            accept="image/*"
            className="custom-file-input"
            onChange={handlePersonalChange}
          />
        </label>
        {personal.avatarPreview && (
          <img
            src={personal.avatarPreview}
            alt="avatar preview"
            className="register-seller-avatar-preview"
          />
        )}
      </div>
      
      <div className="register-seller-next-btn-wrapper">
        <button className="register-seller-next-btn" type="submit" onClick={handleNext}>
          التالي
        </button>
      </div>
    </div>
  );
};

export default PersonalInfoStep;

