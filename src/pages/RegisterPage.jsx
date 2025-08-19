import { useState } from 'react'
import { register as apiRegister } from '../services/authService.js'
import { useNavigate, Link } from 'react-router-dom'

export default function RegisterPage({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [err, setErr] = useState('')
  const nav = useNavigate()

  async function submit(e) {
    e.preventDefault()
    setErr('')
    try {
      const { token, user } = await apiRegister(email, password, displayName)
      onLogin(token, user)
      nav('/')
    } catch (e) {
      setErr(e?.response?.data?.error || 'Registration failed')
    }
  }

  return (
    <form onSubmit={submit} className="card" style={{maxWidth:420, margin:'0 auto'}}>
      <h2>Create Account</h2>
      <div className="col">
        <input className="input" placeholder="Display name" value={displayName} onChange={e=>setDisplayName(e.target.value)} />
        <input className="input" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input className="input" type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
        {err && <div style={{color:'#f87171'}}>{err}</div>}
        <button className="btn">Register</button>
        <div className="row" style={{justifyContent:'space-between'}}>
          <span className="link"><Link to="/login">Already have an account</Link></span>
        </div>
      </div>
    </form>
  )
}
