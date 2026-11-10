import { useState } from 'react'
import { loginUser, registerUser } from '../auth.js'
import './AuthPage.css'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

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
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState({ name: '', email: '', className: 'X', password: '' })
  const [remember, setRemember] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(initialError || '')
  const [fieldErrors, setFieldErrors] = useState({})

  const isRegister = mode === 'register'

  const updateField = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
    setFieldErrors((current) => ({ ...current, [name]: '' }))
    setMessage('')
  }

  const validate = () => {
    const errors = {}
    if (!form.name.trim()) errors.name = isRegister ? 'Nama lengkap wajib diisi.' : 'Nama pengguna wajib diisi.'
    if (!form.email.trim()) errors.email = 'Email wajib diisi.'
    else if (!EMAIL_PATTERN.test(form.email.trim())) errors.email = 'Masukkan alamat email yang valid.'
    if (!form.password) errors.password = 'Password wajib diisi.'
    else if (isRegister && form.password.length < 8) errors.password = 'Gunakan minimal 8 karakter.'
    if (isRegister && !form.className) errors.className = 'Pilih kelasmu.'
    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setMessage('')
    if (!validate()) return

    setLoading(true)
    await new Promise((resolve) => window.setTimeout(resolve, 550))
    try {
      let user
      if (isRegister) {
        registerUser(form)
        user = loginUser({ ...form, remember: true })
      } else {
        user = loginUser({ ...form, remember })
      }
      onAuthenticated(user, isRegister ? 'Akun berhasil dibuat. Selamat belajar!' : 'Berhasil masuk. Selamat belajar!')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Terjadi kesalahan. Silakan coba lagi.')
      setLoading(false)
    }
  }

  const switchMode = () => {
    setMode(isRegister ? 'login' : 'register')
    setFieldErrors({})
    setMessage('')
  }

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
            <span className="form-kicker">{isRegister ? 'MULAI PETUALANGANMU' : 'SENANG BERTEMU KEMBALI'}</span>
            <h2 id="auth-title">{isRegister ? 'Buat akun baru' : 'Selamat Datang Kembali!'}</h2>
            <p className="form-subtitle">{isRegister ? 'Siapkan profilmu dan mulai eksplorasi dunia kimia.' : 'Masuk untuk memulai pengalaman belajar kimia yang lebih interaktif.'}</p>

            <form onSubmit={handleSubmit} noValidate>
              {isRegister && (
                <Field
                  label="Nama lengkap"
                  id="name"
                  value={form.name}
                  onChange={updateField}
                  placeholder="Nama yang biasa kamu gunakan"
                  autoComplete="name"
                  error={fieldErrors.name}
                  maxLength={80}
                />
              )}
              {!isRegister && (
                <Field
                  label="Nama lengkap"
                  id="name"
                  value={form.name}
                  onChange={updateField}
                  placeholder="Masukkan nama akunmu"
                  autoComplete="name"
                  error={fieldErrors.name}
                  maxLength={80}
                />
              )}
              <Field
                label="Email"
                id="email"
                type="email"
                value={form.email}
                onChange={updateField}
                placeholder="nama@email.com"
                autoComplete="email"
                error={fieldErrors.email}
              />
              {isRegister && (
                <Field
                  label="Kelas"
                  id="className"
                  value={form.className}
                  onChange={updateField}
                  placeholder="Contoh: X-A atau X IPA 1"
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
                placeholder={isRegister ? 'Minimal 8 karakter' : 'Masukkan password'}
                autoComplete={isRegister ? 'new-password' : 'current-password'}
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

              {!isRegister && (
                <label className="remember-control">
                  <input type="checkbox" checked={remember} onChange={(event) => setRemember(event.target.checked)} />
                  <span className="custom-checkbox" aria-hidden="true" />
                  Ingat Saya
                </label>
              )}

              {message && <div className="auth-message" role="alert">{message}</div>}

              <button className="auth-submit" type="submit" disabled={loading}>
                {loading
                  ? <><span className="button-spinner" /> Memproses...</>
                  : <><span className="auth-submit-label">{isRegister ? 'Buat Akun & Mulai' : 'Masuk ke Pembelajaran'}</span><span className="auth-submit-icon" aria-hidden="true">↗</span></>}
              </button>
            </form>

            <div className="auth-switch">
              {isRegister ? 'Sudah memiliki akun?' : 'Belum memiliki akun?'}
              <button type="button" onClick={switchMode}>{isRegister ? 'Masuk Sekarang' : 'Daftar Sekarang'}</button>
            </div>

            <p className="prototype-note"><span aria-hidden="true">ⓘ</span> Prototipe pembelajaran. Data akun tersimpan di perangkat ini.</p>
          </div>
          <footer className="auth-footer"><span>© 2026 CHEMISTRY LAB</span><span>Dibuat untuk pembelajar masa depan.</span></footer>
        </section>
      </div>
    </main>
  )
}
