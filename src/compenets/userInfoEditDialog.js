import React, { useEffect, useState } from "react";
import "./userInfoEdit.css";
import { FaCamera } from "react-icons/fa";

export default function UserInfoEditDialog({ open, onClose }) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", avatar: "" });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({ name: "", email: "" });
  const [saving, setSaving] = useState(false);
  const [resultMsg, setResultMsg] = useState({ type: "", text: "" });

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    setError("");
    const userToken = localStorage.getItem("user_token");
    if (!userToken) {
      setError("يجب تسجيل الدخول");
      setLoading(false);
      return;
    }
    fetch("https://back.al-balad.sa/profile", {
      headers: { Authorization: `Bearer ${userToken}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data && data.data) {
          setForm({
            name: data.data.name || "",
            email: data.data.email || "",
            avatar: data.data.avatar || "",
          });
          // setAvatarPreview(data.data.avatar || '');
          setAvatarFile(null);
        } else {
          setError("تعذر جلب البيانات");
        }
      })
      .catch(() => setError("تعذر الاتصال بالخادم"))
      .finally(() => setLoading(false));
  }, [open]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validate = () => {
    let valid = true;
    const errors = { name: "", email: "" };
    if (!form.name.trim()) {
      errors.name = "الاسم مطلوب";
      valid = false;
    }
    if (!form.email.trim()) {
      errors.email = "البريد الإلكتروني مطلوب";
      valid = false;
    } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      errors.email = "صيغة البريد الإلكتروني غير صحيحة";
      valid = false;
    }
    setFieldErrors(errors);
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    setResultMsg({ type: "", text: "" });
    const userToken = localStorage.getItem("user_token");
    if (!userToken) {
      setResultMsg({ type: "error", text: "يجب تسجيل الدخول" });
      setSaving(false);
      return;
    }
    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("email", form.email);
    if (avatarFile) {
      formData.append("avatar", avatarFile);
    }
    try {
      const response = await fetch("https://back.al-balad.sa/profile/update", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
        body: formData,
      });
      const data = await response.json();
      if (data.status) {
        setResultMsg({ type: "success", text: "تم تحديث البيانات بنجاح" });
        setTimeout(() => {
          setResultMsg({ type: "", text: "" });
          onClose();
        }, 1500);
      } else {
        setResultMsg({
          type: "error",
          text: data.message || "فشل في تحديث البيانات",
        });
      }
    } catch {
      setResultMsg({ type: "error", text: "حدث خطأ أثناء الاتصال بالخادم" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={`user-info-edit-dialog-backdrop${open ? " open" : ""}`}>
      <div className="user-info-edit-dialog">
        <button
          className="user-info-edit-close-btn"
          onClick={onClose}
          title="إغلاق"
        >
          ×
        </button>
        <h2 className="user-info-edit-title">تعديل بيانات الحساب</h2>
        {loading ? (
          <div className="user-info-edit-spinner-container">
            <span className="user-info-edit-spinner"></span>
          </div>
        ) : error ? (
          <div className="user-info-edit-error">{error}</div>
        ) : (
          <>
            {resultMsg.text && (
              <div className={`user-info-edit-result-msg ${resultMsg.type}`}>
                {resultMsg.text}
              </div>
            )}
            <form
              className="user-info-edit-form"
              onSubmit={handleSubmit}
              noValidate
            >
              <div className="user-info-edit-avatar-row">
                <div className="user-info-edit-avatar-center">
                  <img
                    src={
                      avatarPreview
                        ? avatarPreview
                        : form.avatar
                        ? `https://back.al-balad.sa/albalad/v1.0/uploads/users/avatars/${form.avatar}`
                        : "https://www.gravatar.com/avatar/?d=mp"
                    }
                    alt="صورة المستخدم"
                    className="user-info-edit-avatar"
                  />
                  <label className="user-info-edit-avatar-upload-btn">
                    <FaCamera className="user-info-edit-avatar-upload-icon" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      style={{ display: "none" }}
                    />
                  </label>
                </div>
              </div>
              <div className="user-info-edit-field">
                <label>الاسم</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className={`user-info-edit-input${
                    fieldErrors.name ? " error" : ""
                  }`}
                  required
                />
                {fieldErrors.name && (
                  <div className="user-info-edit-field-error">
                    {fieldErrors.name}
                  </div>
                )}
              </div>
              <div className="user-info-edit-field">
                <label>البريد الإلكتروني</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className={`user-info-edit-input${
                    fieldErrors.email ? " error" : ""
                  }`}
                  required
                />
                {fieldErrors.email && (
                  <div className="user-info-edit-field-error">
                    {fieldErrors.email}
                  </div>
                )}
              </div>
              <div className="user-info-edit-actions">
                <button
                  type="submit"
                  className="user-info-edit-save-btn"
                  disabled={saving}
                >
                  {saving ? (
                    <span className="user-info-edit-btn-spinner"></span>
                  ) : (
                    "حفظ التعديلات"
                  )}
                </button>
                <button
                  type="button"
                  className="user-info-edit-cancel-btn"
                  onClick={onClose}
                  disabled={saving}
                >
                  إلغاء
                </button>
              </div>
              <button type="button" className="user-info-edit-password-btn">
                تغيير كلمة المرور
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
