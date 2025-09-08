import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useRegisterSellerMutation } from "../../../redux/Slices/authApi";
import { setAuthData } from "../../../redux/Slices/globalData";
import { useGetAllLocationsQuery } from "../../../redux/Slices/locationsApi";

export const useSellerRegistration = () => {
    const dispatch = useDispatch();
    const [registerSeller, { isLoading: sellerLoading }] =
        useRegisterSellerMutation();

    // Step management
    const [step, setStep] = useState(0);
    const steps = ["البيانات الشخصية", "بيانات المتجر", "وثائق المتجر"];

    // Personal data state
    const [personal, setPersonal] = useState({
        user_name: "",
        user_email: "",
        password: "",
        password_confirmation: "",
        user_phone: "",
        avatar: null,
        avatarPreview: "",
    });

    // Store data state
    const [store, setStore] = useState({
        store_name_ar: "",
        store_name_en: "",
        store_email: "",
        logo: null,
        logoPreview: "",
        image: null,
        imagePreview: "",
        store_phone: "",
        location: "",
        street: "",
        zip_code: "",
        subcode: "",
        mailbox: "",
        market_id: "",
        business_activitie_id: "",
        location_id: "",
        country_id: "",
        state_id: "",
    });

    // Documents state
    const [docs, setDocs] = useState({
        business_name: "",
        commercial_registration_number: "",
        cr_expiry_date: "",
        municipal_license_number: "",
        municipal_license_expiry: "",
        unified_number: "",
        tax_number: "",
        owner_phone: "",
        cr_file_url: null,
        cr_file_url_preview: "",
        license_file_url: null,
        license_file_url_preview: "",
        national_address_file_url: null,
        national_address_file_url_preview: "",
        tax_file_url: null,
        tax_file_url_preview: "",
    });

    // Error states
    const [errors, setErrors] = useState({});
    const [storeErrors, setStoreErrors] = useState({});
    const [docsErrors, setDocsErrors] = useState({});
    const [arabicNameError, setArabicNameError] = useState("");
    const [englishNameError, setEnglishNameError] = useState("");

    // API and loading states
    const [successMsg, setSuccessMsg] = useState("");
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState("");

    // Location and options data
    const [markets, setMarkets] = useState([]);
    const [businessActivities, setBusinessActivities] = useState([]);
    const [fetchingOptions, setFetchingOptions] = useState(false);
    const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);
    const [locationLoading, setLocationLoading] = useState(false);
    const [locations, setLocations] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [selectedState, setSelectedState] = useState(null);
    const [selectedCity, setSelectedCity] = useState(null);
    const [cityMarkets, setCityMarkets] = useState([]);

    const { data: locationsData } = useGetAllLocationsQuery();
    console.log("locationsData", locationsData);
    useEffect(() => {
        if (locationsData) {
            setLocations(locationsData?.data?.locations);
            setBusinessActivities(locationsData?.data?.business_activities);
            setMarkets(locationsData?.data?.markets);
            console.log("locations", locations);
        }
    }, [locationsData]);
    // Fetch store data when step changes
    /* useEffect(() => {
          if (step === 1 && locations.length === 0) {
              const fetchStoreData = async () => {
                  setLocationLoading(true);
                  try {
                      const userToken = localStorage.getItem("user_token");
                      const res = await fetch("https://back.al-balad.sa/stores/create", {
                          headers: userToken ? { Authorization: `Bearer ${userToken}` } : {},
                      });
                      const data = await res.json();
                      if (data && data.data) {
                          setLocations(data.data.locations || []);
                          setBusinessActivities(data.data.business_activities || []);
                      }
                  } catch (e) {
                      setLocations([]);
                      setBusinessActivities([]);
                  }
                  setLocationLoading(false);
              };
              fetchStoreData();
          }
      }, [step, locations.length]); */

    // Handle country selection
    useEffect(() => {
        if (selectedCountry) {
            setSelectedState(null);
            setSelectedCity(null);
            setCityMarkets([]);
            setStore((prev) => ({
                ...prev,
                country_id: selectedCountry.id,
                state_id: "",
                location_id: "",
                market_id: "",
            }));
        }
    }, [selectedCountry]);

    // Handle state selection
    useEffect(() => {
        if (selectedState) {
            setSelectedCity(null);
            setCityMarkets([]);
            setStore((prev) => ({
                ...prev,
                state_id: selectedState.id,
                location_id: "",
                market_id: "",
            }));
        }
    }, [selectedState]);

    // Handle city selection
    useEffect(() => {
        if (selectedCity) {
            setStore((prev) => ({
                ...prev,
                location_id: selectedCity.id,
                market_id: "",
            }));
            setCityMarkets(selectedCity.markets || []);
        }
    }, [selectedCity]);

    // Validation functions
    const validatePersonal = () => {
        const newErrors = {};
        if (!personal.user_name.trim()) newErrors.user_name = "الاسم مطلوب";
        if (!personal.user_email.trim())
            newErrors.user_email = "البريد الإلكتروني مطلوب";
        else if (!/^\S+@\S+\.\S+$/.test(personal.user_email))
            newErrors.user_email = "صيغة البريد الإلكتروني غير صحيحة";

        // Phone number validation
        if (personal.user_phone.trim()) {
            // Remove all non-digit characters for validation
            const phoneDigits = personal.user_phone.replace(/\D/g, '');

            // Check if it's a valid Saudi phone number
            if (!/^(05|5|96605|9665|009665|0096605)\d{8}$/.test(phoneDigits)) {
                newErrors.user_phone = "يجب إدخال رقم جوال سعودي صحيح (مثال: 05xxxxxxxx)";
            } else if (phoneDigits.length !== 10 && phoneDigits.length !== 12 && phoneDigits.length !== 14) {
                newErrors.user_phone = "يجب أن يكون رقم الجوال مكون من 10 أرقام";
            }
        }

        if (!personal.password) newErrors.password = "كلمة المرور مطلوبة";
        else if (personal.password.length < 8)
            newErrors.password = "كلمة المرور يجب أن تكون 8 أحرف على الأقل";
        else if (
            !/[a-z]/.test(personal.password) ||
            !/[A-Z]/.test(personal.password) ||
            !/[0-9]/.test(personal.password) ||
            !/[^A-Za-z0-9]/.test(personal.password)
        ) {
            newErrors.password =
                "كلمة المرور يجب أن تحتوي على حرف صغير، حرف كبير، رقم، ورمز خاص";
        }
        if (!personal.password_confirmation)
            newErrors.password_confirmation = "تأكيد كلمة المرور مطلوب";
        else if (personal.password !== personal.password_confirmation)
            newErrors.password_confirmation = "كلمتا المرور غير متطابقتين";
        return newErrors;
    };

    const arabicOnlyRegex =
        /^[\u0621-\u064A\u064B-\u065F\u0660-\u0669\u0670-\u06D3\u06D5-\u06ED\u06F0-\u06F9\s\u0600-\u0603\u060C\u060D\u061B\u061E\u061F\u066A-\u066C\u06DD\u06DE\u06E9\u06FD\u06FE]*$/;

    const validateStore = () => {
        const newErrors = {};
        if (!store.store_name_ar.trim())
            newErrors.store_name_ar = "اسم المتجر (عربي) مطلوب";
        else if (!arabicOnlyRegex.test(store.store_name_ar))
            newErrors.store_name_ar = "يجب أن يحتوي اسم المتجر على حروف عربية فقط";
        if (!store.store_name_en.trim())
            newErrors.store_name_en = "اسم المتجر (إنجليزي) مطلوب";
        if (!store.store_email.trim()) newErrors.store_email = "بريد المتجر مطلوب";
        else if (!/^\S+@\S+\.\S+$/.test(store.store_email))
            newErrors.store_email = "صيغة البريد الإلكتروني غير صحيحة";
        if (!store.logo) newErrors.logo = "شعار المتجر مطلوب";
        if (!store.image) newErrors.image = "صورة المتجر مطلوبة";
        if (!store.store_phone.trim()) newErrors.store_phone = "هاتف المتجر مطلوب";
        else {
            // Phone number validation for store phone
            const phoneDigits = store.store_phone.replace(/\D/g, '');

            // Check if it's a valid Saudi phone number
            if (!/^(05|5|96605|9665|009665|0096605)\d{8}$/.test(phoneDigits)) {
                newErrors.store_phone = "يجب إدخال رقم هاتف سعودي صحيح (مثال: 05xxxxxxxx)";
            } else if (phoneDigits.length !== 10 && phoneDigits.length !== 12 && phoneDigits.length !== 14) {
                newErrors.store_phone = "يجب أن يكون رقم الهاتف مكون من 10 أرقام";
            }
        }
        if (!store.location.trim()) newErrors.location = "رابط الموقع مطلوب";
        else if (!isGoogleMapsEmbed(store.location))
            newErrors.location = "يجب أن يكون رابط تضمين من خرائط جوجل";
        if (!store.street.trim()) newErrors.street = "الشارع مطلوب";
        if (!store.zip_code.trim()) newErrors.zip_code = "الرمز البريدي مطلوب";
        if (!store.market_id) newErrors.market_id = "اختيار السوق مطلوب";
        if (!store.business_activitie_id)
            newErrors.business_activitie_id = "اختيار النشاط التجاري مطلوب";
        if (!store.country_id) newErrors.country_id = "اختيار الدولة مطلوب";
        if (!store.state_id) newErrors.state_id = "اختيار الولاية مطلوب";
        if (!store.location_id) newErrors.location_id = "اختيار المدينة مطلوب";
        return newErrors;
    };

    const validateDocs = () => {
        const newErrors = {};
        if (!docs.business_name.trim())
            newErrors.business_name = "الاسم التجاري مطلوب";
        if (!docs.commercial_registration_number.trim())
            newErrors.commercial_registration_number = "رقم السجل التجاري مطلوب";
        if (!docs.cr_expiry_date)
            newErrors.cr_expiry_date = "تاريخ انتهاء السجل التجاري مطلوب";
        if (!docs.unified_number.trim())
            newErrors.unified_number = "الرقم الموحد مطلوب";
        if (!docs.owner_phone.trim())
            newErrors.owner_phone = "رقم جوال المالك مطلوب";
        else {
            // Phone number validation for owner phone
            const phoneDigits = docs.owner_phone.replace(/\D/g, '');

            // Check if it's a valid Saudi phone number
            if (!/^(05|5|96605|9665|009665|0096605)\d{8}$/.test(phoneDigits)) {
                newErrors.owner_phone = "يجب إدخال رقم جوال سعودي صحيح (مثال: 05xxxxxxxx)";
            } else if (phoneDigits.length !== 10 && phoneDigits.length !== 12 && phoneDigits.length !== 14) {
                newErrors.owner_phone = "يجب أن يكون رقم الجوال مكون من 10 أرقام";
            }
        }
        if (!docs.cr_file_url) newErrors.cr_file_url = "ملف السجل التجاري مطلوب";
        if (!docs.national_address_file_url)
            newErrors.national_address_file_url = "ملف العنوان الوطني مطلوب";
        return newErrors;
    };

    // Utility functions
    const isGoogleMapsEmbed = (val) => {
        if (!val) return false;
        return (
            val.includes("https://www.google.com/maps/embed?") ||
            val.includes("<iframe")
        );
    };

    // Navigation functions
    const handleNext = (e) => {
        e.preventDefault();
        const validation = validatePersonal();
        if (Object.keys(validation).length > 0) {
            setErrors(validation);
            return;
        }
        setStep(1);
    };

    const handleStoreNext = (e) => {
        e.preventDefault();
        const validation = validateStore();
        if (Object.keys(validation).length > 0) {
            setStoreErrors(validation);
            return;
        }
        setStep(2);
    };

    const handleBack = () => {
        setStep((prev) => prev - 1);
    };

    // API submission
    const sendAllDataToApi = async () => {
        const formData = new FormData();
        formData.append("user_name", personal.user_name);
        formData.append("user_email", personal.user_email);
        formData.append("password", personal.password);
        formData.append("password_confirmation", personal.password_confirmation);
        formData.append("user_phone", personal.user_phone);
        if (personal.avatar) formData.append("avatar", personal.avatar);
        formData.append("store_name_ar", store.store_name_ar);
        formData.append("store_name_en", store.store_name_en);
        formData.append("store_email", store.store_email);
        if (store.logo) formData.append("logo", store.logo);
        if (store.image) formData.append("image", store.image);
        formData.append("store_phone", store.store_phone);
        formData.append("location", store.location);
        formData.append("street", store.street);
        formData.append("zip_code", store.zip_code);
        formData.append("subcode", store.subcode);
        formData.append("mailbox", store.mailbox);
        formData.append("market_id", store.market_id);
        formData.append("business_activitie_id", store.business_activitie_id);
        formData.append("location_id", store.location_id);
        formData.append("business_name", docs.business_name);
        formData.append(
            "commercial_registration_number",
            docs.commercial_registration_number
        );
        formData.append("cr_expiry_date", docs.cr_expiry_date);
        formData.append("municipal_license_number", docs.municipal_license_number);
        formData.append("municipal_license_expiry", docs.municipal_license_expiry);
        formData.append("unified_number", docs.unified_number);
        formData.append("tax_number", docs.tax_number);
        formData.append("owner_phone", docs.owner_phone);
        if (docs.cr_file_url) formData.append("cr_file_url", docs.cr_file_url);
        if (docs.license_file_url)
            formData.append("license_file_url", docs.license_file_url);
        if (docs.national_address_file_url)
            formData.append(
                "national_address_file_url",
                docs.national_address_file_url
            );
        if (docs.tax_file_url) formData.append("tax_file_url", docs.tax_file_url);

        try {
            const result = await registerSeller(formData).unwrap();
            return result;
        } catch (err) {
            console.log(err);
            return {
                status: false,
                message: Object.values(err.data?.errors)
                    .flat() // Flatten the arrays
                    .join(" ") || "حدث خطأ في الاتصال بالخادم",
            };
        }
    };

    const handleDocsSubmit = async (e) => {
        e.preventDefault();
        const validation = validateDocs();
        if (Object.keys(validation).length > 0) {
            setDocsErrors(validation);
            return;
        }
        setApiError("");
        setSuccessMsg("");
        setLoading(true);
        const result = await sendAllDataToApi();

        setLoading(false);
        if (result.status) {
            setSuccessMsg(
                "تم إرسال طلبك بنجاح! سنقوم بمراجعة البيانات والرد عليك خلال 24 ساعة."
            );

            if (result.data && result.data.user) {
                if (result.data.user.id)
                    localStorage.setItem("user_id", result.data.user.id);
                if (result.data.user.token)
                    localStorage.setItem("user_token", result.data.user.token);

                dispatch(
                    setAuthData({
                        user: result.data.user,
                        userId: result.data.user.id,
                        token: result.data.user.token,
                        isLoggedIn: true,
                    })
                );
            }
        } else {
            setApiError(result.message || "حدث خطأ أثناء إرسال البيانات");
        }
    };

    return {
        // State
        step,
        steps,
        personal,
        store,
        docs,
        errors,
        storeErrors,
        docsErrors,
        arabicNameError,
        englishNameError,
        successMsg,
        loading,
        apiError,
        markets,
        businessActivities,
        fetchingOptions,
        countries,
        states,
        cities,
        locationLoading,
        locations,
        selectedCountry,
        selectedState,
        selectedCity,
        cityMarkets,
        sellerLoading,

        // Setters
        setPersonal,
        setStore,
        setDocs,
        setErrors,
        setStoreErrors,
        setDocsErrors,
        setArabicNameError,
        setEnglishNameError,
        setSuccessMsg,
        setLoading,
        setApiError,
        setMarkets,
        setBusinessActivities,
        setFetchingOptions,
        setCountries,
        setStates,
        setCities,
        setLocationLoading,
        setLocations,
        setSelectedCountry,
        setSelectedState,
        setSelectedCity,
        setCityMarkets,

        // Functions
        validatePersonal,
        validateStore,
        validateDocs,
        isGoogleMapsEmbed,
        handleNext,
        handleStoreNext,
        handleBack,
        handleDocsSubmit,
        sendAllDataToApi,
    };
};
