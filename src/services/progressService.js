import api from './api'

// PUT /progress/:gameId  ->  { levelNumber }
export async function setProgress(gameId, levelNumber) {
  const n = Number(levelNumber)
  const { data } = await api.put(`/progress/${gameId}`, { levelNumber: n })
  return data
}
