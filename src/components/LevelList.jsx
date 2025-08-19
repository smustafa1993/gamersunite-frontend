import { Link } from 'react-router-dom'

export default function LevelList({ levels }) {
  return (
    <div className="card" style={{ minWidth: 260 }}>
      <strong>Levels</strong>
      <div className="col" style={{ marginTop: 8 }}>
        {levels.map(l => (
          <Link key={l._id} to={`/levels/${l._id}`} className="link">
            #{l.number} — {l.title}
          </Link>
        ))}
        {levels.length === 0 && <span className="muted">No levels yet.</span>}
      </div>
    </div>
  )
}
