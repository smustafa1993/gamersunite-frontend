import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getGame } from '../services/gameService.js'
import { createLevel } from '../services/levelService.js'
import LevelList from '../components/LevelList.jsx'

export default function GameDetailPage({ user }) {
  const { slug } = useParams()
  const [data, setData] = useState(null)
  const [form, setForm] = useState({ number:'', title:'', summary:'' })
  const [err, setErr] = useState('')

  useEffect(() => { load() }, [slug])
  async function load() { const res = await getGame(slug); setData(res) }

  async function addLevel(e) {
    e.preventDefault()
    setErr('')
    try {
      await createLevel(data.game._id, {
        number: Number(form.number), title: form.title, summary: form.summary
      })
      setForm({ number:'', title:'', summary:'' })
      load()
    } catch (e) { setErr(e?.response?.data?.error || 'Failed to create level') }
  }

  if (!data) return <div className="card">Loading…</div>
  const { game, levels } = data

  return (
    <div className="grid" style={{ gridTemplateColumns:'300px 1fr', alignItems:'start' }}>
      <LevelList levels={levels} />
      <div className="col" style={{ gap:16 }}>
        <div className="card">
          <div className="row" style={{ gap:16 }}>
            <div style={{width:220, aspectRatio:'16/9', overflow:'hidden', borderRadius:10, background:'#0c0f14'}}>
              {game.coverUrl ? <img src={game.coverUrl} alt={game.title} style={{width:'100%', height:'100%', objectFit:'cover'}}/> : <div className="skeleton" style={{height:'100%'}}/>}
            </div>
            <div className="col">
              <h2 style={{margin:'4px 0 6px 0'}}>{game.title}</h2>
              <div style={{color:'var(--muted)'}}>{(game.genres||[]).join(' · ')}</div>
              <div style={{color:'var(--muted)'}}>{(game.platforms||[]).join(' · ')}</div>
            </div>
          </div>
        </div>

        {user ? (
          <form onSubmit={addLevel} className="card">
            <strong>Add Level</strong>
            <div className="row">
              <input className="input" placeholder="Number" value={form.number} onChange={e=>setForm(s=>({...s, number:e.target.value}))}/>
              <input className="input" placeholder="Title" value={form.title} onChange={e=>setForm(s=>({...s, title:e.target.value}))}/>
            </div>
            <textarea className="input" rows={3} placeholder="Summary (optional)" value={form.summary} onChange={e=>setForm(s=>({...s, summary:e.target.value}))}/>
            {err && <div style={{color:'#f87171'}}>{err}</div>}
            <button className="btn">Create Level</button>
          </form>
        ) : (
          <div className="card" style={{color:'var(--muted)'}}>Login to add levels.</div>
        )}
      </div>
    </div>
  )
}
