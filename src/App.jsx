import { useEffect, useState } from 'react'
import AuthPage from './components/AuthPage.jsx'
import Home from './Home.jsx'
import TeacherDashboard from './components/TeacherDashboard.jsx'
import JoinClassModal from './components/JoinClassModal.jsx'
import { getCurrentUser, logoutUser, subscribeToAuth } from './auth.js'

function App() {
  const [session, setSession] = useState({ user: null, error: '', loading: true })
  const [notice, setNotice] = useState('')
  const [showTeacherDashboard, setShowTeacherDashboard] = useState(false)
  const [showJoinClassModal, setShowJoinClassModal] = useState(false)

  useEffect(() => {
    let active = true
    getCurrentUser()
      .then((user) => {
        if (active) setSession({ user, error: '', loading: false })
      })
      .catch((error) => {
        if (active) {
          setSession({
            user: null,
            error: error instanceof Error ? error.message : 'Sesi tidak dapat dibaca.',
            loading: false,
          })
        }
      })

    const unsubscribe = subscribeToAuth((firebaseUser) => {
      if (active && firebaseUser) {
        setSession({ user: firebaseUser, error: '', loading: false })
      }
    })

    return () => {
      active = false
      if (typeof unsubscribe === 'function') unsubscribe()
    }
  }, [])

  const handleAuthenticated = (user, message) => {
    setSession({ user, error: '', loading: false })
    setNotice(message || '')
  }

  const handleLogout = async () => {
    try {
      await logoutUser()
      setSession({ user: null, error: '', loading: false })
      setNotice('')
      setShowTeacherDashboard(false)
      setShowJoinClassModal(false)
    } catch {
      setNotice('Sesi tidak dapat dihapus. Silakan coba lagi.')
    }
  }

  const handleClassUpdated = (updatedUser) => {
    setSession((prev) => ({
      ...prev,
      user: { ...prev.user, ...updatedUser },
    }))
    setNotice(`Status kelas diperbarui: ${updatedUser.classCode ? `Tergabung di ${updatedUser.classCode}` : 'Keluar dari kelas'}`)
  }

  if (session.loading) {
    return (
      <main className="session-loading" aria-live="polite" style={{ padding: '3rem', textAlign: 'center' }}>
        Memeriksa sesi pembelajaran...
      </main>
    )
  }

  if (!session.user) {
    return (
      <AuthPage
        onAuthenticated={handleAuthenticated}
        onPasswordReset={() => setNotice('Tautan pemulihan kata sandi telah dikirim.')}
        initialError={session.error}
      />
    )
  }

  const user = session.user
  const isGuest = user.isGuest || user.role === 'guest'
  const isTeacher = user.role === 'teacher'
  const isStudent = user.role === 'student' || (!isGuest && !isTeacher)

  return (
    <div className="learning-dashboard">
      {/* Session Top Bar */}
      <div className="session-bar">
        <span className="session-greeting">
          <span className="session-avatar" aria-hidden="true">
            {(user.name || 'S').charAt(0).toUpperCase()}
          </span>
          <span>
            Halo, <strong>{user.name}</strong>
            {user.username && <small style={{ marginLeft: '4px', opacity: 0.75 }}>({user.username})</small>}
            {user.className && !isGuest && ` · ${user.className}`}
          </span>

          {/* Label Hak Akses & Status Kelas */}
          {isGuest && (
            <span className="role-pill guest" title="Akun tamu: Data tersimpan lokal di browser ini">
              👤 Akun Tamu
            </span>
          )}

          {isTeacher && (
            <span
              className="role-pill teacher"
              style={{
                background: '#d1fae5',
                color: '#065f46',
                border: '1px solid #a7f3d0',
                padding: '2px 8px',
                borderRadius: '12px',
                fontWeight: '700',
                fontSize: '0.78rem',
              }}
              title="Akun Guru Pengajar resmi: Akses penuh ke Panel Guru"
            >
              👨‍🏫 Guru Pengajar
            </span>
          )}

          {isStudent && user.classCode && (
            <span
              className="role-pill class-member"
              style={{
                background: '#e0f2fe',
                color: '#0369a1',
                border: '1px solid #bae6fd',
                padding: '2px 8px',
                borderRadius: '12px',
                fontWeight: '700',
                fontSize: '0.78rem',
              }}
              title={`Tergabung di kelas ${user.classCode}`}
            >
              🏫 Kelas: {user.classCode}
            </span>
          )}

          {isStudent && !user.classCode && (
            <span
              className="role-pill registered"
              style={{
                background: '#f1f5f9',
                color: '#475569',
                border: '1px solid #e2e8f0',
                padding: '2px 8px',
                borderRadius: '12px',
                fontWeight: '600',
                fontSize: '0.78rem',
              }}
              title="Akun mandiri (belum terhubung ke kelas guru)"
            >
              🎓 Siswa Mandiri
            </span>
          )}
        </span>

        <div className="session-actions">
          {notice && <span className="session-notice" role="status">{notice}</span>}

          {/* Tombol Khusus Guru: 🏫 Panel Guru */}
          {isTeacher && (
            <button
              type="button"
              className="session-teacher-btn"
              onClick={() => setShowTeacherDashboard(true)}
              style={{
                background: '#203864',
                color: '#ffffff',
                border: 'none',
                padding: '0.45rem 0.95rem',
                borderRadius: '8px',
                fontWeight: '800',
                fontSize: '0.85rem',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                boxShadow: '0 2px 8px rgba(32, 56, 100, 0.2)',
              }}
              title="Buka Panel Guru untuk evaluasi dan analisis hasil belajar siswa"
            >
              🏫 Panel Guru
            </button>
          )}

          {/* Tombol Khusus Siswa: + Gabung Kelas */}
          {isStudent && (
            <button
              type="button"
              className="session-join-btn"
              onClick={() => setShowJoinClassModal(true)}
              style={{
                background: user.classCode ? '#f8fafc' : '#16a6a1',
                color: user.classCode ? '#203864' : '#ffffff',
                border: user.classCode ? '1px solid #cbd5e1' : 'none',
                padding: '0.45rem 0.85rem',
                borderRadius: '8px',
                fontWeight: '700',
                fontSize: '0.82rem',
                cursor: 'pointer',
              }}
              title="Masukkan kode kelas dari gurumu"
            >
              {user.classCode ? 'Pengaturan Kelas' : '+ Gabung Kelas'}
            </button>
          )}

          {/* Tombol Tamu / Logout */}
          {isGuest ? (
            <button
              type="button"
              onClick={handleLogout}
              title="Masuk atau buat akun resmi agar riwayat tersimpan"
            >
              Daftar / Masuk Akun
            </button>
          ) : (
            <button type="button" onClick={handleLogout} title="Keluar dari sesi akun saat ini">
              Keluar <span aria-hidden="true">↗</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Website ElectroFun Chemistry */}
      <Home
        user={session.user}
        onOpenTeacherDashboard={() => setShowTeacherDashboard(true)}
      />

      {/* Halaman / Modal Khusus Panel Guru (Role-Protected) */}
      {showTeacherDashboard && isTeacher && (
        <TeacherDashboard
          user={session.user}
          onClose={() => setShowTeacherDashboard(false)}
          onLogout={handleLogout}
        />
      )}

      {/* Modal Gabung Kelas untuk Siswa */}
      {showJoinClassModal && (
        <JoinClassModal
          user={session.user}
          onClose={() => setShowJoinClassModal(false)}
          onClassUpdated={handleClassUpdated}
        />
      )}
    </div>
  )
}

export default App
