import React, { useState, useEffect } from "react";
import "./CustomerAddresses.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMapMarkerAlt,
  faEdit,
  faSpinner,
  faCheckCircle,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import AddNewAddressDialog from "./addnewAddressDialog";

export default function CustomerAddresses({
  onSelect,
  selectedAddressId,
  onRequireSelect,
  refreshTrigger,
  showSelectError,
}) {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(selectedAddressId || null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editAddress, setEditAddress] = useState(null);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Fetch addresses on mount
  useEffect(() => {
    fetchAddresses();
  }, []);

  // Add useEffect to refresh addresses when refreshTrigger changes
  useEffect(() => {
    if (refreshTrigger !== undefined) {
      fetchAddresses();
    }
  }, [refreshTrigger]);

  const fetchAddresses = async () => {
    setLoading(true);
    setError(null);
    try {
      const userToken = localStorage.getItem("user_token");
      const headers = {};
      if (userToken) headers["Authorization"] = `Bearer ${userToken}`;
      const res = await fetch(
        "https://back.al-balad.sa/albalad/v1.0/customer/customer-addresses",
        { headers }
      );
      const data = await res.json();
      if (data.status && Array.isArray(data.data)) {
        setAddresses(data.data);
        // Select default if exists
        const def = data.data.find((a) => a.is_default == 1);
        if (def) {
          setSelectedId(def.id);
          if (onSelect) onSelect(def);
        }
      } else {
        setAddresses([]);
      }
    } catch (err) {
      setError("حدث خطأ أثناء جلب العناوين");
      setAddresses([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle select
  const handleSelect = (address) => {
    setSelectedId(address.id);
    if (onSelect) onSelect(address);
  };

  // Handle edit
  const handleEdit = (address) => {
    setEditAddress(address);
    setShowEditDialog(true);
  };

  // Handle dialog close
  const handleDialogClose = () => {
    setShowEditDialog(false);
    setEditAddress(null);
    fetchAddresses(); // إعادة تحميل العناوين عند إغلاق النافذة
  };

  // Require select on submit
  useEffect(() => {
    if (onRequireSelect) {
      onRequireSelect(() => {
        if (!selectedId) {
          return false;
        }
        return true;
      });
    }
  }, [selectedId, onRequireSelect]);

  // Handle delete confirmation
  const handleDeleteClick = (e, address) => {
    e.stopPropagation();
    setAddressToDelete(address);
    setShowDeleteConfirm(true);
  };

  // Handle delete address
  const handleDeleteConfirm = async () => {
    if (!addressToDelete) return;
    setDeleting(true);
    setError(null);
    try {
      const userToken = localStorage.getItem("user_token");
      const headers = {
        Authorization: `Bearer ${userToken}`,
        "Content-Type": "application/json",
      };
      const res = await fetch(
        `https://back.al-balad.sa/albalad/v1.0/customer/customer-addresses/delete/${addressToDelete.id}`,
        {
          method: "GET",
          headers,
        }
      );
      const data = await res.json();
      if (data.status) {
        setSuccessMsg("تم حذف العنوان بنجاح");
        // If deleted address was selected, clear selection
        if (selectedId === addressToDelete.id) {
          setSelectedId(null);
          if (onSelect) onSelect(null);
        }
        fetchAddresses();
        setTimeout(() => setSuccessMsg(null), 3000);
      } else {
        setError(data.message || "فشل حذف العنوان");
      }
    } catch (err) {
      setError("حدث خطأ أثناء حذف العنوان");
    } finally {
      setDeleting(false);
      setShowDeleteConfirm(false);
      setAddressToDelete(null);
    }
  };

  return (
    <>
      {/* Top Messages */}
      {error && <div className="top-message error-message">{error}</div>}
      {successMsg && (
        <div className="top-message success-message">{successMsg}</div>
      )}

      <div className="customer-addresses-container">
        <div className="customer-addresses-title">عنوان التسليم</div>
        {loading && (
          <div className="customer-addresses-loading">
            <FontAwesomeIcon icon={faSpinner} spin size="lg" color="#a67c2e" />
          </div>
        )}
        {showSelectError && !selectedId && (
          <div
            style={{
              color: "#b71c1c",
              background: "#fff0f0",
              borderRadius: 8,
              padding: "10px 18px",
              textAlign: "center",
              fontWeight: "bold",
              margin: "10px 0",
            }}
          >
            يرجى اختيار عنوان
          </div>
        )}
        <div className="customer-addresses-list">
          {addresses.map((addr) => (
            <div
              key={addr.id}
              className={`customer-address-card${
                selectedId === addr.id ? " selected" : ""
              }`}
              onClick={() => handleSelect(addr)}
            >
              <input
                type="radio"
                checked={selectedId === addr.id}
                onChange={() => handleSelect(addr)}
              />
              <div className="customer-address-info">
                <div className="customer-address-row">
                  <FontAwesomeIcon icon={faMapMarkerAlt} />{" "}
                  {addr.location_hierarchy?.country?.name || ""}،{" "}
                  {addr.location_hierarchy?.state?.name || ""}،{" "}
                  {addr.location_hierarchy?.province?.name || ""}
                </div>
                <div className="customer-address-row">{addr.address}</div>
                <div className="customer-address-row">
                  {addr.name} - {addr.phone}
                </div>
                {addr.is_default == 1 && (
                  <span className="customer-address-default">
                    <FontAwesomeIcon icon={faCheckCircle} /> الافتراضي
                  </span>
                )}
              </div>
              <div className="customer-address-actions">
                <button
                  className="customer-address-edit-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEdit(addr);
                  }}
                >
                  <FontAwesomeIcon icon={faEdit} />
                </button>
                <button
                  className="customer-address-delete-btn"
                  onClick={(e) => handleDeleteClick(e, addr)}
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {showEditDialog && (
          <AddNewAddressDialog
            open={showEditDialog}
            onClose={handleDialogClose}
            initialData={editAddress}
            isEdit={true}
          />
        )}

        {/* Delete Confirmation Dialog */}
        {showDeleteConfirm && (
          <div className="delete-confirm-overlay">
            <div className="delete-confirm-dialog">
              <h3>تأكيد الحذف</h3>
              <p>هل أنت متأكد من حذف هذا العنوان؟</p>
              <div className="delete-confirm-actions">
                <button
                  className="delete-confirm-cancel"
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setAddressToDelete(null);
                  }}
                  disabled={deleting}
                >
                  إلغاء
                </button>
                <button
                  className="delete-confirm-delete"
                  onClick={handleDeleteConfirm}
                  disabled={deleting}
                >
                  {deleting ? (
                    <>
                      <FontAwesomeIcon icon={faSpinner} spin /> جاري الحذف...
                    </>
                  ) : (
                    "حذف"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
