import { useState } from 'react'
import { login as apiLogin } from '../services/authService.js'
import { useNavigate, Link } from 'react-router-dom'

export default function LoginPage({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState('')
  const nav = useNavigate()

  async function submit(e) {
    e.preventDefault()
    setErr('')
    try {
      const { token, user } = await apiLogin(email, password)
      onLogin(token, user)
      nav('/')
    } catch (e) {
      setErr(e?.response?.data?.error || 'Login failed')
    }
  }

  return (
    <form onSubmit={submit} className="card" style={{maxWidth:420, margin:'0 auto'}}>
      <h2>Login</h2>
      <div className="col">
        <input className="input" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input className="input" type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
        {err && <div style={{color:'#f87171'}}>{err}</div>}
        <button className="btn">Login</button>
        <div className="row" style={{justifyContent:'space-between'}}>
          <span className="link"><Link to="/register">Create account</Link></span>
        </div>
      </div>
    </form>
  )
}
