import React, { useState, useEffect } from "react";
import ReactFlagsSelect from "react-flags-select";
import CloseIcon from "@mui/icons-material/Close";

export default function LocationForm({ onClose }) {
  const DEFAULT_VALUES = {
    country: "SA",
    city: "Jeddah",
    language: "AR",
    currency: "SAR",
    error: null,
  };
  const [locationData, setLocationData] = useState(DEFAULT_VALUES);
  const [formData, setFormData] = useState(DEFAULT_VALUES);
  const [selected, setSelected] = useState(DEFAULT_VALUES.country);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const response = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
          );
          const data = await response.json();
          setLocationData({
            country: data.countryCode,
            city: data.city || data.locality || "Unknown",
            language: "AR",
            currency: "SAR",
            error: null,
          });
        } catch (err) {
          setLocationData((prev) => ({
            ...prev,
            error: "Couldn't determine exact location",
          }));
        }
      });
    } else {
      setLocationData((prev) => ({
        ...prev,
        error: "Geolocation not supported by browser",
      }));
    }
  }, []);

  useEffect(() => {
    const savedData = localStorage.getItem("locationSettings");
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      setFormData(parsedData);
      setSelected(parsedData.country);
    } else {
      setFormData(locationData);
      setSelected(locationData.country);
    }
  }, [locationData]);

  const saveFormData = (data) => {
    localStorage.setItem("locationSettings", JSON.stringify(data));
    window.location.reload();
  };

  const handleCountrySelect = (code) => {
    setSelected(code);
    setFormData({ ...formData, country: code });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    saveFormData(formData);
  };

  const languages = [
    { code: "EN", name: "English" },
    { code: "AR", name: "العربية" },
  ];
  const currencies = [
    { code: "SAR", name: "Saudi Riyal", symbol: "﷼" },
    { code: "USD", name: "US Dollar", symbol: "$" },
    { code: "EUR", name: "Euro", symbol: "€" },
  ];

  return (
    <div className="absolute top-full left-1/2 transform -translate-x-1/2 bg-white p-4 rounded shadow-lg w-64 z-30">
      <h3 className="mb-2 font-bold">الشحن الى</h3>
      <CloseIcon
        className="absolute top-2 left-2 cursor-pointer"
        onClick={onClose}
      />
      <form onSubmit={handleSubmit}>
        <div className="mb-2">
          <ReactFlagsSelect
            selected={selected}
            onSelect={handleCountrySelect}
            className="w-full"
            searchable
          />
        </div>
        <div className="mb-2">
          <h4>المدينة</h4>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            placeholder="المدينة"
            required
          />
        </div>
        <div className="mb-2">
          <h4>اللغة</h4>
          <select
            name="language"
            value={formData.language}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
          >
            {languages.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.name}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-2">
          <h4>العملة</h4>
          <select
            name="currency"
            value={formData.currency}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
          >
            {currencies.map((curr) => (
              <option key={curr.code} value={curr.code}>
                {curr.name} ({curr.symbol})
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="w-full p-2 bg-blue-500 text-white rounded"
        >
          حفظ
        </button>
      </form>
    </div>
  );
}
