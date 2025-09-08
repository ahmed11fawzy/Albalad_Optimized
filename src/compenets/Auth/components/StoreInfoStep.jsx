import React from "react";
import Select from "react-select";
import { useGetPlansQuery } from "../../../redux/Slices/plansApi";

const StoreInfoStep = ({
  store,
  storeErrors,
  arabicNameError,
  englishNameError,
  handleStoreChange,
  handleStoreNext,
  handleBack,
  handleCountryChange,
  handleStateChange,
  handleCityChange,
  handleMarketChange,
  selectedCountry,
  selectedState,
  selectedCity,
  locations,
  locationLoading,
  cityMarkets,
  businessActivities,
  fetchingOptions,
  isGoogleMapsEmbed,
}) => {
  const {data :plans , isloading } = useGetPlansQuery();
  console.log("🚀 ~ StoreInfoStep ~ plans?:", plans)
  return (
    <div className="register-seller-step-content">
      <div className="store-fields-row">
        <div className="register-seller-field" style={{ flex: 1 }}>
          <label>
            اسم المتجر (عربي)<span className="required">*</span>
          </label>
          <input
            type="text"
            name="store_name_ar"
            value={store.store_name_ar}
            onChange={handleStoreChange}
          />
          {storeErrors.store_name_ar && (
            <div className="register-seller-error">
              {storeErrors.store_name_ar}
            </div>
          )}
          {arabicNameError && (
            <div className="register-seller-error" style={{ color: "#e74c3c", fontSize: "0.9em", marginTop: "4px" }}>
              {arabicNameError}
            </div>
          )}
        </div>
        <div className="register-seller-field" style={{ flex: 1 }}>
          <label>
            اسم المتجر (إنجليزي)<span className="required">*</span>
          </label>
          <input
            type="text"
            name="store_name_en"
            value={store.store_name_en}
            onChange={handleStoreChange}
          />
          {storeErrors.store_name_en && (
            <div className="register-seller-error">
              {storeErrors.store_name_en}
            </div>
          )}
          {englishNameError && (
            <div className="register-seller-error" style={{ color: "#e74c3c", fontSize: "0.9em", marginTop: "4px" }}>
              {englishNameError}
            </div>
          )}
        </div>
      </div>

      <div className="store-fields-row">
        <div className="register-seller-field" style={{ flex: 1 }}>
          <label>
            بريد المتجر<span className="required">*</span>
          </label>
          <input
            type="email"
            name="store_email"
            value={store.store_email}
            onChange={handleStoreChange}
          />
          {storeErrors.store_email && (
            <div className="register-seller-error">
              {storeErrors.store_email}
            </div>
          )}
        </div>
                 <div className="register-seller-field" style={{ flex: 1 }}>
           <label>
             هاتف المتجر<span className="required">*</span>
           </label>
           <input
             type="text"
             name="store_phone"
             value={store.store_phone}
             onChange={handleStoreChange}
             placeholder="مثال: 05xxxxxxxx"
           />
           {storeErrors.store_phone && (
             <div className="register-seller-error">
               {storeErrors.store_phone}
             </div>
           )}
         </div>
      </div>

      <div className="store-fields-row">
        <div className="register-seller-field" style={{ flex: 1 }}>
          <label>
            الدولة<span className="required">*</span>
          </label>
          <Select
            name="country_id"
            value={
              selectedCountry
                ? {
                  value: selectedCountry,
                  label: selectedCountry.name,
                }
                : null
            }
            onChange={handleCountryChange}
            options={locations.map((c) => ({
              value: c,
              label: c.name,
            }))}
            isSearchable
            placeholder="اختر الدولة..."
            isDisabled={locationLoading}
            classNamePrefix="react-select"
          />
          {storeErrors.country_id && (
            <div className="register-seller-error">
              {storeErrors.country_id}
            </div>
          )}
        </div>
        <div className="register-seller-field" style={{ flex: 1 }}>
          <label>
            الولاية<span className="required">*</span>
          </label>
          <Select
            name="state_id"
            value={
              selectedState
                ? { value: selectedState, label: selectedState.name }
                : null
            }
            onChange={handleStateChange}
            options={
              selectedCountry && selectedCountry.childrens
                ? selectedCountry.childrens.map((s) => ({
                  value: s,
                  label: s.name,
                }))
                : []
            }
            isSearchable
            placeholder="اختر الولاية..."
            isDisabled={locationLoading || !selectedCountry}
            classNamePrefix="react-select"
          />
          {storeErrors.state_id && (
            <div className="register-seller-error">
              {storeErrors.state_id}
            </div>
          )}
        </div>
        <div className="register-seller-field" style={{ flex: 1 }}>
          <label>
            المدينة<span className="required">*</span>
          </label>
          <Select
            name="location_id"
            value={
              selectedCity
                ? { value: selectedCity, label: selectedCity.name }
                : null
            }
            onChange={handleCityChange}
            options={
              selectedState && selectedState.childrens
                ? selectedState.childrens.map((c) => ({
                  value: c,
                  label: c.name,
                }))
                : []
            }
            isSearchable
            placeholder="اختر المدينة..."
            isDisabled={locationLoading || !selectedState}
            classNamePrefix="react-select"
          />
          {storeErrors.location_id && (
            <div className="register-seller-error">
              {storeErrors.location_id}
            </div>
          )}
        </div>
        <div className="register-seller-field" style={{ flex: 1 }}>
          <label>
            الشارع<span className="required">*</span>
          </label>
          <input
            type="text"
            name="street"
            value={store.street}
            onChange={handleStoreChange}
          />
          {storeErrors.street && (
            <div className="register-seller-error">
              {storeErrors.street}
            </div>
          )}
        </div>
      </div>

      <div className="store-fields-row">
        <div className="register-seller-field" style={{ flex: 1 }}>
          <label>
            الرمز البريدي<span className="required">*</span>
          </label>
          <input
            type="text"
            name="zip_code"
            value={store.zip_code}
            onChange={handleStoreChange}
          />
          {storeErrors.zip_code && (
            <div className="register-seller-error">
              {storeErrors.zip_code}
            </div>
          )}
        </div>
        <div className="register-seller-field" style={{ flex: 1 }}>
          <label>الرمز الفرعي</label>
          <input
            type="text"
            name="subcode"
            value={store.subcode}
            onChange={handleStoreChange}
          />
        </div>
        <div className="register-seller-field" style={{ flex: 1 }}>
          <label>صندوق البريد</label>
          <input
            type="text"
            name="mailbox"
            value={store.mailbox}
            onChange={handleStoreChange}
          />
        </div>
      </div>

      <div className="store-fields-row">
        <div className="register-seller-field" style={{ flex: 1 }}>
          <label>
            الخطة<span className="required">*</span>
          </label>
          <Select
            name="Plan_id"
            
            onChange={handleMarketChange}
            options={plans?.data?.map((plan) => ({
              value: plan,
              label: plan.name,
            }))}
            isSearchable
            placeholder="اختر الخطة..."
            isDisabled={isloading }
            classNamePrefix="react-select"
          />
         
          
        </div>
        <div className="register-seller-field" style={{ flex: 1 }}>
          <label>
            السوق<span className="required">*</span>
          </label>
          <Select
            name="market_id"
            value={
              cityMarkets.find((m) => m.id === store.market_id)
                ? {
                  value: cityMarkets.find(
                    (m) => m.id === store.market_id
                  ),
                  label: cityMarkets.find(
                    (m) => m.id === store.market_id
                  )?.name,
                }
                : null
            }
            onChange={handleMarketChange}
            options={cityMarkets.map((m) => ({
              value: m,
              label: m.name,
            }))}
            isSearchable
            placeholder="اختر السوق..."
            isDisabled={locationLoading || !selectedCity}
            classNamePrefix="react-select"
          />
          {storeErrors.market_id && (
            <div className="register-seller-error">
              {storeErrors.market_id}
            </div>
          )}
        </div>
        <div className="register-seller-field" style={{ flex: 1 }}>
          <label>
            النشاط التجاري<span className="required">*</span>
          </label>
          <Select
            name="business_activitie_id"
            value={
              businessActivities.find(
                (a) => a.id === store.business_activitie_id
              )
                ? {
                  value: store.business_activitie_id,
                  label: businessActivities.find(
                    (a) => a.id === store.business_activitie_id
                  )?.name,
                }
                : null
            }
            onChange={(option) =>
              handleStoreChange({
                target: {
                  name: "business_activitie_id",
                  value: option ? option.value : "",
                },
              })
            }
            options={businessActivities.map((a) => ({
              value: a.id,
              label: a.name,
            }))}
            isSearchable
            placeholder="اختر النشاط التجاري..."
            isDisabled={fetchingOptions}
            classNamePrefix="react-select"
          />
          {storeErrors.business_activitie_id && (
            <div className="register-seller-error">
              {storeErrors.business_activitie_id}
            </div>
          )}
        </div>
      </div>

      <div className="store-fields-row">
        <div className="register-seller-field">
          <label>
            شعار المتجر<span className="required">*</span>
          </label>
          <label className="custom-file-btn">
            اختر شعار
            <input
              type="file"
              name="logo"
              accept="image/*"
              className="custom-file-input"
              onChange={handleStoreChange}
            />
          </label>
          {store.logoPreview && (
            <img
              src={store.logoPreview}
              alt="logo preview"
              className="register-seller-avatar-preview"
            />
          )}
          {storeErrors.logo && (
            <div className="register-seller-error">
              {storeErrors.logo}
            </div>
          )}
        </div>
        <div className="register-seller-field">
          <label>
            صورة المتجر<span className="required">*</span>
          </label>
          <label className="custom-file-btn">
            اختر صورة
            <input
              type="file"
              name="image"
              accept="image/*"
              className="custom-file-input"
              onChange={handleStoreChange}
            />
          </label>
          {store.imagePreview && (
            <img
              src={store.imagePreview}
              alt="store preview"
              className="register-seller-avatar-preview"
            />
          )}
          {storeErrors.image && (
            <div className="register-seller-error">
              {storeErrors.image}
            </div>
          )}
        </div>
      </div>

      <div className="store-fields-row">
        <div className="register-seller-field">
          <label>
            رابط الموقع (تضمين خرائط جوجل)
            <span className="required">*</span>
          </label>
          <input
            type="text"
            name="location"
            value={store.location}
            onChange={handleStoreChange}
            placeholder="مثال: https://www.google.com/maps/embed?... أو كود iframe كامل"
          />
          {storeErrors.location && (
            <div className="register-seller-error">
              {storeErrors.location}
            </div>
          )}
          <div className="register-seller-hint">
            يمكنك الحصول على رابط التضمين من
            <a
              href="https://maps.google.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: "#1a73e8",
                textDecoration: "underline",
                margin: "0 4px",
              }}
            >
              خرائط جوجل
            </a>
            عبر زر المشاركة &gt; تضمين خريطة &gt; نسخ الرابط أو الكود
          </div>
          {isGoogleMapsEmbed(store.location) &&
            (store.location.includes("<iframe") ? (
              <div
                style={{
                  width: "100%",
                  marginTop: 8,
                  height: 315,
                  overflow: "hidden",
                }}
                dangerouslySetInnerHTML={{ __html: store.location }}
              />
            ) : (
              <iframe
                src={store.location}
                width="100%"
                height="315"
                style={{ border: 0, marginTop: 8 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Google Map Preview"
              ></iframe>
            ))}
        </div>
      </div>

      <div style={{ display: "flex", gap: 12, marginTop: 18 }}>
        <button
          type="button"
          className="register-seller-back-btn"
          onClick={handleBack}
        >
          السابق
        </button>
        <button className="register-seller-next-btn" type="submit" onClick={handleStoreNext}>
          التالي
        </button>
      </div>
    </div>
  )
  
};

export default StoreInfoStep;

