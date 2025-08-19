import { voteComment, listComments } from '../services/commentService.js'
import { useState } from 'react'

export default function CommentList({ user, items, levelId, sort = 'new', onVoted }) {
  const [busy, setBusy] = useState(null)
  const [localVotes, setLocalVotes] = useState({})   // { [commentId]: { myVote, votes } }
  const [revealedBodies, setRevealedBodies] = useState({}) // { [commentId]: fullBody }

  const displayVote = (c) => {
    const local = localVotes[c._id]
    return {
      myVote: local?.myVote ?? c.myVote ?? 0,
      votes:  local?.votes  ?? c.votes  ?? 0
    }
  }

  async function sendVote(c, nextVal) {
    try {
      setBusy(c._id)
      const { myVote } = displayVote(c)
      const desired = (myVote === nextVal) ? 0 : nextVal // toggle off if same button
      const resp = await voteComment(c._id, desired)
      setLocalVotes(prev => ({ ...prev, [c._id]: { myVote: resp.myVote, votes: resp.votes } }))
      onVoted && onVoted()
    } finally {
      setBusy(null)
    }
  }

  // Reveal only one masked comment by fetching the revealed list once and pulling that body's text
  async function revealOne(id) {
    try {
      setBusy(id)
      const resp = await listComments(levelId, sort, true) // reveal=1
      const found = (resp?.comments || []).find(c => c._id === id)
      if (found && !found.masked && found.body) {
        setRevealedBodies(prev => ({ ...prev, [id]: found.body }))
      } else {
        setRevealedBodies(prev => ({ ...prev, [id]: '' }))
      }
    } finally {
      setBusy(null)
    }
  }

  return (
    <div className="col" style={{ gap: 12 }}>
      {items.map(c => {
        const isMaskedFromServer = !!c.masked
        const hasLocalReveal = Object.prototype.hasOwnProperty.call(revealedBodies, c._id)
        const isMasked = isMaskedFromServer && !hasLocalReveal

        const text = isMasked
          ? (c.preview || '')
          : (hasLocalReveal ? (revealedBodies[c._id] || c.body || '') : (c.body || ''))

        const { myVote, votes } = displayVote(c)

        return (
          <div key={c._id} className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ color: 'var(--muted)', fontSize: 13 }}>
                {c.author?.displayName || 'Unknown'}
              </div>

              <div className="row" style={{ alignItems: 'center', gap: 8 }}>
                <div style={{ fontSize: 12, color: 'var(--muted)' }}>▲ {votes}</div>
                {user && (
                  <>
                    <button
                      className={`btn ${myVote === 1 ? 'primary' : ''}`}
                      disabled={busy === c._id}
                      onClick={() => sendVote(c, 1)}
                    >
                      Upvote
                    </button>
                    <button
                      className={`btn ${myVote === -1 ? 'primary' : ''}`}
                      disabled={busy === c._id}
                      onClick={() => sendVote(c, -1)}
                    >
                      Downvote
                    </button>
                  </>
                )}
              </div>
            </div>

            {isMasked ? (
              <div style={{
                background: 'rgba(255,200,0,0.08)',
                border: '1px dashed rgba(180,140,0,0.6)',
                padding: 10,
                borderRadius: 8,
                marginTop: 8,
                whiteSpace: 'pre-wrap'
              }}>
                Spoiler hidden — {text}
                <div style={{ marginTop: 8 }}>
                  <button
                    className="btn"
                    disabled={busy === c._id}
                    onClick={() => revealOne(c._id)}
                  >
                    Show spoiler
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ whiteSpace: 'pre-wrap', marginTop: 8 }}>
                {text}
              </div>
            )}
          </div>
        )
      })}
      {items.length === 0 && <div className="card">No comments yet.</div>}
      {!user && <div className="card" style={{ color: 'var(--muted)' }}>Login to vote or post.</div>}
    </div>
  )
}
