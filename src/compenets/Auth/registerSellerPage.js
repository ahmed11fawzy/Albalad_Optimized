import React from "react";
import { useNavigate } from "react-router-dom";
import "./registerSellerPage.css";
import LogoHeader from "../logoHeader";
import { useSellerRegistration } from "./hooks/useSellerRegistration";
import { useFormHandlers } from "./hooks/useFormHandlers";
import StepIndicator from "./components/StepIndicator";
import PersonalInfoStep from "./components/PersonalInfoStep";
import StoreInfoStep from "./components/StoreInfoStep";
import DocumentsStep from "./components/DocumentsStep";

export default function RegisterSellerPage() {
  const navigate = useNavigate();

  // Main registration hook
  const {
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
    validatePersonal,
    validateStore,
    validateDocs,
    isGoogleMapsEmbed,
    handleNext,
    handleStoreNext,
    handleBack,
    handleDocsSubmit,
    sendAllDataToApi,
  } = useSellerRegistration();

  // Form handlers hook
  const {
    handlePersonalChange,
    handleStoreChange,
    handleDocsChange,
    handleCountryChange,
    handleStateChange,
    handleCityChange,
    handleMarketChange,
    handleRemoveDocFile,
  } = useFormHandlers({
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
  });

  // Determine which step content to render
  const renderStepContent = () => {
    switch (step) {
      case 0:
        return (
          <PersonalInfoStep
            personal={personal}
            errors={errors}
            handlePersonalChange={handlePersonalChange}
            handleNext={handleNext}
          />
        );
      case 1:
        return (
          <StoreInfoStep
            store={store}
            storeErrors={storeErrors}
            arabicNameError={arabicNameError}
            englishNameError={englishNameError}
            handleStoreChange={handleStoreChange}
            handleStoreNext={handleStoreNext}
            handleBack={handleBack}
            handleCountryChange={handleCountryChange}
            handleStateChange={handleStateChange}
            handleCityChange={handleCityChange}
            handleMarketChange={handleMarketChange}
            selectedCountry={selectedCountry}
            selectedState={selectedState}
            selectedCity={selectedCity}
            locations={locations}
            locationLoading={locationLoading}
            cityMarkets={cityMarkets}
            businessActivities={businessActivities}
            fetchingOptions={fetchingOptions}
            isGoogleMapsEmbed={isGoogleMapsEmbed}
          />
        );
      case 2:
        return (
          <DocumentsStep
            docs={docs}
            docsErrors={docsErrors}
            handleDocsChange={handleDocsChange}
            handleDocsSubmit={handleDocsSubmit}
            handleBack={handleBack}
            handleRemoveDocFile={handleRemoveDocFile}
            navigate={navigate}
            loading={loading}
            apiError={apiError}
            successMsg={successMsg}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <LogoHeader />
      <div className="register-seller-root">
        <StepIndicator steps={steps} currentStep={step} />
        <form className="register-seller-form">
          {renderStepContent()}
        </form>
      </div>
    </>
  );
}
