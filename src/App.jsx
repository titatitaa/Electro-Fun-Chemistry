import { useState } from 'react'
import AuthPage from './components/AuthPage.jsx'
import Home from './Home.jsx'
import { getCurrentUser, logoutUser } from './auth.js'

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

  const handleAuthenticated = (user, message) => {
    setSession({ user, error: '' })
    setNotice(message)
  }

  const handleLogout = () => {
    try {
      logoutUser()
      setSession({ user: null, error: '' })
      setNotice('')
    } catch {
      setNotice('Sesi tidak dapat dihapus. Silakan tutup tab ini untuk mengakhiri sesi.')
    }
  }

  if (!session.user) {
    return <AuthPage onAuthenticated={handleAuthenticated} initialError={session.error} />
  }

  return (
    <div className="learning-dashboard">
      <div className="session-bar">
        <span className="session-greeting">
          <span className="session-avatar">{session.user.name.charAt(0).toUpperCase()}</span>
          <span>Halo, <strong>{session.user.name}</strong>{session.user.className ? ` · Kelas ${session.user.className}` : ''}</span>
        </span>
        <div className="session-actions">
          {notice && <span className="session-notice" role="status">{notice}</span>}
          <button type="button" onClick={handleLogout}>Keluar <span aria-hidden="true">↗</span></button>
        </div>
      </div>
      <Home user={session.user} />
    </div>
  )
}

export default App
