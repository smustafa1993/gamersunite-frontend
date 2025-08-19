import { useState } from 'react'
import { addComment } from '../services/commentService.js'

export default function CommentForm({ levelId, onPosted }) {
  const [body, setBody] = useState('')
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState('')

  async function submit(e) {
    e.preventDefault()
    setErr('')
    if (!body.trim()) return
    setLoading(true)
    try {
      const created = await addComment(levelId, body)
      setBody('')
      onPosted?.(created)
    } catch (e) {
      setErr(e?.response?.data?.error || 'Failed to post')
    } finally { setLoading(false) }
  }

  return (
    <form onSubmit={submit} className="card">
      <div className="col">
        <textarea className="input" rows={4} placeholder="Share your strategy..."
          value={body} onChange={e=>setBody(e.target.value)} />
        {err && <div style={{color:'#f87171'}}>{err}</div>}
        <button className="btn" disabled={loading}>{loading ? 'Posting...' : 'Post Comment'}</button>
      </div>
    </form>
  )
}
