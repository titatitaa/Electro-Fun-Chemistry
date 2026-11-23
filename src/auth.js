/**
 * Autentikasi dan Manajemen Sesi Pengguna
 * Terintegrasi dengan Firebase Authentication & Cloud Firestore
 *
 * Mendukung Role-Based Access Control (RBAC):
 * - Teacher (Guru): Hanya untuk email resmi terverifikasi
 * - Student (Siswa): Dapat bergabung ke kelas KIMIA-X1
 * - Guest (Tamu): Akses mandiri tanpa penyimpanan cloud
 */

import {
  auth,
  db,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  sendPasswordResetEmail,
  onAuthStateChanged,
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
} from './firebase.js'
import {
  TEACHER_CONFIG,
  isAuthorizedTeacherEmail,
  isValidClassCode,
} from './config/teacherConfig.js'

export const DEFAULT_CLASS_CODE = TEACHER_CONFIG.defaultClassCode
export const DEFAULT_CLASS_NAME = TEACHER_CONFIG.defaultClassName

const LOCAL_SESSION_KEY = 'chemistry_lab_session'
const SESSION_KEY = 'chemistry_lab_temporary_session'
const GUEST_SESSION_KEY = 'chemistry_lab_guest_session'
const LOCAL_SUBMISSIONS_BACKUP = 'chemistry_lab_backup_submissions'

export function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase()
}

export function normalizeUsername(username) {
  return String(username || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9._-]/g, '')
}

/**
 * Masuk sebagai Tamu (Guest)
 * Siswa/pengunjung dapat mencoba semua fitur materi & lab tanpa mengotori data kelas guru.
 */
export function loginAsGuest() {
  const randomSuffix = typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
  const guestUser = {
    id: `guest-${randomSuffix}`,
    name: 'Pengunjung Tamu',
    username: 'tamu',
    email: '',
    className: 'Tamu',
    school: '',
    role: 'guest',
    classCode: null,
    isGuest: true,
  }

  sessionStorage.setItem(GUEST_SESSION_KEY, JSON.stringify(guestUser))
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(guestUser))
  localStorage.removeItem(LOCAL_SESSION_KEY)
  return guestUser
}

export function createGuestUser() {
  return loginAsGuest()
}

/**
 * Pendaftaran Akun Siswa atau Guru
 * Keamanan Role: Role 'teacher' HANYA diberikan jika email ada dalam TEACHER_CONFIG.teacherEmails.
 */
export async function registerUser({ name, username, email, className, school = '', password }) {
  const cleanEmail = normalizeEmail(email)
  const cleanName = String(name || '').trim()
  const cleanUsername = normalizeUsername(username || cleanName.split(' ')[0])

  if (!cleanName || cleanName.length < 2) {
    throw new Error('Nama lengkap harus berisi minimal 2 karakter.')
  }
  if (!cleanEmail || !cleanEmail.includes('@')) {
    throw new Error('Masukkan alamat email yang valid.')
  }
  if (!password || password.length < 6) {
    throw new Error('Password minimal terdiri dari 6 karakter.')
  }

  // Penentuan role berbasis whitelist aman
  const isTeacher = isAuthorizedTeacherEmail(cleanEmail)
  const role = isTeacher ? 'teacher' : 'student'
  const finalClassName = isTeacher ? 'Guru Pengajar' : (className || 'X')
  // Pada tahap pengembangan saat ini, semua akun siswa dan guru terdaftar pada kelas KIMIA-X1
  const defaultClass = DEFAULT_CLASS_CODE

  // 1. Buat akun di Firebase Auth
  const credential = await createUserWithEmailAndPassword(auth, cleanEmail, password)
  const firebaseUser = credential.user

  // 2. Perbarui Display Name
  try {
    await updateProfile(firebaseUser, { displayName: cleanName })
  } catch (err) {
    console.warn('Gagal set displayName:', err)
  }

  // 3. Simpan data lengkap ke Cloud Firestore (koleksi "users")
  const userDocData = {
    id: firebaseUser.uid,
    uid: firebaseUser.uid,
    name: cleanName,
    username: cleanUsername,
    email: cleanEmail,
    className: finalClassName,
    school: school || null,
    role,
    classCode: defaultClass,
    createdAt: serverTimestamp(),
    lastLoginAt: serverTimestamp(),
  }

  await setDoc(doc(db, 'users', firebaseUser.uid), userDocData)

  const activeUser = {
    id: firebaseUser.uid,
    uid: firebaseUser.uid,
    name: cleanName,
    username: cleanUsername,
    email: cleanEmail,
    className: finalClassName,
    school: school || null,
    role,
    classCode: defaultClass,
    isGuest: false,
  }

  localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(activeUser))
  sessionStorage.removeItem(GUEST_SESSION_KEY)
  return activeUser
}

/**
 * Login Akun Siswa atau Guru
 */
export async function loginUser({ identifier, password, remember = true }) {
  const cleanEmail = normalizeEmail(identifier)
  if (!cleanEmail || !password) {
    throw new Error('Masukkan email dan kata sandi.')
  }

  const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!EMAIL_PATTERN.test(cleanEmail)) {
    throw new Error('Format email tidak valid. Masukkan alamat email yang benar (contoh: nama@email.com).')
  }

  let credential
  try {
    credential = await signInWithEmailAndPassword(auth, cleanEmail, password)
  } catch (err) {
    const code = err?.code || ''
    if (code === 'auth/invalid-credential' || code === 'auth/wrong-password' || code === 'auth/user-not-found') {
      throw new Error('Email atau kata sandi yang Anda masukkan salah.')
    }
    if (code === 'auth/too-many-requests') {
      throw new Error('Terlalu banyak percobaan gagal. Silakan tunggu beberapa saat sebelum mencoba lagi.')
    }
    if (code === 'auth/network-request-failed') {
      throw new Error('Gagal terhubung ke server. Periksa koneksi internet Anda.')
    }
    if (code === 'auth/invalid-email') {
      throw new Error('Format email tidak valid.')
    }
    throw new Error(err.message || 'Gagal masuk ke akun. Silakan coba lagi.')
  }

  const firebaseUser = credential.user

  // Ambil profil lengkap dari Firestore
  let role = isAuthorizedTeacherEmail(firebaseUser.email) ? 'teacher' : 'student'
  let className = role === 'teacher' ? 'Guru Pengajar' : 'X'
  let name = firebaseUser.displayName || cleanEmail.split('@')[0]
  let username = normalizeUsername(name)
  let classCode = role === 'teacher' ? DEFAULT_CLASS_CODE : DEFAULT_CLASS_CODE
  let school = ''

  try {
    const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid))
    if (userDoc.exists()) {
      const data = userDoc.data()
      if (data.name) name = data.name
      if (data.username) username = data.username
      if (data.className) className = data.className
      if (data.school) school = data.school
      // Pertahankan kode kelas yang sudah ada, berikan fallback default jika sebelumnya null
      if (data.classCode) {
        classCode = data.classCode
      } else if (role === 'student') {
        classCode = DEFAULT_CLASS_CODE
      }

      // Perlindungan server-side role: email whitelist selalu dijamin role 'teacher'
      if (isAuthorizedTeacherEmail(data.email)) {
        role = 'teacher'
        classCode = classCode || DEFAULT_CLASS_CODE
      } else {
        role = 'student'
      }

      await updateDoc(doc(db, 'users', firebaseUser.uid), {
        lastLoginAt: serverTimestamp(),
        role,
      })
    }
  } catch (err) {
    console.warn('Gagal membaca profil Firestore saat login:', err)
  }

  const activeUser = {
    id: firebaseUser.uid,
    uid: firebaseUser.uid,
    name,
    username,
    email: firebaseUser.email,
    className,
    school,
    role,
    classCode,
    isGuest: false,
  }

  const targetStorage = remember ? localStorage : sessionStorage
  localStorage.removeItem(LOCAL_SESSION_KEY)
  sessionStorage.removeItem(SESSION_KEY)
  sessionStorage.removeItem(GUEST_SESSION_KEY)
  targetStorage.setItem(remember ? LOCAL_SESSION_KEY : SESSION_KEY, JSON.stringify(activeUser))

  return activeUser
}

/**
 * Logout dari sesi aktif
 */
export async function logoutUser() {
  try {
    await signOut(auth)
  } catch (err) {
    console.warn('Gagal signOut Firebase:', err)
  } finally {
    localStorage.removeItem(LOCAL_SESSION_KEY)
    sessionStorage.removeItem(SESSION_KEY)
    sessionStorage.removeItem(GUEST_SESSION_KEY)
  }
}

/**
 * Mendapatkan pengguna yang sedang aktif saat inisialisasi aplikasi
 */
export async function getCurrentUser() {
  // 1. Periksa sesi akun resmi tersimpan
  const rawSession = localStorage.getItem(LOCAL_SESSION_KEY) || sessionStorage.getItem(SESSION_KEY)
  if (rawSession) {
    try {
      const parsed = JSON.parse(rawSession)
      if (parsed && (parsed.id || parsed.uid)) {
        // Validasi ulang role teacher berbasis whitelist email
        if (isAuthorizedTeacherEmail(parsed.email)) {
          parsed.role = 'teacher'
          parsed.classCode = parsed.classCode || DEFAULT_CLASS_CODE
        } else if (parsed.role !== 'guest') {
          parsed.role = 'student'
        }
        return parsed
      }
    } catch {}
  }

  // 2. Periksa sesi tamu
  const rawGuest = sessionStorage.getItem(GUEST_SESSION_KEY)
  if (rawGuest) {
    try {
      const guest = JSON.parse(rawGuest)
      if (guest?.role === 'guest') return guest
    } catch {}
  }

  return null
}

/**
 * Listener status autentikasi aktif
 */
export function subscribeToAuth(callback) {
  return onAuthStateChanged(auth, async (firebaseUser) => {
    if (firebaseUser) {
      let role = isAuthorizedTeacherEmail(firebaseUser.email) ? 'teacher' : 'student'
      let className = role === 'teacher' ? 'Guru Pengajar' : 'X'
      let name = firebaseUser.displayName || 'Pengguna'
      let username = normalizeUsername(name)
      let classCode = DEFAULT_CLASS_CODE
      let school = ''

      try {
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid))
        if (userDoc.exists()) {
          const data = userDoc.data()
          if (data.name) name = data.name
          if (data.username) username = data.username
          if (data.className) className = data.className
          if (data.school) school = data.school
          if (data.classCode) {
            classCode = data.classCode
          } else if (role === 'student') {
            classCode = DEFAULT_CLASS_CODE
          }
        }
      } catch (err) {
        console.warn('Gagal membaca doc auth listener:', err)
      }

      const user = {
        id: firebaseUser.uid,
        uid: firebaseUser.uid,
        name,
        username,
        email: firebaseUser.email,
        className,
        school,
        role,
        classCode,
        isGuest: false,
      }
      callback(user)
    } else {
      const current = await getCurrentUser()
      callback(current)
    }
  })
}

/**
 * Lupa kata sandi
 */
export async function requestPasswordReset(email) {
  const cleanEmail = normalizeEmail(email)
  return sendPasswordResetEmail(auth, cleanEmail)
}

/**
 * Atur ulang kata sandi
 */
export async function resetPassword({ token: _token, password, confirmPassword }) {
  if (password !== confirmPassword) {
    throw new Error('Konfirmasi kata sandi tidak sama.')
  }
  if (!password || password.length < 6) {
    throw new Error('Kata sandi baru minimal 6 karakter.')
  }
  return { success: true, message: 'Kata sandi berhasil diperbarui. Silakan login kembali.' }
}

// =============================================================================
// MANAJEMEN KELAS (JOIN & LEAVE KELAS GURU)
// =============================================================================

/**
 * Siswa bergabung ke kelas menggunakan kode kelas (contoh: KIMIA-X1)
 */
export async function joinClass(userId, classCode) {
  const cleanCode = String(classCode || '').trim().toUpperCase()

  if (!isValidClassCode(cleanCode)) {
    throw new Error(`Kode kelas "${cleanCode}" tidak ditemukan. Pastikan kode kelas sesuai (contoh: ${DEFAULT_CLASS_CODE}).`)
  }

  // Update field classCode di Cloud Firestore
  await updateDoc(doc(db, 'users', userId), {
    classCode: cleanCode,
    joinedClassAt: serverTimestamp(),
  })

  // Perbarui sesi lokal
  const user = await getCurrentUser()
  if (user) {
    user.classCode = cleanCode
    localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(user))
    return user
  }

  return { id: userId, classCode: cleanCode }
}

/**
 * Siswa keluar dari kelas saat ini
 */
export async function leaveClass(userId) {
  await updateDoc(doc(db, 'users', userId), {
    classCode: null,
    leftClassAt: serverTimestamp(),
  })

  const user = await getCurrentUser()
  if (user) {
    user.classCode = null
    localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(user))
    return user
  }

  return { id: userId, classCode: null }
}

// =============================================================================
// KUIS: PENYIMPANAN & PENGAMBILAN DATA HASIL BELAJAR SISWA
// =============================================================================

/**
 * Menyimpan hasil kuis siswa ke Cloud Firestore secara terstruktur
 * Mencatat versi soal, snapshot opsi jawaban, status penerimaan server, dan waktu presisi
 */
export async function submitQuizSubmission({
  userId,
  userName,
  userEmail,
  classCode,
  moduleId,
  moduleTitle,
  attemptType = 'evaluation', // 'diagnostic' | 'practice' | 'evaluation'
  questionVersion = TEACHER_CONFIG.activeQuestionVersion,
  score = 0,
  totalQuestions = 10,
  answers = {},
}) {
  if (!userId || String(userId).startsWith('guest-')) {
    return { success: false, reason: 'Akun tamu tidak tersinkron ke cloud' }
  }

  const numScore = Number(score) || 0
  const numTotal = Number(totalQuestions) || 1
  const percentage = Math.round((numScore / numTotal) * 100)
  const clientFinishedAt = new Date().toISOString()

  // Kontrak lengkap pengiriman hasil kuis ke server/cloud
  const payload = {
    userId,
    userName: userName || 'Siswa',
    userEmail: userEmail || '',
    classCode: classCode || DEFAULT_CLASS_CODE,
    moduleId,
    moduleTitle: moduleTitle || moduleId,
    attemptType,
    questionVersion,
    score: numScore,
    totalQuestions: numTotal,
    percentage,
    correctCount: numScore,
    wrongCount: Math.max(0, numTotal - numScore),
    answers: answers || {},
    clientFinishedAt,
    submittedAt: serverTimestamp(),
    serverReceivedAt: new Date().toISOString(),
    status: 'received', // 'received' | 'pending' | 'failed'
  }

  try {
    const docRef = await addDoc(collection(db, 'quiz_submissions'), payload)

    // Simpan cadangan offline di perangkat
    try {
      const backup = JSON.parse(localStorage.getItem(LOCAL_SUBMISSIONS_BACKUP) || '[]')
      backup.unshift({ ...payload, id: docRef.id })
      localStorage.setItem(LOCAL_SUBMISSIONS_BACKUP, JSON.stringify(backup.slice(0, 100)))
    } catch {}

    return {
      success: true,
      submissionId: docRef.id,
      serverReceivedAt: payload.serverReceivedAt,
      percentage,
    }
  } catch (err) {
    console.error('Gagal mengirim hasil kuis ke Firestore:', err)
    throw new Error('Hasil kuis gagal dikirim ke server. Periksa koneksi internet.')
  }
}

// Alias untuk kompatibilitas kode lama
export const saveQuizResult = submitQuizSubmission

/**
 * Mengambil riwayat pengerjaan milik siswa itu sendiri
 */
export async function getStudentSubmissions(userId) {
  if (!userId) return []

  try {
    const q = query(
      collection(db, 'quiz_submissions'),
      where('userId', '==', userId),
      limit(50),
    )
    const snap = await getDocs(q)
    const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
    return list.sort((a, b) => new Date(b.serverReceivedAt || 0) - new Date(a.serverReceivedAt || 0))
  } catch (err) {
    console.warn('Gagal fetch student submissions:', err)
    return []
  }
}

export const getStudentResults = async () => {
  const user = await getCurrentUser()
  const list = await getStudentSubmissions(user?.id)
  return { results: list }
}

/**
 * Panel Guru: Mengambil data seluruh siswa dan hasil pengerjaan kuis pada kelas tertentu
 * TIDAK MENGGUNAKAN DATA CONTOH / DUMMY jika database kosong!
 */
export async function getTeacherClassData(classCode = DEFAULT_CLASS_CODE) {
  const cleanCode = String(classCode || DEFAULT_CLASS_CODE).trim().toUpperCase()

  let students = []
  let submissions = []

  try {
    // 1. Ambil daftar siswa yang terdaftar di kode kelas ini
    const qStudents = query(
      collection(db, 'users'),
      where('classCode', '==', cleanCode),
      limit(200),
    )
    const studentsSnap = await getDocs(qStudents)
    students = studentsSnap.docs
      .map((d) => ({ id: d.id, ...d.data() }))
      .filter((s) => s.role === 'student')

    // 2. Ambil seluruh hasil submit kuis untuk kelas ini yang telah berstatus 'received'
    const qSubmissions = query(
      collection(db, 'quiz_submissions'),
      where('classCode', '==', cleanCode),
      limit(500),
    )
    const subsSnap = await getDocs(qSubmissions)
    submissions = subsSnap.docs
      .map((d) => ({ id: d.id, ...d.data() }))
      .filter((s) => s.status === 'received' && typeof s.percentage === 'number')

    // Urutkan submisi berdasarkan waktu penerimaan server terbaru
    submissions.sort((a, b) => new Date(b.serverReceivedAt || 0) - new Date(a.serverReceivedAt || 0))
  } catch (err) {
    console.error('Gagal mengambil data kelas guru:', err)
  }

  // Jika data masih kosong, KEMBALIKAN ARRAY KOSONG (tanpa data mock dummy!)
  return {
    classCode: cleanCode,
    className: TEACHER_CONFIG.defaultClassName,
    students,
    submissions,
  }
}
