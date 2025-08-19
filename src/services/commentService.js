import api from './api'

export async function listComments(levelId, sort='new', reveal=false) {
  const { data } = await api.get(`/comments/level/${levelId}`, {
    params: { sort, reveal: reveal ? 1 : 0 }
  })
  return data
}

export async function addComment(levelId, body) {
  const { data } = await api.post(`/comments/level/${levelId}`, { body })
  return data
}

// value between {-1, 0, 1}
export async function voteComment(id, value) {
  const { data } = await api.post(`/comments/${id}/vote`, { value })
  return data
}

// still available on API, but we remove the UI for now
export async function reportComment(id, reason) {
  const { data } = await api.post(`/comments/${id}/report`, { reason })
  return data
}
