import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Store,
  ShieldCheck,
  Truck,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  ArrowLeft,
  Building2,
  MapPin,
  Landmark,
  Layers,
  Sparkles,
  Check,
  Loader2,
  Percent,
  Clock,
  Headphones,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const INDIAN_STATES = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  'Delhi NCR',
  'Jammu & Kashmir',
  'Ladakh',
  'Chandigarh',
  'Puducherry',
];

const AVAILABLE_CATEGORIES = [
  'Women Wear',
  'Men Wear',
  'Kids Wear',
  'Shoes',
  'Beauty',
  'Jewellery',
  'Bags',
  'Hats',
  'Vision Care',
  'Pets Care',
  'Toys',
  'Health & Fitness',
  'Electronics',
  'Home & Living',
];

const INDIAN_BANKS = [
  'State Bank of India (SBI)',
  'HDFC Bank',
  'ICICI Bank',
  'Axis Bank',
  'Kotak Mahindra Bank',
  'Punjab National Bank (PNB)',
  'Bank of Baroda',
  'Canara Bank',
  'Union Bank of India',
  'IndusInd Bank',
  'IDFC FIRST Bank',
  'Federal Bank',
  'Other Scheduled Indian Bank',
];

const BecomeSeller = () => {
  const { user, isAuthenticated, loading: authLoading, login, updateProfile } = useAuth();
  const navigate = useNavigate();

  // Wizard Step: 1 = Business, 2 = Pickup, 3 = Bank, 4 = Categories & Launch
  const [currentStep, setCurrentStep] = useState(1);

  // Form State with sessionStorage persistence so inputs are never lost
  const [formData, setFormData] = useState(() => {
    try {
      const saved = sessionStorage.getItem('vexivo_seller_draft');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      // Step 1: Business
      storeName: '',
      legalBusinessName: '',
      businessType: 'Sole Proprietorship / Individual',
      gstin: '',
      isGstExempt: false,
      panNumber: '',
      storePhone: '',
      storeEmail: '',
      storeDescription: '',

      // Step 2: Pickup Hub
      pickupStreet: '',
      pickupCity: '',
      pickupState: 'Maharashtra',
      pickupPostalCode: '',
      pickupContactPerson: '',
      pickupContactPhone: '',

      // Step 3: Bank Details
      accountHolderName: '',
      bankName: 'HDFC Bank',
      accountNumber: '',
      confirmAccountNumber: '',
      ifscCode: '',
      accountType: 'Current',

      // Step 4: Categories & Agreement
      selectedCategories: ['Women Wear', 'Men Wear'],
      catalogSize: '10 - 50 products',
      agreeTerms: true,
    };
  });

  const [stepErrors, setStepErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [activatedSellerData, setActivatedSellerData] = useState(null);
  const [submitError, setSubmitError] = useState('');
  const [quickLoginLoading, setQuickLoginLoading] = useState(false);

  // Save form data to sessionStorage on change
  useEffect(() => {
    try {
      sessionStorage.setItem('vexivo_seller_draft', JSON.stringify(formData));
    } catch {}
  }, [formData]);

  // Pre-fill user data
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        storeName: prev.storeName || `${user.name?.split(' ')[0]}'s Boutique`,
        legalBusinessName: prev.legalBusinessName || user.name || '',
        accountHolderName: prev.accountHolderName || user.name || '',
        pickupContactPerson: prev.pickupContactPerson || user.name || '',
        storeEmail: prev.storeEmail || user.email || '',
        storePhone: prev.storePhone || user.phone?.replace('+91', '') || '',
        pickupContactPhone: prev.pickupContactPhone || user.phone?.replace('+91', '') || '',
      }));
    }
  }, [user]);

  // Validation per step
  const validateStep = (step) => {
    const errors = {};

    if (step === 1) {
      if (!formData.storeName.trim()) {
        errors.storeName = 'Store name is required';
      }
      if (!formData.legalBusinessName.trim()) {
        errors.legalBusinessName = 'Legal business entity name is required';
      }
      if (!formData.storePhone.trim() || !/^[6-9]\d{9}$/.test(formData.storePhone.replace(/\D/g, ''))) {
        errors.storePhone = 'Enter a valid 10-digit Indian mobile number';
      }
      if (!formData.storeEmail.trim() || !/\S+@\S+\.\S+/.test(formData.storeEmail)) {
        errors.storeEmail = 'Enter a valid business email address';
      }
      if (!formData.isGstExempt) {
        if (!formData.gstin.trim()) {
          errors.gstin = 'GSTIN is required (or check GST-exempt box below)';
        } else if (!/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/i.test(formData.gstin.trim())) {
          errors.gstin = 'Enter a valid 15-character Indian GSTIN format (e.g. 27AAPFU0939F1ZV)';
        }
      }
      if (formData.panNumber.trim() && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/i.test(formData.panNumber.trim())) {
        errors.panNumber = 'Enter a valid 10-character Indian PAN (e.g. AAPFU0939F)';
      }
    }

    if (step === 2) {
      if (!formData.pickupStreet.trim()) {
        errors.pickupStreet = 'Warehouse / studio street address is required';
      }
      if (!formData.pickupCity.trim()) {
        errors.pickupCity = 'City is required';
      }
      if (!formData.pickupPostalCode.trim() || !/^\d{6}$/.test(formData.pickupPostalCode.trim())) {
        errors.pickupPostalCode = 'Enter a valid 6-digit Indian PIN code (e.g. 400001, 560103)';
      }
      if (!formData.pickupContactPerson.trim()) {
        errors.pickupContactPerson = 'Pickup contact name is required';
      }
      if (!formData.pickupContactPhone.trim() || !/^[6-9]\d{9}$/.test(formData.pickupContactPhone.replace(/\D/g, ''))) {
        errors.pickupContactPhone = 'Enter a valid 10-digit pickup contact number';
      }
    }

    if (step === 3) {
      if (!formData.accountHolderName.trim()) {
        errors.accountHolderName = 'Account holder name is required';
      }
      if (!formData.accountNumber.trim() || formData.accountNumber.length < 8) {
        errors.accountNumber = 'Enter a valid bank account number (8-18 digits)';
      }
      if (formData.accountNumber !== formData.confirmAccountNumber) {
        errors.confirmAccountNumber = 'Account numbers do not match';
      }
      if (!formData.ifscCode.trim() || !/^[A-Z]{4}0[A-Z0-9]{6}$/i.test(formData.ifscCode.trim())) {
        errors.ifscCode = 'Enter a valid 11-character Indian IFSC code (e.g. HDFC0001234, SBIN0000001)';
      }
    }

    if (step === 4) {
      if (formData.selectedCategories.length === 0) {
        errors.categories = 'Please select at least one primary product category';
      }
      if (!formData.agreeTerms) {
        errors.agreeTerms = 'You must accept the VEXIVO Marketplace Seller Agreement';
      }
    }

    setStepErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 4));
      window.scrollTo({ top: 120, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  const toggleCategory = (cat) => {
    setFormData((prev) => {
      const exists = prev.selectedCategories.includes(cat);
      if (exists) {
        return { ...prev, selectedCategories: prev.selectedCategories.filter((c) => c !== cat) };
      } else {
        return { ...prev, selectedCategories: [...prev.selectedCategories, cat] };
      }
    });
  };

  const handleQuickLogin = async (email, password) => {
    setQuickLoginLoading(true);
    setSubmitError('');
    try {
      await login(email, password);
    } catch (err) {
      setSubmitError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setQuickLoginLoading(false);
    }
  };

  // Submit complete seller registration
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');

    if (!validateStep(4)) return;

    if (!isAuthenticated) {
      setSubmitError('Authentication required. Please sign in below to finalize and activate your seller store.');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        storeName: formData.storeName,
        legalBusinessName: formData.legalBusinessName,
        businessType: formData.businessType,
        gstin: formData.isGstExempt ? 'GST_EXEMPT_HANDICRAFT' : formData.gstin.toUpperCase(),
        panNumber: formData.panNumber.toUpperCase(),
        storeEmail: formData.storeEmail,
        storePhone: formData.storePhone,
        storeDescription: formData.storeDescription || `Exclusive boutique merchant on VEXIVO India.`,
        storeAddress: `${formData.pickupStreet}, ${formData.pickupCity}, ${formData.pickupState} - ${formData.pickupPostalCode}`,
        pickupAddress: {
          street: formData.pickupStreet,
          city: formData.pickupCity,
          state: formData.pickupState,
          postalCode: formData.pickupPostalCode,
          country: 'India',
        },
        bankDetails: {
          accountHolderName: formData.accountHolderName,
          accountNumber: formData.accountNumber,
          bankName: formData.bankName,
          ifscCode: formData.ifscCode.toUpperCase(),
          accountType: formData.accountType,
        },
        categories: formData.selectedCategories,
      };

      const res = await api.auth.activateSeller(payload);
      if (res.success) {
        setIsSuccess(true);
        setActivatedSellerData(res.user?.sellerProfile || payload);
        try {
          sessionStorage.removeItem('vexivo_seller_draft');
        } catch {}
        await updateProfile({});
      }
    } catch (err) {
      const msg = err.message || 'Failed to complete seller onboarding.';
      if (err.status === 401 || msg.includes('token') || msg.includes('authorized')) {
        setSubmitError('Your session has expired or authentication token was missing. Please sign in below to finish activating your store without losing your filled data.');
      } else {
        setSubmitError(msg);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#F8F9FA] min-h-screen py-8 sm:py-12 font-sans selection:bg-blue-600 selection:text-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="text-xs text-neutral-500 mb-6 flex items-center space-x-2">
          <Link to="/" className="hover:text-blue-600 transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link to="/account" className="hover:text-blue-600 transition-colors">
            Account
          </Link>
          <span>/</span>
          <span className="text-neutral-900 font-bold">Seller Hub India</span>
        </div>

        {/* ================= HERO HEADER ================= */}
        <div className="bg-gradient-to-r from-neutral-900 via-neutral-950 to-blue-950 text-white rounded-3xl p-6 sm:p-10 mb-8 shadow-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400/30 text-amber-300 text-xs font-extrabold tracking-wider uppercase mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Flipkart India Inspired Seller Portal</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
              Sell on VEXIVO India
            </h1>
            <p className="text-neutral-300 text-xs sm:text-sm mt-2 leading-relaxed">
              Reach over 50,00,000+ verified fashion and lifestyle buyers across India with 0% commission on introductory sales, Ekart courier logistics, and fast bank payouts.
            </p>
          </div>

          {/* Flipkart Seller Perks Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mt-8 pt-6 border-t border-neutral-800">
            <div className="flex items-center space-x-3 bg-white/5 p-3 rounded-2xl border border-white/10">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center flex-shrink-0">
                <Percent className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold leading-tight">0% Commission</p>
                <p className="text-[10px] text-neutral-400">First 30 days free</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 bg-white/5 p-3 rounded-2xl border border-white/10">
              <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center flex-shrink-0">
                <Truck className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold leading-tight">28,000+ PIN Codes</p>
                <p className="text-[10px] text-neutral-400">Doorstep pickup</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 bg-white/5 p-3 rounded-2xl border border-white/10">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
                <CreditCard className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold leading-tight">7-Day Payouts</p>
                <p className="text-[10px] text-neutral-400">Direct to Indian Bank</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 bg-white/5 p-3 rounded-2xl border border-white/10">
              <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center flex-shrink-0">
                <Headphones className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold leading-tight">24x7 Seller Care</p>
                <p className="text-[10px] text-neutral-400">Dedicated advisor</p>
              </div>
            </div>
          </div>
        </div>

        {/* ================= GUEST SELLER ONBOARDING ACTION CARD ================= */}
        {!user && (
          <div className="bg-white border-2 border-blue-600/30 rounded-3xl p-6 sm:p-8 mb-8 shadow-lg text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                Seller Account Access
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-neutral-900">
                Start Selling on VEXIVO in 3 Minutes
              </h2>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Aapke paas pehle se seller account hai to login karein, ya 1-minute me naya seller account register karein aur apna store shuru karein.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto flex-shrink-0">
              <Link
                to="/login?redirect=/become-a-seller&role=seller"
                className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-neutral-900 hover:bg-black text-white text-xs font-bold uppercase tracking-wider text-center shadow-md transition-all flex items-center justify-center space-x-1.5"
              >
                <span>1. Seller Login</span>
              </Link>
              <Link
                to="/register?redirect=/become-a-seller&seller=true"
                className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider text-center shadow-md transition-all flex items-center justify-center space-x-1.5"
              >
                <span>2. Register as Seller</span>
              </Link>
            </div>
          </div>
        )}

        {/* ================= ALREADY A SELLER BANNER ================= */}
        {user?.isSeller && !isSuccess && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 shadow-md">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-emerald-950">
                  You are already a registered VEXIVO Seller Partner!
                </h3>
                <p className="text-xs text-emerald-800 mt-0.5">
                  Store: <strong>{user?.sellerProfile?.storeName || user?.name}</strong> | GSTIN: {user?.sellerProfile?.gstin || 'VERIFIED'}
                </p>
              </div>
            </div>
            <Link
              to="/account/seller"
              className="px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-md transition-all whitespace-nowrap"
            >
              Open Seller Dashboard →
            </Link>
          </div>
        )}

        {/* ================= SUCCESS CELEBRATION VIEW ================= */}
        {isSuccess ? (
          <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-neutral-200/80 text-center max-w-2xl mx-auto space-y-6 animate-scale-up">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-600 text-white flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/20">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-emerald-100 text-emerald-800">
                Verification Complete
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 mt-3">
                Welcome to VEXIVO Seller Hub!
              </h2>
              <p className="text-xs sm:text-sm text-neutral-500 mt-2 max-w-md mx-auto">
                Your boutique store <strong>"{activatedSellerData?.storeName || formData.storeName}"</strong> has been successfully registered and approved for selling.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/80 text-left text-xs space-y-2">
              <div className="flex justify-between border-b border-neutral-200/60 pb-1.5">
                <span className="text-neutral-500">Legal Entity:</span>
                <span className="font-bold text-neutral-900">{formData.legalBusinessName}</span>
              </div>
              <div className="flex justify-between border-b border-neutral-200/60 pb-1.5">
                <span className="text-neutral-500">GSTIN / Tax ID:</span>
                <span className="font-mono font-bold text-neutral-900">{formData.isGstExempt ? 'GST Exempt' : formData.gstin}</span>
              </div>
              <div className="flex justify-between border-b border-neutral-200/60 pb-1.5">
                <span className="text-neutral-500">Pickup Hub PIN:</span>
                <span className="font-bold text-neutral-900">{formData.pickupPostalCode} ({formData.pickupCity}, {formData.pickupState})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Payout Bank:</span>
                <span className="font-bold text-neutral-900">{formData.bankName} (IFSC: {formData.ifscCode})</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link
                to="/account/seller"
                className="w-full sm:w-auto px-8 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-lg shadow-blue-500/20 transition-all"
              >
                Go to Seller Dashboard
              </Link>
              <Link
                to="/account/seller?action=add"
                className="w-full sm:w-auto px-8 py-3 rounded-2xl bg-neutral-900 hover:bg-black text-white font-bold text-xs transition-all"
              >
                + List Your First Product
              </Link>
            </div>
          </div>
        ) : (
          /* ================= MULTI-STEP ONBOARDING WIZARD ================= */
          <div className="bg-white rounded-3xl shadow-sm border border-neutral-200/80 overflow-hidden">
            {/* Step Progress Bar (Flipkart Style) */}
            <div className="bg-neutral-50 border-b border-neutral-200/80 px-4 sm:px-8 py-4">
              <div className="grid grid-cols-4 gap-2 text-center">
                {/* Step 1 */}
                <div
                  className={`flex flex-col sm:flex-row items-center justify-center space-x-1.5 cursor-pointer ${
                    currentStep === 1
                      ? 'text-blue-600 font-bold'
                      : currentStep > 1
                      ? 'text-emerald-600 font-semibold'
                      : 'text-neutral-400'
                  }`}
                  onClick={() => currentStep > 1 && setCurrentStep(1)}
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                      currentStep === 1
                        ? 'bg-blue-600 text-white shadow-md'
                        : currentStep > 1
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-neutral-200 text-neutral-600'
                    }`}
                  >
                    {currentStep > 1 ? <Check className="w-3.5 h-3.5" /> : '1'}
                  </div>
                  <span className="text-[11px] sm:text-xs mt-1 sm:mt-0">Business Info</span>
                </div>

                {/* Step 2 */}
                <div
                  className={`flex flex-col sm:flex-row items-center justify-center space-x-1.5 cursor-pointer ${
                    currentStep === 2
                      ? 'text-blue-600 font-bold'
                      : currentStep > 2
                      ? 'text-emerald-600 font-semibold'
                      : 'text-neutral-400'
                  }`}
                  onClick={() => currentStep > 2 && setCurrentStep(2)}
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                      currentStep === 2
                        ? 'bg-blue-600 text-white shadow-md'
                        : currentStep > 2
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-neutral-200 text-neutral-600'
                    }`}
                  >
                    {currentStep > 2 ? <Check className="w-3.5 h-3.5" /> : '2'}
                  </div>
                  <span className="text-[11px] sm:text-xs mt-1 sm:mt-0">Pickup Address</span>
                </div>

                {/* Step 3 */}
                <div
                  className={`flex flex-col sm:flex-row items-center justify-center space-x-1.5 cursor-pointer ${
                    currentStep === 3
                      ? 'text-blue-600 font-bold'
                      : currentStep > 3
                      ? 'text-emerald-600 font-semibold'
                      : 'text-neutral-400'
                  }`}
                  onClick={() => currentStep > 3 && setCurrentStep(3)}
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                      currentStep === 3
                        ? 'bg-blue-600 text-white shadow-md'
                        : currentStep > 3
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-neutral-200 text-neutral-600'
                    }`}
                  >
                    {currentStep > 3 ? <Check className="w-3.5 h-3.5" /> : '3'}
                  </div>
                  <span className="text-[11px] sm:text-xs mt-1 sm:mt-0">Bank & Payouts</span>
                </div>

                {/* Step 4 */}
                <div
                  className={`flex flex-col sm:flex-row items-center justify-center space-x-1.5 cursor-pointer ${
                    currentStep === 4 ? 'text-blue-600 font-bold' : 'text-neutral-400'
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                      currentStep === 4 ? 'bg-blue-600 text-white shadow-md' : 'bg-neutral-200 text-neutral-600'
                    }`}
                  >
                    4
                  </div>
                  <span className="text-[11px] sm:text-xs mt-1 sm:mt-0">Categories & Launch</span>
                </div>
              </div>
            </div>

            {/* Form Container */}
            <form onSubmit={handleSubmit} className="p-6 sm:p-10 space-y-6">
              {/* Authentication Status Notice */}
              {!isAuthenticated && (
                <div className="p-4 sm:p-5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-3">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <p className="font-bold text-neutral-900 text-sm">Sign In Required to Activate Store</p>
                      <p className="text-neutral-600 leading-relaxed">
                        To register as an approved seller, you must be signed in to your VEXIVO account. Your filled details are safely auto-saved.
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-amber-200/60">
                    <Link
                      to="/login?redirect=/become-a-seller"
                      className="px-4 py-2 rounded-xl bg-neutral-900 hover:bg-black text-white font-bold text-xs transition-colors flex items-center space-x-1.5"
                    >
                      <span>Sign In to Your Account</span>
                    </Link>
                    <Link
                      to="/register?redirect=/become-a-seller"
                      className="px-4 py-2 rounded-xl bg-white border border-neutral-300 hover:border-black text-neutral-900 font-bold text-xs transition-colors"
                    >
                      Create Free Account
                    </Link>
                  </div>
                </div>
              )}

              {/* Submit Error Banner with Login Link */}
              {submitError && (
                <div className="p-4 sm:p-5 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-900 space-y-3 animate-shake">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-rose-950 text-sm">Action Needed</p>
                      <p className="mt-0.5 leading-relaxed text-rose-800">{submitError}</p>
                    </div>
                  </div>
                  {!isAuthenticated && (
                    <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-rose-200/60">
                      <Link
                        to="/login?redirect=/become-a-seller"
                        className="px-4 py-2 rounded-xl bg-rose-700 hover:bg-rose-800 text-white font-bold text-xs flex items-center space-x-1.5 shadow-sm transition-all"
                      >
                        <span>Sign In to Continue</span>
                      </Link>
                      <Link
                        to="/register?redirect=/become-a-seller"
                        className="px-4 py-2 rounded-xl bg-white border border-rose-300 text-rose-950 font-bold text-xs hover:bg-rose-100/50 transition-colors"
                      >
                        Create Account
                      </Link>
                    </div>
                  )}
                </div>
              )}

              {/* ================= STEP 1: BUSINESS DETAILS ================= */}
              {currentStep === 1 && (
                <div className="space-y-6 animate-fade-in">
                  <div className="pb-3 border-b border-neutral-100">
                    <h2 className="text-lg font-bold text-neutral-900 flex items-center space-x-2">
                      <Building2 className="w-5 h-5 text-blue-600" />
                      <span>Step 1: Registered Business & Store Details</span>
                    </h2>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      Provide your official business identity for tax compliance and buyer verification.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
                    {/* Store Display Name */}
                    <div>
                      <label className="block font-bold text-neutral-700 mb-1.5">
                        Store / Boutique Display Name *
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          required
                          value={formData.storeName}
                          onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                          placeholder="e.g. Royal Heritage Studio"
                          className={`w-full px-3.5 py-2.5 rounded-xl border ${
                            stepErrors.storeName ? 'border-red-500' : 'border-neutral-300'
                          } focus:border-blue-600 outline-none text-xs`}
                        />
                        {formData.storeName.length >= 3 && (
                          <span className="absolute right-3 top-2.5 text-[10px] font-bold text-emerald-600 flex items-center space-x-1">
                            <Check className="w-3 h-3" />
                            <span>Available</span>
                          </span>
                        )}
                      </div>
                      {stepErrors.storeName && (
                        <p className="text-[11px] text-red-500 mt-1">{stepErrors.storeName}</p>
                      )}
                    </div>

                    {/* Legal Entity Name */}
                    <div>
                      <label className="block font-bold text-neutral-700 mb-1.5">
                        Legal Business Entity Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.legalBusinessName}
                        onChange={(e) => setFormData({ ...formData, legalBusinessName: e.target.value })}
                        placeholder="As registered on GST or PAN"
                        className={`w-full px-3.5 py-2.5 rounded-xl border ${
                          stepErrors.legalBusinessName ? 'border-red-500' : 'border-neutral-300'
                        } focus:border-blue-600 outline-none text-xs`}
                      />
                      {stepErrors.legalBusinessName && (
                        <p className="text-[11px] text-red-500 mt-1">{stepErrors.legalBusinessName}</p>
                      )}
                    </div>

                    {/* Business Type */}
                    <div>
                      <label className="block font-bold text-neutral-700 mb-1.5">
                        Business Registration Type *
                      </label>
                      <select
                        value={formData.businessType}
                        onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 focus:border-blue-600 outline-none text-xs bg-white"
                      >
                        <option value="Sole Proprietorship / Individual">Sole Proprietorship / Individual</option>
                        <option value="Private Limited Company (Pvt Ltd)">Private Limited Company (Pvt Ltd)</option>
                        <option value="Partnership Firm">Partnership Firm</option>
                        <option value="Limited Liability Partnership (LLP)">Limited Liability Partnership (LLP)</option>
                        <option value="Artisan / Handcrafted Collective">Artisan / Handcrafted Collective</option>
                      </select>
                    </div>

                    {/* Indian GSTIN */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="font-bold text-neutral-700">
                          15-Digit Indian GSTIN *
                        </label>
                        <label className="text-[11px] text-neutral-500 flex items-center space-x-1 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.isGstExempt}
                            onChange={(e) => setFormData({ ...formData, isGstExempt: e.target.checked })}
                            className="rounded text-blue-600"
                          />
                          <span>Selling GST-Exempt Goods</span>
                        </label>
                      </div>

                      {!formData.isGstExempt ? (
                        <>
                          <input
                            type="text"
                            maxLength={15}
                            value={formData.gstin}
                            onChange={(e) => setFormData({ ...formData, gstin: e.target.value.toUpperCase() })}
                            placeholder="e.g. 27AAPFU0939F1ZV"
                            className={`w-full px-3.5 py-2.5 rounded-xl border font-mono uppercase ${
                              stepErrors.gstin ? 'border-red-500' : 'border-neutral-300'
                            } focus:border-blue-600 outline-none text-xs`}
                          />
                          {stepErrors.gstin && (
                            <p className="text-[11px] text-red-500 mt-1">{stepErrors.gstin}</p>
                          )}
                        </>
                      ) : (
                        <div className="px-3.5 py-2.5 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-800">
                          Selected: Craft / Handcrafted GST Exempt Declaration. (PAN required)
                        </div>
                      )}
                    </div>

                    {/* Business PAN */}
                    <div>
                      <label className="block font-bold text-neutral-700 mb-1.5">
                        Indian Business PAN Number {formData.isGstExempt ? '*' : '(Optional if on GST)'}
                      </label>
                      <input
                        type="text"
                        maxLength={10}
                        value={formData.panNumber}
                        onChange={(e) => setFormData({ ...formData, panNumber: e.target.value.toUpperCase() })}
                        placeholder="e.g. AAPFU0939F"
                        className={`w-full px-3.5 py-2.5 rounded-xl border font-mono uppercase ${
                          stepErrors.panNumber ? 'border-red-500' : 'border-neutral-300'
                        } focus:border-blue-600 outline-none text-xs`}
                      />
                      {stepErrors.panNumber && (
                        <p className="text-[11px] text-red-500 mt-1">{stepErrors.panNumber}</p>
                      )}
                    </div>

                    {/* Contact Phone (+91) */}
                    <div>
                      <label className="block font-bold text-neutral-700 mb-1.5">
                        Registered Indian Mobile Number (+91) *
                      </label>
                      <div className="flex">
                        <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-neutral-300 bg-neutral-100 text-neutral-700 font-bold text-xs">
                          +91
                        </span>
                        <input
                          type="tel"
                          maxLength={10}
                          required
                          value={formData.storePhone}
                          onChange={(e) => setFormData({ ...formData, storePhone: e.target.value.replace(/\D/g, '') })}
                          placeholder="9876543210"
                          className={`w-full px-3.5 py-2.5 rounded-r-xl border ${
                            stepErrors.storePhone ? 'border-red-500' : 'border-neutral-300'
                          } focus:border-blue-600 outline-none text-xs font-mono`}
                        />
                      </div>
                      {stepErrors.storePhone && (
                        <p className="text-[11px] text-red-500 mt-1">{stepErrors.storePhone}</p>
                      )}
                    </div>

                    {/* Business Email */}
                    <div className="md:col-span-2">
                      <label className="block font-bold text-neutral-700 mb-1.5">
                        Official Business Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.storeEmail}
                        onChange={(e) => setFormData({ ...formData, storeEmail: e.target.value })}
                        placeholder="orders@yourbrand.com"
                        className={`w-full px-3.5 py-2.5 rounded-xl border ${
                          stepErrors.storeEmail ? 'border-red-500' : 'border-neutral-300'
                        } focus:border-blue-600 outline-none text-xs`}
                      />
                      {stepErrors.storeEmail && (
                        <p className="text-[11px] text-red-500 mt-1">{stepErrors.storeEmail}</p>
                      )}
                    </div>

                    {/* Store Bio */}
                    <div className="md:col-span-2">
                      <label className="block font-bold text-neutral-700 mb-1.5">
                        Store Description / Brand Story (Optional)
                      </label>
                      <textarea
                        rows={2}
                        value={formData.storeDescription}
                        onChange={(e) => setFormData({ ...formData, storeDescription: e.target.value })}
                        placeholder="Share your heritage, design ethos, or craftsmanship..."
                        className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 focus:border-blue-600 outline-none text-xs"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* ================= STEP 2: PICKUP HUB & ADDRESS ================= */}
              {currentStep === 2 && (
                <div className="space-y-6 animate-fade-in">
                  <div className="pb-3 border-b border-neutral-100">
                    <h2 className="text-lg font-bold text-neutral-900 flex items-center space-x-2">
                      <MapPin className="w-5 h-5 text-blue-600" />
                      <span>Step 2: Pickup Hub & Dispatch Warehouse</span>
                    </h2>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      VEXIVO logistics partners (Ekart / Delhivery / Bluedart) will collect customer packages from this location.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
                    {/* Warehouse Address */}
                    <div className="md:col-span-2">
                      <label className="block font-bold text-neutral-700 mb-1.5">
                        Building, Unit / Studio, Street Address *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.pickupStreet}
                        onChange={(e) => setFormData({ ...formData, pickupStreet: e.target.value })}
                        placeholder="Plot No. 42, Textile Hub, Sector 18"
                        className={`w-full px-3.5 py-2.5 rounded-xl border ${
                          stepErrors.pickupStreet ? 'border-red-500' : 'border-neutral-300'
                        } focus:border-blue-600 outline-none text-xs`}
                      />
                      {stepErrors.pickupStreet && (
                        <p className="text-[11px] text-red-500 mt-1">{stepErrors.pickupStreet}</p>
                      )}
                    </div>

                    {/* PIN Code */}
                    <div>
                      <label className="block font-bold text-neutral-700 mb-1.5">
                        6-Digit Indian PIN Code *
                      </label>
                      <input
                        type="text"
                        maxLength={6}
                        required
                        value={formData.pickupPostalCode}
                        onChange={(e) =>
                          setFormData({ ...formData, pickupPostalCode: e.target.value.replace(/\D/g, '') })
                        }
                        placeholder="e.g. 400001, 560103, 110001"
                        className={`w-full px-3.5 py-2.5 rounded-xl border font-mono ${
                          stepErrors.pickupPostalCode ? 'border-red-500' : 'border-neutral-300'
                        } focus:border-blue-600 outline-none text-xs`}
                      />
                      {formData.pickupPostalCode.length === 6 && (
                        <p className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center space-x-1">
                          <Check className="w-3 h-3" />
                          <span>Ekart & Delhivery Daily Express Pickup Active</span>
                        </p>
                      )}
                      {stepErrors.pickupPostalCode && (
                        <p className="text-[11px] text-red-500 mt-1">{stepErrors.pickupPostalCode}</p>
                      )}
                    </div>

                    {/* City */}
                    <div>
                      <label className="block font-bold text-neutral-700 mb-1.5">City / Town *</label>
                      <input
                        type="text"
                        required
                        value={formData.pickupCity}
                        onChange={(e) => setFormData({ ...formData, pickupCity: e.target.value })}
                        placeholder="e.g. Mumbai, Bengaluru, Jaipur"
                        className={`w-full px-3.5 py-2.5 rounded-xl border ${
                          stepErrors.pickupCity ? 'border-red-500' : 'border-neutral-300'
                        } focus:border-blue-600 outline-none text-xs`}
                      />
                      {stepErrors.pickupCity && (
                        <p className="text-[11px] text-red-500 mt-1">{stepErrors.pickupCity}</p>
                      )}
                    </div>

                    {/* State */}
                    <div>
                      <label className="block font-bold text-neutral-700 mb-1.5">State / UT *</label>
                      <select
                        value={formData.pickupState}
                        onChange={(e) => setFormData({ ...formData, pickupState: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 focus:border-blue-600 outline-none text-xs bg-white"
                      >
                        {INDIAN_STATES.map((st) => (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Pickup Contact Person */}
                    <div>
                      <label className="block font-bold text-neutral-700 mb-1.5">
                        Warehouse Manager / Contact Person *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.pickupContactPerson}
                        onChange={(e) => setFormData({ ...formData, pickupContactPerson: e.target.value })}
                        placeholder="Person handing over packages"
                        className={`w-full px-3.5 py-2.5 rounded-xl border ${
                          stepErrors.pickupContactPerson ? 'border-red-500' : 'border-neutral-300'
                        } focus:border-blue-600 outline-none text-xs`}
                      />
                      {stepErrors.pickupContactPerson && (
                        <p className="text-[11px] text-red-500 mt-1">{stepErrors.pickupContactPerson}</p>
                      )}
                    </div>

                    {/* Pickup Contact Phone */}
                    <div className="md:col-span-2">
                      <label className="block font-bold text-neutral-700 mb-1.5">
                        Courier Pickup Coordination Mobile (+91) *
                      </label>
                      <div className="flex max-w-md">
                        <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-neutral-300 bg-neutral-100 text-neutral-700 font-bold text-xs">
                          +91
                        </span>
                        <input
                          type="tel"
                          maxLength={10}
                          required
                          value={formData.pickupContactPhone}
                          onChange={(e) =>
                            setFormData({ ...formData, pickupContactPhone: e.target.value.replace(/\D/g, '') })
                          }
                          placeholder="9876543210"
                          className={`w-full px-3.5 py-2.5 rounded-r-xl border ${
                            stepErrors.pickupContactPhone ? 'border-red-500' : 'border-neutral-300'
                          } focus:border-blue-600 outline-none text-xs font-mono`}
                        />
                      </div>
                      {stepErrors.pickupContactPhone && (
                        <p className="text-[11px] text-red-500 mt-1">{stepErrors.pickupContactPhone}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* ================= STEP 3: BANK DETAILS FOR PAYOUTS ================= */}
              {currentStep === 3 && (
                <div className="space-y-6 animate-fade-in">
                  <div className="pb-3 border-b border-neutral-100">
                    <h2 className="text-lg font-bold text-neutral-900 flex items-center space-x-2">
                      <Landmark className="w-5 h-5 text-blue-600" />
                      <span>Step 3: Indian Bank Account for Direct Payouts</span>
                    </h2>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      Your sale revenues will be deposited directly into this Indian bank account every Tuesday and Friday in INR (₹).
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
                    {/* Account Holder Name */}
                    <div>
                      <label className="block font-bold text-neutral-700 mb-1.5">
                        Bank Account Holder Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.accountHolderName}
                        onChange={(e) => setFormData({ ...formData, accountHolderName: e.target.value })}
                        placeholder="Must match Legal Entity / PAN name"
                        className={`w-full px-3.5 py-2.5 rounded-xl border ${
                          stepErrors.accountHolderName ? 'border-red-500' : 'border-neutral-300'
                        } focus:border-blue-600 outline-none text-xs`}
                      />
                      {stepErrors.accountHolderName && (
                        <p className="text-[11px] text-red-500 mt-1">{stepErrors.accountHolderName}</p>
                      )}
                    </div>

                    {/* Bank Name */}
                    <div>
                      <label className="block font-bold text-neutral-700 mb-1.5">Bank Name *</label>
                      <select
                        value={formData.bankName}
                        onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 focus:border-blue-600 outline-none text-xs bg-white"
                      >
                        {INDIAN_BANKS.map((b) => (
                          <option key={b} value={b}>
                            {b}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Account Number */}
                    <div>
                      <label className="block font-bold text-neutral-700 mb-1.5">
                        Bank Account Number *
                      </label>
                      <input
                        type="password"
                        required
                        value={formData.accountNumber}
                        onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value.replace(/\s/g, '') })}
                        placeholder="Enter account number"
                        className={`w-full px-3.5 py-2.5 rounded-xl border font-mono ${
                          stepErrors.accountNumber ? 'border-red-500' : 'border-neutral-300'
                        } focus:border-blue-600 outline-none text-xs`}
                      />
                      {stepErrors.accountNumber && (
                        <p className="text-[11px] text-red-500 mt-1">{stepErrors.accountNumber}</p>
                      )}
                    </div>

                    {/* Re-enter Account Number */}
                    <div>
                      <label className="block font-bold text-neutral-700 mb-1.5">
                        Confirm Bank Account Number *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.confirmAccountNumber}
                        onChange={(e) =>
                          setFormData({ ...formData, confirmAccountNumber: e.target.value.replace(/\s/g, '') })
                        }
                        placeholder="Re-enter to confirm"
                        className={`w-full px-3.5 py-2.5 rounded-xl border font-mono ${
                          stepErrors.confirmAccountNumber ? 'border-red-500' : 'border-neutral-300'
                        } focus:border-blue-600 outline-none text-xs`}
                      />
                      {stepErrors.confirmAccountNumber && (
                        <p className="text-[11px] text-red-500 mt-1">{stepErrors.confirmAccountNumber}</p>
                      )}
                    </div>

                    {/* IFSC Code */}
                    <div>
                      <label className="block font-bold text-neutral-700 mb-1.5">
                        11-Character Indian IFSC Code *
                      </label>
                      <input
                        type="text"
                        maxLength={11}
                        required
                        value={formData.ifscCode}
                        onChange={(e) => setFormData({ ...formData, ifscCode: e.target.value.toUpperCase() })}
                        placeholder="e.g. HDFC0001234, SBIN0000001"
                        className={`w-full px-3.5 py-2.5 rounded-xl border font-mono uppercase ${
                          stepErrors.ifscCode ? 'border-red-500' : 'border-neutral-300'
                        } focus:border-blue-600 outline-none text-xs`}
                      />
                      {stepErrors.ifscCode && (
                        <p className="text-[11px] text-red-500 mt-1">{stepErrors.ifscCode}</p>
                      )}
                    </div>

                    {/* Account Type */}
                    <div>
                      <label className="block font-bold text-neutral-700 mb-1.5">Account Type *</label>
                      <div className="flex items-center space-x-4 pt-2">
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="radio"
                            name="accountType"
                            value="Current"
                            checked={formData.accountType === 'Current'}
                            onChange={(e) => setFormData({ ...formData, accountType: e.target.value })}
                            className="text-blue-600"
                          />
                          <span className="font-semibold text-neutral-800">Current Account (Recommended)</span>
                        </label>
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="radio"
                            name="accountType"
                            value="Savings"
                            checked={formData.accountType === 'Savings'}
                            onChange={(e) => setFormData({ ...formData, accountType: e.target.value })}
                            className="text-blue-600"
                          />
                          <span className="font-semibold text-neutral-800">Savings Account</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ================= STEP 4: CATEGORIES & LAUNCH ================= */}
              {currentStep === 4 && (
                <div className="space-y-6 animate-fade-in">
                  <div className="pb-3 border-b border-neutral-100">
                    <h2 className="text-lg font-bold text-neutral-900 flex items-center space-x-2">
                      <Layers className="w-5 h-5 text-blue-600" />
                      <span>Step 4: Category Focus & Merchant Agreement</span>
                    </h2>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      Select which products you plan to sell on VEXIVO Marketplace.
                    </p>
                  </div>

                  {/* Category Pills Multi-Select */}
                  <div>
                    <label className="block font-bold text-neutral-700 mb-2 text-xs">
                      Select Primary Selling Categories (Tap to choose) *
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                      {AVAILABLE_CATEGORIES.map((cat) => {
                        const isSelected = formData.selectedCategories.includes(cat);
                        return (
                          <button
                            key={cat}
                            type="button"
                            onClick={() => toggleCategory(cat)}
                            className={`p-3 rounded-2xl border text-xs font-bold text-left transition-all flex items-center justify-between ${
                              isSelected
                                ? 'bg-blue-50 border-blue-600 text-blue-700 shadow-sm'
                                : 'bg-neutral-50/60 border-neutral-200/80 text-neutral-700 hover:bg-neutral-100'
                            }`}
                          >
                            <span>{cat}</span>
                            {isSelected && <Check className="w-3.5 h-3.5 text-blue-600" />}
                          </button>
                        );
                      })}
                    </div>
                    {stepErrors.categories && (
                      <p className="text-[11px] text-red-500 mt-1.5">{stepErrors.categories}</p>
                    )}
                  </div>

                  {/* Catalog Size */}
                  <div className="pt-2">
                    <label className="block font-bold text-neutral-700 mb-1.5 text-xs">
                      Estimated Initial Catalog Size
                    </label>
                    <select
                      value={formData.catalogSize}
                      onChange={(e) => setFormData({ ...formData, catalogSize: e.target.value })}
                      className="w-full max-w-sm px-3.5 py-2.5 rounded-xl border border-neutral-300 focus:border-blue-600 outline-none text-xs bg-white"
                    >
                      <option value="1 - 10 products">1 - 10 products</option>
                      <option value="10 - 50 products">10 - 50 products</option>
                      <option value="50 - 200 products">50 - 200 products</option>
                      <option value="200+ products">200+ products (Bulk Catalog)</option>
                    </select>
                  </div>

                  {/* Merchant Agreement */}
                  <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/80 space-y-3">
                    <label className="flex items-start space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.agreeTerms}
                        onChange={(e) => setFormData({ ...formData, agreeTerms: e.target.checked })}
                        className="mt-1 rounded text-blue-600"
                      />
                      <span className="text-xs text-neutral-700 leading-relaxed">
                        I confirm that all provided Indian business, GSTIN/PAN, and bank details are accurate. I agree to adhere to the <strong>VEXIVO India Marketplace Seller Agreement</strong>, Genuine Product Guarantee, and 7-Day Hassle-Free Customer Return Policy.
                      </span>
                    </label>
                    {stepErrors.agreeTerms && (
                      <p className="text-[11px] text-red-500">{stepErrors.agreeTerms}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Wizard Action Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
                {currentStep > 1 ? (
                  <button
                    type="button"
                    onClick={handleBack}
                    className="px-5 py-2.5 rounded-xl border border-neutral-300 text-neutral-700 hover:bg-neutral-50 font-bold text-xs flex items-center space-x-2 transition-colors"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back</span>
                  </button>
                ) : (
                  <div />
                )}

                {currentStep < 4 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center space-x-2 transition-all shadow-md shadow-blue-500/10"
                  >
                    <span>Continue to Step {currentStep + 1}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-8 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs flex items-center space-x-2 transition-all shadow-xl shadow-blue-600/20"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Verifying & Activating Store...</span>
                      </>
                    ) : (
                      <>
                        <Store className="w-4 h-4" />
                        <span>Submit Registration & Launch Store</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default BecomeSeller;
