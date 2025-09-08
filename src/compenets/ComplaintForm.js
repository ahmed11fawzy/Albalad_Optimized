// ComplaintForm.jsx
import React, { useState, useRef } from 'react';
import '../css/ComplaintForm.css';

const COMPLAINT_TYPES = [
  'مشكلة في الشحن',
  'منتج خاطئ',
  'بائع غير متعاون',
  'غير ذلك',
];

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const ComplaintForm = () => {
  const [files, setFiles] = useState([]);
  const [form, setForm] = useState({
    name: '',
    email: '',
    order: '',
    store: '',
    type: '',
    title: '',
    details: '',
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = 'الاسم مطلوب';
    if (!form.email.trim()) newErrors.email = 'البريد الإلكتروني مطلوب';
    else if (!emailRegex.test(form.email.trim())) newErrors.email = 'صيغة البريد الإلكتروني غير صحيحة';
    if (!form.type) newErrors.type = 'يرجى اختيار نوع الشكوى';
    if (!form.title.trim()) newErrors.title = 'عنوان الشكوى مطلوب';
    if (!form.details.trim()) newErrors.details = 'تفاصيل الشكوى مطلوبة';
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
      setForm({
        name: '',
        email: '',
        order: '',
        store: '',
        type: '',
        title: '',
        details: '',
      });
      setFiles([]);
      setErrors({});
      if (containerRef.current) {
        containerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 1200);
  };

  return (
    <div className="complaint-form-container" ref={containerRef}>
      {success && (
        <div className="complaint-form-success">تم إرسال نموذج الشكوى بنجاح</div>
      )}
      <h2 className="complaint-form-title">تقديم شكوى</h2>
      <form className="complaint-form-form" onSubmit={handleSubmit} noValidate>
        <div className="complaint-form-row">
          <div className="complaint-form-group">
            <label className="complaint-form-label">الاسم الكامل</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="ادخل اسمك الكامل"
              className="complaint-form-input"
            />
            {errors.name && <span className="complaint-form-error">{errors.name}</span>}
          </div>
          <div className="complaint-form-group">
            <label className="complaint-form-label">عنوان البريد الإلكتروني</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="ضع عنوان بريدك الإلكتروني"
              className="complaint-form-input"
            />
            {errors.email && <span className="complaint-form-error">{errors.email}</span>}
          </div>
        </div>

        <div className="complaint-form-row">
          <div className="complaint-form-group">
            <label className="complaint-form-label">رقم الطلب (اختياري)</label>
            <input
              type="text"
              name="order"
              value={form.order}
              onChange={handleChange}
              placeholder="ادخل رقم الطلب"
              className="complaint-form-input"
            />
          </div>
          <div className="complaint-form-group">
            <label className="complaint-form-label">اسم المتجر/البائع (اختياري)</label>
            <input
              type="text"
              name="store"
              value={form.store}
              onChange={handleChange}
              placeholder="ادخل اسم المتجر أو البائع"
              className="complaint-form-input"
            />
          </div>
        </div>

        <div className="complaint-form-group">
          <label className="complaint-form-label">نوع الشكوى</label>
          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            className="complaint-form-input"
          >
            <option value="">حدد نوع الشكوى</option>
            {COMPLAINT_TYPES.map((type, idx) => (
              <option key={idx} value={type}>{type}</option>
            ))}
          </select>
          {errors.type && <span className="complaint-form-error">{errors.type}</span>}
        </div>

        <div className="complaint-form-group">
          <label className="complaint-form-label">عنوان الشكوى</label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="ادخل عنواناً موجزاً للشكوى"
            className="complaint-form-input"
          />
          {errors.title && <span className="complaint-form-error">{errors.title}</span>}
        </div>

        <div className="complaint-form-group">
          <label className="complaint-form-label">تفاصيل الشكوى</label>
          <textarea
            name="details"
            value={form.details}
            onChange={handleChange}
            placeholder="صف شكواك بالتفصيل"
            className="complaint-form-input"
            style={{ minHeight: '100px', resize: 'vertical' }}
          ></textarea>
          {errors.details && <span className="complaint-form-error">{errors.details}</span>}
        </div>

        <div className="complaint-form-group complaint-form-file-upload">
          <label className="complaint-form-upload-title">المرفقات</label>
          <p className="complaint-form-upload-note">(JPG, PNG) اسحب وأفلت أو انقر لتحميل الملفات</p>
          <label htmlFor="fileInput" className="complaint-form-upload-button">تحميل الملفات</label>
          <input
            id="fileInput"
            type="file"
            multiple
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />

          <div className="complaint-form-preview-container">
            {files.map((file, index) => (
              <img
                key={index}
                src={URL.createObjectURL(file)}
                alt={`attachment-${index}`}
                className="complaint-form-preview-image"
              />
            ))}
          </div>
        </div>

        <button type="submit" className="complaint-form-submit" disabled={loading}>
          {loading ? (
            <span className="complaint-form-spinner"></span>
          ) : (
            'إرسال'
          )}
        </button>
      </form>
    </div>
  );
};

export default ComplaintForm;
