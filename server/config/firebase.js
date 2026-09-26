/**
 * Firebase Admin SDK Configuration for VEXIVO Server
 * 
 * Used to verify Firebase Phone Auth ID tokens on the backend.
 * This ensures that the OTP verification done on the client-side
 * is genuine and hasn't been tampered with.
 * 
 * Setup:
 * 1. Go to Firebase Console > Project Settings > Service Accounts
 * 2. Click "Generate new private key" 
 * 3. Save the JSON file and set the path in .env as FIREBASE_SERVICE_ACCOUNT_PATH
 *    OR set FIREBASE_PROJECT_ID for simpler setup
 */

const admin = require('firebase-admin');

let firebaseApp = null;

const initializeFirebaseAdmin = () => {
  if (firebaseApp) return firebaseApp;

  try {
    const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
    
    if (serviceAccountPath) {
      // Method 1: Using service account JSON file (Recommended for production)
      const serviceAccount = require(serviceAccountPath);
      firebaseApp = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
      console.log('[Firebase Admin] ✅ Initialized with service account credentials');
    } else if (process.env.FIREBASE_PROJECT_ID) {
      // Method 2: Using project ID only (Works for development & when running on Google Cloud)
      firebaseApp = admin.initializeApp({
        projectId: process.env.FIREBASE_PROJECT_ID,
      });
      console.log('[Firebase Admin] ✅ Initialized with project ID:', process.env.FIREBASE_PROJECT_ID);
    } else {
      // Method 3: Default initialization (works if GOOGLE_APPLICATION_CREDENTIALS env var is set)
      firebaseApp = admin.initializeApp();
      console.log('[Firebase Admin] ✅ Initialized with default credentials');
    }
  } catch (error) {
    console.error('[Firebase Admin] ❌ Initialization error:', error.message);
    // Don't throw - allow server to start, Firebase routes will return appropriate errors
  }

  return firebaseApp;
};

/**
 * Verify Firebase ID Token
 * Called after client-side phone OTP verification
 * 
 * @param {string} idToken - Firebase ID token from client
 * @returns {Object} Decoded token with phone number, uid, etc.
 */
const verifyFirebaseToken = async (idToken) => {
  if (!firebaseApp) {
    initializeFirebaseAdmin();
  }

  if (!firebaseApp) {
    throw new Error('Firebase Admin SDK is not configured. Please set FIREBASE_PROJECT_ID or FIREBASE_SERVICE_ACCOUNT_PATH in .env');
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    return {
      uid: decodedToken.uid,
      phoneNumber: decodedToken.phone_number,
      email: decodedToken.email || null,
      name: decodedToken.name || null,
    };
  } catch (error) {
    console.error('[Firebase Admin] Token verification failed:', error.message);
    
    if (error.code === 'auth/id-token-expired') {
      throw new Error('Verification session expired. Please request a new OTP.');
    }
    if (error.code === 'auth/argument-error') {
      throw new Error('Invalid verification token. Please try again.');
    }
    
    throw new Error('Phone verification failed. Please try again.');
  }
};

// Initialize on module load
initializeFirebaseAdmin();

module.exports = {
  initializeFirebaseAdmin,
  verifyFirebaseToken,
  admin,
};
