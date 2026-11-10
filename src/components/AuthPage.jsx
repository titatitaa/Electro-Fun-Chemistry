import { useState } from 'react'
import { loginUser, registerUser, loginAsGuest, sendPasswordReset } from '../auth.js'
import './AuthPage.css'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const USERNAME_PATTERN = /^[a-zA-Z0-9._-]{3,30}$/

function FlaskMark() {
  return (
    <svg viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <rect width="40" height="40" rx="13" fill="currentColor" />
      <path d="M16 8h8M17 8v9l-7 12a2 2 0 0 0 1.7 3h16.6a2 2 0 0 0 1.7-3l-7-12V8" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M13.5 26h13M19 21l2 2 3-4" stroke="#E8B967" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function EyeIcon({ visible }) {
  return visible ? (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M3 3l18 18M10.6 10.6a2 2 0 0 0 2.8 2.8M9.9 5.2A10.7 10.7 0 0 1 12 5c5.2 0 8.7 5.2 9.5 6.5a1 1 0 0 1 0 1c-.4.7-1.4 2-2.9 3.3M6.2 6.2c-1.9 1.3-3.1 3.3-3.7 4.3a1 1 0 0 0 0 1c.8 1.3 4.3 6.5 9.5 6.5 1 0 1.9-.2 2.8-.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M2.5 12s3.5-6.5 9.5-6.5 9.5 6.5 9.5 6.5-3.5 6.5-9.5 6.5S2.5 12 2.5 12Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="2.7" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  )
}

function Field({ label, id, type = 'text', value, onChange, placeholder, autoComplete, error, children, ...props }) {
  return (
    <div className={`auth-field${error ? ' has-error' : ''}`}>
      <label htmlFor={id}>{label}</label>
      <div className="auth-input-wrap">
        <input
          id={id}
          name={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          {...props}
        />
        {children}
      </div>
      {error && <span className="field-error" id={`${id}-error`}>{error}</span>}
    </div>
  )
}

export default function AuthPage({ onAuthenticated, initialError }) {
  // Mode: 'login' | 'register' | 'forgot'
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState({
    name: '',
    username: '',
    email: '',
    identifier: '', // Email atau Username pada login
    className: 'X-1',
    password: '',
    confirmPassword: '',
    adminCode: ''
  })
  const [isTeacherSignup, setIsTeacherSignup] = useState(false)
  const [remember, setRemember] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(initialError || '')
  const [messageType, setMessageType] = useState('error') // 'error' | 'success'
  const [fieldErrors, setFieldErrors] = useState({})

  const isRegister = mode === 'register'
  const isForgot = mode === 'forgot'

  const updateField = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
    setFieldErrors((current) => ({ ...current, [name]: '' }))
    setMessage('')
  }

  const validate = () => {
    const errors = {}

    if (isForgot) {
      if (!form.email.trim()) errors.email = 'Alamat email wajib diisi.'
      else if (!EMAIL_PATTERN.test(form.email.trim())) errors.email = 'Masukkan format email yang valid.'
      setFieldErrors(errors)
      return Object.keys(errors).length === 0
    }

    if (isRegister) {
      if (!form.name.trim()) errors.name = 'Nama lengkap wajib diisi.'
      if (!form.username.trim()) {
        errors.username = 'Username wajib diisi.'
      } else if (!USERNAME_PATTERN.test(form.username.trim())) {
        errors.username = 'Gunakan 3-30 karakter (huruf, angka, titik, atau garis bawah).'
      }
      if (!form.email.trim()) errors.email = 'Alamat email aktif wajib diisi.'
      else if (!EMAIL_PATTERN.test(form.email.trim())) errors.email = 'Masukkan format email yang valid.'
      if (!form.password) errors.password = 'Password wajib diisi.'
      else if (form.password.length < 8) errors.password = 'Gunakan minimal 8 karakter.'
      if (form.password !== form.confirmPassword) {
        errors.confirmPassword = 'Konfirmasi password tidak sesuai.'
      }
      if (!isTeacherSignup && !form.className) errors.className = 'Pilih atau masukkan kelasmu.'
    } else {
      // Login validation
      if (!form.identifier.trim()) errors.identifier = 'Masukkan email atau username Anda.'
      if (!form.password) errors.password = 'Password wajib diisi.'
    }

    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Handle Login & Register submit
  const handleSubmit = async (event) => {
    event.preventDefault()
    setMessage('')
    if (!validate()) return

    setLoading(true)

    try {
      if (isForgot) {
        // Alur Lupa Password
        const result = await sendPasswordReset(form.email)
        setMessageType('success')
        setMessage(result.message)
        setLoading(false)
        return
      }

      let user
      if (isRegister) {
        // Alur Pendaftaran Akun Siswa atau Guru
        user = await registerUser({
          name: form.name,
          username: form.username,
          email: form.email,
          className: isTeacherSignup ? 'Guru Pengajar' : form.className,
          password: form.password,
          adminCode: isTeacherSignup ? form.adminCode : ''
        })

        const roleText = user.role === 'teacher' ? 'Guru' : 'Siswa'
        onAuthenticated(
          user,
          `Akun ${roleText} berhasil dibuat! Selamat datang di ElectroFun Chemistry, ${user.name}.`
        )
      } else {
        // Alur Masuk (Email atau Username)
        user = await loginUser({
          identifier: form.identifier,
          password: form.password,
          remember
        })

        const roleGreeting = user.role === 'teacher' ? 'Bapak/Ibu Guru' : 'Siswa'
        onAuthenticated(user, `Selamat datang kembali, ${user.name}! (${roleGreeting})`)
      }
    } catch (error) {
      setMessageType('error')
      setMessage(error instanceof Error ? error.message : 'Terjadi kesalahan. Silakan coba lagi.')
      setLoading(false)
    }
  }

  // Handle Masuk sebagai Tamu (Guest)
  const handleGuestLogin = () => {
    try {
      const guest = loginAsGuest()
      onAuthenticated(
        guest,
        'Masuk sebagai akun Tamu. Anda dapat mengakses seluruh materi dan kuis secara lokal di perangkat ini.'
      )
    } catch (err) {
      setMessageType('error')
      setMessage('Gagal mengaktifkan sesi tamu. Silakan muat ulang halaman.')
    }
  }

  const switchMode = (newMode) => {
    setMode(newMode)
    setFieldErrors({})
    setMessage('')
    setMessageType('error')
  }

  return (
    <main className="auth-page">
      <div className="auth-shell">
        <section className="auth-visual" aria-label="Pengenalan Chemistry Lab">
          <div className="visual-image" />
          <div className="visual-grain" />
          <header className="visual-brand">
            <span className="brand-mark"><FlaskMark /></span>
            <span className="brand-name">ELECTROFUN <b>CHEMISTRY</b><small>RUANG EKSPERIMEN LARUTAN ELEKTROLIT</small></span>
          </header>

          <div className="visual-copy">
            <span className="eyebrow"><span /> MEDIA PEMBELAJARAN KIMIA • SMA FASE E</span>
            <h1>Explore Chemistry<br />Beyond the <em>Classroom.</em></h1>
            <p>Jelajahi dunia larutan elektrolit dan non-elektrolit melalui simulasi alat uji interaktif, model ion mikroskopik, dan evaluasi konsep bermakna.</p>
            <div className="visual-tags" aria-label="Topik pembelajaran">
              <span>01 <i /> Kenali Ion</span>
              <span>02 <i /> Uji Daya Hantar</span>
              <span>03 <i /> Virtual Lab</span>
            </div>
          </div>

          <div className="floating-formula formula-one" aria-hidden="true">Na⁺ <span>+</span> Cl⁻</div>
          <div className="floating-formula formula-two" aria-hidden="true">H₂O</div>
          <div className="visual-caption">
            <span className="caption-dot" />
            <span>KIMIA X <b>•</b> Larutan Elektrolit &amp; Non-Elektrolit</span>
            <span className="caption-line" />
            <span>01 / 03</span>
          </div>
        </section>

        <section className="auth-panel" aria-labelledby="auth-title">
          <div className="mobile-brand">
            <span className="brand-mark"><FlaskMark /></span>
            <span className="brand-name">ELECTROFUN <b>CHEMISTRY</b></span>
          </div>

          <div className="form-content">
            <span className="form-kicker">
              {isForgot
                ? 'PEMULIHAN KATA SANDI'
                : isRegister
                ? 'PENDAFTARAN SISWA'
                : 'SENANG BERTEMU KEMBALI'}
            </span>

            <h2 id="auth-title">
              {isForgot
                ? 'Lupa Kata Sandi'
                : isRegister
                ? 'Buat Akun Siswa Baru'
                : 'Selamat Datang Kembali!'}
            </h2>

            <p className="form-subtitle">
              {isForgot
                ? 'Masukkan email yang terdaftar untuk menerima tautan pemulihan kata sandi.'
                : isRegister
                ? 'Lengkapi identitasmu untuk menyimpan progres belajar dan bergabung ke kelas.'
                : 'Masuk dengan email atau username untuk mengakses dashboard pembelajaranmu.'}
            </p>

            <form onSubmit={handleSubmit} noValidate>
              {/* FORM MODE: FORGOT PASSWORD */}
              {isForgot && (
                <>
                  <Field
                    label="Email Terdaftar"
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={updateField}
                    placeholder="nama@email.com"
                    autoComplete="email"
                    error={fieldErrors.email}
                  />

                  {message && (
                    <div className={`auth-message ${messageType}`} role="alert">
                      {message}
                    </div>
                  )}

                  <button className="auth-submit" type="submit" disabled={loading}>
                    {loading
                      ? <><span className="button-spinner" /> Mengirim tautan...</>
                      : <><span className="auth-submit-label">Kirim Tautan Reset Password</span><span className="auth-submit-icon" aria-hidden="true">✉</span></>}
                  </button>

                  <div className="auth-switch" style={{ marginTop: '1.25rem' }}>
                    <button type="button" onClick={() => switchMode('login')}>
                      ← Kembali ke Halaman Masuk
                    </button>
                  </div>
                </>
              )}

              {/* FORM MODE: SIGN UP (REGISTER) */}
              {isRegister && (
                <>
                  <Field
                    label="Nama Lengkap"
                    id="name"
                    value={form.name}
                    onChange={updateField}
                    placeholder="Nama lengkap siswa"
                    autoComplete="name"
                    error={fieldErrors.name}
                    maxLength={80}
                  />

                  <Field
                    label="Username"
                    id="username"
                    value={form.username}
                    onChange={updateField}
                    placeholder="Contoh: zaenafirda"
                    autoComplete="username"
                    error={fieldErrors.username}
                    maxLength={30}
                  />

                  <Field
                    label="Email Aktif"
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={updateField}
                    placeholder="nama@email.com"
                    autoComplete="email"
                    error={fieldErrors.email}
                  />

                  {!isTeacherSignup && (
                    <Field
                      label="Kelas"
                      id="className"
                      value={form.className}
                      onChange={updateField}
                      placeholder="Contoh: X-1, X-A, atau X MIPA"
                      autoComplete="off"
                      error={fieldErrors.className}
                      maxLength={30}
                    />
                  )}

                  <Field
                    label="Password"
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={form.password}
                    onChange={updateField}
                    placeholder="Minimal 8 karakter"
                    autoComplete="new-password"
                    error={fieldErrors.password}
                  >
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowPassword((visible) => !visible)}
                      aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                    >
                      <EyeIcon visible={showPassword} />
                    </button>
                  </Field>

                  <Field
                    label="Konfirmasi Password"
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={form.confirmPassword}
                    onChange={updateField}
                    placeholder="Ulangi password di atas"
                    autoComplete="new-password"
                    error={fieldErrors.confirmPassword}
                  >
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowConfirmPassword((visible) => !visible)}
                      aria-label={showConfirmPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                    >
                      <EyeIcon visible={showConfirmPassword} />
                    </button>
                  </Field>

                  {/* Opsi Khusus Penetapan Akun Guru via Kode Administrator */}
                  <div className="teacher-role-box">
                    <label className="teacher-toggle-label">
                      <input
                        type="checkbox"
                        checked={isTeacherSignup}
                        onChange={(e) => setIsTeacherSignup(e.target.checked)}
                      />
                      <span>Daftar sebagai Guru / Administrator</span>
                    </label>

                    {isTeacherSignup && (
                      <div className="teacher-code-input-wrap">
                        <Field
                          label="Kode Verifikasi Guru / Admin"
                          id="adminCode"
                          type="password"
                          value={form.adminCode}
                          onChange={updateField}
                          placeholder="Masukkan kode resmi administrator"
                          autoComplete="off"
                        />
                        <small className="field-hint">
                          Akun guru hanya dapat ditetapkan melalui administrator.
                        </small>
                      </div>
                    )}
                  </div>

                  {message && (
                    <div className={`auth-message ${messageType}`} role="alert">
                      {message}
                    </div>
                  )}

                  <button className="auth-submit" type="submit" disabled={loading}>
                    {loading
                      ? <><span className="button-spinner" /> Mendaftarkan akun...</>
                      : <><span className="auth-submit-label">Buat Akun &amp; Mulai</span><span className="auth-submit-icon" aria-hidden="true">↗</span></>}
                  </button>

                  <div className="auth-switch">
                    Sudah memiliki akun?
                    <button type="button" onClick={() => switchMode('login')}>Masuk Sekarang</button>
                  </div>
                </>
              )}

              {/* FORM MODE: LOGIN */}
              {!isRegister && !isForgot && (
                <>
                  <Field
                    label="Email atau Username"
                    id="identifier"
                    value={form.identifier}
                    onChange={updateField}
                    placeholder="nama@email.com atau username"
                    autoComplete="username"
                    error={fieldErrors.identifier}
                  />

                  <Field
                    label="Password"
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={form.password}
                    onChange={updateField}
                    placeholder="Masukkan kata sandi akunmu"
                    autoComplete="current-password"
                    error={fieldErrors.password}
                  >
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowPassword((visible) => !visible)}
                      aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                    >
                      <EyeIcon visible={showPassword} />
                    </button>
                  </Field>

                  <div className="auth-options-row">
                    <label className="remember-control">
                      <input
                        type="checkbox"
                        checked={remember}
                        onChange={(event) => setRemember(event.target.checked)}
                      />
                      <span className="custom-checkbox" aria-hidden="true" />
                      Ingat Saya
                    </label>

                    <button
                      type="button"
                      className="forgot-password-link"
                      onClick={() => switchMode('forgot')}
                    >
                      Lupa Password?
                    </button>
                  </div>

                  {message && (
                    <div className={`auth-message ${messageType}`} role="alert">
                      {message}
                    </div>
                  )}

                  <button className="auth-submit" type="submit" disabled={loading}>
                    {loading
                      ? <><span className="button-spinner" /> Memverifikasi...</>
                      : <><span className="auth-submit-label">Masuk ke Pembelajaran</span><span className="auth-submit-icon" aria-hidden="true">↗</span></>}
                  </button>

                  {/* PEMBATAS & TOMBOL LOGIN AS GUEST */}
                  <div className="auth-divider">
                    <span>atau eksplorasi tanpa akun</span>
                  </div>

                  <button
                    type="button"
                    className="auth-guest-btn"
                    onClick={handleGuestLogin}
                    title="Masuk sebagai tamu tanpa membuat akun"
                  >
                    <span className="guest-icon" aria-hidden="true">👤</span>
                    <span>Masuk sebagai Tamu (Guest)</span>
                  </button>

                  <div className="auth-switch">
                    Belum memiliki akun?
                    <button type="button" onClick={() => switchMode('register')}>Daftar Sekarang</button>
                  </div>
                </>
              )}
            </form>

            <p className="prototype-note">
              <span aria-hidden="true">🔒</span> Sistem akun aman dengan Firebase Auth &amp; Cloud Firestore.
            </p>
          </div>

          <footer className="auth-footer">
            <span>© 2026 ELECTROFUN CHEMISTRY</span>
            <span>Materi Larutan Elektrolit &amp; Non-Elektrolit</span>
          </footer>
        </section>
      </div>
    </main>
  )
}
