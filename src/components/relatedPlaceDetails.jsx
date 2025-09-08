import React from 'react';
import { FaTimes, FaMapMarkerAlt } from 'react-icons/fa';

const RelatedPlaceDetails = ({ place, onClose }) => {
  return (
    <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl h-9/12   max-w-lg w-full mx-4 p-6 relative" style={{ overflowY: 'auto' , scrollbarWidth: 'none' }}>
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4  right-4 text-gray-500 hover:text-gray-700"
          aria-label="Close"
        >
          <FaTimes size={20} />
        </button>

        {/* Main Image */}
        {place.main_image ? (
          <img
            src={place.main_image}
            alt={place.name}
            className="w-full h-48 mt-9 object-cover rounded-t-lg"
          />
        ) : (
          <div className="w-full h-48 bg-gray-200 flex items-center justify-center rounded-t-lg">
            <span className="text-gray-500">No Image Available</span>
          </div>
        )}

        {/* Place Details */}
        <div className="mt-4">
          <h2 className="text-2xl font-bold text-gray-800">{place.name}</h2>
          <p className="text-sm text-gray-500 mt-1">
            الفئات: {place.place_category?.name || 'N/A'}
          </p>
          <p className="text-gray-600 mt-3">{place.description}</p>

          {/* Additional Info */}
          <div className="mt-4">
            {place.map_location ? (
              <p className="text-sm text-gray-500 flex items-center">
                <FaMapMarkerAlt className="mr-2" />
                {place.map_location}
              </p>
            ) : (
              <p className="text-sm text-gray-500 flex items-center">
                <FaMapMarkerAlt className="ml-4" />
                الموقع غير متوفر
              </p>
            )}
            {place.is_featured && (
              <span className="inline-block bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full mt-2">
                 تراث
              </span>
            )}
          </div>

          {/* Creation and Update Dates */}
          <div className="mt-4 flex gap-4 text-xs text-gray-400">
            <p>تم انشاءه: {new Date(place.created_at).toLocaleDateString()}</p>
            <p>تم التحديث: {new Date(place.updated_at).toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RelatedPlaceDetails;