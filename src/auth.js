const USERS_KEY = 'chemistry_lab_users'
const LOCAL_SESSION_KEY = 'chemistry_lab_session'
const SESSION_KEY = 'chemistry_lab_temporary_session'

function readUsers() {
  const stored = window.localStorage.getItem(USERS_KEY)
  if (!stored) return []

  let users
  try {
    users = JSON.parse(stored)
  } catch {
    throw new Error('Data akun lokal rusak. Hapus data situs lalu daftar kembali.')
  }
  if (!Array.isArray(users) || users.some((user) => (
    !user || typeof user.email !== 'string' || typeof user.name !== 'string'
  ))) {
    throw new Error('Data akun lokal tidak dapat dibaca. Hapus data situs lalu coba lagi.')
  }
  return users
}

function normalizeEmail(email) {
  return email.trim().toLowerCase()
}

export function registerUser({ name, email, className, password }) {
  const users = readUsers()
  const normalizedEmail = normalizeEmail(email)

  if (users.some((user) => user.email === normalizedEmail)) {
    throw new Error('Email ini sudah terdaftar. Silakan masuk atau gunakan email lain.')
  }

  const user = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    name: name.trim(),
    email: normalizedEmail,
    className,
    password,
  }

  window.localStorage.setItem(USERS_KEY, JSON.stringify([...users, user]))
  return toPublicUser(user)
}

export function loginUser({ name, email, password, remember }) {
  const normalizedEmail = normalizeEmail(email)
  const user = readUsers().find((account) => account.email === normalizedEmail)

  if (!user || user.password !== password || user.name.toLowerCase() !== name.trim().toLowerCase()) {
    throw new Error('Nama, email, atau password tidak sesuai. Periksa kembali data akunmu.')
  }

  const session = JSON.stringify(toPublicUser(user))
  const targetStorage = remember ? window.localStorage : window.sessionStorage
  const targetKey = remember ? LOCAL_SESSION_KEY : SESSION_KEY

  window.localStorage.removeItem(LOCAL_SESSION_KEY)
  window.sessionStorage.removeItem(SESSION_KEY)
  targetStorage.setItem(targetKey, session)
  return toPublicUser(user)
}

export function getCurrentUser() {
  const stored = window.localStorage.getItem(LOCAL_SESSION_KEY)
    || window.sessionStorage.getItem(SESSION_KEY)
  if (!stored) return null

  let user
  try {
    user = JSON.parse(stored)
  } catch {
    throw new Error('Sesi tidak dapat dibaca. Silakan masuk kembali.')
  }
  if (!user || typeof user.email !== 'string' || typeof user.name !== 'string') {
    throw new Error('Sesi tidak dapat dibaca. Silakan masuk kembali.')
  }
  return user
}

export function logoutUser() {
  window.localStorage.removeItem(LOCAL_SESSION_KEY)
  window.sessionStorage.removeItem(SESSION_KEY)
}

function toPublicUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    className: user.className,
  }
}
