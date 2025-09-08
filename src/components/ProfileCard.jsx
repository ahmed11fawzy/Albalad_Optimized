import React, { useEffect, useState } from 'react';
import { MapPin, Phone, Mail, Star, Users, Package, Heart, UserPlus, UserCheck } from 'lucide-react';
import { useGetCurrentUserQuery } from '../redux/Slices/authApi';

const ProfileCard = ({ storeData}) => {
  const {
    name_ar,
    name_en,
    email,
    phone,
    logo,
    image,
    street,
    count_followers,
    average_rating,
    location_hierarchy,
  } = storeData;
    const [loading, setLoading] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const { data: user, isLoading: userLoading } = useGetCurrentUserQuery();
  // Fetch initial follow status
  useEffect(() => {
    const fetchFollowStatus = async () => {
      if (!storeData?.id) {
        console.error("storeData.id is undefined or null");
        return;
      }
      try {
        if (user) {
          const followedStores = user?.followers || [];
          console.log("🚀 ~ fetchFollowStatus ~ followedStores:", followedStores)
          
          setIsFollowing(
            followedStores.find((store) => store.id === storeData.id) !==
              undefined
          );
          console.log(isFollowing);
        }
      } catch (e) {
        console.error("Error fetching follow status:", e);
      }
    };
    fetchFollowStatus();
  }, [storeData?.id]);

  // Handle follow/unfollow action
  const handleFollow = async () => {
    if (!storeData?.id) {
      console.error("storeData.id is undefined or null");
      return;
    }
    console.log("Follow button clicked, storeId:", storeData.id);
    setLoading(true);
    try {
      const token = localStorage.getItem("user_token");
      if (!token) {
        console.error("No user_token found in localStorage");
        return;
      }
      console.log("Making API request...");
      const res = await fetch(
        `https://back.al-balad.sa/albalad/v1.0/followers/follower/${storeData.id}`,
        {
          method: "GET", // Use POST for follow, adjust to DELETE for unfollow if needed
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      console.log("API Response:", data);
      if (data.message === "Follower Successfully") {
        setIsFollowing(true);
      } else {
        setIsFollowing(false);
      }
    } catch (e) {
      console.error("Error in handleFollow:", e);
    } finally {
      setLoading(false);
    }
  };

 

  return (
    <div className=" mx-auto px-2 bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <div className="relative rounded-xl  mb-8 shadow-2xl h-80">
        {/* Background - Store Image or Gradient */}
        {image ? (
          <div 
            className="absolute rounded-xl inset-0 bg-contain "
            style={{ backgroundImage: `url(${image})` }}
          >
            <div className="absolute rounded-xl inset-0 bg-black/40"></div>
          </div>
        ) : (
          <div 
            className="absolute rounded-xl inset-0"
            style={{background: `linear-gradient(135deg, #b88c36 0%, #d4a855 50%, #b88c36 100%)`}}
          >
            <div className="absolute inset-0 bg-black/20"></div>
          </div>
        )}
        
        {/* Overlay Pattern */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
        
        
          

          
            {/* Logo */}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 -translate-y-1/2 group">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-white/20 backdrop-blur-sm border-4 border-white/30 p-1 shadow-xl">
                {logo ? (
                  <img 
                    src={logo} 
                    alt={name_en || name_ar} 
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
                    <Package className="w-6 h-6 md:w-8 md:h-8 text-gray-600" />
                  </div>
                )}
              </div>
              <div className="absolute -inset-1 rounded-full opacity-0 group-hover:opacity-30 transition-opacity duration-300" style={{background: 'linear-gradient(45deg, #b88c36, #d4a855)'}}></div>
            </div>

           
          
        
      </div>

      {/* Top Section - Store Info */}
          <div className="flex-1 px-8 md:px-8 flex items-start">
            <div>
             
              {name_en && (
                <p className="text-xl text-center my-4 font-medium">{name_en}</p>
              )}

              <h1 className="text-xl md:text-xl font-bold  mb-2">
                {name_ar}
              </h1>
              
             
              
              <div className="flex f items-center gap-3 ">
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm font-medium">{location_hierarchy?.province?.name}</span>
                </div>
                
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full">
                  <Users className="w-4 h-4" />
                  <span className="text-sm font-medium">{count_followers} متابع</span>
                </div>
                
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">{average_rating || 'جديد'}</span>
                </div>
                 {/* Follow Button */}
            <button
              onClick={handleFollow}
              className={`w-14 h-14 rounded-full flex items-center justify-center bg-transparent    ${
                isFollowing 
                  ? ' backdrop-blur-sm border-2 border-white/30  hover:bg-white/30' 
                  : ' text-gray-800 hover:bg-gray-100 border-2 border-white/20'
              }`}
              
            >
              {isFollowing ? (
                <UserCheck className="w-6 h-6" />
              ) : (
                <UserPlus className="w-6 h-6" />
              )}
            </button>
              </div>
            </div>
          </div>
      

      {/* Main Content */}
      <div className=" gap-8">
        {/* Contact & Location Info */}
        <div className=" space-y-6">
          {/* Contact Information */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{background: 'linear-gradient(135deg, #b88c36, #d4a855)'}}>
                <Phone className="w-4 h-4 text-white" />
              </div>
              معلومات التواصل
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Phone className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{phone}</p>
                  <p className="text-sm text-gray-500">رقم الهاتف</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Mail className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{email}</p>
                  <p className="text-sm text-gray-500">البريد الإلكتروني</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{street}</p>
                  <p className="text-sm text-gray-500">
                    {location_hierarchy?.province?.name}, {location_hierarchy?.region?.name}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Location Map Iframe */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{background: 'linear-gradient(135deg, #b88c36, #d4a855)'}}>
                <MapPin className="w-4 h-4 text-white" />
              </div>
              الموقع
            </h2>
            <div className="w-full h-64 rounded-xl overflow-hidden bg-gray-100">
              <div 
                className="w-full h-full"
                dangerouslySetInnerHTML={{ __html: storeData.location }}
              />
            </div>
          </div>
        </div>

        
      </div>
    </div>
  );
};

export default ProfileCard;