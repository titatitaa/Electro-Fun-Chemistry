/**
 * Firebase Client & Cloud Firestore Provider
 * ElectroFun Chemistry — Platform Edukasi Kimia SMA
 *
 * Menggunakan Firebase Web SDK resmi v13 (firebase/app, firebase/auth, firebase/firestore)
 * Terhubung langsung ke project Google Firebase: electro-fun-chemistry
 */

import { initializeApp, getApps, getApp } from 'firebase/app'
import {
  getAuth,
  browserLocalPersistence,
  browserSessionPersistence,
  setPersistence,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  sendPasswordResetEmail,
} from 'firebase/auth'
import {
  getFirestore,
  serverTimestamp,
  doc,
  collection,
  setDoc,
  getDoc,
  updateDoc,
  addDoc,
  where,
  orderBy,
  limit,
  query,
  getDocs,
} from 'firebase/firestore'

// Konfigurasi Firebase dari Environment Variables
const metaEnv = typeof import.meta !== 'undefined' && import.meta.env
  ? import.meta.env
  : (typeof process !== 'undefined' && process.env ? process.env : {})

export const firebaseConfig = {
  apiKey: metaEnv.VITE_FIREBASE_API_KEY,
  authDomain: metaEnv.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: metaEnv.VITE_FIREBASE_PROJECT_ID,
  storageBucket: metaEnv.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: metaEnv.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: metaEnv.VITE_FIREBASE_APP_ID,
}

// Inisialisasi Firebase App singleton
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp()
export const auth = getAuth(app)
export const db = getFirestore(app)

// Re-export SDK resmi Firebase untuk modularitas aplikasi
export {
  initializeApp,
  getApps,
  getApp,
  getAuth,
  browserLocalPersistence,
  browserSessionPersistence,
  setPersistence,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  sendPasswordResetEmail,
  getFirestore,
  serverTimestamp,
  doc,
  collection,
  setDoc,
  getDoc,
  updateDoc,
  addDoc,
  where,
  orderBy,
  limit,
  query,
  getDocs,
}
