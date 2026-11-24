/**
 * Automated Verification Test for AD09-04 (Penyempurnaan Terarah)
 * Menguji 8 Skenario Wajib yang Diminta Dosen / Pengguna
 */

import fs from 'fs'
import path from 'path'

// Mock Browser Storage
class MockStorage {
  constructor() {
    this.store = new Map()
  }
  getItem(key) {
    return this.store.has(String(key)) ? this.store.get(String(key)) : null
  }
  setItem(key, value) {
    this.store.set(String(key), String(value))
  }
  removeItem(key) {
    this.store.delete(String(key))
  }
  clear() {
    this.store.clear()
  }
  key(index) {
    const keys = Array.from(this.store.keys())
    return keys[index] || null
  }
  get length() {
    return this.store.size
  }
}

global.window = {
  localStorage: new MockStorage(),
  sessionStorage: new MockStorage(),
}
global.localStorage = global.window.localStorage
global.sessionStorage = global.window.sessionStorage

async function runTestSuite() {
  const {
    getQuizDraftKey,
    resolveQuizUserNamespace,
    getSavedQuizDraft,
    saveQuizDraft,
    clearGuestQuizDrafts,
    clearLegacyQuizDrafts,
  } = await import('../src/utils/quizStorage.js')

  let passCount = 0
  let failCount = 0

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✓ PASS: ${message}`)
      passCount++
    } else {
      console.error(`  ✗ FAIL: ${message}`)
      failCount++
    }
  }

  console.log('\n======================================================')
  console.log('MEMULAI EKSEKUSI 8 PENGUJIAN WAJIB AD09-04')
  console.log('======================================================\n')

  const userA = { id: 'usr_student_alpha', uid: 'usr_student_alpha', name: 'Siswa A', role: 'student' }
  const userB = { id: 'usr_student_beta', uid: 'usr_student_beta', name: 'Siswa B', role: 'student' }
  const guestUser = { id: 'guest-session-uuid-777', role: 'guest', isGuest: true, name: 'Pengunjung Tamu' }
  const moduleId = 'modul-1'
  const activeVersion = 'v1.0'
  const validQuestionIds = ['q1', 'q2', 'q3', 'q4', 'q5']

  // -----------------------------------------------------------------
  // PENGUJIAN 1: Akun A mengerjakan kuis dan menyimpan draf
  // -----------------------------------------------------------------
  console.log('[PENGUJIAN 1] Akun A mengerjakan kuis dan menyimpan draf')
  localStorage.setItem('chemistry_lab_session', JSON.stringify(userA))

  const savedA = saveQuizDraft({
    userOrId: userA,
    moduleId,
    questionVersion: activeVersion,
    questionIndex: 2,
    selectedAnswers: { q1: 'B', q2: 'C' },
  })
  assert(savedA === true, 'Fungsi saveQuizDraft berhasil menyimpan draf Akun A')

  const keyA = getQuizDraftKey(userA, moduleId, activeVersion)
  assert(keyA === 'quiz_user_usr_student_alpha_modul-1_v1.0', `Format key Akun A: ${keyA}`)
  assert(localStorage.getItem(keyA) !== null, 'Draf Akun A tersimpan di localStorage dengan namespace akun')

  const draftA = getSavedQuizDraft({
    moduleId,
    userOrId: userA,
    questionVersion: activeVersion,
    validQuestionIds,
  })
  assert(draftA !== null && draftA.answersMap.q1 === 'B' && draftA.answersMap.q2 === 'C', 'Draf Akun A terbaca dengan jawaban q1=B, q2=C')

  // -----------------------------------------------------------------
  // PENGUJIAN 2: Akun A logout
  // -----------------------------------------------------------------
  console.log('\n[PENGUJIAN 2] Akun A logout')
  // Sesuai alur logoutUser di src/auth.js:
  clearGuestQuizDrafts()
  clearLegacyQuizDrafts()
  localStorage.removeItem('chemistry_lab_session')
  sessionStorage.removeItem('chemistry_lab_temporary_session')
  sessionStorage.removeItem('chemistry_lab_guest_session')

  assert(localStorage.getItem('chemistry_lab_session') === null, 'Sesi Akun A berhasil dihapus dari storage')
  assert(localStorage.getItem(keyA) !== null, 'Draf Akun A tetap aman tersimpan di bawah kuncinya sendiri (tidak terhapus saat logout)')

  // -----------------------------------------------------------------
  // PENGUJIAN 3: Akun B login dan tidak boleh melihat draf akun A
  // -----------------------------------------------------------------
  console.log('\n[PENGUJIAN 3] Akun B login dan tidak boleh melihat draf akun A')
  localStorage.setItem('chemistry_lab_session', JSON.stringify(userB))

  const keyB = getQuizDraftKey(userB, moduleId, activeVersion)
  assert(keyB === 'quiz_user_usr_student_beta_modul-1_v1.0', `Format key Akun B: ${keyB}`)

  const draftBBefore = getSavedQuizDraft({
    moduleId,
    userOrId: userB,
    questionVersion: activeVersion,
    validQuestionIds,
  })
  assert(draftBBefore === null, 'Akun B mendapatkan draf null (tidak melihat draf Akun A)')

  // -----------------------------------------------------------------
  // PENGUJIAN 4: Akun B membuat draf sendiri
  // -----------------------------------------------------------------
  console.log('\n[PENGUJIAN 4] Akun B membuat draf sendiri')
  const savedB = saveQuizDraft({
    userOrId: userB,
    moduleId,
    questionVersion: activeVersion,
    questionIndex: 1,
    selectedAnswers: { q1: 'A', q2: 'D' },
  })
  assert(savedB === true, 'Fungsi saveQuizDraft berhasil menyimpan draf Akun B')

  const draftB = getSavedQuizDraft({
    moduleId,
    userOrId: userB,
    questionVersion: activeVersion,
    validQuestionIds,
  })
  assert(draftB !== null && draftB.answersMap.q1 === 'A' && draftB.answersMap.q2 === 'D', 'Draf Akun B tersimpan mandiri (q1=A, q2=D)')
  assert(draftB.answersMap.q1 !== draftA.answersMap.q1, 'Draf Akun B independen dari Akun A')

  // Simulasi Akun B logout
  localStorage.removeItem('chemistry_lab_session')

  // -----------------------------------------------------------------
  // PENGUJIAN 5: Akun A login kembali dan draf miliknya tetap tersedia
  // -----------------------------------------------------------------
  console.log('\n[PENGUJIAN 5] Akun A login kembali dan draf miliknya tetap tersedia')
  localStorage.setItem('chemistry_lab_session', JSON.stringify(userA))

  const restoredDraftA = getSavedQuizDraft({
    moduleId,
    userOrId: userA,
    questionVersion: activeVersion,
    validQuestionIds,
  })
  assert(restoredDraftA !== null, 'Draf Akun A berhasil dipulihkan setelah login kembali')
  assert(restoredDraftA.questionIndex === 2, `Indeks soal Akun A dipulihkan ke 2 (aktual: ${restoredDraftA?.questionIndex})`)
  assert(restoredDraftA.answersMap.q1 === 'B', 'Jawaban q1 Akun A tetap B')
  assert(restoredDraftA.answersMap.q2 === 'C', 'Jawaban q2 Akun A tetap C')
  assert(restoredDraftA.answersMap.q1 !== 'A', 'Jawaban Akun B (A) TIDAK mencemari draf Akun A')

  // -----------------------------------------------------------------
  // PENGUJIAN 6: Pengguna tamu dapat menyimpan dan memulihkan draf dalam sesi yang sesuai
  // -----------------------------------------------------------------
  console.log('\n[PENGUJIAN 6] Pengguna tamu dapat menyimpan dan memulihkan draf dalam sesi yang sesuai')
  // Tamu masuk dengan objek user tamu
  sessionStorage.setItem('chemistry_lab_guest_session', JSON.stringify(guestUser))

  // Pastikan resolveQuizUserNamespace memeriksa objek user terlebih dahulu
  const guestNamespace = resolveQuizUserNamespace(guestUser)
  assert(guestNamespace === 'guest-session-uuid-777', `Namespace tamu sesuai ID tamu: ${guestNamespace}`)

  const keyGuest = getQuizDraftKey(guestUser, moduleId, activeVersion)
  assert(keyGuest === 'quiz_guest-session-uuid-777_modul-1_v1.0', `Format key tamu: ${keyGuest}`)

  saveQuizDraft({
    userOrId: guestUser,
    moduleId,
    questionVersion: activeVersion,
    questionIndex: 0,
    selectedAnswers: { q1: 'D' },
  })

  const guestDraft = getSavedQuizDraft({
    moduleId,
    userOrId: guestUser,
    questionVersion: activeVersion,
    validQuestionIds,
  })
  assert(guestDraft !== null && guestDraft.answersMap.q1 === 'D', 'Pengguna tamu berhasil memulihkan drafnya sendiri dalam sesi yang sesuai')

  // Pastikan akun terdaftar tidak dapat melihat draf tamu
  const checkANotSeeingGuest = getSavedQuizDraft({
    moduleId,
    userOrId: userA,
    questionVersion: activeVersion,
    validQuestionIds,
  })
  assert(checkANotSeeingGuest.answersMap.q1 === 'B', 'Akun A tidak melihat draf tamu')

  // Pembersihan sesi tamu saat logout
  clearGuestQuizDrafts()
  sessionStorage.removeItem('chemistry_lab_guest_session')

  const guestDraftAfterLogout = getSavedQuizDraft({
    moduleId,
    userOrId: guestUser,
    questionVersion: activeVersion,
    validQuestionIds,
  })
  assert(guestDraftAfterLogout === null, 'Draf sesi tamu berhasil dibersihkan saat logout/sesi berakhir')

  // Draf Akun A tetap utuh
  const checkAAfterGuestClear = getSavedQuizDraft({
    moduleId,
    userOrId: userA,
    questionVersion: activeVersion,
    validQuestionIds,
  })
  assert(checkAAfterGuestClear !== null && checkAAfterGuestClear.answersMap.q1 === 'B', 'Draf Akun A tidak terpengaruh oleh pembersihan draf tamu')

  // -----------------------------------------------------------------
  // PENGUJIAN 7: Draf tanpa versi atau dengan versi berbeda tidak dipulihkan
  // -----------------------------------------------------------------
  console.log('\n[PENGUJIAN 7] Draf tanpa versi atau dengan versi berbeda tidak dipulihkan')

  // Kasus 7a: Draf dengan versi berbeda (v2.0 vs v1.0)
  const diffVersionKey = getQuizDraftKey(userA, 'modul-2', activeVersion)
  localStorage.setItem(diffVersionKey, JSON.stringify({
    userId: 'user_usr_student_alpha',
    moduleId: 'modul-2',
    questionVersion: 'v2.0', // Versi di payload berbeda
    questionIndex: 1,
    answers: [{ questionId: 'q1', selectedAnswerId: 'C' }],
  }))

  const resultDiffVersion = getSavedQuizDraft({
    moduleId: 'modul-2',
    userOrId: userA,
    questionVersion: activeVersion, // activeVersion adalah v1.0
    validQuestionIds,
  })
  assert(resultDiffVersion === null, 'Draf dengan questionVersion berbeda (v2.0 vs v1.0) TIDAK dipulihkan (diabaikan)')

  // Kasus 7b: Draf TANPA questionVersion (null/undefined)
  const noVersionKey = getQuizDraftKey(userA, 'modul-3', activeVersion)
  localStorage.setItem(noVersionKey, JSON.stringify({
    userId: 'user_usr_student_alpha',
    moduleId: 'modul-3',
    // questionVersion sengaja dihilangkan (tanpa versi)
    questionIndex: 1,
    answers: [{ questionId: 'q1', selectedAnswerId: 'B' }],
  }))

  const resultNoVersion = getSavedQuizDraft({
    moduleId: 'modul-3',
    userOrId: userA,
    questionVersion: activeVersion,
    validQuestionIds,
  })
  assert(resultNoVersion === null, 'Draf TANPA questionVersion TIDAK dipulihkan (diabaikan)')

  // Kasus 7c: Draf legacy tak bertuan format lama (quiz_modul-1)
  localStorage.setItem('quiz_modul-1', JSON.stringify({
    questionIndex: 0,
    answers: [{ questionId: 'q1', selectedAnswerId: 'D' }],
  }))
  const resultLegacy = getSavedQuizDraft({
    moduleId: 'modul-1',
    userOrId: userB,
    questionVersion: activeVersion,
    validQuestionIds,
  })
  assert(resultLegacy === null || resultLegacy?.answersMap?.q1 !== 'D', 'Draf legacy lama quiz_modul-1 tidak dimuat ke akun pengguna')

  // -----------------------------------------------------------------
  // PENGUJIAN 8: Kedua jalur pemanggilan Quiz meneruskan identitas pengguna dengan benar
  // -----------------------------------------------------------------
  console.log('\n[PENGUJIAN 8] Kedua jalur pemanggilan Quiz meneruskan identitas pengguna dengan benar')

  const homeFile = fs.readFileSync(path.join(process.cwd(), 'src/Home.jsx'), 'utf8')

  // Periksa jalur 1: activeModal === 'quiz-page'
  const path1Regex = /activeModal\s*===\s*['"]quiz-page['"][\s\S]*?<Quiz[\s\S]*?\/>/
  const path1Match = homeFile.match(path1Regex)
  assert(path1Match !== null, 'Jalur 1 (activeModal === "quiz-page") ditemukan di src/Home.jsx')

  const path1Code = path1Match ? path1Match[0] : ''
  assert(path1Code.includes('key={`${user?.id || user?.uid || \'guest\'}_${quizModuleId || \'module-picker\'}`}'), 'Jalur 1 menggunakan key berbasis identitas user dan modul')
  assert(path1Code.includes('user={user}'), 'Jalur 1 meneruskan prop user={user}')
  assert(path1Code.includes('userId={user?.id || user?.uid}'), 'Jalur 1 meneruskan prop userId={user?.id || user?.uid}')

  // Periksa jalur 2: activeModal === 'kuis'
  const path2Regex = /activeModal\s*===\s*['"]kuis['"][\s\S]*?<Quiz[\s\S]*?\/>/
  const path2Match = homeFile.match(path2Regex)
  assert(path2Match !== null, 'Jalur 2 (activeModal === "kuis") ditemukan di src/Home.jsx')

  const path2Code = path2Match ? path2Match[0] : ''
  assert(path2Code.includes('key={`${user?.id || user?.uid || \'guest\'}_${quizModuleId || \'module-picker\'}`}'), 'Jalur 2 menggunakan key berbasis identitas user dan modul')
  assert(path2Code.includes('user={user}'), 'Jalur 2 meneruskan prop user={user}')
  assert(path2Code.includes('userId={user?.id || user?.uid}'), 'Jalur 2 meneruskan prop userId={user?.id || user?.uid}')

  // Periksa keselarasan resolveQuizUserNamespace(user || userId) di src/components/Quiz.jsx
  const quizComponentFile = fs.readFileSync(path.join(process.cwd(), 'src/components/Quiz.jsx'), 'utf8')
  assert(quizComponentFile.includes('resolveQuizUserNamespace(user || userId)'), 'src/components/Quiz.jsx memanggil resolveQuizUserNamespace(user || userId)')
  assert(quizComponentFile.includes('[user, userId]'), 'src/components/Quiz.jsx memiliki dependency useMemo [user, userId]')

  console.log('\n======================================================')
  console.log(`HASIL AKHIR: ${passCount} LULUS, ${failCount} GAGAL`)
  console.log('======================================================\n')

  if (failCount > 0) {
    process.exit(1)
  }
}

runTestSuite().catch((err) => {
  console.error('Fatal Test Error:', err)
  process.exit(1)
})
