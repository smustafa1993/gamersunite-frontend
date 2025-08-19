import { useEffect, useMemo, useState, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getLevel } from '../services/levelService.js'
import { listComments } from '../services/commentService.js'
import CommentList from '../components/CommentList.jsx'
import CommentForm from '../components/CommentForm.jsx'

export default function LevelDetailPage({ user }) {
  const { levelId } = useParams()
  const [level, setLevel] = useState(null)
  const [comments, setComments] = useState([])
  const [meta, setMeta] = useState({ levelNumber: 0, userLevel: 0, prefsMode: 'auto', reveal: false })
  const [showSpoilers, setShowSpoilers] = useState(false)
  const [sort, setSort] = useState('new')
  const token = useMemo(() => localStorage.getItem('token') || '', [])

  const load = useCallback(async () => {
    const [lvl, resp] = await Promise.all([
      getLevel(levelId),
      listComments(levelId, sort, showSpoilers)
    ])
    setLevel(lvl)
    setComments(resp?.comments || [])
    setMeta({
      levelNumber: resp?.levelNumber ?? 0,
      userLevel: resp?.userLevel ?? 0,
      prefsMode: resp?.prefsMode ?? 'auto',
      reveal: !!resp?.reveal
    })
  }, [levelId, sort, showSpoilers])

  useEffect(() => { load() }, [load])

  if (!level) return <div className="card">Loading…</div>

  return (
    <div className="col" style={{ gap: 16 }}>
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
          <div>
            <h2 style={{ margin: 0 }}>{level.title}</h2>
            <div style={{ color: 'var(--muted)', fontSize: 13, marginTop: 4 }}>
              <Link to={`/games/${level.game?._id || level.game}`}>Back to game</Link>
              <span> · Level {meta.levelNumber} · Your progress: {meta.userLevel} · Mode: {meta.prefsMode}</span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div className="row" style={{ alignItems: 'center', gap: 8 }}>
              <label htmlFor="sort" className="link">Sort</label>
              <select
                id="sort"
                value={sort}
                onChange={e => setSort(e.target.value)}
                style={{ padding: '4px 8px' }}
              >
                <option value="new">Newest</option>
                <option value="top">Top</option>
              </select>
            </div>
            <div className="row" style={{ alignItems: 'center', gap: 8 }}>
              <input
                id="spoilers"
                type="checkbox"
                checked={showSpoilers}
                onChange={e => setShowSpoilers(e.target.checked)}
              />
              <label htmlFor="spoilers" className="link">Show spoilers</label>
            </div>
          </div>
        </div>

        {level.summary && (
          <p style={{ whiteSpace: 'pre-wrap', marginTop: 8 }}>{level.summary}</p>
        )}
      </div>

      {user && <CommentForm levelId={levelId} onPosted={load} />}

      <CommentList
        user={user}
        items={comments}
        levelId={levelId}     // pass through for per-comment reveal
        sort={sort}           // pass through for per-comment reveal
        onVoted={load}
        onReported={load}
      />
    </div>
  )
}
