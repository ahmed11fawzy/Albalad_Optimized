import React, { useState, useEffect } from "react";
import "./wallet_transfer.css";

export default function WalletTransferDialog({ open, onClose, onSubmit }) {
  const [amount, setAmount] = useState("");
  const [code, setCode] = useState("");
  const [amountError, setAmountError] = useState("");
  const [codeError, setCodeError] = useState("");
  const [loading, setLoading] = useState(false);
  const [topMsg, setTopMsg] = useState(null);

  useEffect(() => {
    if (!open) {
      setAmount("");
      setCode("");
      setAmountError("");
      setCodeError("");
      setTopMsg(null);
      setLoading(false);
    }
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
    if (!code.trim()) {
      setCodeError("يرجى إدخال كود محفظة المستلم");
      valid = false;
    } else {
      setCodeError("");
    }
    if (!valid) return;
    setLoading(true);
    setTopMsg(null);
    try {
      const result = await onSubmit && onSubmit({ amount, code });
      // if (result && result.status) {
      //   setTopMsg({ type: "success", text: result.data.message || "تمت عملية التحويل بنجاح!" });
      //   setTimeout(() => {
      //     setTopMsg(null);
      //     setLoading(false);
      //     onClose && onClose();
      //   }, 1800);
      // } else {
      //   setTopMsg({ type: "error", text: result && result.message ? result.message : "فشل في عملية التحويل" });
      //   setLoading(false);
      // }
    } catch (e) {
      setTopMsg({ type: "error", text: "حدث خطأ أثناء عملية التحويل" });
      setLoading(false);
    }
  };

  return (
    <div className="wallet-transfer-overlay">
      <div className="wallet-transfer-dialog">
        <button className="wallet-transfer-close" onClick={onClose}>&times;</button>
        <h2 className="wallet-transfer-title">تحويل الأموال</h2>
        {loading && (
          <div className="wallet-transfer-loading-overlay">
            <span className="wallet-transfer-spinner"></span>
          </div>
        )}
        {topMsg && (
          <div className={`wallet-transfer-topmsg ${topMsg.type}`}>{topMsg.text}</div>
        )}
        <form className="wallet-transfer-form" onSubmit={handleSubmit} style={loading ? {filter:'blur(1.5px)',pointerEvents:'none'} : {}}>
          <label className="wallet-transfer-label">المبلغ <span style={{color:'#e11d48'}}>*</span></label>
          <input
            className="wallet-transfer-input"
            type="number"
            min="1"
            placeholder="أدخل المبلغ المطلوب تحويله"
            value={amount}
            onChange={e => setAmount(e.target.value)}
          />
          {amountError && <div className="wallet-transfer-error">{amountError}</div>}

          <label className="wallet-transfer-label">كود محفظة المستلم <span style={{color:'#e11d48'}}>*</span></label>
          <input
            className="wallet-transfer-input"
            type="text"
            placeholder="أدخل كود محفظة المستلم"
            value={code}
            onChange={e => setCode(e.target.value)}
          />
          {codeError && <div className="wallet-transfer-error">{codeError}</div>}

          <button className="wallet-transfer-submit" type="submit" disabled={loading}>
            تأكيد التحويل
          </button>
        </form>
      </div>
    </div>
  );
} 