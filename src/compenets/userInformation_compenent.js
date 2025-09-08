import React, { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";

import { Link, useNavigate } from "react-router-dom";
import SettingsIcon from "@mui/icons-material/Settings";
import AddLocationIcon from "@mui/icons-material/AddLocation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import {
  FaBoxOpen,
  FaCoins,
  FaWallet,
  FaCreditCard,
  FaHeart,
  FaTicketAlt,
  FaEdit,
  FaQrcode,
  FaApple,
  FaGooglePlay,
} from "react-icons/fa";
import { useSelector } from "react-redux";
import UserInfoEditDialog from "./userInfoEditDialog";
import { LoginDialog } from "./Auth";
import LocationForm from "./formShippingLocation";
import qrcode from "../assest/images/qrcode.png";

export default function UserInformationCard({
  onLoginClick,
  loginIsOpen,
  onLogout,
  userName,
  userAvatar,
}) {
  const navigate = useNavigate();
  const [showQRCode, setShowQRCode] = useState(false);
  const [showLocationForm, setShowLocationForm] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);

  const [isOpen, setIsOpen] = useState(false);
  const { isLoggedIn, user } = useSelector(
    (state) => state.globalData || { isLoggedIn: false, user: null }
  );
  const displayName = userName || user?.name || "--";
  const displayImage = userAvatar
    ? `https://back.al-balad.sa/albalad/v1.0/uploads/users/avatars/${userAvatar}`
    : "https://www.gravatar.com/avatar/?d=mp";

  const handleOutsideClick = (event) => {
    if (!event.target.closest(".relative")) {
      setIsOpen(false);
      setShowLocationForm(false);
      setShowQRCode(false);
      setEditOpen(false);
      setLoginOpen(false);
    }
  };
  React.useEffect(() => {
    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);
  const handleCloseLocationForm = () => {
    setShowLocationForm(false);
  };
  return (
    <>
      <div className="relative w-11 h-1/4">
        <div
          className={
            isLoggedIn
              ? "w-10 h-10 rounded-full bg-yellow-600 text-white flex items-center justify-center font-bold text-lg"
              : "p-2"
          }
          onClick={() => setIsOpen(!isOpen)}
        >
          {isLoggedIn ? displayName[0] : <FontAwesomeIcon icon={faUser} />}
        </div>
        {isOpen && (
          <div className="absolute top-full   overflow-auto left-14 bg-white rounded-lg shadow-lg p-4 min-w-[250px] z-20">
            {isLoggedIn && (
              <div className="p-2">
                <div className="flex items-center mb-4">
                  <img
                    src={displayImage}
                    alt="صورة المستخدم"
                    className="w-12 h-12  overflow-auto rounded-full mr-2"
                  />
                  <div>
                    <span className="block">مرحباً،</span>
                    <span className="font-bold">{displayName}</span>
                    <button
                      className="ml-2 text-yellow-600"
                      onClick={() => setEditOpen(true)}
                    >
                      <FaEdit />
                    </button>
                  </div>
                </div>
              </div>
            )}
            {!isLoggedIn && (
              <div className="p-2">
                <button
                  className="w-full p-2  bg-yellow-600 text-white rounded mb-2"
                  onClick={() => {
                    setLoginOpen(true);
                    setIsOpen(true);
                  }}
                >
                  تسجيل الدخول
                </button>
                <button
                  className="w-full p-2 bg-gray-200 rounded"
                  onClick={() => {
                    navigate("/register");
                    setIsOpen(false);
                  }}
                >
                  اشتراك
                </button>
              </div>
            )}
            {isLoggedIn && (
              <div>
                <ul className="">
                  <li
                    className="py-2 cursor-pointer"
                    onClick={() => navigate("/tracking-orders")}
                  >
                    <FaBoxOpen className="inline mr-2" /> الطلبيات الخاصة بي
                  </li>
                  <li className="py-2">
                    <FaCoins className="inline mr-2" /> عملاتي
                  </li>
                  <li className="py-2">
                    <FaWallet className="inline mr-2" />
                    <Link to="/my-wallet">محفظتي</Link>
                  </li>
                  <li className="py-2">
                    <FaCreditCard className="inline mr-2" /> دفع
                  </li>
                  <li
                    className="py-2 cursor-pointer"
                    onClick={() => navigate("/wishlist")}
                  >
                    <FaHeart className="inline mr-2" /> قائمة الرغبات
                  </li>
                  <li
                    className="py-2 cursor-pointer"
                    onClick={() => navigate("/chats")}
                  >
                    <FaHeart className="inline mr-2" /> قائمة المحادثات
                  </li>
                  <li
                    className="py-2 cursor-pointer"
                    onClick={() => navigate("/my-coupons")}
                  >
                    <FaTicketAlt className="inline mr-2" /> كوبوناتي
                  </li>
                </ul>
                <hr className="my-2" />
              </div>
            )}
            <div className="p-2 overflow-auto">
              <h3 className="font-bold mb-2">
                <SettingsIcon
                  className="inline ml-2 "
                  sx={{ fontSize: "15px" }}
                />
                الإعدادات
              </h3>
              <ul>
                <li className="py-2" onClick={() => setShowQRCode(!showQRCode)}>
                  <FaQrcode className="inline " />
                  حمل التطبيق
                </li>

                <li
                  className="py-2"
                  onClick={() => setShowLocationForm(!showLocationForm)}
                >
                  {" "}
                  <AddLocationIcon sx={{ fontSize: "15px" }} />
                  الشحن الى
                </li>
                {isLoggedIn && (
                  <button
                    className="w-full p-2 bg-red-500 text-white rounded"
                    onClick={() => {
                      onLogout();
                      setIsOpen(false);
                    }}
                  >
                    تسجيل خروج
                  </button>
                )}
              </ul>
            </div>
            <UserInfoEditDialog
              open={editOpen}
              onClose={() => setEditOpen(false)}
            />
            <LoginDialog open={loginOpen} onClose={() => setLoginOpen(false)} />
          </div>
        )}
      </div>
      {showLocationForm && <LocationForm onClose={handleCloseLocationForm} />}
      {showQRCode && (
        <div className="absolute top-8/12 left-[28rem] bg-white p-4 rounded shadow-lg w-80  z-30">
          <CloseIcon
            className="absolute top-2 left-2 cursor-pointer"
            onClick={() => setShowQRCode(false)}
          />
          <img src={qrcode} alt="QR Code" className="w-24 h-24 mb-2" />
          <p className="mb-2">امسح QRcod للتحميل</p>
          <div className="flex gap-2">
            <button
              className="flex items-center p-2 text-sm bg-black text-white rounded"
              onClick={() =>
                window.open(
                  "https://apps.apple.com/sa/app/al-balad-%D8%A7%D9%84%D8%A8%D9%84%D8%AF/id6749518429?l=ar"
                )
              }
            >
              <FaApple className="mr-2" /> App Store
            </button>
            <button
              className="flex items-center p-2 bg-black text-white rounded"
              onClick={() =>
                window.open(
                  "https://play.google.com/store/apps/details?id=com.mptech.albalad&pli=1"
                )
              }
            >
              <FaGooglePlay className="mr-2" /> Google Play
            </button>
          </div>
        </div>
      )}
    </>
  );
}
