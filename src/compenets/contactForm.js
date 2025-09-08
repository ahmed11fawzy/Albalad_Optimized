// ContactUsForm.jsx
import React, { useState, useRef } from 'react';
import '../css/contactForm.css';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const ContactUsForm = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'الاسم مطلوب';
    if (!formData.email.trim()) newErrors.email = 'البريد الإلكتروني مطلوب';
    else if (!emailRegex.test(formData.email.trim())) newErrors.email = 'صيغة البريد الإلكتروني غير صحيحة';
    if (!formData.subject.trim()) newErrors.subject = 'الموضوع مطلوب';
    if (!formData.message.trim()) newErrors.message = 'الرسالة مطلوبة';
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
      setFormData({ name: '', email: '', subject: '', message: '' });
      setErrors({});
      if (containerRef.current) {
        containerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 1200);
  };

  return (
    <>
      
      <div className="contact-form-container" ref={containerRef}>
      {success && (
        <div className="contact-form-success">تم إرسال الرسالة بنجاح</div>
      )}
        <h2 className="contact-form-title">تواصل معنا</h2>
        <form className="contact-form-form" onSubmit={handleSubmit} noValidate>
          <div className="contact-form-row">
            <div className="contact-form-group">
              <label className="contact-form-label">الاسم الكامل</label>
              <input
                type="text"
                name="name"
                placeholder="ادخل اسمك الكامل"
                value={formData.name}
                onChange={handleChange}
                className="contact-form-input"
              />
              {errors.name && <span className="contact-form-error">{errors.name}</span>}
            </div>
            <div className="contact-form-group">
              <label className="contact-form-label">البريد الإلكتروني</label>
              <input
                type="email"
                name="email"
                placeholder="ادخل بريدك الإلكتروني"
                value={formData.email}
                onChange={handleChange}
                className="contact-form-input"
              />
              {errors.email && <span className="contact-form-error">{errors.email}</span>}
            </div>
          </div>

          <div className="contact-form-group">
            <label className="contact-form-label">الموضوع</label>
            <input
              type="text"
              name="subject"
              placeholder="ادخل عنوان الموضوع"
              value={formData.subject}
              onChange={handleChange}
              className="contact-form-input"
            />
            {errors.subject && <span className="contact-form-error">{errors.subject}</span>}
          </div>

          <div className="contact-form-group">
            <label className="contact-form-label">الرسالة</label>
            <textarea
              name="message"
              placeholder="اكتب رسالتك هنا"
              value={formData.message}
              onChange={handleChange}
              className="contact-form-input"
              style={{ minHeight: '120px', resize: 'vertical' }}
            ></textarea>
            {errors.message && <span className="contact-form-error">{errors.message}</span>}
          </div>

          <button type="submit" className="contact-form-submit" disabled={loading}>
            {loading ? (
              <span className="contact-form-spinner"></span>
            ) : (
              'إرسال'
            )}
          </button>
        </form>
      </div>
    </>
  );
};

export default ContactUsForm;
