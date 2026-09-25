/**
 * Firebase Configuration for VEXIVO E-Commerce
 * 
 * Google Firebase Phone Authentication (FREE - Spark Plan)
 * - Firebase handles SMS delivery automatically via Google's servers
 * - No third-party SMS gateway needed (No Fast2SMS, Twilio, etc.)
 * - Free tier: ~50 phone verifications/month (Spark Plan)
 * - With Identity Platform: 10,000/month free
 * 
 * Setup Instructions:
 * 1. Go to https://console.firebase.google.com
 * 2. Create a new project (or use existing)
 * 3. Go to Authentication > Sign-in method > Phone > Enable
 * 4. Go to Project Settings > General > Your apps > Add Web App
 * 5. Copy the firebaseConfig values to your .env file
 */

import { initializeApp } from 'firebase/app';
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';

// Firebase config from environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Set language to user's browser language
auth.languageCode = navigator.language || 'en';

/**
 * Setup invisible reCAPTCHA verifier
 * Required by Firebase Phone Auth to prevent abuse
 * The reCAPTCHA is invisible - user won't see any challenge
 */
let recaptchaVerifier = null;

export const setupRecaptcha = (elementId = 'recaptcha-container') => {
  // Clear existing verifier if any
  if (recaptchaVerifier) {
    try {
      recaptchaVerifier.clear();
    } catch (e) {
      // Ignore cleanup errors
    }
    recaptchaVerifier = null;
  }

  recaptchaVerifier = new RecaptchaVerifier(auth, elementId, {
    size: 'invisible',
    callback: () => {
      // reCAPTCHA solved - will proceed with phone auth
      console.log('[Firebase] reCAPTCHA verified successfully');
    },
    'expired-callback': () => {
      console.log('[Firebase] reCAPTCHA expired, re-rendering...');
      recaptchaVerifier = null;
    },
  });

  return recaptchaVerifier;
};

/**
 * Send OTP to phone number using Firebase
 * Firebase handles SMS delivery automatically (FREE!)
 * 
 * @param {string} phoneNumber - Full phone number with country code (e.g., +919876543210)
 * @returns {Object} confirmationResult - Use this to verify OTP later
 */
export const sendFirebaseOtp = async (phoneNumber) => {
  if (!recaptchaVerifier) {
    setupRecaptcha();
  }

  try {
    const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
    console.log('[Firebase] OTP sent successfully to', phoneNumber);
    return confirmationResult;
  } catch (error) {
    console.error('[Firebase] Error sending OTP:', error);
    
    // Reset reCAPTCHA on error so user can retry
    if (recaptchaVerifier) {
      try {
        recaptchaVerifier.clear();
      } catch (e) {
        // Ignore
      }
      recaptchaVerifier = null;
    }

    // Provide user-friendly error messages
    const errorMessages = {
      'auth/invalid-phone-number': 'Invalid phone number format. Please include country code (e.g., +91XXXXXXXXXX).',
      'auth/too-many-requests': 'Too many OTP requests. Please wait a few minutes before trying again.',
      'auth/quota-exceeded': 'SMS quota exceeded. Please try again later.',
      'auth/captcha-check-failed': 'Security verification failed. Please refresh the page and try again.',
      'auth/missing-phone-number': 'Please enter a valid phone number.',
      'auth/user-disabled': 'This phone number has been disabled. Contact support.',
      'auth/operation-not-allowed': 'Phone authentication is not enabled. Please contact the administrator.',
    };

    throw new Error(errorMessages[error.code] || error.message || 'Failed to send OTP. Please try again.');
  }
};

/**
 * Verify OTP code entered by user
 * 
 * @param {Object} confirmationResult - From sendFirebaseOtp()
 * @param {string} otpCode - 6-digit code entered by user
 * @returns {string} Firebase ID Token - Send this to your backend for verification
 */
export const verifyFirebaseOtp = async (confirmationResult, otpCode) => {
  try {
    const result = await confirmationResult.confirm(otpCode);
    // Get Firebase ID token to send to our backend
    const idToken = await result.user.getIdToken();
    console.log('[Firebase] OTP verified successfully');
    return {
      idToken,
      phoneNumber: result.user.phoneNumber,
      uid: result.user.uid,
    };
  } catch (error) {
    console.error('[Firebase] OTP verification failed:', error);
    
    const errorMessages = {
      'auth/invalid-verification-code': 'Invalid OTP code. Please check and try again.',
      'auth/code-expired': 'OTP has expired. Please request a new one.',
      'auth/session-expired': 'Verification session has expired. Please request a new OTP.',
    };

    throw new Error(errorMessages[error.code] || 'Invalid or expired OTP. Please try again.');
  }
};

export { auth };
export default app;
