/**
 * Zeerocodes Firebase Configuration & Service Initializer
 * Provides seamless integration with Firebase Auth & Cloud Firestore.
 * Includes local fallback simulation for instant browser testing if keys are pending.
 */

const DEFAULT_FIREBASE_CONFIG_KEY = 'zeerocodes_firebase_config';

// Load stored or default config
function getStoredFirebaseConfig() {
  try {
    const raw = localStorage.getItem(DEFAULT_FIREBASE_CONFIG_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn("Failed reading stored Firebase config", e);
  }
  return {
    apiKey: "",
    authDomain: "zeerocodes-prod.firebaseapp.com",
    projectId: "zeerocodes-prod",
    storageBucket: "zeerocodes-prod.appspot.com",
    messagingSenderId: "123456789012",
    appId: "1:123456789012:web:abcdef123456"
  };
}

let currentFirebaseConfig = getStoredFirebaseConfig();
let isLiveFirebase = false;
let firebaseApp = null;
let firebaseAuth = null;
let firestoreDb = null;

// Initialize Firebase services
function initFirebase() {
  const hasValidConfig = currentFirebaseConfig && 
    currentFirebaseConfig.apiKey && 
    currentFirebaseConfig.apiKey.length > 10 &&
    !currentFirebaseConfig.apiKey.includes("YOUR_");

  if (hasValidConfig && window.firebase) {
    try {
      if (!window.firebase.apps || window.firebase.apps.length === 0) {
        firebaseApp = window.firebase.initializeApp(currentFirebaseConfig);
      } else {
        firebaseApp = window.firebase.apps[0];
      }
      firebaseAuth = window.firebase.auth();
      firestoreDb = window.firebase.firestore();
      isLiveFirebase = true;
      console.log("🔥 Connected to live Firebase project:", currentFirebaseConfig.projectId);
    } catch (err) {
      console.warn("⚠️ Live Firebase initialization error, activating sandbox emulator:", err);
      isLiveFirebase = false;
    }
  } else {
    isLiveFirebase = false;
    console.log("⚡ Zeerocodes Local Sandbox Auth & Firestore Active (Ready for live keys anytime)");
  }
}

// Helper to save new Firebase credentials from UI
function saveFirebaseConfig(config) {
  try {
    localStorage.setItem(DEFAULT_FIREBASE_CONFIG_KEY, JSON.stringify(config));
    currentFirebaseConfig = config;
    initFirebase();
    if (window.toast) window.toast.success("Firebase configuration saved! Reloading...");
    setTimeout(() => window.location.reload(), 800);
  } catch (e) {
    if (window.toast) window.toast.error("Failed saving Firebase config: " + e.message);
  }
}

// Run initial configuration
initFirebase();

window.zeerocodesFirebase = {
  getConfig: () => currentFirebaseConfig,
  saveConfig: saveFirebaseConfig,
  isLive: () => isLiveFirebase,
  getAuth: () => firebaseAuth,
  getDb: () => firestoreDb
};
