import { useEffect, useState } from 'react'
import { listGames } from '../services/gameService.js'
import GameCard from '../components/GameCard.jsx'

export default function HomePage() {
  const [q, setQ] = useState('')
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchData() }, [])
  async function fetchData(search='') {
    setLoading(true)
    const data = await listGames(search)
    setItems(data)
    setLoading(false)
  }

  return (
    <div className="col" style={{ gap:16 }}>
      <div className="row">
        <input className="input" placeholder="Search games…" value={q} onChange={e=>setQ(e.target.value)} />
        <button className="btn" onClick={()=>fetchData(q)}>Search</button>
      </div>
      {loading ? (
        <div className="grid games">
          {Array.from({length:8}).map((_,i)=><div key={i} className="card"><div className="skeleton" style={{height:140}}/></div>)}
        </div>
      ) : (
        <div className="grid games">
          {items.map(g => <GameCard key={g._id} game={g} />)}
        </div>
      )}
    </div>
  )
}
