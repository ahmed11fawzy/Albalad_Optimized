import React, { useState } from "react";
import { useDispatch } from "react-redux";
import "./loginDialog.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTimes,
  faCheckCircle,
  faTag,
  faEye,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";
import {
  faApple,
  faGoogle,
  faFacebookF,
  faXTwitter,
} from "@fortawesome/free-brands-svg-icons";
import { useLoginMutation } from "../../redux/Slices/authApi";
import { setAuthData } from "../../redux/Slices/globalData";

export default function LoginDialog({ open, onClose }) {
  const dispatch = useDispatch();
  const [login, { isLoading }] = useLoginMutation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState({ email: false, password: false });
  const [error, setError] = useState({ email: "", password: "" });
  const [apiError, setApiError] = useState("");

  if (!open) return null;

  const validate = () => {
    let err = { email: "", password: "" };
    if (!email) err.email = "البريد الإلكتروني أو رقم الهاتف مطلوب";
    else if (!/^([\w-.]+@([\w-]+\.)+[\w-]{2,4}|\d{8,15})$/.test(email))
      err.email = "يرجى إدخال بريد إلكتروني أو رقم هاتف صحيح";
    if (!password) err.password = "كلمة المرور مطلوبة";
    else if (password.length < 6)
      err.password = "كلمة المرور يجب أن تكون 6 أحرف على الأقل";
    setError(err);
    return !err.email && !err.password;
  };

  const handleContinue = async (e) => {
    e.preventDefault();
    setTouched({ email: true, password: true });
    setApiError("");
    if (!validate()) return;

    let sessionId = localStorage.getItem("session_id");
    if (!sessionId) sessionId = null;

    try {
      const result = await login({
        email,
        password,
        user_id: sessionId,
      }).unwrap();

      if (result.status && result.data.id && result.data.token) {
        // Store in localStorage
        localStorage.setItem("user_id", result.data.id);
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

        onClose();
        window.location.reload();
      } else {
        setApiError(
          "البريد الإلكتروني أو كلمة المرور غير صحيحة. يرجى المحاولة مرة أخرى."
        );
      }
    } catch (error) {
      console.error("Login error:", error);
      if (error.data?.message) {
        setApiError(error.data.message);
      } else {
        setApiError("حدث خطأ أثناء تسجيل الدخول. يرجى المحاولة لاحقاً.");
      }
    }
  };

  return (
    <div className="login-dialog-overlay">
      <div className="login-dialog-container" dir="rtl">
        <button className="login-dialog-close" onClick={onClose}>
          <FontAwesomeIcon icon={faTimes} />
        </button>
        <div className="login-dialog-title">تسجيل/تسجيل الدخول</div>
        <div className="login-dialog-secure">
          معلوماتك محمية{" "}
          <FontAwesomeIcon
            icon={faCheckCircle}
            className="login-dialog-secure-icon"
          />
        </div>
        <div className="login-dialog-offer">
          <FontAwesomeIcon icon={faTag} /> المتسوقين الجدد يحصلون على خصم حتى
          %70
        </div>
        <form className="login-dialog-form" onSubmit={handleContinue}>
          <input
            className={`login-dialog-input${
              touched.email && error.email ? " error" : ""
            }`}
            type="text"
            placeholder="البريد الإلكتروني أو رقم الهاتف"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, email: true }))}
          />
          {touched.email && error.email && (
            <div className="login-dialog-error">{error.email}</div>
          )}
          <div
            className="login-dialog-password-wrapper"
            style={{ width: "100%" }}
          >
            <input
              className={`login-dialog-input${
                touched.password && error.password ? " error" : ""
              }`}
              style={{ width: "100%", paddingLeft: "40px", direction: "rtl" }}
              type={showPassword ? "text" : "password"}
              placeholder="كلمة المرور"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, password: true }))}
            />
            <span
              className="login-dialog-eye"
              style={{ left: "12px", right: "unset" }}
              onClick={() => setShowPassword((s) => !s)}
            >
              <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
            </span>
          </div>
          {touched.password && error.password && (
            <div className="login-dialog-error">{error.password}</div>
          )}
          {apiError && (
            <div
              className="login-dialog-error"
              style={{
                textAlign: "center",
                margin: "8px 0",
                fontWeight: "bold",
                color: "#b71c1c",
                background: "#fff0f0",
                borderRadius: "6px",
                padding: "8px 0",
              }}
            >
              {apiError}
            </div>
          )}
          <button
            className="login-dialog-continue"
            type="submit"
            disabled={isLoading}
          >
            مواصلة
          </button>
        </form>
        {isLoading && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 2000,
              background: "rgba(255,255,255,0.01)",
            }}
          >
            <span
              style={{
                display: "inline-block",
                width: "32px",
                height: "32px",
                border: "3px solid #e1251b",
                borderTop: "3px solid #fff",
                borderRadius: "50%",
                animation: "spin 0.8s linear infinite",
                background: "#fff",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              }}
            ></span>
            <style>{`@keyframes spin { 0% { transform: rotate(0deg);} 100% { transform: rotate(360deg);} }`}</style>
          </div>
        )}
        <div className="login-dialog-help">هل هناك مشكلة بتسجيل الدخول؟</div>
        <div className="login-dialog-or">أو تواصل مع</div>
        <div className="login-dialog-socials">
          <span>
            <FontAwesomeIcon icon={faApple} />
          </span>
          <span>
            <FontAwesomeIcon icon={faXTwitter} />
          </span>
          <span>
            <FontAwesomeIcon icon={faFacebookF} />
          </span>
          <span>
            <FontAwesomeIcon icon={faGoogle} />
          </span>
        </div>
        <div className="login-dialog-country">
          <b>Saudi Arabia</b> :الموقع الجغرافي
        </div>
        <div className="login-dialog-terms">
          بإستمرارك، فإنك تؤكد أنك بلغت، وأنك قد قرأت ووافقت على اتفاقية عضوية{" "}
          <a href="#">البلد</a> المعدلة و سياسة الخصوصية لدينا
        </div>
        <div className="login-dialog-why">لماذا تختار موقعنا؟</div>
      </div>
    </div>
  );
}
