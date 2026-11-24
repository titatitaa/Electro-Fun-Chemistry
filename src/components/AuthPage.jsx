import { useState } from 'react'
import {
  createGuestUser,
  loginUser,
  registerUser,
  requestPasswordReset,
  resetPassword,
} from '../auth.js'
import './AuthPage.css'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const USERNAME_PATTERN = /^[a-zA-Z0-9._-]{3,24}$/

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

function Field({
  label,
  id,
  type = 'text',
  value,
  onChange,
  placeholder,
  autoComplete,
  error,
  children,
  ...props
}) {
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

export default function AuthPage({ onAuthenticated, onPasswordReset, initialError = '' }) {
  const resetToken =
    new URLSearchParams(window.location.search).get('oobCode') ||
    new URLSearchParams(window.location.search).get('reset') ||
    ''
  const [mode, setMode] = useState(resetToken ? 'reset' : 'login')
  const [form, setForm] = useState({
    name: '',
    email: '',
    username: '',
    identifier: '',
    className: '',
    school: '',
    password: '',
    confirmPassword: '',
  })
  const [remember, setRemember] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(initialError)
  const [successMessage, setSuccessMessage] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})

  const isRegister = mode === 'register'
  const isForgot = mode === 'forgot'
  const isReset = mode === 'reset'

  const updateField = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
    setFieldErrors((current) => ({ ...current, [name]: '' }))
    setMessage('')
    setSuccessMessage('')
  }

  const validate = () => {
    const errors = {}
    if (isRegister && !String(form.name || '').trim()) errors.name = 'Nama lengkap wajib diisi.'
    if (mode === 'login' && !String(form.identifier || '').trim()) errors.identifier = 'Email atau username wajib diisi.'
    if ((isRegister || isForgot) && !String(form.email || '').trim()) errors.email = 'Email wajib diisi.'
    else if ((isRegister || isForgot) && !EMAIL_PATTERN.test(String(form.email || '').trim())) {
      errors.email = 'Masukkan alamat email yang valid.'
    }
    if (isRegister && !USERNAME_PATTERN.test(String(form.username || ''))) {
      errors.username = 'Username 3–24 karakter: huruf, angka, titik, garis bawah, atau tanda hubung.'
    }
    if (isRegister && !String(form.className || '').trim()) errors.className = 'Kelas wajib diisi.'
    if (isRegister || isReset) {
      if (!form.password || form.password.length < 6 || form.password.length > 128) {
        errors.password = 'Gunakan password 6–128 karakter.'
      }
      if (form.confirmPassword !== form.password) errors.confirmPassword = 'Konfirmasi password tidak sama.'
    }
    if (mode === 'login' && !form.password) errors.password = 'Password wajib diisi.'
    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setMessage('')
    setSuccessMessage('')
    if (!validate()) return

    setLoading(true)
    try {
      if (mode === 'login') {
        const user = await loginUser({ identifier: form.identifier, password: form.password, remember })
        const welcome = user.role === 'teacher'
          ? `Selamat datang di Panel Guru, ${user.name}!`
          : `Berhasil masuk. Selamat belajar, ${user.name}!`
        onAuthenticated(user, welcome)
      } else if (isRegister) {
        const user = await registerUser(form)
        const welcome = user.role === 'teacher'
          ? 'Akun Guru Pengajar berhasil dibuat! Akses Panel Guru telah diaktifkan.'
          : `Akun siswa berhasil dibuat. Selamat belajar, ${user.name}!`
        onAuthenticated(user, welcome)
      } else if (isForgot) {
        await requestPasswordReset(form.email.trim())
        setSuccessMessage('Instruksi pemulihan kata sandi telah dikirim ke email Anda.')
      } else {
        await resetPassword({
          token: resetToken,
          password: form.password,
          confirmPassword: form.confirmPassword,
        })
        window.history.replaceState({}, '', window.location.pathname)
        setMode('login')
        setForm((current) => ({ ...current, password: '', confirmPassword: '' }))
        setSuccessMessage('Password berhasil diperbarui. Silakan login kembali.')
        onPasswordReset?.()
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Terjadi kesalahan. Silakan coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  const switchMode = (nextMode) => {
    setMode(nextMode)
    setFieldErrors({})
    setMessage('')
    setSuccessMessage('')
  }

  const handleGuestLogin = () => {
    try {
      onAuthenticated(createGuestUser(), 'Mode Tamu aktif. Materi dan kuis publik tersedia; hasil kuis tidak disimpan.')
    } catch {
      setMessage('Mode tamu tidak dapat dimulai di browser ini.')
    }
  }

  const title = isRegister
    ? 'Buat akun siswa'
    : isForgot
      ? 'Pulihkan akun'
      : isReset
        ? 'Buat password baru'
        : 'Selamat Datang Kembali!'

  return (
    <main className="auth-page">
      <div className="auth-shell">
        <section className="auth-visual" aria-label="Pengenalan Chemistry Lab">
          <div className="visual-image" />
          <div className="visual-grain" />
          <header className="visual-brand">
            <span className="brand-mark"><FlaskMark /></span>
            <span className="brand-name">CHEMISTRY <b>LAB</b><small>RUANG EKSPERIMEN RASA INGIN TAHU</small></span>
          </header>

          <div className="visual-copy">
            <span className="eyebrow"><span /> LAB PEMBELAJARAN • FASE E</span>
            <h1>Explore Chemistry<br />Beyond the <em>Classroom.</em></h1>
            <p>Kenali dunia larutan elektrolit dan non-elektrolit lewat eksperimen virtual, visualisasi ion, dan tantangan interaktif.</p>
            <div className="visual-tags" aria-label="Topik pembelajaran">
              <span>01 <i /> Kenali ion</span>
              <span>02 <i /> Uji daya hantar</span>
            </div>
          </div>

          <div className="floating-formula formula-one" aria-hidden="true">Na⁺ <span>+</span> Cl⁻</div>
          <div className="floating-formula formula-two" aria-hidden="true">H₂O</div>
          <div className="visual-caption">
            <span className="caption-dot" />
            <span>LAB 01 <b>•</b> Larutan &amp; daya hantar listrik</span>
            <span className="caption-line" />
            <span>01 / 03</span>
          </div>
        </section>

        <section className="auth-panel" aria-labelledby="auth-title">
          <div className="mobile-brand">
            <span className="brand-mark"><FlaskMark /></span>
            <span className="brand-name">CHEMISTRY <b>LAB</b></span>
          </div>
          <div className="form-content">
            <span className="form-kicker">
              {isRegister ? 'MULAI PETUALANGANMU' : isForgot || isReset ? 'BANTUAN AKUN' : 'SENANG BERTEMU KEMBALI'}
            </span>
            <h2 id="auth-title">{title}</h2>
            <p className="form-subtitle">
              {isRegister
                ? 'Daftar sebagai siswa untuk menyimpan hasil belajar pada akunmu.'
                : isForgot
                  ? 'Masukkan email akunmu. Tautan pemulihan hanya dikirim jika layanan email tersedia.'
                  : isReset
                    ? 'Pilih password baru yang berbeda dan mudah kamu ingat.'
                    : 'Masuk untuk memulai pengalaman belajar kimia yang lebih interaktif.'}
            </p>

            <form onSubmit={handleSubmit} noValidate>
              {isRegister && (
                <>
                  <Field label="Nama lengkap" id="name" value={form.name} onChange={updateField}
                    placeholder="Nama yang biasa kamu gunakan" autoComplete="name" error={fieldErrors.name} maxLength={80} />
                  <Field label="Email aktif" id="email" type="email" value={form.email} onChange={updateField}
                    placeholder="nama@email.com" autoComplete="email" error={fieldErrors.email} maxLength={254} />
                  <Field label="Username" id="username" value={form.username} onChange={updateField}
                    placeholder="Contoh: siswa.kimia10" autoComplete="username" error={fieldErrors.username} maxLength={24} />
                  <div className="auth-register-row">
                    <Field label="Kelas Asal di Sekolah (Rombel)" id="className" value={form.className} onChange={updateField}
                      placeholder="Contoh: X-1 atau X MIPA" autoComplete="off" error={fieldErrors.className} maxLength={40} />
                    <Field label="Asal sekolah (opsional)" id="school" value={form.school} onChange={updateField}
                      placeholder="Nama sekolah" autoComplete="organization" maxLength={120} />
                  </div>
                </>
              )}
              {isForgot && (
                <Field label="Email akun" id="email" type="email" value={form.email} onChange={updateField}
                  placeholder="nama@email.com" autoComplete="email" error={fieldErrors.email} maxLength={254} />
              )}
              {mode === 'login' && (
                <Field label="Email atau username" id="identifier" value={form.identifier || ''} onChange={updateField}
                  placeholder="nama@email.com atau username" autoComplete="username" error={fieldErrors.identifier} maxLength={254} />
              )}
              {(mode === 'login' || isRegister || isReset) && (
                <>
                  <Field label={isReset ? 'Password baru' : 'Password'} id="password"
                    type={showPassword ? 'text' : 'password'} value={form.password} onChange={updateField}
                    placeholder={isRegister || isReset ? 'Minimal 10 karakter' : 'Masukkan password'}
                    autoComplete={isReset || isRegister ? 'new-password' : 'current-password'}
                    error={fieldErrors.password} maxLength={128}>
                    <button type="button" className="password-toggle" onClick={() => setShowPassword((visible) => !visible)}
                      aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}>
                      <EyeIcon visible={showPassword} />
                    </button>
                  </Field>
                  {(isRegister || isReset) && (
                    <Field label="Konfirmasi password" id="confirmPassword"
                      type={showPassword ? 'text' : 'password'} value={form.confirmPassword} onChange={updateField}
                      placeholder="Ketik ulang password" autoComplete="new-password" error={fieldErrors.confirmPassword}
                      maxLength={128} />
                  )}
                </>
              )}
              {mode === 'login' && (
                <div className="auth-login-options">
                  <label className="remember-control">
                    <input type="checkbox" checked={remember} onChange={(event) => setRemember(event.target.checked)} />
                    <span className="custom-checkbox" aria-hidden="true" />
                    Ingat Saya
                  </label>
                  <button type="button" className="auth-text-link" onClick={() => switchMode('forgot')}>
                    Lupa Kata Sandi?
                  </button>
                </div>
              )}

              {message && <div className="auth-message" role="alert">{message}</div>}
              {successMessage && <div className="auth-success" role="status">{successMessage}</div>}

              <button className="auth-submit" type="submit" disabled={loading}>
                {loading
                  ? <><span className="button-spinner" /> Memproses...</>
                  : <><span className="auth-submit-label">
                    {isRegister ? 'Daftar sebagai Siswa' : isForgot ? 'Kirim Tautan Pemulihan' : isReset ? 'Simpan Password Baru' : 'Masuk'}
                  </span><span className="auth-submit-icon" aria-hidden="true">↗</span></>}
              </button>
            </form>

            {mode === 'login' && (
              <>
                <div className="auth-divider"><span>atau lanjutkan tanpa akun</span></div>
                <button type="button" className="auth-guest" onClick={handleGuestLogin}>
                  Masuk sebagai Tamu <span aria-hidden="true">→</span>
                </button>
                <p className="auth-guest-note">Materi dan kuis publik tersedia. Hasil belajar tidak disimpan ke akun.</p>
              </>
            )}

            <div className="auth-switch">
              {isRegister
                ? <>Sudah memiliki akun? <button type="button" onClick={() => switchMode('login')}>Masuk sekarang</button></>
                : isForgot || isReset
                  ? <button type="button" onClick={() => switchMode('login')}>← Kembali ke Login</button>
                  : <>Belum memiliki akun? <button type="button" onClick={() => switchMode('register')}>Daftar Sekarang</button></>}
            </div>
            <p className="prototype-note"><span aria-hidden="true">🔒</span> Password di-hash di server; sesi dilindungi cookie HttpOnly.</p>
          </div>
          <footer className="auth-footer"><span>© 2026 CHEMISTRY LAB</span><span>Dibuat untuk pembelajar masa depan.</span></footer>
        </section>
      </div>
    </main>
  )
}
