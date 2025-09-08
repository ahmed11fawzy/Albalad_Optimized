import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import "./registerBuyerPage.css";
import LogoHeader from "../logoHeader";
import { useRegisterMutation } from "../../redux/Slices/authApi";
import { setAuthData } from "../../redux/Slices/globalData";
import registerBg from "../../assest/images/register-bg.jpeg";

export default function RegisterBuyerPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [register, { isLoading }] = useRegisterMutation();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    password_confirmation: "",
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
    setApiError("");
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "الاسم مطلوب";
    if (!form.email.trim()) newErrors.email = "البريد الإلكتروني مطلوب";
    else if (!/^\S+@\S+\.\S+$/.test(form.email))
      newErrors.email = "صيغة البريد الإلكتروني غير صحيحة";
    if (form.phone && !/^\d{8,15}$/.test(form.phone))
      newErrors.phone = "رقم الهاتف غير صحيح";
    if (!form.password) newErrors.password = "كلمة المرور مطلوبة";
    else if (form.password.length < 6)
      newErrors.password = "كلمة المرور يجب أن تكون 6 أحرف على الأقل";
    if (!form.password_confirmation)
      newErrors.password_confirmation = "تأكيد كلمة المرور مطلوب";
    else if (form.password !== form.password_confirmation)
      newErrors.password_confirmation = "كلمتا المرور غير متطابقتين";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");
    setSuccess(null);
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const result = await register({
        name: form.name,
        email: form.email,
        password: form.password,
        password_confirmation: form.password_confirmation,
        type: "customer",
      }).unwrap();

      if (!result.status) {
        setApiError(result.message || "حدث خطأ أثناء التسجيل");
        return;
      }

      setSuccess(result);

      // Store in localStorage
      if (result.data.id) localStorage.setItem("user_id", result.data.id);
      if (result.data.token)
        localStorage.setItem("user_token", result.data.token);

      // Update Redux state
      dispatch(
        setAuthData({
          user: result.data,
          userId: result.data.id,
          token: result.data.token,
          isLoggedIn: true,
        })
      );
      navigate("/");
    } catch (error) {
      console.error("Registration error:", error);
      if (error.data?.message) {
        setApiError(error.data.message);
      } else {
        setApiError("حدث خطأ في الاتصال بالخادم");
      }
    }
  };

  return (
    <>
      <LogoHeader />
      <div className="register-buyer-root">
        <div className="register-buyer-form-section">
          <h2 className="register-buyer-title">تسجيل حساب مشتري جديد</h2>
          <form
            className="register-buyer-form"
            onSubmit={handleSubmit}
            noValidate
          >
            <div className="register-buyer-field">
              <label>
                الاسم الكامل<span className="required">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                autoComplete="name"
              />
              {errors.name && (
                <div className="register-buyer-error">{errors.name}</div>
              )}
            </div>
            <div className="register-buyer-field">
              <label>
                البريد الإلكتروني<span className="required">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
              />
              {errors.email && (
                <div className="register-buyer-error">{errors.email}</div>
              )}
            </div>
            <div className="register-buyer-field">
              <label>رقم الجوال</label>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                autoComplete="tel"
              />
              {errors.phone && (
                <div className="register-buyer-error">{errors.phone}</div>
              )}
            </div>
            <div className="register-buyer-field">
              <label>
                كلمة المرور<span className="required">*</span>
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                autoComplete="new-password"
              />
              {errors.password && (
                <div className="register-buyer-error">{errors.password}</div>
              )}
            </div>
            <div className="register-buyer-field">
              <label>
                تأكيد كلمة المرور<span className="required">*</span>
              </label>
              <input
                type="password"
                name="password_confirmation"
                value={form.password_confirmation}
                onChange={handleChange}
                autoComplete="new-password"
              />
              {errors.password_confirmation && (
                <div className="register-buyer-error">
                  {errors.password_confirmation}
                </div>
              )}
            </div>
            {apiError && (
              <div className="register-buyer-api-error">{apiError}</div>
            )}
            <button
              className="register-buyer-submit-btn"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="register-buyer-loader"></span>
              ) : (
                "تسجيل"
              )}
            </button>
          </form>
          <div className="register-buyer-social-login">
            <button
              type="button"
              className="register-buyer-social-btn-wide google"
              title="التسجيل عبر جوجل"
            >
              <span className="social-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <g>
                    <path
                      d="M21.805 10.023h-9.765v3.977h5.617c-.242 1.242-1.484 3.648-5.617 3.648-3.383 0-6.148-2.797-6.148-6.25s2.765-6.25 6.148-6.25c1.93 0 3.227.82 3.969 1.523l2.715-2.648c-1.711-1.57-3.922-2.523-6.684-2.523-5.523 0-10 4.477-10 10s4.477 10 10 10c5.742 0 9.547-4.023 9.547-9.695 0-.652-.07-1.148-.156-1.477z"
                      fill="#EA4335"
                    />
                    <path
                      d="M3.153 7.345l3.285 2.409c.891-1.797 2.578-2.954 4.602-2.954 1.125 0 2.148.391 2.953 1.031l2.727-2.648c-1.711-1.57-3.922-2.523-6.684-2.523-3.242 0-6.016 1.797-7.547 4.438z"
                      fill="#34A853"
                    />
                    <path
                      d="M12.04 22c2.672 0 4.922-.883 6.563-2.406l-3.031-2.484c-.828.578-1.891.922-3.531.922-2.734 0-5.055-1.844-5.891-4.336l-3.242 2.5c1.523 3.008 4.734 5.004 9.132 5.004z"
                      fill="#4A90E2"
                    />
                    <path
                      d="M21.805 10.023h-9.765v3.977h5.617c-.242 1.242-1.484 3.648-5.617 3.648-3.383 0-6.148-2.797-6.148-6.25s2.765-6.25 6.148-6.25c1.93 0 3.227.82 3.969 1.523l2.715-2.648c-1.711-1.57-3.922-2.523-6.684-2.523-5.523 0-10 4.477-10 10s4.477 10 10 10c5.742 0 9.547-4.023 9.547-9.695 0-.652-.07-1.148-.156-1.477z"
                      fill="#FBBC05"
                    />
                  </g>
                </svg>
              </span>
              <span>
                المتابعة باستخدام <span className="provider">Google</span>
              </span>
            </button>
            <button
              type="button"
              className="register-buyer-social-btn-wide facebook"
              title="التسجيل عبر فيسبوك"
            >
              <span className="social-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M22.675 0h-21.35C.595 0 0 .592 0 1.326v21.348C0 23.408.595 24 1.325 24h11.495v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116C23.406 24 24 23.408 24 22.674V1.326C24 .592 23.406 0 22.675 0"
                    fill="#1877F3"
                  />
                  <path
                    d="M16.671 24v-9.294h3.12l.467-3.622h-3.587v-2.313c0-1.048.293-1.763 1.797-1.763l1.918-.001v-3.24c-.334-.044-1.472-.143-2.797-.143-2.766 0-4.659 1.688-4.659 4.788v2.127H9.692v3.622h3.128V24h3.851z"
                    fill="#fff"
                  />
                </svg>
              </span>
              <span>
                المتابعة باستخدام <span className="provider">Facebook</span>
              </span>
            </button>
          </div>
          <div className="register-buyer-login-link">
            لديك حساب بالفعل؟ <a href="/login">تسجيل الدخول</a>
          </div>
        </div>
        <div className="register-buyer-image-section">
          <div className="register-buyer-image-bg">
            <img
              src={registerBg}
              alt="register-illustration"
              className="register-buyer-illustration-img"
            />
          </div>
        </div>
      </div>
    </>
  );
}
