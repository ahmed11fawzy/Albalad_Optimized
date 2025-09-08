import React, { useEffect, useRef } from "react";
import { useGetNotificationsQuery } from "../redux/Slices/notifications";

const NotificationBox = ({ onClose }) => {
  const { data: notifications, isLoading } = useGetNotificationsQuery();
  const notificationRef = useRef();

  useEffect(() => {
    function handleClickOutside(e) {
      if (notificationRef.current && !notificationRef.current.contains(e.target)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  if (isLoading) {
    return (
      <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg p-4 z-20">
        <p className="text-gray-500 text-center">Loading...</p>
      </div>
    );
  }

  if (!notifications || notifications.length === 0) {
    return (
      <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg p-4 z-20">
        <p className="text-gray-500 text-center">No Notifications</p>
      </div>
    );
  }

  return (
    <div
      ref={notificationRef}
      className="absolute  mt-2 w-80 left-5 bg-white rounded-lg shadow-lg p-4 z-20 max-h-96 overflow-y-auto"
    >
      <h3 className="text-lg font-semibold text-gray-800 mb-3">الاشعارات</h3>
      <ul className="space-y-2">
        {notifications?.data?.map((notification, index) => (
          <li
            key={index}
            className="p-3 bg-gray-50 rounded-md hover:bg-amber-50 transition-colors duration-200"
          >
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 mt-2 bg-amber-400 rounded-full"></div>
              <div>
                <p className="text-sm font-medium text-gray-800">{notification.title}</p>
                <p className="text-xs text-gray-500">{notification.message}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(notification.created_at).toLocaleTimeString()}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NotificationBox;