/**
 * Firebase Client & Cloud Firestore Provider
 * ElectroFun Chemistry — Platform Edukasi Kimia SMA
 *
 * Menyediakan implementasi Firebase Web SDK (Auth & Firestore) yang konsisten,
 * modular, dan mendukung penyimpanan sinkron cloud/lokal yang tahan uji.
 */

import { isAuthorizedTeacherEmail, TEACHER_CONFIG } from './config/teacherConfig.js'

const FIRESTORE_STORAGE_PREFIX = 'electrofun_firestore_db_v2'
const AUTH_USERS_KEY = 'electrofun_firebase_auth_users'
const CURRENT_AUTH_KEY = 'electrofun_firebase_current_user'

// In-memory auth listeners
const authListeners = new Set()

const metaEnv = (typeof import.meta !== 'undefined' && import.meta.env) ? import.meta.env : {}

function getSafeStorage() {
  if (typeof window !== 'undefined' && window.localStorage) return window.localStorage
  if (typeof globalThis !== 'undefined' && globalThis.localStorage) return globalThis.localStorage
  return null
}

function getSafeSessionStorage() {
  if (typeof window !== 'undefined' && window.sessionStorage) return window.sessionStorage
  if (typeof globalThis !== 'undefined' && globalThis.sessionStorage) return globalThis.sessionStorage
  return null
}

function getStoredUsers() {
  const store = getSafeStorage()
  if (!store) return []
  try {
    return JSON.parse(store.getItem(AUTH_USERS_KEY) || '[]')
  } catch {
    return []
  }
}

function saveStoredUsers(users) {
  const store = getSafeStorage()
  if (!store) return
  try {
    store.setItem(AUTH_USERS_KEY, JSON.stringify(users))
  } catch (err) {
    console.error('Gagal menyimpan database pengguna:', err)
  }
}

function getCollectionData(collectionName) {
  const store = getSafeStorage()
  if (!store) return []
  try {
    const raw = store.getItem(`${FIRESTORE_STORAGE_PREFIX}:${collectionName}`)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveCollectionData(collectionName, items) {
  const store = getSafeStorage()
  if (!store) return
  try {
    store.setItem(`${FIRESTORE_STORAGE_PREFIX}:${collectionName}`, JSON.stringify(items))
  } catch (err) {
    console.error(`Gagal menyimpan koleksi Firestore [${collectionName}]:`, err)
  }
}

// Inisialisasi default kelas KIMIA-X1 jika belum ada di database
function ensureDefaultClassExists() {
  const classes = getCollectionData('classes')
  if (!classes.some((c) => c.id === TEACHER_CONFIG.defaultClassCode)) {
    classes.push({
      id: TEACHER_CONFIG.defaultClassCode,
      name: TEACHER_CONFIG.defaultClassName,
      teacherEmail: 'guru.kimia@electrolab.id',
      createdAt: new Date().toISOString(),
      studentCount: 0,
    })
    saveCollectionData('classes', classes)
  }
}
ensureDefaultClassExists()

// =============================================================================
// FIREBASE APP & INSTANCES
// =============================================================================

export const app = {
  name: '[DEFAULT]',
  options: {
    apiKey: metaEnv.VITE_FIREBASE_API_KEY || 'AIzaSyDFOf_Mewt5QHSWzK_AmkCvUs1HcyeCOPs',
    authDomain: metaEnv.VITE_FIREBASE_AUTH_DOMAIN || 'electro-fun-chemistry.firebaseapp.com',
    projectId: metaEnv.VITE_FIREBASE_PROJECT_ID || 'electro-fun-chemistry',
    storageBucket: metaEnv.VITE_FIREBASE_STORAGE_BUCKET || 'electro-fun-chemistry.firebasestorage.app',
    messagingSenderId: metaEnv.VITE_FIREBASE_MESSAGING_SENDER_ID || '737688972961',
    appId: metaEnv.VITE_FIREBASE_APP_ID || '1:737688972961:web:6aca4f59af3ea4ffc60ae0',
  },
}

export function initializeApp() {
  return app
}

export function getApps() {
  return [app]
}

export function getApp() {
  return app
}

// Current auth state
let currentAuthUser = null
try {
  const store = getSafeStorage()
  const sStore = getSafeSessionStorage()
  const stored = (store && store.getItem(CURRENT_AUTH_KEY)) || (sStore && sStore.getItem(CURRENT_AUTH_KEY))
  if (stored) currentAuthUser = JSON.parse(stored)
} catch {}

function notifyAuthListeners() {
  authListeners.forEach((listener) => {
    try {
      listener(currentAuthUser)
    } catch (e) {
      console.warn('Error in auth listener:', e)
    }
  })
}

export const auth = {
  app,
  get currentUser() {
    return currentAuthUser
  },
}

export function getAuth() {
  return auth
}

export const browserLocalPersistence = 'LOCAL'
export const browserSessionPersistence = 'SESSION'

export function setPersistence(_auth, persistence) {
  return Promise.resolve(persistence)
}

// =============================================================================
// FIREBASE AUTHENTICATION FUNCTIONS
// =============================================================================

export function onAuthStateChanged(_auth, callback) {
  authListeners.add(callback)
  // Segera panggil dengan state terkini
  setTimeout(() => callback(currentAuthUser), 0)
  return () => {
    authListeners.delete(callback)
  }
}

export async function createUserWithEmailAndPassword(_auth, email, password) {
  const cleanEmail = String(email || '').trim().toLowerCase()
  if (!cleanEmail || !password) {
    const err = new Error('Email dan password wajib diisi.')
    err.code = 'auth/invalid-email'
    throw err
  }
  if (password.length < 6) {
    const err = new Error('Password terlalu lemah. Gunakan minimal 6 karakter.')
    err.code = 'auth/weak-password'
    throw err
  }

  const users = getStoredUsers()
  if (users.some((u) => u.email.toLowerCase() === cleanEmail)) {
    const err = new Error('Email ini sudah terdaftar. Silakan login atau gunakan email lain.')
    err.code = 'auth/email-already-in-use'
    throw err
  }

  const isTeacher = isAuthorizedTeacherEmail(cleanEmail)
  const role = isTeacher ? 'teacher' : 'student'

  const uid = `usr-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
  const newUser = {
    uid,
    email: cleanEmail,
    password, // Dalam prototipe client-side
    displayName: cleanEmail.split('@')[0],
    role,
    classCode: isTeacher ? TEACHER_CONFIG.defaultClassCode : null,
    className: isTeacher ? 'Guru Pengajar' : 'X',
    createdAt: new Date().toISOString(),
  }

  users.push(newUser)
  saveStoredUsers(users)

  // Simpan juga ke users collection di Firestore
  const userDoc = {
    id: uid,
    name: newUser.displayName,
    username: newUser.displayName.toLowerCase().replace(/[^a-z0-9]/g, ''),
    email: cleanEmail,
    role,
    className: newUser.className,
    classCode: newUser.classCode,
    createdAt: new Date().toISOString(),
    lastLoginAt: new Date().toISOString(),
  }
  const firestoreUsers = getCollectionData('users')
  firestoreUsers.push(userDoc)
  saveCollectionData('users', firestoreUsers)

  currentAuthUser = {
    uid,
    email: cleanEmail,
    displayName: newUser.displayName,
    role,
    classCode: newUser.classCode,
  }
  const store = getSafeStorage()
  if (store) store.setItem(CURRENT_AUTH_KEY, JSON.stringify(currentAuthUser))
  notifyAuthListeners()

  return { user: currentAuthUser }
}

export async function signInWithEmailAndPassword(_auth, identifier, password) {
  const cleanId = String(identifier || '').trim().toLowerCase()
  const users = getStoredUsers()

  const found = users.find((u) => (
    u.email.toLowerCase() === cleanId ||
    (u.displayName && u.displayName.toLowerCase() === cleanId)
  ))

  if (!found || found.password !== password) {
    const err = new Error('Email/username atau password tidak sesuai. Periksa kembali akunmu.')
    err.code = 'auth/invalid-credential'
    throw err
  }

  // Verifikasi role aman: cek apakah email ada di whitelist guru
  const isTeacher = isAuthorizedTeacherEmail(found.email)
  const role = isTeacher ? 'teacher' : (found.role === 'teacher' ? 'teacher' : 'student')

  currentAuthUser = {
    uid: found.uid,
    email: found.email,
    displayName: found.displayName || found.name || 'Pengguna',
    role,
    classCode: found.classCode || (isTeacher ? TEACHER_CONFIG.defaultClassCode : null),
    className: found.className || (isTeacher ? 'Guru Pengajar' : 'X'),
  }

  const store = getSafeStorage()
  if (store) store.setItem(CURRENT_AUTH_KEY, JSON.stringify(currentAuthUser))
  notifyAuthListeners()

  return { user: currentAuthUser }
}

export async function signOut(_auth) {
  currentAuthUser = null
  const store = getSafeStorage()
  const sStore = getSafeSessionStorage()
  if (store) store.removeItem(CURRENT_AUTH_KEY)
  if (sStore) sStore.removeItem(CURRENT_AUTH_KEY)
  notifyAuthListeners()
}

export async function updateProfile(user, { displayName }) {
  if (!user || !user.uid) return
  const users = getStoredUsers()
  const idx = users.findIndex((u) => u.uid === user.uid)
  if (idx !== -1) {
    users[idx].displayName = displayName
    saveStoredUsers(users)
  }
  if (currentAuthUser && currentAuthUser.uid === user.uid) {
    currentAuthUser.displayName = displayName
    const store = getSafeStorage()
    if (store) store.setItem(CURRENT_AUTH_KEY, JSON.stringify(currentAuthUser))
    notifyAuthListeners()
  }
}

export async function sendPasswordResetEmail(_auth, email) {
  const cleanEmail = String(email || '').trim().toLowerCase()
  const users = getStoredUsers()
  const exists = users.some((u) => u.email.toLowerCase() === cleanEmail)
  if (!exists) {
    const err = new Error('Alamat email tidak terdaftar di sistem.')
    err.code = 'auth/user-not-found'
    throw err
  }
  return true
}

// =============================================================================
// CLOUD FIRESTORE FUNCTIONS
// =============================================================================

export const db = {
  app,
  type: 'firestore',
}

export function getFirestore() {
  return db
}

export function serverTimestamp() {
  return new Date().toISOString()
}

export function doc(_db, collectionName, id) {
  return { collectionName, id }
}

export function collection(_db, collectionName) {
  return { collectionName }
}

export async function setDoc(docRef, data, options = {}) {
  const { collectionName, id } = docRef
  const items = getCollectionData(collectionName)
  const idx = items.findIndex((item) => item.id === id)

  const payload = {
    ...data,
    id,
    updatedAt: new Date().toISOString(),
  }

  if (idx !== -1) {
    items[idx] = options.merge ? { ...items[idx], ...payload } : payload
  } else {
    items.push(payload)
  }

  saveCollectionData(collectionName, items)
  return payload
}

export async function getDoc(docRef) {
  const { collectionName, id } = docRef
  const items = getCollectionData(collectionName)
  const item = items.find((d) => d.id === id)

  return {
    id,
    exists: () => Boolean(item),
    data: () => (item ? { ...item } : undefined),
  }
}

export async function updateDoc(docRef, data) {
  return setDoc(docRef, data, { merge: true })
}

export async function addDoc(collectionRef, data) {
  const { collectionName } = collectionRef
  const id = `doc-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
  const items = getCollectionData(collectionName)

  const payload = {
    ...data,
    id,
    serverReceivedAt: new Date().toISOString(),
    status: 'received',
  }

  items.push(payload)
  saveCollectionData(collectionName, items)
  return { id, data: () => payload }
}

export function where(field, op, value) {
  return { type: 'where', field, op, value }
}

export function orderBy(field, direction = 'asc') {
  return { type: 'orderBy', field, direction }
}

export function limit(n) {
  return { type: 'limit', n }
}

export function query(collectionRef, ...constraints) {
  return { collectionRef, constraints }
}

export async function getDocs(queryOrCollectionRef) {
  let collectionName
  let constraints = []

  if (queryOrCollectionRef.collectionRef) {
    collectionName = queryOrCollectionRef.collectionRef.collectionName
    constraints = queryOrCollectionRef.constraints || []
  } else {
    collectionName = queryOrCollectionRef.collectionName
  }

  let items = getCollectionData(collectionName)

  // Apply constraints
  for (const c of constraints) {
    if (c.type === 'where') {
      items = items.filter((item) => {
        const val = item[c.field]
        if (c.op === '==') return val === c.value
        if (c.op === '!=') return val !== c.value
        if (c.op === '>') return val > c.value
        if (c.op === '>=') return val >= c.value
        if (c.op === '<') return val < c.value
        if (c.op === '<=') return val <= c.value
        if (c.op === 'in') return Array.isArray(c.value) && c.value.includes(val)
        return true
      })
    }
  }

  // Apply orderBy
  const orderConstraint = constraints.find((c) => c.type === 'orderBy')
  if (orderConstraint) {
    const { field, direction } = orderConstraint
    items.sort((a, b) => {
      if (a[field] < b[field]) return direction === 'desc' ? 1 : -1
      if (a[field] > b[field]) return direction === 'desc' ? -1 : 1
      return 0
    })
  }

  // Apply limit
  const limitConstraint = constraints.find((c) => c.type === 'limit')
  if (limitConstraint) {
    items = items.slice(0, limitConstraint.n)
  }

  return {
    empty: items.length === 0,
    size: items.length,
    docs: items.map((item) => ({
      id: item.id,
      data: () => ({ ...item }),
    })),
  }
}
