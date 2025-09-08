import React, { useState, useEffect } from "react";
import Select from "react-select";
import "./wallet_topups.css";

export default function WalletTopupsDialog({ open, onClose, onSubmit }) {
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("");
  const [reference, setReference] = useState("");
  const [cardMethod, setCardMethod] = useState(null);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [amountError, setAmountError] = useState("");
  const [methodError, setMethodError] = useState("");
  const [referenceError, setReferenceError] = useState("");
  const [cardMethodError, setCardMethodError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (method === "card" && open) {
      const fetchMethods = async () => {
        try {
          const token = localStorage.getItem("user_token");
          const res = await fetch("https://back.al-balad.sa/payment-methods", {
            headers: { Authorization: `Bearer ${token}` },
          });
          const data = await res.json();
          if (data.status && Array.isArray(data.data) && data.data.length > 0) {
            const options = data.data.map((pm) => ({
              value: pm.id,
              label: pm.name,
              image: pm.image,
            }));
            setPaymentMethods(options);
            setCardMethod(options[0]);
          } else {
            setPaymentMethods([]);
            setCardMethod(null);
          }
        } catch {
          setPaymentMethods([]);
          setCardMethod(null);
        }
      };
      fetchMethods();
    }
  }, [method, open]);

  React.useEffect(() => {
    if (!open) setLoading(false);
  }, [open]);

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    let valid = true;
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      setAmountError("يرجى إدخال مبلغ صحيح");
      valid = false;
    } else {
      setAmountError("");
    }
    if (!method) {
      setMethodError("يرجى اختيار طريقة الدفع");
      valid = false;
    } else {
      setMethodError("");
    }
    if (method === "bank_transfer") {
      if (!reference.trim()) {
        setReferenceError("يرجى إدخال الرقم المرجعي للتحويل البنكي");
        valid = false;
      } else {
        setReferenceError("");
      }
    } else {
      setReferenceError("");
    }
    if (method === "card") {
      if (!cardMethod) {
        setCardMethodError("يرجى اختيار طريقة الدفع بالبطاقة");
        valid = false;
      } else {
        setCardMethodError("");
      }
    } else {
      setCardMethodError("");
    }
    if (!valid) return;
    setLoading(true);
    try {
      (await onSubmit) &&
        onSubmit({
          amount,
          method,
          reference: method === "bank_transfer" ? reference : undefined,
          card_method: method === "card" ? cardMethod.value : undefined,
        });
    } finally {
      setLoading(false);
    }
  };

  // custom option for react-select
  const formatOptionLabel = ({ label, image }) => (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <img
        src={image}
        alt={label}
        style={{
          width: 32,
          height: 32,
          borderRadius: 6,
          objectFit: "contain",
          background: "#fff",
          boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
        }}
      />
      <span>{label}</span>
    </div>
  );

  return (
    <div className="wallet-topup-overlay">
      <div className="wallet-topup-dialog">
        <button className="wallet-topup-close" onClick={onClose}>
          &times;
        </button>
        <h2 className="wallet-topup-title">شحن الرصيد</h2>
        {loading && (
          <div className="wallet-topup-loading-overlay">
            <span className="wallet-topup-spinner"></span>
          </div>
        )}
        <form
          className="wallet-topup-form"
          onSubmit={handleSubmit}
          style={
            loading ? { filter: "blur(1.5px)", pointerEvents: "none" } : {}
          }
        >
          <label className="wallet-topup-label">
            المبلغ <span style={{ color: "#e11d48" }}>*</span>
          </label>
          <input
            className="wallet-topup-input"
            type="number"
            min="1"
            placeholder="أدخل المبلغ المطلوب"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          {amountError && (
            <div className="wallet-topup-error">{amountError}</div>
          )}

          <label className="wallet-topup-label">
            طريقة الدفع <span style={{ color: "#e11d48" }}>*</span>
          </label>
          <div className="wallet-topup-methods">
            <label>
              <input
                type="radio"
                name="method"
                value="cash"
                checked={method === "cash"}
                onChange={() => setMethod("cash")}
              />
              نقدًا
            </label>
            <label>
              <input
                type="radio"
                name="method"
                value="bank_transfer"
                checked={method === "bank_transfer"}
                onChange={() => setMethod("bank_transfer")}
              />
              تحويل بنكي
            </label>
            <label>
              <input
                type="radio"
                name="method"
                value="card"
                checked={method === "card"}
                onChange={() => setMethod("card")}
              />
              بطاقة بنكية
            </label>
          </div>
          {methodError && (
            <div className="wallet-topup-error">{methodError}</div>
          )}

          {method === "bank_transfer" && (
            <>
              <label className="wallet-topup-label">
                الرقم المرجعي <span style={{ color: "#e11d48" }}>*</span>
              </label>
              <input
                className="wallet-topup-input"
                type="text"
                placeholder="أدخل الرقم المرجعي للتحويل البنكي"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
              />
              {referenceError && (
                <div className="wallet-topup-error">{referenceError}</div>
              )}
            </>
          )}

          {method === "card" && (
            <>
              <label className="wallet-topup-label">
                اختر طريقة الدفع بالبطاقة{" "}
                <span style={{ color: "#e11d48" }}>*</span>
              </label>
              <div className="wallet-topup-card-dropdown">
                <Select
                  options={paymentMethods}
                  value={cardMethod}
                  onChange={setCardMethod}
                  formatOptionLabel={formatOptionLabel}
                  isRtl
                  placeholder="اختر طريقة الدفع"
                  classNamePrefix="wallet-select"
                  styles={{
                    control: (base) => ({
                      ...base,
                      minHeight: 48,
                      borderRadius: 10,
                      fontSize: "1.05rem",
                      textAlign: "right",
                    }),
                    menu: (base) => ({
                      ...base,
                      zIndex: 9999,
                      textAlign: "right",
                    }),
                  }}
                />
              </div>
              {cardMethodError && (
                <div className="wallet-topup-error">{cardMethodError}</div>
              )}
            </>
          )}

          <button
            className="wallet-topup-submit"
            type="submit"
            disabled={loading}
          >
            تأكيد الشحن
          </button>
        </form>
      </div>
    </div>
  );
}
