import api from './api'

export async function register(email, password, displayName) {
  const { data } = await api.post('/auth/register', { email, password, displayName })
  return data
}
export async function login(email, password) {
  const { data } = await api.post('/auth/login', { email, password })
  return data
}
export async function authMe(tokenIn) {
  const { data } = await api.get('/auth/me', {
    headers: tokenIn ? { Authorization: `Bearer ${tokenIn}` } : undefined
  })
  return data
}
