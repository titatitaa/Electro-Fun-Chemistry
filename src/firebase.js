/**
 * Firebase Client & Cloud Firestore Provider
 * ElectroFun Chemistry — Platform Edukasi Kimia SMA
 *
 * Menggunakan Firebase Web SDK resmi v13 (firebase/app, firebase/auth, firebase/firestore)
 * Terhubung langsung ke project Google Firebase: electro-fun-chemistry
 * Mendukung live bindings untuk pengujian unit & integrasi terisolasi (testing adapter).
 */

import { initializeApp as fbInitializeApp, getApps as fbGetApps, getApp as fbGetApp } from 'firebase/app'
import * as fbAuth from 'firebase/auth'
import * as fbFirestore from 'firebase/firestore'

// Konfigurasi Firebase dari Environment Variables
const metaEnv = typeof import.meta !== 'undefined' && import.meta.env
  ? import.meta.env
  : (typeof process !== 'undefined' && process.env ? process.env : {})

export const firebaseConfig = {
  apiKey: metaEnv.VITE_FIREBASE_API_KEY || 'AIzaSyDFOf_Mewt5QHSWzK_AmkCvUs1HcyeCOPs',
  authDomain: metaEnv.VITE_FIREBASE_AUTH_DOMAIN || 'electro-fun-chemistry.firebaseapp.com',
  projectId: metaEnv.VITE_FIREBASE_PROJECT_ID || 'electro-fun-chemistry',
  storageBucket: metaEnv.VITE_FIREBASE_STORAGE_BUCKET || 'electro-fun-chemistry.firebasestorage.app',
  messagingSenderId: metaEnv.VITE_FIREBASE_MESSAGING_SENDER_ID || '737688972961',
  appId: metaEnv.VITE_FIREBASE_APP_ID || '1:737688972961:web:6aca4f59af3ea4ffc60ae0',
}

// Inisialisasi Firebase App singleton resmi
export const app = fbGetApps().length === 0 ? fbInitializeApp(firebaseConfig) : fbGetApp()
export let auth = fbAuth.getAuth(app)
export let db = fbFirestore.getFirestore(app)

// Re-export SDK resmi Firebase menggunakan live bindings
export let initializeApp = fbInitializeApp
export let getApps = fbGetApps
export let getApp = fbGetApp
export let getAuth = fbAuth.getAuth
export let getFirestore = fbFirestore.getFirestore

export let browserLocalPersistence = fbAuth.browserLocalPersistence
export let browserSessionPersistence = fbAuth.browserSessionPersistence
export let setPersistence = fbAuth.setPersistence
export let onAuthStateChanged = fbAuth.onAuthStateChanged
export let createUserWithEmailAndPassword = fbAuth.createUserWithEmailAndPassword
export let signInWithEmailAndPassword = fbAuth.signInWithEmailAndPassword
export let signOut = fbAuth.signOut
export let updateProfile = fbAuth.updateProfile
export let sendPasswordResetEmail = fbAuth.sendPasswordResetEmail
export let confirmPasswordReset = fbAuth.confirmPasswordReset
export let verifyPasswordResetCode = fbAuth.verifyPasswordResetCode
export let updatePassword = fbAuth.updatePassword

export let serverTimestamp = fbFirestore.serverTimestamp
export let doc = fbFirestore.doc
export let collection = fbFirestore.collection
export let setDoc = fbFirestore.setDoc
export let getDoc = fbFirestore.getDoc
export let updateDoc = fbFirestore.updateDoc
export let addDoc = fbFirestore.addDoc
export let where = fbFirestore.where
export let orderBy = fbFirestore.orderBy
export let limit = fbFirestore.limit
export let query = fbFirestore.query
export let getDocs = fbFirestore.getDocs

/**
 * Adapter Pengujian (Test Adapter Hook)
 * Digunakan untuk pengujian otomatis (unit/integration test di Node.js)
 * tanpa memicu panggilan jaringan eksternal ke Google Server.
 */
export function setFirebaseTestAdapter(adapter = {}) {
  if (adapter.auth !== undefined) auth = adapter.auth
  if (adapter.db !== undefined) db = adapter.db
  if (adapter.createUserWithEmailAndPassword) createUserWithEmailAndPassword = adapter.createUserWithEmailAndPassword
  if (adapter.signInWithEmailAndPassword) signInWithEmailAndPassword = adapter.signInWithEmailAndPassword
  if (adapter.signOut) signOut = adapter.signOut
  if (adapter.updateProfile) updateProfile = adapter.updateProfile
  if (adapter.sendPasswordResetEmail) sendPasswordResetEmail = adapter.sendPasswordResetEmail
  if (adapter.confirmPasswordReset) confirmPasswordReset = adapter.confirmPasswordReset
  if (adapter.verifyPasswordResetCode) verifyPasswordResetCode = adapter.verifyPasswordResetCode
  if (adapter.updatePassword) updatePassword = adapter.updatePassword
  if (adapter.setPersistence) setPersistence = adapter.setPersistence
  if (adapter.onAuthStateChanged) onAuthStateChanged = adapter.onAuthStateChanged
  if (adapter.doc) doc = adapter.doc
  if (adapter.collection) collection = adapter.collection
  if (adapter.setDoc) setDoc = adapter.setDoc
  if (adapter.getDoc) getDoc = adapter.getDoc
  if (adapter.updateDoc) updateDoc = adapter.updateDoc
  if (adapter.addDoc) addDoc = adapter.addDoc
  if (adapter.query) query = adapter.query
  if (adapter.where) where = adapter.where
  if (adapter.orderBy) orderBy = adapter.orderBy
  if (adapter.limit) limit = adapter.limit
  if (adapter.getDocs) getDocs = adapter.getDocs
  if (adapter.serverTimestamp) serverTimestamp = adapter.serverTimestamp
}
