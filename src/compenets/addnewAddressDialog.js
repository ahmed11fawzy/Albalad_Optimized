import React, { useState, useEffect } from "react";
import "../css/addnewAddress.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faSpinner } from "@fortawesome/free-solid-svg-icons";

export default function AddNewAddressDialog({
  open,
  onClose,
  onSave,
  isEdit = false,
  initialData = null,
}) {
  const [form, setForm] = useState({
    country: "",
    name: "",
    phone: "",
    address: "",
    postal: "",
    region: "",
    city: "",
    map: "",
    is_default: false,
  });
  const [errors, setErrors] = useState({});
  const [countries, setCountries] = useState([]);
  const [regions, setRegions] = useState([]);
  const [cities, setCities] = useState([]);
  const [loadingCountries, setLoadingCountries] = useState(false);
  const [loadingRegions, setLoadingRegions] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [topMsg, setTopMsg] = useState(null);
  const [flagUrl, setFlagUrl] = useState(null);

  // Helper to extract lat/lng from Google Maps URL
  function extractLatLng(url) {
    if (!url) return { latitude: null, longitude: null };
    // Try to match @lat,lng or /place/.../lat,lng
    const match =
      url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/) ||
      url.match(/!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/);
    if (match) {
      return { latitude: match[1], longitude: match[2] };
    }
    return { latitude: null, longitude: null };
  }

  useEffect(() => {
    if (!open) return;
    const fetchCountries = async () => {
      setLoadingCountries(true);
      try {
        const userToken = localStorage.getItem("user_token");
        const headers = {};
        if (userToken) headers["Authorization"] = `Bearer ${userToken}`;
        const res = await fetch(
          "https://back.al-balad.sa/albalad/v1.0/customer/locations/countries",
          { headers }
        );
        const data = await res.json();
        if (data.status && Array.isArray(data.data)) {
          setCountries(data.data);
          // Set default country from localStorage
          let defaultCountry = "";
          try {
            const locSettings = JSON.parse(
              localStorage.getItem("locationSettings")
            );
            if (locSettings && locSettings.country) {
              const found = data.data.find(
                (c) => c.code === locSettings.country
              );
              if (found) defaultCountry = found.id;
            }
          } catch { }
          setForm((f) => ({
            ...f,
            country: defaultCountry,
            region: "",
            city: "",
          }));
        } else {
          setCountries([]);
        }
      } catch (err) {
        setCountries([]);
      } finally {
        setLoadingCountries(false);
      }
    };
    fetchCountries();
    setRegions([]);
    setCities([]);
    setForm((f) => ({ ...f, region: "", city: "" }));
    setTopMsg(null);
  }, [open]);

  useEffect(() => {
    if (!form.country) {
      setRegions([]);
      setCities([]);
      setForm((f) => ({ ...f, region: "", city: "" }));
      setFlagUrl(null);
      return;
    }
    // Set flag url if available
    const selectedCountry = countries.find((c) => c.id == form.country);
    if (selectedCountry && selectedCountry.code) {
      setFlagUrl(`https://flagsapi.com/${selectedCountry.code}/flat/32.png`);
    } else {
      setFlagUrl(null);
    }
    const fetchRegions = async () => {
      setLoadingRegions(true);
      try {
        const userToken = localStorage.getItem("user_token");
        const headers = {};
        if (userToken) headers["Authorization"] = `Bearer ${userToken}`;
        const res = await fetch(
          `https://back.al-balad.sa/albalad/v1.0/customer/locations/children/${form.country}`,
          { headers }
        );
        const data = await res.json();
        if (data.status && Array.isArray(data.data)) {
          setRegions(data.data);
        } else {
          setRegions([]);
        }
      } catch (err) {
        setRegions([]);
      } finally {
        setLoadingRegions(false);
      }
    };
    fetchRegions();
    setCities([]);
    setForm((f) => ({ ...f, region: "", city: "" }));
  }, [form.country]);

  useEffect(() => {
    if (!form.region) {
      setCities([]);
      setForm((f) => ({ ...f, city: "" }));
      return;
    }
    const fetchCities = async () => {
      setLoadingCities(true);
      try {
        const userToken = localStorage.getItem("user_token");
        const headers = {};
        if (userToken) headers["Authorization"] = `Bearer ${userToken}`;
        const res = await fetch(
          `https://back.al-balad.sa/albalad/v1.0/customer/locations/children/${form.region}`,
          { headers }
        );
        const data = await res.json();


        if (data.status && Array.isArray(data.data)) {
          setCities(data.data);
        } else {
          setCities([]);
        }
      } catch (err) {
        setCities([]);
      } finally {
        setLoadingCities(false);
      }
    };
    fetchCities();
    setForm((f) => ({ ...f, city: "" }));
  }, [form.region]);

  // Prefill form in edit mode
  useEffect(() => {
    if (open && isEdit && initialData) {
      // تعيين الدولة أولاً
      setForm((prevForm) => ({
        ...prevForm,
        country: initialData.location_hierarchy?.country?.id || "",
        name: initialData.name || "",
        phone: initialData.phone || "",
        address: initialData.address || "",
        postal: initialData.zip_code || "",
        map: initialData.google_map_url || "",
        is_default: initialData.is_default === 1,
        id: initialData.id,
      }));

      // جلب المناطق بناءً على الدولة المختارة
      const fetchRegionsAndSetState = async () => {
        if (initialData.location_hierarchy?.country?.id) {
          try {
            const userToken = localStorage.getItem("user_token");
            const headers = {};
            if (userToken) headers["Authorization"] = `Bearer ${userToken}`;
            const res = await fetch(
              `https://back.al-balad.sa/albalad/v1.0/customer/locations/children/${initialData.location_hierarchy.country.id}`,
              { headers }
            );
            const data = await res.json();
            if (data.status && Array.isArray(data.data)) {
              setRegions(data.data);
              // تعيين المنطقة بعد جلب المناطق
              setForm((prevForm) => ({
                ...prevForm,
                region: initialData.location_hierarchy?.state?.id || "",
              }));

              // جلب المدن بناءً على المنطقة المختارة
              if (initialData.location_hierarchy?.state?.id) {
                const cityRes = await fetch(
                  `https://back.al-balad.sa/albalad/v1.0/customer/locations/children/${initialData.location_hierarchy.state.id}`,
                  { headers }
                );
                const cityData = await cityRes.json();
                if (cityData.status && Array.isArray(cityData.data)) {
                  setCities(cityData.data);
                  // تعيين المدينة بعد جلب المدن
                  setForm((prevForm) => ({
                    ...prevForm,
                    city: initialData.location_id || "",
                  }));
                }
              }
            }
          } catch (err) {
            console.error("خطأ في جلب المناطق والمدن:", err);
          }
        }
      };

      fetchRegionsAndSetState();
    } else if (open && !isEdit) {
      setForm({
        country: "",
        name: "",
        phone: "",
        address: "",
        postal: "",
        region: "",
        city: "",
        map: "",
        is_default: false,
      });
    }
  }, [open, isEdit, initialData]);

  if (!open) return null;

  const validate = () => {
    const errs = {};
    if (!form.country) errs.country = "يرجى اختيار الدولة";
    if (!form.name) errs.name = "يرجى إدخال الاسم";
    if (!form.phone || !/^\d{9,}$/.test(form.phone))
      errs.phone = "يرجى إدخال رقم هاتف صحيح";
    if (!form.address) errs.address = "يرجى إدخال العنوان";
    if (!form.postal) errs.postal = "يرجى إدخال الرقم البريدي";
    if (!form.region) errs.region = "يرجى اختيار المنطقة";
    if (!form.city) errs.city = "يرجى اختيار المدينة";
    return errs;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTopMsg(null);
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length === 0) {
      setSubmitting(true);
      try {
        const userId = localStorage.getItem("user_id");
        const { latitude, longitude } = extractLatLng(form.map);
        const payload = {
          user_id: userId,
          location_id: form.city,
          label: "",
          name: form.name,
          phone: form.phone,
          address: form.address,
          google_map_url: form.map || "",
          latitude: latitude,
          longitude: longitude,
          zip_code: form.postal,
          is_default: form.is_default ? 1 : 0,
        };

        // تحديد الرابط النهائي بناءً على نوع العملية
        let endpoint;
        if (isEdit && form.id) {
          endpoint = `https://back.al-balad.sa/albalad/v1.0/customer/customer-addresses/update/${form.id}`;
        } else {
          endpoint =
            "https://back.al-balad.sa/albalad/v1.0/customer/customer-addresses/store";
        }

        const userToken = localStorage.getItem("user_token");
        const headers = { "Content-Type": "application/json" };
        if (userToken) headers["Authorization"] = `Bearer ${userToken}`;
        const res = await fetch(endpoint, {
          method: "POST",
          headers,
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (data.status) {
          // إذا تم حفظ العنوان بنجاح وتم اختيار تعيينه كافتراضي
          if (form.is_default) {
            try {
              const addressId = isEdit ? form.id : data.data.id;
              const defaultRes = await fetch(
                `https://back.al-balad.sa/albalad/v1.0/customer/customer-addresses/default/${addressId}`,
                {
                  method: "GET",
                  headers: {
                    Authorization: `Bearer ${userToken}`,
                  },
                }
              );
              const defaultData = await defaultRes.json();
              if (defaultData.status) {
                setTopMsg({
                  type: "success",
                  text: isEdit
                    ? "تم تعديل العنوان وتعيينه كافتراضي بنجاح"
                    : "تم حفظ العنوان وتعيينه كافتراضي بنجاح",
                });
              } else {
                console.error(
                  "فشل تعيين العنوان كافتراضي:",
                  defaultData.message
                );
                setTopMsg({
                  type: "warning",
                  text: isEdit
                    ? "تم تعديل العنوان ولكن فشل تعيينه كافتراضي"
                    : "تم حفظ العنوان ولكن فشل تعيينه كافتراضي",
                });
              }
            } catch (error) {
              console.error("خطأ في تعيين العنوان كافتراضي:", error);
              setTopMsg({
                type: "warning",
                text: isEdit
                  ? "تم تعديل العنوان ولكن فشل تعيينه كافتراضي"
                  : "تم حفظ العنوان ولكن فشل تعيينه كافتراضي",
              });
            }
          } else {
            setTopMsg({
              type: "success",
              text: isEdit ? "تم تعديل العنوان بنجاح" : "تم حفظ العنوان بنجاح",
            });
          }
          if (onSave) onSave(payload);
          setTimeout(() => {
            setTopMsg(null);
            onClose();
          }, 1500);
        } else {
          setTopMsg({
            type: "error",
            text:
              data.message ||
              (isEdit ? "فشل تعديل العنوان" : "فشل حفظ العنوان"),
          });
        }
      } catch (err) {
        console.error("خطأ في حفظ العنوان:", err);
        setTopMsg({
          type: "error",
          text: isEdit
            ? "حدث خطأ أثناء تعديل العنوان"
            : "حدث خطأ أثناء حفظ العنوان",
        });
      } finally {
        setSubmitting(false);
      }
    }
  };

  return (
    <div className="addaddress-dialog-overlay">
      {submitting && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(255,255,255,0.6)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <FontAwesomeIcon icon={faSpinner} spin size="2x" color="#a67c2e" />
        </div>
      )}
      {topMsg && (
        <div
          style={{
            position: "fixed",
            top: 20,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 10000,
            padding: "12px 32px",
            borderRadius: 8,
            background: topMsg.type === "success" ? "#e0f7e9" : "#fff0f0",
            color: topMsg.type === "success" ? "#388e3c" : "#b71c1c",
            fontWeight: "bold",
            boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
          }}
        >
          {topMsg.text}
        </div>
      )}
      <form className="addaddress-dialog-box" onSubmit={handleSubmit}>
        <button
          type="button"
          className="addaddress-dialog-close"
          onClick={onClose}
        >
          <FontAwesomeIcon icon={faTimes} />
        </button>
        <div className="addaddress-dialog-title">
          {isEdit ? "تعديل عنوان" : "إضافة عنوان جديد"}
        </div>
        <div className="addaddress-dialog-section">
          <label>البلد/المنطقة</label>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <select
              name="country"
              value={form.country}
              onChange={handleChange}
              className={errors.country ? "error" : ""}
              required
            >
              <option value="">اختر دولة</option>
              {loadingCountries && <option>جاري التحميل...</option>}
              {countries.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            {flagUrl && (
              <img
                src={flagUrl}
                alt="علم الدولة"
                style={{
                  width: 32,
                  height: 22,
                  borderRadius: 4,
                  boxShadow: "0 1px 4px #ccc",
                }}
              />
            )}
          </div>
          {errors.country && (
            <span className="addaddress-error">{errors.country}</span>
          )}
        </div>
        <div className="addaddress-dialog-section">
          <label>البيانات الشخصية</label>
          <div className="addaddress-row">
            <input
              name="name"
              placeholder="الاسم"
              value={form.name}
              onChange={handleChange}
              className={errors.name ? "error" : ""}
            />
            {errors.name && (
              <span className="addaddress-error">{errors.name}</span>
            )}
            <div className="addaddress-phone-group">
              <span className="addaddress-phone-code">
                {countries.find((c) => c.id == form.country)?.phone || ""}
              </span>
              <input
                name="phone"
                placeholder="رقم الهاتف"
                value={form.phone}
                onChange={handleChange}
                className={errors.phone ? "error" : ""}
              />
            </div>
            {errors.phone && (
              <span className="addaddress-error">{errors.phone}</span>
            )}
          </div>
        </div>
        <div className="addaddress-dialog-section">
          <label>العنوان</label>
          <input
            name="address"
            placeholder="الشارع، الحي، الوحدة، إلخ"
            value={form.address}
            onChange={handleChange}
            className={errors.address ? "error" : ""}
          />
          {errors.address && (
            <span className="addaddress-error">{errors.address}</span>
          )}
          <input
            name="map"
            placeholder="رابط موقعك على الخريطة (اختياري)"
            value={form.map}
            onChange={handleChange}
          />
          <div className="addaddress-row">
            <select
              name="region"
              value={form.region}
              onChange={handleChange}
              className={errors.region ? "error" : ""}
            >
              <option value="">اختر المنطقة</option>
              {loadingRegions && <option>جاري التحميل...</option>}
              {regions.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
            <select
              name="city"
              value={form.city}
              onChange={handleChange}
              className={errors.city ? "error" : ""}
            >
              <option value="">اختر المدينة</option>
              {loadingCities && <option>جاري التحميل...</option>}
              {cities.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            <input
              name="postal"
              placeholder="الرقم البريدي"
              value={form.postal}
              onChange={handleChange}
              className={errors.postal ? "error" : ""}
            />
          </div>
          {errors.region && (
            <span className="addaddress-error">{errors.region}</span>
          )}
          {errors.city && (
            <span className="addaddress-error">{errors.city}</span>
          )}
          {errors.postal && (
            <span className="addaddress-error">{errors.postal}</span>
          )}
        </div>
        <div className="addaddress-dialog-section addaddress-checkbox-row">
          <label>
            <input
              type="checkbox"
              name="is_default"
              checked={form.is_default}
              onChange={handleChange}
            />
            تعيين كعنوان شحن افتراضي
          </label>
        </div>
        <div className="addaddress-dialog-actions">
          <button
            type="button"
            className="addaddress-cancel-btn"
            onClick={onClose}
          >
            إلغاء
          </button>
          <button type="submit" className="addaddress-confirm-btn">
            {isEdit ? "تعديل" : "حفظ"}
          </button>
        </div>
      </form>
    </div>
  );
}
