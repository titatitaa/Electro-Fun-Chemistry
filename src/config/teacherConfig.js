/**
 * Konfigurasi Akun Guru, Kode Kelas, dan Aturan Evaluasi
 * Media Pembelajaran ElectroFun Chemistry — Kimia SMA Kelas X
 */

export const TEACHER_CONFIG = {
  // Daftar email resmi yang memiliki hak akses role: 'teacher'
  teacherEmails: [
    'guru.kimia@electrolab.id',
    'guru@electrofun.id',
    'guru.kimia@gmail.com',
  ],

  // Kode kelas default untuk pembelajaran elektrokimia
  defaultClassCode: 'KIMIA-X1',
  defaultClassName: 'Kimia Fase E - X1',

  // Kriteria Ketuntasan Minimal (KKM) default (dapat disesuaikan di UI oleh guru)
  defaultKKM: 75,

  // Versi soal resmi aktif
  activeQuestionVersion: 'v1.0',

  // Aturan percobaan default untuk rekapitulasi nilai dan analisis butir soal
  // 'latest' = Percobaan Terakhir (Rekomendasi pedagogis setelah membaca pembahasan)
  // 'highest' = Nilai Tertinggi
  // 'first' = Percobaan Pertama / Diagnostik
  defaultTrialRule: 'latest',
}

/**
 * Memeriksa apakah sebuah email berhak mendapatkan role teacher
 * @param {string} email
 * @returns {boolean}
 */
export function isAuthorizedTeacherEmail(email) {
  if (!email || typeof email !== 'string') return false
  const normalized = email.trim().toLowerCase()
  return TEACHER_CONFIG.teacherEmails.includes(normalized)
}

/**
 * Validasi apakah sebuah kode kelas valid
 * @param {string} code
 * @returns {boolean}
 */
export function isValidClassCode(code) {
  if (!code || typeof code !== 'string') return false
  return code.trim().toUpperCase() === TEACHER_CONFIG.defaultClassCode
}

