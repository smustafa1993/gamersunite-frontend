import { Link, useNavigate } from 'react-router-dom'

export default function Header({ user, onLogout }) {
  const nav = useNavigate()
  return (
    <>
      <Link to="/" className="brand">GamersUnite</Link>
      <div className="nav-spacer" />
      {user ? (
        <div className="row">
          <span className="link">Hi, {user.displayName}</span>
          <Link className="link" to="/profile">Profile</Link>
          <button className="btn secondary" onClick={() => { onLogout(); nav('/'); }}>Logout</button>
        </div>
      ) : (
        <div className="row">
          <Link className="link" to="/login">Login</Link>
          <Link className="btn" to="/register">Sign Up</Link>
        </div>
      )}
    </>
  )
}
