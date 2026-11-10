import { useState, useEffect } from 'react'
import AuthPage from './components/AuthPage.jsx'
import Home from './Home.jsx'
import TeacherDashboard from './components/TeacherDashboard.jsx'
import JoinClassModal from './components/JoinClassModal.jsx'
import { getCurrentUser, logoutUser, subscribeToAuth } from './auth.js'

function App() {
  const [session, setSession] = useState(() => {
    try {
      return { user: getCurrentUser(), error: '' }
    } catch (error) {
      return {
        user: null,
        error: error instanceof Error ? error.message : 'Sesi tidak dapat dibaca.',
      }
    }
  })
  const [notice, setNotice] = useState('')
  const [showTeacherDashboard, setShowTeacherDashboard] = useState(false)
  const [showJoinClassModal, setShowJoinClassModal] = useState(false)

  useEffect(() => {
    const unsubscribe = subscribeToAuth((firebaseUser) => {
      if (firebaseUser) {
        setSession({ user: firebaseUser, error: '' })
      }
    })
    return () => unsubscribe()
  }, [])

  const handleAuthenticated = (user, message) => {
    setSession({ user, error: '' })
    setNotice(message)
  }

  const handleLogout = () => {
    try {
      logoutUser()
      setSession({ user: null, error: '' })
      setNotice('')
      setShowTeacherDashboard(false)
      setShowJoinClassModal(false)
    } catch {
      setNotice('Sesi tidak dapat dihapus. Silakan tutup tab ini untuk mengakhiri sesi.')
    }
  }

  const handleClassUpdated = (updatedUser) => {
    setSession((prev) => ({
      ...prev,
      user: { ...prev.user, ...updatedUser }
    }))
    setNotice(`Status kelas diperbarui: ${updatedUser.classCode || 'Keluar dari kelas'}`)
  }

  if (!session.user) {
    return <AuthPage onAuthenticated={handleAuthenticated} initialError={session.error} />
  }

  const user = session.user
  const isGuest = user.isGuest || user.role === 'guest'
  const isTeacher = user.role === 'teacher'
  const isStudent = user.role === 'student' || (!isGuest && !isTeacher)

  return (
    <div className="learning-dashboard">
      <div className="session-bar">
        <span className="session-greeting">
          <span className="session-avatar">{user.name.charAt(0).toUpperCase()}</span>
          <span>
            Halo, <strong>{user.name}</strong>
            {user.username && <small style={{ marginLeft: '4px', opacity: 0.75 }}>({user.username})</small>}
            {user.className && !isGuest && ` · ${user.className}`}
          </span>

          {/* Label Hak Akses & Status Kelas */}
          {isGuest && (
            <span className="role-pill guest" title="Akun tamu: Data tersimpan lokal di perangkat ini">
              👤 Akun Tamu
            </span>
          )}
          {isTeacher && (
            <span className="role-pill teacher" title="Akun Pengajar: Akses penuh ke panel kelas">
              👨‍🏫 Guru Pengajar
            </span>
          )}
          {isStudent && user.classCode && (
            <span className="role-pill class-member" title={`Tergabung di kelas ${user.classCode}`}>
              🏫 Kelas: {user.classCode}
            </span>
          )}
          {isStudent && !user.classCode && (
            <span className="role-pill registered" title="Akun mandiri (belum terhubung ke kelas guru)">
              🎓 Siswa Mandiri
            </span>
          )}
        </span>

        <div className="session-actions">
          {notice && <span className="session-notice" role="status">{notice}</span>}

          {/* Tombol Khusus Guru: Panel Guru */}
          {isTeacher && (
            <button
              type="button"
              className="session-teacher-btn"
              onClick={() => setShowTeacherDashboard(true)}
              title="Buka dashboard rekapitulasi nilai dan siswa kelas"
            >
              🏫 Panel Guru
            </button>
          )}

          {/* Tombol Khusus Siswa: Gabung Kelas */}
          {isStudent && (
            <button
              type="button"
              className="session-join-btn"
              onClick={() => setShowJoinClassModal(true)}
              title="Masukkan kode kelas dari gurumu"
            >
              {user.classCode ? 'Pengaturan Kelas' : '+ Gabung Kelas'}
            </button>
          )}

          {/* Tombol Tamu: Beralih ke Akun Resmi */}
          {isGuest ? (
            <button
              type="button"
              className="session-login-switch-btn"
              onClick={handleLogout}
              title="Masuk atau buat akun resmi agar riwayat tersimpan di cloud"
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

      {/* Main Learning Website */}
      <Home user={session.user} />

      {/* Modal / Halaman Khusus Panel Guru */}
      {showTeacherDashboard && isTeacher && (
        <TeacherDashboard
          user={session.user}
          onClose={() => setShowTeacherDashboard(false)}
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
