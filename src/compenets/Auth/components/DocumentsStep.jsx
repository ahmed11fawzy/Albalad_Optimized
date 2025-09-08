import React, { useRef } from "react";
import { FaCloudUploadAlt } from "react-icons/fa";

const DocumentsStep = ({
  docs,
  docsErrors,
  handleDocsChange,
  handleDocsSubmit,
  handleBack,
  handleRemoveDocFile,
  navigate,
  loading,
  apiError,
  successMsg,
}) => {
  // refs للملفات
  const crFileInputRef = useRef();
  const licenseFileInputRef = useRef();
  const nationalAddressFileInputRef = useRef();
  const taxFileInputRef = useRef();

  const isFileImage = (file) =>
    file && file.type && file.type.startsWith("image/");

  return (
    <div className="register-seller-step-content">
      <div className="docs-fields-row">
        <div className="register-seller-field" style={{ flex: 1 }}>
          <label>
            الاسم التجاري<span className="required">*</span>
          </label>
          <input
            type="text"
            name="business_name"
            value={docs.business_name}
            onChange={handleDocsChange}
          />
          {docsErrors.business_name && (
            <div className="register-seller-error">
              {docsErrors.business_name}
            </div>
          )}
        </div>
        <div className="register-seller-field" style={{ flex: 1 }}>
          <label>
            رقم السجل التجاري<span className="required">*</span>
          </label>
          <input
            type="text"
            name="commercial_registration_number"
            value={docs.commercial_registration_number}
            onChange={handleDocsChange}
          />
          {docsErrors.commercial_registration_number && (
            <div className="register-seller-error">
              {docsErrors.commercial_registration_number}
            </div>
          )}
        </div>
        <div className="register-seller-field" style={{ flex: 1 }}>
          <label>
            تاريخ انتهاء السجل التجاري
            <span className="required">*</span>
          </label>
          <input
            type="date"
            name="cr_expiry_date"
            value={docs.cr_expiry_date}
            onChange={handleDocsChange}
          />
          {docsErrors.cr_expiry_date && (
            <div className="register-seller-error">
              {docsErrors.cr_expiry_date}
            </div>
          )}
        </div>
      </div>

      <div className="docs-fields-row">
        <div className="register-seller-field" style={{ flex: 1 }}>
          <label>رقم الرخصة البلدية</label>
          <input
            type="text"
            name="municipal_license_number"
            value={docs.municipal_license_number}
            onChange={handleDocsChange}
          />
        </div>
        <div className="register-seller-field" style={{ flex: 1 }}>
          <label>تاريخ انتهاء الرخصة البلدية</label>
          <input
            type="date"
            name="municipal_license_expiry"
            value={docs.municipal_license_expiry}
            onChange={handleDocsChange}
          />
        </div>
      </div>

      <div className="docs-fields-row">
        <div className="register-seller-field" style={{ flex: 1 }}>
          <label>الرقم الضريبي</label>
          <input
            type="text"
            name="tax_number"
            value={docs.tax_number}
            onChange={handleDocsChange}
          />
        </div>
                 <div className="register-seller-field" style={{ flex: 1 }}>
           <label>
             رقم جوال المالك<span className="required">*</span>
           </label>
           <input
             type="text"
             name="owner_phone"
             value={docs.owner_phone}
             onChange={handleDocsChange}
             placeholder="مثال: 05xxxxxxxx"
           />
           {docsErrors.owner_phone && (
             <div className="register-seller-error">
               {docsErrors.owner_phone}
             </div>
           )}
         </div>
        <div className="register-seller-field" style={{ flex: 1 }}>
          <label>
            الرقم الموحد<span className="required">*</span>
          </label>
          <input
            type="text"
            name="unified_number"
            value={docs.unified_number}
            onChange={handleDocsChange}
          />
          {docsErrors.unified_number && (
            <div className="register-seller-error">
              {docsErrors.unified_number}
            </div>
          )}
        </div>
      </div>

      <div className="docs-files-row">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <label className="custom-file-btn">
            <FaCloudUploadAlt style={{ marginLeft: 6 }} /> تحميل
            <input
              type="file"
              name="cr_file_url"
              accept="image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              className="custom-file-input"
              onChange={handleDocsChange}
              ref={crFileInputRef}
            />
          </label>
          <span className="docs-file-hint">ملف السجل التجاري</span>
          {docsErrors.cr_file_url && (
            <div
              className="register-seller-error"
              style={{ marginTop: 4 }}
            >
              {docsErrors.cr_file_url}
            </div>
          )}
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <label className="custom-file-btn">
            <FaCloudUploadAlt style={{ marginLeft: 6 }} /> تحميل
            <input
              type="file"
              name="license_file_url"
              accept="image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              className="custom-file-input"
              onChange={handleDocsChange}
              ref={licenseFileInputRef}
            />
          </label>
          <span className="docs-file-hint">
            ملف الرخصة البلدية (اختياري)
          </span>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <label className="custom-file-btn">
            <FaCloudUploadAlt style={{ marginLeft: 6 }} /> تحميل
            <input
              type="file"
              name="national_address_file_url"
              accept="image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              className="custom-file-input"
              onChange={handleDocsChange}
              ref={nationalAddressFileInputRef}
            />
          </label>
          <span className="docs-file-hint">ملف العنوان الوطني</span>
          {docsErrors.national_address_file_url && (
            <div
              className="register-seller-error"
              style={{ marginTop: 4 }}
            >
              {docsErrors.national_address_file_url}
            </div>
          )}
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <label className="custom-file-btn">
            <FaCloudUploadAlt style={{ marginLeft: 6 }} /> تحميل
            <input
              type="file"
              name="tax_file_url"
              accept="image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              className="custom-file-input"
              onChange={handleDocsChange}
              ref={taxFileInputRef}
            />
          </label>
          <span className="docs-file-hint">
            ملف الرقم الضريبي (اختياري)
          </span>
        </div>
      </div>

      <div className="docs-files-preview-row">
        {docs.cr_file_url && (
          <div
            style={{
              position: "relative",
              display: "inline-block",
              margin: "0 8px 8px 0",
            }}
          >
            <button
              type="button"
              onClick={() => handleRemoveDocFile("cr_file_url")}
              style={{
                position: "absolute",
                top: 2,
                right: 2,
                zIndex: 2,
                background: "#fff",
                border: "1px solid #ccc",
                borderRadius: "50%",
                width: 22,
                height: 22,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                padding: 0,
              }}
              title="حذف"
            >
              <span style={{ fontSize: 14, lineHeight: 1 }}>
                &times;
              </span>
            </button>
            {isFileImage(docs.cr_file_url) ? (
              <img
                src={docs.cr_file_url_preview}
                alt="CR Preview"
                className="docs-file-image-preview"
              />
            ) : (
              <a
                href={URL.createObjectURL(docs.cr_file_url)}
                target="_blank"
                rel="noopener noreferrer"
                className="docs-file-link-preview"
              >
                {docs.cr_file_url.name}
              </a>
            )}
          </div>
        )}
        {docs.license_file_url && (
          <div
            style={{
              position: "relative",
              display: "inline-block",
              margin: "0 8px 8px 0",
            }}
          >
            <button
              type="button"
              onClick={() => handleRemoveDocFile("license_file_url")}
              style={{
                position: "absolute",
                top: 2,
                right: 2,
                zIndex: 2,
                background: "#fff",
                border: "1px solid #ccc",
                borderRadius: "50%",
                width: 22,
                height: 22,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                padding: 0,
              }}
              title="حذف"
            >
              <span style={{ fontSize: 14, lineHeight: 1 }}>
                &times;
              </span>
            </button>
            {isFileImage(docs.license_file_url) ? (
              <img
                src={docs.license_file_url_preview}
                alt="License Preview"
                className="docs-file-image-preview"
              />
            ) : (
              <a
                href={URL.createObjectURL(docs.license_file_url)}
                target="_blank"
                rel="noopener noreferrer"
                className="docs-file-link-preview"
              >
                {docs.license_file_url.name}
              </a>
            )}
          </div>
        )}
        {docs.national_address_file_url && (
          <div
            style={{
              position: "relative",
              display: "inline-block",
              margin: "0 8px 8px 0",
            }}
          >
            <button
              type="button"
              onClick={() =>
                handleRemoveDocFile("national_address_file_url")
              }
              style={{
                position: "absolute",
                top: 2,
                right: 2,
                zIndex: 2,
                background: "#fff",
                border: "1px solid #ccc",
                borderRadius: "50%",
                width: 22,
                height: 22,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                padding: 0,
              }}
              title="حذف"
            >
              <span style={{ fontSize: 14, lineHeight: 1 }}>
                &times;
              </span>
            </button>
            {isFileImage(docs.national_address_file_url) ? (
              <img
                src={docs.national_address_file_url_preview}
                alt="National Address Preview"
                className="docs-file-image-preview"
              />
            ) : (
              <a
                href={URL.createObjectURL(
                  docs.national_address_file_url
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="docs-file-link-preview"
              >
                {docs.national_address_file_url.name}
              </a>
            )}
          </div>
        )}
        {docs.tax_file_url && (
          <div
            style={{
              position: "relative",
              display: "inline-block",
              margin: "0 8px 8px 0",
            }}
          >
            <button
              type="button"
              onClick={() => handleRemoveDocFile("tax_file_url")}
              style={{
                position: "absolute",
                top: 2,
                right: 2,
                zIndex: 2,
                background: "#fff",
                border: "1px solid #ccc",
                borderRadius: "50%",
                width: 22,
                height: 22,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                padding: 0,
              }}
              title="حذف"
            >
              <span style={{ fontSize: 14, lineHeight: 1 }}>
                &times;
              </span>
            </button>
            {isFileImage(docs.tax_file_url) ? (
              <img
                src={docs.tax_file_url_preview}
                alt="Tax File Preview"
                className="docs-file-image-preview"
              />
            ) : (
              <a
                href={URL.createObjectURL(docs.tax_file_url)}
                target="_blank"
                rel="noopener noreferrer"
                className="docs-file-link-preview"
              >
                {docs.tax_file_url.name}
              </a>
            )}
          </div>
        )}
      </div>

      <div className="register-seller-actions-row">
        <button
          type="button"
          className="register-seller-back-btn"
          onClick={handleBack}
        >
          السابق
        </button>
        <button className="register-seller-next-btn" type="submit" onClick={handleDocsSubmit}>
          تسجيل
        </button>
      </div>

      {loading && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(255,255,255,0.7)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: 16,
              padding: 36,
              boxShadow: "0 2px 16px rgba(0,0,0,0.08)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 18,
            }}
          >
            <div className="lds-dual-ring"></div>
            <div
              style={{
                marginTop: 12,
                fontWeight: 600,
                color: "#1a2340",
              }}
            >
              جاري إرسال البيانات...
            </div>
          </div>
        </div>
      )}

      {apiError && (
        <div
          style={{
            position: "fixed",
            top: 24,
            left: "50%",
            transform: "translateX(-50%)",
            background: "#fff0f0",
            color: "#b71c1c",
            fontWeight: "bold",
            borderRadius: 10,
            boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
            padding: "18px 36px",
            zIndex: 10000,
            fontSize: "1.08em",
            minWidth: 280,
            textAlign: "center",
            border: "1.5px solid #e53935",
          }}
        >
          {apiError}
        </div>
      )}

      {successMsg && (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
            background: "#e0f7e9",
            color: "#388e3c",
            fontWeight: "bold",
            borderRadius: 16,
            boxShadow: "0 2px 16px rgba(0,0,0,0.10)",
            padding: "32px 40px",
            zIndex: 10000,
            fontSize: "1.13em",
            minWidth: 320,
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 18,
          }}
        >
          <div style={{ marginBottom: 8 }}>{successMsg}</div>
          <button
            type="button"
            className="return-to-shop-btn"
            onClick={() => navigate("/")}
          >
            العودة للتسوق
          </button>
        </div>
      )}
    </div>
  );
};

export default DocumentsStep;

