import { randomBytes, createHash } from 'node:crypto'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import bcrypt from 'bcryptjs'
import express from 'express'
import { rateLimit } from 'express-rate-limit'
import helmet from 'helmet'
import nodemailer from 'nodemailer'
import { createDatabase, publicUser } from './database.js'

const SESSION_COOKIE = 'chemistry_session'
const SESSION_DURATION = 12 * 60 * 60 * 1000
const REMEMBERED_SESSION_DURATION = 30 * 24 * 60 * 60 * 1000
const RESET_TOKEN_DURATION = 30 * 60 * 1000
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const USERNAME_PATTERN = /^[a-zA-Z0-9._-]{3,24}$/
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.resolve(__dirname, '..')

function hashToken(token) {
  return createHash('sha256').update(token).digest('hex')
}

function sameOrigin(req) {
  const origin = req.get('origin')
  if (!origin) return true

  const configuredOrigin = process.env.APP_ORIGIN
  if (configuredOrigin) return origin === configuredOrigin

  try {
    return new URL(origin).host === req.get('host')
  } catch {
    return false
  }
}

function makeMailer() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD, SMTP_FROM } = process.env
  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASSWORD || !SMTP_FROM) return null

  return {
    from: SMTP_FROM,
    transport: nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT),
      secure: Number(SMTP_PORT) === 465,
      auth: { user: SMTP_USER, pass: SMTP_PASSWORD },
    }),
  }
}

function createLimit(windowMs, limit) {
  return rateLimit({
    windowMs,
    limit,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: { error: 'Terlalu banyak percobaan. Coba lagi beberapa saat.' },
  })
}

export function createApp({
  db = createDatabase(),
  mailer = makeMailer(),
  serveFrontend = false,
} = {}) {
  const app = express()
  app.disable('x-powered-by')
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        baseUri: ["'self'"],
        connectSrc: ["'self'"],
        fontSrc: ["'self'", 'https://fonts.gstatic.com'],
        formAction: ["'self'"],
        frameAncestors: ["'none'"],
        imgSrc: ["'self'", 'data:', 'https://images.unsplash.com'],
        objectSrc: ["'none'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        upgradeInsecureRequests: process.env.NODE_ENV === 'production' ? [] : null,
      },
    },
    referrerPolicy: { policy: 'no-referrer' },
  }))
  app.use(express.json({ limit: '20kb' }))

  app.use('/api', (req, res, next) => {
    if (!sameOrigin(req)) return res.status(403).json({ error: 'Permintaan lintas situs ditolak.' })
    next()
  })

  const loginLimiter = createLimit(15 * 60 * 1000, 8)
  const registerLimiter = createLimit(60 * 60 * 1000, 5)
  const recoveryLimiter = createLimit(60 * 60 * 1000, 4)

  function getSession(req) {
    const token = req.cookies?.[SESSION_COOKIE]
    if (!token || typeof token !== 'string') return null

    const session = db.prepare(`
      SELECT users.*, sessions.token_hash
      FROM sessions
      JOIN users ON users.id = sessions.user_id
      WHERE sessions.token_hash = ? AND sessions.expires_at > ?
    `).get(hashToken(token), Date.now())

    return session || null
  }

  function requireUser(req, res, next) {
    const user = getSession(req)
    if (!user) return res.status(401).json({ error: 'Sesi berakhir. Silakan masuk kembali.' })
    req.user = user
    next()
  }

  function requireRole(...roles) {
    return (req, res, next) => {
      if (!req.user || !roles.includes(req.user.role)) {
        return res.status(403).json({ error: 'Akses ini memerlukan akun dengan izin yang sesuai.' })
      }
      next()
    }
  }

  function issueSession(req, res, user, remember = false) {
    const token = randomBytes(32).toString('base64url')
    const duration = remember ? REMEMBERED_SESSION_DURATION : SESSION_DURATION
    db.prepare('DELETE FROM sessions WHERE user_id = ? OR expires_at <= ?').run(user.id, Date.now())
    db.prepare('INSERT INTO sessions (token_hash, user_id, expires_at) VALUES (?, ?, ?)')
      .run(hashToken(token), user.id, Date.now() + duration)
    res.cookie(SESSION_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      ...(remember ? { maxAge: duration } : {}),
    })
    return publicUser(user)
  }

  app.use((req, _res, next) => {
    const cookieHeader = req.get('cookie') || ''
    const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${SESSION_COOKIE}=([^;]+)`))
    req.cookies = match ? { [SESSION_COOKIE]: decodeURIComponent(match[1]) } : {}
    next()
  })

  app.get('/api/session', (req, res) => {
    db.prepare('DELETE FROM sessions WHERE expires_at <= ?').run(Date.now())
    const user = getSession(req)
    res.json({ user: user ? publicUser(user) : null })
  })

  app.post('/api/auth/register', registerLimiter, async (req, res, next) => {
    const { name, email, username, password, confirmPassword, className, school = '' } = req.body || {}
    if (typeof name !== 'string' || name.trim().length < 2 || name.trim().length > 80) {
      return res.status(400).json({ error: 'Nama lengkap harus berisi 2–80 karakter.' })
    }
    if (typeof email !== 'string' || !EMAIL_PATTERN.test(email.trim()) || email.length > 254) {
      return res.status(400).json({ error: 'Masukkan alamat email yang valid.' })
    }
    if (typeof username !== 'string' || !USERNAME_PATTERN.test(username)) {
      return res.status(400).json({ error: 'Username harus 3–24 karakter: huruf, angka, titik, garis bawah, atau tanda hubung.' })
    }
    if (typeof password !== 'string' || password.length < 10 || password.length > 128) {
      return res.status(400).json({ error: 'Password harus terdiri dari 10–128 karakter.' })
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'Konfirmasi password tidak sama.' })
    }
    if (typeof className !== 'string' || !className.trim() || className.trim().length > 40) {
      return res.status(400).json({ error: 'Masukkan kelas dengan benar.' })
    }
    if (typeof school !== 'string' || school.length > 120) {
      return res.status(400).json({ error: 'Nama sekolah maksimal 120 karakter.' })
    }

    try {
      const passwordHash = await bcrypt.hash(password, 12)
      const result = db.prepare(`
        INSERT INTO users (full_name, email, username, password_hash, class_name, school)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(
        name.trim(),
        email.trim().toLowerCase(),
        username.trim(),
        passwordHash,
        className.trim(),
        school.trim() || null,
      )
      const user = db.prepare('SELECT * FROM users WHERE id = ?').get(result.lastInsertRowid)
      res.status(201).json({ user: issueSession(req, res, user, true) })
    } catch (error) {
      if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
        return res.status(409).json({ error: 'Email atau username sudah terdaftar.' })
      }
      next(error)
    }
  })

  app.post('/api/auth/login', loginLimiter, async (req, res, next) => {
    const { identifier, password, remember = false } = req.body || {}
    if (typeof identifier !== 'string' || typeof password !== 'string') {
      return res.status(400).json({ error: 'Masukkan email/username dan password.' })
    }
    try {
      const user = db.prepare(`
        SELECT * FROM users
        WHERE email = ? COLLATE NOCASE OR username = ? COLLATE NOCASE
      `).get(identifier.trim(), identifier.trim())
      const valid = user
        ? await bcrypt.compare(password, user.password_hash)
        : await bcrypt.compare(password, '$2b$12$4Gg8jVj7e3sjV1H0M52UFeh6Yr/SQexvTTKPejHkuOJ29c2Z8Z1Zy')
      if (!user || !valid) {
        return res.status(401).json({ error: 'Email/username atau password tidak sesuai.' })
      }
      res.json({ user: issueSession(req, res, user, remember === true) })
    } catch (error) {
      next(error)
    }
  })

  app.post('/api/auth/logout', (req, res) => {
    const token = req.cookies?.[SESSION_COOKIE]
    if (token) db.prepare('DELETE FROM sessions WHERE token_hash = ?').run(hashToken(token))
    res.clearCookie(SESSION_COOKIE, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    })
    res.status(204).end()
  })

  app.post('/api/auth/forgot-password', recoveryLimiter, async (req, res, next) => {
    if (!mailer) {
      return res.status(503).json({
        error: 'Pemulihan password belum tersedia. Administrator perlu mengonfigurasi layanan email SMTP.',
      })
    }
    const email = typeof req.body?.email === 'string' ? req.body.email.trim().toLowerCase() : ''
    if (!EMAIL_PATTERN.test(email)) return res.status(400).json({ error: 'Masukkan alamat email yang valid.' })

    const user = db.prepare('SELECT id, email FROM users WHERE email = ? COLLATE NOCASE').get(email)
    if (user) {
      try {
        const token = randomBytes(32).toString('base64url')
        db.prepare('DELETE FROM password_reset_tokens WHERE user_id = ?').run(user.id)
        db.prepare(`
          INSERT INTO password_reset_tokens (token_hash, user_id, expires_at)
          VALUES (?, ?, ?)
        `).run(hashToken(token), user.id, Date.now() + RESET_TOKEN_DURATION)
        const origin = process.env.APP_ORIGIN || `${req.protocol}://${req.get('host')}`
        const resetUrl = new URL('/', origin)
        resetUrl.searchParams.set('reset', token)
        await mailer.transport.sendMail({
          from: mailer.from,
          to: user.email,
          subject: 'Atur ulang password Chemistry Lab',
          text: `Gunakan tautan ini dalam 30 menit untuk membuat password baru: ${resetUrl.href}\nJika Anda tidak meminta perubahan ini, abaikan email ini.`,
        })
      } catch (error) {
        next(error)
        return
      }
    }
    res.json({ message: 'Jika email terdaftar, tautan pemulihan akan dikirim.' })
  })

  app.post('/api/auth/reset-password', recoveryLimiter, async (req, res, next) => {
    const { token, password, confirmPassword } = req.body || {}
    if (typeof token !== 'string' || token.length < 32) {
      return res.status(400).json({ error: 'Tautan pemulihan tidak valid atau telah kedaluwarsa.' })
    }
    if (typeof password !== 'string' || password.length < 10 || password.length > 128) {
      return res.status(400).json({ error: 'Password harus terdiri dari 10–128 karakter.' })
    }
    if (password !== confirmPassword) return res.status(400).json({ error: 'Konfirmasi password tidak sama.' })

    try {
      const reset = db.prepare(`
        SELECT user_id FROM password_reset_tokens
        WHERE token_hash = ? AND expires_at > ? AND used_at IS NULL
      `).get(hashToken(token), Date.now())
      if (!reset) return res.status(400).json({ error: 'Tautan pemulihan tidak valid atau telah kedaluwarsa.' })

      const passwordHash = await bcrypt.hash(password, 12)
      const update = db.transaction(() => {
        db.prepare('UPDATE users SET password_hash = ? WHERE id = ?').run(passwordHash, reset.user_id)
        db.prepare("UPDATE password_reset_tokens SET used_at = datetime('now') WHERE token_hash = ?")
          .run(hashToken(token))
        db.prepare('DELETE FROM sessions WHERE user_id = ?').run(reset.user_id)
        db.prepare('DELETE FROM password_reset_tokens WHERE user_id = ? AND token_hash != ?')
          .run(reset.user_id, hashToken(token))
      })
      update()
      res.json({ message: 'Password berhasil diperbarui. Silakan login kembali.' })
    } catch (error) {
      next(error)
    }
  })

  app.post('/api/quiz-results', requireUser, requireRole('student', 'teacher'), (req, res) => {
    const { moduleId, moduleTitle, score, total } = req.body || {}
    if (
      typeof moduleId !== 'string' || moduleId.length > 80
      || typeof moduleTitle !== 'string' || moduleTitle.length > 160
      || !Number.isInteger(score) || !Number.isInteger(total)
      || total < 1 || total > 100 || score < 0 || score > total
    ) {
      return res.status(400).json({ error: 'Hasil kuis tidak valid.' })
    }
    const result = db.prepare(`
      INSERT INTO quiz_results (student_id, module_id, module_title, score, total)
      VALUES (?, ?, ?, ?, ?)
    `).run(req.user.id, moduleId, moduleTitle, score, total)
    res.status(201).json({ id: result.lastInsertRowid })
  })

  app.get('/api/student/results', requireUser, requireRole('student'), (req, res) => {
    const results = db.prepare(`
      SELECT id, module_id AS moduleId, module_title AS moduleTitle, score, total, completed_at AS completedAt
      FROM quiz_results WHERE student_id = ? ORDER BY completed_at DESC LIMIT 100
    `).all(req.user.id)
    res.json({ results })
  })

  app.get('/api/teacher/classes', requireUser, requireRole('teacher'), (req, res) => {
    const classes = db.prepare(`
      SELECT classes.id, classes.name, COUNT(class_members.student_id) AS studentCount
      FROM classes LEFT JOIN class_members ON class_members.class_id = classes.id
      WHERE classes.teacher_id = ?
      GROUP BY classes.id ORDER BY classes.name COLLATE NOCASE
    `).all(req.user.id)
    res.json({ classes })
  })

  app.post('/api/teacher/classes', requireUser, requireRole('teacher'), (req, res) => {
    const name = typeof req.body?.name === 'string' ? req.body.name.trim() : ''
    if (!name || name.length > 80) return res.status(400).json({ error: 'Nama kelas harus 1–80 karakter.' })
    try {
      const result = db.prepare('INSERT INTO classes (name, teacher_id) VALUES (?, ?)')
        .run(name, req.user.id)
      res.status(201).json({ id: result.lastInsertRowid, name, studentCount: 0 })
    } catch (error) {
      if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
        return res.status(409).json({ error: 'Nama kelas tersebut sudah Anda gunakan.' })
      }
      throw error
    }
  })

  app.post('/api/teacher/classes/:classId/students', requireUser, requireRole('teacher'), (req, res) => {
    const classId = Number(req.params.classId)
    const username = typeof req.body?.username === 'string' ? req.body.username.trim() : ''
    const classroom = db.prepare('SELECT id FROM classes WHERE id = ? AND teacher_id = ?')
      .get(classId, req.user.id)
    if (!classroom) return res.status(404).json({ error: 'Kelas tidak ditemukan.' })
    const student = db.prepare("SELECT id FROM users WHERE username = ? COLLATE NOCASE AND role = 'student'")
      .get(username)
    if (!student) return res.status(404).json({ error: 'Siswa tidak ditemukan.' })
    try {
      db.prepare('INSERT INTO class_members (class_id, student_id) VALUES (?, ?)')
        .run(classId, student.id)
    } catch (error) {
      if (error.code === 'SQLITE_CONSTRAINT_PRIMARYKEY') {
        return res.status(409).json({ error: 'Siswa sudah terdaftar di kelas ini.' })
      }
      throw error
    }
    res.status(201).json({ message: 'Siswa ditambahkan ke kelas.' })
  })

  app.delete('/api/teacher/classes/:classId/students/:studentId', requireUser, requireRole('teacher'), (req, res) => {
    const removed = db.prepare(`
      DELETE FROM class_members
      WHERE class_id = ? AND student_id = ?
        AND class_id IN (SELECT id FROM classes WHERE teacher_id = ?)
    `).run(Number(req.params.classId), Number(req.params.studentId), req.user.id)
    if (!removed.changes) return res.status(404).json({ error: 'Keanggotaan kelas tidak ditemukan.' })
    res.status(204).end()
  })

  app.get('/api/teacher/classes/:classId/results', requireUser, requireRole('teacher'), (req, res) => {
    const classId = Number(req.params.classId)
    const classroom = db.prepare('SELECT id FROM classes WHERE id = ? AND teacher_id = ?')
      .get(classId, req.user.id)
    if (!classroom) return res.status(404).json({ error: 'Kelas tidak ditemukan.' })
    const results = db.prepare(`
      SELECT quiz_results.id, users.full_name AS studentName, users.username,
        quiz_results.module_id AS moduleId, quiz_results.module_title AS moduleTitle,
        quiz_results.score, quiz_results.total, quiz_results.completed_at AS completedAt
      FROM quiz_results
      JOIN class_members ON class_members.student_id = quiz_results.student_id
      JOIN users ON users.id = quiz_results.student_id
      WHERE class_members.class_id = ?
      ORDER BY quiz_results.completed_at DESC LIMIT 500
    `).all(classId)
    res.json({ results })
  })

  app.use('/api', (_req, res) => res.status(404).json({ error: 'Endpoint tidak ditemukan.' }))

  if (serveFrontend) {
    const distPath = path.join(projectRoot, 'dist')
    if (!existsSync(path.join(distPath, 'index.html'))) {
      throw new Error('Folder dist belum tersedia. Jalankan npm run build sebelum memulai server produksi.')
    }
    app.use(express.static(distPath, { index: false, maxAge: '1h' }))
    app.get('*', (_req, res) => res.sendFile(path.join(distPath, 'index.html')))
  }

  app.use((error, _req, res, _next) => {
    console.error('Chemistry Lab API error:', error)
    if (res.headersSent) return
    res.status(500).json({ error: 'Terjadi kesalahan server. Silakan coba lagi.' })
  })

  return { app, db }
}
