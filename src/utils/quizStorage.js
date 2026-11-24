/**
 * Utility Penyimpanan dan Isolasi Draf Kuis (AD09-04)
 * ElectroFun Chemistry
 *
 * Mengelola namespace draf per pengguna (user UID vs guest),
 * validasi versi soal, pembersihan saat logout, dan penanganan draf lama.
 */

import { TEACHER_CONFIG } from '../config/teacherConfig.js'

const LOCAL_SESSION_KEY = 'chemistry_lab_session'
const SESSION_KEY = 'chemistry_lab_temporary_session'
const GUEST_SESSION_KEY = 'chemistry_lab_guest_session'

/**
 * Menentukan namespace unik untuk identitas pengguna.
 * Menjamin pemisahan total antara akun terdaftar (user_<uid>),
 * akun tamu (guest_<id>), dan fallback aman.
 *
 * @param {object|string|null} userOrId
 * @returns {string}
 */
export function resolveQuizUserNamespace(userOrId) {
  if (userOrId && typeof userOrId === 'object') {
    const isGuest = Boolean(userOrId.isGuest || userOrId.role === 'guest')
    const rawId = userOrId.uid || userOrId.id
    if (isGuest) {
      const gid = rawId ? String(rawId).trim() : 'session'
      return gid.startsWith('guest') ? gid : `guest_${gid}`
    }
    if (rawId) {
      const uid = String(rawId).trim()
      return uid.startsWith('user_') ? uid : `user_${uid}`
    }
  }

  if (typeof userOrId === 'string' && userOrId.trim()) {
    const trimmed = userOrId.trim()
    if (trimmed.startsWith('guest')) {
      return trimmed
    }
    return trimmed.startsWith('user_') ? trimmed : `user_${trimmed}`
  }

  // Jika tidak diberikan parameter, coba deteksi dari storage sesi aktif
  if (typeof window !== 'undefined' && window.localStorage && window.sessionStorage) {
    try {
      const rawUser = window.localStorage.getItem(LOCAL_SESSION_KEY) || window.sessionStorage.getItem(SESSION_KEY)
      if (rawUser) {
        const parsed = JSON.parse(rawUser)
        if (parsed?.uid || parsed?.id) {
          const isGuest = Boolean(parsed.isGuest || parsed.role === 'guest')
          const id = parsed.uid || parsed.id
          if (isGuest) return String(id).startsWith('guest') ? String(id) : `guest_${id}`
          return String(id).startsWith('user_') ? String(id) : `user_${id}`
        }
      }
      const rawGuest = window.sessionStorage.getItem(GUEST_SESSION_KEY)
      if (rawGuest) {
        const guest = JSON.parse(rawGuest)
        if (guest?.id) {
          return String(guest.id).startsWith('guest') ? String(guest.id) : `guest_${guest.id}`
        }
      }
    } catch {
      // Abaikan galat pembacaan storage
    }
  }

  return 'guest_anonymous'
}

/**
 * Menghasilkan kunci unik localStorage untuk draf kuis:
 * Format: quiz_${userNamespace}_${moduleId}_${questionVersion}
 * Contoh: quiz_user_studentA_modul-1_v1.0
 */
export function getQuizDraftKey(userOrId, moduleId, questionVersion = TEACHER_CONFIG.activeQuestionVersion) {
  const ns = resolveQuizUserNamespace(userOrId)
  const mod = moduleId || 'general'
  const ver = questionVersion || TEACHER_CONFIG.activeQuestionVersion || 'v1.0'
  return `quiz_${ns}_${mod}_${ver}`
}

/**
 * Sanitasi pertanyaan kuis saat pengerjaan aktif:
 * Menghapus jawabanBenar, answer, pembahasan, caraPengerjaan, rumus
 */
export function sanitizeQuestion(q) {
  if (!q) return null
  return {
    id: q.id,
    modulId: q.modulId,
    pertanyaan: q.pertanyaan || q.question || '',
    question: q.question || q.pertanyaan || '',
    opsi: q.opsi || q.options || [],
    options: q.options || q.opsi || [],
  }
}

/**
 * Membaca draf kuis yang tersimpan untuk modul, pengguna, dan versi soal tertentu.
 *
 * Persyaratan AD09-04:
 * 1. Hanya memuat draf milik userNamespace dan versi yang cocok.
 * 2. Menolak draf jika questionVersion tidak cocok.
 * 3. Menolak dan mengabaikan draf lama tanpa kepemilikan jelas (quiz_${moduleId}).
 * 4. Memvalidasi daftar soal (hanya menyertakan jawaban untuk soal yang valid).
 */
export function getSavedQuizDraft({
  moduleId,
  userOrId = null,
  questionVersion = TEACHER_CONFIG.activeQuestionVersion,
  validQuestionIds = null,
}) {
  if (!moduleId || typeof window === 'undefined' || !window.localStorage) {
    return null
  }

  const activeVersion = questionVersion || TEACHER_CONFIG.activeQuestionVersion || 'v1.0'
  const targetKey = getQuizDraftKey(userOrId, moduleId, activeVersion)

  try {
    const raw = window.localStorage.getItem(targetKey)
    if (!raw) {
      // Penanganan draf lama (Requirement 5):
      // Draf dengan key global lama (quiz_${moduleId} atau quiz-${moduleId})
      // TIDAK BOLEH dimuat ke akun pengguna karena kepemilikannya tidak dapat dipastikan.
      return null
    }

    const parsed = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object') {
      return null
    }

    // 1. Validasi Versi Soal (Requirement 7 & AD09-04 penyempurnaan)
    // Draf yang tidak memiliki questionVersion atau memiliki versi berbeda harus diabaikan
    if (!parsed.questionVersion || parsed.questionVersion !== activeVersion) {
      console.warn(`[QuizStorage] Versi draf (${parsed.questionVersion || 'tanpa versi'}) tidak sesuai dengan versi aktif (${activeVersion}). Draf diabaikan.`)
      return null
    }

    // 2. Normalisasi format jawaban { [qId]: selectedAnswerId }
    const answersMap = {}
    const validSet = Array.isArray(validQuestionIds) && validQuestionIds.length > 0
      ? new Set(validQuestionIds)
      : null

    if (Array.isArray(parsed.answers)) {
      parsed.answers.forEach((item) => {
        if (item?.questionId && item?.selectedAnswerId) {
          if (!validSet || validSet.has(item.questionId)) {
            answersMap[item.questionId] = item.selectedAnswerId
          }
        }
      })
    } else if (parsed.userAnswers && typeof parsed.userAnswers === 'object') {
      Object.entries(parsed.userAnswers).forEach(([qId, val]) => {
        const ansId = val?.selectedOptionId || val
        if (ansId && (!validSet || validSet.has(qId))) {
          answersMap[qId] = ansId
        }
      })
    }

    const questionIndex = typeof parsed.questionIndex === 'number' && !isNaN(parsed.questionIndex) && parsed.questionIndex >= 0
      ? parsed.questionIndex
      : 0

    return {
      questionIndex,
      answers: Object.entries(answersMap).map(([questionId, selectedAnswerId]) => ({
        questionId,
        selectedAnswerId,
      })),
      answersMap,
      finished: Boolean(parsed.finished),
      questionVersion: parsed.questionVersion || activeVersion,
      userId: parsed.userId || resolveQuizUserNamespace(userOrId),
      moduleId,
    }
  } catch (err) {
    console.warn('[QuizStorage] Gagal memuat draf kuis:', err)
    return null
  }
}

/**
 * Menyimpan draf kuis ke localStorage dengan isolasi akun dan versi soal.
 */
export function saveQuizDraft({
  userOrId,
  moduleId,
  questionVersion = TEACHER_CONFIG.activeQuestionVersion,
  questionIndex = 0,
  selectedAnswers = {},
  finished = false,
}) {
  if (!moduleId || typeof window === 'undefined' || !window.localStorage) {
    return false
  }

  const activeVersion = questionVersion || TEACHER_CONFIG.activeQuestionVersion || 'v1.0'
  const userNamespace = resolveQuizUserNamespace(userOrId)
  const targetKey = getQuizDraftKey(userNamespace, moduleId, activeVersion)

  try {
    const answersArray = Object.entries(selectedAnswers).map(([questionId, selectedAnswerId]) => ({
      questionId,
      selectedAnswerId,
    }))

    const payload = {
      userId: userNamespace,
      moduleId,
      questionVersion: activeVersion,
      questionIndex: typeof questionIndex === 'number' ? questionIndex : 0,
      answers: answersArray,
      finished: Boolean(finished),
      updatedAt: new Date().toISOString(),
    }

    window.localStorage.setItem(targetKey, JSON.stringify(payload))
    return true
  } catch (err) {
    console.warn('[QuizStorage] Gagal menyimpan draf kuis:', err)
    return false
  }
}

/**
 * Menghapus draf kuis tertentu (misalnya setelah kuis berhasil disubmit atau diulang).
 */
export function clearQuizDraft({
  userOrId,
  moduleId,
  questionVersion = TEACHER_CONFIG.activeQuestionVersion,
}) {
  if (typeof window === 'undefined' || !window.localStorage) return
  const targetKey = getQuizDraftKey(userOrId, moduleId, questionVersion)
  try {
    window.localStorage.removeItem(targetKey)
    // Bersihkan juga draf lama unowned jika ada untuk modul ini
    if (moduleId) {
      window.localStorage.removeItem(`quiz_${moduleId}`)
      window.localStorage.removeItem(`quiz-${moduleId}`)
    }
  } catch {}
}

/**
 * Membersihkan seluruh draf kuis milik sesi tamu.
 * Dipanggil saat logout atau inisialisasi login baru.
 */
export function clearGuestQuizDrafts() {
  if (typeof window === 'undefined' || !window.localStorage) return
  try {
    const keysToRemove = []
    for (let i = 0; i < window.localStorage.length; i++) {
      const key = window.localStorage.key(i)
      if (key && (key.startsWith('quiz_guest') || key.includes('_guest_') || key.includes('_guest-'))) {
        keysToRemove.push(key)
      }
    }
    keysToRemove.forEach((k) => window.localStorage.removeItem(k))
  } catch {}
}

/**
 * Membersihkan draf kuis lama tanpa namespace (quiz_${moduleId} atau quiz-${moduleId}).
 * Menjamin draf lama tak bertuan tidak mengontaminasi sesi mana pun.
 */
export function clearLegacyQuizDrafts() {
  if (typeof window === 'undefined' || !window.localStorage) return
  try {
    const keysToRemove = []
    for (let i = 0; i < window.localStorage.length; i++) {
      const key = window.localStorage.key(i)
      if (key && (key.startsWith('quiz_modul-') || key.startsWith('quiz-modul-'))) {
        // Hanya hapus jika formatnya adalah format lama tanpa namespace user_ atau guest_
        if (!key.includes('_user_') && !key.includes('_guest_') && !key.includes('_guest-')) {
          keysToRemove.push(key)
        }
      }
    }
    keysToRemove.forEach((k) => window.localStorage.removeItem(k))
  } catch {}
}

/**
 * Wrapper backward-compatible untuk fungsi lama getSavedQuizState(moduleId)
 */
export function getSavedQuizState(moduleId, userOrId = null, questionVersion = null) {
  const result = getSavedQuizDraft({
    moduleId,
    userOrId,
    questionVersion: questionVersion || TEACHER_CONFIG.activeQuestionVersion,
  })
  if (!result) return null
  return {
    questionIndex: result.questionIndex,
    answers: result.answers,
    userAnswers: result.answersMap,
    finished: result.finished,
    questionVersion: result.questionVersion,
  }
}
