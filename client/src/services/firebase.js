/**
 * Firebase Configuration for VEXIVO E-Commerce
 * Phone Authentication & Email Authentication Support
 */

import { initializeApp } from 'firebase/app';
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signOut,
  reload,
} from 'firebase/auth';

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
 * Register user with email + password
 */
export const registerWithEmail = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    try {
      await sendEmailVerification(userCredential.user);
      console.log('[Firebase] Verification email sent');
    } catch (verErr) {
      console.warn('[Firebase] Verification email send notice:', verErr.message);
    }
    return {
      uid: userCredential.user.uid,
      email: userCredential.user.email,
      emailVerified: userCredential.user.emailVerified,
    };
  } catch (error) {
    console.error('[Firebase] Registration error:', error);
    const errorMessages = {
      'auth/email-already-in-use': 'This email is already registered.',
      'auth/invalid-email': 'Please enter a valid email address.',
      'auth/weak-password': 'Password should be at least 6 characters.',
      'auth/operation-not-allowed': 'Email/Password authentication is not enabled in Firebase.',
    };
    throw new Error(errorMessages[error.code] || error.message || 'Registration failed.');
  }
};

/**
 * Login with email + password
 */
export const loginWithEmail = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    try {
      await reload(userCredential.user);
    } catch (e) {}

    const idToken = await userCredential.user.getIdToken();
    return {
      uid: userCredential.user.uid,
      email: userCredential.user.email,
      emailVerified: userCredential.user.emailVerified,
      idToken,
    };
  } catch (error) {
    const errorMessages = {
      'auth/invalid-email': 'Please enter a valid email address.',
      'auth/invalid-credential': 'Incorrect email or password.',
      'auth/user-not-found': 'No account found with this email.',
      'auth/wrong-password': 'Incorrect email or password.',
      'auth/too-many-requests': 'Too many login attempts. Please try again later.',
    };
    throw new Error(errorMessages[error.code] || error.message || 'Login failed. Please try again.');
  }
};

/**
 * Resend verification email
 */
export const resendVerificationEmail = async () => {
  try {
    if (!auth.currentUser) {
      throw new Error('No logged-in user found.');
    }
    await sendEmailVerification(auth.currentUser);
    return true;
  } catch (error) {
    throw new Error(error.message || 'Unable to resend verification email.');
  }
};

/**
 * Setup invisible reCAPTCHA verifier
 */
let recaptchaVerifier = null;

export const setupRecaptcha = (elementId = 'recaptcha-container') => {
  if (recaptchaVerifier) {
    try {
      recaptchaVerifier.clear();
    } catch (e) {}
    recaptchaVerifier = null;
  }

  recaptchaVerifier = new RecaptchaVerifier(auth, elementId, {
    size: 'invisible',
    callback: () => {
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
    if (recaptchaVerifier) {
      try {
        recaptchaVerifier.clear();
      } catch (e) {}
      recaptchaVerifier = null;
    }

    const errorMessages = {
      'auth/invalid-phone-number': 'Invalid phone number format. Please include country code.',
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
 */
export const verifyFirebaseOtp = async (confirmationResult, otpCode) => {
  try {
    const result = await confirmationResult.confirm(otpCode);
    const idToken = await result.user.getIdToken();
    return {
      idToken,
      phoneNumber: result.user.phoneNumber,
      uid: result.user.uid,
    };
  } catch (error) {
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
