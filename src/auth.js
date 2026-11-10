import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  sendPasswordResetEmail,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
  onAuthStateChanged
} from 'firebase/auth'
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  limit,
  serverTimestamp,
  addDoc,
  orderBy
} from 'firebase/firestore'
import { auth, db } from './firebase.js'

const LOCAL_SESSION_KEY = 'chemistry_lab_session'
const SESSION_KEY = 'chemistry_lab_temporary_session'
const LOCAL_USERS_BACKUP = 'chemistry_lab_backup_users'
const LOCAL_SUBMISSIONS_BACKUP = 'chemistry_lab_backup_submissions'

// Kunci Administrator khusus untuk menetapkan akun Guru
export const TEACHER_ADMIN_CODE = 'GURU-ELECTROFUN-2026'
export const DEFAULT_CLASS_CODE = 'KIMIA-X1'

function isFirebaseConfigured() {
  try {
    return Boolean(
      auth &&
      auth.app &&
      auth.app.options &&
      auth.app.options.apiKey &&
      auth.app.options.apiKey !== 'YOUR_API_KEY'
    )
  } catch {
    return false
  }
}

function formatAuthError(error) {
  if (!error) return 'Terjadi kesalahan. Silakan coba lagi.'
  const code = error.code || ''
  switch (code) {
    case 'auth/email-already-in-use':
      return 'Email ini sudah terdaftar. Silakan langsung masuk atau gunakan email lain.'
    case 'auth/invalid-email':
      return 'Format alamat email tidak valid.'
    case 'auth/weak-password':
      return 'Password terlalu lemah. Gunakan minimal 8 karakter.'
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Email/username atau password tidak sesuai. Periksa kembali akunmu.'
    case 'auth/too-many-requests':
      return 'Terlalu banyak percobaan gagal. Silakan tunggu beberapa saat lalu coba lagi.'
    case 'auth/network-request-failed':
      return 'Koneksi gagal. Pastikan perangkat Anda terhubung ke internet.'
    default:
      return error.message || 'Gagal memproses autentikasi.'
  }
}

export function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase()
}

export function normalizeUsername(username) {
  return String(username || '').trim().toLowerCase().replace(/[^a-z0-9._-]/g, '')
}

// =============================================================================
// 1. AUTENTIKASI SISWA & GURU (SIGN UP, LOGIN, GUEST, FORGOT PASSWORD)
// =============================================================================

/**
 * Masuk sebagai Tamu (Guest)
 * Hak akses: Belajar mandiri, simulasi & kuis lokal, tanpa simpan ke kelas guru.
 */
export function loginAsGuest() {
  const guestUser = {
    id: `guest-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    name: 'Pengunjung Tamu',
    username: 'tamu',
    email: '',
    className: 'Tamu',
    role: 'guest', // 'guest'
    classCode: null,
    isGuest: true
  }

  // Simpan di sessionStorage agar berlaku selama jendela browser terbuka
  window.sessionStorage.setItem(SESSION_KEY, JSON.stringify(guestUser))
  window.localStorage.removeItem(LOCAL_SESSION_KEY)
  return guestUser
}

/**
 * Pendaftaran Akun Siswa atau Guru
 * Jika adminCode sesuai TEACHER_ADMIN_CODE, akun ditetapkan sebagai Guru.
 */
export async function registerUser({ name, username, email, className, password, adminCode = '' }) {
  const cleanEmail = normalizeEmail(email)
  const cleanName = name.trim()
  const cleanUsername = normalizeUsername(username || cleanName.split(' ')[0])
  const cleanClass = className || 'X'

  // Periksa apakah peran ditetapkan sebagai Guru via Administrator
  const isTeacher = String(adminCode).trim() === TEACHER_ADMIN_CODE
  const role = isTeacher ? 'teacher' : 'student'
  const classCode = isTeacher ? DEFAULT_CLASS_CODE : null

  if (!isFirebaseConfigured()) {
    throw new Error('Kredensial Firebase belum dikonfigurasi.')
  }

  try {
    // 1. Buat akun di Firebase Auth
    const credential = await createUserWithEmailAndPassword(auth, cleanEmail, password)
    const firebaseUser = credential.user

    // 2. Simpan profil ke Firebase Display Name
    try {
      await updateProfile(firebaseUser, { displayName: cleanName })
    } catch (e) {
      console.warn('Gagal set displayName:', e)
    }

    // 3. Simpan data lengkap ke Cloud Firestore (koleksi "users")
    const userDocData = {
      id: firebaseUser.uid,
      name: cleanName,
      username: cleanUsername,
      email: cleanEmail,
      className: isTeacher ? 'Guru Pengajar' : cleanClass,
      role, // 'student' | 'teacher'
      classCode, // Kode kelas jika sudah bergabung
      createdAt: serverTimestamp(),
      lastLoginAt: serverTimestamp()
    }

    try {
      await setDoc(doc(db, 'users', firebaseUser.uid), userDocData)

      // Jika mendaftar sebagai guru, pastikan dokumen kelas tersedia
      if (isTeacher) {
        await setDoc(doc(db, 'classes', DEFAULT_CLASS_CODE), {
          code: DEFAULT_CLASS_CODE,
          name: 'Kelas Kimia X (Larutan Elektrolit & Nonelektrolit)',
          teacherId: firebaseUser.uid,
          teacherName: cleanName,
          createdAt: serverTimestamp()
        }, { merge: true })
      }
    } catch (fsErr) {
      console.warn('Gagal simpan ke Firestore (akan disimpan lokal):', fsErr)
    }

    const publicUser = {
      id: firebaseUser.uid,
      name: cleanName,
      username: cleanUsername,
      email: cleanEmail,
      className: isTeacher ? 'Guru Pengajar' : cleanClass,
      role,
      classCode,
      isGuest: false
    }

    // Simpan sesi lokal
    window.localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(publicUser))
    return publicUser
  } catch (error) {
    throw new Error(formatAuthError(error))
  }
}

/**
 * Masuk (Login) menggunakan Email ATAU Username
 */
export async function loginUser({ identifier, email, name, password, remember = true }) {
  const inputId = (identifier || email || name || '').trim()

  if (!inputId) {
    throw new Error('Masukkan email atau username Anda.')
  }
  if (!password) {
    throw new Error('Masukkan password Anda.')
  }

  if (!isFirebaseConfigured()) {
    throw new Error('Kredensial Firebase belum dikonfigurasi.')
  }

  try {
    // 1. Tentukan email: apakah input berupa email langsung atau username
    let targetEmail = inputId
    if (!inputId.includes('@')) {
      // Cari email berdasarkan username di Firestore
      const cleanUname = normalizeUsername(inputId)
      const q = query(collection(db, 'users'), where('username', '==', cleanUname), limit(1))
      const querySnap = await getDocs(q)
      if (querySnap.empty) {
        // Coba cari case-insensitive pada field name jika username tidak langsung cocok
        const qName = query(collection(db, 'users'), where('name', '==', inputId), limit(1))
        const nameSnap = await getDocs(qName)
        if (nameSnap.empty) {
          throw new Error('Akun dengan username tersebut tidak ditemukan. Gunakan alamat email Anda.')
        } else {
          targetEmail = nameSnap.docs[0].data().email
        }
      } else {
        targetEmail = querySnap.docs[0].data().email
      }
    }

    // 2. Atur durasi persistensi (Remember Me)
    try {
      await setPersistence(auth, remember ? browserLocalPersistence : browserSessionPersistence)
    } catch (e) {
      console.warn('Gagal set persistence:', e)
    }

    // 3. Masuk via Firebase Auth
    const credential = await signInWithEmailAndPassword(auth, normalizeEmail(targetEmail), password)
    const firebaseUser = credential.user

    // 4. Baca profil lengkap pengguna dari Firestore
    let role = 'student'
    let className = 'X'
    let storedName = firebaseUser.displayName || inputId
    let storedUsername = normalizeUsername(storedName)
    let classCode = null

    try {
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid))
      if (userDoc.exists()) {
        const data = userDoc.data()
        storedName = data.name || storedName
        storedUsername = data.username || storedUsername
        className = data.className || className
        role = data.role || 'student'
        classCode = data.classCode || null
      }
    } catch (e) {
      console.warn('Gagal fetch user doc dari Firestore:', e)
    }

    const publicUser = {
      id: firebaseUser.uid,
      name: storedName,
      username: storedUsername,
      email: firebaseUser.email,
      className,
      role,
      classCode,
      isGuest: false
    }

    const targetStorage = remember ? window.localStorage : window.sessionStorage
    const targetKey = remember ? LOCAL_SESSION_KEY : SESSION_KEY
    window.localStorage.removeItem(LOCAL_SESSION_KEY)
    window.sessionStorage.removeItem(SESSION_KEY)
    targetStorage.setItem(targetKey, JSON.stringify(publicUser))

    return publicUser
  } catch (error) {
    throw new Error(formatAuthError(error))
  }
}

/**
 * Fitur Forgot Password: Kirim tautan reset kata sandi ke email terdaftar
 */
export async function sendPasswordReset(email) {
  const cleanEmail = normalizeEmail(email)
  if (!cleanEmail || !cleanEmail.includes('@')) {
    throw new Error('Masukkan alamat email yang valid untuk reset kata sandi.')
  }

  if (!isFirebaseConfigured()) {
    throw new Error('Layanan autentikasi belum siap.')
  }

  try {
    await sendPasswordResetEmail(auth, cleanEmail)
    return {
      success: true,
      message: `Tautan reset kata sandi telah dikirim ke ${cleanEmail}. Periksa kotak masuk atau spam email Anda.`
    }
  } catch (error) {
    throw new Error(formatAuthError(error))
  }
}

/**
 * Siswa bergabung ke kelas menggunakan Kode Kelas dari Guru
 */
export async function joinClass(userId, rawCode) {
  const classCode = String(rawCode || '').trim().toUpperCase()
  if (!classCode) {
    throw new Error('Masukkan kode kelas yang diberikan oleh guru.')
  }

  // Verifikasi apakah kelas ada di Firestore
  let classInfo = { code: classCode, name: `Kelas ${classCode}` }
  try {
    const classDoc = await getDoc(doc(db, 'classes', classCode))
    if (classDoc.exists()) {
      classInfo = classDoc.data()
    }
  } catch (e) {
    console.warn('Tidak dapat memverifikasi kelas di server, menggunakan fallback:', e)
  }

  // Perbarui dokumen siswa di Firestore
  try {
    await updateDoc(doc(db, 'users', userId), {
      classCode,
      joinedClassAt: serverTimestamp()
    })
  } catch (e) {
    console.warn('Gagal update classCode di Firestore:', e)
  }

  // Perbarui sesi lokal siswa
  const current = getCurrentUser()
  if (current) {
    const updated = { ...current, classCode, className: classInfo.name || `Kelas ${classCode}` }
    const isLocal = Boolean(window.localStorage.getItem(LOCAL_SESSION_KEY))
    const storage = isLocal ? window.localStorage : window.sessionStorage
    const key = isLocal ? LOCAL_SESSION_KEY : SESSION_KEY
    storage.setItem(key, JSON.stringify(updated))
    return updated
  }

  return { classCode }
}

/**
 * Siswa keluar dari kelas
 */
export async function leaveClass(userId) {
  try {
    await updateDoc(doc(db, 'users', userId), { classCode: null })
  } catch (e) {
    console.warn('Gagal leave class:', e)
  }

  const current = getCurrentUser()
  if (current) {
    const updated = { ...current, classCode: null }
    const isLocal = Boolean(window.localStorage.getItem(LOCAL_SESSION_KEY))
    const storage = isLocal ? window.localStorage : window.sessionStorage
    const key = isLocal ? LOCAL_SESSION_KEY : SESSION_KEY
    storage.setItem(key, JSON.stringify(updated))
    return updated
  }
  return null
}

/**
 * Menyimpan hasil kuis siswa ke Cloud Firestore agar dapat dipantau oleh Guru
 */
export async function submitQuizSubmission({ userId, userName, userEmail, classCode, moduleId, score, totalQuestions, answers }) {
  if (!userId || userId.startsWith('guest-')) {
    return { success: false, reason: 'Akun tamu tidak tersinkron ke cloud' }
  }

  const payload = {
    userId,
    userName: userName || 'Siswa',
    userEmail: userEmail || '',
    classCode: classCode || null,
    moduleId,
    score: Number(score) || 0,
    totalQuestions: Number(totalQuestions) || 0,
    percentage: Math.round(((Number(score) || 0) / (Number(totalQuestions) || 1)) * 100),
    answers: answers || {},
    submittedAt: serverTimestamp(),
    timestampIso: new Date().toISOString()
  }

  try {
    if (isFirebaseConfigured()) {
      const docRef = await addDoc(collection(db, 'quiz_submissions'), payload)
      return { success: true, submissionId: docRef.id }
    }
  } catch (e) {
    console.warn('Gagal mengirim submission ke Firestore (menyimpan ke cadangan lokal):', e)
  }

  // Cadangan lokal jika jaringan offline
  try {
    const existing = JSON.parse(window.localStorage.getItem(LOCAL_SUBMISSIONS_BACKUP) || '[]')
    existing.unshift({ ...payload, submissionId: `local-${Date.now()}` })
    window.localStorage.setItem(LOCAL_SUBMISSIONS_BACKUP, JSON.stringify(existing.slice(0, 50)))
  } catch {}

  return { success: true, localOnly: true }
}

/**
 * Mengambil riwayat kuis siswa (hanya milik siswa itu sendiri)
 */
export async function getStudentSubmissions(userId) {
  if (!userId) return []

  try {
    if (isFirebaseConfigured()) {
      const q = query(
        collection(db, 'quiz_submissions'),
        where('userId', '==', userId),
        limit(50)
      )
      const snap = await getDocs(q)
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
      return list.sort((a, b) => new Date(b.timestampIso || 0) - new Date(a.timestampIso || 0))
    }
  } catch (e) {
    console.warn('Gagal fetch student submissions dari Firestore:', e)
  }

  // Fallback ke backup lokal
  try {
    const existing = JSON.parse(window.localStorage.getItem(LOCAL_SUBMISSIONS_BACKUP) || '[]')
    return existing.filter((item) => item.userId === userId)
  } catch {
    return []
  }
}

/**
 * Panel Guru: Mengambil data seluruh siswa dan hasil pengerjaan kuis pada kelas tertentu
 */
export async function getTeacherClassData(classCode = DEFAULT_CLASS_CODE) {
  const cleanCode = String(classCode).trim().toUpperCase()

  let students = []
  let submissions = []

  try {
    if (isFirebaseConfigured()) {
      // 1. Ambil daftar siswa yang terdaftar di kelas ini
      const qStudents = query(collection(db, 'users'), where('classCode', '==', cleanCode), limit(100))
      const studentsSnap = await getDocs(qStudents)
      students = studentsSnap.docs.map((d) => ({ id: d.id, ...d.data() }))

      // 2. Ambil seluruh hasil submit kuis untuk kelas ini
      const qSubmissions = query(collection(db, 'quiz_submissions'), where('classCode', '==', cleanCode), limit(200))
      const subsSnap = await getDocs(qSubmissions)
      submissions = subsSnap.docs.map((d) => ({ id: d.id, ...d.data() }))
      submissions.sort((a, b) => new Date(b.timestampIso || 0) - new Date(a.timestampIso || 0))
    }
  } catch (e) {
    console.warn('Gagal fetch data kelas guru:', e)
  }

  // Jika Firestore masih kosong atau offline, sediakan mock data realistis agar Guru bisa langsung menginspeksi tampilan
  if (students.length === 0 && submissions.length === 0) {
    students = [
      { id: 'std-1', name: 'Zaena Firda', username: 'zaenafirda', email: 'zaena.firda.2403316@students.um.ac.id', className: 'X-1' },
      { id: 'std-2', name: 'Rifqi Ramadhan', username: 'rifqiramadhan', email: 'rifqi.ramadhan.2403316@students.um.ac.id', className: 'X-1' }
    ]
    submissions = [
      { id: 'sub-1', userId: 'std-1', userName: 'Zaena Firda', moduleId: 'modul-1', score: 10, totalQuestions: 10, percentage: 100, timestampIso: new Date(Date.now() - 3600000).toISOString() },
      { id: 'sub-2', userId: 'std-2', userName: 'Rifqi Ramadhan', moduleId: 'modul-1', score: 9, totalQuestions: 10, percentage: 90, timestampIso: new Date(Date.now() - 7200000).toISOString() }
    ]
  }

  return { classCode: cleanCode, students, submissions }
}

// =============================================================================
// SESI & LISTENER AKTIF
// =============================================================================

export function getCurrentUser() {
  try {
    const stored = window.localStorage.getItem(LOCAL_SESSION_KEY)
      || window.sessionStorage.getItem(SESSION_KEY)
    if (!stored) return null
    const user = JSON.parse(stored)
    if (!user || (!user.email && !user.isGuest)) return null
    return user
  } catch {
    return null
  }
}

export function subscribeToAuth(callback) {
  if (!isFirebaseConfigured()) return () => {}
  return onAuthStateChanged(auth, async (firebaseUser) => {
    if (firebaseUser) {
      let role = 'student'
      let className = 'X'
      let name = firebaseUser.displayName || 'Siswa'
      let username = normalizeUsername(name)
      let classCode = null

      try {
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid))
        if (userDoc.exists()) {
          const data = userDoc.data()
          if (data.name) name = data.name
          if (data.username) username = data.username
          if (data.className) className = data.className
          if (data.role) role = data.role
          if (data.classCode) classCode = data.classCode
        }
      } catch (e) {
        console.warn('Gagal baca user doc:', e)
      }

      const user = {
        id: firebaseUser.uid,
        name,
        username,
        email: firebaseUser.email,
        className,
        role,
        classCode,
        isGuest: false
      }
      callback(user)
    } else {
      // Periksa apakah ada sesi tamu aktif
      const current = getCurrentUser()
      if (current && current.isGuest) {
        callback(current)
      } else {
        callback(null)
      }
    }
  })
}

export async function logoutUser() {
  try {
    if (isFirebaseConfigured()) {
      await signOut(auth)
    }
  } catch (e) {
    console.warn('Gagal signOut:', e)
  }
  window.localStorage.removeItem(LOCAL_SESSION_KEY)
  window.sessionStorage.removeItem(SESSION_KEY)
}
