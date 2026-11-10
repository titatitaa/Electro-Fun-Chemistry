import { initializeApp, getApps, getApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

// Konfigurasi Firebase dari Environment Variables (.env) atau objek kredensial langsung
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDFOf_Mewt5QHSWzK_AmkCvUs1HcyeCOPs",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "electro-fun-chemistry.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "electro-fun-chemistry",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "electro-fun-chemistry.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "737688972961",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:737688972961:web:6aca4f59af3ea4ffc60ae0"
}

// Inisialisasi Firebase App (singleton)
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp()
export const auth = getAuth(app)
export const db = getFirestore(app)
