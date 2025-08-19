import { Link } from 'react-router-dom'

export default function GameCard({ game }) {
  return (
    <div className="card">
      <div style={{aspectRatio:'16/9', background:'#0c0f14', borderRadius:10, marginBottom:12, overflow:'hidden'}}>
        {game.coverUrl ? (
          <img src={game.coverUrl} alt={game.title} style={{width:'100%', height:'100%', objectFit:'cover'}} />
        ) : (
          <div className="skeleton" style={{height:'100%'}} />
        )}
      </div>
      <div className="col">
        <strong>{game.title}</strong>
        <div style={{color:'var(--muted)', fontSize:13}}>{(game.genres||[]).join(' · ')}</div>
        <Link to={`/games/${game.slug}`} className="btn" style={{marginTop:8}}>Open</Link>
      </div>
    </div>
  )
}
