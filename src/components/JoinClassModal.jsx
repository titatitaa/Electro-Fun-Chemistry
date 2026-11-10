import { useState } from 'react'
import { joinClass, leaveClass, DEFAULT_CLASS_CODE } from '../auth.js'
import './JoinClassModal.css'

export default function JoinClassModal({ user, onClose, onClassUpdated }) {
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleJoin = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    if (!code.trim()) {
      setError('Masukkan kode kelas yang diberikan oleh gurumu.')
      return
    }

    setLoading(true)
    try {
      const updatedUser = await joinClass(user.id, code.trim())
      setSuccess(`Berhasil bergabung ke kelas ${updatedUser.classCode}!`)
      onClassUpdated?.(updatedUser)
      setTimeout(() => {
        onClose()
      }, 1200)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal bergabung ke kelas.')
    } finally {
      setLoading(false)
    }
  }

  const handleLeave = async () => {
    if (window.confirm('Apakah kamu yakin ingin keluar dari kelas ini?')) {
      setLoading(true)
      try {
        const updated = await leaveClass(user.id)
        onClassUpdated?.(updated)
        onClose()
      } catch (err) {
        setError('Gagal keluar dari kelas.')
      } finally {
        setLoading(false)
      }
    }
  }

  return (
    <div className="join-class-backdrop" role="dialog" aria-modal="true">
      <div className="join-class-card">
        <div className="join-class-header">
          <span className="join-class-icon" aria-hidden="true">🏫</span>
          <h2>{user?.classCode ? 'Pengaturan Kelas Kimia' : 'Gabung Kelas Kimia'}</h2>
          <button type="button" className="join-class-close" onClick={onClose} aria-label="Tutup">✕</button>
        </div>

        {user?.classCode ? (
          <div className="joined-class-info">
            <p>Saat ini kamu telah terdaftar sebagai siswa pada:</p>
            <div className="class-badge-display">
              <span className="class-label">Kode Kelas:</span>
              <strong className="class-code-text">{user.classCode}</strong>
            </div>
            <p className="joined-class-desc">
              Hasil pengerjaan kuis dan latihanmu otomatis tersinkron ke dashboard guru pengajar.
            </p>
            <div className="join-class-actions" style={{ marginTop: '1.25rem' }}>
              <button
                type="button"
                className="btn-danger-outline"
                onClick={handleLeave}
                disabled={loading}
              >
                Keluar dari Kelas
              </button>
              <button type="button" className="btn-secondary" onClick={onClose}>
                Tutup
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleJoin} className="join-class-form">
            <p className="join-class-desc">
              Masukkan kode kelas yang diberikan oleh gurumu agar hasil pengerjaan kuis dan evaluasimu dapat tercatat langsung di rekapitulasi nilai guru.
            </p>

            <div className="join-class-input-group">
              <label htmlFor="classCodeInput">Kode Kelas Guru</label>
              <input
                id="classCodeInput"
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder={`Contoh: ${DEFAULT_CLASS_CODE}`}
                maxLength={20}
                autoFocus
              />
              <small className="class-hint">
                💡 Tip demo: Gunakan kode <strong>{DEFAULT_CLASS_CODE}</strong> untuk bergabung ke kelas Kimia Fase E.
              </small>
            </div>

            {error && <div className="join-class-alert error" role="alert">{error}</div>}
            {success && <div className="join-class-alert success" role="alert">{success}</div>}

            <div className="join-class-actions">
              <button type="button" className="btn-secondary" onClick={onClose} disabled={loading}>
                Batal
              </button>
              <button type="submit" className="btn-primary" disabled={loading || !code.trim()}>
                {loading ? 'Memverifikasi...' : 'Gabung Kelas →'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

