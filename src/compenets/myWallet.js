import React, { useEffect, useState } from "react";
import "./myWallet.css";
import WalletTopupsDialog from "./wallet_topups";
import WalletTransferDialog from "./wallet_transfer";

export default function MyWallet() {
  const [wallet, setWallet] = useState(null);
  const [walletCode, setWalletCode] = useState("");
  const [showCode, setShowCode] = useState(false);
  const [copyStatus, setCopyStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [topupOpen, setTopupOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [toastType, setToastType] = useState("success");
  const [rechargeTransactions, setRechargeTransactions] = useState([]);
  const [transferOpen, setTransferOpen] = useState(false);
  const [transferTransactions, setTransferTransactions] = useState([]);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setErrorMsg("");
      try {
        const userToken = localStorage.getItem("user_token");
        if (!userToken)
          throw new Error(
            "لم يتم العثور على رمز الدخول. يرجى تسجيل الدخول أولاً."
          );
        const headers = { Authorization: `Bearer ${userToken}` };
        // Wallet data
        const walletRes = await fetch(
          "https://back.al-balad.sa/albalad/v1.0/customer/wallets",
          { headers }
        );
        const walletData = await walletRes.json();
        if (!walletData.status)
          throw new Error(walletData.message || "فشل جلب بيانات المحفظة");
        setWallet(walletData.data);
        // Wallet code
        const codeRes = await fetch(
          "https://back.al-balad.sa/albalad/v1.0/customer/wallets/get-code",
          { headers }
        );
        let codeData;
        const contentType = codeRes.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const json = await codeRes.json();
          if (!json || json.status === false)
            throw new Error(json.message || "فشل جلب كود المحفظة");
          codeData = json.data || "";
        } else {
          codeData = await codeRes.text();
        }
        setWalletCode(codeData);
        // Wallet topups
        const topupsRes = await fetch(
          "https://back.al-balad.sa/albalad/v1.0/customer/wallet-topups",
          { headers }
        );
        const topupsData = await topupsRes.json();
        if (topupsData.status && Array.isArray(topupsData.data)) {
          setRechargeTransactions(topupsData.data);
        } else {
          setRechargeTransactions([]);
        }
        // Wallet transfers
        const transfersRes = await fetch(
          "https://back.al-balad.sa/albalad/v1.0/customer/wallet-transfers",
          { headers }
        );
        const transfersData = await transfersRes.json();
        if (transfersData.status && Array.isArray(transfersData.data)) {
          setTransferTransactions(transfersData.data);
        } else {
          setTransferTransactions([]);
        }
      } catch (e) {
        setWallet(null);
        setWalletCode("");
        setErrorMsg(e.message || "حدث خطأ غير متوقع أثناء جلب البيانات");
        setRechargeTransactions([]);
        setTransferTransactions([]);
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  // Get user name from localStorage if available
  const userName = localStorage.getItem("user_name") || "اسم العميل";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(walletCode);
      setCopyStatus("تم نسخ كود المحفظة بنجاح!");
    } catch {
      setCopyStatus("فشل النسخ");
    }
    setTimeout(() => setCopyStatus(""), 2000);
  };

  // تحديث بيانات المحفظة بعد الشحن أو التحويل
  const reloadWallet = () => {
    setLoading(true);
    setErrorMsg("");
    async function fetchData() {
      try {
        const userToken = localStorage.getItem("user_token");
        if (!userToken)
          throw new Error(
            "لم يتم العثور على رمز الدخول. يرجى تسجيل الدخول أولاً."
          );
        const headers = { Authorization: `Bearer ${userToken}` };
        // Wallet data
        const walletRes = await fetch(
          "https://back.al-balad.sa/albalad/v1.0/customer/wallets",
          { headers }
        );
        const walletData = await walletRes.json();
        if (!walletData.status)
          throw new Error(walletData.message || "فشل جلب بيانات المحفظة");
        setWallet(walletData.data);
        // Wallet code
        const codeRes = await fetch(
          "https://back.al-balad.sa/albalad/v1.0/customer/wallets/get-code",
          { headers }
        );
        let codeData;
        const contentType = codeRes.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const json = await codeRes.json();
          if (!json || json.status === false)
            throw new Error(json.message || "فشل جلب كود المحفظة");
          codeData = json.data || "";
        } else {
          codeData = await codeRes.text();
        }
        setWalletCode(codeData);
        // Wallet topups
        const topupsRes = await fetch(
          "https://back.al-balad.sa/albalad/v1.0/customer/wallet-topups",
          { headers }
        );
        const topupsData = await topupsRes.json();
        if (topupsData.status && Array.isArray(topupsData.data)) {
          setRechargeTransactions(topupsData.data);
        } else {
          setRechargeTransactions([]);
        }
        // Wallet transfers
        const transfersRes = await fetch(
          "https://back.al-balad.sa/albalad/v1.0/customer/wallet-transfers",
          { headers }
        );
        const transfersData = await transfersRes.json();
        if (transfersData.status && Array.isArray(transfersData.data)) {
          setTransferTransactions(transfersData.data);
        } else {
          setTransferTransactions([]);
        }
      } catch (e) {
        setWallet(null);
        setWalletCode("");
        setErrorMsg(e.message || "حدث خطأ غير متوقع أثناء جلب البيانات");
        setRechargeTransactions([]);
        setTransferTransactions([]);
      }
      setLoading(false);
    }
    fetchData();
  };

  const handleTopup = async ({ amount, method, reference, card_method }) => {
    try {
      const userToken = localStorage.getItem("user_token");
      const headers = {
        Authorization: `Bearer ${userToken}`,
        "Content-Type": "application/json",
      };
      const payload = {
        amount: parseFloat(amount),
        method,
        payment_method_id: method === "card" ? Number(card_method) : null,
        reference: reference || null,
      };
      const res = await fetch(
        "https://back.al-balad.sa/albalad/v1.0/customer/wallet-topups/store",
        {
          method: "POST",
          headers,
          body: JSON.stringify(payload),
        }
      );
      const data = await res.json();
      if (data.status) {
        setToastMsg("تم شحن الرصيد بنجاح!");
        setToastType("success");
        // إرجاع رسالة النجاح
        return { success: true, message: "تم شحن الرصيد بنجاح!" };
      } else {
        setToastMsg(data.message || "فشل في شحن الرصيد");
        setToastType("error");
        return { success: false, message: data.message || "فشل في شحن الرصيد" };
      }
    } catch (e) {
      setToastMsg("حدث خطأ أثناء شحن الرصيد");
      setToastType("error");
      return { success: false, message: "حدث خطأ أثناء شحن الرصيد" };
    }
  };

  const handleTransfer = async ({ amount, code }) => {
    try {
      const userToken = localStorage.getItem("user_token");
      const headers = {
        Authorization: `Bearer ${userToken}`,
        "Content-Type": "application/json",
      };
      const payload = { amount: parseFloat(amount), code };
      const res = await fetch(
        "https://back.al-balad.sa/albalad/v1.0/customer/wallet-transfers/store",
        {
          method: "POST",
          headers,
          body: JSON.stringify(payload),
        }
      );
      const data = await res.json();
      if (data.status) {
        setToastMsg("تمت عملية التحويل بنجاح!");
        setToastType("success");
        setTimeout(() => {
          setToastMsg("");
          setTransferOpen(false);
          reloadWallet();
        }, 1800);
        return {
          success: true,
          message: data.message || "تمت عملية التحويل بنجاح!",
        };
      } else {
        setToastMsg(data.message || "فشل في عملية التحويل");
        setToastType("error");
        // لا تغلق الديالوج ولا تعيد تحميل البيانات
        console.error("خطأ التحويل:", data.message, data);
        return {
          success: false,
          message: data.message || "فشل في عملية التحويل",
        };
      }
    } catch (e) {
      setToastMsg("حدث خطأ أثناء عملية التحويل");
      setToastType("error");
      console.error("استثناء أثناء التحويل:", e);
      return { success: false, message: "حدث خطأ أثناء عملية التحويل" };
    }
  };

  if (loading) {
    return (
      <div className="wallet-loading">
        <div className="loader"></div>جاري تحميل بيانات المحفظة...
      </div>
    );
  }

  if (errorMsg) {
    return <div className="wallet-error">{errorMsg}</div>;
  }

  if (!wallet) {
    return <div className="wallet-error">تعذر تحميل بيانات المحفظة</div>;
  }

  return (
    <div className="wallet-modern-bg container-under-header-fixed">
      {toastMsg && (
        <div
          className={`wallet-copy-toast${
            toastType === "error" ? " error" : ""
          }`}
        >
          {toastMsg}
        </div>
      )}
      <div className="wallet-modern-card">
        {/* خلفيات دائرية شفافة */}
        <div className="wallet-bg-circle wallet-bg-circle-top"></div>
        <div className="wallet-bg-circle wallet-bg-circle-bottom"></div>
        <h2 className="wallet-modern-title">محفظتي</h2>
        <div className="wallet-modern-balance-row">
          <div>
            <p className="wallet-modern-balance-label">الرصيد</p>
            <p className="wallet-modern-balance-value">
              {wallet.balance} {wallet.currency?.code || "SAR"}
            </p>
          </div>
          <div className="wallet-modern-balance-icon">
            {/* SVG icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="wallet-modern-balance-svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>
        <div className="wallet-modern-info-list">
          <div className="wallet-modern-info-row">
            <span className="wallet-modern-info-label">الحالة: </span>
            <span className="wallet-modern-status-badge wallet-modern-status-active">
              {wallet.status === "active" ? "نشط" : wallet.status}
            </span>
          </div>
          <div className="wallet-modern-info-row">
            <span className="wallet-modern-info-label">كود المحفظة</span>
            <div className="wallet-modern-code-group">
              <span className="wallet-modern-code-value">
                {showCode ? walletCode : "••••••••••••••"}
              </span>
              <button
                onClick={handleCopy}
                className="wallet-modern-code-btn"
                title="نسخ الكود"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z" />
                  <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z" />
                </svg>
              </button>
              <button
                onClick={() => setShowCode((v) => !v)}
                className="wallet-modern-code-btn"
                title={showCode ? "إخفاء" : "إظهار"}
              >
                {showCode ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.469 7.469 0 0 0-2.797.588l.771.771A6.942 6.942 0 0 1 8 2.5c5 0 8 5.5 8 5.5s-.939 1.721-2.641 3.238l-.771-.771zm-1.445-1.342L14.4 12.4a7.471 7.471 0 0 1-2.485.948l-.234-.234zM5.354 5.354a.5.5 0 0 1 .707 0L8 7.293l1.947-1.947a.5.5 0 1 1 .707.707L8.707 8l1.947 1.947a.5.5 0 0 1-.707.707L8 8.707l-1.947 1.947a.5.5 0 0 1-.707-.707L7.293 8 5.354 6.053a.5.5 0 0 1 0-.707z" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8a13.134 13.134 0 0 1-1.66 2.043C11.879 11.332 10.12 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z" />
                    <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
          <div className="wallet-modern-info-row">
            <span className="wallet-modern-info-label">المالك: </span>
            <span>{userName}</span>
          </div>
        </div>
      </div>

      {/* أزرار العمليات */}
      <div className="wallet-modern-actions">
        <button
          className="wallet-modern-action-btn charge"
          onClick={() => setTopupOpen(true)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            fill="currentColor"
            viewBox="0 0 16 16"
          >
            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
            <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
          </svg>
          شحن الرصيد
        </button>
        <button
          className="wallet-modern-action-btn transfer"
          onClick={() => setTransferOpen(true)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            fill="currentColor"
            viewBox="0 0 16 16"
          >
            <path
              fillRule="evenodd"
              d="M1 11.5a.5.5 0 0 0 .5.5h11.793l-3.147 3.146a.5.5 0 0 0 .708.708l4-4a.5.5 0 0 0 0-.708l-4-4a.5.5 0 0 0-.708.708L13.293 11H1.5a.5.5 0 0 0-.5.5zm14-7a.5.5 0 0 1-.5.5H2.707l3.147 3.146a.5.5 0 1 1-.708.708l-4-4a.5.5 0 0 1 0-.708l4-4a.5.5 0 1 1 .708.708L2.707 4H14.5a.5.5 0 0 1 .5.5z"
            />
          </svg>
          تحويل الأموال
        </button>
      </div>

      {/* جداول العمليات */}
      <div className="wallet-modern-tables">
        <div className="wallet-modern-table-section">
          <h3 className="wallet-modern-table-title">عمليات الشحن</h3>
          <div className="wallet-modern-table-wrapper">
            <table className="wallet-modern-table">
              <thead>
                <tr>
                  <th>التاريخ</th>
                  <th>القيمة</th>
                  <th>الحالة</th>
                </tr>
              </thead>
              <tbody>
                {rechargeTransactions.length === 0 ? (
                  <tr>
                    <td
                      colSpan="3"
                      style={{ textAlign: "center", color: "#888" }}
                    >
                      لا توجد عمليات شحن
                    </td>
                  </tr>
                ) : (
                  rechargeTransactions.map((tx) => (
                    <tr key={tx.id}>
                      <td>
                        {new Date(tx.created_at).toLocaleString("ar-EG", {
                          dateStyle: "short",
                          timeStyle: "short",
                        })}
                      </td>
                      <td className={"wallet-modern-amount-plus"}>
                        +
                        {parseFloat(tx.amount).toLocaleString("ar-EG", {
                          minimumFractionDigits: 2,
                        })}{" "}
                        {wallet.currency?.code || "SAR"}
                      </td>
                      <td>
                        <span
                          className={`wallet-modern-status-badge ${
                            tx.status === "completed" ||
                            tx.status === "success" ||
                            tx.status === "نجاح"
                              ? "wallet-modern-status-active"
                              : tx.status === "pending" || tx.status === "معلق"
                              ? "wallet-modern-status-pending"
                              : "wallet-modern-status-failed"
                          }`}
                        >
                          {tx.status === "completed" || tx.status === "success"
                            ? "نجاح"
                            : tx.status === "pending"
                            ? "معلق"
                            : tx.status === "failed"
                            ? "فشل"
                            : tx.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        <div className="wallet-modern-table-section">
          <h3 className="wallet-modern-table-title">التحويلات</h3>
          <div className="wallet-modern-table-wrapper">
            <table className="wallet-modern-table">
              <thead>
                <tr>
                  <th>النوع</th>
                  <th>التاريخ</th>
                  <th>من/إلى</th>
                  <th>القيمة</th>
                  <th>الحالة</th>
                </tr>
              </thead>
              <tbody>
                {transferTransactions.length === 0 ? (
                  <tr>
                    <td
                      colSpan="5"
                      style={{ textAlign: "center", color: "#888" }}
                    >
                      لا توجد تحويلات
                    </td>
                  </tr>
                ) : (
                  transferTransactions.map((tx) => {
                    // حدد إذا كانت العملية صادرة أو واردة بناءً على from_wallet_id وwallet.id
                    const isOutgoing = tx.from_wallet_id === wallet.id;
                    const otherName = isOutgoing
                      ? tx.to_wallet?.user?.name || "-"
                      : tx.from_wallet?.user?.name || "-";
                    return (
                      <tr key={tx.id}>
                        <td>
                          <span
                            className={`wallet-modern-status-badge ${
                              isOutgoing
                                ? "wallet-modern-status-failed"
                                : "wallet-modern-status-active"
                            }`}
                          >
                            {isOutgoing ? "صادر" : "وارد"}
                          </span>
                        </td>
                        <td>
                          {new Date(tx.created_at).toLocaleString("ar-EG", {
                            dateStyle: "short",
                            timeStyle: "short",
                          })}
                        </td>
                        <td>
                          {isOutgoing
                            ? `إلى: ${otherName}`
                            : `من: ${otherName}`}
                        </td>
                        <td
                          className={
                            isOutgoing
                              ? "wallet-modern-amount-minus"
                              : "wallet-modern-amount-plus"
                          }
                        >
                          {isOutgoing ? "-" : "+"}
                          {parseFloat(tx.amount).toLocaleString("ar-EG", {
                            minimumFractionDigits: 2,
                          })}{" "}
                          {wallet.currency?.code || "SAR"}
                        </td>
                        <td>
                          <span
                            className={`wallet-modern-status-badge ${
                              tx.status === "completed" ||
                              tx.status === "success" ||
                              tx.status === "نجاح"
                                ? "wallet-modern-status-active"
                                : tx.status === "pending" ||
                                  tx.status === "معلق"
                                ? "wallet-modern-status-pending"
                                : "wallet-modern-status-failed"
                            }`}
                          >
                            {tx.status === "completed" ||
                            tx.status === "success"
                              ? "نجاح"
                              : tx.status === "pending"
                              ? "معلق"
                              : tx.status === "failed"
                              ? "فشل"
                              : tx.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <WalletTopupsDialog
        open={topupOpen}
        onClose={() => setTopupOpen(false)}
        onSubmit={async (params) => {
          const result = await handleTopup(params);
          // إظهار الرسالة التوضيحية لمدة 2 ثانية ثم إغلاق الديالوج وتحديث البيانات إذا نجح
          if (result && result.message) {
            setToastMsg(result.message);
            setToastType(result.success ? "success" : "error");
            setTimeout(() => {
              setToastMsg("");
              if (result.success) {
                setTopupOpen(false);
                reloadWallet();
              }
            }, 2000);
          }
        }}
      />
      <WalletTransferDialog
        open={transferOpen}
        onClose={() => setTransferOpen(false)}
        onSubmit={handleTransfer}
      />
    </div>
  );
}
