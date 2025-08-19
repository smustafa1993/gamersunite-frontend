import { useEffect, useState } from 'react'
import { getMe, updateMe, getMyProgress } from '../services/userService.js'
import { listGames } from '../services/gameService.js'
import { setProgress } from '../services/progressService.js'

export default function ProfilePage() {
  // profile + prefs
  const [me, setMe] = useState(null)
  const [form, setForm] = useState({ displayName: '', spoilerMode: 'auto' })
  const [saving, setSaving] = useState(false)
  const [saveMsg, setSaveMsg] = useState('')
  const [saveErr, setSaveErr] = useState('')

  // progress list
  const [progress, setProgressList] = useState([])

  // set-progress controls
  const [games, setGames] = useState([])
  const [selectedGame, setSelectedGame] = useState('')
  const [levelNumber, setLevelNumber] = useState('')
  const [progMsg, setProgMsg] = useState('')
  const [progErr, setProgErr] = useState('')

  // initial load
  useEffect(() => {
    (async () => {
      try {
        const [user, pg] = await Promise.all([getMe(), getMyProgress()])
        setMe(user)
        setProgressList(pg?.progress || [])
        setForm({
          displayName: user?.displayName || '',
          spoilerMode: user?.prefs?.spoilerMode || 'auto'
        })
      } catch (err) {
        console.error('Failed to load profile/progress', err)
      }
    })()

    listGames().then(setGames).catch(err => {
      console.error('Failed to list games', err)
      setGames([])
    })
  }, [])

  async function saveProfile() {
    setSaving(true)
    setSaveMsg('')
    setSaveErr('')
    try {
      const updated = await updateMe(form)
      setMe(updated)
      setSaveMsg('Saved.')
      setTimeout(() => setSaveMsg(''), 2000)
    } catch (err) {
      console.error('updateMe failed', err)
      setSaveErr('Could not save profile.')
    } finally {
      setSaving(false)
    }
  }

  async function saveProgress() {
    setProgMsg('')
    setProgErr('')
    try {
      if (!selectedGame) {
        setProgErr('Pick a game first.')
        return
      }
      const n = Number(levelNumber)
      if (!Number.isInteger(n) || n < 0) {
        setProgErr('Enter a valid non-negative level number.')
        return
      }

      await setProgress(selectedGame, n)

      const pg = await getMyProgress()
      setProgressList(pg?.progress || [])
      setProgMsg('Progress updated.')
      setTimeout(() => setProgMsg(''), 2000)
    } catch (err) {
      console.error('setProgress failed', err)
      setProgErr('Could not update progress.')
    }
  }

  if (!me) return <div className="card">Loading…</div>

  return (
    <div className="col" style={{ gap: 16 }}>
      {/* Profile + prefs */}
      <div className="card">
        <h2 style={{ marginTop: 0 }}>Profile</h2>

        <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: 12 }}>
          <div>Email</div>
          <div style={{ alignSelf: 'center' }}>{me.email}</div>

          <div>Display name</div>
          <div>
            <input
              className="input"
              value={form.displayName}
              onChange={(e) => setForm(f => ({ ...f, displayName: e.target.value }))}
              placeholder="Your display name"
            />
          </div>

          <div>Spoiler mode</div>
          <div>
            <select
              className="input"
              value={form.spoilerMode}
              onChange={(e) => setForm(f => ({ ...f, spoilerMode: e.target.value }))}
            >
              <option value="auto">Auto (mask above your progress)</option>
              <option value="always_show">Always show</option>
              <option value="always_hide">Always hide</option>
            </select>
          </div>
        </div>

        <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 12 }}>
          <button className="btn primary" disabled={saving} onClick={saveProfile}>
            Save
          </button>
          {saveMsg && <span style={{ color: '#22c55e', fontSize: 13 }}>{saveMsg}</span>}
          {saveErr && <span style={{ color: '#ef4444', fontSize: 13 }}>{saveErr}</span>}
        </div>
      </div>

      {/* Set progress (no form submit; just a button click) */}
      <div className="card">
        <h3 style={{ marginTop: 0 }}>Set your progress</h3>

        <div className="row" style={{ gap: 8, flexWrap: 'wrap' }}>
          <select
            className="input"
            value={selectedGame}
            onChange={(e) => setSelectedGame(e.target.value)}
            style={{ minWidth: 260 }}
          >
            <option value="">Select a game…</option>
            {games.map(g => (
              <option key={g._id} value={g._id}>{g.title}</option>
            ))}
          </select>

          <input
            className="input"
            type="number"
            min="0"
            inputMode="numeric"
            placeholder="Highest level number reached"
            value={levelNumber}
            onChange={(e) => setLevelNumber(e.target.value)}
            style={{ width: 220 }}
          />

          <button className="btn" type="button" onClick={saveProgress}>Save</button>
          {progMsg && <span style={{ color: '#22c55e', fontSize: 13 }}>{progMsg}</span>}
          {progErr && <span style={{ color: '#ef4444', fontSize: 13 }}>{progErr}</span>}
        </div>
      </div>

      {/* Progress list */}
      <div className="card">
        <h3 style={{ marginTop: 0 }}>Your game progress</h3>
        {progress.length === 0 && <div>No progress yet.</div>}
        {progress.map((p) => (
          <div
            key={p.gameId}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '6px 0',
              borderBottom: '1px solid var(--border)'
            }}
          >
            <div>{p.gameTitle}</div>
            <div>Current level: {p.levelNumber}</div>
          </div>
        ))}
      </div>
    </div>
  )
}