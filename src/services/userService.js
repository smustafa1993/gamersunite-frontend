import api from './api'

export async function getMe() {
  const { data } = await api.get('/auth/me')
  return data
}

export async function updateMe(payload) {
  const { data } = await api.put('/auth/me', payload)
  return data
}

export async function getMyProgress() {
  const { data } = await api.get('/progress')
  return data
}
