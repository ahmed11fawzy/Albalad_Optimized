export const useFormHandlers = ({
    setPersonal,
    setStore,
    setDocs,
    setErrors,
    setStoreErrors,
    setDocsErrors,
    setArabicNameError,
    setEnglishNameError,
    setSelectedCountry,
    setSelectedState,
    setSelectedCity,
    setCityMarkets,
}) => {
    const handlePersonalChange = (e) => {
        const { name, value, files } = e.target;
        if (name === "avatar") {
            const file = files[0];
            setPersonal((prev) => ({
                ...prev,
                avatar: file,
                avatarPreview: file ? URL.createObjectURL(file) : "",
            }));
        } else if (name === "user_phone") {
            // Phone number formatting and validation
            let formattedValue = value;

            // Remove all non-digit characters
            const digits = value.replace(/\D/g, '');

            // Format the phone number
            if (digits.length > 0) {
                if (digits.startsWith('966')) {
                    // International format
                    formattedValue = `+966 ${digits.slice(3, 5)} ${digits.slice(5, 9)} ${digits.slice(9)}`;
                } else if (digits.startsWith('05') || digits.startsWith('5')) {
                    // Local format
                    const localDigits = digits.startsWith('05') ? digits : `0${digits}`;
                    formattedValue = `${localDigits.slice(0, 3)} ${localDigits.slice(3, 7)} ${localDigits.slice(7)}`;
                } else {
                    formattedValue = digits;
                }
            }

            setPersonal((prev) => ({ ...prev, [name]: formattedValue }));
        } else {
            setPersonal((prev) => ({ ...prev, [name]: value }));
        }
        setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const handleStoreChange = (e) => {
        const { name, value, files } = e.target;
        if (name === "logo") {
            const file = files && files[0];
            setStore((prev) => ({
                ...prev,
                logo: file,
                logoPreview: file ? URL.createObjectURL(file) : "",
            }));
        } else if (name === "image") {
            const file = files && files[0];
            setStore((prev) => ({
                ...prev,
                image: file,
                imagePreview: file ? URL.createObjectURL(file) : "",
            }));
        } else if (name === "country_id") {
            setSelectedCountry(value);
        } else if (name === "state_id") {
            setSelectedState(value);
        } else if (name === "location_id") {
            setStore((prev) => ({ ...prev, location_id: value }));
        } else if (name === "store_name_ar") {
            // Only allow Arabic letters, spaces, and common punctuation
            const arabicRegex = /^[\u0621-\u064A\u064B-\u065F\u0660-\u0669\u0670-\u06D3\u06D5-\u06ED\u06F0-\u06F9\s\u0600-\u0603\u060C\u060D\u061B\u061E\u061F\u066A-\u066C\u06DD\u06DE\u06E9\u06FD\u06FE]*$/;
            if (arabicRegex.test(value) || value === "") {
                setStore((prev) => ({ ...prev, [name]: value }));
                setArabicNameError("");
            } else {
                setArabicNameError("يجب ان يكون اسم المتجر باللغة العربية");
            }
        } else if (name === "store_name_en") {
            // Only allow English letters, spaces, and common punctuation
            const englishRegex = /^[a-zA-Z0-9\s\-_&.,'()!@#$%*+=\[\]{}|\\:;"<>?/~`]*$/;
            if (englishRegex.test(value) || value === "") {
                setStore((prev) => ({ ...prev, [name]: value }));
                setEnglishNameError("");
            } else {
                setEnglishNameError("يجب ان يكون اسم المتجر باللغة الانجليزية");
            }
        } else if (name === "store_phone") {
            // Phone number formatting and validation for store phone
            let formattedValue = value;

            // Remove all non-digit characters
            const digits = value.replace(/\D/g, '');

            // Format the phone number
            if (digits.length > 0) {
                if (digits.startsWith('966')) {
                    // International format
                    formattedValue = `+966 ${digits.slice(3, 5)} ${digits.slice(5, 9)} ${digits.slice(9)}`;
                } else if (digits.startsWith('05') || digits.startsWith('5')) {
                    // Local format
                    const localDigits = digits.startsWith('05') ? digits : `0${digits}`;
                    formattedValue = `${localDigits.slice(0, 3)} ${localDigits.slice(3, 7)} ${localDigits.slice(7)}`;
                } else {
                    formattedValue = digits;
                }
            }

            setStore((prev) => ({ ...prev, [name]: formattedValue }));
        } else {
            setStore((prev) => ({ ...prev, [name]: value }));
        }
        setStoreErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const handleDocsChange = (e) => {
        const { name, value, files } = e.target;
        if (files) {
            const file = files[0];
            let preview = "";
            if (file && file.type.startsWith("image/"))
                preview = URL.createObjectURL(file);
            setDocs((prev) => ({
                ...prev,
                [name]: file,
                [`${name}_preview`]: preview || file?.name,
            }));
        } else if (name === "owner_phone") {
            // Phone number formatting and validation for owner phone
            let formattedValue = value;

            // Remove all non-digit characters
            const digits = value.replace(/\D/g, '');

            // Format the phone number
            if (digits.length > 0) {
                if (digits.startsWith('966')) {
                    // International format
                    formattedValue = `+966 ${digits.slice(3, 5)} ${digits.slice(5, 9)} ${digits.slice(9)}`;
                } else if (digits.startsWith('05') || digits.startsWith('5')) {
                    // Local format
                    const localDigits = digits.startsWith('05') ? digits : `0${digits}`;
                    formattedValue = `${localDigits.slice(0, 3)} ${localDigits.slice(3, 7)} ${localDigits.slice(7)}`;
                } else {
                    formattedValue = digits;
                }
            }

            setDocs((prev) => ({ ...prev, [name]: formattedValue }));
        } else {
            setDocs((prev) => ({ ...prev, [name]: value }));
        }
        setDocsErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const handleCountryChange = (option) => {
        setSelectedCountry(option ? option.value : null);
    };

    const handleStateChange = (option) => {
        setSelectedState(option ? option.value : null);
    };

    const handleCityChange = (option) => {
        setSelectedCity(option ? option.value : null);
    };

    const handleMarketChange = (option) => {
        setStore((prev) => ({ ...prev, market_id: option ? option.value.id : "" }));
    };

    const handleRemoveDocFile = (field) => {
        setDocs((prev) => ({
            ...prev,
            [field]: null,
            [`${field}_preview`]: "",
        }));
        setDocsErrors((prev) => ({
            ...prev,
            [field]: "",
        }));
    };

    return {
        handlePersonalChange,
        handleStoreChange,
        handleDocsChange,
        handleCountryChange,
        handleStateChange,
        handleCityChange,
        handleMarketChange,
        handleRemoveDocFile,
    };
};