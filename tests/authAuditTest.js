/**
 * Pengujian Audit Keamanan & Autentikasi
 * ElectroFun Chemistry — Pengujian 5 Temuan Audit src/auth.js
 */

// Setup browser storage mock untuk lingkungan Node.js
const storage = new Map()
globalThis.localStorage = {
  getItem: (k) => (storage.has(k) ? storage.get(k) : null),
  setItem: (k, v) => storage.set(k, String(v)),
  removeItem: (k) => storage.delete(k),
  clear: () => storage.clear(),
}

const sessionStore = new Map()
globalThis.sessionStorage = {
  getItem: (k) => (sessionStore.has(k) ? sessionStore.get(k) : null),
  setItem: (k, v) => sessionStore.set(k, String(v)),
  removeItem: (k) => sessionStore.delete(k),
  clear: () => sessionStore.clear(),
}

// In-memory Firestore & Auth mock state untuk pengujian deterministic
const mockUsers = [
  {
    id: 'uid-guru-1',
    uid: 'uid-guru-1',
    name: 'Ibu Guru Kimia',
    username: 'gurukimia',
    email: 'guru.kimia@electrolab.id',
    role: 'teacher',
    classCode: 'KIMIA-X1',
  },
  {
    id: 'uid-siswa-1',
    uid: 'uid-siswa-1',
    name: 'Budi Santoso',
    username: 'budisantoso',
    email: 'budi.santoso@sma.edu',
    role: 'student',
    classCode: 'KIMIA-X1',
  },
]

const mockQuizSubmissions = new Map()
let mockAuthCurrentUser = null
let confirmPasswordResetCalls = []
let updatePasswordCalls = []
let signInCalls = []

// Mock Firebase SDK module for node testing
const mockFirebase = {
  auth: {
    get currentUser() {
      return mockAuthCurrentUser
    },
    authStateReady: async () => mockAuthCurrentUser,
  },
  db: { type: 'firestore' },
  createUserWithEmailAndPassword: async (_auth, email, _password) => {
    const uid = `uid-${Date.now()}`
    const user = { uid, email, displayName: email.split('@')[0] }
    mockAuthCurrentUser = user
    return { user }
  },
  signInWithEmailAndPassword: async (_auth, email, password) => {
    signInCalls.push({ email, password })
    if (password === 'wrongpass') {
      const err = new Error('Wrong password')
      err.code = 'auth/wrong-password'
      throw err
    }
    const found = mockUsers.find((u) => u.email.toLowerCase() === email.toLowerCase())
    const uid = found ? found.id : `uid-${Date.now()}`
    const user = { uid, email, displayName: found ? found.name : email.split('@')[0] }
    mockAuthCurrentUser = user
    return { user }
  },
  signOut: async () => {
    mockAuthCurrentUser = null
  },
  updateProfile: async (user, { displayName }) => {
    if (user) user.displayName = displayName
  },
  sendPasswordResetEmail: async (_auth, email) => {
    return true
  },
  confirmPasswordReset: async (_auth, code, newPassword) => {
    confirmPasswordResetCalls.push({ code, newPassword })
    if (code === 'expired-code') {
      const err = new Error('Expired code')
      err.code = 'auth/expired-action-code'
      throw err
    }
    return true
  },
  verifyPasswordResetCode: async (_auth, code) => {
    if (code === 'invalid-code') {
      const err = new Error('Invalid code')
      err.code = 'auth/invalid-action-code'
      throw err
    }
    return 'budi.santoso@sma.edu'
  },
  updatePassword: async (user, newPassword) => {
    updatePasswordCalls.push({ uid: user?.uid, newPassword })
    return true
  },
  setPersistence: async () => true,
  browserLocalPersistence: 'LOCAL',
  browserSessionPersistence: 'SESSION',
  onAuthStateChanged: (_auth, callback) => {
    callback(mockAuthCurrentUser)
    return () => {}
  },
  doc: (_db, col, id) => ({ collectionName: col, id }),
  collection: (_db, col) => ({ collectionName: col }),
  setDoc: async (docRef, data, _options) => {
    if (docRef.collectionName === 'quiz_submissions') {
      mockQuizSubmissions.set(docRef.id, { ...data, id: docRef.id })
    } else if (docRef.collectionName === 'users') {
      const existing = mockUsers.find((u) => u.id === docRef.id)
      if (existing) Object.assign(existing, data)
      else mockUsers.push({ id: docRef.id, ...data })
    }
    return data
  },
  getDoc: async (docRef) => {
    if (docRef.collectionName === 'users') {
      const found = mockUsers.find((u) => u.id === docRef.id)
      return {
        id: docRef.id,
        exists: () => Boolean(found),
        data: () => (found ? { ...found } : undefined),
      }
    }
    return { id: docRef.id, exists: () => false, data: () => undefined }
  },
  updateDoc: async (docRef, data) => {
    if (docRef.collectionName === 'users') {
      const found = mockUsers.find((u) => u.id === docRef.id)
      if (found) Object.assign(found, data)
    } else if (docRef.collectionName === 'quiz_submissions') {
      const found = mockQuizSubmissions.get(docRef.id)
      if (found) Object.assign(found, data)
    }
    return data
  },
  query: (colRef, ...constraints) => ({ colRef, constraints }),
  where: (field, op, value) => ({ type: 'where', field, op, value }),
  limit: (n) => ({ type: 'limit', n }),
  getDocs: async (q) => {
    const colName = q.colRef ? q.colRef.collectionName : q.collectionName
    if (colName === 'users') {
      let filtered = [...mockUsers]
      if (q.constraints) {
        for (const c of q.constraints) {
          if (c.type === 'where') {
            filtered = filtered.filter((item) => item[c.field] === c.value)
          }
        }
      }
      return {
        empty: filtered.length === 0,
        docs: filtered.map((u) => ({ id: u.id, data: () => ({ ...u }) })),
      }
    }
    if (colName === 'quiz_submissions') {
      let list = Array.from(mockQuizSubmissions.values())
      if (q.constraints) {
        for (const c of q.constraints) {
          if (c.type === 'where') {
            list = list.filter((item) => item[c.field] === c.value)
          }
        }
      }
      return {
        empty: list.length === 0,
        docs: list.map((s) => ({ id: s.id, data: () => ({ ...s }) })),
      }
    }
    return { empty: true, docs: [] }
  },
  serverTimestamp: () => new Date().toISOString(),
}

// Hubungkan mock adapter ke src/firebase.js sebelum import auth.js
const { setFirebaseTestAdapter } = await import('../src/firebase.js')
setFirebaseTestAdapter(mockFirebase)

const {
  enforceUserRole,
  registerUser,
  loginUser,
  logoutUser,
  loginAsGuest,
  getCurrentUser,
  resetPassword,
  verifyResetCode,
  submitQuizSubmission,
  getTeacherClassData,
  joinClass,
  leaveClass,
  reconcileStudentSubmissions,
  DEFAULT_CLASS_CODE,
} = await import('../src/auth.js')

const { isAuthorizedTeacherEmail } = await import('../src/config/teacherConfig.js')

const results = []
function testAssert(condition, desc) {
  if (condition) {
    results.push({ desc, status: 'PASS' })
    console.log(`[PASS] ${desc}`)
  } else {
    results.push({ desc, status: 'FAIL' })
    console.error(`[FAIL] ${desc}`)
    throw new Error(`Test assertion failed: ${desc}`)
  }
}

async function runAuditTests() {
  console.log('=== MEMULAI TEST AUDIT SISTEM AUTENTIKASI ELECTROFUN CHEMISTRY ===\n')

  // ---------------------------------------------------------------------------
  // 1. PENGUJIAN ROLE-BASED ACCESS CONTROL (RBAC) & WHITLELIST
  // ---------------------------------------------------------------------------
  console.log('--- 1. Audit RBAC & Keamanan Whitelist Guru ---')

  // Siswa tidak bisa mengklaim role teacher
  const studentRoleEnforced = enforceUserRole('siswa.nakal@gmail.com', 'teacher')
  testAssert(
    studentRoleEnforced === 'student',
    'Percobaan siswa meminta role "teacher" otomatis digagalkan dan dipaksa menjadi "student"'
  )

  // Guru resmi diakui sebagai teacher
  const teacherRoleEnforced = enforceUserRole('guru.kimia@electrolab.id', 'student')
  testAssert(
    teacherRoleEnforced === 'teacher',
    'Email guru resmi ("guru.kimia@electrolab.id") selalu ditegakkan sebagai role "teacher"'
  )

  // Guru tidak resmi ditolak
  testAssert(
    !isAuthorizedTeacherEmail('hacker@evil.com'),
    'Email luar tidak terdaftar dalam whitelist guru'
  )

  // ---------------------------------------------------------------------------
  // 2. PENGUJIAN FUNGSI RESET PASSWORD DENGAN FIREBASE AUTHENTICATION
  // ---------------------------------------------------------------------------
  console.log('\n--- 2. Audit Reset Password Menggunakan Firebase Auth ---')

  // Validasi konfirmasi password
  let passwordMismatchError = false
  try {
    await resetPassword({ token: 'test-token', password: 'password123', confirmPassword: 'password999' })
  } catch (err) {
    passwordMismatchError = true
  }
  testAssert(passwordMismatchError, 'resetPassword menolak konfirmasi password yang tidak cocok')

  // Validasi panjang password
  let shortPasswordError = false
  try {
    await resetPassword({ token: 'test-token', password: '123', confirmPassword: '123' })
  } catch (err) {
    shortPasswordError = true
  }
  testAssert(shortPasswordError, 'resetPassword menolak password kurang dari 6 karakter')

  // Reset dengan token valid
  const resetRes = await resetPassword({
    token: 'valid-firebase-oob-code',
    password: 'newPassword123',
    confirmPassword: 'newPassword123',
  })
  testAssert(resetRes.success === true, 'resetPassword berhasil memproses token oobCode')

  // Reset dengan token kedaluwarsa menangkap error Firebase
  let expiredTokenHandled = false
  try {
    await resetPassword({
      token: 'expired-code',
      password: 'newPassword123',
      confirmPassword: 'newPassword123',
    })
  } catch (err) {
    if (err.message.includes('kedaluwarsa')) {
      expiredTokenHandled = true
    }
  }
  testAssert(expiredTokenHandled, 'resetPassword memberikan pesan ramah saat token Firebase expired')

  // Verifikasi kode token
  const verifyRes = await verifyResetCode('valid-token-check')
  testAssert(verifyRes.valid === true, 'verifyResetCode berhasil memverifikasi token reset')

  // ---------------------------------------------------------------------------
  // 3. PENGUJIAN LOGIN MENGGUNAKAN USERNAME MAUPUN EMAIL
  // ---------------------------------------------------------------------------
  console.log('\n--- 3. Audit Login Menggunakan Username dan Email ---')

  // Login dengan Email
  const userByEmail = await loginUser({
    identifier: 'budi.santoso@sma.edu',
    password: 'password123',
    remember: true,
  })
  testAssert(userByEmail.email === 'budi.santoso@sma.edu', 'Login dengan format email berhasil')
  testAssert(userByEmail.role === 'student', 'Pengguna masuk dengan hak akses student')

  // Login dengan Username ("budisantoso" tanpa @)
  const userByUsername = await loginUser({
    identifier: 'budisantoso',
    password: 'password123',
    remember: false,
  })
  testAssert(userByUsername.username === 'budisantoso', 'Login dengan username "budisantoso" berhasil')
  testAssert(userByUsername.email === 'budi.santoso@sma.edu', 'Sistem berhasil me-resolve email akun dari username')

  // Login dengan Username Guru ("gurukimia")
  const teacherByUsername = await loginUser({
    identifier: 'gurukimia',
    password: 'password123',
  })
  testAssert(teacherByUsername.role === 'teacher', 'Guru login via username berhasil mendapatkan role "teacher"')
  testAssert(teacherByUsername.classCode === DEFAULT_CLASS_CODE, 'Guru otomatis terhubung ke kelas KIMIA-X1')

  // Login dengan Username yang tidak terdaftar
  let unknownUserHandled = false
  try {
    await loginUser({
      identifier: 'usernametidakada',
      password: 'password123',
    })
  } catch (err) {
    if (err.message.includes('tidak ditemukan')) unknownUserHandled = true
  }
  testAssert(unknownUserHandled, 'Login dengan username tidak terdaftar menghasilkan pesan ramah')

  // ---------------------------------------------------------------------------
  // 4. PENGUJIAN VALIDASI SESI BERPATOKAN KE FIREBASE AUTHENTICATION
  // ---------------------------------------------------------------------------
  console.log('\n--- 4. Audit Validasi Sesi Pengguna Berpatokan ke Firebase Auth ---')

  // Ketika pengguna aktif di Firebase Auth
  const currentAuthUser = await getCurrentUser()
  testAssert(currentAuthUser !== null, 'getCurrentUser mengembalikan pengguna aktif dari Firebase')
  testAssert(currentAuthUser.email === teacherByUsername.email, 'Sesi aktif terkonfirmasi dari Firebase currentUser')

  // Ketika pengguna logout
  await logoutUser()
  const userAfterSignOut = await getCurrentUser()
  testAssert(
    userAfterSignOut === null,
    'Setelah signOut Firebase, getCurrentUser mengembalikan null dan membersihkan cache localStorage'
  )
  testAssert(
    localStorage.getItem('chemistry_lab_session') === null,
    'Storage cache chemistry_lab_session bersih setelah logout'
  )

  // Mode Tamu (Guest) tetap independen & aman
  const guestUser = loginAsGuest()
  testAssert(guestUser.role === 'guest', 'Mode tamu aktif mandiri')
  const guestCurrent = await getCurrentUser()
  testAssert(guestCurrent.role === 'guest', 'getCurrentUser mengenali sesi tamu mandiri')

  // Membersihkan sesi tamu
  sessionStorage.clear()

  // ---------------------------------------------------------------------------
  // 5. PENGUJIAN PENYIMPANAN KUIS IDEMPOTEN, RETRY, & KONFIRMASI FIRESTORE
  // ---------------------------------------------------------------------------
  console.log('\n--- 5. Audit Penyimpanan Kuis Idempoten & Pencegahan Duplikasi ---')

  const submissionPayload = {
    submissionId: 'sub_test_idempoten_001',
    userId: 'uid-siswa-1',
    userName: 'Budi Santoso',
    userEmail: 'budi.santoso@sma.edu',
    classCode: 'KIMIA-X1',
    moduleId: 'modul-1',
    moduleTitle: 'Kenali Larutan di Sekitar Kita',
    attemptType: 'evaluation',
    score: 8,
    totalQuestions: 10,
    answers: { 'q-1': { isCorrect: true } },
  }

  // Pengiriman Pertama
  const subResult1 = await submitQuizSubmission(submissionPayload)
  testAssert(subResult1.success === true, 'Submisi kuis ke-1 berhasil terkonfirmasi oleh Firestore')
  testAssert(subResult1.submissionId === 'sub_test_idempoten_001', 'ID Dokumen submisi ke-1 sesuai')

  // Simulasi Retry Jaringan: Pengiriman Ulang dengan ID Dokumen yang sama
  const subResult2 = await submitQuizSubmission(submissionPayload)
  testAssert(subResult2.success === true, 'Submisi retry ke-2 berhasil diproses')
  testAssert(subResult2.submissionId === 'sub_test_idempoten_001', 'ID Dokumen retry identik dengan sebelumnya')

  // Verifikasi Dokumen di Firestore Mock: HARUS TEPAT 1 DOKUMEN (TIDAK ADA DUPLIKASI!)
  const totalSubmissionsInDb = Array.from(mockQuizSubmissions.values()).filter(
    (s) => s.id === 'sub_test_idempoten_001'
  )
  testAssert(
    totalSubmissionsInDb.length === 1,
    `Idempotensi terbukti: Tepat 1 dokumen tersimpan di database setelah retry, bukan ${totalSubmissionsInDb.length}`
  )

  // Verifikasi Akun Tamu tidak tersinkron ke cloud
  const guestSubmitResult = await submitQuizSubmission({
    userId: 'guest-123',
    score: 10,
  })
  testAssert(
    guestSubmitResult.success === false,
    'Submisi kuis akun tamu ditolak dari sinkronisasi Firestore'
  )

  // ---------------------------------------------------------------------------
  // 6. PENGUJIAN TAHAP 3: ASOSIASI KELAS SISWA (BARU, LAMA, & REKONSILIASI KUIS)
  // ---------------------------------------------------------------------------
  console.log('\n--- 6. Pengujian Tahap 3: Asosiasi Kelas Siswa & Rekonsiliasi Kuis ---')

  // 1. Siswa Baru otomatis memiliki classCode KIMIA-X1 dan className terpisah
  const newStudent = await registerUser({
    name: 'Siswa Baru Otomatis',
    username: 'siswabaru',
    email: 'siswabaru@sekolah.sch.id',
    className: 'X-1',
    school: 'SMA Negeri 1',
    password: 'password123',
  })
  testAssert(
    newStudent.classCode === DEFAULT_CLASS_CODE,
    `Siswa baru otomatis memiliki classCode "${DEFAULT_CLASS_CODE}"`
  )
  testAssert(
    newStudent.className === 'X-1',
    'Field className tetap menyimpan rombel sekolah asal ("X-1")'
  )
  testAssert(
    newStudent.role === 'student',
    'Akun baru tetap berstatus role student'
  )

  // 2. Akun Siswa Lama (classCode null) ter-auto heal saat login
  // Setup akun siswa lama di mock
  mockUsers.push({
    id: 'uid-siswa-lama',
    uid: 'uid-siswa-lama',
    name: 'Siswa Lama Mandiri',
    username: 'siswalama',
    email: 'siswalama@sma.edu',
    className: 'X MIPA 3',
    role: 'student',
    classCode: null, // belum ada classCode
  })

  // Simulasikan pengerjaan kuis lama sebelum masuk kelas (classCode null)
  mockQuizSubmissions.set('sub_lama_milik_siswa', {
    id: 'sub_lama_milik_siswa',
    userId: 'uid-siswa-lama',
    userName: 'Siswa Lama Mandiri',
    classCode: null, // kuis lama tanpa classCode
    score: 85,
    percentage: 85,
    answers: { q1: 'A' },
  })
  mockQuizSubmissions.set('sub_milik_siswa_lain', {
    id: 'sub_milik_siswa_lain',
    userId: 'uid-siswa-lain',
    userName: 'Siswa Lain',
    classCode: null,
    score: 70,
    percentage: 70,
    answers: { q1: 'B' },
  })

  // Login siswa lama
  const healedStudent = await loginUser({
    identifier: 'siswalama',
    password: 'password123',
  })
  testAssert(
    healedStudent.classCode === DEFAULT_CLASS_CODE,
    `Akun siswa lama otomatis diperbaiki ke classCode "${DEFAULT_CLASS_CODE}" saat login`
  )
  testAssert(
    healedStudent.name === 'Siswa Lama Mandiri' && healedStudent.className === 'X MIPA 3',
    'Profil lain (nama, className) tidak terganggu atau berubah'
  )

  // Verifikasi rekonsiliasi kuis lama
  await reconcileStudentSubmissions('uid-siswa-lama', DEFAULT_CLASS_CODE)
  const reconciledSub = mockQuizSubmissions.get('sub_lama_milik_siswa')
  testAssert(
    reconciledSub.classCode === DEFAULT_CLASS_CODE,
    `Kuis lama milik siswa berhasil direkonsiliasi ke classCode "${DEFAULT_CLASS_CODE}"`
  )
  testAssert(
    reconciledSub.score === 85 && reconciledSub.percentage === 85 && reconciledSub.answers.q1 === 'A',
    'Nilai, skor, dan jawaban kuis lama TIDAK berubah'
  )

  // Verifikasi kuis milik siswa lain TIDAK ikut berubah
  const otherStudentSub = mockQuizSubmissions.get('sub_milik_siswa_lain')
  testAssert(
    otherStudentSub.classCode === null,
    'Submisi kuis milik siswa lain TIDAK tersentuh atau berubah'
  )

  // 3. Akun Guru tidak berubah
  const teacherUser = await loginUser({
    identifier: 'gurukimia',
    password: 'password123',
  })
  testAssert(
    teacherUser.role === 'teacher' && teacherUser.classCode === DEFAULT_CLASS_CODE,
    'Akun guru tetap memiliki role teacher dan classCode KIMIA-X1'
  )

  // 4. Fitur Gabung Kelas & Keluar Kelas tetap berfungsi untuk siswa
  await loginUser({
    identifier: 'siswalama',
    password: 'password123',
  })

  await joinClass('uid-siswa-lama', DEFAULT_CLASS_CODE)
  const userInClass = await getCurrentUser()
  testAssert(
    userInClass.classCode === DEFAULT_CLASS_CODE,
    'Fungsi joinClass tetap berfungsi memperbarui classCode'
  )

  await leaveClass('uid-siswa-lama')
  const userLeftClass = await getCurrentUser()
  testAssert(
    userLeftClass.classCode === null,
    'Fungsi leaveClass tetap berfungsi mengosongkan classCode saat keluar kelas'
  )

  console.log('\n=== SELURUH PENGUJIAN AUDIT (23/23 SKENARIO) BERHASIL LULUS (PASS) ===')
}

runAuditTests().catch((err) => {
  console.error('\n[FATAL] Test audit gagal:', err)
  process.exit(1)
})
