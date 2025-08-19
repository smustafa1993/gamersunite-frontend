import { useEffect, useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Header from './components/Header.jsx'
import HomePage from './pages/HomePage.jsx'
import GameDetailPage from './pages/GameDetailPage.jsx'
import LevelDetailPage from './pages/LevelDetailPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import RegisterPage from './pages/RegisterPage.jsx'
import ProfilePage from './pages/ProfilePage.jsx'
import { authMe } from './services/authService.js'

function PrivateRoute({ user, children }) {
  return user ? children : <Navigate to="/profile" replace />
}

export default function App() {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(() => localStorage.getItem('token') || '')

  // keep axios header via services/api interceptor reading localStorage
  useEffect(() => {
    if (!token) { setUser(null); return }
    authMe(token)
      .then(res => setUser(res?.user || null))
      .catch(() => { setUser(null); setToken(''); localStorage.removeItem('token') })
  }, [token])

  const handleLogin = (t, u) => {
    localStorage.setItem('token', t)
    setToken(t)
    setUser(u)
  }
  const handleLogout = () => {
    localStorage.removeItem('token')
    setToken('')
    setUser(null)
  }

  return (
    <>
      <div className="header">
        <div className="container header-wrap">
          <Header user={user} onLogout={handleLogout} />
        </div>
      </div>
      <div className="container" style={{ paddingTop: 16 }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/games/:slug" element={<GameDetailPage user={user} />} />
          <Route path="/levels/:levelId" element={<LevelDetailPage user={user} />} />
          <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
          <Route path="/register" element={<RegisterPage onLogin={handleLogin} />} />
          <Route path="/profile" element={
            <PrivateRoute user={user}><ProfilePage user={user} /></PrivateRoute>
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </>
  )
}
