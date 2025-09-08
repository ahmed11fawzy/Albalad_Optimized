import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faList,
  faCartShopping,
  faBell,
} from "@fortawesome/free-solid-svg-icons";
import { useAuthInit } from "../hooks/useAuthInit";
import MenuIcon from "@mui/icons-material/Menu";
import AutocompleteDropdown from "../compenets/SearchableDropDownMenu/AutocompleteDropdown";
import SearchBar from "./searchBox";
import SearchSuggestions from "./SearchSuggestions";
import AutoCompleteSuggestions from "./AutoCompleteSuggestions";
import MainCategoriesSidebar from "./MainCategoriesSidebar";
import StoreSearchDialog from "./storeSearchDialog";
import UserInformationCard from "./userInformation_compenent";

import logoImg from "../assest/images/logo-img.jpeg";
import { useGetMarketsQuery, useGetStoresQuery } from "../redux/Slices/markets";
import { useGetCategoriesQuery } from "../redux/Slices/categoriesApi";
import { useGetNotificationsQuery } from "../redux/Slices/notifications";
import CustomDropDownMenu from "../components/CustomDropDownMenu";
import NotificationBox from "../components/NotificationBox";

export default function Header() {
  const navigate = useNavigate();
  const [loginOpen, setLoginOpen] = useState(false);
  const { isLoggedIn, user, isLoading: userLoading } = useAuthInit();
  const { data: markets, isLoading: marketsLoading } = useGetMarketsQuery();
  const { data: stores, isLoading: storesLoading } = useGetStoresQuery();
  const { data: categories, isLoading: categoriesLoading } =
    useGetCategoriesQuery();
  const { data: notifications } = useGetNotificationsQuery();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [storeSearchOpen, setStoreSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userProfile, setUserProfile] = useState({ name: "", avatar: null });
  const [isScrolled, setIsScrolled] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const suggestionsRef = useRef();
  const searchInputRef = useRef();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const fetchCart = async () => {
      setLoading(true);
      setError(null);
      try {
        const userId = localStorage.getItem("user_id");
        let response;
        if (userId) {
          const token = localStorage.getItem("user_token");
          response = await fetch(
            "https://back.al-balad.sa/albalad/v1.0/carts",
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );
        } else {
          const sessionId = localStorage.getItem("session_id");
          response = await fetch(
            `https://back.al-balad.sa/carts/${sessionId}`,
            {
              headers: { "Content-Type": "application/json" },
            }
          );
        }
        const data = await response.json();
        if (data.status && Array.isArray(data.data)) {
          const allItems = data.data.flatMap(
            (cart) =>
              cart.cart_stores?.flatMap((store) =>
                store.items?.map((item) => ({
                  id: item.id,
                  product_id:
                    item.product?.id || item.product_variant?.product?.id || "",
                  product_variant_id: item.product_variant?.id || "",
                  name:
                    item.product?.name ||
                    item.product_variant?.product?.name ||
                    "",
                  img:
                    item.product?.medias?.[0]?.file_name ||
                    item.product_variant?.product?.medias?.[0]?.file_name ||
                    item.product_variant?.image ||
                    "",
                  price: parseFloat(item.price),
                  oldPrice: item.product_variant?.product?.old_price
                    ? parseFloat(item.product_variant.product.old_price)
                    : parseFloat(item.price),
                  discount: item.discount || 0,
                  store:
                    item.product?.store?.name_ar ||
                    item.product?.store?.name_en ||
                    "",
                  variant: (() => {
                    if (
                      item.product_variant?.product_attributes &&
                      Array.isArray(item.product_variant.product_attributes)
                    ) {
                      const seen = new Set();
                      return item.product_variant.product_attributes
                        .filter((attrObj) => {
                          const key = attrObj.attribute_value?.attribute?.name;
                          if (!key || seen.has(key)) return false;
                          seen.add(key);
                          return true;
                        })
                        .map(
                          (attrObj) =>
                            `${
                              attrObj.attribute_value?.attribute?.name || ""
                            }: ${attrObj.attribute_value?.value || ""}`
                        )
                        .join(" / ");
                    }
                    return "";
                  })(),
                  quantity: item.quantity,
                }))
              ) || []
          );
          setProducts(allItems);
          localStorage.setItem("cart_items", JSON.stringify(allItems));
        } else {
          setProducts([]);
        }
      } catch (err) {
        setError("حدث خطأ أثناء جلب بيانات السلة");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, []);

  useEffect(() => {
    if (user && user.data) {
      setUserProfile({
        name: user.data.name || "",
        avatar: user.data.avatar || null,
      });
    } else {
      setUserProfile({ name: "", avatar: null });
    }
  }, [user]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(e.target) &&
        searchInputRef.current &&
        !searchInputRef.current.contains(e.target)
      ) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectMarket = (option) => {
    if (option) navigate(`markets-stores/${option.id}`);
  };

  const handleSelectStore = (option) => {
    if (option) navigate(`store-profile/${option.id}`);
  };

  return (
    <div
      className={`fixed top-0 w-full bg-white z-10 p-4 rounded-b-4xl transition-shadow duration-300 ${
        isScrolled ? "shadow-md" : "shadow-none"
      }`}
    >
      <div className="w-11/12 mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center justify-between w-full md:w-auto">
          <div className="flex items-center gap-2">
            <button
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <MenuIcon />
            </button>
            <img
              src={logoImg}
              alt="شعار البلد"
              className="h-14 md:h-16 cursor-pointer mx-auto md:mx-0"
              onClick={() => navigate("/")}
            />
          </div>
          <div className="flex items-center gap-4 md:hidden">
            <Link to="/cart" className="flex items-center gap-1 relative">
              <FontAwesomeIcon icon={faCartShopping} />
              <span className="text-sm absolute -top-6  px-1 text-amber-600 rounded-full">
                {products.length}
              </span>
            </Link>
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="flex items-center gap-1"
              >
                <FontAwesomeIcon icon={faBell} />
                <span className="text-sm absolute -top-6 px-1 text-amber-600 rounded-full">
                  {notifications?.length || 0}
                </span>
              </button>
              {showNotifications && (
                <NotificationBox
                  style={{ left: "30px" }}
                  onClose={() => setShowNotifications(false)}
                />
              )}
            </div>
            <UserInformationCard
              onLoginClick={() => setLoginOpen(true)}
              loginIsOpen={loginOpen}
              onLogout={() => {
                localStorage.removeItem("user_id");
                localStorage.removeItem("user_token");
                setUserProfile({ name: "", avatar: null });
              }}
              userName={userProfile.name}
              userAvatar={userProfile.avatar}
            />
          </div>
        </div>

        <div className="flex-1 w-full md:max-w-lg">
          <SearchBar
            className="w-full border-none focus:ring-2 focus:ring-amber-400 rounded-md"
            onFocus={() => setShowSuggestions(true)}
            inputRef={searchInputRef}
            onHideSuggestions={() => setShowSuggestions(false)}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
          {showSuggestions && (
            <div
              ref={suggestionsRef}
              className="absolute left-0 right-0 mt-1 z-10 md:max-w-lg md:mx-auto"
            >
              {searchQuery === "" ? (
                <SearchSuggestions />
              ) : (
                <AutoCompleteSuggestions
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                />
              )}
            </div>
          )}
        </div>

        <div className="hidden md:flex items-center gap-1 border-amber-400">
          <Link to="/historic-jeddah" className="px-2">
            الفعاليات
          </Link>
          <AutocompleteDropdown
            menuWidth="200px"
            options={markets?.data || []}
            placeholder="الأسواق"
            getOptionLabel={(option) => option.name}
            onChange={handleSelectMarket}
            sx={{
              dirction: "rtl",
              "& .MuiOutlinedInput-root": {
                color: "#111111",
              },
              "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
                border: "none", // Removes border in all states
              },
              "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                {
                  border: "none", // Ensures no border when focused (mouse or keyboard)
                },
              "& .MuiOutlinedInput-root:focus-visible .MuiOutlinedInput-notchedOutline":
                {
                  border: "none", // Ensures no border when focused via keyboard
                },
              "& .MuiInputBase-input::placeholder": {
                color: "#111111", // Sets placeholder text color
                opacity: 1, // Ensures full opacity for placeholder
              },
              "& .MuiInputBase-input:focus-visible::placeholder": {
                color: "#111111", // Ensures placeholder color stays consistent on focus-visible
                opacity: 1,
              },
            }}
            className="border-none text-black rounded-md"
          />
          <AutocompleteDropdown
            menuWidth="200px"
            options={stores?.data || []}
            placeholder="المتاجر"
            getOptionLabel={(option) => option.name_ar}
            onChange={handleSelectStore}
            sx={{
              dirction: "rtl",
              "& .MuiOutlinedInput-root": {
                color: "#111111",
              },
              "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
                border: "none", // Removes border in all states
              },
              "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                {
                  border: "none", // Ensures no border when focused (mouse or keyboard)
                },
              "& .MuiOutlinedInput-root:focus-visible .MuiOutlinedInput-notchedOutline":
                {
                  border: "none", // Ensures no border when focused via keyboard
                },
              "& .MuiInputBase-input::placeholder": {
                color: "#111111", // Sets placeholder text color
                opacity: 1, // Ensures full opacity for placeholder
              },
              "& .MuiInputBase-input:focus-visible::placeholder": {
                color: "#111111", // Ensures placeholder color stays consistent on focus-visible
                opacity: 1,
              },
            }}
            className="border-none text-black  rounded-md"
          />
          <CustomDropDownMenu className="border-none   rounded-md" />
          <div className="relative">
            <Link to="/cart" className="flex items-center gap-1 ">
              <FontAwesomeIcon icon={faCartShopping} />
              <span className="text-sm absolute -top-6 px-1 text-amber-600 rounded-full">
                {products.length}
              </span>
            </Link>
          </div>
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="flex items-center gap-1"
            >
              <FontAwesomeIcon icon={faBell} />
              <span className="text-sm absolute -top-6 px-1 text-amber-600 rounded-full">
                {notifications?.length || 0}
              </span>
            </button>
            {showNotifications && (
              <NotificationBox onClose={() => setShowNotifications(false)} />
            )}
          </div>
          <UserInformationCard
            onLoginClick={() => setLoginOpen(true)}
            loginIsOpen={loginOpen}
            onLogout={() => {
              localStorage.removeItem("user_id");
              localStorage.removeItem("user_token");
              setUserProfile({ name: "", avatar: null });
              setLoginOpen(false);
              window.location.reload();
            }}
            userName={userProfile.name}
            userAvatar={userProfile.avatar}
          />
        </div>
      </div>

      <div
        className={`mt-4 lg:hidden ${
          mobileMenuOpen ? "block" : "hidden"
        } border-amber-400`}
      >
        <Link to="/historic-jeddah" className="px-2 block mb-2">
          الفعاليات
        </Link>
        <AutocompleteDropdown
          options={markets?.data || []}
          placeholder="الأسواق"
          getOptionLabel={(option) => option.name}
          onChange={handleSelectMarket}
          sx={{
            dirction: "rtl",
            "& .MuiOutlinedInput-root": {
              color: "#111111",
            },
            "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
              border: "none", // Removes border in all states
            },
            "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
              {
                border: "none", // Ensures no border when focused (mouse or keyboard)
              },
            "& .MuiOutlinedInput-root:focus-visible .MuiOutlinedInput-notchedOutline":
              {
                border: "none", // Ensures no border when focused via keyboard
              },
            "& .MuiInputBase-input::placeholder": {
              color: "#111111", // Sets placeholder text color
              opacity: 1, // Ensures full opacity for placeholder
            },
            "& .MuiInputBase-input:focus-visible::placeholder": {
              color: "#111111", // Ensures placeholder color stays consistent on focus-visible
              opacity: 1,
            },
          }}
          className="border-none text-black rounded-md mb-2"
        />
        <AutocompleteDropdown
          options={stores?.data || []}
          placeholder="المتاجر"
          getOptionLabel={(option) => option.name_ar}
          onChange={handleSelectStore}
          sx={{
            dirction: "rtl",
            "& .MuiOutlinedInput-root": {
              color: "#111111",
            },
            "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
              border: "none", // Removes border in all states
            },
            "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
              {
                border: "none", // Ensures no border when focused (mouse or keyboard)
              },
            "& .MuiOutlinedInput-root:focus-visible .MuiOutlinedInput-notchedOutline":
              {
                border: "none", // Ensures no border when focused via keyboard
              },
            "& .MuiInputBase-input::placeholder": {
              color: "#111111", // Sets placeholder text color
              opacity: 1, // Ensures full opacity for placeholder
            },
            "& .MuiInputBase-input:focus-visible::placeholder": {
              color: "#111111", // Ensures placeholder color stays consistent on focus-visible
              opacity: 1,
            },
          }}
          className="border-none text-black rounded-md mb-2"
        />
        <CustomDropDownMenu className="border-none  rounded-md" />
      </div>

      <MainCategoriesSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        categories={categories?.data}
        loading={categoriesLoading}
      />
      <StoreSearchDialog
        open={storeSearchOpen}
        onClose={() => setStoreSearchOpen(false)}
      />
    </div>
  );
}
