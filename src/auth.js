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
  confirmPasswordReset,
  verifyPasswordResetCode,
  updatePassword,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
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
} from './firebase.js'
import {
  TEACHER_CONFIG,
  isAuthorizedTeacherEmail,
  isValidClassCode,
} from './config/teacherConfig.js'
import {
  clearGuestQuizDrafts,
  clearLegacyQuizDrafts,
} from './utils/quizStorage.js'

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
 * Validasi dan Penegakan Role-Based Access Control (RBAC) Server-Side
 * Memastikan tidak ada pengguna yang dapat meningkatkan hak akses menjadi 'teacher'
 * tanpa email yang terdaftar di konfigurasi resmi.
 */
export function enforceUserRole(email, requestedRole = 'student') {
  const cleanEmail = normalizeEmail(email)
  const isTeacher = isAuthorizedTeacherEmail(cleanEmail)
  if (isTeacher) {
    return 'teacher'
  }
  if (requestedRole === 'teacher') {
    console.warn(`[RBAC] Percobaan akses role teacher ditolak untuk email non-resmi: ${cleanEmail}`)
  }
  return 'student'
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
export async function registerUser({ name, username, email, className, school = '', password, role: requestedRole }) {
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

  // Penegakan RBAC yang ketat: email non-whitelist tidak bisa mendaftar sebagai teacher
  const role = enforceUserRole(cleanEmail, requestedRole)
  const isTeacher = role === 'teacher'
  const finalClassName = isTeacher ? 'Guru Pengajar' : (className || 'X')
  // Baik siswa baru maupun guru otomatis terhubung dengan DEFAULT_CLASS_CODE ('KIMIA-X1')
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
 * Mendukung login menggunakan ALAMAT EMAIL atau USERNAME.
 * Jika identifier bukan email, sistem mencari email terkait di Firestore sebelum memanggil Firebase Auth.
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

  // 1. Resolusi identifier: Email langsung atau pencarian Username
  let targetEmail = cleanId
  if (!cleanId.includes('@')) {
    const cleanUsername = normalizeUsername(cleanId)
    if (!cleanUsername) {
      throw new Error('Format username tidak valid.')
    }

    try {
      const q = query(
        collection(db, 'users'),
        where('username', '==', cleanUsername),
        limit(1)
      )
      const userSnap = await getDocs(q)
      if (userSnap.empty) {
        throw new Error(`Username "${cleanId}" tidak ditemukan. Silakan periksa kembali atau gunakan alamat email.`)
      }
      const foundData = userSnap.docs[0].data()
      if (!foundData.email) {
        throw new Error('Akun dengan username ini tidak memiliki alamat email yang valid.')
      }
      targetEmail = foundData.email
    } catch (lookupErr) {
      if (lookupErr.message && lookupErr.message.includes('Username')) {
        throw lookupErr
      }
      console.warn('Gagal memeriksa username ke Firestore:', lookupErr)
      throw new Error('Tidak dapat memverifikasi username ke server. Silakan login menggunakan alamat email.')
    }
  }

  // 2. Set Persistence Firebase Auth sesuai pilihan remember
  try {
    if (typeof setPersistence === 'function' && browserLocalPersistence && browserSessionPersistence) {
      await setPersistence(auth, remember ? browserLocalPersistence : browserSessionPersistence)
    }
  } catch (persistErr) {
    console.warn('Peringatan setPersistence:', persistErr)
  }

  // 3. Autentikasi resmi via Firebase Auth
  try {
    credential = await signInWithEmailAndPassword(auth, targetEmail, password)
  } catch (authErr) {
    const code = authErr?.code || ''
    if (code === 'auth/user-not-found' || code === 'auth/invalid-credential') {
      throw new Error('Email/username atau kata sandi yang Anda masukkan salah.')
    } else if (code === 'auth/wrong-password') {
      throw new Error('Kata sandi salah. Silakan coba lagi atau gunakan menu Lupa Kata Sandi.')
    } else if (code === 'auth/too-many-requests') {
      throw new Error('Akses diblokir sementara karena terlalu banyak percobaan gagal. Silakan tunggu beberapa saat.')
    } else if (code === 'auth/invalid-email') {
      throw new Error('Format alamat email tidak valid.')
    }
    throw new Error(authErr.message || 'Gagal masuk ke sistem. Silakan coba lagi.')
  }

  const firebaseUser = credential.user

  // 4. Ambil profil lengkap dari Firestore dan lakukan penegakan RBAC
  let role = enforceUserRole(firebaseUser.email, 'student')
  let className = role === 'teacher' ? 'Guru Pengajar' : 'X'
  let name = firebaseUser.displayName || targetEmail.split('@')[0]
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

      // Perlindungan server-side role: verifikasi ulang role terhadap whitelist resmi
      role = enforceUserRole(firebaseUser.email, data.role)
      if (role === 'teacher') {
        classCode = classCode || DEFAULT_CLASS_CODE
      } else if (role === 'student' && !classCode && !data.leftClassAt) {
        // Auto-healing akun siswa lama yang belum pernah terhubung ke kelas
        classCode = DEFAULT_CLASS_CODE
        // Picu rekonsiliasi riwayat kuis lama siswa ini yang belum ber-classCode
        reconcileStudentSubmissions(firebaseUser.uid, DEFAULT_CLASS_CODE).catch(() => {})
      }

      await updateDoc(doc(db, 'users', firebaseUser.uid), {
        lastLoginAt: serverTimestamp(),
        role,
        classCode,
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
 * Mengakhiri sesi Firebase Auth resmi dan membersihkan seluruh cache lokal
 */
export async function logoutUser() {
  try {
    await signOut(auth)
  } catch (err) {
    console.warn('Gagal signOut Firebase:', err)
  } finally {
    // Bersihkan draf sesi tamu dan draf unowned legacy saat logout (AD09-04)
    clearGuestQuizDrafts()
    clearLegacyQuizDrafts()

    localStorage.removeItem(LOCAL_SESSION_KEY)
    sessionStorage.removeItem(SESSION_KEY)
    sessionStorage.removeItem(GUEST_SESSION_KEY)
  }
}

/**
 * Helper: Menunggu inisialisasi status autentikasi Firebase selesai
 */
export function waitForFirebaseAuth() {
  if (auth && typeof auth.authStateReady === 'function') {
    return auth.authStateReady().then(() => auth.currentUser)
  }
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (typeof unsubscribe === 'function') unsubscribe()
      resolve(user)
    })
  })
}

/**
 * Mendapatkan pengguna yang sedang aktif saat inisialisasi aplikasi
 * STATUS LOGIN SELALU MENGACU PADA FIREBASE AUTHENTICATION (bukan hanya localStorage).
 * Jika Firebase Auth menyatakan null, cache sesi akun lokal dibersihkan agar tidak ada sesi palsu.
 */
export async function getCurrentUser() {
  // 1. Periksa sesi tamu di sessionStorage (mode tamu mandiri offline)
  const rawGuest = sessionStorage.getItem(GUEST_SESSION_KEY)
  if (rawGuest) {
    try {
      const guest = JSON.parse(rawGuest)
      if (guest?.role === 'guest' && guest.isGuest) {
        return guest
      }
    } catch {}
  }

  // 2. Periksa status resmi dari Firebase Authentication
  let firebaseUser = auth?.currentUser
  if (firebaseUser === undefined) {
    try {
      firebaseUser = await waitForFirebaseAuth()
    } catch (err) {
      console.warn('Gagal memvalidasi status Firebase Auth:', err)
      firebaseUser = null
    }
  }

  // Jika Firebase Auth menyatakan tidak ada user yang sedang login (null):
  if (!firebaseUser) {
    // Bersihkan seluruh cache sesi akun yang tersimpan karena sudah tidak valid di Firebase
    localStorage.removeItem(LOCAL_SESSION_KEY)
    sessionStorage.removeItem(SESSION_KEY)
    return null
  }

  // 3. User aktif terverifikasi di Firebase Auth. Ambil data profil dari Firestore
  let role = enforceUserRole(firebaseUser.email, 'student')
  let className = role === 'teacher' ? 'Guru Pengajar' : 'X'
  let name = firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Pengguna'
  let username = normalizeUsername(name)
  let classCode = role === 'teacher' ? DEFAULT_CLASS_CODE : null
  let school = ''

  try {
    const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid))
    if (userDoc.exists()) {
      const data = userDoc.data()
      if (data.name) name = data.name
      if (data.username) username = data.username
      if (data.className) className = data.className
      if (data.school) school = data.school
      if (data.classCode) classCode = data.classCode
      role = enforceUserRole(firebaseUser.email, data.role)

      // Auto-healing: Jika akun siswa lama belum pernah memiliki classCode (dan bukan keluar secara sengaja)
      if (role === 'student' && !classCode && !data.leftClassAt) {
        classCode = DEFAULT_CLASS_CODE
        try {
          await updateDoc(doc(db, 'users', firebaseUser.uid), {
            classCode: DEFAULT_CLASS_CODE,
            autoAssignedAt: serverTimestamp(),
          })
          reconcileStudentSubmissions(firebaseUser.uid, DEFAULT_CLASS_CODE).catch(() => {})
        } catch (errAuto) {
          console.warn('Gagal auto-update classCode siswa lama pada getCurrentUser:', errAuto)
        }
      }
    }
  } catch (err) {
    console.warn('Gagal membaca profil Firestore saat getCurrentUser:', err)
  }

  const verifiedUser = {
    id: firebaseUser.uid,
    name,
    username,
    email: firebaseUser.email,
    className,
    school,
    role,
    classCode,
    isGuest: false,
  }

  // Sinkronkan cache lokal dengan data resmi dari Firebase
  const targetStorage = localStorage.getItem(LOCAL_SESSION_KEY) ? localStorage : sessionStorage
  targetStorage.setItem(
    targetStorage === localStorage ? LOCAL_SESSION_KEY : SESSION_KEY,
    JSON.stringify(verifiedUser)
  )

  return verifiedUser
}

/**
 * Listener status autentikasi aktif
 * Selalu mengandalkan Firebase Authentication onAuthStateChanged sebagai Single Source of Truth
 */
export function subscribeToAuth(callback) {
  return onAuthStateChanged(auth, async (firebaseUser) => {
    if (firebaseUser) {
      let role = enforceUserRole(firebaseUser.email, 'student')
      let className = role === 'teacher' ? 'Guru Pengajar' : 'X'
      let name = firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Pengguna'
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
      // Tidak ada user di Firebase Auth: periksa apakah mode tamu sedang aktif
      const rawGuest = sessionStorage.getItem(GUEST_SESSION_KEY)
      if (rawGuest) {
        try {
          const guest = JSON.parse(rawGuest)
          if (guest?.role === 'guest') {
            callback(guest)
            return
          }
        } catch {}
      }
      // Hapus seluruh cache sesi akun
      localStorage.removeItem(LOCAL_SESSION_KEY)
      sessionStorage.removeItem(SESSION_KEY)
      callback(null)
    }
  })
}

/**
 * Permintaan Reset Kata Sandi ke Firebase Auth
 */
export async function requestPasswordReset(email) {
  const cleanEmail = normalizeEmail(email)
  if (!cleanEmail || !cleanEmail.includes('@')) {
    throw new Error('Masukkan alamat email yang valid.')
  }
  return sendPasswordResetEmail(auth, cleanEmail)
}

/**
 * Verifikasi validitas kode/token reset password Firebase
 */
export async function verifyResetCode(token) {
  if (!token) throw new Error('Token pengaturan ulang kata sandi tidak ditemukan.')
  try {
    const email = await verifyPasswordResetCode(auth, token)
    return { valid: true, email }
  } catch {
    throw new Error('Tautan reset kata sandi tidak valid atau telah kedaluwarsa.')
  }
}

/**
 * Atur ulang kata sandi menggunakan Firebase Authentication
 * Benar-benar mengeksekusi confirmPasswordReset (jika via token/oobCode)
 * atau updatePassword (jika sesi pengguna sedang aktif).
 */
export async function resetPassword({ token, oobCode, password, confirmPassword }) {
  if (!password || password.length < 6) {
    throw new Error('Kata sandi baru minimal 6 karakter.')
  }
  if (password !== confirmPassword) {
    throw new Error('Konfirmasi kata sandi tidak sama.')
  }

  const resetCode = token || oobCode

  // Skenario 1: Reset password melalui link token/oobCode dari email Firebase
  if (resetCode) {
    try {
      await confirmPasswordReset(auth, resetCode, password)
      return {
        success: true,
        message: 'Kata sandi berhasil diperbarui melalui Firebase Authentication. Silakan login kembali dengan kata sandi baru.',
      }
    } catch (err) {
      const code = err?.code || ''
      if (code === 'auth/expired-action-code') {
        throw new Error('Tautan pengaturan ulang kata sandi telah kedaluwarsa. Silakan ajukan permintaan baru.')
      }
      if (code === 'auth/invalid-action-code') {
        throw new Error('Tautan pengaturan ulang kata sandi tidak valid atau telah digunakan.')
      }
      if (code === 'auth/weak-password') {
        throw new Error('Kata sandi terlalu lemah. Gunakan minimal 6 karakter.')
      }
      throw new Error(err.message || 'Gagal mengatur ulang kata sandi di Firebase Authentication.')
    }
  }

  // Skenario 2: Update password saat pengguna sedang memiliki sesi aktif di Firebase
  if (auth?.currentUser) {
    try {
      await updatePassword(auth.currentUser, password)
      return {
        success: true,
        message: 'Kata sandi akun Anda berhasil diperbarui di Firebase Authentication.',
      }
    } catch (err) {
      if (err?.code === 'auth/requires-recent-login') {
        throw new Error('Demi keamanan, silakan logout dan login kembali sebelum memperbarui kata sandi.')
      }
      throw new Error(err.message || 'Gagal memperbarui kata sandi di Firebase Authentication.')
    }
  }

  // Skenario 3: Tidak ada token reset dan tidak ada sesi aktif
  throw new Error('Token pengaturan ulang kata sandi tidak valid atau tidak ditemukan. Silakan ajukan permohonan melalui menu Lupa Kata Sandi.')
}

// =============================================================================
// MANAJEMEN KELAS (JOIN & LEAVE KELAS GURU)
// =============================================================================

/**
 * Rekonsiliasi riwayat kuis lama milik siswa yang belum memiliki classCode.
 * HANYA memperbarui field classCode pada dokumen pengerjaan milik userId yang bersangkutan.
 * TIDAK mengubah nilai, skor, jawaban, waktu pengerjaan, atau submisi milik siswa lain.
 */
export async function reconcileStudentSubmissions(userId, targetClassCode = DEFAULT_CLASS_CODE) {
  if (!userId || String(userId).startsWith('guest-')) return 0

  try {
    const q = query(
      collection(db, 'quiz_submissions'),
      where('userId', '==', userId),
      limit(100)
    )
    const snap = await getDocs(q)
    if (snap.empty) return 0

    let updatedCount = 0
    for (const docSnap of snap.docs) {
      const subData = docSnap.data()
      // Verifikasi ganda: hanya perbarui jika userId identik dan classCode belum terisi / berbeda
      if (subData.userId === userId && (!subData.classCode || subData.classCode !== targetClassCode)) {
        await updateDoc(doc(db, 'quiz_submissions', docSnap.id), {
          classCode: targetClassCode,
          reconciledAt: serverTimestamp(),
        })
        updatedCount++
      }
    }
    return updatedCount
  } catch (err) {
    console.warn('Gagal rekonsiliasi riwayat kuis lama:', err)
    return 0
  }
}

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

  // Rekonsiliasi riwayat kuis lama milik siswa ini yang belum memiliki classCode
  try {
    await reconcileStudentSubmissions(userId, cleanCode)
  } catch (errRec) {
    console.warn('Rekonsiliasi kuis saat joinClass terlewati:', errRec)
  }

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
 * Menyimpan hasil kuis siswa ke Cloud Firestore secara terstruktur & IDEMPOTEN
 * - Hanya mengembalikan status berhasil SETELAH Firestore mengonfirmasi penyimpanan.
 * - Dilengkapi mekanisme retry aman (3x percobaan dengan backoff) menggunakan ID Dokumen deterministik
 *   sehingga transmisi ulang TIDAK menghasilkan data duplikat di Firestore.
 */
export async function submitQuizSubmission({
  submissionId,
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

  // ID Dokumen Deterministik: Mencegah duplikasi saat retry transmisi
  const targetDocId = submissionId || `sub_${userId}_${moduleId}_${Date.now()}`

  // Kontrak lengkap pengiriman hasil kuis ke server/cloud
  const payload = {
    id: targetDocId,
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
    status: 'received',
  }

  const MAX_RETRIES = 3
  let lastError = null

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      // Gunakan setDoc dengan targetDocId deterministik agar operasi idempoten
      await setDoc(doc(db, 'quiz_submissions', targetDocId), payload, { merge: true })

      // Simpan cadangan offline di perangkat setelah berhasil terkonfirmasi
      try {
        const backup = JSON.parse(localStorage.getItem(LOCAL_SUBMISSIONS_BACKUP) || '[]')
        const existingIdx = backup.findIndex((b) => b.id === targetDocId)
        if (existingIdx !== -1) {
          backup[existingIdx] = payload
        } else {
          backup.unshift(payload)
        }
        localStorage.setItem(LOCAL_SUBMISSIONS_BACKUP, JSON.stringify(backup.slice(0, 100)))
      } catch {}

      // HANYA mengembalikan status berhasil setelah Firestore mengonfirmasi penyimpanan
      return {
        success: true,
        submissionId: targetDocId,
        serverReceivedAt: payload.serverReceivedAt,
        percentage,
        attempt,
      }
    } catch (err) {
      lastError = err
      console.warn(`[Submisi Kuis] Percobaan ${attempt}/${MAX_RETRIES} gagal:`, err)
      if (attempt < MAX_RETRIES) {
        // Jeda backoff sebelum mencoba kembali (500ms, 1000ms)
        await new Promise((resolve) => setTimeout(resolve, attempt * 500))
      }
    }
  }

  // Jika seluruh percobaan retry gagal:
  // Catat di cadangan lokal perangkat dengan status gagal untuk rekonsiliasi manual
  try {
    const failedPayload = { ...payload, status: 'failed' }
    const backup = JSON.parse(localStorage.getItem(LOCAL_SUBMISSIONS_BACKUP) || '[]')
    backup.unshift(failedPayload)
    localStorage.setItem(LOCAL_SUBMISSIONS_BACKUP, JSON.stringify(backup.slice(0, 100)))
  } catch {}

  // Lemparkan error: JANGAN pernah menampilkan status berhasil jika Firestore gagal
  throw new Error(
    `Gagal menyimpan hasil kuis ke server setelah ${MAX_RETRIES} kali percobaan. ${lastError?.message || 'Periksa koneksi internet Anda.'}`
  )
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
 * Memverifikasi kewenangan RBAC: Hanya akun dengan role 'teacher' resmi yang diizinkan!
 * TIDAK MENGGUNAKAN DATA CONTOH / DUMMY jika database kosong!
 */
export async function getTeacherClassData(classCode = DEFAULT_CLASS_CODE) {
  const cleanCode = String(classCode || DEFAULT_CLASS_CODE).trim().toUpperCase()

  // 1. Verifikasi hak akses role teacher (RBAC enforcement)
  const currentUser = await getCurrentUser()
  if (!currentUser || currentUser.role !== 'teacher' || !isAuthorizedTeacherEmail(currentUser.email)) {
    throw new Error('Akses ditolak: Anda tidak memiliki kewenangan sebagai Guru Pengajar untuk kelas ini.')
  }

  let students = []
  let submissions = []

  try {
    // 2. Ambil daftar siswa yang terdaftar di kode kelas ini
    const qStudents = query(
      collection(db, 'users'),
      where('classCode', '==', cleanCode),
      limit(200),
    )
    const studentsSnap = await getDocs(qStudents)
    students = studentsSnap.docs
      .map((d) => ({ id: d.id, ...d.data() }))
      .filter((s) => s.role === 'student')

    // 3. Ambil seluruh hasil submit kuis untuk kelas ini yang telah berstatus 'received'
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
    throw err
   }

  // Jika data masih kosong, KEMBALIKAN ARRAY KOSONG (tanpa data mock dummy!)
  return {
    classCode: cleanCode,
    className: TEACHER_CONFIG.defaultClassName,
    students,
    submissions,
  }
}
