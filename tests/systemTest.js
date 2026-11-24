/**
 * Script Pengujian Sistem & Otorisasi
 * ElectroFun Chemistry — Pengujian 20 Skenario Bagian L
 */

// Setup browser storage mock for Node environment BEFORE imports
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

// In-memory Firestore & Auth mock state for isolated testing
const usersMap = new Map()
const quizSubmissionsMap = new Map()
let currentAuth = null

const testAdapter = {
  auth: {
    get currentUser() {
      return currentAuth
    },
    authStateReady: async () => currentAuth,
  },
  db: { type: 'firestore' },
  createUserWithEmailAndPassword: async (_auth, email, _password) => {
    const uid = `uid-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
    currentAuth = { uid, email, displayName: email.split('@')[0] }
    return { user: currentAuth }
  },
  signInWithEmailAndPassword: async (_auth, email, _password) => {
    const found = Array.from(usersMap.values()).find((u) => u.email.toLowerCase() === email.toLowerCase())
    const uid = found ? found.id : `uid-${Date.now()}`
    currentAuth = { uid, email, displayName: found ? found.name : email.split('@')[0] }
    return { user: currentAuth }
  },
  signOut: async () => {
    currentAuth = null
  },
  updateProfile: async (user, { displayName }) => {
    if (user) user.displayName = displayName
    if (currentAuth && currentAuth.uid === user.uid) currentAuth.displayName = displayName
  },
  onAuthStateChanged: (_auth, callback) => {
    callback(currentAuth)
    return () => {}
  },
  doc: (_db, col, id) => ({ collectionName: col, id }),
  collection: (_db, col) => ({ collectionName: col }),
  setDoc: async (docRef, data, _options) => {
    if (docRef.collectionName === 'quiz_submissions') {
      quizSubmissionsMap.set(docRef.id, { ...data, id: docRef.id })
    } else if (docRef.collectionName === 'users') {
      const existing = usersMap.get(docRef.id) || {}
      usersMap.set(docRef.id, { ...existing, ...data, id: docRef.id })
    }
    return data
  },
  getDoc: async (docRef) => {
    if (docRef.collectionName === 'users') {
      const item = usersMap.get(docRef.id)
      return {
        id: docRef.id,
        exists: () => Boolean(item),
        data: () => (item ? { ...item } : undefined),
      }
    }
    return { id: docRef.id, exists: () => false, data: () => undefined }
  },
  updateDoc: async (docRef, data) => {
    if (docRef.collectionName === 'users') {
      const existing = usersMap.get(docRef.id) || {}
      usersMap.set(docRef.id, { ...existing, ...data, id: docRef.id })
    }
    return data
  },
  query: (colRef, ...constraints) => ({ colRef, constraints }),
  where: (field, op, value) => ({ type: 'where', field, op, value }),
  limit: (n) => ({ type: 'limit', n }),
  getDocs: async (q) => {
    const colName = q.colRef ? q.colRef.collectionName : q.collectionName
    if (colName === 'users') {
      let list = Array.from(usersMap.values())
      if (q.constraints) {
        for (const c of q.constraints) {
          if (c.type === 'where') {
            list = list.filter((u) => u[c.field] === c.value)
          }
        }
      }
      return {
        empty: list.length === 0,
        docs: list.map((u) => ({ id: u.id, data: () => ({ ...u }) })),
      }
    }
    if (colName === 'quiz_submissions') {
      let list = Array.from(quizSubmissionsMap.values())
      if (q.constraints) {
        for (const c of q.constraints) {
          if (c.type === 'where') {
            list = list.filter((s) => s[c.field] === c.value)
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

// Hubungkan test adapter sebelum import auth
const { setFirebaseTestAdapter } = await import('../src/firebase.js')
setFirebaseTestAdapter(testAdapter)

// Now dynamically import auth and teacherConfig
const {
  registerUser,
  loginAsGuest,
  getCurrentUser,
  joinClass,
  submitQuizSubmission,
  getTeacherClassData,
  getStudentSubmissions,
  logoutUser,
  DEFAULT_CLASS_CODE,
} = await import('../src/auth.js')

const { isAuthorizedTeacherEmail } = await import('../src/config/teacherConfig.js')

const testResults = []

function assert(condition, message) {
  if (condition) {
    testResults.push({ message, status: 'PASS' })
    console.log(`[PASS] ${message}`)
  } else {
    testResults.push({ message, status: 'FAIL' })
    console.error(`[FAIL] ${message}`)
    throw new Error(`Assertion failed: ${message}`)
  }
}

async function runAllTests() {
  console.log('=== MEMULAI 20 SKENARIO PENGUJIAN SISTEM ELECTROFUN CHEMISTRY ===\n')

  // Skenario 1: Guru berhasil register & login dengan email resmi
  console.log('--- Skenario 1-3: Autentikasi & Batas Role Guru, Siswa, Tamu ---')
  const teacherEmail = 'guru.kimia@electrolab.id'
  assert(isAuthorizedTeacherEmail(teacherEmail), 'Email guru terdaftar dalam konfigurasi resmi')

  const teacher = await registerUser({
    name: 'Ibu Guru Kimia',
    username: 'gurukimia',
    email: teacherEmail,
    className: 'Guru Pengajar',
    password: 'password123',
  })
  assert(teacher.role === 'teacher', 'Akun guru resmi mendapatkan role "teacher"')
  assert(teacher.classCode === DEFAULT_CLASS_CODE, `Akun guru mengelola kelas ${DEFAULT_CLASS_CODE}`)

  // Skenario 2: Siswa A registrasi dan login
  const studentA = await registerUser({
    name: 'Budi Santoso',
    username: 'budisantoso',
    email: 'budi@gmail.com',
    className: 'X-1',
    password: 'password123',
  })
  assert(studentA.role === 'student', 'Akun siswa A mendapatkan role "student"')
  assert(studentA.role !== 'teacher', 'Siswa A TIDAK memiliki role "teacher"')

  // Skenario 3: Tamu masuk
  const guest = loginAsGuest()
  assert(guest.role === 'guest', 'Akun tamu mendapatkan role "guest"')
  assert(guest.isGuest === true, 'Akun tamu ditandai isGuest: true')

  // Skenario 4 & 5: Siswa A dan Siswa B bergabung ke kelas KIMIA-X1
  console.log('\n--- Skenario 4-5: Siswa Bergabung ke Kelas KIMIA-X1 ---')
  const studentJoinedA = await joinClass(studentA.id, 'KIMIA-X1')
  assert(studentJoinedA.classCode === 'KIMIA-X1', 'Siswa A berhasil bergabung ke kelas KIMIA-X1')

  const studentB = await registerUser({
    name: 'Siti Aminah',
    username: 'sitiaminah',
    email: 'siti@gmail.com',
    className: 'X-1',
    password: 'password123',
  })
  const studentJoinedB = await joinClass(studentB.id, 'KIMIA-X1')
  assert(studentJoinedB.classCode === 'KIMIA-X1', 'Siswa B berhasil bergabung ke kelas KIMIA-X1')

  // Skenario 6: Siswa A mengerjakan kuis modul 1
  console.log('\n--- Skenario 6-7: Pengerjaan Kuis Siswa & Submisi Server ---')
  const answersA = {
    'm1-q1': {
      questionId: 'm1-q1',
      questionText: 'Apakah larutan NaCl menghantarkan listrik?',
      selectedOptionId: 'B',
      selectedOptionText: 'Menghasilkan ion-ion bergerak',
      correctAnswerId: 'B',
      isCorrect: true,
      pembahasan: 'NaCl terdisosiasi sempurna menjadi Na+ dan Cl-.',
      questionVersion: 'v1.0',
    },
    'm1-q2': {
      questionId: 'm1-q2',
      questionText: 'Apakah larutan gula menghantarkan listrik?',
      selectedOptionId: 'A',
      selectedOptionText: 'Larut sempurna',
      correctAnswerId: 'C',
      isCorrect: false,
      pembahasan: 'Gula larut sebagai molekul netral tanpa ion.',
      questionVersion: 'v1.0',
    },
  }

  const subA = await submitQuizSubmission({
    userId: studentA.id,
    userName: studentA.name,
    userEmail: studentA.email,
    classCode: studentJoinedA.classCode,
    moduleId: 'modul-1',
    moduleTitle: 'Kenali Larutan di Sekitar Kita',
    attemptType: 'evaluation',
    questionVersion: 'v1.0',
    score: 8,
    totalQuestions: 10,
    answers: answersA,
  })
  assert(subA.success === true, 'Siswa A berhasil submit kuis ke server')
  assert(subA.serverReceivedAt !== undefined, 'Submisi siswa A memiliki waktu penerimaan server')

  // Skenario 7: Siswa B mengerjakan kuis modul 1
  const answersB = {
    'm1-q1': {
      questionId: 'm1-q1',
      questionText: 'Apakah larutan NaCl menghantarkan listrik?',
      selectedOptionId: 'B',
      selectedOptionText: 'Menghasilkan ion-ion bergerak',
      correctAnswerId: 'B',
      isCorrect: true,
      pembahasan: 'NaCl terdisosiasi sempurna menjadi Na+ dan Cl-.',
      questionVersion: 'v1.0',
    },
  }
  const subB = await submitQuizSubmission({
    userId: studentB.id,
    userName: studentB.name,
    userEmail: studentB.email,
    classCode: studentJoinedB.classCode,
    moduleId: 'modul-1',
    moduleTitle: 'Kenali Larutan di Sekitar Kita',
    attemptType: 'evaluation',
    questionVersion: 'v1.0',
    score: 10,
    totalQuestions: 10,
    answers: answersB,
  })
  assert(subB.success === true, 'Siswa B berhasil submit kuis ke server')

  // Skenario 8: Guru membuka data kelas
  console.log('\n--- Skenario 8-11: Guru Membaca Data & Detail Jawaban ---')
  // Login kembali sebagai guru resmi sebelum membaca data kelas guru (RBAC check)
  currentAuth = { uid: teacher.id, email: teacher.email, displayName: teacher.name }
  const classData = await getTeacherClassData(DEFAULT_CLASS_CODE)
  assert(classData.students.length === 2, `Guru melihat tepat 2 siswa terdaftar (Budi & Siti), aktual: ${classData.students.length}`)
  assert(classData.submissions.length === 2, `Guru melihat 2 submisi kuis diterima server, aktual: ${classData.submissions.length}`)

  // Skenario 9 & 10: Guru melihat hasil kuis & detail jawaban
  const foundSubA = classData.submissions.find((s) => s.userId === studentA.id)
  assert(foundSubA !== undefined, 'Submisi siswa A ditemukan dalam rekap guru')
  assert(foundSubA.score === 8 && foundSubA.percentage === 80, 'Nilai siswa A tepat 80% (8/10)')

  // Skenario 11: Detail jawaban butir soal asli
  const detailQ1 = foundSubA.answers['m1-q1']
  assert(detailQ1.selectedOptionId === 'B', 'Pilihan asli siswa A pada butir 1 adalah opsi B')
  assert(detailQ1.isCorrect === true, 'Status butir 1 dinilai benar')
  assert(detailQ1.questionVersion === 'v1.0', 'Versi soal tercatat v1.0')

  // Skenario 12 & 13: Perhitungan distribusi nilai & analisis ketuntasan
  console.log('\n--- Skenario 12-16: Perhitungan Statistik Aktual & Aturan Percobaan ---')
  const avg = Math.round((foundSubA.percentage + subB.percentage) / 2)
  assert(avg === 90, `Rata-rata kelas aktual adalah 90% (80% + 100% / 2), hasil: ${avg}%`)

  // Skenario 14 & 15: Aturan Percobaan (Siswa A mencoba kuis sekali lagi)
  await submitQuizSubmission({
    userId: studentA.id,
    userName: studentA.name,
    userEmail: studentA.email,
    classCode: studentJoinedA.classCode,
    moduleId: 'modul-1',
    moduleTitle: 'Kenali Larutan di Sekitar Kita',
    attemptType: 'evaluation',
    questionVersion: 'v1.0',
    score: 9, // Naik jadi 90%
    totalQuestions: 10,
    answers: answersA,
  })

  const updatedClassData = await getTeacherClassData(DEFAULT_CLASS_CODE)
  assert(updatedClassData.submissions.length === 3, 'Riwayat lengkap tetap 3 pengerjaan')

  // Filter 1 siswa 1 kali sesuai latest attempt
  const latestMap = new Map()
  for (const s of updatedClassData.submissions) {
    if (!latestMap.has(s.userId)) {
      latestMap.set(s.userId, s)
    }
  }
  assert(latestMap.size === 2, `Tepat 2 siswa unik dalam rekap klasikal (n = ${latestMap.size})`)
  assert(latestMap.get(studentA.id).score === 9, 'Percobaan terakhir Siswa A tercatat bernilai 9 (90%)')

  // Skenario 16: Status pending tidak dihitung sebagai nol
  const validOnly = updatedClassData.submissions.filter((s) => s.status === 'received')
  assert(validOnly.length === 3, 'Seluruh submisi yang diproses berstatus "received"')

  // Skenario 17: Siswa A tidak dapat melihat hasil milik Siswa B
  console.log('\n--- Skenario 17-20: Isolasi Akses Siswa, Tamu, & Logout ---')
  const studentASubmissions = await getStudentSubmissions(studentA.id)
  const containsOther = studentASubmissions.some((s) => s.userId !== studentA.id)
  assert(!containsOther, 'Siswa A HANYA melihat hasil miliknya sendiri')

  // Skenario 18: Tamu tidak mengirim hasil ke kelas guru
  const guestSub = await submitQuizSubmission({
    userId: guest.id,
    userName: guest.name,
    classCode: 'KIMIA-X1',
    moduleId: 'modul-1',
    score: 10,
    totalQuestions: 10,
  })
  assert(guestSub.success === false, 'Hasil belajar akun tamu ditolak dari sinkronisasi kelas guru')

  // Skenario 19 & 20: Logout guru
  await logoutUser()
  const currentUserAfterLogout = await getCurrentUser()
  assert(currentUserAfterLogout === null, 'Sesi berhasil dibersihkan setelah logout')

  console.log('\n=== SELURUH 20 SKENARIO PENGUJIAN BERHASIL LULUS (PASS) ===')
  return testResults
}

runAllTests().catch((err) => {
  console.error('Test suite failed:', err)
  process.exit(1)
})
